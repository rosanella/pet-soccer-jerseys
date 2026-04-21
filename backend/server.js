const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Pool } = require('pg');
const path = require('path');
const { Resend } = require('resend');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());

// Stripe Webhook MUST be before express.json() to get raw body
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    try {
      // 1. Update Order Status to Paid
      const result = await pool.query(
        'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
        ['paid', orderId]
      );
      
      const order = result.rows[0];

      // 2. Send Confirmation Email to CUSTOMER
      await resend.emails.send({
        from: '4PUPPIES.CL <sales@4puppies.cl>',
        to: order.email,
        subject: `Order Confirmed! 🐾 Jersey for ${order.pet_name} is in production`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
            <h1 style="color: #2563eb; text-transform: uppercase;">Thank you for your order! 🐾</h1>
            <p>Hi ${order.customer_name},</p>
            <p>We've received your payment and our tailor is starting to work on your custom pet jersey.</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2563eb;">Order Summary:</h3>
              <p><b>Product:</b> ${order.product_name} (${order.size_key})</p>
              <p><b>Pet:</b> ${order.pet_name} (#${order.pet_number})</p>
              <p><b>Delivery Address:</b><br/>
                ${order.address}<br/>
                ${order.city}, ${order.region} ${order.zipcode}<br/>
                <b>${order.country}</b>
              </p>
            </div>

            <p style="background: #fffbeb; border: 1px solid #fef3c7; padding: 15px; border-radius: 10px; font-size: 13px; color: #92400e;">
              <b>Mistake in the info?</b> Please reply to this email or send us a <a href="https://wa.me/56958793900">WhatsApp message</a> immediately to correct it before production progresses.
            </p>

            <p><b>Next Step:</b> Preparation takes 8-10 business days. As soon as it's finished, you'll receive another email with your FedEx tracking number.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 11px; color: #94a3b8; text-align: center;">4PUPPIES.CL • WORLD CUP PET JERSEYS</p>
          </div>
        `
      });

      // 3. Send Notification to OWNER (Internal)
      await resend.emails.send({
        from: '4PUPPIES.CL <sales@4puppies.cl>',
        to: 'sales@4puppies.cl',
        subject: `NEW SALE! $${order.total} - ${order.customer_name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>🎉 New Sale #${order.id}</h2>
            <p><strong>Customer:</strong> ${order.customer_name} (${order.email})</p>
            <p><strong>Total:</strong> $${order.total} USD</p>
            <p><strong>Product:</strong> ${order.product_name} - ${order.size_key}</p>
            <br/>
            <p>Go to your <a href="${process.env.FRONTEND_URL || 'https://globalshop.4puppies.cl'}/admin-orders" style="background:#2563eb; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:bold;">Admin Dashboard</a> to process this order.</p>
          </div>
        `
      });

    } catch (err) {
      console.error('Order fulfillment error:', err);
    }
  }

  res.json({ received: true });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'diugehwky',
  api_key: process.env.CLOUDINARY_API_KEY || '145117342334454',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'MLYcfsRS-cbUZHr_exL2iTWHl44'
});

// Multer storage for temporary files
const upload = multer({ dest: 'uploads/' });

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Email engine (Resend)
const resend = new Resend(process.env.RESEND_API_KEY);

// Create tables if not exists
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name TEXT,
        address TEXT,
        city TEXT,
        region TEXT,
        zipcode TEXT,
        country TEXT,
        email TEXT,
        phone TEXT,
        product_name TEXT,
        pet_name TEXT,
        pet_number TEXT,
        size_key TEXT,
        total NUMERIC,
        status TEXT DEFAULT 'pending',
        tracking_number TEXT,
        shipped_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Ensure new columns exist
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS city TEXT;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS region TEXT;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS zipcode TEXT;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS country TEXT;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS abandoned_email_sent BOOLEAN DEFAULT FALSE;

      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        customer_name TEXT,
        comment TEXT,
        stars INTEGER,
        pet_image_url TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      -- Ensure the sequence starts at 100 if we are just starting out
      DO $$
      BEGIN
        IF (SELECT COUNT(*) FROM orders) < 5 THEN
          ALTER SEQUENCE orders_id_seq RESTART WITH 100;
        END IF;
      END $$;
    `);
    console.log('Database initialized');
    startAbandonedCartCron();
    startEnviaTrackingCron();
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};
initDb();

// Automated Abandoned Cart Recovery (Runs every 15 minutes)
const startAbandonedCartCron = () => {
  setInterval(async () => {
    try {
      const result = await pool.query(
        "SELECT * FROM orders WHERE status = 'pending' AND abandoned_email_sent = FALSE AND created_at < NOW() - INTERVAL '1 hour' AND created_at > NOW() - INTERVAL '24 hours'"
      );

      for (const order of result.rows) {
        await resend.emails.send({
          from: '4PUPPIES.CL <sales@4puppies.cl>',
          to: order.email,
          subject: `Did you forget something, ${order.customer_name}? 🐾`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
              <h1 style="color: #2563eb;">We saved your custom jersey! ⚽</h1>
              <p>Hi ${order.customer_name},</p>
              <p>We noticed you started designing a beautiful custom jersey for <b>${order.pet_name}</b>, but didn't quite finish checking out.</p>
              <p>Because we'd love to see ${order.pet_name} rocking their new gear, here is a special <b>5% OFF</b> discount code you can use right now!</p>
              
              <div style="background: #f8fafc; padding: 20px; text-align: center; border-radius: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 13px; color: #64748b; text-transform: uppercase; font-weight: bold;">Use Checkout Code:</p>
                <p style="margin: 5px 0; font-size: 28px; font-weight: 900; color: #2563eb; letter-spacing: 2px;">COMEBACK5</p>
              </div>

              <a href="${process.env.FRONTEND_URL || 'https://globalshop.4puppies.cl'}" style="display: block; width: 100%; text-align: center; background: #0f172a; color: white; padding: 15px 0; border-radius: 12px; text-decoration: none; font-weight: bold; text-transform: uppercase;">Complete my Order</a>
              
              <p style="font-size: 12px; color: #64748b; margin-top: 20px; text-align: center;">If you have any questions or need help with sizing, reply to this email! We are here to help.</p>
            </div>
          `
        });

        // Mark as sent so we don't spam them
        await pool.query('UPDATE orders SET abandoned_email_sent = TRUE WHERE id = $1', [order.id]);
        console.log(`Abandoned cart email sent to ${order.email} (Order #${order.id})`);
      }
    } catch (error) {
      console.error('Abandoned cart cron error:', error);
    }
  }, 15 * 60 * 1000); // 15 minutes
};

// Envia.com Tracking Supervisor (Runs every 1 hour)
const startEnviaTrackingCron = () => {
  if (!process.env.ENVIA_TOKEN) {
    console.warn('ENVIA_TOKEN not found. Automated tracking disabled.');
    return;
  }

  setInterval(async () => {
    try {
      console.log('Checking Envia.com for delivered packages...');
      const result = await pool.query(
        "SELECT id, tracking_number, email, customer_name FROM orders WHERE status = 'shipped' AND tracking_number IS NOT NULL"
      );

      for (const order of result.rows) {
        const response = await fetch('https://api.envia.com/ship/generaltrack/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ENVIA_TOKEN}`
          },
          body: JSON.stringify({
            trackingNumbers: [order.tracking_number]
          })
        });

        const data = await response.json();
        
        // Envia.com returns an array of tracking results
        const trackInfo = data.data?.[0];
        
        if (trackInfo && (trackInfo.status === 'delivered' || trackInfo.status?.toLowerCase() === 'entregado')) {
          await pool.query(
            "UPDATE orders SET status = 'delivered', delivered_at = CURRENT_TIMESTAMP WHERE id = $1",
            [order.id]
          );
          console.log(`Order #${order.id} marked as DELIVERED by Envia.com`);
          
          // Optional: Send "Order Delivered" email
          await resend.emails.send({
            from: '4PUPPIES.CL <sales@4puppies.cl>',
            to: order.email,
            subject: `It's here! 🐾 Your 4Puppies order has been delivered`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
                <h1 style="color: #22c55e;">Delivered! 🎉</h1>
                <p>Hi ${order.customer_name},</p>
                <p>We've been notified that your order <b>#${order.id}</b> has been successfully delivered.</p>
                <p>We hope you and your pet love the new jersey! If everything is perfect, we'd love it if you could share a photo with us on Instagram <b>@4puppies.cl</b></p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 11px; color: #94a3b8; text-align: center;">4PUPPIES.CL • PREMIUM PET APPAREL</p>
              </div>
            `
          });
        }
      }
    } catch (error) {
      console.error('Envia Tracking Cron Error:', error);
    }
  }, 60 * 60 * 1000); // 1 hour
};

// Order endpoint
app.post('/api/orders', async (req, res) => {
  const { customerName, address, email, phone, productName, petName, petNumber, key, price } = req.body;

  try {
    // 1. Save to Database (We wait for this)
    const result = await pool.query(
      'INSERT INTO orders (customer_name, address, email, phone, product_name, pet_name, pet_number, size_key, total) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      [customerName, address, email, phone, productName, petName, petNumber, key, price]
    );
    
    const orderId = result.rows[0].id;

    // 2. Send email via Resend (Background)
    const emailData = {
      from: '4Puppies Shop <sales@4puppies.cl>',
      to: 'sales@4puppies.cl',
      subject: `New Order Attempt #${orderId} - ${productName}`,
      html: `
        <h2>New Order Detail</h2>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>
        <hr />
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Pet Name:</strong> ${petName}</p>
        <p><strong>Pet Number:</strong> ${petNumber}</p>
        <p><strong>Size:</strong> ${key}</p>
        <p><strong>Total:</strong> $${price} USD</p>
      `,
    };

    console.log(`Attempting to send email for Order #${orderId} via Resend...`);
    resend.emails.send(emailData)
      .then(res => console.log('Resend success:', res))
      .catch(err => console.error('Resend error:', err));

    // Respond immediately so user goes to PayPal
    res.json({ success: true, orderId });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// PayPal Webhook (IPN)
app.post('/api/paypal-webhook', async (req, res) => {
  const params = req.body;
  const orderId = params.custom || params.invoice; // Probar ambos
  const paymentStatus = params.payment_status;

  console.log('Full Webhook Body:', JSON.stringify(params));
  console.log(`Webhook received for Order #${orderId}. Status: ${paymentStatus}`);

  if (paymentStatus === 'Completed' && orderId) {
    try {
      await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['completed', parseInt(orderId)]);
      console.log(`Order #${orderId} marked as completed in DB!`);
    } catch (err) {
      console.error('Webhook DB update error:', err);
    }
  }
  
  res.sendStatus(200);
});

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  const { product, orderDetails, customerData } = req.body;

  try {
    // 1. Create order in DB
    const orderResult = await pool.query(
      `INSERT INTO orders 
      (customer_name, email, phone, address, city, region, zipcode, country, product_name, pet_name, pet_number, size_key, total, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`,
      [
        customerData.customerName,
        customerData.email,
        customerData.phone,
        customerData.address,
        customerData.city,
        customerData.region,
        customerData.zipcode,
        customerData.country,
        product.name,
        orderDetails.petName,
        orderDetails.petNumber,
        orderDetails.key,
        orderDetails.price,
        'pending'
      ]
    );

    const orderId = orderResult.rows[0].id;

    // 2. Create Stripe Session with Breakdown
    let shippingCost = 45; // Define fixed shipping cost (USD)
    let itemPrice = orderDetails.price - shippingCost;

    // Prevent negative item price in Stripe for tests or heavy discounts
    if (itemPrice <= 0) {
      shippingCost = 0;
      itemPrice = orderDetails.price;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${product.name} (Custom Pet Jersey)`,
              description: `Size: ${orderDetails.key} • Pet: ${orderDetails.petName} (#${orderDetails.petNumber})`,
            },
            unit_amount: Math.round(itemPrice * 100), // Cents
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `FedEx Express International Shipping`,
              description: `4-5 Days Delivery from Chile to USA`,
            },
            unit_amount: Math.round(shippingCost * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || req.headers.origin}/`,
      customer_email: customerData.email,
      client_reference_id: orderId.toString(),
      allow_promotion_codes: true,
      metadata: {
        orderId: orderId.toString()
      }
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe Session Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Reviews Endpoints
app.post('/api/reviews', upload.single('image'), async (req, res) => {
  const { customerName, comment, stars } = req.body;
  const file = req.file;

  try {
    let imageUrl = '';
    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: 'pet-jerseys-reviews'
      });
      imageUrl = uploadResult.secure_url;
    }

    await pool.query(
      'INSERT INTO reviews (customer_name, comment, stars, pet_image_url) VALUES ($1, $2, $3, $4)',
      [customerName, comment, parseInt(stars), imageUrl]
    );

    res.json({ success: true, message: 'Review submitted for approval' });
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ success: false, error: 'Failed to submit review' });
  }
});

app.get('/api/reviews/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reviews ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Fetch all reviews error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reviews WHERE status = $1 ORDER BY created_at DESC', ['approved']);
    res.json(result.rows);
  } catch (error) {
    console.error('Fetch reviews error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
  }
});

// Admin Review Management (Password protected or internal)
app.post('/api/reviews/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('UPDATE reviews SET status = $1 WHERE id = $2', ['approved', id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM reviews WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

// Admin Order Management
app.get('/api/admin/orders', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/admin/orders/:id/track', async (req, res) => {
  const { id } = req.params;
  const { trackingNumber } = req.body;

  try {
    // 1. Update DB
    const result = await pool.query(
      'UPDATE orders SET tracking_number = $1, status = $2, shipped_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [trackingNumber, 'shipped', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = result.rows[0];

    // 2. Send Tracking Email
    const trackingLink = `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
    
    await resend.emails.send({
      from: '4PUPPIES.CL <sales@4puppies.cl>',
      to: order.email,
      subject: `Your order is on its way! 🐾 Tracking: ${trackingNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: #2563eb; text-transform: uppercase; letter-spacing: -1px;">Your pet's jersey is traveling! ✈️</h2>
          <p>Hi ${order.customer_name},</p>
          <p>Great news! Your custom pet jersey for <b>${order.pet_name}</b> has been crafted and handed over to FedEx Express.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 15px; margin: 20px 0;">
            <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Tracking Number</p>
            <p style="margin: 5px 0; font-size: 24px; font-weight: 900; color: #0f172a;">${trackingNumber}</p>
            <a href="${trackingLink}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 25px; border-radius: 10px; text-decoration: none; font-weight: bold; margin-top: 10px;">Track Order on FedEx</a>
          </div>

          <p style="font-size: 13px; color: #64748b;">
            <b>Important:</b> As per our Store Policies, please monitor your shipment to ensure someone is available for delivery. 4Puppies.cl is not responsible for delays caused by customs or missed delivery attempts.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">
            4PUPPIES.CL • SANTIAGO, CHILE • EXPRESS DELIVERY TO USA
          </p>
        </div>
      `
    });

    res.json({ success: true, order });
  } catch (error) {
    console.error('Tracking update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve static frontend if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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
        email TEXT,
        phone TEXT,
        product_name TEXT,
        pet_name TEXT,
        pet_number TEXT,
        size_key TEXT,
        total NUMERIC,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        customer_name TEXT,
        comment TEXT,
        stars INTEGER,
        pet_image_url TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};
initDb();

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
      (customer_name, address, email, phone, product_name, pet_name, pet_number, size_key, total, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [
        customerData.customerName,
        customerData.address,
        customerData.email,
        customerData.phone,
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
    const shippingCost = 25; // Define fixed shipping cost (USD)
    const itemPrice = orderDetails.price - shippingCost;

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

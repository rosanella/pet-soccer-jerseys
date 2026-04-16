const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  }
});

// Create table if not exists
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

    // 2. Send email (We DON'T wait for this to finish to avoid blocking PayPal)
    const mailOptions = {
      from: `"4Puppies Shop" <${process.env.SMTP_USER}>`,
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

    // Send email in background
    transporter.sendMail(mailOptions).catch(err => console.error('Email background error:', err));

    // Respond immediately so user goes to PayPal
    res.json({ success: true, orderId });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ success: false, error: 'Database error' });
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

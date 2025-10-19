
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./config/db'); // Database connection
const routes= require("./routes/router.js")

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Health check endpoint
app.get('/', (req, res) => {
  res.send('✅ Store Billing & Inventory Management API is running...');
});

// API version prefix
app.use('/api/v1', routes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});

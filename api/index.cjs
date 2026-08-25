const express = require('express');
const cors = require('cors');

const productRoutes = require('../backend/routes/productRoutes');
const errorHandler = require('../backend/middleware/errorHandler');

const app = express();

// CORS
app.use(cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ProductHub API is running and healthy',
    timestamp: new Date().toISOString()
  });
});

// Product API
app.use('/api/products', productRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
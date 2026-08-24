const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed frontend origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];

// 1. CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS policy'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 2. Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Health & Welcome check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Product Management API is active and healthy',
    timestamp: new Date().toISOString()
  });
});

// 4. Register Product Routes
app.use('/api/products', productRoutes);

// 5. 404 Route Handler for undefined endpoints
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint "${req.originalUrl}" not found`
  });
});

// 6. Centralized Error Handling Middleware
app.use(errorHandler);

// 7. Start Server
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================`);
    console.log(`🚀 ProductHub Backend Server Running!`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}/api/products`);
    console.log(`========================================`);
  });
}

module.exports = app;

import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const productRoutes = require('./backend/routes/productRoutes');
const errorHandler = require('./backend/middleware/errorHandler');

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;;

  // 1. CORS Configuration
  app.use(cors());

  // 2. Request body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 3. Backend REST API Endpoints FIRST
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'ProductHub API is running and healthy',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api/products', productRoutes);

  // 4. Vite middleware for development / Static assets in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 5. Centralized Error Handler
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`================================================`);
    console.log(`✨ ProductHub Full-Stack Server Active`);
    console.log(`🌐 Application: http://localhost:${PORT}`);
    console.log(`📡 REST API:    http://localhost:${PORT}/api/products`);
    console.log(`================================================`);
  });
}

startServer();

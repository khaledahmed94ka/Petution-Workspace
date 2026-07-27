// =============================================================================
// PETUTION CENTRALIZED EXPRESS BACKEND SERVICE
// Production Entry Point for Render.com & Development Server
// =============================================================================

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './routes/api.js';
import { shopifyRouter } from './routes/shopify.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API & Webhook Routes
app.use('/api/v1', apiRouter);
app.use('/api/webhooks/shopify', shopifyRouter);

// Serve static compiled frontend assets in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🐾 Petution Centralized Backend Service Running`);
  console.log(`📍 PORT: ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api/v1`);
  console.log(`🛍️ Shopify Webhooks: http://localhost:${PORT}/api/webhooks/shopify`);
  console.log(`=======================================================`);
});

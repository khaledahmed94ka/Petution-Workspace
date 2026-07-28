// =============================================================================
// PETUTION CENTRALIZED EXPRESS BACKEND SERVICE
// Production Entry Point for Render.com & Development Server
// =============================================================================

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

// Initialize Sentry before anything else
Sentry.init({
  dsn: "https://6bd09a5c381a1db4916f91368b63ad44@o4511809914404864.ingest.de.sentry.io/4511809919123536",
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

import { apiRouter } from './routes/api.js';
import { shopifyRouter } from './routes/shopify.js';

import { globalApiLimiter, webhookLimiter } from './middleware/rateLimiter.js';
import { enforceWorkspaceIsolation } from './middleware/rlsMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API & Webhook Routes with Rate Limiting & RLS Isolation Protection
app.use('/api/v1', globalApiLimiter, enforceWorkspaceIsolation, apiRouter);
app.use('/api/webhooks/shopify', webhookLimiter, shopifyRouter);

// Serve static compiled frontend assets in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.get(/(.*)/, (req, res, next) => {
  // Don't fallback for API routes (just in case they fall through)
  if (req.path.startsWith('/api/')) return next();
  
  res.sendFile(path.join(distPath, 'index.html'));
});

// Setup Sentry Express Error Handler
Sentry.setupExpressErrorHandler(app);

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🐾 Petution Centralized Backend Service Running`);
  console.log(`📍 PORT: ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api/v1`);
  console.log(`🛍️ Shopify Webhooks: http://localhost:${PORT}/api/webhooks/shopify`);
  console.log(`=======================================================`);
});

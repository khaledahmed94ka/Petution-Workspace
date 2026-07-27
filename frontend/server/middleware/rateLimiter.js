// =============================================================================
// PETUTION API RATE LIMITING MIDDLEWARE
// Prevents Brute-Force Attacks, Scraping, and DDoS Resource Exhaustion
// =============================================================================

import rateLimit from 'express-rate-limit';

/**
 * 1. Global API Rate Limiter
 * 100 requests per 15 minutes window per IP
 */
export const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    status: 429,
    error: 'Too Many Requests',
    message: 'Global API rate limit exceeded. Please try again after 15 minutes.'
  }
});

/**
 * 2. Strict Authentication Rate Limiter (Login / Signup / Reset Password)
 * 5 requests per 15 minutes window per IP (Brute-force protection)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 login/signup attempts per IP per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Too Many Authentication Attempts',
    message: 'Too many login attempts from this IP. Please try again after 15 minutes to protect your account.'
  }
});

/**
 * 3. Shopify Webhooks Rate Limiter
 * 200 requests per 5 minutes for high-volume order/stock webhooks
 */
export const webhookLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Rate Limit Exceeded',
    message: 'Shopify webhook rate limit reached. Webhook events queued.'
  }
});

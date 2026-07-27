// =============================================================================
// PETUTION SENTRY REAL-TIME ERROR TRACKING & PERFORMANCE MONITORING
// Supports React 18 SPA & Express Node.js Backend
// =============================================================================

import React from 'react';
import * as Sentry from '@sentry/react';

// Sentry DSN configuration (Configurable via import.meta.env or window.PETUTION_SENTRY_DSN)
export const SENTRY_DSN = import.meta.env?.VITE_SENTRY_DSN || 
  "https://6bd09a5c381a1db4916f91368b63ad44@o4511809914404864.ingest.de.sentry.io/4511809919123536";

/**
 * Initialize Sentry for React App
 */
export const initSentry = () => {
  if (import.meta.env?.MODE === 'test') return;

  try {
    Sentry.init({
      dsn: SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, // Capture 100% of transactions in dev/staging
      // Session Replay
      replaysSessionSampleRate: 0.1, // Sample 10% of normal sessions
      replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
      environment: import.meta.env?.MODE || 'production',
      beforeSend(event) {
        // Sanitize sensitive values if needed before sending to Sentry
        return event;
      }
    });
    console.log('🛡️ [Sentry] Error tracking & Performance monitoring initialized successfully.');
  } catch (err) {
    console.warn('[Sentry] Fallback initialization mode:', err.message);
  }
};

/**
 * Capture custom error exception with metadata
 */
export const captureException = (error, extraContext = {}) => {
  console.error('[Petution Error]', error, extraContext);
  try {
    Sentry.withScope((scope) => {
      if (extraContext.user) {
        scope.setUser({ id: extraContext.user.id, email: extraContext.user.email });
      }
      if (extraContext.workspace) {
        scope.setTag('workspace_id', extraContext.workspace);
      }
      scope.setExtras(extraContext);
      Sentry.captureException(error);
    });
  } catch (e) {
    console.warn('[Sentry] Could not send event to Sentry server:', e);
  }
};

/**
 * Capture custom log message
 */
export const captureMessage = (message, level = 'info') => {
  console.log(`[Sentry Log] [${level.toUpperCase()}] ${message}`);
  try {
    Sentry.captureMessage(message, level);
  } catch (e) {
    // Silent fallback
  }
};

/**
 * Custom Error Boundary Fallback Component for Petution
 */
export const ErrorFallback = ({ error, resetError }) => (
  <div className="auth-wrapper" style={{ minHeight: '100vh', padding: '24px', background: '#0f172a' }}>
    <div className="card" style={{ maxWidth: '480px', margin: '60px auto', textAlign: 'center', padding: '32px 24px' }}>
      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🩺</div>
      <h3 style={{ color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>Something went wrong</h3>
      <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '20px' }}>
        Petution encountered an unhandled error. Our automated Sentry telemetry has captured this issue for investigation.
      </p>
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px', fontSize: '0.75rem', color: '#be123c', fontFamily: 'monospace', textWrap: 'wrap', marginBottom: '20px' }}>
        {error?.message || 'Unknown Application Error'}
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          className="btn-primary"
          onClick={() => {
            if (resetError) resetError();
            window.location.reload();
          }}
        >
          🔄 Reload Application
        </button>
      </div>
    </div>
  </div>
);

/**
 * High-Order Component wrapping React Error Boundary
 */
export const PetutionErrorBoundary = ({ children }) => (
  <Sentry.ErrorBoundary fallback={ErrorFallback} showDialog={false}>
    {children}
  </Sentry.ErrorBoundary>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { initSentry, PetutionErrorBoundary } from './services/sentry.jsx';

// Initialize Sentry Telemetry & Error Tracking
initSentry();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PetutionErrorBoundary>
      <App />
    </PetutionErrorBoundary>
  </React.StrictMode>
);

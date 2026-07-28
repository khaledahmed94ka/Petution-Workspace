# 🐾 Petution Workspace — Unified Multi-Device Architecture Blueprint & Rules

> **CRITICAL INSTRUCTION FOR ANTIGRAVITY AGENTS**: This is the authoritative blueprint for the Petution Workspace ecosystem. Read this file on every session to maintain 100% continuity across any device or workspace.

---

## 1. Unified Workspace Structure (`D:\Petution-Workspace`)

```
Petution-Workspace/
├── frontend/             # React 18 + Vite 5 SPA + Express / PostgreSQL Backend (Render.com)
│   ├── src/
│   │   ├── components/
│   │   │   ├── drawers/   # SOAPNoteDrawer, PetPassportDrawer, ImportModalDrawer, etc.
│   │   │   └── modals/    # SocialAuthModal, ForgotPasswordModal, ClientProfileModal, ManageVisitModal, PetHealthCardModal
│   │   ├── views/         # LoginView, DashboardView, ClientsView, PetsView, VisitsView, InvoicesView, ExpensesView, AnalyticsView, ProductsView, TeamView, SettingsView
│   │   ├── context/       # AppContext.jsx (Centralized state engine & offline fallback)
│   │   └── services/      # apiClient.js, firebaseAuth.js (Google Identity Services SDK + Firebase Auth)
│   ├── server/            # Express entry point (index.js), REST API (routes/api.js), Shopify webhooks (routes/shopify.js), DB DDL (db/schema.sql)
│   └── tests/             # End-to-End Functional Test Bot (test-bot.html) - 121 tests / 15 phases
├── shopify-sync/          # Shopify Remix / Node sync engine for inventory & order webhooks
└── petution_mobile/       # Petution Mobile Clinic Client app
```

---

## 2. Security, Validation, Row-Level Isolation & Telemetry
- **Server-Side Validation**: Integrated in `server/middleware/validator.js` (`express-validator`). Validates required fields, non-negative numerical values, email normalization, species constraints, and payload structures across all POST/PUT routes (`/auth`, `/clients`, `/pets`, `/visits`, `/soap_notes`, `/products`, `/invoices`, `/expenses`). Returns structured HTTP 400 JSON errors.
- **Row-Level Security (RLS)**: Enforced natively in PostgreSQL (`server/db/schema.sql`) and Express middleware (`server/middleware/rlsMiddleware.js`).
  - All 11 multi-tenant tables (`clients`, `pets`, `visits`, `soap_notes`, `products`, `invoices`, `expenses`, `vaccines`, `users`, `stock_logs`, `shopify_sync_logs`) have RLS policies: `FOR ALL USING (workspace_id = current_setting('app.current_workspace_id', true)::uuid)`.
  - Express `enforceWorkspaceIsolation` middleware extracts `x-workspace-id` header to guarantee 100% data boundary isolation between clinic clients.
- **API Rate Limiting**: Built in `server/middleware/rateLimiter.js` (`express-rate-limit`).
  - **Global API Limiter**: Max 100 requests per 15 minutes window per IP across `/api/v1/*`.
  - **Auth Limiter**: Strict 5 attempts per 15 minutes window per IP on login/signup.
  - **Webhook Limiter**: 200 requests per 5 minutes for high-burst Shopify webhooks.
- **Sentry Error Tracking**: Integrated in `src/services/sentry.jsx` (`@sentry/react`). Captures unhandled React crashes, uncaught exceptions, and telemetry logs. Wrapped around the application in `<PetutionErrorBoundary>`.
- **Google OAuth 2.0 & Google Identity Services**: Integrated in `src/services/googleOAuth.js` with client ID `93098811360-p7r3o0kiinse2djjme71imjlp5dhmgk0.apps.googleusercontent.com`. Triggers official Google OAuth consent flow directly on `accounts.google.com`.
- **Firebase Auth Web SDK Engine**: Configured in `src/services/firebaseAuth.js` supporting `realGoogleSignInWithPopup`, `realEmailSignIn`, `realEmailSignUp`, `realSendPasswordReset`, and `realSignOut`.
- **Social Auth Dialog**: `SocialAuthModal` component provides an account chooser modal matching `accounts.google.com` and `appleid.apple.com`.
- **Password Reset**: `ForgotPasswordModal` component handles email reset link dispatch.

---

## 3. Production UX & Design System Rules
1. **Zero Raw `alert()` Popups**: Never use raw browser `alert()` popups for user actions. Use dedicated modals (`SocialAuthModal`, `ForgotPasswordModal`, `ClientProfileModal`, `ManageVisitModal`, `PetHealthCardModal`) or toast notifications.
2. **Vanilla CSS Design**: Styled via `src/index.css` (NO Tailwind CSS). Sleek dark header (`#0f172a`), teal accent (`#0d9488`), clean card layouts, mobile-first responsive.
3. **Data Integrity & Persistence**: All module data is synchronized in `src/context/AppContext.jsx` using `localStorage` keys (`petution_*`) as an offline fallback while connecting to `server/routes/api.js` REST endpoints. Parent-child links are strictly enforced (`pet.owners -> client.id`, `visit.petId -> pet.id`, `invoice.clientId -> client.id`, `soapNote.visitId -> visit.id`).
4. **Vite Build Verification**: Always verify changes with `npx vite build` to guarantee zero compilation errors before pushing to production.

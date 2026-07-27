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

## 2. Authentication Architecture
- **Google Identity Services SDK**: Loaded via `https://accounts.google.com/gsi/client`. Parses Google JWT ID Tokens (`credential` payload containing `email`, `name`, `picture`, `sub`).
- **Firebase Auth Engine**: Configured in `src/services/firebaseAuth.js` with `realGoogleSignInWithPopup`, `realEmailSignIn`, `realEmailSignUp`, `realSendPasswordReset`, and `realSignOut`.
- **Social Auth Dialog**: `SocialAuthModal` component provides an account chooser modal matching `accounts.google.com` and `appleid.apple.com`.
- **Password Reset**: `ForgotPasswordModal` component handles email reset link dispatch.

---

## 3. Production UX & Design System Rules
1. **Zero Raw `alert()` Popups**: Never use raw browser `alert()` popups for user actions. Use dedicated modals (`SocialAuthModal`, `ForgotPasswordModal`, `ClientProfileModal`, `ManageVisitModal`, `PetHealthCardModal`) or toast notifications.
2. **Vanilla CSS Design**: Styled via `src/index.css` (NO Tailwind CSS). Sleek dark header (`#0f172a`), teal accent (`#0d9488`), clean card layouts, mobile-first responsive.
3. **Data Integrity & Persistence**: All module data is synchronized in `src/context/AppContext.jsx` using `localStorage` keys (`petution_*`) as an offline fallback while connecting to `server/routes/api.js` REST endpoints. Parent-child links are strictly enforced (`pet.owners -> client.id`, `visit.petId -> pet.id`, `invoice.clientId -> client.id`, `soapNote.visitId -> visit.id`).
4. **Vite Build Verification**: Always verify changes with `npx vite build` to guarantee zero compilation errors before pushing to production.

# 🐾 Petution — Antigravity Multi-Device Workspace Rules & Architecture Blueprint

> **CRITICAL INSTRUCTION FOR ANTIGRAVITY AGENTS**: Read this file on every session. It maintains complete context, architecture decisions, and codebase rules across any device or environment.

---

## 1. Project Context & Objectives
**Petution** is a commercial-grade Veterinary Clinic Management & Sync Ecosystem. It allows multi-clinic workspace management, pet electronic medical records (EMR), SOAP clinical notes, digital vaccine passports, inventory/stock tracking, billing/invoices, expenses, team roles, and bi-directional e-commerce synchronization with Shopify.

- **Frontend Tech Stack**: React 18 + Vite 5 SPA (`D:\petution-app\src\`).
- **Backend Tech Stack**: Node.js / Express backend (`D:\petution-app\server\index.js`) backed by PostgreSQL (`server/db/schema.sql`).
- **Shopify Sync Engine**: Remix / Node app in `D:\Petution-Workspace\shopify-sync\`.
- **Styling**: Vanilla CSS in `src/index.css` (NO Tailwind CSS). Sleek dark header (`#0f172a`), teal accent (`#0d9488`), clean card layouts, mobile-first responsive.
- **Deployment**: Render.com backend + GitHub Pages / Static SPA frontend (`https://khaledahmed94ka.github.io/Petution-App/`).

---

## 2. Authentication Architecture
- **Google Identity Services SDK**: Loaded dynamically via `https://accounts.google.com/gsi/client` script. Decodes real Google JWT ID Tokens (`credential` containing `email`, `name`, `picture`, `sub`).
- **Firebase Auth Web SDK Engine**: Configured in `src/services/firebaseAuth.js` supporting `realGoogleSignInWithPopup`, `realEmailSignIn`, `realEmailSignUp`, `realSendPasswordReset`, and `realSignOut`.
- **Social Auth Dialog**: `SocialAuthModal` component provides account chooser dialog matching `accounts.google.com` and `appleid.apple.com`.
- **Password Reset**: `ForgotPasswordModal` component handles email reset token requests.

---

## 3. Core Modules & Data Architecture

| Module | Location | Purpose & Data Structure |
|--------|----------|--------------------------|
| **Auth** | `src/views/LoginView.jsx` | Multi-tenant auth with Google, Apple, and Email signup/login |
| **Workspaces** | `src/components/Sidebar.jsx` | Multi-clinic workspace registration, switcher, and deletion |
| **Clients** | `src/views/ClientsView.jsx` | Pet owners with phones, WhatsApp links, tags, address, `ClientProfileModal` |
| **Pets** | `src/views/PetsView.jsx` | Patient EMR with species, breed, microchip, blood group, neuter status, `PetHealthCardModal` |
| **Visits** | `src/views/VisitsView.jsx` | Appointment queue (scheduled, in-progress, completed, cancelled), `ManageVisitModal` |
| **SOAP Notes** | `src/components/drawers/SOAPNoteDrawer.jsx` | Veterinary S/O/A/P notes with vitals and multi-medication prescriptions |
| **Vaccines** | `src/components/drawers/PetPassportDrawer.jsx` | Immunization records, batch #, manufacturer, booster due date scheduler |
| **Products** | `src/views/ProductsView.jsx` | Inventory & services with stock alerts, cost/price/revenue calculations, stock logs |
| **Invoices** | `src/views/InvoicesView.jsx` | Billing, line items, discounts, tax, payment status (paid/pending), receipts |
| **Expenses** | `src/views/ExpensesView.jsx` | Clinic operational costs, categories (Rent, Salaries, Supplies), totals |
| **Analytics** | `src/views/AnalyticsView.jsx` | Live KPI dashboard with time range filtering (Last 3m, This month, YTD) & doctor filtering |
| **Team** | `src/views/TeamView.jsx` | Member roles (Owner, Vet, Receptionist, Admin) and invitations |
| **Settings** | `src/views/SettingsView.jsx` | Clinic org details, backup JSON export & full system restore |
| **Notifications** | `src/components/Header.jsx` | Unread notifications drawer persisted to `petution_notifications` |

---

## 4. Coding & UX Guidelines
1. **Zero Raw `alert()` Dialogs**: Never use browser `alert()` popups for user actions. Use dedicated modals (`SocialAuthModal`, `ForgotPasswordModal`, `ClientProfileModal`, `ManageVisitModal`, `PetHealthCardModal`) or toast notifications.
2. **State & LocalStorage Synchronization**: All module data is synchronized in `src/context/AppContext.jsx` using `localStorage` keys (`petution_*`) as an offline fallback while connecting to `server/routes/api.js` REST endpoints.
3. **Data Integrity**: Always maintain parent-child links (`pet.owners -> client.id`, `visit.petId -> pet.id`, `invoice.clientId -> client.id`, `soapNote.visitId -> visit.id`).
4. **Vite Build Verification**: Always verify changes with `npx vite build` to guarantee zero compilation errors before pushing to production.

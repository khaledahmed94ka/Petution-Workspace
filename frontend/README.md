# 🐾 Petution — Veterinary Clinic Management System

> A modern, full-featured clinic management web application built for veterinary practices. Manage clients, pets, visits, invoices, expenses, products, team, analytics, vaccine passports, and clinical SOAP records — all in one place.

🔗 **Live Demo:** [https://khaledahmed94ka.github.io/Petution-App/](https://khaledahmed94ka.github.io/Petution-App/)  
🔗 **Render.com:** [https://petution-app-ne6h.onrender.com](https://petution-app-ne6h.onrender.com)

---

## ✨ Features

### 📋 Core Modules

| Module | Capabilities |
|--------|-------------|
| **Dashboard** | Revenue banner, 7 clinic pulse KPIs, 4 attention alert cards, quick-action shortcuts, live visit queue, **Getting Started onboarding checklist** with progress bar |
| **Clients** | Add/search/filter clients, phone management with WhatsApp flag, tag-based filtering, CSV export & import |
| **Pets** | Add pets with species/breed/health info, owner linking, species chip filter, vaccination tracking, **microchip tracking**, **blood group**, **aggressive caution badges**, **deceased status marking**, **Digital Vaccine Passport**, CSV export & import |
| **Visits** | Schedule visits, state transitions (Scheduled → In-Progress → Completed / Cancelled), date & state filtering, **SOAP Medical Notes & Rx Prescriptions** |
| **Invoices** | Create invoices with product selection, discount/tax calculator, status filtering, date-range filtering, print receipt |
| **Expenses** | Full expense tracking with categories (Rent, Supplies, Salaries, Equipment, Utilities, Marketing, Other), date filtering, CSV export |
| **Products & Services** | Full CRUD (add/edit/delete), stock tracking with alerts, stock logs, separate product/service tabs, CSV export & import |
| **Analytics** | 18 live KPI cards, revenue/visit/client metrics, **Net Profit calculation (Revenue − Expenses)**, doctor & time-range filtering with dynamic data |
| **Team** | Invite members, role management (Owner/Admin/Vet/Receptionist), search & filter, invitation tracking |
| **Settings** | Organization profile management, full JSON system backup & restore, **Danger Zone with clinic workspace deletion** |

### 💉 Digital Pet Passport & Vaccine Scheduler

- **Printable Vaccination Certificate** — Official clinic-branded passport with pet identity (photo avatar, species, breed, gender, microchip #, blood group, owner info)
- **Immunization History Table** — Date given, vaccine name & manufacturer, batch/serial #, next booster due date, administering vet
- **Vaccine Shot Logger** — Pre-built vaccine catalog (Rabies, Tricat Trio FVRCP, Vanguard 7 DHPP, Nobivac DHPPi, Kennel Cough, Fel-O-Vax, Drontal Deworming)
- **Clinic Stamp & Vet Signature Block** — Professional printable format
- **Delete individual vaccine records** from the passport

### 📋 Veterinary SOAP Medical Notes & Rx Prescriptions

- **S (Subjective)** — Client complaint & patient history notes
- **O (Objective Vitals)** — Temperature (°C), Weight (kg), Heart Rate (bpm), Respiratory Rate (rpm)
- **A (Assessment)** — Primary diagnosis & differential findings
- **P (Plan & Prescriptions)** — Dynamic Rx medication editor with dosage, frequency (SID/BID/TID/PRN), and duration
- **Printable Rx Prescription Slip** — Official ℞ format with doctor signature line
- **Auto-save & update** — SOAP notes are linked to visits and can be edited after creation

### 🏥 Advanced Pet Profiles & Microchipping

- **Microchip Registration** — Chip number, implant date, implant location
- **Blood Group** — DEA 1.1+, DEA 1.1−, Type A, Type B, Type AB, Unknown
- **Health Card & Protocol Numbers** — For clinic record keeping
- **Neutering Date & Status** — Track castration/spay with date
- **Aggressive Caution Badge** — Visual ⚠️ warning flag on pet rows
- **Deceased Status** — Mark pets as deceased with date of death, greyed-out row styling
- **Private Veterinary Notes** — Internal notes not visible to pet owners
- **Temperament** — Calm, Friendly, Shy, Nervous, Aggressive tracking

### 💰 Clinic Expenses Management

- **Expense Categories** — Rent, Supplies, Salaries, Equipment, Utilities, Marketing, Other
- **Date Filtering** — From/To date range filtering
- **Net Profit** — Analytics view subtracts total expenses from revenue
- **Full CRUD** — Add and delete individual expense entries

### 🔐 Authentication System

- **Login Screen** — Google, Apple, Email/Password login options
- **Clinic Registration** — Register new clinic workspace on first login
- **Demo Access** — Instant demo login with pre-populated data
- **Profile Drawer** — View logged-in user info with logout button

### 🚀 Getting Started Onboarding

- **Collapsible Checklist Widget** — Appears at top of Dashboard
- **8-Step Progress Tracker** — "X of 8 completed (Y%)" with animated progress bar
- **Quick Action Buttons** — Each step links directly to the relevant drawer/view
- **Dismissible** — Collapse to focus on clinic operations

### 🔧 System Features

- **Multi-Workspace** — Register and switch between multiple clinic workspaces, **delete workspaces** from Sidebar or Settings Danger Zone
- **Data Persistence** — All data saved to `localStorage` (clients, pets, visits, products, invoices, expenses, vaccines, SOAP notes, team, settings, notifications, stock logs)
- **Import/Export** — CSV import/export for Clients, Pets, Products. Full JSON system backup & restore (now includes vaccines & SOAP notes)
- **Responsive Design** — Mobile-first layout with breakpoints at 640px, 768px, and 1024px
- **Notifications** — Bell icon with unread count, mark-all-read, persistent across sessions
- **Touch-Friendly** — 44px minimum touch targets, safe-area insets for iPhone notch, scrollable tabs

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework with hooks & context |
| **Vite 5** | Build tool & dev server |
| **Lucide React** | Icon library |
| **Vanilla CSS** | Mobile-first responsive styling |
| **localStorage** | Client-side data persistence |
| **GitHub Pages** | Deployment via `gh-pages` |
| **Render.com** | Production deployment via `render.yaml` |

---

## 📁 Project Structure

```
petution-app/
├── index.html                    # Entry HTML with viewport & Google Fonts
├── vite.config.js                # Vite config (base path, dev server port)
├── render.yaml                   # Render.com deployment config
├── .node-version                 # Node 20.11.0 for Render
├── package.json                  # Scripts, dependencies
│
├── src/
│   ├── main.jsx                  # React DOM entry point
│   ├── App.jsx                   # Root component, routing, drawer rendering
│   ├── index.css                 # Global mobile-first responsive styles
│   │
│   ├── context/
│   │   └── AppContext.jsx        # Central state management (React Context)
│   │
│   ├── components/
│   │   ├── Sidebar.jsx           # Desktop sidebar + mobile off-canvas nav
│   │   ├── Header.jsx            # Top bar with breadcrumb & notifications
│   │   ├── BottomNav.jsx         # Mobile bottom tab navigation
│   │   │
│   │   └── drawers/
│   │       ├── AddClientDrawer.jsx
│   │       ├── AddPetDrawer.jsx        # Extended: microchip, blood group, aggression, death
│   │       ├── AddVisitDrawer.jsx
│   │       ├── AddInvoiceDrawer.jsx
│   │       ├── AddExpenseDrawer.jsx    # NEW — Expense logging
│   │       ├── AddItemDrawer.jsx       # Products/Services CRUD
│   │       ├── AddVaccineDrawer.jsx    # NEW — Record vaccine shots
│   │       ├── PetPassportDrawer.jsx   # NEW — Digital Pet Vaccination Passport
│   │       ├── SOAPNoteDrawer.jsx      # NEW — SOAP Clinical Notes & Rx Prescriptions
│   │       ├── ImportModalDrawer.jsx   # CSV/JSON file import
│   │       └── InviteMemberDrawer.jsx
│   │
│   ├── views/
│   │   ├── DashboardView.jsx     # Extended: Getting Started onboarding widget
│   │   ├── ClientsView.jsx
│   │   ├── PetsView.jsx          # Extended: microchip, passport button, caution badges
│   │   ├── VisitsView.jsx        # Extended: SOAP / Rx button per visit
│   │   ├── InvoicesView.jsx
│   │   ├── ExpensesView.jsx      # NEW — Expenses dashboard
│   │   ├── ProductsView.jsx
│   │   ├── AnalyticsView.jsx     # Extended: Net Profit (Revenue − Expenses)
│   │   ├── TeamView.jsx
│   │   ├── SettingsView.jsx      # Extended: Danger Zone workspace deletion
│   │   ├── LoginView.jsx         # NEW — Authentication screen
│   │   └── RegisterClinicView.jsx
│   │
│   └── utils/
│       └── dataExportImport.js   # CSV/JSON export & import utilities
│
└── dist/                         # Production build output
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+

### Install & Run

```bash
# Clone the repository
git clone https://github.com/khaledahmed94ka/Petution-App.git
cd Petution-App

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Deploy Options

#### Option A: Render.com (Recommended for Production)

1. Go to [dashboard.render.com](https://dashboard.render.com/)
2. Click **New +** → **Blueprints**
3. Select your repository `khaledahmed94ka/Petution-App`
4. Render will automatically load `render.yaml` and launch your site!

#### Option B: GitHub Pages

```bash
npm run deploy
```

This runs `vite build` followed by `gh-pages -d dist`.

---

## 📱 Responsive Breakpoints

| Breakpoint | Target | Layout |
|-----------|--------|--------|
| < 640px | Phones | Single/2-column grids, stacked headers, bottom nav, full-width drawers |
| 640px – 767px | Large phones | 2-column grids, side drawers |
| 768px – 1023px | Tablets | 3-4 column grids, horizontal filters |
| ≥ 1024px | Desktop | Sticky sidebar, full grids, desktop layout, bottom nav hidden |

---

## 💾 Data Architecture

All data is managed via React Context (`AppContext.jsx`) and persisted to `localStorage`:

| Data | localStorage Key | Features |
|------|-----------------|----------|
| Clients | `petution_clients` | Add, search, tag filter, CSV import/export |
| Pets | `petution_pets` | Add, species filter, microchip, blood group, health tracking, CSV import/export |
| Visits | `petution_visits` | Add, state transitions, date/state filtering, SOAP notes |
| Products | `petution_products` | Full CRUD, stock alerts, CSV import/export |
| Invoices | `petution_invoices` | Add, status/date filtering, print receipt |
| Expenses | `petution_expenses` | Add/delete, category filtering, date range |
| Vaccines | `petution_vaccines` | Add/delete, linked to pets, passport view |
| SOAP Notes | `petution_soap_notes` | Create/update, linked to visits, printable Rx |
| Team | `petution_team` | Invite, role management, remove |
| Settings | `petution_settings` | Organization profile, persisted |
| Workspaces | `petution_workspaces` | Multi-clinic workspace switching & deletion |
| Active Workspace | `petution_active_ws` | Currently selected workspace |
| Stock Logs | `petution_stocklogs` | Automatic logging on product changes |
| Notifications | `petution_notifications` | Bell icon, unread tracking |
| Invitations | `petution_invitations` | Team invitation tracking |
| User Auth | `petution_user` | Login state, email, name, provider |

### Full Backup & Restore

Export all clinic data (clients, pets, visits, products, invoices, expenses, vaccines, SOAP notes, settings) as a single `.json` file from **Settings → Data Backup & Migration**. Restore by uploading the same file.

---

## 🗺️ Roadmap

- [ ] Billing & Subscription plans (deferred)
- [ ] Charts & graph visualizations for Analytics
- [ ] Client/Pet inline editing and deletion
- [ ] WhatsApp API integration for Chats module
- [ ] Online booking system
- [ ] Reminder system (SMS/Email for vaccine boosters)
- [ ] Database backend (Firebase / Supabase)
- [x] ~~Prescription templates~~ → Implemented as SOAP Notes & Rx Prescriptions
- [x] ~~Multi-user authentication~~ → Implemented (Email, Google, Apple, Demo)

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 👤 Author

**Khaled ElGendy**  
📧 khaledahmed94.ka@gmail.com  
🔗 [GitHub](https://github.com/khaledahmed94ka)

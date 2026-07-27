# Petution — Project Rules & Context for Antigravity

> This file is automatically read by Antigravity when this project is set as the active workspace.
> It captures all architectural decisions, conventions, patterns, and project knowledge.

---

## 🏗️ Project Overview

**Petution** is a veterinary clinic management SPA (Single Page Application) built with React 18 + Vite 5. It runs entirely client-side with `localStorage` persistence — no backend server or database.

- **GitHub:** https://github.com/khaledahmed94ka/Petution-App
- **Live (GitHub Pages):** https://khaledahmed94ka.github.io/Petution-App/
- **Live (Render.com):** https://petution-app-ne6h.onrender.com
- **Author:** Khaled ElGendy (khaledahmed94.ka@gmail.com)

---

## 🛠️ Tech Stack & Constraints

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | React 18 (hooks + context) | No class components |
| Build | Vite 5 | Dev server on port 3000 |
| Styling | Vanilla CSS (`src/index.css`) | Mobile-first, NO Tailwind |
| Icons | `lucide-react` | All icons come from here |
| State | React Context (`AppContext.jsx`) | Single provider, all state centralized |
| Persistence | `localStorage` | Every state synced via `useEffect` |
| Deployment | GitHub Pages (`gh-pages`) + Render.com (`render.yaml`) | |
| Node | 20.11.0 (pinned in `.node-version`) | |

### Critical Build Knowledge

- **Vite MUST stay in `dependencies`** (not `devDependencies`) in `package.json` — Render.com production builds fail otherwise.
- **Render build command:** `node ./node_modules/vite/bin/vite.js build` — direct Node invocation avoids Linux shell symlink permission issues with `.bin/vite`.
- **GitHub Pages deploy:** `npm run deploy` → runs `vite build && gh-pages -d dist`.
- **Base path:** `vite.config.js` sets `base: '/Petution-App/'` for GitHub Pages.

---

## 📁 Architecture & File Conventions

### Directory Layout

```
src/
├── main.jsx                  # ReactDOM entry
├── App.jsx                   # Root: auth gate, tab routing, drawer rendering
├── index.css                 # ALL styles (mobile-first, single file)
├── context/
│   └── AppContext.jsx        # THE single source of truth for all state
├── components/
│   ├── Sidebar.jsx           # Desktop sidebar + mobile off-canvas
│   ├── Header.jsx            # Top bar, breadcrumb, notifications bell
│   ├── BottomNav.jsx         # Mobile bottom tab bar
│   └── drawers/              # All slide-over panels
│       ├── AddClientDrawer.jsx
│       ├── AddPetDrawer.jsx
│       ├── AddVisitDrawer.jsx
│       ├── AddInvoiceDrawer.jsx
│       ├── AddExpenseDrawer.jsx
│       ├── AddItemDrawer.jsx
│       ├── AddVaccineDrawer.jsx
│       ├── PetPassportDrawer.jsx
│       ├── SOAPNoteDrawer.jsx
│       ├── ImportModalDrawer.jsx
│       └── InviteMemberDrawer.jsx
├── views/                    # Full-page tab views
│   ├── DashboardView.jsx
│   ├── ClientsView.jsx
│   ├── PetsView.jsx
│   ├── VisitsView.jsx
│   ├── InvoicesView.jsx
│   ├── ExpensesView.jsx
│   ├── ProductsView.jsx
│   ├── AnalyticsView.jsx
│   ├── TeamView.jsx
│   ├── SettingsView.jsx
│   ├── LoginView.jsx
│   └── RegisterClinicView.jsx
└── utils/
    └── dataExportImport.js   # CSV/JSON export & import helpers
```

### Naming Conventions

- Views: `{Name}View.jsx` — full-page content rendered by tab routing in `App.jsx`
- Drawers: `{Action}{Entity}Drawer.jsx` — slide-over panels triggered by `setActiveDrawer('drawerKey')`
- All components use **named exports** (not default exports)
- CSS classes use **kebab-case** (`btn-primary`, `form-control`, `badge-teal`)

---

## ⚙️ State Management Pattern

**Everything lives in `AppContext.jsx`.** There is ONE context provider wrapping the entire app.

### How to add new state:

1. Define `initialData` array at the top of `AppContext.jsx`
2. Create `useState` with `localStorage` hydration:
   ```jsx
   const [items, setItems] = useState(() => {
     const saved = localStorage.getItem('petution_items');
     return saved ? JSON.parse(saved) : initialData;
   });
   ```
3. Add `useEffect` for persistence:
   ```jsx
   useEffect(() => {
     localStorage.setItem('petution_items', JSON.stringify(items));
   }, [items]);
   ```
4. Create helper functions (`addItem`, `deleteItem`, `updateItem`)
5. Expose in the `<AppContext.Provider value={{...}}>` object
6. Update `importFullBackup` to include the new data type

### Current localStorage Keys

| Key | Data |
|-----|------|
| `petution_clients` | Client records |
| `petution_pets` | Pet records |
| `petution_visits` | Visit records |
| `petution_products` | Products & services |
| `petution_invoices` | Invoices |
| `petution_expenses` | Expense entries |
| `petution_vaccines` | Vaccine shot records |
| `petution_soap_notes` | SOAP clinical notes |
| `petution_team` | Team members |
| `petution_settings` | Org profile settings |
| `petution_workspaces` | Clinic workspaces |
| `petution_active_ws` | Active workspace ID |
| `petution_stocklogs` | Product stock change logs |
| `petution_notifications` | Bell notifications |
| `petution_invitations` | Team invitations |
| `petution_user` | Auth state (email, name, provider) |

### Drawer Routing Pattern

Drawers are controlled via `activeDrawer` state string:

```jsx
// In a view:
setActiveDrawer('addClient');    // opens AddClientDrawer
setActiveDrawer('petPassport');  // opens PetPassportDrawer
setActiveDrawer(null);           // closes any drawer

// For drawers that need context about WHICH item:
setActiveModalItem(pet.id);      // set the target item ID
setActiveDrawer('petPassport');  // then open the drawer
```

All drawer rendering happens in `App.jsx` via conditional checks:
```jsx
{activeDrawer === 'addClient' && <AddClientDrawer />}
{activeDrawer === 'petPassport' && <PetPassportDrawer petId={activeModalItem} />}
```

---

## 🎨 Styling Rules

- **Single CSS file:** `src/index.css` — all styles live here
- **CSS variables** are defined at `:root` level (e.g., `--primary-teal`, `--text-muted`, `--border-card`, `--radius-md`)
- **NO Tailwind** — use the existing utility classes or add new ones to `index.css`
- **Mobile-first:** Base styles target phones, `@media (min-width: ...)` for larger screens
- **Breakpoints:** 640px, 768px, 1024px
- **Drawer styling pattern:**
  - `.drawer-backdrop` — full-screen translucent overlay
  - `.drawer-panel` — slide-in content panel
  - `.drawer-header` / `.drawer-body` / `.drawer-footer` — standard sections
- **Badge classes:** `.badge-teal`, `.badge-amber`, `.badge-rose`, `.badge-gray`
- **Button classes:** `.btn-primary` (teal), `.btn-secondary` (outlined), `.icon-btn` (icon-only)
- **Print support:** Use `.no-print` class for elements to hide during `window.print()`

---

## 🧩 Implemented Features (Complete List)

### Core Modules
1. ✅ Dashboard with KPIs, alerts, visit queue, onboarding checklist
2. ✅ Clients — CRUD, phone/WhatsApp, tags, CSV import/export
3. ✅ Pets — Extended profiles: microchip, blood group, aggressive badge, deceased status, vaccine passport
4. ✅ Visits — State machine (scheduled → in-progress → completed/cancelled), SOAP notes button
5. ✅ Invoices — Product line items, discount/tax, status filtering, print receipt
6. ✅ Expenses — Categories, date filtering, delete
7. ✅ Products & Services — Full CRUD, stock tracking, stock logs, CSV import/export
8. ✅ Analytics — 18 KPI cards, Net Profit (Revenue − Expenses), doctor/time filtering
9. ✅ Team — Invite, roles (Owner/Admin/Vet/Receptionist), search
10. ✅ Settings — Org profile, JSON backup/restore, Danger Zone workspace deletion

### Advanced Features
11. ✅ Digital Pet Passport & Vaccine Scheduler — Printable vaccination certificate, vaccine shot logger
12. ✅ SOAP Medical Notes & Rx Prescriptions — S/O/A/P fields, dynamic Rx editor, printable ℞ slip
13. ✅ Authentication — Login (Google/Apple/Email), clinic registration, demo access
14. ✅ Getting Started Onboarding — 8-step collapsible checklist with progress bar
15. ✅ Multi-Workspace — Create, switch, delete clinic workspaces
16. ✅ Notifications — Bell icon, unread count, mark-all-read

### NOT Yet Implemented (Roadmap)
- ❌ Billing & Subscription plans
- ❌ Charts/graph visualizations for Analytics
- ❌ Client/Pet inline editing and deletion
- ❌ WhatsApp API integration
- ❌ Online booking system
- ❌ SMS/Email reminders for vaccine boosters
- ❌ Database backend (Firebase/Supabase)

---

## 🚀 Common Workflows

### Adding a New View
1. Create `src/views/{Name}View.jsx` with named export
2. Add `case '{name}':` to the `renderView()` switch in `App.jsx`
3. Add nav item in `Sidebar.jsx` navItems array
4. Add mobile tab in `BottomNav.jsx` if needed

### Adding a New Drawer
1. Create `src/components/drawers/{Name}Drawer.jsx` with named export
2. Import in `App.jsx`
3. Add conditional render: `{activeDrawer === 'drawerKey' && <NameDrawer />}`
4. Trigger from views: `setActiveDrawer('drawerKey')`

### Deploying
```bash
# Build + deploy to GitHub Pages
npm run deploy

# Or manually:
npx vite build
npx gh-pages -d dist

# Push to trigger Render.com auto-deploy:
git push origin main
```

---

## 👤 User Preferences (Khaled)

- Prefers comprehensive features over minimal MVPs
- Wants professional, production-grade UI
- Uses Render.com + GitHub Pages for dual deployment
- Clinic name: "Petution Veterinary Center"
- Default vet name in demo data: "Dr. Khaled ElGendy"
- Location: Cairo, Egypt
- Prefers features inspired by professional vet software (referenced Veterian app screenshots)

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';

import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { ClientsView } from './views/ClientsView';
import { PetsView } from './views/PetsView';
import { VisitsView } from './views/VisitsView';
import { InvoicesView } from './views/InvoicesView';
import { ExpensesView } from './views/ExpensesView';
import { ProductsView } from './views/ProductsView';
import { AnalyticsView } from './views/AnalyticsView';
import { RemindersView } from './views/RemindersView';
import { TeamView } from './views/TeamView';
import { BillingView } from './views/BillingView';
import { SettingsView } from './views/SettingsView';
import { RegisterClinicView } from './views/RegisterClinicView';

import { AddClientDrawer } from './components/drawers/AddClientDrawer';
import { AddPetDrawer } from './components/drawers/AddPetDrawer';
import { AddVisitDrawer } from './components/drawers/AddVisitDrawer';
import { AddInvoiceDrawer } from './components/drawers/AddInvoiceDrawer';
import { AddExpenseDrawer } from './components/drawers/AddExpenseDrawer';
import { AddItemDrawer } from './components/drawers/AddItemDrawer';
import { ImportModalDrawer } from './components/drawers/ImportModalDrawer';
import { InviteMemberDrawer } from './components/drawers/InviteMemberDrawer';
import { PetPassportDrawer } from './components/drawers/PetPassportDrawer';
import { AddVaccineDrawer } from './components/drawers/AddVaccineDrawer';
import { SOAPNoteDrawer } from './components/drawers/SOAPNoteDrawer';
import { X, LogOut, ShieldCheck } from 'lucide-react';

const MainLayout = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout, activeDrawer, setActiveDrawer, activeModalItem, isEmbedded, settings } = useApp();
  const location = useLocation();

  if (!user?.isAuthenticated) {
    return <LoginView />;
  }

  if (isRegistering) {
    return <RegisterClinicView onComplete={() => setIsRegistering(false)} />;
  }

  // If at root and authenticated, redirect to workspace dashboard
  if (location.pathname === '/') {
    return <Navigate to={`/${settings.slug || 'petution'}/dashboard`} replace />;
  }

  return (
    <div className={`app-container ${isEmbedded ? 'embedded-mode' : ''}`}>
      {!isEmbedded && (
        <Sidebar 
          onRegisterClick={() => setIsRegistering(true)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />
      )}
      <div className="main-content" style={isEmbedded ? { marginLeft: 0, width: '100%' } : {}}>
        <Header onMenuToggle={() => setIsMobileOpen(prev => !prev)} />
        <div className="page-wrapper">
          <Outlet />
        </div>
      </div>

      <BottomNav onMenuToggle={() => setIsMobileOpen(prev => !prev)} />

      {/* Render Active Slide-Over Drawers */}
      {activeDrawer === 'addClient' && <AddClientDrawer />}
      {activeDrawer === 'addPet' && <AddPetDrawer />}
      {activeDrawer === 'addVisit' && <AddVisitDrawer />}
      {activeDrawer === 'addInvoice' && <AddInvoiceDrawer />}
      {activeDrawer === 'addExpense' && <AddExpenseDrawer />}
      {activeDrawer === 'addItem' && <AddItemDrawer />}
      {activeDrawer === 'inviteMember' && <InviteMemberDrawer />}
      {activeDrawer === 'importClients' && <ImportModalDrawer targetType="clients" />}
      {activeDrawer === 'importPets' && <ImportModalDrawer targetType="pets" />}
      {activeDrawer === 'importProducts' && <ImportModalDrawer targetType="products" />}
      {activeDrawer === 'petPassport' && <PetPassportDrawer petId={activeModalItem} />}
      {activeDrawer === 'addVaccine' && <AddVaccineDrawer />}
      {activeDrawer === 'soapNote' && <SOAPNoteDrawer visitId={activeModalItem} />}

      {/* User Profile Modal */}
      {activeDrawer === 'profile' && (
        <div className="drawer-backdrop" onClick={() => setActiveDrawer(null)}>
          <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <h3>User Account</h3>
                <p>Manage your login credentials, provider, and role settings.</p>
              </div>
              <button className="icon-btn" onClick={() => setActiveDrawer(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="drawer-body">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-control font-semibold" value={user?.name || 'Khaled ElGendy'} readOnly />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-control" value={user?.email || 'khaledahmed94.ka@gmail.com'} readOnly />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Workspace Role</label>
                  <input type="text" className="form-control" value={user?.role || 'Owner'} readOnly />
                </div>
                <div className="form-group">
                  <label>Authentication Method</label>
                  <div className="form-control flex items-center gap-xs font-semibold text-xs text-teal">
                    <ShieldCheck size={14} /> {user?.provider ? user.provider.toUpperCase() : 'EMAIL'}
                  </div>
                </div>
              </div>

              <div className="margin-top-lg border-top pt-md flex flex-col gap-sm">
                <button 
                  className="btn-secondary w-full"
                  onClick={() => {
                    setActiveDrawer(null);
                    setIsRegistering(true);
                  }}
                >
                  Switch / Register Clinic
                </button>
                <button 
                  className="btn-primary w-full bg-rose text-white"
                  style={{ background: '#e11d48', borderColor: '#e11d48' }}
                  onClick={() => {
                    setActiveDrawer(null);
                    logout();
                  }}
                >
                  <LogOut size={16} /> Sign Out of Petution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path=":workspaceSlug">
              <Route path="dashboard" element={<DashboardView />} />
              <Route path="clients" element={<ClientsView />} />
              <Route path="pets" element={<PetsView />} />
              <Route path="visits" element={<VisitsView />} />
              <Route path="invoices" element={<InvoicesView />} />
              <Route path="expenses" element={<ExpensesView />} />
              <Route path="products" element={<ProductsView />} />
              <Route path="analytics" element={<AnalyticsView />} />
              <Route path="reminders" element={<RemindersView />} />
              <Route path="chats" element={<div className="page-wrapper"><div className="card"><h3>WhatsApp Messaging Hub</h3><p className="text-muted margin-top-xs">Integrated clinic chat system ready for WhatsApp API configuration.</p></div></div>} />
              <Route path="team" element={<TeamView />} />
              <Route path="billing" element={<div className="page-wrapper"><div className="card"><h3>Billing & Subscription</h3><p className="text-muted margin-top-xs">Subscription and billing management coming soon.</p></div></div>} />
              <Route path="settings" element={<SettingsView />} />
              <Route path="help" element={<div className="page-wrapper"><div className="card"><h3>Support & Help Center</h3><p className="text-muted margin-top-xs">Search documentation or contact Petution technical support team.</p></div></div>} />
              {/* Fallback inside workspace */}
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
            {/* Fallback outside workspace */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

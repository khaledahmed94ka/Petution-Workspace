import { 
  LayoutDashboard, 
  Users, 
  Dog, 
  Calendar, 
  Receipt, 
  DollarSign,
  Package, 
  BarChart3, 
  MessageSquare, 
  UserCheck, 
  CreditCard, 
  Settings, 
  HelpCircle,
  Bell,
  ChevronDown,
  Check,
  PlusCircle,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar = ({ activeTab, setActiveTab, onRegisterClick, isMobileOpen, onCloseMobile }) => {
  const { 
    user,
    settings, 
    workspaces, 
    activeWorkspaceId, 
    switchWorkspace, 
    deleteWorkspace,
    showWorkspaceMenu, 
    setShowWorkspaceMenu,
    setActiveDrawer
  } = useApp();

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const mainNav = [
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'products', label: 'Products & Services', icon: Package },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'pets', label: 'Pets', icon: Dog },
    { id: 'visits', label: 'Visits', icon: Calendar },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'expenses', label: 'Expenses', icon: DollarSign },
    { id: 'chats', label: 'Chats', icon: MessageSquare }
  ];

  const secondaryNav = [
    { id: 'team', label: 'Team', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Get Help', icon: HelpCircle }
  ];

  return (
    <>
      {isMobileOpen && <div className="sidebar-overlay" onClick={onCloseMobile} />}
      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>

      {/* Workspace Switcher Header */}
      <div className="workspace-header-wrapper">
        <div 
          className="workspace-header"
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
        >
          <div className="workspace-logo-circle">
            <span>{settings.orgName ? settings.orgName.charAt(0) : 'P'}</span>
          </div>
          <div className="workspace-title-info">
            <span className="workspace-name">{settings.orgName || 'Petution Clinic'}</span>
            <span className="workspace-slug">{settings.slug || 'petution'}</span>
          </div>
          <ChevronDown size={14} className="margin-left-auto text-muted" />
        </div>

        {/* Workspace Dropdown Popover */}
        {showWorkspaceMenu && (
          <div className="workspace-popover-menu">
            <div className="popover-section-label">SELECT WORKSPACE</div>
            {workspaces.map(ws => (
              <div 
                key={ws.id}
                className={`workspace-menu-item ${ws.id === activeWorkspaceId ? 'active' : ''}`}
                onClick={() => {
                  switchWorkspace(ws.id);
                  setShowWorkspaceMenu(false);
                }}
              >
                <div className="ws-item-circle">{ws.name.charAt(0)}</div>
                <div className="ws-item-info">
                  <span className="ws-item-name">{ws.name}</span>
                  <span className="ws-item-plan">{ws.plan || 'Active Workspace'}</span>
                </div>
                {ws.id === activeWorkspaceId && <Check size={14} className="text-teal margin-right-xs" />}
                {workspaces.length > 1 && (
                  <button 
                    className="icon-btn text-rose" 
                    title="Delete Clinic Workspace"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Permanently delete clinic workspace "${ws.name}"?`)) {
                        deleteWorkspace(ws.id);
                      }
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}

            <div className="popover-divider" />
            <button 
              className="workspace-add-btn"
              onClick={() => {
                setShowWorkspaceMenu(false);
                if (onRegisterClick) onRegisterClick();
              }}
            >
              <PlusCircle size={16} className="text-teal" />
              <span>+ Register New Clinic</span>
            </button>
          </div>
        )}
      </div>

      {/* Primary Navigation */}
      <nav className="nav-group">
        {mainNav.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="nav-divider" />

      {/* Secondary Settings Navigation */}
      <nav className="nav-group">
        {secondaryNav.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>


      {/* User Footer */}
      <div 
        className="user-profile-footer clickable"
        onClick={() => setActiveDrawer('profile')}
      >
        <div className="avatar-circle">
          {user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'KE'}
        </div>
        <div className="user-details">
          <span className="user-name">{user?.name || 'Khaled ElGendy'}</span>
          <span className="user-email">{user?.email || 'khaledahmed94.ka@gmail.com'}</span>
        </div>
      </div>


      <style>{`
        .workspace-header-wrapper {
          position: relative;
          margin-bottom: 16px;
        }

        .workspace-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .workspace-header:hover {
          background: #f1f5f9;
        }

        .workspace-popover-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          width: 100%;
          max-width: 260px;
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          z-index: 100;
          padding: 8px;
          animation: fadeIn 0.15s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .popover-section-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-light);
          padding: 4px 8px;
          letter-spacing: 0.05em;
        }

        .workspace-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .workspace-menu-item:hover {
          background: #f8fafc;
        }

        .workspace-menu-item.active {
          background: var(--primary-teal-light);
        }

        .ws-item-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--primary-teal);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ws-item-info {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
        }

        .ws-item-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ws-item-plan {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .popover-divider {
          height: 1px;
          background: var(--border-card);
          margin: 6px 0;
        }

        .workspace-add-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--primary-teal);
          transition: background 0.15s ease;
        }

        .workspace-add-btn:hover {
          background: var(--primary-teal-light);
        }

        .clickable {
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .clickable:hover {
          background: #f1f5f9;
          border-radius: var(--radius-sm);
        }

        .workspace-logo-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary-teal-light);
          color: var(--primary-teal);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .workspace-info {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }

        .workspace-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .workspace-sub {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .nav-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--sidebar-text);
          transition: all 0.15s ease;
          width: 100%;
          text-align: left;
          min-height: 44px;
        }

        .nav-item:hover:not(.active) {
          background: #f8fafc;
          color: var(--text-main);
        }

        .nav-item.active {
          background: var(--sidebar-bg-active);
          color: var(--sidebar-text-active);
        }

        .nav-divider {
          height: 1px;
          background: var(--sidebar-border);
          margin: 12px 0;
        }

        .user-profile-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-top: 1px solid var(--sidebar-border);
          padding-top: 14px;
        }

        .avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #475569;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
        }

        .user-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-email {
          font-size: 0.7rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </aside>
    </>
  );
};

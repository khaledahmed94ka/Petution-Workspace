import React from 'react';
import { Bell, CheckCheck, Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header = ({ onMenuToggle }) => {
  const { 
    settings, 
    notifications, 
    setNotifications, 
    showNotifications, 
    setShowNotifications 
  } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <button 
          className="icon-btn mobile-menu-btn" 
          title="Toggle Navigation Menu"
          onClick={onMenuToggle}
        >
          <Menu size={20} />
        </button>

        <div className="breadcrumb">
          <span className="text-muted">Petution</span>
          <span style={{ color: 'var(--text-light)' }}>/</span>
          <span className="font-semibold">{settings.orgName}</span>
        </div>
      </div>

      <div className="header-actions">
        <div style={{ position: 'relative' }}>
          <button 
            className="icon-btn" 
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {/* Notifications Dropdown Popover */}
          {showNotifications && (
            <div className="notifications-popover">
              <div className="notif-header">
                <span className="font-semibold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button className="text-xs text-teal font-semibold flex items-center gap-xs" onClick={markAllRead}>
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="text-muted text-xs" style={{ padding: '16px', textAlign: 'center' }}>No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-time">{n.time}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .notifications-popover {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: calc(100vw - 24px);
          max-width: 320px;
          background: #ffffff;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          z-index: 100;
          overflow: hidden;
        }

        .notif-header {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-card);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
        }

        .notif-list {
          max-height: 280px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .notif-item {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-card);
          font-size: 0.85rem;
        }

        .notif-item.unread {
          background: var(--primary-teal-light);
        }

        .notif-title {
          font-weight: 500;
          color: var(--text-main);
        }

        .notif-time {
          font-size: 0.725rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        @media (max-width: 1023px) {
          .mobile-menu-btn {
            display: flex !important;
          }
        }

        @media (min-width: 1024px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};


import React, { useState } from 'react';
import { X, Lock, Check, Shield, User, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SocialAuthModal = ({ provider, onClose }) => {
  const { loginWithProvider } = useApp();
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isGoogle = provider === 'google';

  const defaultAccounts = isGoogle ? [
    { name: 'Dr. Khaled ElGendy', email: 'khaledahmed94.ka@gmail.com', avatar: '👨‍⚕️' },
    { name: 'Petution Admin', email: 'admin@petution.com', avatar: '🐾' }
  ] : [
    { name: 'Khaled ElGendy', email: 'khaled.elgendy@icloud.com', avatar: '🍏' }
  ];

  const handleSelectAccount = (acc) => {
    setSelectedAccount(acc);
  };

  const handleConfirmLogin = (e) => {
    e.preventDefault();
    const accountToUse = isAddingNew
      ? { name: customName || customEmail.split('@')[0], email: customEmail }
      : selectedAccount || defaultAccounts[0];

    if (!accountToUse.email) return;

    setIsLoading(true);
    setTimeout(() => {
      loginWithProvider(provider, accountToUse.email, accountToUse.name);
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="social-modal-overlay">
      <div className={`social-modal-card ${isGoogle ? 'google-style' : 'apple-style'}`}>
        {/* Header */}
        <div className="social-modal-header">
          <div className="provider-badge">
            {isGoogle ? (
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.36c.64-.78 1.08-1.85.96-2.93-.93.04-2.06.62-2.73 1.4-.59.68-1.1 1.77-.96 2.84 1.05.08 2.09-.53 2.73-1.31"/>
              </svg>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Title */}
        <div className="title-area">
          <h3>Sign in with {isGoogle ? 'Google' : 'Apple'}</h3>
          <p className="subtitle">to continue to <strong>Petution Veterinary Center</strong></p>
        </div>

        {/* Scope info */}
        <div className="scope-info">
          <Shield size={14} className="text-teal" />
          <span>Petution will receive your name, email address, and profile picture.</span>
        </div>

        {/* Account Selector List */}
        {!isAddingNew ? (
          <div className="account-list">
            {defaultAccounts.map((acc, idx) => (
              <div 
                key={idx}
                className={`account-item ${(selectedAccount?.email === acc.email || (!selectedAccount && idx === 0)) ? 'active' : ''}`}
                onClick={() => handleSelectAccount(acc)}
              >
                <div className="avatar-circle">{acc.avatar}</div>
                <div className="account-details">
                  <div className="acc-name">{acc.name}</div>
                  <div className="acc-email">{acc.email}</div>
                </div>
                {(selectedAccount?.email === acc.email || (!selectedAccount && idx === 0)) && (
                  <Check size={16} className="check-icon" />
                )}
              </div>
            ))}

            <button className="add-account-btn" onClick={() => setIsAddingNew(true)}>
              <User size={16} /> Use another {isGoogle ? 'Google' : 'Apple'} account
            </button>
          </div>
        ) : (
          <form onSubmit={handleConfirmLogin} className="new-account-form">
            <div className="form-group">
              <label>Your Name</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Dr. Jane Doe"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
              />
            </div>
            <div className="form-group margin-top-xs">
              <label>{isGoogle ? 'Google' : 'Apple'} Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder={isGoogle ? 'doctor@gmail.com' : 'doctor@icloud.com'}
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                required
              />
            </div>
            <button type="button" className="text-btn" onClick={() => setIsAddingNew(false)}>
              ← Back to saved accounts
            </button>
          </form>
        )}

        {/* Actions */}
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleConfirmLogin} disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-xs">
                <span className="spinner"></span> Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-xs">
                Continue <ArrowRight size={16} />
              </span>
            )}
          </button>
        </div>

        {/* Footer info */}
        <div className="security-footer">
          <Lock size={12} />
          <span>Secure OAuth 2.0 Connection</span>
        </div>
      </div>

      <style>{`
        .social-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .social-modal-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border-radius: 16px;
          padding: 28px 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: modalPop 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .social-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .provider-badge {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
        }

        .close-btn:hover { background: #f1f5f9; color: #334155; }

        .title-area h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 2px;
        }

        .subtitle {
          font-size: 0.85rem;
          color: #64748b;
        }

        .scope-info {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 10px 12px;
          margin: 16px 0;
          font-size: 0.78rem;
          color: #166534;
        }

        .account-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        .account-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .account-item:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .account-item.active {
          border-color: #0d9488;
          background: #f0fdfa;
        }

        .avatar-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        .account-details { flex: 1; }
        .acc-name { font-size: 0.875rem; font-weight: 600; color: #0f172a; }
        .acc-email { font-size: 0.78rem; color: #64748b; }
        .check-icon { color: #0d9488; }

        .add-account-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px dashed #cbd5e1;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          width: 100%;
        }

        .add-account-btn:hover { background: #f8fafc; border-color: #94a3b8; }

        .new-account-form { margin-bottom: 20px; }
        .text-btn { background: none; border: none; color: #0d9488; font-size: 0.8rem; font-weight: 600; cursor: pointer; padding: 0; margin-top: 8px; }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          border-top: 1px solid #f1f5f9;
          padding-top: 16px;
        }

        .security-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.72rem;
          color: #94a3b8;
          margin-top: 16px;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid #ffffff;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

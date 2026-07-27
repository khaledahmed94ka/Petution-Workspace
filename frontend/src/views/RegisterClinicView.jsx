import React, { useState } from 'react';
import { Building2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RegisterClinicView = ({ onComplete }) => {
  const { registerClinic } = useApp();

  const [clinicName, setClinicName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState('Cairo');
  const [district, setDistrict] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('Second Plan (14-Day Free Trial)');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clinicName.trim() || !ownerName.trim()) {
      return alert('Please fill in clinic name and owner name.');
    }

    registerClinic({
      clinicName,
      ownerName,
      email,
      phone,
      governorate,
      district,
      plan: selectedPlan
    });

    alert(`Clinic workspace "${clinicName}" registered successfully! Launching workspace...`);
    if (onComplete) onComplete();
  };

  return (
    <div className="register-page-container">
      <div className="register-card">
        {/* Top Back Navigation Bar */}
        <div className="register-top-nav">
          {onComplete && (
            <button 
              type="button"
              className="btn-secondary text-xs"
              onClick={onComplete}
            >
              ← Back to Workspace
            </button>
          )}
        </div>

        {/* Header Logo */}
        <div className="register-header">
          <div className="brand-badge">
            <Building2 size={24} className="text-teal" />
            <span className="brand-title">Petution</span>
          </div>
          <h2>Register Your Clinic</h2>
          <p className="text-muted">Create your veterinary clinic workspace in under 60 seconds.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Clinic / Practice Name *</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="e.g. Petution Vet Clinic"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Owner / Practice Manager *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="Dr. Khaled ElGendy"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Work Email *</label>
              <input 
                type="email" 
                className="form-control"
                placeholder="doctor@clinic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="+20 100 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input 
                type="password" 
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Governorate</label>
              <select 
                className="form-control"
                value={governorate}
                onChange={(e) => setGovernorate(e.target.value)}
              >
                <option value="Cairo">Cairo</option>
                <option value="Giza">Giza</option>
                <option value="Alexandria">Alexandria</option>
              </select>
            </div>
            <div className="form-group">
              <label>District / City</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="District name"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
          </div>

          {/* Plan Selector */}
          <div className="form-group margin-top-xs">
            <label>Select Initial Subscription Plan</label>
            <div className="plan-radio-options">
              <label className={`plan-radio-card ${selectedPlan.includes('14-Day') ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="plan" 
                  checked={selectedPlan.includes('14-Day')}
                  onChange={() => setSelectedPlan('Second Plan (14-Day Free Trial)')}
                />
                <div className="plan-radio-info">
                  <span className="font-semibold">14-Day Free Trial</span>
                  <span className="text-xs text-muted">Up to 350 active patients & WhatsApp auto reminders</span>
                </div>
              </label>

              <label className={`plan-radio-card ${selectedPlan.includes('First Plan') ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="plan" 
                  checked={selectedPlan.includes('First Plan')}
                  onChange={() => setSelectedPlan('First Plan (150 Patients)')}
                />
                <div className="plan-radio-info">
                  <span className="font-semibold">First Plan (EGP 1,750/mo)</span>
                  <span className="text-xs text-muted">Up to 150 patients for small practice</span>
                </div>
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary btn-large margin-top-sm">
            Register & Launch Clinic Workspace <ArrowRight size={18} />
          </button>
        </form>

        <div className="register-footer">
          <ShieldCheck size={16} className="text-teal" />
          <span>Secure SSL Encryption • Instant Clinic Setup</span>
        </div>
      </div>

      <style>{`
        .register-page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #004d4d 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .register-card {
          background: #ffffff;
          border-radius: var(--radius-lg);
          max-width: 620px;
          width: 100%;
          padding: 36px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          position: relative;
        }

        .register-top-nav {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 12px;
        }

        .register-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--primary-teal-light);
          padding: 6px 16px;
          border-radius: 9999px;
          margin-bottom: 12px;
        }

        .brand-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--primary-teal);
        }

        .register-header h2 {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .btn-large {
          padding: 12px;
          font-size: 1rem;
          justify-content: center;
          border-radius: var(--radius-md);
        }

        .plan-radio-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 4px;
        }

        .plan-radio-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .plan-radio-card.active {
          border-color: var(--primary-teal);
          background: var(--primary-teal-light);
        }

        .plan-radio-info {
          display: flex;
          flex-direction: column;
        }

        .register-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
          font-size: 0.8rem;
          color: var(--text-muted);
          border-top: 1px solid var(--border-card);
          padding-top: 16px;
        }
      `}</style>
    </div>
  );
};

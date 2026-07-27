import React, { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BillingView = () => {
  const { pets, team } = useApp();
  const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'stepper'
  const [selectedPlan, setSelectedPlan] = useState('Second Plan');

  const plans = [
    {
      id: 'plan-1',
      name: 'First Plan',
      desc: 'Core clinic workspace for a smaller monthly patient volume.',
      members: '2 members',
      patients: '150 active patients',
      reminders: 'No WhatsApp / Manual reminders',
      price: 'EGP 1,750'
    },
    {
      id: 'plan-2',
      name: 'Second Plan',
      badge: 'Trial',
      desc: 'WhatsApp-enabled clinic operations with auto reminders.',
      members: '4 members',
      patients: '350 active patients',
      reminders: 'WhatsApp / 500 reminders',
      price: 'EGP 3,500'
    },
    {
      id: 'plan-3',
      name: 'Third Plan',
      desc: 'Higher patient volume, team capacity, and reminders.',
      members: '7 members',
      patients: '750 active patients',
      reminders: 'WhatsApp / 900 reminders',
      price: 'EGP 6,000'
    },
    {
      id: 'plan-4',
      name: 'Enterprise',
      desc: 'Contact Petution support at +201500339975.',
      members: 'Unlimited members',
      patients: 'Unlimited active patients',
      reminders: 'WhatsApp / Unlimited reminders',
      price: 'Contact +201500339975'
    }
  ];

  return (
    <div className="billing-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Billing</h2>
          <p className="text-muted">Manage your subscription, plan usage limits, and payment methods.</p>
        </div>
      </div>

      {viewMode === 'overview' ? (
        <>
          {/* Header Cards Grid */}
          <div className="metrics-grid-4 margin-bottom-lg">
            <div className="card">
              <span className="card-title">Current plan</span>
              <p className="text-xs text-muted">Second Plan ends Jul 31, 2026</p>
              <div className="card-value">Second Plan</div>
              <span className="badge badge-teal margin-top-xs">Trial</span>
            </div>
            <div className="card">
              <span className="card-title">Billing period</span>
              <p className="text-xs text-muted">Jul 24, 2026 to Aug 23, 2026</p>
              <div className="card-value">Enforced</div>
              <span className="text-xs text-muted">Usage current</span>
            </div>
            <div className="card">
              <span className="card-title">Request status</span>
              <div className="card-value">No open request</div>
              <span className="text-xs text-muted">Select a plan below to submit payment proof</span>
            </div>
          </div>

          {/* Usage Quotas */}
          <div className="card margin-bottom-lg">
            <h4 className="font-semibold">Usage limits</h4>
            <p className="text-xs text-muted margin-bottom-md">Active patients are pets with visits in the current billing period.</p>

            <div className="usage-grid">
              <div className="usage-item">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Active patients</span>
                  <span>{pets.length} / 350</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${(pets.length / 350) * 100}%` }} /></div>
              </div>

              <div className="usage-item">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Auto reminders</span>
                  <span>0 / 500</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: '0%' }} /></div>
              </div>

              <div className="usage-item">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Storage</span>
                  <span>0 KB / 3.0 GB</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: '0%' }} /></div>
              </div>

              <div className="usage-item">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Team members</span>
                  <span>{team.length} / 4</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${(team.length / 4) * 100}%` }} /></div>
              </div>
            </div>
          </div>

          {/* Subscription Banner */}
          <div className="card flex justify-between align-center">
            <div>
              <h4 className="font-semibold">Subscription management</h4>
              <p className="text-xs text-muted">Second Plan is active. Open management when you want to renew, upgrade, or downgrade.</p>
            </div>
            <button className="btn-primary" onClick={() => setViewMode('stepper')}>
              Manage subscription
            </button>
          </div>
        </>
      ) : (
        /* Stepper View */
        <div className="stepper-wrapper">
          <div className="stepper-header margin-bottom-lg">
            <button className="btn-secondary text-xs" onClick={() => setViewMode('overview')}>
              ← Back to overview
            </button>
          </div>

          <div className="plans-grid">
            {plans.map(plan => (
              <div 
                key={plan.id} 
                className={`card plan-card ${selectedPlan === plan.name ? 'selected' : ''}`}
                onClick={() => setSelectedPlan(plan.name)}
              >
                <div className="flex justify-between align-center">
                  <h3 className="font-bold">{plan.name}</h3>
                  {plan.badge && <span className="badge badge-teal">{plan.badge}</span>}
                </div>
                <p className="text-xs text-muted margin-top-xs">{plan.desc}</p>

                <div className="plan-features">
                  <div className="feature-item"><CheckCircle2 size={14} className="text-teal" /> {plan.members}</div>
                  <div className="feature-item"><CheckCircle2 size={14} className="text-teal" /> {plan.patients}</div>
                  <div className="feature-item"><CheckCircle2 size={14} className="text-teal" /> {plan.reminders}</div>
                </div>

                <div className="plan-price font-bold">{plan.price}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-end margin-top-lg">
            <button className="btn-primary" onClick={() => alert(`Plan ${selectedPlan} requested!`)}>
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        .usage-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .progress-bar {
          height: 6px;
          background: #f1f5f9;
          border-radius: 9999px;
          overflow: hidden;
          margin-top: 6px;
        }
        .progress-fill {
          height: 100%;
          background: var(--primary-teal);
          border-radius: 9999px;
        }
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .plan-card {
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .plan-card:hover {
          border-color: var(--primary-teal);
        }
        .plan-card.selected {
          border-color: var(--primary-teal);
          box-shadow: 0 0 0 2px var(--primary-teal-light);
        }
        .plan-features {
          margin: 16px 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 0.8rem;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .plan-price {
          font-size: 1.1rem;
          color: var(--text-main);
        }
        .margin-top-lg { margin-top: 24px; }
        .justify-end { justify-content: flex-end; }
        .align-center { align-items: center; }
      `}</style>
    </div>
  );
};

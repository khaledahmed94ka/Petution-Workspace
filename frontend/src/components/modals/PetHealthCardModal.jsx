import React from 'react';
import { X, Printer, Shield, Heart, Syringe, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PetHealthCardModal = ({ pet, onClose }) => {
  const { clients, settings } = useApp();

  if (!pet) return null;

  const owner = clients.find(c => pet.owners?.includes(c.id));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="health-card-container">
        {/* Top Header */}
        <div className="health-card-header">
          <div className="flex items-center gap-xs">
            <span style={{ fontSize: '1.5rem' }}>🐾</span>
            <div>
              <h4 style={{ margin: 0, color: '#0f172a' }}>{settings?.orgName || 'Petution Veterinary Center'}</h4>
              <span className="text-muted text-xs">Official Pet Medical Health Passport</span>
            </div>
          </div>
          <div className="no-print flex gap-xs">
            <button className="btn-secondary text-xs" onClick={handlePrint}><Printer size={14} /> Print Card</button>
            <button className="close-btn" onClick={onClose}><X size={18} /></button>
          </div>
        </div>

        {/* Card Main */}
        <div className="health-card-body">
          <div className="pet-main-hero">
            <div className="hero-emoji">{pet.species === 'cat' ? '🐱' : '🐶'}</div>
            <div className="hero-info">
              <h3>{pet.name}</h3>
              <span className="badge badge-teal">{pet.species.toUpperCase()} • {pet.breed || 'Mixed'}</span>
              <div className="text-xs text-muted margin-top-xs">
                Card #: <strong>{pet.cardNo || 'CRD-9982'}</strong> • Protocol: <strong>{pet.protocolNo || 'PRT-102'}</strong>
              </div>
            </div>
          </div>

          {/* Vitals Grid */}
          <div className="vitals-grid margin-top-md">
            <div className="vital-box">
              <span className="vital-label">Age & Gender</span>
              <strong className="vital-val">{pet.ageValue} {pet.ageUnit} • {pet.gender}</strong>
            </div>
            <div className="vital-box">
              <span className="vital-label">Blood Group</span>
              <strong className="vital-val text-teal">{pet.bloodGroup || 'Unspecified'}</strong>
            </div>
            <div className="vital-box">
              <span className="vital-label">Microchip ID</span>
              <strong className="vital-val font-mono">{pet.microchipNumber || 'Not Microchipped'}</strong>
            </div>
            <div className="vital-box">
              <span className="vital-label">Microchip Location</span>
              <strong className="vital-val">{pet.microchipLocation || 'N/A'}</strong>
            </div>
          </div>

          {/* Medical Indicators */}
          <div className="indicators-row margin-top-md">
            <div className={`indicator-pill ${pet.vaccinated ? 'active' : ''}`}>
              <Syringe size={14} /> Vaccinated: {pet.vaccinated ? 'Yes' : 'No'}
            </div>
            <div className={`indicator-pill ${pet.castrated ? 'active' : ''}`}>
              <Shield size={14} /> Neutered: {pet.castrated ? 'Yes' : 'No'}
            </div>
            <div className={`indicator-pill ${pet.deworming ? 'active' : ''}`}>
              <Heart size={14} /> Dewormed: {pet.deworming ? 'Yes' : 'No'}
            </div>
          </div>

          {pet.isAggressive && (
            <div className="alert-box margin-top-md">
              <AlertTriangle size={16} /> <strong>Caution:</strong> Aggressive Risk Patient — handle with care.
            </div>
          )}

          {/* Owner Info */}
          <div className="owner-box card margin-top-md">
            <div className="text-xs text-muted">PET OWNER RECORD</div>
            <strong style={{ fontSize: '0.95rem' }}>{owner ? owner.name : 'Unassigned Owner'}</strong>
            <div className="text-xs text-muted">{owner?.phones?.[0]?.phone || 'No phone'}</div>
          </div>
        </div>

        <div className="health-card-footer margin-top-md">
          <button className="btn-secondary no-print w-full" onClick={onClose}>Close Health Card</button>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999; padding: 20px;
        }
        .health-card-container {
          width: 100%; max-width: 480px; background: #ffffff;
          border-radius: 16px; padding: 24px; box-shadow: 0 25px 50px rgba(0,0,0,0.25);
        }
        .health-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
        .close-btn { background: none; border: none; color: #94a3b8; cursor: pointer; }
        .pet-main-hero { display: flex; align-items: center; gap: 16px; background: #f0fdfa; border: 1px solid #ccfbf1; padding: 16px; border-radius: 12px; }
        .hero-emoji { font-size: 2.2rem; }
        .vitals-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .vital-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; }
        .vital-label { font-size: 0.72rem; color: #64748b; display: block; }
        .vital-val { font-size: 0.85rem; color: #0f172a; margin-top: 2px; display: block; }
        .indicators-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .indicator-pill { display: flex; align-items: center; gap: 6px; background: #f1f5f9; color: #64748b; border-radius: 999px; padding: 4px 12px; font-size: 0.78rem; font-weight: 600; }
        .indicator-pill.active { background: #dcfce7; color: #15803d; }
        .alert-box { background: #fff1f2; border: 1px solid #fecdd3; color: #be123c; border-radius: 8px; padding: 10px 12px; font-size: 0.8rem; display: flex; align-items: center; gap: 8px; }
        .owner-box { padding: 12px; background: #f8fafc; }
        .margin-top-md { margin-top: 14px; }
        .margin-top-xs { margin-top: 4px; }
        .font-mono { font-family: monospace; }
        @media print { .no-print { display: none !important; } }
      `}</style>
    </div>
  );
};

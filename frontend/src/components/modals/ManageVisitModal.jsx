import React, { useState } from 'react';
import { X, Calendar, Clock, User, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ManageVisitModal = ({ visit, onClose }) => {
  const { pets, visits, setVisits, setActiveDrawer, setActiveModalItem } = useApp();

  const [visitState, setVisitState] = useState(visit?.state || 'scheduled');
  const [doctorName, setDoctorName] = useState(visit?.doctorName || 'Dr. Khaled ElGendy');
  const [reason, setReason] = useState(visit?.reason || '');

  if (!visit) return null;

  const pet = pets.find(p => p.id === visit.petId);

  const handleSave = (e) => {
    e.preventDefault();
    setVisits(prev => prev.map(v => v.id === visit.id ? { ...v, state: visitState, doctorName, reason } : v));
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h4 style={{ margin: 0 }}>Visit Details & Status</h4>
            <span className="text-muted text-xs">Visit ID: {visit.id}</span>
          </div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="modal-body">
          <div className="pet-info-box card margin-bottom-md flex items-center gap-sm">
            <span style={{ fontSize: '1.8rem' }}>{pet?.species === 'cat' ? '🐱' : '🐶'}</span>
            <div>
              <strong style={{ fontSize: '0.95rem' }}>{pet ? pet.name : 'Patient Pet'}</strong>
              <div className="text-muted text-xs">{pet?.breed || 'Species'} • {visit.visitType}</div>
            </div>
          </div>

          <div className="form-group margin-bottom-sm">
            <label>Visit Status</label>
            <select 
              className="form-control"
              value={visitState}
              onChange={(e) => setVisitState(e.target.value)}
            >
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group margin-bottom-sm">
            <label>Attending Veterinarian</label>
            <input 
              type="text" 
              className="form-control"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              required
            />
          </div>

          <div className="form-group margin-bottom-sm">
            <label>Reason / Clinical Notes</label>
            <textarea 
              className="form-control" 
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Primary reason for visit..."
            ></textarea>
          </div>

          <div className="modal-actions-row margin-top-md">
            <button 
              type="button" 
              className="btn-secondary text-xs flex items-center gap-xs"
              onClick={() => {
                onClose();
                setActiveModalItem(visit.id);
                setActiveDrawer('soapNote');
              }}
            >
              <FileText size={14} className="text-teal" /> Open SOAP Note & Rx
            </button>
            <div className="flex gap-xs">
              <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary">Save Changes</button>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999; padding: 20px;
        }
        .modal-card { width: 100%; max-width: 440px; background: #ffffff; border-radius: 16px; padding: 24px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .close-btn { background: none; border: none; color: #94a3b8; cursor: pointer; }
        .pet-info-box { padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; }
        .modal-actions-row { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 16px; }
        .margin-bottom-sm { margin-bottom: 12px; }
        .margin-bottom-md { margin-bottom: 16px; }
        .margin-top-md { margin-top: 16px; }
      `}</style>
    </div>
  );
};

import React from 'react';
import { X, Phone, MapPin, Tag, Calendar, MessageCircle, Dog, Cat, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ClientProfileModal = ({ client, onClose }) => {
  const { pets, setActiveDrawer, setActiveModalItem } = useApp();

  if (!client) return null;

  const primaryPhone = client.phones?.find(p => p.isPrimary) || client.phones?.[0];
  const clientPets = pets.filter(p => client.pets?.includes(p.id) || p.owners?.includes(client.id));

  return (
    <div className="modal-overlay">
      <div className="modal-card profile-card">
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-sm">
            <div className="avatar-badge">{client.name.charAt(0)}</div>
            <div>
              <h4 style={{ margin: 0 }}>{client.name}</h4>
              <span className="text-muted text-xs">Client ID: {client.id} • Registered {client.createdAt}</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Info Grid */}
        <div className="profile-body">
          <div className="info-section card">
            <h5 className="section-title">Contact & Address Details</h5>
            <div className="info-row">
              <Phone size={14} className="text-teal" />
              <span>{primaryPhone?.phone || 'No phone provided'}</span>
              {primaryPhone?.hasWhatsapp && (
                <a 
                  href={`https://wa.me/${primaryPhone.phone.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="whatsapp-pill"
                >
                  <MessageCircle size={12} /> WhatsApp
                </a>
              )}
            </div>
            <div className="info-row">
              <MapPin size={14} className="text-teal" />
              <span>{[client.street, client.district, client.governorate].filter(Boolean).join(', ') || 'No address stored'}</span>
            </div>
            <div className="info-row">
              <Calendar size={14} className="text-teal" />
              <span>Client Source: {client.source || 'Direct Registration'}</span>
            </div>
            <div className="info-row">
              <Tag size={14} className="text-teal" />
              <div className="flex gap-xs flex-wrap">
                {client.tags?.map((t, idx) => (
                  <span key={idx} className="badge badge-gray text-xs">{t}</span>
                )) || <span className="text-muted text-xs">No tags</span>}
              </div>
            </div>
          </div>

          {/* Owned Pets List */}
          <div className="pets-section card margin-top-md">
            <div className="flex justify-between items-center margin-bottom-sm">
              <h5 className="section-title" style={{ marginBottom: 0 }}>Registered Pets ({clientPets.length})</h5>
              <button 
                className="btn-secondary text-xs" 
                onClick={() => {
                  onClose();
                  setActiveDrawer('addPet');
                }}
              >
                <Plus size={14} /> Add Pet
              </button>
            </div>

            {clientPets.length === 0 ? (
              <p className="text-muted text-xs">No pets registered under this client profile.</p>
            ) : (
              <div className="pets-grid">
                {clientPets.map(pet => (
                  <div key={pet.id} className="pet-tile">
                    <div className="pet-tile-header">
                      <span className="pet-icon">{pet.species === 'cat' ? '🐱' : '🐶'}</span>
                      <div>
                        <strong className="pet-name">{pet.name}</strong>
                        <span className="pet-sub text-xs">{pet.breed || pet.species} • {pet.ageValue} {pet.ageUnit}</span>
                      </div>
                    </div>
                    <div className="pet-tile-actions margin-top-xs">
                      <button 
                        className="btn-secondary text-xs flex-1"
                        onClick={() => {
                          onClose();
                          setActiveModalItem(pet.id);
                          setActiveDrawer('petPassport');
                        }}
                      >
                        Passport
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer margin-top-md">
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999; padding: 20px;
        }
        .profile-card { width: 100%; max-width: 520px; background: #fff; border-radius: 16px; padding: 24px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .avatar-badge { width: 42px; height: 42px; border-radius: 50%; background: #0d9488; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; }
        .close-btn { background: none; border: none; color: #94a3b8; cursor: pointer; }
        .section-title { font-size: 0.9rem; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
        .info-row { display: flex; align-items: center; gap: 10px; font-size: 0.85rem; color: #334155; margin-bottom: 8px; }
        .whatsapp-pill { background: #dcfce7; color: #15803d; border-radius: 999px; padding: 2px 8px; font-size: 0.72rem; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 4px; }
        .pets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin-top: 8px; }
        .pet-tile { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; }
        .pet-tile-header { display: flex; items-center; gap: 8px; }
        .pet-icon { font-size: 1.4rem; }
        .pet-name { font-size: 0.85rem; display: block; }
        .pet-sub { color: #64748b; }
        .modal-footer { display: flex; justify-content: flex-end; }
        .margin-top-md { margin-top: 16px; }
        .margin-top-xs { margin-top: 6px; }
        .margin-bottom-sm { margin-bottom: 8px; }
        .flex-1 { flex: 1; }
      `}</style>
    </div>
  );
};

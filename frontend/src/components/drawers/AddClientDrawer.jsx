import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddClientDrawer = () => {
  const { setActiveDrawer, addClient, pets } = useApp();

  const [name, setName] = useState('');
  const [source, setSource] = useState('Select source');
  const [governorate, setGovernorate] = useState('Cairo');
  const [district, setDistrict] = useState('');
  const [street, setStreet] = useState('');
  const [phones, setPhones] = useState([
    { phone: '', label: 'Primary', isPrimary: true, hasWhatsapp: true }
  ]);
  const [selectedPets, setSelectedPets] = useState([]);

  const handleAddPhone = () => {
    setPhones([...phones, { phone: '', label: 'Secondary', isPrimary: false, hasWhatsapp: false }]);
  };

  const handleRemovePhone = (index) => {
    setPhones(phones.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter client owner name.');
    addClient({
      name,
      source,
      governorate,
      district,
      street,
      phones,
      tags: ['New Client'],
      pets: selectedPets
    });
    setActiveDrawer(null);
  };

  return (
    <div className="drawer-backdrop" onClick={() => setActiveDrawer(null)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <h3>Add client</h3>
            <p>Save client details, contact info, tags, and pet assignments.</p>
          </div>
          <button className="icon-btn" onClick={() => setActiveDrawer(null)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-body">
          <div className="form-group">
            <label>Pet owner name *</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="Client full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>How did you find us? *</label>
            <select 
              className="form-control"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="Select source">Select source</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Recommendation">Recommendation</option>
              <option value="Walk-in">Walk-in</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Governorate *</label>
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
              <label>District *</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="District name"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Street</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="Street name, building, or landmark"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>

          {/* Dynamic Phone Repeater */}
          <div className="form-group">
            <div className="flex justify-between align-center">
              <label>Phone numbers *</label>
              <button type="button" className="btn-secondary text-xs" onClick={handleAddPhone}>
                <Plus size={14} /> Add phone
              </button>
            </div>

            {phones.map((p, idx) => (
              <div key={idx} className="phone-repeater-row margin-top-xs">
                <div className="country-code-box">🇪🇬 +20</div>
                <input 
                  type="text" 
                  className="form-control flex-1"
                  placeholder="Enter phone number"
                  value={p.phone}
                  onChange={(e) => {
                    const newPhones = [...phones];
                    newPhones[idx].phone = e.target.value;
                    setPhones(newPhones);
                  }}
                />
                {phones.length > 1 && (
                  <button type="button" className="icon-btn text-red" onClick={() => handleRemovePhone(idx)}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="drawer-footer margin-top-auto">
            <button type="button" className="btn-secondary" onClick={() => setActiveDrawer(null)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create client
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .phone-repeater-row { display: flex; gap: 8px; align-items: center; }
        .country-code-box {
          padding: 8px 10px;
          background: #f1f5f9;
          border: 1px solid var(--border-card);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
        }
        .flex-1 { flex: 1; }
        .margin-top-auto { margin-top: auto; }
      `}</style>
    </div>
  );
};

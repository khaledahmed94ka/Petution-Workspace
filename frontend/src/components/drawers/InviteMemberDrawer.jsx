import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InviteMemberDrawer = () => {
  const { setActiveDrawer, inviteMember } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Vet');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return alert('Please fill in name and email address.');

    inviteMember({ name, email, role });
    alert(`Invitation sent to ${email} as ${role}!`);
    setActiveDrawer(null);
  };

  return (
    <div className="drawer-backdrop" onClick={() => setActiveDrawer(null)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <h3>Invite Team Member</h3>
            <p>Send an invitation to join Petution clinic workspace.</p>
          </div>
          <button className="icon-btn" onClick={() => setActiveDrawer(null)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-body">
          <div className="form-group">
            <label>Member Full Name *</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="e.g. Dr. Sarah Mahmoud"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input 
              type="email" 
              className="form-control"
              placeholder="sarah@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Assign Role *</label>
            <select 
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Vet">Vet / Practitioner</option>
              <option value="Receptionist">Receptionist / Staff</option>
              <option value="Admin">Billing Admin</option>
              <option value="Owner">Co-Owner</option>
            </select>
          </div>

          <div className="drawer-footer margin-top-auto">
            <button type="button" className="btn-secondary" onClick={() => setActiveDrawer(null)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

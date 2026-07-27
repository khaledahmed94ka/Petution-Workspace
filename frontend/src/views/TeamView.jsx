import React, { useState } from 'react';
import { UserPlus, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TeamView = () => {
  const { 
    team, 
    invitations, 
    setActiveDrawer, 
    updateMemberRole, 
    removeMember, 
    cancelInvitation 
  } = useApp();

  const [activeTab, setActiveTab] = useState('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredMembers = team.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || m.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleRoleChangePrompt = (member) => {
    const newRole = prompt(`Change role for ${member.name}:`, member.role);
    if (newRole && newRole !== member.role) {
      updateMemberRole(member.id, newRole);
      alert(`Role for ${member.name} updated to ${newRole}`);
    }
  };

  const handleRemoveMember = (member) => {
    if (window.confirm(`Are you sure you want to remove ${member.name} from clinic team?`)) {
      removeMember(member.id);
    }
  };

  return (
    <div className="team-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Team</h2>
          <p className="text-muted">Manage members, invitations, and roles for Petution.</p>
        </div>
        <button className="btn-primary" onClick={() => setActiveDrawer('inviteMember')}>
          <UserPlus size={18} />
          Invite member
        </button>
      </div>

      <div className="table-container">
        <div className="table-controls-stack">
          {/* Tabs Nav */}
          <div className="tab-nav">
            <button 
              className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
              onClick={() => setActiveTab('members')}
            >
              Members ({team.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'invitations' ? 'active' : ''}`}
              onClick={() => setActiveTab('invitations')}
            >
              Invitations ({invitations.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
              onClick={() => setActiveTab('roles')}
            >
              Roles & Permissions
            </button>
          </div>

          {activeTab === 'members' && (
            <div className="controls-row margin-top-sm flex justify-between align-center">
              <div className="search-input-wrapper">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search member" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select 
                className="form-control max-w-xs"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Role: all</option>
                <option value="owner">Owner</option>
                <option value="vet">Vet</option>
                <option value="receptionist">Receptionist</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
        </div>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr><td colSpan="3" className="empty-state">No team members found matching filter.</td></tr>
              ) : (
                filteredMembers.map(member => (
                  <tr key={member.id}>
                    <td>
                      <div className="member-cell">
                        <div className="avatar-circle">{member.name.split(' ').map(n=>n[0]).join('')}</div>
                        <div>
                          <div className="font-semibold">{member.name}</div>
                          <div className="text-muted text-xs">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        member.role === 'Owner' ? 'badge-amber' :
                        member.role === 'Vet' ? 'badge-teal' : 'badge-gray'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-xs">
                        <button className="btn-secondary text-xs" onClick={() => handleRoleChangePrompt(member)}>
                          Change Role
                        </button>
                        {member.role !== 'Owner' && (
                          <button className="btn-secondary text-xs text-red" onClick={() => handleRemoveMember(member)}>
                            Remove
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Invitations Tab */}
        {activeTab === 'invitations' && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Recipient Name</th>
                <th>Email</th>
                <th>Invited Role</th>
                <th>Sent Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invitations.length === 0 ? (
                <tr><td colSpan="6" className="empty-state">No pending team invitations.</td></tr>
              ) : (
                invitations.map(inv => (
                  <tr key={inv.id}>
                    <td className="font-semibold">{inv.name}</td>
                    <td>{inv.email}</td>
                    <td><span className="badge badge-teal">{inv.role}</span></td>
                    <td className="text-muted">{inv.sentAt}</td>
                    <td><span className="badge badge-amber">{inv.status}</span></td>
                    <td>
                      <div className="flex gap-xs">
                        <button className="btn-secondary text-xs" onClick={() => alert(`Invitation resent to ${inv.email}`)}>
                          Resend
                        </button>
                        <button className="btn-secondary text-xs text-red" onClick={() => cancelInvitation(inv.id)}>
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Roles & Permissions Tab */}
        {activeTab === 'roles' && (
          <div className="roles-grid p-lg">
            <div className="card role-card">
              <div className="role-card-header">
                <span className="badge badge-amber">Owner</span>
                <h4 className="font-bold margin-top-xs">Practice Owner</h4>
              </div>
              <p className="text-xs text-muted">Full administrative access to clinic settings, billing, team roles, and patient records.</p>
            </div>

            <div className="card role-card">
              <div className="role-card-header">
                <span className="badge badge-teal">Vet</span>
                <h4 className="font-bold margin-top-xs">Veterinarian / Practitioner</h4>
              </div>
              <p className="text-xs text-muted">Manage patient visits, health profiles, consultations, prescriptions, and medical notes.</p>
            </div>

            <div className="card role-card">
              <div className="role-card-header">
                <span className="badge badge-gray">Receptionist</span>
                <h4 className="font-bold margin-top-xs">Front Desk Staff</h4>
              </div>
              <p className="text-xs text-muted">Register clients and pets, manage daily visit queues, schedule appointments, and create invoices.</p>
            </div>

            <div className="card role-card">
              <div className="role-card-header">
                <span className="badge badge-gray">Admin</span>
                <h4 className="font-bold margin-top-xs">Billing Admin</h4>
              </div>
              <p className="text-xs text-muted">Manage inventory pricing, financial invoices, analytics reports, and billing subscriptions.</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .member-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .max-w-xs { max-width: 160px; }
        .justify-between { justify-content: space-between; }
        .align-center { align-items: center; }
        .controls-row { display: flex; gap: 16px; align-items: center; }
        .tab-nav {
          display: flex;
          gap: 12px;
          border-bottom: 1px solid var(--border-card);
          margin-top: 8px;
        }
        .tab-btn {
          padding: 8px 16px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-muted);
          border-bottom: 2px solid transparent;
        }
        .tab-btn.active {
          color: var(--primary-teal);
          border-bottom-color: var(--primary-teal);
        }
        .roles-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          padding: 24px;
        }
        .role-card {
          padding: 20px;
        }
        .p-lg { padding: 24px; }
      `}</style>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Camera, Download, Upload, Database, Trash2, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportSystemBackupJSON } from '../utils/dataExportImport';

export const SettingsView = () => {
  const { settings, setSettings, clients, pets, visits, products, invoices, importFullBackup, deleteWorkspace, activeWorkspaceId } = useApp();
  const [formData, setFormData] = useState({ ...settings });
  const [activeTab, setActiveTab] = useState('Organization');

  useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  const tabs = [
    'Organization',
    'Tags',
    'Prescription',
    'Pre-defined Prescriptions',
    'Integrations',
    'Reminders',
    'Online Booking',
    'Data Backup & Migration'
  ];

  const handleFullExportJSON = () => {
    const fullBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      clients,
      pets,
      visits,
      products,
      invoices
    };
    exportSystemBackupJSON(fullBackup, `petution_full_backup_${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleFullRestoreJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);
        importFullBackup(jsonData);
      } catch (err) {
        alert(`Failed to restore backup: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSettings(formData);
    alert('Organization settings saved successfully!');
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Settings</h2>
          <p className="text-muted">Manage organization settings and application tags.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-nav margin-bottom-lg">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Organization' ? (
        <div className="card settings-card">
          <div className="card-header-section">
            <h4 className="font-semibold">Organization Profile</h4>
            <p className="text-xs text-muted">Manage your organization details, slug, and avatar.</p>
          </div>

          <form onSubmit={handleSave} className="settings-form">
            <div className="avatar-upload-row">
              <div className="profile-avatar-circle">
                <span>{formData.orgName.charAt(0)}</span>
                <div className="camera-overlay">
                  <Camera size={14} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Organization Name</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.orgName}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Slug</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Website</label>
              <input 
                type="text" 
                className="form-control"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </form>

          {/* Danger Zone: Delete Clinic Workspace */}
          <div className="danger-zone-card margin-top-lg">
            <h4 className="font-semibold text-rose flex items-center gap-xs">
              <AlertTriangle size={18} /> Danger Zone: Delete Clinic Workspace
            </h4>
            <p className="text-xs text-muted margin-top-xs">
              Permanently remove this active clinic workspace ("{formData.orgName}"). This action cannot be undone.
            </p>
            <div className="margin-top-sm">
              <button 
                type="button" 
                className="btn-secondary text-rose border-rose"
                style={{ borderColor: '#e11d48', color: '#e11d48' }}
                onClick={() => {
                  if (confirm(`Are you sure you want to PERMANENTLY DELETE the clinic workspace "${formData.orgName}"?`)) {
                    deleteWorkspace(activeWorkspaceId);
                  }
                }}
              >
                <Trash2 size={16} /> Delete Clinic Workspace
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === 'Data Backup & Migration' ? (
        <div className="card settings-card">
          <div className="card-header-section">
            <h4 className="font-semibold flex items-center gap-xs">
              <Database size={20} className="text-teal" /> Full System Data Backup & Migration
            </h4>
            <p className="text-xs text-muted">Export complete clinic records or restore data from another clinic workspace.</p>
          </div>

          <div className="margin-top-md">
            <div className="card info-card margin-bottom-md">
              <h5 className="font-semibold">Full System Backup (.JSON)</h5>
              <p className="text-xs text-muted margin-top-xs">
                Downloads all Clients ({clients.length}), Pets ({pets.length}), Visits ({visits.length}), Products/Services ({products.length}), Invoices ({invoices.length}), and Clinic Settings into a single portable backup file.
              </p>
              <div className="margin-top-sm">
                <button className="btn-primary" onClick={handleFullExportJSON}>
                  <Download size={16} /> Export Full System Backup
                </button>
              </div>
            </div>

            <div className="card info-card">
              <h5 className="font-semibold">Restore / Import System Backup (.JSON)</h5>
              <p className="text-xs text-muted margin-top-xs">
                Upload a previously exported Petution `.json` backup file to restore all clinic data.
              </p>
              <div className="margin-top-sm" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <label className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Upload size={16} /> Choose Backup File
                  <input type="file" accept=".json" onChange={handleFullRestoreJSON} className="file-input-hidden" />
                </label>
                <span className="text-xs text-muted">Supports `.json` format</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card empty-state">
          {activeTab} configuration panel ready for customization.
        </div>
      )}

      <style>{`
        .settings-card { 
          max-width: 100%; 
        }
        .card-header-section { 
          padding-bottom: 12px; 
          margin-bottom: 16px; 
          border-bottom: 1px solid var(--border-card); 
        }
        .settings-form { 
          display: flex; 
          flex-direction: column; 
          gap: 14px; 
        }
        .avatar-upload-row { 
          display: flex; 
          justify-content: center; 
          margin-bottom: 8px; 
        }
        .profile-avatar-circle {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: #475569;
          position: relative;
          cursor: pointer;
        }
        .camera-overlay {
          position: absolute;
          bottom: 2px;
          right: 2px;
          background: #ffffff;
          border: 1px solid var(--border-card);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }
        .info-card {
          padding: 16px;
        }

        @media (min-width: 640px) {
          .settings-card {
            max-width: 680px;
          }
          .profile-avatar-circle {
            width: 80px;
            height: 80px;
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
};

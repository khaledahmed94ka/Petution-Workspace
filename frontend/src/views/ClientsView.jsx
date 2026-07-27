import React, { useState } from 'react';
import { Search, Plus, Filter, MessageCircle, Download, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToCSV } from '../utils/dataExportImport';
import { ClientProfileModal } from '../components/modals/ClientProfileModal';

export const ClientsView = () => {
  const { clients, pets, setActiveDrawer } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  const allTags = Array.from(new Set(clients.flatMap(c => c.tags || [])));

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phones?.some(p => p.phone?.includes(searchTerm));
    const matchesTag = selectedTag ? c.tags?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleExport = () => {
    const exportData = clients.map(c => ({
      ClientName: c.name,
      PrimaryPhone: c.phones?.[0]?.phone || '',
      Source: c.source,
      Governorate: c.governorate,
      District: c.district,
      Street: c.street,
      CreatedDate: c.createdAt
    }));
    exportToCSV(exportData, 'petution_clients_export.csv');
  };

  return (
    <div className="clients-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Clients</h2>
          <p className="text-muted">Manage client records for clinic: petution.</p>
        </div>
        <div className="flex gap-sm">
          <button className="btn-secondary" onClick={handleExport} title="Export Clients CSV">
            <Download size={16} /> Export CSV
          </button>
          <button className="btn-secondary" onClick={() => setActiveDrawer('importClients')} title="Import Clients CSV">
            <Upload size={16} /> Import CSV
          </button>
          <button className="btn-primary" onClick={() => setActiveDrawer('addClient')}>
            <Plus size={18} />
            Add Client
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid-4">
        <div className="card">
          <span className="card-title">Total Clients</span>
          <div className="card-value">{clients.length}</div>
          <span className="text-muted text-xs">Current filtered clients</span>
        </div>
        <div className="card">
          <span className="card-title">New Clients This Month</span>
          <div className="card-value">{clients.length}</div>
          <span className="badge badge-teal">~0%</span>
        </div>
        <div className="card">
          <span className="card-title">New Clients Today</span>
          <div className="card-value">0</div>
          <span className="badge badge-teal">~0%</span>
        </div>
        <div className="card">
          <span className="card-title">Clients With Pets</span>
          <div className="card-value">{clients.filter(c => c.pets && c.pets.length > 0).length}</div>
          <span className="text-muted text-xs">Owners with linked pets</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-container">
        <div className="table-controls">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <button className="btn-secondary" onClick={() => setShowTagFilter(!showTagFilter)}>
              <Filter size={16} />
              Filter tags {selectedTag && `(${selectedTag})`}
            </button>
            {showTagFilter && (
              <div style={{ position: 'absolute', top: '100%', right: 0, background: 'white', border: '1px solid #ccc', padding: '10px', zIndex: 10, minWidth: '150px', borderRadius: '4px', marginTop: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Select Tag</div>
                <div style={{ cursor: 'pointer', padding: '4px' }} onClick={() => { setSelectedTag(''); setShowTagFilter(false); }}>
                  All Tags
                </div>
                {allTags.map(tag => (
                  <div key={tag} style={{ cursor: 'pointer', padding: '4px', background: selectedTag === tag ? '#eee' : 'transparent', borderRadius: '4px' }} onClick={() => { setSelectedTag(tag); setShowTagFilter(false); }}>
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Pet Owner Name</th>
              <th>Primary Phone</th>
              <th>Tags</th>
              <th>Pets</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No clients found. Try changing search or tag filters.
                </td>
              </tr>
            ) : (
              filteredClients.map(client => {
                const primaryPhone = client.phones?.find(p => p.isPrimary) || client.phones?.[0];
                const clientPets = pets.filter(p => client.pets?.includes(p.id) || p.owners?.includes(client.id));
                return (
                  <tr key={client.id}>
                    <td className="font-semibold">{client.name}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{primaryPhone?.phone || '—'}</span>
                        {primaryPhone?.hasWhatsapp && (
                          <MessageCircle size={14} className="text-green" title="WhatsApp Enabled" />
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {client.tags?.map((t, idx) => (
                          <span key={idx} className="badge badge-gray">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      {clientPets.length > 0 ? (
                        clientPets.map(p => p.name).join(', ')
                      ) : (
                        <span className="text-muted">No pets</span>
                      )}
                    </td>
                    <td className="text-muted">{client.createdAt}</td>
                    <td>
                      <button 
                        className="btn-secondary text-xs"
                        onClick={() => setSelectedClient(client)}
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedClient && (
        <ClientProfileModal 
          client={selectedClient} 
          onClose={() => setSelectedClient(null)} 
        />
      )}
    </div>
  );
};

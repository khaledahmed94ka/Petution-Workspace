import React, { useState } from 'react';
import { Bell, Search, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RemindersView = () => {
  const { reminders, updateReminderStatus, clients, pets } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, completed

  const getClientDetails = (clientId) => clients.find(c => c.id === clientId) || {};
  const getPetDetails = (petId) => pets.find(p => p.id === petId) || {};

  const filteredReminders = reminders.filter(r => {
    const client = getClientDetails(r.clientId);
    const pet = getPetDetails(r.petId);
    
    const searchString = `${client.name || ''} ${pet.name || ''} ${r.productName || ''}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || r.status === filter;
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const handleWhatsApp = (client, reminder) => {
    if (!client.phones || client.phones.length === 0 || !client.phones[0].phone) {
      alert('No phone number found for this client.');
      return;
    }
    
    const phone = client.phones[0].phone.replace(/[^0-9+]/g, '');
    const message = `Hello ${client.name || 'there'}, it looks like ${getPetDetails(reminder.petId).name || 'your pet'} is due for a refill/booster of ${reminder.productName}. Would you like to schedule an appointment or order a refill?`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const isOverdue = (dateStr) => {
    return new Date(dateStr) < new Date() && new Date(dateStr).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="reminders-page">
      <div className="page-header">
        <div>
          <h2>Smart Reminders</h2>
          <p className="text-muted">Automated reminders for product refills and upcoming vaccinations.</p>
        </div>
      </div>

      <div className="metrics-grid-4">
        <div className="card">
          <span className="card-title">Total Pending</span>
          <div className="card-value">{reminders.filter(r => r.status === 'pending').length}</div>
          <span className="text-muted text-xs">Awaiting action</span>
        </div>
        <div className="card">
          <span className="card-title">Overdue</span>
          <div className="card-value text-red">{reminders.filter(r => r.status === 'pending' && isOverdue(r.dueDate)).length}</div>
          <span className="text-muted text-xs">Past due date</span>
        </div>
      </div>

      <div className="table-container">
        <div className="table-controls-stack">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by client, pet, or product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="tab-nav">
            <button 
              className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`tab-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`tab-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Pet</th>
              <th>Product / Service</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReminders.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">No reminders found.</td>
              </tr>
            ) : (
              filteredReminders.map(rem => {
                const client = getClientDetails(rem.clientId);
                const pet = getPetDetails(rem.petId);
                const overdue = isOverdue(rem.dueDate) && rem.status === 'pending';

                return (
                  <tr key={rem.id}>
                    <td className="font-semibold">{client.name || 'Unknown Client'}</td>
                    <td>{pet.name || 'Unknown Pet'}</td>
                    <td>{rem.productName}</td>
                    <td className={`font-semibold ${overdue ? 'text-red' : ''}`}>
                      {rem.dueDate} {overdue && '(Overdue)'}
                    </td>
                    <td>
                      {rem.status === 'completed' ? (
                        <span className="badge badge-teal">Completed</span>
                      ) : (
                        <span className="badge" style={{background: '#fef3c7', color: '#b45309'}}>Pending</span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-sm">
                        <button 
                          className="btn-secondary text-xs" 
                          style={{color: '#16a34a', borderColor: '#16a34a'}}
                          onClick={() => handleWhatsApp(client, rem)}
                          title="Send WhatsApp Message"
                        >
                          <MessageCircle size={14} /> WhatsApp
                        </button>
                        
                        {rem.status === 'pending' && (
                          <button 
                            className="btn-secondary text-xs"
                            onClick={() => updateReminderStatus(rem.id, 'completed')}
                            title="Mark as Completed"
                          >
                            <CheckCircle size={14} /> Done
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      <style>{`
        .text-red { color: #dc2626; font-weight: 700; }
        .flex { display: flex; }
        .gap-sm { gap: 8px; }
      `}</style>
    </div>
  );
};

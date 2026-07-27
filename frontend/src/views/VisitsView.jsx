import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ManageVisitModal } from '../components/modals/ManageVisitModal';

export const VisitsView = () => {
  const { visits, pets, setActiveDrawer, setActiveModalItem } = useApp();
  const [stateFilter, setStateFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedVisit, setSelectedVisit] = useState(null);

  const filteredVisits = visits.filter(visit => {
    if (stateFilter !== 'all' && visit.state !== stateFilter) return false;
    if (fromDate && visit.date < fromDate) return false;
    if (toDate && visit.date > toDate) return false;
    return true;
  });

  return (
    <div className="visits-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Visits</h2>
          <p className="text-muted">Track visit queue, progress, and outcomes for clinic: petution.</p>
        </div>
        <button className="btn-primary" onClick={() => setActiveDrawer('addVisit')}>
          <Plus size={18} />
          Add Visit
        </button>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid-4">
        <div className="card">
          <span className="card-title">Total Visits</span>
          <div className="card-value">{visits.length}</div>
          <span className="text-muted text-xs">All visits in this clinic</span>
        </div>
        <div className="card">
          <span className="card-title">New Visits This Month</span>
          <div className="card-value">{visits.length}</div>
          <span className="text-muted text-xs">Created this calendar month</span>
        </div>
        <div className="card">
          <span className="card-title">Completed Visits Today</span>
          <div className="card-value">{visits.filter(v => v.state === 'completed').length}</div>
          <span className="text-muted text-xs">Resets daily at 12:00 AM</span>
        </div>
        <div className="card">
          <span className="card-title">Upcoming Visits</span>
          <div className="card-value">{visits.filter(v => v.state === 'scheduled').length}</div>
          <span className="badge badge-teal">Scheduled</span>
        </div>
      </div>

      {/* Booking Confirmations Banner */}
      <div className="card info-box margin-bottom-md">
        <h4 className="font-semibold">Online Booking Confirmations</h4>
        <p className="text-muted text-xs">Review pending online bookings and confirm or reject them.</p>
        <div className="empty-subtext">No pending online booking confirmations.</div>
      </div>

      {/* Table & Filters */}
      <div className="table-container">
        <div className="filter-bar">
          <div className="form-group">
            <label>Filter by state</label>
            <select 
              className="form-control"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
            >
              <option value="all">all</option>
              <option value="scheduled">scheduled</option>
              <option value="in-progress">in-progress</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label>From date</label>
            <input 
              type="date" 
              className="form-control"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>To date</label>
            <input 
              type="date" 
              className="form-control"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <button className="btn-secondary self-end" onClick={() => { setStateFilter('all'); setFromDate(''); setToDate(''); }}>
            Clear filters
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Visit Date</th>
              <th>Pet Name</th>
              <th>Doctor Name</th>
              <th>Visit Type</th>
              <th>Visit State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVisits.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No visits found. Create a visit to start managing clinic queue.
                </td>
              </tr>
            ) : (
              filteredVisits.map(visit => {
                const pet = pets.find(p => p.id === visit.petId);
                return (
                  <tr key={visit.id}>
                    <td>{visit.date} {visit.time}</td>
                    <td className="font-semibold">{pet ? pet.name : 'Unknown Pet'}</td>
                    <td>{visit.doctorName}</td>
                    <td>{visit.visitType}</td>
                    <td>
                      <span className={`badge ${
                        visit.state === 'scheduled' ? 'badge-teal' :
                        visit.state === 'in-progress' ? 'badge-amber' :
                        visit.state === 'completed' ? 'badge-gray' : 'badge-rose'
                      }`}>
                        {visit.state}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-xs">
                        <button 
                          className="btn-secondary text-xs flex items-center gap-xs"
                          onClick={() => {
                            setActiveModalItem(visit.id);
                            setActiveDrawer('soapNote');
                          }}
                        >
                          <FileText size={14} className="text-teal" /> SOAP / Rx
                        </button>
                        <button 
                          className="btn-secondary text-xs"
                          onClick={() => setSelectedVisit(visit)}
                        >
                          Manage Visit
                        </button>
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
        .margin-bottom-md { margin-bottom: 24px; }
        .info-box { padding: 16px 20px; }
        .empty-subtext { font-size: 0.85rem; color: var(--text-muted); margin-top: 8px; }
        .filter-bar {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-card);
          display: flex;
          gap: 16px;
          align-items: flex-end;
        }
        .self-end { align-self: flex-end; }
      `}</style>

      {selectedVisit && (
        <ManageVisitModal 
          visit={selectedVisit} 
          onClose={() => setSelectedVisit(null)} 
        />
      )}
    </div>
  );
};

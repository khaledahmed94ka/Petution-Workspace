import React, { useState } from 'react';
import { X, Printer, Plus, ShieldCheck, Cpu, Calendar, Syringe, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PetPassportDrawer = ({ petId }) => {
  const { setActiveDrawer, pets, clients, vaccines, deleteVaccine, settings } = useApp();
  const pet = pets.find(p => p.id === petId) || pets[0];
  const owner = clients.find(c => pet?.owners?.includes(c.id));

  const petVaccines = vaccines.filter(v => v.petId === pet?.id);

  const handlePrint = () => {
    window.print();
  };

  if (!pet) return null;

  return (
    <div className="drawer-backdrop" onClick={() => setActiveDrawer(null)}>
      <div className="drawer-panel passport-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Controls (Hidden during print) */}
        <div className="drawer-header no-print">
          <div>
            <h3 className="flex items-center gap-xs">
              <Syringe size={20} className="text-teal" /> Digital Pet Passport & Vaccine Card
            </h3>
            <p>Official immunization record and medical identity passport.</p>
          </div>
          <div className="flex gap-xs">
            <button className="btn-secondary text-xs flex items-center gap-xs" onClick={handlePrint}>
              <Printer size={16} /> Print Passport
            </button>
            <button className="icon-btn" onClick={() => setActiveDrawer(null)}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Passport Content (Printable Area) */}
        <div className="drawer-body passport-body">
          <div className="passport-card">
            {/* Clinic Branding Header */}
            <div className="passport-clinic-header">
              <div className="flex items-center gap-sm">
                <div className="passport-logo-circle">🐾</div>
                <div>
                  <h2 className="font-bold text-lg">{settings.orgName || 'Petution Veterinary Center'}</h2>
                  <p className="text-xs opacity-90">{settings.address || 'Cairo, Egypt'} • {settings.phone || '+20 100 000 0000'}</p>
                </div>
              </div>
              <div className="passport-badge-tag">OFFICIAL VACCINE PASSPORT</div>
            </div>

            {/* Pet & Owner Identity Section */}
            <div className="passport-identity-grid">
              <div className="pet-photo-avatar">
                <span>{pet.species === 'dog' ? '🐶' : pet.species === 'cat' ? '🐱' : '🐾'}</span>
              </div>

              <div className="pet-main-details">
                <h3 className="font-bold text-xl">{pet.name}</h3>
                <p className="text-xs text-muted">
                  {pet.species.toUpperCase()} • {pet.breed || 'Cross Breed'} • {pet.gender.toUpperCase()}
                </p>

                <div className="passport-tags-row margin-top-xs">
                  <span className="passport-tag"><Cpu size={12} /> Chip: {pet.microchipNumber || 'Not Chipped'}</span>
                  <span className="passport-tag">Blood: {pet.bloodGroup || 'Unspecified'}</span>
                  <span className="passport-tag">Neutered: {pet.castrated ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className="owner-side-info border-left pl-md">
                <span className="text-xs text-muted block">REGISTERED OWNER</span>
                <span className="font-semibold text-sm block">{owner ? owner.name : 'Unassigned'}</span>
                <span className="text-xs text-muted block margin-top-xs">{owner?.phones?.[0]?.phone || 'No phone'}</span>
                <span className="text-xs text-muted block">Card #: {pet.cardNo || 'CRD-AUTO'}</span>
              </div>
            </div>

            {/* Vaccine Records Table */}
            <div className="passport-section-title flex justify-between items-center margin-top-lg">
              <h4 className="font-bold flex items-center gap-xs text-sm">
                <ShieldCheck size={16} className="text-teal" /> Immunization & Vaccination History
              </h4>
              <button 
                className="btn-primary text-xs no-print"
                onClick={() => setActiveDrawer('addVaccine')}
              >
                <Plus size={14} /> Record Vaccine Shot
              </button>
            </div>

            <table className="passport-table margin-top-sm">
              <thead>
                <tr>
                  <th>Date Given</th>
                  <th>Vaccine Name & Manufacturer</th>
                  <th>Batch / Serial #</th>
                  <th>Next Due Date</th>
                  <th>Administered By</th>
                  <th className="no-print">Action</th>
                </tr>
              </thead>
              <tbody>
                {petVaccines.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No immunization records logged yet. Click "+ Record Vaccine Shot" to add doses.
                    </td>
                  </tr>
                ) : (
                  petVaccines.map(vac => (
                    <tr key={vac.id}>
                      <td className="font-semibold">{vac.administeredDate}</td>
                      <td>
                        <div className="font-bold text-sm">{vac.vaccineName}</div>
                        <span className="text-xs text-muted">{vac.manufacturer || 'Authorized Vet Spec'}</span>
                      </td>
                      <td className="font-mono text-xs">{vac.batchNumber || 'N/A'}</td>
                      <td>
                        <span className="badge badge-amber text-xs font-semibold">
                          <Calendar size={12} /> {vac.dueDate || '1 Year'}
                        </span>
                      </td>
                      <td className="text-xs">{vac.vetName || 'Dr. Khaled ElGendy'}</td>
                      <td className="no-print">
                        <button 
                          className="icon-btn text-rose"
                          title="Delete Vaccine Record"
                          onClick={() => {
                            if (confirm(`Delete vaccine record for ${vac.vaccineName}?`)) {
                              deleteVaccine(vac.id);
                            }
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Official Stamp & Signature Block */}
            <div className="passport-footer-stamp margin-top-xl">
              <div>
                <div className="stamp-box">CLINIC OFFICIAL STAMP</div>
              </div>
              <div className="text-right">
                <div className="sig-line">Dr. Khaled ElGendy, DVM</div>
                <span className="text-xs text-muted">Licensed Veterinary Surgeon</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .passport-panel { max-width: 720px; }
        .passport-card {
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: var(--radius-md);
          padding: 24px;
        }
        .passport-clinic-header {
          background: var(--primary-teal);
          color: #ffffff;
          padding: 16px 20px;
          border-radius: var(--radius-md);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .passport-logo-circle {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
        }
        .passport-badge-tag {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          background: rgba(255, 255, 255, 0.25);
          padding: 4px 10px;
          border-radius: 9999px;
        }
        .passport-identity-grid {
          display: flex;
          gap: 16px;
          background: #f8fafc;
          padding: 16px;
          border-radius: var(--radius-md);
          border: 1px solid #e2e8f0;
        }
        .pet-photo-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          flex-shrink: 0;
        }
        .pet-main-details { flex: 1; }
        .passport-tags-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .passport-tag {
          font-size: 0.7rem;
          font-weight: 600;
          background: #ffffff;
          border: 1px solid #cbd5e1;
          padding: 2px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .border-left { border-left: 1px solid #cbd5e1; }
        .pl-md { padding-left: 16px; }
        .passport-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        .passport-table th {
          background: #f1f5f9;
          text-align: left;
          padding: 8px 10px;
          font-size: 0.75rem;
          color: var(--text-muted);
          border-bottom: 2px solid #cbd5e1;
        }
        .passport-table td {
          padding: 10px;
          border-bottom: 1px solid #e2e8f0;
        }
        .passport-footer-stamp {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-top: 20px;
          border-top: 2px dashed #cbd5e1;
        }
        .stamp-box {
          width: 140px;
          height: 60px;
          border: 2px dashed var(--primary-teal);
          color: var(--primary-teal);
          font-size: 0.65rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
        }
        .sig-line {
          font-weight: 700;
          font-size: 0.9rem;
          border-top: 1px solid #000;
          padding-top: 4px;
          min-width: 180px;
        }
        @media print {
          .no-print { display: none !important; }
          .drawer-backdrop { background: none; position: static; }
          .drawer-panel { max-width: 100%; box-shadow: none; border: none; }
          body { background: #ffffff; }
        }
      `}</style>
    </div>
  );
};

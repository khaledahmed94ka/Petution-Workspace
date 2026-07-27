import React, { useState } from 'react';
import { Search, Plus, Download, Upload, ShieldAlert, Cpu, HeartOff, Syringe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToCSV } from '../utils/dataExportImport';
import { PetHealthCardModal } from '../components/modals/PetHealthCardModal';

export const PetsView = () => {
  const { pets, clients, setActiveDrawer, setActiveModalItem } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('All');
  const [selectedPetForCard, setSelectedPetForCard] = useState(null);

  const speciesOptions = ['All', 'Cat', 'Dog', 'Turtle', 'Bird', 'Other'];

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (pet.microchipNumber && pet.microchipNumber.includes(searchTerm)) ||
                          (pet.cardNo && pet.cardNo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecies = selectedSpecies === 'All' || pet.species.toLowerCase() === selectedSpecies.toLowerCase();
    return matchesSearch && matchesSpecies;
  });

  const handleExport = () => {
    const exportData = pets.map(p => {
      const owner = clients.find(c => p.owners?.includes(c.id));
      return {
        PetName: p.name,
        Species: p.species,
        Breed: p.breed || '',
        Color: p.color || '',
        Age: `${p.ageValue} ${p.ageUnit}`,
        BloodGroup: p.bloodGroup || 'Unspecified',
        MicrochipNumber: p.microchipNumber || '',
        MicrochipDate: p.microchipDate || '',
        MicrochipLocation: p.microchipLocation || '',
        CardNo: p.cardNo || '',
        ProtocolNo: p.protocolNo || '',
        Vaccinated: p.vaccinated ? 'Yes' : 'No',
        Deworming: p.deworming ? 'Yes' : 'No',
        Antiflea: p.antiflea ? 'Yes' : 'No',
        Neutered: p.castrated ? 'Yes' : 'No',
        NeuteredDate: p.neuterDate || '',
        Aggressive: p.isAggressive ? 'Yes' : 'No',
        Deceased: p.isDeceased ? 'Yes' : 'No',
        DeathDate: p.deathDate || '',
        OwnerName: owner ? owner.name : 'Unassigned',
        CreatedDate: p.createdAt
      };
    });
    exportToCSV(exportData, 'petution_pets_export.csv');
  };

  return (
    <div className="pets-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2>Pets</h2>
          <p className="text-muted">Manage patient profiles, microchip records, and health cards.</p>
        </div>
        <div className="flex gap-sm">
          <button className="btn-secondary" onClick={handleExport} title="Export Pets CSV">
            <Download size={16} /> Export CSV
          </button>
          <button className="btn-secondary" onClick={() => setActiveDrawer('importPets')} title="Import Pets CSV">
            <Upload size={16} /> Import CSV
          </button>
          <button className="btn-primary" onClick={() => setActiveDrawer('addPet')}>
            <Plus size={18} />
            Add Pet
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid-4 margin-bottom-lg">
        <div className="card">
          <span className="card-title">Total Pets Registered</span>
          <div className="card-value">{pets.length}</div>
          <span className="text-muted text-xs">Patients in database</span>
        </div>
        <div className="card">
          <span className="card-title">Microchipped Patients</span>
          <div className="card-value">{pets.filter(p => p.microchipNumber).length}</div>
          <span className="badge badge-teal">
            {pets.length ? Math.round((pets.filter(p => p.microchipNumber).length / pets.length) * 100) : 0}% chipped
          </span>
        </div>
        <div className="card">
          <span className="card-title">High Risk / Aggressive</span>
          <div className="card-value text-rose">{pets.filter(p => p.isAggressive).length}</div>
          <span className="text-muted text-xs">Caution flag required</span>
        </div>
        <div className="card">
          <span className="card-title">Neutered / Spayed</span>
          <div className="card-value">{pets.filter(p => p.castrated).length}</div>
          <span className="text-muted text-xs">Sterilization complete</span>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="table-container">
        <div className="table-controls-stack">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name, microchip #, or card #"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-xs" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
            {speciesOptions.map(spec => (
              <button
                key={spec}
                className={`btn-chip ${selectedSpecies === spec ? 'active' : ''}`}
                onClick={() => setSelectedSpecies(spec)}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Pet Name</th>
              <th>Owner Name</th>
              <th>Species & Breed</th>
              <th>Microchip / Identification</th>
              <th>Health & Flags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPets.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No pets found. Try changing filters or search.
                </td>
              </tr>
            ) : (
              filteredPets.map(pet => {
                const owner = clients.find(c => pet.owners?.includes(c.id));
                return (
                  <tr key={pet.id} className={pet.isDeceased ? 'row-deceased' : ''}>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-semibold flex items-center gap-xs">
                          {pet.name}
                          {pet.isDeceased && <span className="badge badge-rose text-xs"><HeartOff size={12} /> Deceased</span>}
                        </span>
                        <span className="text-xs text-muted">{pet.ageValue} {pet.ageUnit} • {pet.gender}</span>
                      </div>
                    </td>
                    <td>{owner ? owner.name : <span className="text-muted">Unassigned</span>}</td>
                    <td>
                      <span className="badge badge-teal">{pet.species.toUpperCase()}</span>
                      {pet.breed && <span className="text-muted text-xs margin-left-xs">({pet.breed})</span>}
                    </td>
                    <td>
                      {pet.microchipNumber ? (
                        <div className="flex items-center gap-xs text-xs font-mono">
                          <Cpu size={14} className="text-teal" />
                          <span>{pet.microchipNumber}</span>
                        </div>
                      ) : (
                        <span className="text-muted text-xs">No microchip</span>
                      )}
                      {pet.cardNo && <div className="text-xs text-muted">Card: {pet.cardNo}</div>}
                    </td>
                    <td>
                      <div className="flex gap-xs flex-wrap">
                        {pet.isAggressive && (
                          <span className="badge badge-rose text-xs font-bold" title="High Risk - Handle with Caution">
                            <ShieldAlert size={12} /> Aggressive
                          </span>
                        )}
                        {pet.vaccinated && <span className="badge badge-gray text-xs">Vaccinated</span>}
                        {pet.castrated && <span className="badge badge-gray text-xs">Neutered</span>}
                        {pet.bloodGroup && pet.bloodGroup !== 'Unspecified' && (
                          <span className="badge badge-teal text-xs">Blood: {pet.bloodGroup}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-xs">
                        <button 
                          className="btn-secondary text-xs flex items-center gap-xs"
                          onClick={() => {
                            setActiveModalItem(pet.id);
                            setActiveDrawer('petPassport');
                          }}
                        >
                          <Syringe size={14} className="text-teal" /> Passport
                        </button>
                        <button 
                          className="btn-secondary text-xs"
                          onClick={() => setSelectedPetForCard(pet)}
                        >
                          Health Card
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
        .margin-left-xs { margin-left: 6px; }
        .text-rose { color: #e11d48; }
        .badge-rose { background: #ffe4e6; color: #e11d48; border: 1px solid #fecdd3; }
        .row-deceased { opacity: 0.65; background: #fafafa; }
      `}</style>

      {selectedPetForCard && (
        <PetHealthCardModal 
          pet={selectedPetForCard} 
          onClose={() => setSelectedPetForCard(null)} 
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { X, ShieldAlert, HeartOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddPetDrawer = () => {
  const { setActiveDrawer, addPet, clients } = useApp();

  const [name, setName] = useState('');
  const [ageValue, setAgeValue] = useState(1);
  const [ageUnit, setAgeUnit] = useState('years');
  const [species, setSpecies] = useState('cat');
  const [gender, setGender] = useState('male');
  const [vaccinated, setVaccinated] = useState(true);
  const [deworming, setDeworming] = useState(false);
  const [antiflea, setAntiflea] = useState(false);
  const [castrated, setCastrated] = useState(false);
  const [neuterDate, setNeuterDate] = useState('');
  const [breed, setBreed] = useState('');
  const [color, setColor] = useState('');
  const [temperament, setTemperament] = useState('Calm');
  const [bloodGroup, setBloodGroup] = useState('Unspecified');
  const [cardNo, setCardNo] = useState('');
  const [protocolNo, setProtocolNo] = useState('');
  const [microchipNumber, setMicrochipNumber] = useState('');
  const [microchipDate, setMicrochipDate] = useState('');
  const [microchipLocation, setMicrochipLocation] = useState('');
  const [isAggressive, setIsAggressive] = useState(false);
  const [isDeceased, setIsDeceased] = useState(false);
  const [deathDate, setDeathDate] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');
  const [selectedOwner, setSelectedOwner] = useState(clients[0]?.id || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter pet name.');
    addPet({
      name,
      ageValue: Number(ageValue) || 1,
      ageUnit,
      species,
      gender,
      vaccinated,
      deworming,
      antiflea,
      castrated,
      neuterDate,
      breed,
      color,
      temperament,
      bloodGroup,
      cardNo,
      protocolNo,
      microchipNumber,
      microchipDate,
      microchipLocation,
      isAggressive,
      isDeceased: Boolean(deathDate) || isDeceased,
      deathDate,
      privateNotes,
      tags: isAggressive ? ['Aggressive / Handle with Caution'] : [],
      nutrition: ['Dry food'],
      owners: selectedOwner ? [selectedOwner] : []
    });
    setActiveDrawer(null);
  };

  return (
    <div className="drawer-backdrop" onClick={() => setActiveDrawer(null)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <h3>Add pet</h3>
            <p>Manage pet profile, identification, microchip, and medical info.</p>
          </div>
          <button className="icon-btn" onClick={() => setActiveDrawer(null)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-body">
          {/* Owner & Basic Info Section */}
          <div className="form-group">
            <label>Customer / Owner *</label>
            <select 
              className="form-control"
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              required
            >
              <option value="">Select a Customer</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Pet name *</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="e.g. Milo, Rocky"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Species *</label>
              <select 
                className="form-control"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
              >
                <option value="cat">Cat</option>
                <option value="dog">Dog</option>
                <option value="turtle">Turtle</option>
                <option value="bird">Bird</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Breed</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="Unspecified / Persian"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <div className="flex gap-xs">
                <input 
                  type="number" 
                  className="form-control"
                  value={ageValue}
                  onChange={(e) => setAgeValue(e.target.value)}
                />
                <select 
                  className="form-control"
                  value={ageUnit}
                  onChange={(e) => setAgeUnit(e.target.value)}
                >
                  <option value="years">years</option>
                  <option value="months">months</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select 
                className="form-control"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Color</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. Golden, White"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Blood Group</label>
              <select 
                className="form-control"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="Unspecified">Unspecified</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="DEA 1.1+">DEA 1.1+</option>
                <option value="DEA 1.1-">DEA 1.1-</option>
              </select>
            </div>
          </div>

          {/* Microchip & Identification Section */}
          <div className="card-section-label">MICROCHIP & IDENTIFICATION</div>

          <div className="form-group">
            <label>Microchip Number</label>
            <input 
              type="text" 
              className="form-control font-mono"
              placeholder="e.g. 985141002938471"
              value={microchipNumber}
              onChange={(e) => setMicrochipNumber(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Microchip Implant Date</label>
              <input 
                type="date" 
                className="form-control"
                value={microchipDate}
                onChange={(e) => setMicrochipDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Implant Location</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. Left Scapular"
                value={microchipLocation}
                onChange={(e) => setMicrochipLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Card Number</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. CRD-9982"
                value={cardNo}
                onChange={(e) => setCardNo(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Protocol Number</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. PRT-102"
                value={protocolNo}
                onChange={(e) => setProtocolNo(e.target.value)}
              />
            </div>
          </div>

          {/* Medical & Behavioral Section */}
          <div className="card-section-label">MEDICAL STATUS & BEHAVIOR</div>

          <div className="form-row">
            <div className="form-group">
              <label>Neutered / Spayed</label>
              <select 
                className="form-control"
                value={castrated ? 'yes' : 'no'}
                onChange={(e) => setCastrated(e.target.value === 'yes')}
              >
                <option value="no">Unspecified / No</option>
                <option value="yes">Yes (Neutered/Spayed)</option>
              </select>
            </div>
            {castrated && (
              <div className="form-group">
                <label>Neutering Date</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={neuterDate}
                  onChange={(e) => setNeuterDate(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Temperament</label>
              <select 
                className="form-control"
                value={temperament}
                onChange={(e) => setTemperament(e.target.value)}
              >
                <option value="Calm">Calm</option>
                <option value="Playful">Playful</option>
                <option value="Shy">Shy</option>
                <option value="Friendly">Friendly</option>
              </select>
            </div>

            <div className="form-group flex items-center gap-xs" style={{ marginTop: '26px' }}>
              <input 
                type="checkbox" 
                id="aggro-toggle"
                checked={isAggressive}
                onChange={(e) => setIsAggressive(e.target.checked)}
              />
              <label htmlFor="aggro-toggle" className="font-semibold text-xs flex items-center gap-xs text-rose" style={{ margin: 0, cursor: 'pointer' }}>
                <ShieldAlert size={14} /> Aggressive / High Risk Flag
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Vaccinated</label>
              <select 
                className="form-control"
                value={vaccinated ? 'yes' : 'no'}
                onChange={(e) => setVaccinated(e.target.value === 'yes')}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Deworming</label>
              <select 
                className="form-control"
                value={deworming ? 'yes' : 'no'}
                onChange={(e) => setDeworming(e.target.value === 'yes')}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>

          {/* Notes & Lifecycle Section */}
          <div className="card-section-label">NOTES & LIFECYCLE</div>

          <div className="form-group">
            <label className="flex items-center gap-xs">
              Private Notes <span className="badge badge-gray text-xs">Private</span>
            </label>
            <textarea 
              className="form-control"
              rows="3"
              placeholder="Clinical notes, allergies, diet preferences (Internal only)"
              value={privateNotes}
              onChange={(e) => setPrivateNotes(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="flex items-center gap-xs text-muted">
              <HeartOff size={14} /> Death Date (Deceased Marking)
            </label>
            <input 
              type="date" 
              className="form-control"
              value={deathDate}
              onChange={(e) => setDeathDate(e.target.value)}
            />
            <span className="text-xs text-muted margin-top-xs" style={{ display: 'block' }}>
              If you enter the death date, the pet will be marked as deceased and all related records will be automatically stopped.
            </span>
          </div>

          <div className="drawer-footer margin-top-auto">
            <button type="button" className="btn-secondary" onClick={() => setActiveDrawer(null)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create pet
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .card-section-label {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--text-light);
          margin: 18px 0 10px;
          padding-bottom: 4px;
          border-bottom: 1px dashed var(--border-card);
        }
        .text-rose { color: #e11d48; }
        .font-mono { font-family: monospace; letter-spacing: 0.03em; }
      `}</style>
    </div>
  );
};

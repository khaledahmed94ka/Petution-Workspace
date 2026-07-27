import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddItemDrawer = () => {
  const { setActiveDrawer, addProduct, updateProduct, deleteProduct, activeModalItem, setActiveModalItem } = useApp();

  const isEditing = Boolean(activeModalItem?.id);

  const [type, setType] = useState(activeModalItem?.type || 'product');
  const [name, setName] = useState(activeModalItem?.name || '');
  const [unitType, setUnitType] = useState(activeModalItem?.unitType || 'Piece');
  const [pricingUnit, setPricingUnit] = useState(activeModalItem?.pricingUnit || 'Piece');
  const [pricePerUnit, setPricePerUnit] = useState(activeModalItem?.pricePerUnit ?? 100);
  const [costPerUnit, setCostPerUnit] = useState(activeModalItem?.costPerUnit ?? 50);
  const [quantity, setQuantity] = useState(activeModalItem?.quantity ?? 10);
  const [alertThreshold, setAlertThreshold] = useState(activeModalItem?.alertThreshold ?? 5);
  const [reminderDays, setReminderDays] = useState(activeModalItem?.reminderDays || '');
  const [notes, setNotes] = useState(activeModalItem?.notes || '');

  useEffect(() => {
    if (activeModalItem) {
      setType(activeModalItem.type || 'product');
      setName(activeModalItem.name || '');
      setUnitType(activeModalItem.unitType || 'Piece');
      setPricingUnit(activeModalItem.pricingUnit || 'Piece');
      setPricePerUnit(activeModalItem.pricePerUnit ?? 100);
      setCostPerUnit(activeModalItem.costPerUnit ?? 50);
      setQuantity(activeModalItem.quantity ?? 10);
      setAlertThreshold(activeModalItem.alertThreshold ?? 5);
      setReminderDays(activeModalItem.reminderDays || '');
      setNotes(activeModalItem.notes || '');
    }
  }, [activeModalItem]);

  const handleClose = () => {
    setActiveModalItem(null);
    setActiveDrawer(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter item name.');

    const payload = {
      name,
      type,
      unitType,
      pricingUnit,
      pricePerUnit: Number(pricePerUnit),
      costPerUnit: Number(costPerUnit),
      quantity: Number(quantity),
      alertThreshold: Number(alertThreshold),
      reminderDays: reminderDays ? Number(reminderDays) : null,
      notes
    };

    if (isEditing) {
      updateProduct(activeModalItem.id, payload);
    } else {
      addProduct(payload);
    }
    handleClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteProduct(activeModalItem.id);
      handleClose();
    }
  };

  return (
    <div className="drawer-backdrop" onClick={handleClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <h3>{isEditing ? 'Edit Item' : 'Add Item'}</h3>
            <p>{isEditing ? 'Modify product details, pricing, and stock.' : 'Create a product for inventory or a service for invoicing.'}</p>
          </div>
          <button className="icon-btn" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-body">
          <div className="segmented-control">
            <button 
              type="button"
              className={`segmented-btn ${type === 'product' ? 'active' : ''}`}
              onClick={() => setType('product')}
            >
              Product
            </button>
            <button 
              type="button"
              className={`segmented-btn ${type === 'service' ? 'active' : ''}`}
              onClick={() => setType('service')}
            >
              Service
            </button>
          </div>

          <div className="form-group">
            <label>Item Name *</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="e.g. Rabies Vaccine"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Unit Type</label>
              <select className="form-control" value={unitType} onChange={(e) => setUnitType(e.target.value)}>
                <option value="Piece">Piece</option>
                <option value="Box">Box</option>
                <option value="Session">Session</option>
                <option value="Vial">Vial</option>
              </select>
            </div>
            <div className="form-group">
              <label>Pricing Unit</label>
              <select className="form-control" value={pricingUnit} onChange={(e) => setPricingUnit(e.target.value)}>
                <option value="Piece">Piece</option>
                <option value="Box">Box</option>
                <option value="Session">Session</option>
                <option value="Vial">Vial</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price per Unit (EGP)</label>
              <input 
                type="number" 
                className="form-control"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Cost per Unit (EGP)</label>
              <input 
                type="number" 
                className="form-control"
                value={costPerUnit}
                onChange={(e) => setCostPerUnit(e.target.value)}
              />
            </div>
          </div>

          {type === 'product' && (
            <div className="form-row">
              <div className="form-group">
                <label>Stock Quantity</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Low Stock Alert</label>
                <input 
                  type="number" 
                  className="form-control"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Reminder Duration (Days)</label>
            <input 
              type="number" 
              className="form-control"
              placeholder="e.g. 30 (for food) or 365 (for annual vaccine)"
              value={reminderDays}
              onChange={(e) => setReminderDays(e.target.value)}
            />
            <small className="text-muted text-xs">Leave blank if no reminder is needed.</small>
          </div>

          <div className="form-group">
            <label>Notes (Optional)</label>
            <textarea 
              className="form-control" 
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="drawer-footer margin-top-auto flex justify-between align-center">
            {isEditing ? (
              <button type="button" className="btn-secondary text-red" onClick={handleDelete}>
                <Trash2 size={16} /> Delete
              </button>
            ) : <div />}

            <div className="flex gap-sm">
              <button type="button" className="btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {isEditing ? 'Save Changes' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .segmented-control {
          display: flex;
          background: #f1f5f9;
          padding: 4px;
          border-radius: var(--radius-sm);
        }
        .segmented-btn {
          flex: 1;
          padding: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-muted);
          border-radius: var(--radius-sm);
        }
        .segmented-btn.active {
          background: #ffffff;
          color: var(--text-main);
          box-shadow: var(--shadow-sm);
        }
        .gap-sm { gap: 8px; }
        .text-red { color: #dc2626; }
      `}</style>
    </div>
  );
};

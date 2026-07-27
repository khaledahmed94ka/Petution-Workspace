import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddExpenseDrawer = () => {
  const { setActiveDrawer, addExpense } = useApp();

  const [title, setTitle] = useState('');
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState('Supplies');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [notes, setNotes] = useState('');

  const categories = [
    'Supplies',
    'Utilities',
    'Rent',
    'Salaries',
    'Equipment Maintenance',
    'Marketing & Ads',
    'Licenses & Taxes',
    'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) {
      return alert('Please fill in expense title and amount.');
    }

    addExpense({
      title,
      vendor,
      category,
      amount: Number(amount) || 0,
      date,
      paymentMethod,
      notes
    });

    setActiveDrawer(null);
  };

  return (
    <div className="drawer-backdrop" onClick={() => setActiveDrawer(null)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <h3 className="flex items-center gap-xs">
              <DollarSign size={20} className="text-teal" /> Record New Expense
            </h3>
            <p>Track operational overhead, wholesaler bills, utilities, and payroll.</p>
          </div>
          <button className="icon-btn" onClick={() => setActiveDrawer(null)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-body">
          <div className="form-group">
            <label>Expense Title / Item *</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="e.g. Monthly Medication Order, July Electricity"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount (EGP) *</label>
              <input 
                type="number" 
                className="form-control font-bold"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select 
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Vendor / Supplier Name</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="e.g. El-Gomhouria Med, Landlord"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Expense Date *</label>
              <input 
                type="date" 
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select 
              className="form-control"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer / Instapay</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Check">Check</option>
            </select>
          </div>

          <div className="form-group">
            <label>Notes / Receipt Reference</label>
            <textarea 
              className="form-control"
              rows="3"
              placeholder="Invoice # or additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="drawer-footer margin-top-auto">
            <button type="button" className="btn-secondary" onClick={() => setActiveDrawer(null)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Record Expense
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .font-bold { font-weight: 700; }
      `}</style>
    </div>
  );
};

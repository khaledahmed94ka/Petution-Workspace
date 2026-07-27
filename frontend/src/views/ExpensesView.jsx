import React, { useState } from 'react';
import { Search, Plus, Filter, Download, DollarSign, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToCSV } from '../utils/dataExportImport';

export const ExpensesView = () => {
  const { expenses, deleteExpense, setActiveDrawer } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Supplies',
    'Utilities',
    'Rent',
    'Salaries',
    'Equipment Maintenance',
    'Marketing & Ads',
    'Licenses & Taxes',
    'Other'
  ];

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (exp.vendor && exp.vendor.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const currentMonthPrefix = new Date().toISOString().substring(0, 7); // YYYY-MM
  const thisMonthExpenses = expenses
    .filter(e => e.date && e.date.startsWith(currentMonthPrefix))
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const handleExport = () => {
    const exportData = expenses.map(e => ({
      Title: e.title,
      Vendor: e.vendor || '',
      Category: e.category,
      Amount: e.amount,
      Date: e.date,
      PaymentMethod: e.paymentMethod,
      Notes: e.notes || ''
    }));
    exportToCSV(exportData, 'petution_expenses_export.csv');
  };

  return (
    <div className="expenses-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2>Clinic Expenses</h2>
          <p className="text-muted">Track operational costs, medical supplies orders, utilities, and vendor payouts.</p>
        </div>
        <div className="flex gap-sm">
          <button className="btn-secondary" onClick={handleExport} title="Export Expenses CSV">
            <Download size={16} /> Export CSV
          </button>
          <button className="btn-primary" onClick={() => setActiveDrawer('addExpense')}>
            <Plus size={18} />
            Record Expense
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid-4 margin-bottom-lg">
        <div className="card">
          <span className="card-title">Total Recorded Expenses</span>
          <div className="card-value font-bold text-rose">{totalExpenseAmount.toLocaleString()} EGP</div>
          <span className="text-muted text-xs">All-time operational cost</span>
        </div>
        <div className="card">
          <span className="card-title">Expenses This Month</span>
          <div className="card-value font-bold">{thisMonthExpenses.toLocaleString()} EGP</div>
          <span className="badge badge-amber">Current Month</span>
        </div>
        <div className="card">
          <span className="card-title">Total Records</span>
          <div className="card-value">{expenses.length}</div>
          <span className="text-muted text-xs">Individual expense items</span>
        </div>
        <div className="card">
          <span className="card-title">Top Category</span>
          <div className="card-value text-base font-bold">
            {expenses.length > 0 ? expenses[0].category : 'None'}
          </div>
          <span className="text-muted text-xs">Primary cost driver</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-container">
        <div className="table-controls-stack">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by expense title or vendor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-xs" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`btn-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Expense / Item</th>
              <th>Vendor / Supplier</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date & Method</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No expense records found matching your filters.
                </td>
              </tr>
            ) : (
              filteredExpenses.map(exp => (
                <tr key={exp.id}>
                  <td className="font-semibold">
                    <div>{exp.title}</div>
                    {exp.notes && <div className="text-xs text-muted font-normal">{exp.notes}</div>}
                  </td>
                  <td>{exp.vendor || <span className="text-muted">—</span>}</td>
                  <td>
                    <span className="badge badge-teal">{exp.category}</span>
                  </td>
                  <td className="font-bold text-rose">{exp.amount.toLocaleString()} EGP</td>
                  <td>
                    <div className="text-xs font-semibold">{exp.date}</div>
                    <div className="text-xs text-muted">{exp.paymentMethod}</div>
                  </td>
                  <td>
                    <button 
                      className="icon-btn text-rose"
                      title="Delete Expense"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete expense "${exp.title}"?`)) {
                          deleteExpense(exp.id);
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .text-rose { color: #e11d48; }
        .text-base { font-size: 1.1rem; }
        .badge-amber { background: #fef3c7; color: #d97706; border: 1px solid #fde68a; }
      `}</style>
    </div>
  );
};

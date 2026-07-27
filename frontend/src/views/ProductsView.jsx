import React, { useState } from 'react';
import { Plus, Search, Download, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { exportToCSV } from '../utils/dataExportImport';

export const ProductsView = () => {
  const { products, stockLogs, setActiveDrawer, setActiveModalItem } = useApp();
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'products' ? p.type === 'product' : p.type === 'service';
    return matchesSearch && matchesTab;
  });

  const handleExport = () => {
    const exportData = products.map(p => ({
      ItemName: p.name,
      Type: p.type,
      UnitType: p.unitType,
      PricingUnit: p.pricingUnit,
      Quantity: p.quantity,
      PricePerUnit: p.pricePerUnit,
      CostPerUnit: p.costPerUnit,
      AlertThreshold: p.alertThreshold
    }));
    exportToCSV(exportData, 'petution_products_export.csv');
  };

  const handleOpenAdd = () => {
    setActiveModalItem(null);
    setActiveDrawer('addItem');
  };

  const handleEditItem = (item) => {
    setActiveModalItem(item);
    setActiveDrawer('addItem');
  };

  return (
    <div className="products-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Products & Services</h2>
          <p className="text-muted">Manage clinic inventory and billable services for clinic.</p>
        </div>
        <div className="flex gap-sm">
          <button className="btn-secondary" onClick={handleExport} title="Export Products CSV">
            <Download size={16} /> Export CSV
          </button>
          <button className="btn-secondary" onClick={() => setActiveDrawer('importProducts')} title="Import Products CSV">
            <Upload size={16} /> Import CSV
          </button>
          <button className="btn-primary" onClick={handleOpenAdd}>
            <Plus size={18} />
            Add Item
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="metrics-grid-4">
        <div className="card">
          <span className="card-title">Total Products</span>
          <div className="card-value">{products.filter(p => p.type === 'product').length}</div>
          <span className="text-muted text-xs">Inventory items with stock tracking</span>
        </div>
        <div className="card">
          <span className="card-title">Total Services</span>
          <div className="card-value">{products.filter(p => p.type === 'service').length}</div>
          <span className="text-muted text-xs">Billable service definitions</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="table-container">
        {/* Controls & Tabs */}
        <div className="table-controls-stack">
          {activeTab !== 'logs' && (
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder={`Search ${activeTab} by name`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}

          <div className="tab-nav">
            <button 
              className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Products ({products.filter(p => p.type === 'product').length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              Services ({products.filter(p => p.type === 'service').length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              Stock Logs ({stockLogs.length})
            </button>
          </div>
        </div>

        {activeTab === 'logs' ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Stock Change</th>
                <th>Logged By</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stockLogs.length === 0 ? (
                <tr><td colSpan="4" className="empty-state">No recent stock logs recorded.</td></tr>
              ) : (
                stockLogs.map(log => (
                  <tr key={log.id}>
                    <td className="font-semibold">{log.itemName}</td>
                    <td><span className="badge badge-teal">{log.change}</span></td>
                    <td>{log.user}</td>
                    <td className="text-muted">{log.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : activeTab === 'services' ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Unit Type</th>
                <th>Pricing Unit</th>
                <th>Price per Session</th>
                <th>Cost per Session</th>
                <th>Revenue per Session</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    No services created yet. Click "+ Add Item" above to add a service.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(srv => (
                  <tr key={srv.id}>
                    <td className="font-semibold">{srv.name}</td>
                    <td>{srv.unitType}</td>
                    <td>{srv.pricingUnit}</td>
                    <td className="font-bold">{srv.pricePerUnit} EGP</td>
                    <td>{srv.costPerUnit} EGP</td>
                    <td>{srv.revenuePerUnit} EGP</td>
                    <td className="text-muted">{srv.notes || '—'}</td>
                    <td>
                      <button className="btn-secondary text-xs" onClick={() => handleEditItem(srv)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          /* Products Tab */
          <table className="data-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Unit Type</th>
                <th>Pricing Unit</th>
                <th>Stock Quantity</th>
                <th>Price per Unit</th>
                <th>Cost per Unit</th>
                <th>Revenue per Unit</th>
                <th>Alert Threshold</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-state">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(prod => (
                  <tr key={prod.id}>
                    <td className="font-semibold">{prod.name}</td>
                    <td>{prod.unitType}</td>
                    <td>{prod.pricingUnit}</td>
                    <td>
                      <span className={`font-bold ${prod.quantity <= prod.alertThreshold ? 'text-red' : ''}`}>
                        {prod.quantity}
                      </span>
                    </td>
                    <td>{prod.pricePerUnit} EGP</td>
                    <td>{prod.costPerUnit} EGP</td>
                    <td>{prod.revenuePerUnit} EGP</td>
                    <td>{prod.alertThreshold}</td>
                    <td>
                      <button className="btn-secondary text-xs" onClick={() => handleEditItem(prod)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .text-red { color: #dc2626; font-weight: 700; }
      `}</style>
    </div>
  );
};

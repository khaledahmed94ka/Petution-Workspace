import React, { useState, useMemo } from 'react';
import { X, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddInvoiceDrawer = () => {
  const { setActiveDrawer, addInvoice, pets, products } = useApp();

  const [selectedPet, setSelectedPet] = useState(pets[0]?.id || '');
  const [invoiceState, setInvoiceState] = useState('pending');
  const [discountType, setDiscountType] = useState('none');
  const [discountValue, setDiscountValue] = useState(0);
  const [taxPercent, setTaxPercent] = useState(14);
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || '');

  const items = useMemo(() => {
    const prod = products.find(p => p.id === selectedProduct);
    return prod ? [{ ...prod, quantity: 1 }] : [];
  }, [products, selectedProduct]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.pricePerUnit) || 0) * (Number(item.quantity) || 1), 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    const val = Number(discountValue) || 0;
    if (discountType === 'percentage') return (subtotal * val) / 100;
    if (discountType === 'fixed_amount') return val;
    return 0;
  }, [subtotal, discountType, discountValue]);

  const taxAmount = useMemo(() => {
    const tax = Number(taxPercent) || 0;
    return (Math.max(0, subtotal - discountAmount) * tax) / 100;
  }, [subtotal, discountAmount, taxPercent]);

  const totalAmount = useMemo(() => {
    return Math.max(0, subtotal - discountAmount) + taxAmount;
  }, [subtotal, discountAmount, taxAmount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPet || !selectedProduct) {
      alert('Please select both a Pet and a Billable Item/Service.');
      return;
    }
    addInvoice({
      petId: selectedPet,
      status: invoiceState,
      discountType,
      discountValue: Number(discountValue),
      taxPercentage: Number(taxPercent),
      subtotal,
      totalAmount
    });
    setActiveDrawer(null);
  };

  return (
    <div className="drawer-backdrop" onClick={() => setActiveDrawer(null)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <h3>Add Invoice</h3>
            <p>Create an invoice linked to a pet and optional visit.</p>
          </div>
          <button className="icon-btn" onClick={() => setActiveDrawer(null)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-body">
          <div className="form-group">
            <label>Pet</label>
            <select 
              className="form-control"
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
            >
              {pets.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Invoice State</label>
            <select 
              className="form-control"
              value={invoiceState}
              onChange={(e) => setInvoiceState(e.target.value)}
            >
              <option value="pending">pending</option>
              <option value="paid">paid</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Discount Type</label>
              <select 
                className="form-control"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
              >
                <option value="none">none</option>
                <option value="percentage">percentage</option>
                <option value="fixed_amount">fixed amount</option>
              </select>
            </div>

            <div className="form-group">
              <label>Discount Value</label>
              <input 
                type="number" 
                className="form-control"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Tax %</label>
              <input 
                type="number" 
                className="form-control"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Billable Item / Service</label>
            <select 
              className="form-control"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {p.pricePerUnit} EGP</option>
              ))}
            </select>
          </div>

          {/* Calculator Box */}
          <div className="calc-summary-box card margin-top-md">
            <div className="flex justify-between text-xs">
              <span>Subtotal</span>
              <span>EGP {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs margin-top-xs">
              <span>Discount</span>
              <span>- EGP {discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs margin-top-xs">
              <span>Tax ({taxPercent}%)</span>
              <span>EGP {taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base margin-top-md border-top pt-xs">
              <span>Total Amount</span>
              <span>EGP {totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="drawer-footer margin-top-auto">
            <button type="button" className="btn-secondary" onClick={() => setActiveDrawer(null)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Invoice
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .calc-summary-box { background: #f8fafc; padding: 16px; }
        .text-base { font-size: 1.1rem; }
        .pt-xs { padding-top: 8px; }
        .border-top { border-top: 1px solid var(--border-card); }
      `}</style>
    </div>
  );
};

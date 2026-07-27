import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AnalyticsView = () => {
  const { visits, clients, pets, invoices, expenses = [] } = useApp();
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('Last 3 months');

  const now = new Date();
  let startDate = new Date();
  if (timeRange === 'Last 3 months') {
    startDate.setMonth(now.getMonth() - 3);
  } else if (timeRange === 'This month') {
    startDate.setDate(1);
  } else if (timeRange === 'Year to date') {
    startDate.setMonth(0, 1);
  }

  const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  const dateRangeText = `${startDate.toLocaleDateString('en-US', dateOptions)} - ${now.toLocaleDateString('en-US', dateOptions)}`;

  const isAfterStart = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) >= startDate;
  };

  const filteredVisits = visits.filter(v => {
    const passDate = isAfterStart(v.date || v.createdAt);
    const passDoctor = doctorFilter === 'all' || v.doctorName?.toLowerCase().includes(doctorFilter.toLowerCase());
    return passDate && passDoctor;
  });

  const filteredClients = clients.filter(c => isAfterStart(c.createdAt));
  const filteredPets = pets.filter(p => isAfterStart(p.createdAt));
  const filteredInvoices = invoices.filter(i => isAfterStart(i.createdAt));
  const filteredExpenses = expenses.filter(e => isAfterStart(e.date));

  const totalPaidRevenue = filteredInvoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const netProfitEstimate = totalPaidRevenue - totalExpenses;

  const kpis = [
    { title: 'Net revenue', value: `${totalPaidRevenue} EGP`, sub: 'Collected payments after refunds' },
    { title: 'Total visits', value: filteredVisits.length, sub: 'All visits scheduled in the selected period' },
    { title: 'Completion rate', value: '0%', sub: 'Completed visits divided by total visits' },
    { title: 'New clients', value: filteredClients.length, sub: 'Clients created during this period' },
    { title: 'Total clients', value: clients.length, sub: 'Client base available at end of period' },
    { title: 'Total Expenses', value: `${totalExpenses} EGP`, sub: 'Operational costs & supplier bills' },
    { title: 'Profit estimate', value: `${netProfitEstimate} EGP`, sub: 'Net revenue minus operational expenses' },
    { title: 'Canceled visits', value: 0, sub: 'Visits canceled in the period' },
    { title: 'New pets', value: filteredPets.length, sub: 'Pets created during this period' },
    { title: 'Services sold', value: 0, sub: 'Total service units added to invoices' },
    { title: 'Returning clients', value: 0, sub: 'Clients with more than one visit' },
    { title: 'Reopen rate', value: '0%', sub: 'Visits reopened after completion' },
    { title: 'Avg revenue per visit', value: '0 EGP', sub: 'Net revenue per completed visit' },
    { title: 'Avg time to start', value: '0m', sub: 'Average minutes from check-in to start' },
    { title: 'Avg time to complete', value: '0m', sub: 'Average minutes from start to completion' },
    { title: 'Average rating', value: 'N/A', sub: 'Client visit rating average' },
    { title: 'Ratings volume', value: 0, sub: 'Number of ratings received' },
    { title: 'Rating comment rate', value: '0%', sub: 'Ratings that included written comment' }
  ];

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Analytics</h2>
          <p className="text-muted">Useful clinic analytics across clients, visits, revenue, operations, and doctors.</p>
        </div>
        <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
          <select 
            className="form-control"
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
          >
            <option value="all">Doctor: all</option>
            <option value="khaled">Dr. Khaled ElGendy</option>
          </select>
          <select 
            className="form-control"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="Last 3 months">Last 3 months</option>
            <option value="This month">This month</option>
            <option value="Year to date">Year to date</option>
          </select>
        </div>
      </div>

      {/* Summary Banner Card */}
      <div className="card summary-banner margin-bottom-lg">
        <span className="text-muted text-xs font-semibold">{dateRangeText}</span>
        <div className="banner-metrics-row">
          <div>
            <span className="card-title">Net revenue</span>
            <div className="card-value">{totalPaidRevenue} EGP</div>
          </div>
          <div>
            <span className="card-title">Total visits</span>
            <div className="card-value">{filteredVisits.length}</div>
          </div>
          <div>
            <span className="card-title">Completion rate</span>
            <div className="card-value">0%</div>
          </div>
          <div>
            <span className="card-title">New clients</span>
            <div className="card-value">{filteredClients.length}</div>
          </div>
          <div>
            <span className="card-title">Total clients</span>
            <div className="card-value">{clients.length}</div>
          </div>
        </div>
        <span className="text-muted text-xs margin-top-xs">0% compared with the previous matching period</span>
      </div>

      {/* 18 Metrics Grid */}
      <div className="metrics-grid-16">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="card kpi-card">
            <span className="card-title">{kpi.title}</span>
            <div className="card-value">{kpi.value}</div>
            <span className="text-muted text-xs">{kpi.sub}</span>
          </div>
        ))}
      </div>

      <style>{`
        .summary-banner { padding: 16px; }
        .banner-metrics-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin: 12px 0;
        }
        .kpi-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        @media (min-width: 640px) {
          .summary-banner { padding: 24px; }
          .banner-metrics-row {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
        }

        @media (min-width: 768px) {
          .banner-metrics-row {
            grid-template-columns: repeat(5, 1fr);
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
};

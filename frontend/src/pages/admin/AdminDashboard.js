import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './AdminPages.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setStats(data))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="admin-loading">
      <span className="spinner" style={{ width: 40, height: 40 }} />
    </div>
  );

  const maxRevenue = Math.max(...(stats?.monthlyRevenue?.map(m => m.revenue) || [1]));

  return (
    <div className="admin-section fade-in">
      <h2 className="admin-section-title">Dashboard Overview</h2>

      {/* Stat cards */}
      <div className="stats-grid">
        {[
          { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: '💰', color: '#22c55e' },
          { label: 'Total Orders', value: stats?.totalOrders || 0, icon: '📦', color: '#3b82f6' },
          { label: 'Customers', value: stats?.totalUsers || 0, icon: '👥', color: '#8b5cf6' },
          { label: 'Products', value: stats?.totalProducts || 0, icon: '👕', color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ '--accent-color': s.color }}>
            <div className="stat-card-icon">{s.icon}</div>
            <div className="stat-card-val">{s.value}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="charts-row">
        {/* Revenue chart */}
        <div className="chart-card">
          <h3 className="chart-title">Monthly Revenue (Last 6 Months)</h3>
          <div className="bar-chart">
            {stats?.monthlyRevenue?.length > 0 ? stats.monthlyRevenue.map((m, i) => (
              <div key={i} className="bar-group">
                <div className="bar-wrap">
                  <div className="bar" style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}>
                    <span className="bar-tooltip">₹{m.revenue.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div className="bar-label">{MONTHS[(m._id.month || 1) - 1]}</div>
              </div>
            )) : (
              <div style={{ color: 'var(--ink-muted)', padding: '40px', textAlign: 'center' }}>No revenue data yet</div>
            )}
          </div>
        </div>

        {/* Orders by status */}
        <div className="chart-card">
          <h3 className="chart-title">Orders by Status</h3>
          <div className="status-list">
            {stats?.ordersByStatus?.map(s => (
              <div key={s._id} className="status-row">
                <span className={`badge status-${s._id}`}>{s._id?.replace('-', ' ')}</span>
                <div className="status-bar-wrap">
                  <div className="status-bar" style={{ width: `${(s.count / (stats.totalOrders || 1)) * 100}%` }} />
                </div>
                <span className="status-count">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="chart-card">
        <div className="card-header-row">
          <h3 className="chart-title">Recent Orders</h3>
          <Link to="/admin/orders" className="see-all-link">See All →</Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Order</th><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map(order => (
                <tr key={order._id}>
                  <td className="mono">{order.orderNumber}</td>
                  <td>{order.user?.name || 'N/A'}</td>
                  <td className="text-muted">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="font-bold">₹{order.pricing?.total?.toFixed(0)}</td>
                  <td><span className={`badge status-${order.status}`}>{order.status?.replace('-', ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

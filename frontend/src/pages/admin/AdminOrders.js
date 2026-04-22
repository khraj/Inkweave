import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import './AdminPages.css';

const STATUSES = ['placed','confirmed','designing','printing','quality-check','shipped','delivered','cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateForm, setUpdateForm] = useState({ status: '', note: '', trackingNumber: '' });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = filterStatus ? `?status=${filterStatus}` : '';
      const { data } = await api.get(`/orders${params}`);
      setOrders(data.orders || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [filterStatus]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!updateForm.status) return toast.error('Select a status');
    setUpdating(true);
    try {
      await api.put(`/orders/${selected._id}/status`, updateForm);
      toast.success('Order status updated!');
      fetchOrders();
      setSelected(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setUpdating(false); }
  };

  return (
    <div className="admin-section fade-in">
      <h2 className="admin-section-title">Manage Orders</h2>

      {/* Filter */}
      <div className="admin-filters">
        <button className={`filter-btn ${filterStatus === '' ? 'active' : ''}`} onClick={() => setFilterStatus('')}>All</button>
        {STATUSES.map(s => (
          <button key={s} className={`filter-btn ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>
            {s.replace('-', ' ')}
          </button>
        ))}
      </div>

      {selected && (
        <div className="update-panel fade-in">
          <div className="update-panel-header">
            <h3>Update: {selected.orderNumber}</h3>
            <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
          </div>
          <form onSubmit={handleUpdateStatus} className="update-form">
            <div className="form-row-3">
              <div className="input-group">
                <label>New Status</label>
                <select className="input" value={updateForm.status} onChange={e => setUpdateForm({ ...updateForm, status: e.target.value })}>
                  <option value="">Select status</option>
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Tracking Number</label>
                <input className="input" placeholder="Optional" value={updateForm.trackingNumber}
                  onChange={e => setUpdateForm({ ...updateForm, trackingNumber: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Note</label>
                <input className="input" placeholder="Optional note" value={updateForm.note}
                  onChange={e => setUpdateForm({ ...updateForm, note: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={updating}>
              {updating ? <><span className="spinner" /> Updating...</> : 'Update Status'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="admin-loading"><span className="spinner" style={{ width: 36, height: 36 }} /></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th><th>Customer</th><th>Items</th><th>Amount</th>
                <th>Payment</th><th>Status</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td className="mono">{order.orderNumber}</td>
                  <td>
                    <div>{order.user?.name || 'N/A'}</div>
                    <div className="text-muted text-sm">{order.user?.email}</div>
                  </td>
                  <td>{order.items?.length} item(s)</td>
                  <td className="font-bold">₹{order.pricing?.total?.toFixed(0)}</td>
                  <td><span className={`badge badge-${order.payment?.status === 'paid' ? 'success' : order.payment?.status === 'failed' ? 'danger' : 'warn'}`}>{order.payment?.status}</span></td>
                  <td><span className={`badge status-${order.status}`}>{order.status?.replace('-', ' ')}</span></td>
                  <td className="text-muted text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    <button className="btn btn-outline btn-sm" onClick={() => { setSelected(order); setUpdateForm({ status: order.status, note: '', trackingNumber: order.trackingNumber || '' }); }}>
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="table-empty">No orders found</div>}
        </div>
      )}
    </div>
  );
}

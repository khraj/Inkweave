import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import './AdminPages.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggle = async (userId) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}/toggle`);
      toast.success(data.message);
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="admin-section fade-in">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Manage Users</h2>
        <span className="text-muted">{total} total users</span>
      </div>

      {loading ? (
        <div className="admin-loading"><span className="spinner" style={{ width: 36, height: 36 }} /></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>User</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-bold">{user.name}</span>
                    </div>
                  </td>
                  <td className="text-muted">{user.email}</td>
                  <td className="text-muted">{user.phone || '—'}</td>
                  <td><span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>{user.role}</span></td>
                  <td><span className={`badge ${user.isActive ? 'badge-success' : 'badge-neutral'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td className="text-muted text-sm">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    {user.role !== 'admin' && (
                      <button
                        className={`btn btn-sm ${user.isActive ? '' : 'btn-primary'}`}
                        style={user.isActive ? { background: '#fee2e2', color: '#991b1b' } : {}}
                        onClick={() => handleToggle(user._id)}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div className="table-empty">No users found</div>}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    address: { street: user?.address?.street || '', city: user?.address?.city || '', state: user?.address?.state || '', zip: user?.address?.zip || '', country: user?.address?.country || 'India' }
  });
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const handlePwdChange = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirm) return toast.error('Passwords do not match');
    if (pwdForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setChangingPwd(true);
    try {
      await api.put('/auth/change-password', { currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      toast.success('Password changed!');
      setPwdForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setChangingPwd(false); }
  };

  return (
    <div className="page profile-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Profile</h1>
        </div>
        <div className="profile-grid">
          {/* Profile info card */}
          <div className="profile-card fade-in">
            <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div className="profile-name">{user?.name}</div>
            <div className="profile-email">{user?.email}</div>
            <span className={`badge ${user?.role === 'admin' ? 'badge-danger' : 'badge-info'}`} style={{ marginTop: 12 }}>{user?.role}</span>
          </div>

          <div className="profile-forms">
            {/* Update profile */}
            <div className="profile-section">
              <h3>Personal Information</h3>
              <form onSubmit={handleProfileSave}>
                <div className="form-row">
                  <div className="input-group">
                    <label>Full Name</label>
                    <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label>Phone</label>
                    <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <h4 style={{ margin: '16px 0 12px', fontSize: '0.9rem', color: 'var(--ink-muted)' }}>Default Address</h4>
                <div className="input-group">
                  <label>Street</label>
                  <input className="input" value={form.address.street} onChange={e => setForm({ ...form, address: { ...form.address, street: e.target.value } })} />
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>City</label>
                    <input className="input" value={form.address.city} onChange={e => setForm({ ...form, address: { ...form.address, city: e.target.value } })} />
                  </div>
                  <div className="input-group">
                    <label>State</label>
                    <input className="input" value={form.address.state} onChange={e => setForm({ ...form, address: { ...form.address, state: e.target.value } })} />
                  </div>
                  <div className="input-group">
                    <label>PIN</label>
                    <input className="input" value={form.address.zip} onChange={e => setForm({ ...form, address: { ...form.address, zip: e.target.value } })} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><span className="spinner" /> Saving...</> : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* Change password */}
            <div className="profile-section">
              <h3>Change Password</h3>
              <form onSubmit={handlePwdChange}>
                <div className="input-group">
                  <label>Current Password</label>
                  <input type="password" className="input" value={pwdForm.currentPassword} onChange={e => setPwdForm({ ...pwdForm, currentPassword: e.target.value })} />
                </div>
                <div className="form-row">
                  <div className="input-group">
                    <label>New Password</label>
                    <input type="password" className="input" value={pwdForm.newPassword} onChange={e => setPwdForm({ ...pwdForm, newPassword: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label>Confirm Password</label>
                    <input type="password" className="input" value={pwdForm.confirm} onChange={e => setPwdForm({ ...pwdForm, confirm: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn btn-secondary" disabled={changingPwd}>
                  {changingPwd ? <><span className="spinner" /> Changing...</> : 'Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

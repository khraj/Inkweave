import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.phone);
      toast.success(`Welcome to PrintCraft, ${user.name.split(' ')[0]}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-logo">🎨 PrintCraft</div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join thousands of happy customers</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <input className="input" required value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" className="input" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </div>
          <div className="input-group">
            <label>Phone (optional)</label>
            <input type="tel" className="input" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" className="input" required value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" />
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-btn" disabled={loading}>
            {loading ? <><span className="spinner" /> Creating account...</> : 'Create Account'}
          </button>
        </form>
        <div className="auth-hint">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

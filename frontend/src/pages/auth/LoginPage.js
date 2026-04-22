import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      const redirect = searchParams.get('redirect') || (user.role === 'admin' ? '/admin' : '/');
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-logo">🎨 PrintCraft</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your account</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" className="input" required value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" className="input" required value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Your password" />
          </div>
          <button type="submit" className="btn btn-primary btn-lg auth-btn" disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in...</> : 'Sign In'}
          </button>
        </form>
        <div className="auth-hint">
          Don't have an account? <Link to="/register">Sign up free</Link>
        </div>
        <div className="demo-creds">
          <div className="demo-title">Demo Credentials</div>
          <div>Admin: <code>admin@tshirtstore.com</code> / <code>Admin@123</code></div>
        </div>
      </div>
    </div>
  );
}

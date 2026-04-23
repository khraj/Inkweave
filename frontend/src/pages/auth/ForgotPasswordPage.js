import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import './AuthPages.css';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1=email, 2=reset
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      // In production this token would be emailed.
      // For local dev we show it directly.
      setResetToken(data.resetToken);
      toast.success('Reset token generated!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'No account found with that email');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm)
      return toast.error('Passwords do not match');
    if (newPassword.length < 6)
      return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token: resetToken, newPassword });
      toast.success('Password reset successfully!');
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired token');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-card fade-in" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
          <h2 className="auth-title">Password Reset!</h2>
          <p style={{ color: 'var(--ink-muted)', marginBottom: 24 }}>
            Your password has been updated successfully.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-logo">🎨 PrintCraft</div>

        {step === 1 && (
          <>
            <h1 className="auth-title">Forgot Password</h1>
            <p className="auth-sub">Enter your email to get a reset token</p>
            <form onSubmit={handleEmailSubmit} className="auth-form">
              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="input"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg auth-btn" disabled={loading}>
                {loading ? <><span className="spinner" /> Sending...</> : 'Get Reset Token'}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="auth-title">Reset Password</h1>
            <p className="auth-sub">Enter the token and your new password</p>

            <div className="reset-token-box">
              <div className="reset-token-label">🔑 Your Reset Token</div>
              <div className="reset-token-value">{resetToken}</div>
              <div className="reset-token-note">
                In production this would be sent to your email. Copy it above — it expires in 15 minutes.
              </div>
            </div>

            <form onSubmit={handleResetSubmit} className="auth-form">
              <div className="input-group">
                <label>Reset Token</label>
                <input
                  className="input"
                  required
                  placeholder="Paste token here"
                  value={resetToken}
                  onChange={e => setResetToken(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>New Password</label>
                <input
                  type="password"
                  className="input"
                  required
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  className="input"
                  required
                  placeholder="Repeat new password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg auth-btn" disabled={loading}>
                {loading ? <><span className="spinner" /> Resetting...</> : 'Reset Password'}
              </button>
            </form>
          </>
        )}

        <div className="auth-hint">
          Remember your password? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
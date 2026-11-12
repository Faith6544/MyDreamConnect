import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './GetStarted.css';

function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // When the user arrives from the recovery email, Supabase-js picks the
  // recovery token out of the URL and starts a session automatically.
  // If that never happened (e.g. someone just typed the URL), send them
  // through the forgot-password flow instead of letting them hit a dead end.
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Your reset link has expired or is invalid. Please request a new one.');
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess('Password updated! Redirecting you to sign in...');

    // Give the user time to read the message, then send them to log in.
    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 2000);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <img
            src="https://kzdqbqnyytgovlngfvwr.supabase.co/storage/v1/object/public/images/uploads/mdc-logo.png"
            alt="MyDreamConnect"
          />
          <span>MyDreamConnect</span>
        </div>

        <h1 className="auth-title">Set a new password</h1>
        <p className="auth-subtitle">Choose a new password for your account.</p>

        {error && <div className="auth-error">❌ {error}</div>}
        {success && <div className="auth-success">✅ {success}</div>}

        {!success && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>New password</label>
              <div className="auth-input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Confirm password</label>
              <div className="auth-input-wrap">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        <p className="auth-switch">
          Didn't get here from an email?{' '}
          <Link to="/forgot-password" className="auth-link">Request a reset link</Link>
        </p>

      </div>
    </div>
  );
}

export default UpdatePassword;

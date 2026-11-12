import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './GetStarted.css';

// Where Supabase sends the user after they click the link in the email.
const RESET_REDIRECT_URL = 'https://www.mydreamconnect.org.ng/update-password';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: RESET_REDIRECT_URL,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSuccess(
      `Check your email! We sent a password reset link to ${email}.`
    );
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

        <h1 className="auth-title">Forgot your password?</h1>
        <p className="auth-subtitle">
          Enter the email you registered with and we'll send you a reset link.
        </p>

        {error && <div className="auth-error">❌ {error}</div>}
        {success && <div className="auth-success">✅ {success}</div>}

        {!success && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label>Email address</label>
              <div className="auth-input-wrap">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="auth-switch">
          Remembered it after all?{' '}
          <Link to="/get-started" className="auth-link">Back to sign in</Link>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;

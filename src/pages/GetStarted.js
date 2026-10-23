import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './GetStarted.css';

function GetStarted() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();

  // Preserve the query string/hash of the page we were bounced from.
  const fromState = location.state?.from;
  const from = fromState
    ? `${fromState.pathname || '/'}${fromState.search || ''}${fromState.hash || ''}`
    : '/my-courses';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setError(error.message);
        } else {
          navigate(from, { replace: true });
        }
      } else {
        if (!formData.agree) {
          setError('Please agree to the Terms and Privacy Policy.');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }

        const { data, error } = await signUp(formData.email, formData.password, formData.name);

        if (error) {
          setError(error.message);
        } else if (data?.session) {
          // Email confirmation is disabled on this project, so signUp returns a
          // live session. Send the user straight into the app instead of
          // asking them to sign in again.
          navigate(from, { replace: true });
        } else {
          setSuccess('Account created! Check your email to confirm, then sign in.');
          setMode('signin');
          setFormData((prev) => ({ ...prev, password: '' }));
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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

        <h1 className="auth-title">
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="auth-subtitle">
          {mode === 'signin'
            ? 'Sign in to continue your learning journey.'
            : 'Start learning, growing, and connecting today.'}
        </p>

        {error && <div className="auth-error">❌ {error}</div>}
        {success && <div className="auth-success">✅ {success}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>

          {mode === 'signup' && (
            <div className="auth-field">
              <label>Full name</label>
              <div className="auth-input-wrap">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Faith"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label>Email address</label>
            <div className="auth-input-wrap">
              <span className="input-icon">✉️</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input-wrap">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                👁
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="auth-row">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                />
                <span>
                  I agree to the <Link to="/terms" className="auth-link">Terms</Link> and{' '}
                  <Link to="/terms" className="auth-link">Privacy Policy</Link>
                </span>
              </label>
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'signin' ? (
            <>
              Don't have an account?{' '}
              <button type="button" className="auth-link-btn" onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" className="auth-link-btn" onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}>
                Sign in
              </button>
            </>
          )}
        </p>

      </div>
    </div>
  );
}

export default GetStarted;
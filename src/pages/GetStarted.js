import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './GetStarted.css';

function GetStarted() {
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agree: false,
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`${mode} submitted:`, formData);
    // Later: connect to WordPress or a real auth API.
    alert(`${mode === 'signin' ? 'Signing in' : 'Creating account'}...`);
  };

  return (
    <div className="auth-page">

      {/* Container card */}
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <img
            src="https://mydreamconnect.org.ng/wp-content/uploads/2022/10/cropped-mdc-logo.png"
            alt="MyDreamConnect"
          />
          <span>MyDreamConnect</span>
        </div>

        {/* Heading */}
        <h1 className="auth-title">
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="auth-subtitle">
          {mode === 'signin'
            ? 'Sign in to continue your learning journey.'
            : 'Start learning, growing, and connecting today.'}
        </p>

        {/* Social buttons */}
     <div className="auth-socials">
  <button type="button" className="social-btn">
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
      alt="Google"
    />
    <span>Google</span>
  </button>

  <button type="button" className="social-btn">
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
      alt="Apple"
    />
    <span>Apple</span>
  </button>

  <button type="button" className="social-btn">
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
      alt="Microsoft"
    />
    <span>Microsoft</span>
  </button>
</div>

        {/* Divider */}
        <div className="auth-divider">
          <span>{mode === 'signin' ? 'or continue with email' : 'or sign up with email'}</span>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>

          {/* Full name (only signup) */}
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
                />
              </div>
            </div>
          )}

          {/* Email */}
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
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input-wrap">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder={mode === 'signup' ? 'At least 8 characters' : '••••••••'}
                value={formData.password}
                onChange={handleChange}
                required
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

          {/* Remember me / Terms */}
          {mode === 'signin' ? (
            <div className="auth-row">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="auth-link">Forgot password?</a>
            </div>
          ) : (
            <div className="auth-row">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  required
                />
                <span>
                  I agree to the <a href="#" className="auth-link">Terms</a> and{' '}
                  <a href="#" className="auth-link">Privacy Policy</a>
                </span>
              </label>
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="auth-submit">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>

        </form>

        {/* Switch mode */}
        <p className="auth-switch">
          {mode === 'signin' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => setMode('signup')}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => setMode('signin')}
              >
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
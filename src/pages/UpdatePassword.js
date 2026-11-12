import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError("Passwords don't match");
    if (password.length < 6) return setError("Password must be at least 6 characters");

    setLoading(true);
    setError('');

    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', fontFamily: 'Poppins, sans-serif' }}>
      <h2 style={{ color: '#0a4711', textAlign: 'center' }}>Create New Password</h2>
      
      {error && <div style={{ background: '#fdecea', color: '#b81c00', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{error}</div>}
      {message && <div style={{ background: '#e8f5e9', color: '#0a4711', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{message}</div>}

      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="password" 
          placeholder="New Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        <input 
          type="password" 
          placeholder="Confirm New Password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
          style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        <button type="submit" disabled={loading} style={{ background: '#0a4711', color: '#fff', padding: '12px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/login" style={{ color: '#d4a017' }}>Back to Login</Link>
      </p>
    </div>
  );
}
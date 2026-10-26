import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ONLY these emails can access the admin dashboard
const ADMIN_EMAILS = [
  'atigahfaith44@gmail.com',
  'fthferanmi@gmail.com',
  'mydreamconnectlc@gmail.com'
];

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  // If not logged in, go to the admin login page
  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  // If logged in, but email is NOT in the list, block them
  if (!ADMIN_EMAILS.includes(user.email)) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'Poppins, sans-serif' }}>
        <h2 style={{ color: '#b81c00' }}>Access Denied</h2>
        <p style={{ color: '#666' }}>You do not have permission to view the Admin Dashboard.</p>
        <button 
          onClick={() => window.location.href = '/'} 
          style={{ marginTop: '20px', padding: '10px 20px', background: '#0a4711', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Return to Home
        </button>
      </div>
    );
  }

  // If they are logged in and their email is in the list, let them in
  return children;
}
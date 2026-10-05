import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px', fontFamily: 'Poppins, sans-serif' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/get-started" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
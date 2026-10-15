import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

function AdminRoute({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null); // null = checking
  const location = useLocation();

  useEffect(() => {
    const check = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (error || !data) {
        setIsAdmin(false);
      } else {
        setIsAdmin(data.role === 'admin');
      }
    };

    if (!authLoading) check();
  }, [user, authLoading]);

  if (authLoading || isAdmin === null) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins, sans-serif',
        color: '#888',
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
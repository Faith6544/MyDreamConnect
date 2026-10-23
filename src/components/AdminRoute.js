import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

function AdminRoute({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null); // null = checking
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    // Reset the verdict whenever the identity changes. Otherwise the previous
    // user's result is used for one render: an admin gets bounced to "/" on
    // sign-in, and a student can briefly see (and query) admin pages.
    setIsAdmin(null);

    const check = async () => {
      if (!user) {
        if (!cancelled) setIsAdmin(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (cancelled) return;
      const normalizedRole = String(data?.role || '').replace(/^'+|'+$/g, '');
      setIsAdmin(!error && !!data && normalizedRole === 'admin');
    };

    if (!authLoading) check();

    return () => { cancelled = true; };
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
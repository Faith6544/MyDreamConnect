import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null); // null means "Checking..."

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      // Fetch their role from the database
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (data && data.role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [user]);

  if (isAdmin === null) return <p>Verifying access...</p>; // Show loading
  if (isAdmin === false) return <Navigate to="/" replace />; // Kick them out!

  return children; // Let them in
}
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFlight } from '../context/FlightContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const { setPostAuthPath } = useFlight();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    // If the user is not authenticated, store the intended path and redirect to login
    setPostAuthPath(location.pathname);
    return <Navigate to="/login" replace />;
  }

  return children;
}

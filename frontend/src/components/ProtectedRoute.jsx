import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store.js';

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { accessToken, user } = useAuthStore();

  if (!accessToken || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

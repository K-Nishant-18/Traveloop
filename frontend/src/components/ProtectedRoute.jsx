import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const user = AuthService.getCurrentUser();

  if (!user || !user.token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, adminOnly }){
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return children;
}

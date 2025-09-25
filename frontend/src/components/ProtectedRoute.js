import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAdmin, isCitizen } from '../utils/navigationUtils';

/**
 * Protected route component that checks authentication and role-based access
 */
const ProtectedRoute = ({ children, requireAdmin = false, requireCitizen = false }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requireAdmin && !isAdmin(user)) {
    // Non-admin user trying to access admin route
    return <Navigate to="/citizen-dashboard" replace />;
  }

  if (requireCitizen && !isCitizen(user)) {
    // Admin user trying to access citizen-only route
    return <Navigate to="/admin" replace />;
  }

  // User is authenticated and has proper role access
  return children;
};

export default ProtectedRoute;
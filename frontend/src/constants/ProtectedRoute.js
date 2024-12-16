// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ user, loading, children }) {
  // If still loading the auth state, show a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not loading anymore but user is null, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If we have a user, render the protected content
  return children;
}

export default ProtectedRoute;



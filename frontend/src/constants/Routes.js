// Routes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../login';
import Dashboard from '../components/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import Companies from '../components/Companies';
import People from '../components/People';
import PortfolioCompanies from '../components/PortfolioCompanies';

function AppRoutes({ user, loading }) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          // If loading, don’t decide yet; you might show a loading screen here.
          // Once loading is false:
          user 
            ? <Navigate to="/dashboard" replace />
            : (loading ? <div>Loading...</div> : <Login />)
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user} loading={loading}>
            <Dashboard user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/people"
        element={
          <ProtectedRoute user={user} loading={loading}>
            <People user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies"
        element={
          <ProtectedRoute user={user} loading={loading}>
            <Companies user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfoliocompanies"
        element={
          <ProtectedRoute user={user} loading={loading}>
            <PortfolioCompanies user={user} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;

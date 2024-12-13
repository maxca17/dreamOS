// Routes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../login';
import Dashboard from '../components/Dashboard';
import ProtectedRoute from './ProtectedRoute';


// Routes for Navbar
import People from '../components/People'

function AppRoutes({ user }) {
  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user}>
            <Dashboard user={user} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/people"
        element={
          <ProtectedRoute user={user}>
            <People user={user}/>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;

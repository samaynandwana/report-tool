import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import SubmitUpdate from './pages/SubmitUpdate';
import Feedback from './pages/Feedback';
import { useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        <Route path="dashboard" element={
          <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
            <ErrorBoundary>
              <Dashboard />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        
        <Route path="submit-update" element={
          <ProtectedRoute allowedRoles={['employee']}>
            <SubmitUpdate />
          </ProtectedRoute>
        } />
        
        <Route path="feedback" element={
          <ProtectedRoute allowedRoles={['manager', 'admin']}>
            <Feedback />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App; 
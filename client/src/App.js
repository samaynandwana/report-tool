import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Update from './pages/Update';
import Feedback from './pages/Feedback';

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/submit-update" element={<Update />} />
          <Route path="/feedback-queue" element={<Feedback />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App; 
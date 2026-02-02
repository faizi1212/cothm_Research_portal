import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import PortalDashboard from './components/PortalDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Student Dashboard - Only for students */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <PortalDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Dashboard - Only for supervisor/admin */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect based on login status */}
        <Route path="/" element={<RedirectBasedOnAuth />} />
        
        {/* 404 - Not Found */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Component to redirect based on authentication
const RedirectBasedOnAuth = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect based on role
  if (user.role === 'supervisor' || user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};

export default App;
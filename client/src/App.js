import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import components - adjust these paths based on your actual folder structure
// If your files are in src/components/, keep as is
// If your files are directly in src/, change to './Login', './Signup', etc.

import Login from './Login';
import Signup from './Signup';
import PortalDashboard from './PortalDashboard';
import AdminDashboard from './AdminDashboard';

// Role Checker Component (embedded to avoid import issues)
const RoleChecker = () => {
  const navigate = (path) => {
    window.location.href = path;
  };

  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    console.log("🔍 ROLE CHECKER - User Data:", user);
    
    if (!user) {
      console.log("❌ No user found, redirecting to login");
      navigate('/login');
      return;
    }

    const role = user.role?.toLowerCase();
    
    if (role === 'supervisor' || role === 'admin') {
      console.log("✅ Admin/Supervisor detected, going to /admin");
      navigate('/admin');
    } else if (role === 'student') {
      console.log("✅ Student detected, going to /dashboard");
      navigate('/dashboard');
    } else {
      console.log("⚠️ Unknown role:", role);
      navigate('/login');
    }
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{minHeight: '100vh'}}>
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Checking credentials...</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Student Dashboard */}
        <Route path="/dashboard" element={<PortalDashboard />} />
        
        {/* Admin/Supervisor Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Root - Check role and redirect */}
        <Route path="/" element={<RoleChecker />} />
        
        {/* Catch all - redirect to role checker */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
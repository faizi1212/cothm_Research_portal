import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import components
import Login from './Login';
import Signup from './Signup';
import PortalDashboard from './PortalDashboard';
import AdminDashboard from './AdminDashboard';
import Home from './Home'; // <--- ADDED NEW HOME COMPONENT

// Role Checker Component (Kept as requested)
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
        {/* --- PUBLIC LANDING PAGE (NEW) --- */}
        <Route path="/" element={<Home />} />

        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Protected Dashboards */}
        <Route path="/dashboard" element={<PortalDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Utility Route: Explicit Auth Check (Optional usage) */}
        <Route path="/auth-check" element={<RoleChecker />} />
        
        {/* Catch all - redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
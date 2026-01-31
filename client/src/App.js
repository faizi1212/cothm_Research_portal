import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// IMPORT COMPONENTS
import Navbar from "./Navbar";
import Login from "./Login";
import Signup from "./Signup";
import AdminDashboard from "./AdminDashboard";
import PortalDashboard from "./PortalDashboard";

// --- 🔒 SECURITY GUARD COMPONENT ---
// This acts like a bouncer. It checks if you are allowed in.
const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // 1. If user is NOT logged in, kick them back to Login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 2. If the page requires "admin" role, but user is NOT admin
  if (requiredRole === "admin" && user.role !== "admin") {
    // Kick them to the student dashboard instead
    return <Navigate to="/dashboard" replace />;
  }

  // 3. If passed all checks, let them in!
  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* PUBLIC ROUTES (Anyone can see these) */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🔒 SECURE STUDENT ROUTE */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <PortalDashboard />
            </ProtectedRoute>
          } 
        />

        {/* 🔒 SECURE ADMIN ROUTE (Only Admin can see) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
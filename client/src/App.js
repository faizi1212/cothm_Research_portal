import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// IMPORT COMPONENTS
import Navbar from "./Navbar";
import Login from "./Login";
import Signup from "./Signup";
import AdminDashboard from "./AdminDashboard";
import PortalDashboard from "./PortalDashboard"; // <--- NEW IMPORT

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* DASHBOARD ROUTE POINTS TO NEW FILE */}
        <Route path="/dashboard" element={<PortalDashboard />} />

        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// IMPORT COMPONENTS
import Navbar from "./Navbar";
import Login from "./Login";
import Signup from "./Signup";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard"; // <--- THIS IS THE KEY CONNECTION

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* STUDENT ROUTE (The New Dashboard) */}
        <Route path="/dashboard" element={<UserDashboard />} />

        {/* ADMIN ROUTE */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
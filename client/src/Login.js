import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/login`, formData);
      const userData = res.data.user;
      
      // Save user to LocalStorage
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect Logic
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert("❌ Login Failed: " + (err.response?.data?.error || "Invalid Credentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-card">
        <div className="text-center mb-4">
          <h2 className="mb-1">Welcome Back</h2>
          <p className="text-muted small">COTHM Research & Thesis Portal</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-navy">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><FaEnvelope className="text-muted"/></span>
              <input 
                type="email" name="email" className="form-control" 
                placeholder="student@cothm.edu.pk" onChange={handleChange} required 
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-navy">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><FaLock className="text-muted"/></span>
              <input 
                type="password" name="password" className="form-control" 
                placeholder="••••••••" onChange={handleChange} required 
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-end mb-4">
            <a href="#" onClick={(e) => e.preventDefault()} className="small text-muted text-decoration-none">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="btn-primary-custom" disabled={loading}>
             {loading ? "Authenticating..." : <><FaSignInAlt className="me-2"/> Secure Login</>}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top">
          <p className="small text-muted mb-0">Don't have an account?</p>
          <Link to="/signup" className="text-navy fw-bold text-decoration-none">Register Now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
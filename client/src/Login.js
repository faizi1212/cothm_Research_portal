import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaArrowRight, FaUniversity, FaCheckCircle } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, formData);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(res.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      alert("❌ " + (err.response?.data?.error || "Login Failed"));
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page-wrapper">
      {/* LEFT SIDE: BRANDING */}
      <div className="auth-hero-section">
        <div className="hero-content">
          <FaUniversity className="mb-4" size={60} style={{ opacity: 0.8 }} />
          <h1 className="hero-title">COTHM Research</h1>
          <p className="lead text-white-50 mb-4">
            Access the advanced thesis management portal. <br/> Secure, Fast, and Professional.
          </p>
          <div className="d-flex gap-3 justify-content-center text-white-50 small">
            <span><FaCheckCircle className="text-warning me-1"/> Secure Access</span>
            <span><FaCheckCircle className="text-warning me-1"/> 24/7 Availability</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="auth-form-section">
        <div className="auth-card-modern">
          <div className="mb-5">
            <h2 className="fw-bold text-navy">Welcome Back</h2>
            <p className="text-muted">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-floating-custom">
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                onChange={handleChange} 
                required 
              />
              <FaEnvelope className="field-icon" />
            </div>

            <div className="form-floating-custom">
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                onChange={handleChange} 
                required 
              />
              <FaLock className="field-icon" />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="remember" />
                <label className="form-check-label small text-muted" htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" style={{fontSize: "0.9rem", color: "#007bff", textDecoration: "none"}}>Forgot Password?</Link>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center" disabled={loading}>
              {loading ? "Authenticating..." : <>Sign In <FaArrowRight className="ms-2"/></>}
            </button>
          </form>

          <div className="text-center mt-5">
            <span className="text-muted">Don't have an account? </span>
            <Link to="/signup" className="fw-bold text-navy text-decoration-none">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
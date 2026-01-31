import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaLock, FaCheckCircle, FaShieldAlt } from "react-icons/fa";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/reset-password/${token}`, { password });
      alert("✅ Password Updated! Please Login.");
      navigate("/");
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.error || "Failed to reset"));
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page-wrapper">
      {/* LEFT SIDE */}
      <div className="auth-hero-section">
        <div className="hero-content">
          <FaShieldAlt className="mb-4 text-warning" size={60} />
          <h1 className="hero-title">Secure Reset</h1>
          <p className="lead text-white-50">
            Create a strong new password to protect your academic data.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-form-section">
        <div className="auth-card-modern" style={{maxWidth: "450px"}}>
          <div className="mb-4">
            <h2 className="fw-bold text-navy">New Password</h2>
            <p className="text-muted">Please enter your new password below.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-floating-custom">
              <input 
                type="password" 
                placeholder="New Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <FaLock className="field-icon" />
            </div>

            <button type="submit" className="btn btn-primary w-100 py-3 mt-3 rounded-3 fw-bold shadow-sm" disabled={loading}>
              {loading ? "Updating..." : <><FaCheckCircle className="me-2"/> Set New Password</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;
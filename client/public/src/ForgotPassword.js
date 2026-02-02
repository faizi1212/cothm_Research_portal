import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPaperPlane, FaArrowLeft, FaKey } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/forgot-password`, { email });
      alert("✅ Password reset link sent to your email!");
    } catch (err) {
      alert("❌ Error: " + (err.response?.data?.error || "Failed to send email"));
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page-wrapper">
      {/* LEFT SIDE */}
      <div className="auth-hero-section">
        <div className="hero-content">
          <FaKey className="mb-4 text-warning" size={60} />
          <h1 className="hero-title">Recovery</h1>
          <p className="lead text-white-50">
            Lost your key? Don't worry. <br/> We will verify your identity and get you back on track.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-form-section">
        <div className="auth-card-modern" style={{maxWidth: "450px"}}>
          <div className="mb-4">
            <h2 className="fw-bold text-navy">Forgot Password?</h2>
            <p className="text-muted">Enter your email and we'll send you a reset link.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-floating-custom">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <FaEnvelope className="field-icon" />
            </div>

            <button type="submit" className="btn btn-primary w-100 py-3 mt-3 rounded-3 fw-bold shadow-sm" disabled={loading}>
              {loading ? "Sending..." : <><FaPaperPlane className="me-2"/> Send Reset Link</>}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/" className="text-muted text-decoration-none d-flex align-items-center justify-content-center hover-gold">
              <FaArrowLeft className="me-2"/> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
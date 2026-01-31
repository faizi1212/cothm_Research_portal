import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaGraduationCap, FaArrowRight } from "react-icons/fa";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", regNumber: "", program: "", password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/register`, formData);
      alert("✅ Account Created! Please Login.");
      navigate("/");
    } catch (err) {
      alert("❌ " + (err.response?.data?.msg || "Registration Failed"));
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page-wrapper">
      {/* LEFT SIDE: BRANDING */}
      <div className="auth-hero-section" style={{background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"}}>
        <div className="hero-content">
          <FaGraduationCap className="mb-4" size={60} style={{ opacity: 0.8 }} />
          <h1 className="hero-title">Join the Portal</h1>
          <p className="lead text-white-50">
            Create your account to submit thesis proposals, <br/> track progress, and get supervisor feedback.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: SIGNUP FORM */}
      <div className="auth-form-section">
        <div className="auth-card-modern" style={{maxWidth: "500px"}}>
          <div className="mb-4 text-center">
            <h2 className="fw-bold text-navy">Student Registration</h2>
            <p className="text-muted">Fill in your academic details below.</p>
          </div>

          <form onSubmit={handleSignup}>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-floating-custom mb-0">
                  <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
                  <FaUser className="field-icon" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating-custom mb-0">
                  <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
                  <FaUser className="field-icon" />
                </div>
              </div>
            </div>

            <div className="form-floating-custom mt-3">
              <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
              <FaEnvelope className="field-icon" />
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                 <div className="form-floating-custom mb-0 mt-0">
                    <input type="text" name="regNumber" placeholder="Reg Number" onChange={handleChange} required />
                    <FaIdCard className="field-icon" />
                 </div>
              </div>
              <div className="col-md-6">
                 <div className="form-floating-custom mb-0 mt-0">
                    <select className="form-select" style={{paddingLeft:"45px", height:"54px", background:"#f8f9fa", border:"2px solid #e9ecef", borderRadius:"12px"}} name="program" onChange={handleChange} required>
                      <option value="">Select Program</option>
                      <option value="BSCS">BSCS</option>
                      <option value="BBA">BBA</option>
                      <option value="Hospitality">Hospitality</option>
                    </select>
                    <FaGraduationCap className="field-icon" />
                 </div>
              </div>
            </div>

            <div className="form-floating-custom mt-3">
              <input type="password" name="password" placeholder="Create Password" onChange={handleChange} required />
              <FaLock className="field-icon" />
            </div>

            <button type="submit" className="btn btn-primary w-100 py-3 mt-2 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center" disabled={loading}>
              {loading ? "Creating Account..." : <>Create Account <FaArrowRight className="ms-2"/></>}
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-muted">Already registered? </span>
            <Link to="/" className="fw-bold text-navy text-decoration-none">Sign In here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaGraduationCap, FaArrowRight } from "react-icons/fa";

const Signup = () => {
  // 1. STATE: Updated to include correct COTHM fields (Batch & Course)
  const [formData, setFormData] = useState({
    firstName: "", 
    lastName: "", 
    email: "", 
    batchNumber: "", // Changed from regNumber
    course: "",      // Changed from program
    password: ""
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/register`, formData);
      alert("✅ Account Created! Please Login.");
      navigate("/");
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Registration Failed"));
    } finally { 
      setLoading(false); 
    }
  };

  return (
    // 2. LAYOUT FIX: Added marginTop: "80px" to clear the Fixed Navbar
    <div className="container-fluid min-vh-100 d-flex align-items-center bg-light" style={{ marginTop: "80px", paddingBottom: "50px" }}>
      <div className="container">
        <div className="row g-0 shadow-lg rounded-4 overflow-hidden">
          
          {/* LEFT SIDE: BRANDING (Blue Gradient) */}
          <div className="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center text-center p-5" 
               style={{background: "linear-gradient(135deg, #0f2027 0%, #203a43 100%)", color: "white"}}>
            
            {/* Logo added here */}
            <img src="/logo.png" alt="COTHM" style={{ height: "100px", marginBottom: "20px" }} />
            
            <h1 className="fw-bold mb-3" style={{ color: "#c5a059" }}>Join the Portal</h1>
            <p className="lead text-white-50">
              Create your account to submit thesis proposals, <br/> track progress, and get supervisor feedback.
            </p>
          </div>

          {/* RIGHT SIDE: SIGNUP FORM (White Background) */}
          <div className="col-lg-6 bg-white p-5">
            <div className="mb-4 text-center">
              <h2 className="fw-bold text-dark">Student Registration</h2>
              <p className="text-muted small">Fill in your Batch & Course details below.</p>
            </div>

            <form onSubmit={handleSignup}>
              {/* Name Fields */}
              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><FaUser className="text-muted"/></span>
                    <input type="text" className="form-control bg-light border-start-0" name="firstName" placeholder="First Name" onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="input-group">
                     <span className="input-group-text bg-light border-end-0"><FaUser className="text-muted"/></span>
                    <input type="text" className="form-control bg-light border-start-0" name="lastName" placeholder="Last Name" onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="mb-3 input-group">
                <span className="input-group-text bg-light border-end-0"><FaEnvelope className="text-muted"/></span>
                <input type="email" className="form-control bg-light border-start-0" name="email" placeholder="Email Address" onChange={handleChange} required />
              </div>

              {/* Password */}
              <div className="mb-3 input-group">
                <span className="input-group-text bg-light border-end-0"><FaLock className="text-muted"/></span>
                <input type="password" className="form-control bg-light border-start-0" name="password" placeholder="Create Password" onChange={handleChange} required />
              </div>

              {/* 3. CRITICAL FIELDS: Batch Number & Hospitality Courses */}
              <div className="row g-2 mb-4">
                <div className="col-md-6">
                  <label className="small text-muted ms-1 mb-1">Batch No.</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><FaIdCard className="text-muted"/></span>
                    <input type="text" className="form-control bg-light border-start-0" name="batchNumber" placeholder="e.g. 22" onChange={handleChange} required />
                  </div>
                </div>
                <div className="col-md-6">
                   <label className="small text-muted ms-1 mb-1">Program</label>
                   <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><FaGraduationCap className="text-muted"/></span>
                    <select className="form-select bg-light border-start-0" name="course" onChange={handleChange} required>
                      <option value="">Select...</option>
                      <option value="GDICA">GDICA</option>
                      <option value="DCA">DCA</option>
                      <option value="DHTML">DHTML</option>
                      <option value="DIHO">DIHO</option>
                      <option value="HM">HM</option>
                    </select>
                   </div>
                </div>
              </div>

              <button type="submit" className="btn w-100 py-2 fw-bold text-dark shadow-sm d-flex align-items-center justify-content-center" 
                      style={{ background: "linear-gradient(45deg, #c5a059, #e6c888)", border: "none" }}
                      disabled={loading}>
                {loading ? "Creating Account..." : <>Create Account <FaArrowRight className="ms-2"/></>}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted small">Already registered? </span>
              <Link to="/" className="fw-bold text-decoration-none" style={{ color: "#0f2027" }}>Sign In here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
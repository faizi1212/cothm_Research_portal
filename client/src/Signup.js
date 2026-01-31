import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaIdCard, FaGraduationCap, FaLock, FaUserPlus } from "react-icons/fa";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    regNumber: "",
    program: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/register`, formData);
      alert("✅ Registration Successful! Please Login.");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Registration Failed: " + (err.response?.data?.msg || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper position-relative" style={{minHeight: "100vh", overflow: "hidden"}}>
      {/* 🎥 MATCHING VIDEO BACKGROUND */}
      <video autoPlay loop muted className="video-bg position-absolute w-100 h-100" style={{objectFit: "cover", zIndex: -1}}>
        <source src="https://cdn.pixabay.com/video/2020/04/18/36465-412239634_large.mp4" type="video/mp4" />
      </video>
      <div className="position-absolute w-100 h-100" style={{background: "rgba(0,0,0,0.7)", zIndex: 0}}></div>

      <div className="container d-flex align-items-center justify-content-center py-5" style={{minHeight: "100vh", position: "relative", zIndex: 2}}>
        <div className="card p-5 shadow-lg border-0" style={{ maxWidth: "600px", width: "100%", background: "rgba(20, 20, 20, 0.85)", backdropFilter: "blur(10px)", borderTop: "4px solid #ffc107" }}>
          
          <div className="text-center mb-4">
            <h2 className="text-white fw-bold">Student Registration</h2>
            <p className="text-white-50">Create your research profile</p>
          </div>

          <form onSubmit={handleSignup}>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-floating">
                  <input type="text" name="firstName" className="form-control bg-transparent text-white border-secondary" placeholder="First Name" onChange={handleChange} required />
                  <label className="text-secondary">First Name</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <input type="text" name="lastName" className="form-control bg-transparent text-white border-secondary" placeholder="Last Name" onChange={handleChange} required />
                  <label className="text-secondary">Last Name</label>
                </div>
              </div>

              <div className="col-12">
                <div className="form-floating">
                  <input type="email" name="email" className="form-control bg-transparent text-white border-secondary" placeholder="Email" onChange={handleChange} required />
                  <label className="text-secondary"><FaEnvelope className="me-2"/>Email Address</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input type="text" name="regNumber" className="form-control bg-transparent text-white border-secondary" placeholder="Reg No" onChange={handleChange} required />
                  <label className="text-secondary"><FaIdCard className="me-2"/>Reg Number</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                   <select name="program" className="form-select bg-transparent text-white border-secondary" onChange={handleChange} required>
                     <option value="" className="text-dark">Select Program</option>
                     <option value="BSCS" className="text-dark">BSCS</option>
                     <option value="BBA" className="text-dark">BBA</option>
                     <option value="Hospitality" className="text-dark">Hospitality</option>
                   </select>
                   <label className="text-secondary"><FaGraduationCap className="me-2"/>Program</label>
                </div>
              </div>
              
              <div className="col-12 mb-3">
                <div className="form-floating">
                  <input type="password" name="password" className="form-control bg-transparent text-white border-secondary" placeholder="Password" onChange={handleChange} required />
                  <label className="text-secondary"><FaLock className="me-2"/>Password</label>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-warning w-100 py-3 fw-bold text-uppercase mb-4" disabled={loading}>
               {loading ? "Registering..." : <><FaUserPlus className="me-2"/> Create Account</>}
            </button>

            <div className="text-center">
              <Link to="/" className="text-white-50 text-decoration-none">Already registered? <span className="text-warning fw-bold">Login here</span></Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
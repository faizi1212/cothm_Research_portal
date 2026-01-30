import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaGraduationCap, FaLayerGroup } from "react-icons/fa";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    regNumber: "",
    batch: "",
    program: "BS CS"
  });
  const navigate = useNavigate();

  // ONLINE SERVER URL
  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/register`, formData);
      alert("Registration Successful! Please Login.");
      navigate("/");
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Signup failed"));
    }
  };

  return (
    <div className="auth-wrapper">
      <video autoPlay loop muted className="video-bg">
        <source src="https://cdn.pixabay.com/video/2020/04/18/36465-412239634_large.mp4" type="video/mp4" />
      </video>

      <div className="card auth-card p-4" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="auth-header">
          <h2 className="cothm-title">Join COTHM</h2>
          <span className="cothm-subtitle">Research Portal</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-group mb-3">
            <span className="input-group-text"><FaUser /></span>
            <input type="text" name="name" className="form-control" placeholder="Full Name" onChange={handleChange} required />
          </div>

          {/* Email */}
          <div className="input-group mb-3">
            <span className="input-group-text"><FaEnvelope /></span>
            <input type="email" name="email" className="form-control" placeholder="Email Address" onChange={handleChange} required />
          </div>

          {/* Registration Number (CRITICAL FIX) */}
          <div className="row g-2 mb-3">
            <div className="col-6">
                <div className="input-group">
                    <span className="input-group-text"><FaIdCard /></span>
                    <input type="text" name="regNumber" className="form-control" placeholder="Reg ID (e.g. 123)" onChange={handleChange} required />
                </div>
            </div>
            <div className="col-6">
                <div className="input-group">
                    <span className="input-group-text"><FaLayerGroup /></span>
                    <input type="text" name="batch" className="form-control" placeholder="Batch (e.g. F24)" onChange={handleChange} required />
                </div>
            </div>
          </div>

          {/* Program Selection */}
          <div className="input-group mb-3">
            <span className="input-group-text"><FaGraduationCap /></span>
            <select name="program" className="form-select" onChange={handleChange}>
                <option value="BS CS">BS Computer Science</option>
                <option value="BS SE">BS Software Engineering</option>
                <option value="BS IT">BS Information Technology</option>
                <option value="BBA">BBA</option>
            </select>
          </div>

          {/* Password */}
          <div className="input-group mb-4">
            <span className="input-group-text"><FaLock /></span>
            <input type="password" name="password" className="form-control" placeholder="Password" onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-cothm w-100 mb-3">REGISTER NOW</button>

          <div className="text-center">
            <Link to="/" className="link-cothm small">Already have an account? Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
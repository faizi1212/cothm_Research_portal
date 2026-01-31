import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaIdCard, FaUserPlus } from "react-icons/fa";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", regNumber: "", program: "", password: ""
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
      alert("✅ Account Created! Please Login.");
      navigate("/");
    } catch (err) {
      alert("Registration Failed: " + (err.response?.data?.msg || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center py-5" style={{minHeight: "85vh"}}>
      <div className="glass-card p-5" style={{ maxWidth: "600px", width: "100%" }}>
        
        <div className="text-center mb-4">
          <h2 className="fw-bold text-warning">Create Account</h2>
          <p className="text-white-50">Join the Research Portal</p>
        </div>

        <form onSubmit={handleSignup}>
          <div className="row g-3">
            <div className="col-md-6">
              <input type="text" name="firstName" className="form-control form-control-glass p-3" placeholder="First Name" onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <input type="text" name="lastName" className="form-control form-control-glass p-3" placeholder="Last Name" onChange={handleChange} required />
            </div>
            <div className="col-12">
              <input type="email" name="email" className="form-control form-control-glass p-3" placeholder="Email Address" onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <input type="text" name="regNumber" className="form-control form-control-glass p-3" placeholder="Reg Number" onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <select name="program" className="form-select form-control-glass p-3" onChange={handleChange} required>
                <option value="" className="text-dark">Select Program</option>
                <option value="BSCS" className="text-dark">BSCS</option>
                <option value="BBA" className="text-dark">BBA</option>
              </select>
            </div>
            <div className="col-12 mb-3">
              <input type="password" name="password" className="form-control form-control-glass p-3" placeholder="Create Password" onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn btn-gradient w-100 py-3 mt-3 shadow" disabled={loading}>
             {loading ? "Creating..." : "CREATE ACCOUNT"}
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/" className="text-white text-decoration-none">Already have an account? <span className="text-warning">Login</span></Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
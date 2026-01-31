import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Use your Render Backend URL
  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/login`, formData);
      
      // ✅ CRITICAL: Save User Data Correctly
      const userData = res.data.user;
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect Logic
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error(err);
      alert("Login Failed: " + (err.response?.data?.error || "Check internet connection"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{minHeight: "85vh"}}>
      <div className="glass-card p-5" style={{ maxWidth: "450px", width: "100%" }}>
        
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-1 text-warning">Welcome Back</h2>
          <p className="text-white-50">Please login to your account</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="text-white-50 mb-1 small">Email Address</label>
            <div className="input-group">
              <span className="input-group-text form-control-glass border-end-0"><FaUser className="text-info"/></span>
              <input 
                type="email" 
                name="email" 
                className="form-control form-control-glass border-start-0" 
                placeholder="name@cothm.edu.pk" 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-white-50 mb-1 small">Password</label>
            <div className="input-group">
              <span className="input-group-text form-control-glass border-end-0"><FaLock className="text-info"/></span>
              <input 
                type="password" 
                name="password" 
                className="form-control form-control-glass border-start-0" 
                placeholder="Enter password" 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-gradient w-100 py-3 mb-4 rounded-3 shadow" disabled={loading}>
             {loading ? "Authenticating..." : <><FaSignInAlt className="me-2"/> LOGIN NOW</>}
          </button>

          <div className="text-center pt-3 border-top border-secondary">
            <p className="mb-0 text-white-50">Don't have an account?</p>
            <Link to="/signup" className="text-info fw-bold text-decoration-none">Register New Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
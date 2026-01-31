import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Point to your live Render Backend
  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Send Login Request
      const res = await axios.post(`${API_URL}/login`, formData);
      
      // 2. Save User Data (Including Role)
      // We ensure the object has what Navbar expects
      const userData = res.data.user;
      localStorage.setItem("user", JSON.stringify(userData));

      // 3. Redirect based on Role
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("Login Error:", err);
      const msg = err.response ? err.response.data.error : "Server not responding. Check connection.";
      alert("❌ Login Failed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper position-relative" style={{minHeight: "100vh", overflow: "hidden"}}>
      
      {/* 🎥 VIDEO BACKGROUND */}
      <video autoPlay loop muted className="video-bg position-absolute w-100 h-100" style={{objectFit: "cover", zIndex: -1}}>
        {/* Using a professional tech/dark background video */}
        <source src="https://cdn.pixabay.com/video/2020/04/18/36465-412239634_large.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY for better text readability */}
      <div className="position-absolute w-100 h-100" style={{background: "rgba(0,0,0,0.7)", zIndex: 0}}></div>

      <div className="container d-flex align-items-center justify-content-center" style={{minHeight: "100vh", position: "relative", zIndex: 2}}>
        <div className="card p-5 shadow-lg border-0" style={{ maxWidth: "450px", width: "100%", background: "rgba(20, 20, 20, 0.85)", backdropFilter: "blur(10px)", borderTop: "4px solid #ffc107" }}>
          
          <div className="text-center mb-5">
            <h2 className="text-white fw-bold mb-1">COTHM PORTAL</h2>
            <p className="text-warning small letter-spacing-2 text-uppercase">Research & Thesis Management</p>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="form-floating mb-3">
              <input 
                type="email" 
                name="email" 
                className="form-control bg-transparent text-white border-secondary" 
                id="emailInput"
                placeholder="name@example.com"
                onChange={handleChange} 
                required 
                style={{color: "white"}}
              />
              <label htmlFor="emailInput" className="text-secondary"><FaUser className="me-2"/>Email Address</label>
            </div>

            {/* Password Input */}
            <div className="form-floating mb-4">
              <input 
                type="password" 
                name="password" 
                className="form-control bg-transparent text-white border-secondary" 
                id="passInput"
                placeholder="Password"
                onChange={handleChange} 
                required 
              />
              <label htmlFor="passInput" className="text-secondary"><FaLock className="me-2"/>Password</label>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              className="btn btn-warning w-100 py-3 fw-bold text-uppercase mb-4 shadow-sm"
              disabled={loading}
              style={{letterSpacing: "1px"}}
            >
               {loading ? "Authenticating..." : <><FaSignInAlt className="me-2"/> Access Portal</>}
            </button>

            <div className="text-center border-top border-secondary pt-4">
              <p className="text-white-50 small mb-2">New Student?</p>
              <Link to="/signup" className="text-warning text-decoration-none fw-bold">Register Account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ONLINE SERVER URL
  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // TRIGGERED WHEN YOU CLICK LOGIN
  const handleLogin = async (e) => {
    e.preventDefault(); // Stop page reload
    console.log("Login Button Clicked!"); // <--- Check Console for this
    
    if(!formData.email || !formData.password) {
        alert("Please fill in all fields");
        return;
    }

    setLoading(true);

    try {
      console.log("Sending request to:", `${API_URL}/login`);
      const res = await axios.post(`${API_URL}/login`, formData);
      
      console.log("Response:", res.data);
      alert("✅ Login Success! Redirecting...");

      // Save user
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("Login Error:", err);
      const msg = err.response ? err.response.data.error : "Server not responding";
      alert("❌ Login Failed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{background: "#121212", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
      
      {/* LOGIN CARD */}
      <div className="card auth-card p-4" style={{ maxWidth: "450px", width: "100%", background: "#1e1e1e", border: "1px solid #333", color: "white" }}>
        <div className="text-center mb-4">
          <h2 className="text-warning fw-bold">COTHM PORTAL</h2>
          <p className="text-secondary">Login to Continue</p>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-dark border-secondary text-warning"><FaUser /></span>
            <input 
                type="email" 
                name="email" 
                className="form-control bg-dark text-white border-secondary" 
                placeholder="Email Address" 
                onChange={handleChange} 
                required 
            />
          </div>

          {/* Password */}
          <div className="input-group mb-4">
            <span className="input-group-text bg-dark border-secondary text-warning"><FaLock /></span>
            <input 
                type="password" 
                name="password" 
                className="form-control bg-dark text-white border-secondary" 
                placeholder="Password" 
                onChange={handleChange} 
                required 
            />
          </div>

          {/* LOGIN BUTTON */}
          <button 
            type="submit" 
            className="btn btn-warning w-100 mb-3 fw-bold" 
            disabled={loading}
            style={{height: "50px"}}
          >
             {loading ? "Connecting..." : "LOGIN NOW"}
          </button>

          <div className="text-center">
            <Link to="/signup" className="text-warning text-decoration-none">Create an Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
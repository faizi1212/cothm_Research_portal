import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "./logo.png"; // ✅ COTHM Logo Restored

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      if (res.data.user.role === "supervisor" || res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <style>{`
        :root {
          --primary: #1e3c72; /* COTHM Navy */
          --primary-dark: #162c55;
          --gold: #d4af37;    /* COTHM Gold */
          --bg-gradient: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        }

        body { margin: 0; font-family: 'Inter', sans-serif; background: #f3f4f6; }

        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-gradient);
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        /* Decorative Circles for Modern Feel */
        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
          z-index: 0;
        }
        .c1 { width: 300px; height: 300px; top: -50px; left: -50px; }
        .c2 { width: 200px; height: 200px; bottom: -50px; right: -50px; }

        /* GLASS CARD */
        .auth-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 420px;
          overflow: hidden;
          position: relative;
          z-index: 10;
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        /* HEADER SECTION */
        .auth-header {
          background: white;
          padding: 40px 30px 20px;
          text-align: center;
          border-bottom: 1px solid #f0f2f5;
        }
        
        .brand-logo {
          width: 100px; /* Perfect size for logo */
          height: auto;
          margin-bottom: 15px;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
          transition: transform 0.3s;
        }
        .brand-logo:hover { transform: scale(1.05); }

        .brand-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--primary);
          margin: 0;
          letter-spacing: -0.5px;
          text-transform: uppercase;
        }
        .brand-subtitle {
          color: #64748b;
          font-size: 13px;
          margin-top: 6px;
          font-weight: 500;
        }

        /* FORM SECTION */
        .auth-form { padding: 30px; }
        
        .input-group { position: relative; margin-bottom: 20px; }
        .input-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; font-size: 18px; transition: color 0.3s;
        }
        
        .form-input {
          width: 100%;
          padding: 14px 14px 14px 48px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          outline: none;
          transition: all 0.3s;
          box-sizing: border-box;
          color: #334155;
          background: #f8fafc;
        }
        
        /* COTHM Gold Focus Effect */
        .form-input:focus {
          border-color: var(--gold);
          background: white;
          box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.15);
        }
        .form-input:focus + .input-icon { color: var(--gold); }

        .password-toggle {
          position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; cursor: pointer; padding: 5px;
        }
        .password-toggle:hover { color: var(--primary); }

        /* BUTTONS */
        .btn-primary {
          width: 100%;
          padding: 14px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 10px;
          box-shadow: 0 4px 12px rgba(30, 60, 114, 0.2);
        }
        .btn-primary:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(30, 60, 114, 0.3);
        }
        .btn-primary:active { transform: scale(0.98); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

        .forgot-link {
          display: block; text-align: right;
          color: var(--primary); font-size: 13px; font-weight: 600;
          text-decoration: none; margin-bottom: 24px; transition: color 0.2s;
        }
        .forgot-link:hover { color: var(--gold); text-decoration: underline; }

        /* FOOTER */
        .auth-footer {
          text-align: center; margin-top: 25px;
          font-size: 14px; color: #64748b;
        }
        .signup-link {
          color: var(--primary); font-weight: 700; text-decoration: none; margin-left: 5px;
        }
        .signup-link:hover { color: var(--gold); text-decoration: underline; }

        /* ERROR MESSAGE */
        .error-box {
          background: #fee2e2; border-left: 4px solid #ef4444;
          color: #991b1b; padding: 12px 15px; border-radius: 8px;
          font-size: 13px; margin-bottom: 20px; font-weight: 500;
          display: flex; align-items: center;
        }

        /* MOBILE OPTIMIZATION */
        @media (max-width: 480px) {
          .auth-card { border-radius: 0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
          .circle { display: none; } /* Remove decorations on small screens for cleanliness */
        }
      `}</style>

      {/* Background Decorations */}
      <div className="circle c1"></div>
      <div className="circle c2"></div>

      <div className="auth-card">
        <div className="auth-header">
          {/* ✅ COTHM LOGO HERE */}
          <img src={logo} alt="COTHM Logo" className="brand-logo" />
          <h1 className="brand-title">Research Portal</h1>
          <p className="brand-subtitle">Login to manage your thesis & projects</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          {error && <div className="error-box">{error}</div>}

          <div className="input-group">
            <input 
              type="email" 
              name="email" 
              className="form-input" 
              placeholder="Student Email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
            <FaEnvelope className="input-icon" />
          </div>

          <div className="input-group">
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              className="form-input" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
            <FaLock className="input-icon" />
            <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Access Portal"}
          </button>

          <div className="auth-footer">
            New Student? 
            <Link to="/signup" className="signup-link">Create Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
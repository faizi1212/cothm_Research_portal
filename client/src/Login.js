import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaLock, FaUniversity, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error when typing
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // Redirect based on role
      if (res.data.user.role === "supervisor" || res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <style>{`
        :root {
          --primary: #1e3c72;
          --accent: #d4af37; /* COTHM Gold */
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
        }

        /* CARD DESIGN */
        .auth-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          width: 100%;
          max-width: 450px;
          overflow: hidden;
          position: relative;
        }

        /* HEADER */
        .auth-header {
          background: #fff;
          padding: 40px 30px 20px;
          text-align: center;
        }
        .logo-icon {
          width: 60px; height: 60px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 15px;
          font-size: 28px;
          box-shadow: 0 10px 15px -3px rgba(30, 60, 114, 0.3);
        }
        .brand-title {
          font-size: 24px; font-weight: 800; color: var(--primary); margin: 0; letter-spacing: -0.5px;
        }
        .brand-subtitle {
          color: #64748b; font-size: 14px; margin-top: 5px;
        }

        /* FORM */
        .auth-form { padding: 30px; }
        
        .input-group {
          position: relative; margin-bottom: 20px;
        }
        .input-icon {
          position: absolute; left: 15px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; font-size: 18px; transition: color 0.3s;
        }
        .form-input {
          width: 100%;
          padding: 14px 14px 14px 45px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 15px;
          outline: none;
          transition: all 0.3s;
          box-sizing: border-box;
          color: #334155;
        }
        .form-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(30, 60, 114, 0.1);
        }
        .form-input:focus + .input-icon { color: var(--primary); }

        .password-toggle {
          position: absolute; right: 15px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; cursor: pointer;
        }

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
        }
        .btn-primary:hover {
          background: #102a56;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .forgot-link {
          display: block; text-align: right;
          color: var(--primary); font-size: 13px; font-weight: 600;
          text-decoration: none; margin-bottom: 20px;
        }
        .forgot-link:hover { text-decoration: underline; }

        /* FOOTER */
        .auth-footer {
          text-align: center; margin-top: 25px;
          font-size: 14px; color: #64748b;
        }
        .signup-link {
          color: var(--primary); font-weight: 700; text-decoration: none; margin-left: 5px;
        }
        .signup-link:hover { text-decoration: underline; }

        /* ERROR MSG */
        .error-box {
          background: #fee2e2; border-left: 4px solid #ef4444;
          color: #991b1b; padding: 12px; border-radius: 8px;
          font-size: 14px; margin-bottom: 20px;
        }

        @media (max-width: 480px) {
          .auth-card { border-radius: 0; height: 100vh; max-width: 100%; }
        }
      `}</style>

      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-icon"><FaUniversity /></div>
          <h1 className="brand-title">COTHM Portal</h1>
          <p className="brand-subtitle">Login to access your research dashboard</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          {error && <div className="error-box">{error}</div>}

          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input 
              type="email" 
              name="email" 
              className="form-input" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              className="form-input" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
            <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          <div className="auth-footer">
            Don't have an account? 
            <Link to="/signup" className="signup-link">Create Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
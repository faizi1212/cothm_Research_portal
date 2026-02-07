import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import logo from "./logo.png"; 

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
      setError("Please enter your credentials.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      const role = res.data.user.role;
      navigate(role === "supervisor" || role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-screen">
      <style>{`
        :root { --primary: #1e3c72; --gold: #d4af37; }
        body { margin: 0; font-family: 'Inter', sans-serif; overflow: hidden; }

        .split-screen { display: flex; height: 100vh; width: 100vw; }

        /* LEFT SIDE - IMAGE & BRANDING */
        .left-pane {
          flex: 1;
          background: linear-gradient(rgba(30, 60, 114, 0.9), rgba(42, 82, 152, 0.8)), 
                      url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px;
          color: white;
          position: relative;
        }
        
        .left-content { max-width: 500px; animation: slideRight 0.8s ease-out; }
        .hero-title { font-size: 3rem; font-weight: 800; line-height: 1.1; margin-bottom: 20px; }
        .hero-text { font-size: 1.1rem; opacity: 0.9; line-height: 1.6; }
        .hero-gold { color: var(--gold); }

        /* RIGHT SIDE - FORM */
        .right-pane {
          flex: 1;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          position: relative;
        }

        .login-wrapper { width: 100%; max-width: 400px; animation: fadeIn 1s ease-out; }
        
        .brand-header { margin-bottom: 40px; }
        .brand-logo { width: 80px; margin-bottom: 15px; }
        .welcome-text { font-size: 28px; font-weight: 700; color: #1e293b; margin: 0; }
        .sub-text { color: #64748b; margin-top: 5px; }

        /* INPUTS */
        .input-group { margin-bottom: 20px; position: relative; }
        .input-label { display: block; font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 8px; }
        .form-input {
          width: 100%; padding: 14px 14px 14px 45px;
          border: 2px solid #e2e8f0; border-radius: 12px;
          font-size: 15px; outline: none; transition: 0.2s;
          box-sizing: border-box; color: #1e293b;
        }
        .form-input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(30, 60, 114, 0.1); }
        
        .input-icon { position: absolute; left: 15px; bottom: 15px; color: #94a3b8; }
        .password-toggle { position: absolute; right: 15px; bottom: 15px; color: #94a3b8; cursor: pointer; }

        /* BUTTON */
        .btn-login {
          width: 100%; padding: 16px; background: var(--primary);
          color: white; border: none; border-radius: 12px;
          font-size: 16px; font-weight: 700; cursor: pointer;
          transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .btn-login:hover { background: #162c55; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(30, 60, 114, 0.2); }
        .btn-login:disabled { opacity: 0.7; cursor: not-allowed; }

        /* LINKS */
        .action-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; font-size: 14px; }
        .forgot-link { color: var(--primary); text-decoration: none; font-weight: 600; }
        .signup-text { text-align: center; margin-top: 30px; color: #64748b; }
        .signup-link { color: var(--primary); font-weight: 700; text-decoration: none; }

        .error-msg { background: #fee2e2; color: #991b1b; padding: 12px; border-radius: 8px; font-size: 14px; margin-bottom: 20px; text-align: center; }

        /* ANIMATIONS */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }

        /* MOBILE */
        @media (max-width: 900px) {
          .left-pane { display: none; } /* Hide image on tablet/mobile */
          .right-pane { background: #f8fafc; }
          .login-wrapper { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        }
      `}</style>

      {/* LEFT SIDE (Branding) */}
      <div className="left-pane">
        <div className="left-content">
          <h1 className="hero-title">Welcome to <br/> <span className="hero-gold">COTHM</span> Portal</h1>
          <p className="hero-text">
            Streamline your research journey. Submit theses, track approvals, and access academic resources in one secure platform.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE (Form) */}
      <div className="right-pane">
        <div className="login-wrapper">
          <div className="brand-header">
            <img src={logo} alt="Logo" className="brand-logo" />
            <h2 className="welcome-text">Student Login</h2>
            <p className="sub-text">Please enter your details to continue.</p>
          </div>

          <form onSubmit={handleLogin}>
            {error && <div className="error-msg">{error}</div>}

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input 
                type="email" name="email" className="form-input" 
                placeholder="student@cothm.edu.pk" 
                value={formData.email} onChange={handleChange} required 
              />
              <FaEnvelope className="input-icon" />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input 
                type={showPassword ? "text" : "password"} name="password" className="form-input" 
                placeholder="••••••••" 
                value={formData.password} onChange={handleChange} required 
              />
              <FaLock className="input-icon" />
              <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <div className="action-row">
              <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Verifying..." : <>Login <FaArrowRight /></>}
            </button>

            <p className="signup-text">
              Don't have an account? <Link to="/signup" className="signup-link">Register Now</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaUniversity } from "react-icons/fa";
import logo from "./logo.png"; // Ensure you have this logo

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(res.data.user.role === "supervisor" ? "/admin" : "/dashboard");
    } catch (err) { setError(err.response?.data?.message || "Login failed"); } 
    finally { setLoading(false); }
  };

  return (
    <div className="login-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap');
        body { font-family: 'Inter', sans-serif; margin: 0; background: #0f172a; }
        
        .login-container { display: flex; height: 100vh; width: 100vw; overflow: hidden; background: #0f172a; }
        
        /* LEFT SIDE - VISUAL */
        .visual-side {
          flex: 1.2;
          background: linear-gradient(135deg, rgba(30, 60, 114, 0.9), rgba(42, 82, 152, 0.8)),
                      url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920');
          background-size: cover; background-position: center;
          display: flex; flex-direction: column; justify-content: center; padding: 80px;
          color: white; position: relative;
        }
        .visual-content { position: relative; z-index: 2; max-width: 600px; animation: slideIn 0.8s ease-out; }
        .hero-title { font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 20px; letter-spacing: -1px; }
        .hero-text { font-size: 1.2rem; opacity: 0.85; line-height: 1.6; font-weight: 400; }
        .hero-gold { color: #d4af37; }

        /* RIGHT SIDE - FORM */
        .form-side { flex: 1; background: #ffffff; display: flex; align-items: center; justify-content: center; padding: 40px; }
        .form-wrapper { width: 100%; max-width: 420px; animation: fadeIn 1s ease-out; }
        
        .brand-header { margin-bottom: 40px; display: flex; flex-direction: column; gap: 10px; }
        .logo-img { width: 80px; height: auto; margin-bottom: 10px; }
        .welcome-title { font-size: 28px; font-weight: 700; color: #1e293b; margin: 0; letter-spacing: -0.5px; }
        .welcome-sub { color: #64748b; font-size: 15px; }

        /* INPUTS */
        .input-group { margin-bottom: 20px; position: relative; }
        .label { display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .input-field {
          width: 100%; padding: 14px 14px 14px 45px;
          border: 1px solid #e2e8f0; border-radius: 12px;
          font-size: 15px; outline: none; transition: 0.2s;
          background: #f8fafc; color: #1e293b; box-sizing: border-box;
        }
        .input-field:focus { border-color: #1e3c72; background: #fff; box-shadow: 0 0 0 4px rgba(30, 60, 114, 0.1); }
        .icon { position: absolute; left: 16px; bottom: 16px; color: #94a3b8; font-size: 18px; }
        .toggle-pass { position: absolute; right: 16px; bottom: 16px; color: #94a3b8; cursor: pointer; }

        /* BUTTON */
        .btn-primary {
          width: 100%; padding: 16px; background: #1e3c72; color: white;
          border: none; border-radius: 12px; font-size: 16px; font-weight: 600;
          cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px;
          margin-top: 10px;
        }
        .btn-primary:hover { background: #162c55; transform: translateY(-2px); box-shadow: 0 10px 20px -5px rgba(30, 60, 114, 0.3); }
        .btn-primary:disabled { opacity: 0.7; cursor: wait; }

        .links-row { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; }
        .link { color: #1e3c72; text-decoration: none; font-weight: 600; transition: color 0.2s; }
        .link:hover { color: #d4af37; }
        
        .error-banner { background: #fee2e2; color: #991b1b; padding: 12px; border-radius: 8px; font-size: 14px; margin-bottom: 20px; border-left: 4px solid #ef4444; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        
        @media (max-width: 900px) { .visual-side { display: none; } .form-side { background: #f8fafc; } .form-wrapper { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); } }
      `}</style>

      <div className="visual-side">
        <div className="visual-content">
          <h1 className="hero-title">Academic <br/>Excellence <span className="hero-gold">Redefined.</span></h1>
          <p className="hero-text">Access the COTHM Research Portal to manage theses, collaborate with supervisors, and track your academic progress.</p>
        </div>
      </div>

      <div className="form-side">
        <div className="form-wrapper">
          <div className="brand-header">
            <img src={logo} alt="COTHM" className="logo-img" />
            <div>
              <h2 className="welcome-title">Welcome back</h2>
              <p className="welcome-sub">Please enter your details to sign in.</p>
            </div>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="label">Email Address</label>
              <input className="input-field" type="email" placeholder="student@cothm.edu.pk" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} required />
              <FaEnvelope className="icon" />
            </div>

            <div className="input-group">
              <label className="label">Password</label>
              <input className="input-field" type={showPass ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={e=>setFormData({...formData, password:e.target.value})} required />
              <FaLock className="icon" />
              <span className="toggle-pass" onClick={() => setShowPass(!showPass)}>{showPass ? <FaEyeSlash/> : <FaEye/>}</span>
            </div>

            <div className="links-row">
              <Link to="/forgot-password" class="link">Forgot Password?</Link>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Authenticating..." : <>Sign In <FaArrowRight/></>}
            </button>

            <p style={{textAlign:'center', marginTop:30, color:'#64748b', fontSize:14}}>
              Don't have an account? <Link to="/signup" className="link">Create account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
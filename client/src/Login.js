import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import logo from "./logo.png"; 

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
        
        :root {
          --bg-dark: #0f172a;       /* Deep Navy Background */
          --card-dark: #1e293b;     /* Lighter Navy for Card */
          --text-main: #f8fafc;     /* White Text */
          --text-muted: #94a3b8;    /* Gray Text */
          --primary: #3b82f6;       /* Electric Blue */
          --border: #334155;        /* Subtle Border */
        }

        body { font-family: 'Inter', sans-serif; margin: 0; background: var(--bg-dark); overflow: hidden; }
        
        .login-container { display: flex; height: 100vh; width: 100vw; }
        
        /* LEFT SIDE (Cinematic) */
        .visual-side {
          flex: 1.3;
          background: linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.7)), 
                      url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1920');
          background-size: cover; background-position: center;
          display: flex; flex-direction: column; justify-content: center; padding: 80px; 
          color: white; border-right: 1px solid var(--border);
        }
        .hero-title { font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 20px; animation: fadeIn 0.8s ease-out; }
        .hero-gold { color: var(--primary); }

        /* RIGHT SIDE (Form) */
        .form-side { 
          flex: 1; background: var(--bg-dark); 
          display: flex; align-items: center; justify-content: center; 
          padding: 40px; position: relative; 
        }
        
        .back-home { 
          position: absolute; top: 30px; left: 30px; 
          text-decoration: none; color: var(--text-muted); font-weight: 600; 
          display: flex; align-items: center; gap: 8px; transition: 0.2s; font-size: 14px; 
        }
        .back-home:hover { color: white; transform: translateX(-5px); }

        .form-wrapper { width: 100%; max-width: 400px; animation: slideUp 0.6s ease-out; }
        
        /* DARK INPUTS */
        .input-group { position: relative; margin-bottom: 20px; }
        .input-field { 
          width: 100%; padding: 16px 16px 16px 45px; 
          background: var(--card-dark); border: 1px solid var(--border); 
          border-radius: 12px; color: white; font-size: 15px; outline: none; 
          transition: 0.3s; box-sizing: border-box;
        }
        .input-field::placeholder { color: #64748b; }
        .input-field:focus { 
          border-color: var(--primary); 
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2); 
          background: #243046;
        }
        .icon { position: absolute; left: 16px; bottom: 18px; color: var(--text-muted); font-size: 18px; }
        
        /* BUTTON */
        .btn-primary { 
          width: 100%; padding: 16px; background: var(--primary); 
          color: white; border: none; border-radius: 12px; 
          font-size: 16px; font-weight: 600; cursor: pointer; 
          display: flex; justify-content: center; align-items: center; gap: 10px; 
          margin-top: 20px; transition: 0.3s; 
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        .btn-primary:hover { background: #2563eb; transform: translateY(-2px); }
        .btn-primary:disabled { opacity: 0.7; cursor: wait; }

        .error-msg { background: rgba(239, 68, 68, 0.2); color: #fca5a5; padding: 12px; border-radius: 8px; font-size: 14px; margin-bottom: 20px; border: 1px solid rgba(239, 68, 68, 0.3); }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 900px) { .visual-side { display: none; } }
      `}</style>

      {/* LEFT SIDE */}
      <div className="visual-side">
        <div>
          <h1 className="hero-title">Secure <br/>Access <span className="hero-gold">Portal.</span></h1>
          <p style={{fontSize: '1.2rem', color: '#cbd5e1', lineHeight: '1.6'}}>
            Log in to access your research dashboard, submit theses, and track real-time progress.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="form-side">
        <Link to="/" className="back-home"><FaArrowLeft/> Back to Home</Link>

        <div className="form-wrapper">
          <div style={{marginBottom: 40}}>
            <img src={logo} alt="COTHM" style={{width: 60, marginBottom: 15}} />
            <h2 style={{fontSize: 32, margin: 0, color: 'white'}}>Welcome Back</h2>
            <p style={{color: '#94a3b8', marginTop: 10}}>Enter your credentials to continue.</p>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input className="input-field" type="email" placeholder="Email Address" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} required />
              <FaEnvelope className="icon" />
            </div>

            <div className="input-group">
              <input className="input-field" type={showPass ? "text" : "password"} placeholder="Password" value={formData.password} onChange={e=>setFormData({...formData, password:e.target.value})} required />
              <FaLock className="icon" />
              <span onClick={() => setShowPass(!showPass)} style={{position: 'absolute', right: 16, bottom: 18, color: '#94a3b8', cursor: 'pointer'}}>{showPass ? <FaEyeSlash/> : <FaEye/>}</span>
            </div>

            <div style={{textAlign: 'right'}}>
              <Link to="/forgot-password" style={{color: '#3b82f6', fontSize: 14, textDecoration: 'none', fontWeight: 500}}>Forgot Password?</Link>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Verifying..." : <>Sign In <FaArrowRight/></>}
            </button>

            <p style={{textAlign:'center', marginTop:30, color:'#64748b', fontSize:14}}>
              Don't have an account? <Link to="/signup" style={{color:'#3b82f6', fontWeight:600, textDecoration:'none'}}>Create one now</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
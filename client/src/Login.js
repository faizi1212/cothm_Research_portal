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
        body { font-family: 'Inter', sans-serif; margin: 0; background: #0f172a; }
        .login-container { display: flex; height: 100vh; width: 100vw; overflow: hidden; background: #0f172a; }
        
        .visual-side {
          flex: 1.2;
          background: linear-gradient(135deg, rgba(30, 60, 114, 0.9), rgba(42, 82, 152, 0.8)), url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920');
          background-size: cover; display: flex; flex-direction: column; justify-content: center; padding: 80px; color: white;
        }
        .hero-title { font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 20px; }
        .hero-gold { color: #d4af37; }

        .form-side { flex: 1; background: #ffffff; display: flex; align-items: center; justify-content: center; padding: 40px; position: relative; }
        .form-wrapper { width: 100%; max-width: 420px; }
        
        /* BACK BUTTON */
        .back-home { position: absolute; top: 30px; left: 30px; text-decoration: none; color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: 0.2s; font-size: 14px; }
        .back-home:hover { color: #1e3c72; transform: translateX(-5px); }

        .logo-img { width: 80px; margin-bottom: 10px; }
        .input-field { width: 100%; padding: 14px 14px 14px 45px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 15px; outline: none; background: #f8fafc; box-sizing: border-box; }
        .input-field:focus { border-color: #1e3c72; background: #fff; }
        .icon { position: absolute; left: 16px; bottom: 16px; color: #94a3b8; }
        .btn-primary { width: 100%; padding: 16px; background: #1e3c72; color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 10px; }
        .btn-primary:hover { background: #162c55; }
        
        @media (max-width: 900px) { .visual-side { display: none; } }
      `}</style>

      {/* LEFT SIDE */}
      <div className="visual-side">
        <div>
          <h1 className="hero-title">Academic <br/>Excellence <span className="hero-gold">Redefined.</span></h1>
          <p style={{fontSize: '1.2rem', opacity: 0.8}}>Access the COTHM Research Portal.</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="form-side">
        {/* ✅ BACK BUTTON */}
        <Link to="/" className="back-home"><FaArrowLeft/> Back to Home</Link>

        <div className="form-wrapper">
          <div style={{marginBottom: 40}}>
            <img src={logo} alt="COTHM" className="logo-img" />
            <h2 style={{fontSize: 28, margin: 0, color: '#1e293b'}}>Welcome back</h2>
            <p style={{color: '#64748b'}}>Please enter your details to sign in.</p>
          </div>

          {error && <div style={{background: '#fee2e2', color: '#991b1b', padding: 12, borderRadius: 8, marginBottom: 20}}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div style={{position: 'relative', marginBottom: 20}}>
              <input className="input-field" type="email" placeholder="Email Address" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} required />
              <FaEnvelope className="icon" />
            </div>

            <div style={{position: 'relative', marginBottom: 20}}>
              <input className="input-field" type={showPass ? "text" : "password"} placeholder="Password" value={formData.password} onChange={e=>setFormData({...formData, password:e.target.value})} required />
              <FaLock className="icon" />
              <span onClick={() => setShowPass(!showPass)} style={{position: 'absolute', right: 16, bottom: 16, color: '#94a3b8', cursor: 'pointer'}}>{showPass ? <FaEyeSlash/> : <FaEye/>}</span>
            </div>

            <div style={{display:'flex', justifyContent:'space-between', marginBottom:30, fontSize:14}}>
              <Link to="/forgot-password" style={{color:'#1e3c72', fontWeight:600, textDecoration:'none'}}>Forgot Password?</Link>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Authenticating..." : <>Sign In <FaArrowRight/></>}
            </button>

            <p style={{textAlign:'center', marginTop:30, color:'#64748b', fontSize:14}}>
              Don't have an account? <Link to="/signup" style={{color:'#1e3c72', fontWeight:600, textDecoration:'none'}}>Create account</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
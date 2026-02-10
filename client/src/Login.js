import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft, FaGoogle, FaMicrosoft } from "react-icons/fa";
import logo from "./logo.png"; 

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(null);
  const [shake, setShake] = useState(false); // ✨ New: Shake animation state
  
  const navigate = useNavigate();
  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate(res.data.user.role === "supervisor" ? "/admin" : "/dashboard");
    } catch (err) { 
      setError(err.response?.data?.message || "Login failed"); 
      setShake(true); // Trigger shake
      setTimeout(() => setShake(false), 300);
    } 
    finally { setLoading(false); }
  };

  return (
    <div className="login-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap');
        
        :root { --bg-dark: #0f172a; --card-dark: #1e293b; --primary: #3b82f6; --text-muted: #94a3b8; }
        body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg-dark); overflow: hidden; }
        .login-container { display: flex; height: 100vh; width: 100vw; }
        
        /* LEFT SIDE (Cinematic) */
        .visual-side {
          flex: 1.3;
          background: linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.7)), 
                      url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1920');
          background-size: cover; background-position: center;
          display: flex; flex-direction: column; justify-content: center; padding: 80px; 
          color: white; border-right: 1px solid #334155;
        }
        
        /* RIGHT SIDE (Form) */
        .form-side { flex: 1; background: var(--bg-dark); display: flex; align-items: center; justify-content: center; padding: 40px; position: relative; }
        .form-wrapper { width: 100%; max-width: 400px; animation: slideUp 0.6s ease-out; }
        
        /* ANIMATIONS */
        .shake { animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* INPUTS */
        .input-group { position: relative; margin-bottom: 20px; }
        .input-field { 
          width: 100%; padding: 16px 16px 16px 45px; background: var(--card-dark); border: 1px solid #334155; 
          border-radius: 12px; color: white; font-size: 15px; outline: none; transition: 0.3s; box-sizing: border-box;
        }
        .input-field:focus { border-color: var(--primary); background: #243046; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        .input-icon { position: absolute; left: 16px; top: 18px; color: var(--text-muted); transition: 0.3s; }
        .input-field:focus ~ .input-icon { color: var(--primary); }

        /* BUTTONS */
        .btn-primary { 
          width: 100%; padding: 16px; background: var(--primary); color: white; border: none; border-radius: 12px; 
          font-size: 16px; font-weight: 600; cursor: pointer; display: flex; justify-content: center; gap: 10px; transition: 0.3s; 
        }
        .btn-primary:hover { background: #2563eb; transform: translateY(-2px); }
        
        .social-btn { 
          width: 100%; padding: 12px; background: transparent; border: 1px solid #334155; 
          border-radius: 10px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.2s; 
        }
        .social-btn:hover { background: rgba(255,255,255,0.05); border-color: white; }

        .back-home { position: absolute; top: 30px; left: 30px; text-decoration: none; color: var(--text-muted); font-weight: 600; display: flex; align-items: center; gap: 8px; font-size: 14px; }
        .back-home:hover { color: white; transform: translateX(-5px); }
        @media (max-width: 900px) { .visual-side { display: none; } }
      `}</style>

      <div className="visual-side">
        <h1 style={{fontSize: '3.5rem', fontWeight: 800, margin:0}}>Secure <br/><span style={{color:'#3b82f6'}}>Portal.</span></h1>
        <p style={{fontSize: '1.2rem', color: '#cbd5e1', marginTop:15}}>Access COTHM's advanced research database.</p>
      </div>

      <div className="form-side">
        <Link to="/" className="back-home"><FaArrowLeft/> Back to Home</Link>
        
        <div className={`form-wrapper ${shake ? 'shake' : ''}`}>
          <div style={{marginBottom: 30}}>
            <img src={logo} alt="COTHM" style={{width: 50, marginBottom: 15}} />
            <h2 style={{fontSize: 28, margin: 0, color: 'white'}}>Welcome Back</h2>
            <p style={{color: '#94a3b8', marginTop: 5}}>Enter your credentials to continue.</p>
          </div>

          {/* ✨ New: Social Login Visuals */}
          <div style={{display:'flex', gap:10, marginBottom:25}}>
            <button className="social-btn"><FaGoogle color="#ea4335"/> Google</button>
            <button className="social-btn"><FaMicrosoft color="#00a4ef"/> Microsoft</button>
          </div>

          <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:20, color:'#64748b', fontSize:12}}>
            <div style={{flex:1, height:1, background:'#334155'}}></div> OR <div style={{flex:1, height:1, background:'#334155'}}></div>
          </div>

          {error && <div style={{background:'rgba(239, 68, 68, 0.15)', color:'#fca5a5', padding:12, borderRadius:8, fontSize:14, marginBottom:20, border:'1px solid rgba(239, 68, 68, 0.3)'}}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input className="input-field" type="email" placeholder="Email Address" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} required />
              <FaEnvelope className="input-icon" />
            </div>
            <div className="input-group">
              <input className="input-field" type={showPass?"text":"password"} placeholder="Password" value={formData.password} onChange={e=>setFormData({...formData, password:e.target.value})} required />
              <FaLock className="input-icon" />
              <span onClick={()=>setShowPass(!showPass)} style={{position:'absolute', right:16, bottom:18, color:'#94a3b8', cursor:'pointer'}}>{showPass?<FaEyeSlash/>:<FaEye/>}</span>
            </div>
            
            <div style={{textAlign:'right', marginBottom:20}}>
              <Link to="/forgot-password" style={{color:'#3b82f6', fontSize:13, textDecoration:'none'}}>Forgot Password?</Link>
            </div>
            
            <button className="btn-primary" disabled={loading}>
              {loading ? "Verifying..." : <>Sign In <FaArrowRight/></>}
            </button>
          </form>

          <p style={{textAlign:'center', marginTop:30, color:'#64748b', fontSize:14}}>
            Don't have an account? <Link to="/signup" style={{color:'#3b82f6', fontWeight:600, textDecoration:'none'}}>Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
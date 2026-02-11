import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaGraduationCap, FaArrowLeft } from "react-icons/fa";
import logo from "./logo.png"; 

const Signup = () => {
  // ✅ UPDATED: Default course set to "DIHO"
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", course: "DIHO", batchNumber: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = "https://cothm-research-portal.onrender.com";

  // ✨ New: Password Strength Logic
  const getStrength = (pass) => {
    if (pass.length === 0) return 0;
    if (pass.length < 6) return 30;
    if (pass.length < 10) return 60;
    return 100;
  };
  const strength = getStrength(formData.password);
  const strengthColor = strength < 40 ? '#ef4444' : strength < 80 ? '#f59e0b' : '#10b981';

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/register`, formData);
      alert("✅ Account Created! Please Login.");
      navigate("/login");
    } catch (err) { alert("Registration failed. Email might be in use."); } finally { setLoading(false); }
  };

  return (
    <div className="split-screen">
      <style>{`
        :root { --bg-dark: #0f172a; --card-dark: #1e293b; --text-main: #f8fafc; --text-muted: #94a3b8; --primary: #3b82f6; --border: #334155; }
        body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg-dark); overflow: hidden; }
        .split-screen { display: flex; height: 100vh; width: 100vw; }
        
        .left-pane { 
          flex: 1; background: linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920'); 
          background-size: cover; display: flex; flex-direction: column; justify-content: center; padding: 60px; color: white; border-right: 1px solid var(--border);
        }
        .right-pane { flex: 1; background: var(--bg-dark); display: flex; align-items: center; justify-content: center; padding: 40px; position: relative; }
        
        .form-wrapper { width: 100%; max-width: 480px; animation: fadeIn 0.5s ease; }
        
        .form-input { 
          width: 100%; padding: 14px 14px 14px 40px; background: var(--card-dark); border: 1px solid var(--border); 
          border-radius: 10px; font-size: 14px; outline: none; box-sizing: border-box; margin-bottom: 15px; color: white; transition: 0.3s;
        }
        .form-input:focus { border-color: var(--primary); background: #243046; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        .input-icon { position: absolute; left: 12px; top: 16px; color: var(--text-muted); }
        
        .btn-login { width: 100%; padding: 14px; background: var(--primary); color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .btn-login:hover { background: #2563eb; transform: translateY(-2px); }
        
        .strength-bar { height: 4px; border-radius: 2px; transition: 0.3s; margin-bottom: 20px; }
        .back-home { position: absolute; top: 30px; left: 30px; text-decoration: none; color: var(--text-muted); font-weight: 600; display: flex; align-items: center; gap: 8px; transition: 0.2s; font-size: 14px; }
        .back-home:hover { color: white; transform: translateX(-5px); }
        
        @keyframes fadeIn { from{opacity:0; transform:translateY(10px)} to{opacity:1; transform:translateY(0)} }
        @media (max-width: 900px) { .left-pane { display: none; } }
      `}</style>

      <div className="left-pane">
        <h1 style={{fontSize: '3rem', fontWeight: 800, marginBottom: 20}}>Join COTHM <br/><span style={{color:'#3b82f6'}}>Research.</span></h1>
        <p style={{fontSize: '1.2rem', color:'#cbd5e1', lineHeight:1.6}}>Start your academic journey today with world-class tools.</p>
      </div>

      <div className="right-pane">
        <Link to="/" className="back-home"><FaArrowLeft/> Back to Home</Link>

        <div className="form-wrapper">
          <div style={{textAlign: 'center', marginBottom: 30}}>
            <img src={logo} alt="Logo" style={{width: 60}} />
            <h2 style={{fontSize: 26, margin: '10px 0 5px', color: 'white'}}>Create Account</h2>
            <p style={{color: '#64748b', fontSize: 14}}>Join your batch mates today.</p>
          </div>

          <form onSubmit={handleSignup}>
            <div style={{display: 'flex', gap: 15}}>
              <div style={{position:'relative', flex:1}}><FaUser className="input-icon" /><input className="form-input" placeholder="First Name" onChange={e=>setFormData({...formData, firstName:e.target.value})} required /></div>
              <div style={{position:'relative', flex:1}}><FaUser className="input-icon" /><input className="form-input" placeholder="Last Name" onChange={e=>setFormData({...formData, lastName:e.target.value})} required /></div>
            </div>
            <div style={{position:'relative'}}><FaEnvelope className="input-icon" /><input className="form-input" placeholder="Student Email" onChange={e=>setFormData({...formData, email:e.target.value})} required /></div>
            <div style={{display: 'flex', gap: 15}}>
              <div style={{position:'relative', flex:1}}>
                <FaGraduationCap className="input-icon" />
                {/* ✅ UPDATED: Corrected Courses for DIHO/DHTML */}
                <select className="form-input" onChange={e=>setFormData({...formData, course:e.target.value})}>
                  <option value="DIHO">DIHO</option>
                  <option value="DHTML">DHTML</option>
                </select>
              </div>
              <div style={{position:'relative', flex:1}}><FaIdCard className="input-icon" /><input className="form-input" placeholder="Batch No" onChange={e=>setFormData({...formData, batchNumber:e.target.value})} required /></div>
            </div>
            
            <div style={{position:'relative', marginBottom:5}}>
              <FaLock className="input-icon" />
              <input type="password" className="form-input" placeholder="Create Password" onChange={e=>setFormData({...formData, password:e.target.value})} required style={{marginBottom:0}} />
            </div>
            {/* ✨ New: Password Strength Meter */}
            <div style={{background: '#334155', height: 4, borderRadius: 2, marginBottom: 20, marginTop: 10, width:'100%'}}>
              <div className="strength-bar" style={{width: `${strength}%`, background: strengthColor}}></div>
            </div>

            <button className="btn-login" disabled={loading}>{loading ? "Creating..." : "Sign Up"}</button>
            <p style={{textAlign:'center', marginTop:20, fontSize:14, color:'#64748b'}}>Already registered? <Link to="/login" style={{color:'#3b82f6', fontWeight:700, textDecoration:'none'}}>Login Here</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
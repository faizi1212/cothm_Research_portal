import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaGraduationCap, FaArrowLeft } from "react-icons/fa";
import logo from "./logo.png"; 

const Signup = () => {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", course: "Computer Science", batchNumber: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/register`, formData);
      alert("✅ Account Created! Please Login.");
      navigate("/login");
    } catch (err) { alert("Registration failed."); } finally { setLoading(false); }
  };

  return (
    <div className="split-screen">
      <style>{`
        body { margin: 0; font-family: 'Inter', sans-serif; }
        .split-screen { display: flex; height: 100vh; width: 100vw; }
        .left-pane { flex: 1; background: linear-gradient(rgba(30, 60, 114, 0.9), rgba(42, 82, 152, 0.8)), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920'); background-size: cover; display: flex; flex-direction: column; justify-content: center; padding: 60px; color: white; }
        .right-pane { flex: 1; background: white; display: flex; align-items: center; justify-content: center; padding: 40px; position: relative; }
        .back-home { position: absolute; top: 30px; left: 30px; text-decoration: none; color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: 0.2s; font-size: 14px; }
        .back-home:hover { color: #1e3c72; transform: translateX(-5px); }
        .form-input { width: 100%; padding: 12px 12px 12px 40px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; outline: none; box-sizing: border-box; margin-bottom: 15px; }
        .form-input:focus { border-color: #1e3c72; }
        .input-icon { position: absolute; left: 12px; top: 14px; color: #94a3b8; }
        .btn-login { width: 100%; padding: 14px; background: #1e3c72; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; }
        @media (max-width: 900px) { .left-pane { display: none; } }
      `}</style>

      <div className="left-pane">
        <h1 style={{fontSize: '3rem', fontWeight: 800}}>Join COTHM Today</h1>
        <p style={{fontSize: '1.2rem', opacity: 0.9}}>Start your academic journey with the best tools.</p>
      </div>

      <div className="right-pane">
        {/* ✅ BACK BUTTON */}
        <Link to="/" className="back-home"><FaArrowLeft/> Back to Home</Link>

        <div style={{width: '100%', maxWidth: 450}}>
          <div style={{textAlign: 'center', marginBottom: 30}}>
            <img src={logo} alt="Logo" style={{width: 70}} />
            <h2 style={{fontSize: 24, margin: '10px 0 0', color: '#1e293b'}}>Create Account</h2>
          </div>

          <form onSubmit={handleSignup}>
            <div style={{display: 'flex', gap: 15}}>
              <div style={{position: 'relative', flex: 1}}><FaUser className="input-icon" /><input className="form-input" placeholder="First Name" onChange={e=>setFormData({...formData, firstName:e.target.value})} required /></div>
              <div style={{position: 'relative', flex: 1}}><FaUser className="input-icon" /><input className="form-input" placeholder="Last Name" onChange={e=>setFormData({...formData, lastName:e.target.value})} required /></div>
            </div>
            <div style={{position: 'relative'}}><FaEnvelope className="input-icon" /><input className="form-input" placeholder="Email" onChange={e=>setFormData({...formData, email:e.target.value})} required /></div>
            <div style={{display: 'flex', gap: 15}}>
              <div style={{position: 'relative', flex: 1}}><FaGraduationCap className="input-icon" /><select className="form-input" style={{background:'white'}} onChange={e=>setFormData({...formData, course:e.target.value})}><option>Computer Science</option><option>IT</option></select></div>
              <div style={{position: 'relative', flex: 1}}><FaIdCard className="input-icon" /><input className="form-input" placeholder="Batch No" onChange={e=>setFormData({...formData, batchNumber:e.target.value})} required /></div>
            </div>
            <div style={{position: 'relative'}}><FaLock className="input-icon" /><input type="password" className="form-input" placeholder="Password" onChange={e=>setFormData({...formData, password:e.target.value})} required /></div>
            <button className="btn-login" disabled={loading}>{loading ? "Creating..." : "Sign Up"}</button>
            <p style={{textAlign:'center', marginTop:20, fontSize:14, color:'#64748b'}}>Already registered? <Link to="/login" style={{color:'#1e3c72', fontWeight:700, textDecoration:'none'}}>Login</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
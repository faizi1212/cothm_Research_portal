import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaGraduationCap } from "react-icons/fa";
import logo from "./logo.png"; 

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "",
    course: "Computer Science", batchNumber: ""
  });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/register`, formData);
      alert("✅ Account Created! Please Login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-screen">
      {/* Reusing Styles from Login for Consistency */}
      <style>{`
        :root { --primary: #1e3c72; --gold: #d4af37; }
        body { margin: 0; font-family: 'Inter', sans-serif; overflow-x: hidden; }
        .split-screen { display: flex; height: 100vh; width: 100vw; }
        
        .left-pane {
          flex: 1;
          background: linear-gradient(rgba(30, 60, 114, 0.9), rgba(42, 82, 152, 0.8)), 
                      url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920');
          background-size: cover; background-position: center;
          display: flex; flex-direction: column; justify-content: center; padding: 60px; color: white;
        }
        .hero-title { font-size: 3rem; font-weight: 800; margin-bottom: 20px; }
        .hero-gold { color: var(--gold); }
        .hero-text { font-size: 1.1rem; opacity: 0.9; }

        .right-pane { flex: 1; background: white; display: flex; align-items: center; justify-content: center; padding: 40px; overflow-y: auto; }
        .login-wrapper { width: 100%; max-width: 450px; animation: fadeIn 1s ease-out; }
        
        .brand-header { margin-bottom: 30px; text-align: center; }
        .brand-logo { width: 70px; margin-bottom: 10px; }
        .welcome-text { font-size: 24px; font-weight: 700; color: #1e293b; }

        .form-row { display: flex; gap: 15px; }
        .input-group { margin-bottom: 15px; position: relative; width: 100%; }
        .form-input { width: 100%; padding: 12px 12px 12px 40px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; outline: none; box-sizing: border-box; }
        .form-input:focus { border-color: var(--primary); }
        .input-icon { position: absolute; left: 12px; top: 14px; color: #94a3b8; }
        
        .btn-login { width: 100%; padding: 14px; background: var(--primary); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; transition: 0.2s; margin-top: 10px; }
        .btn-login:hover { background: #162c55; transform: translateY(-2px); }
        
        .signup-text { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
        .signup-link { color: var(--primary); font-weight: 700; text-decoration: none; }
        
        select.form-input { appearance: none; background: white; cursor: pointer; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 900px) { .left-pane { display: none; } .right-pane { background: #f8fafc; } .login-wrapper { background: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); } }
      `}</style>

      <div className="left-pane">
        <div style={{maxWidth: 500}}>
          <h1 className="hero-title">Join <span className="hero-gold">COTHM</span> Today</h1>
          <p className="hero-text">Start your academic journey with the best tools for research and collaboration.</p>
        </div>
      </div>

      <div className="right-pane">
        <div className="login-wrapper">
          <div className="brand-header">
            <img src={logo} alt="Logo" className="brand-logo" />
            <h2 className="welcome-text">Create Account</h2>
          </div>

          <form onSubmit={handleSignup}>
            <div className="form-row">
              <div className="input-group">
                <FaUser className="input-icon" />
                <input type="text" name="firstName" className="form-input" placeholder="First Name" onChange={handleChange} required />
              </div>
              <div className="input-group">
                <FaUser className="input-icon" />
                <input type="text" name="lastName" className="form-input" placeholder="Last Name" onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input type="email" name="email" className="form-input" placeholder="Student Email" onChange={handleChange} required />
            </div>

            <div className="form-row">
              <div className="input-group">
                <FaGraduationCap className="input-icon" />
                <select name="course" className="form-input" onChange={handleChange}>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Hospitality Management">Hospitality Management</option>
                </select>
              </div>
              <div className="input-group">
                <FaIdCard className="input-icon" />
                <input type="text" name="batchNumber" className="form-input" placeholder="Batch (e.g. 24)" onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input type="password" name="password" className="form-input" placeholder="Create Password" onChange={handleChange} required />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Registering..." : "Sign Up"}
            </button>

            <p className="signup-text">
              Already have an account? <Link to="/login" className="signup-link">Login Here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaGraduationCap } from "react-icons/fa";
import logo from "./logo.png"; // ✅ COTHM Logo

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    course: "Computer Science",
    batchNumber: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${API_URL}/api/auth/register`, formData);
      alert("✅ Account Created Successfully! Please Login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Reusing Styles for Consistency */}
      <style>{`
        :root {
          --primary: #1e3c72;
          --gold: #d4af37;
          --bg-gradient: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        }
        body { margin: 0; font-family: 'Inter', sans-serif; background: #f3f4f6; }
        .auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg-gradient); padding: 20px; position: relative; }
        
        .auth-card {
          background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px);
          border-radius: 24px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 100%; max-width: 500px; overflow: hidden; position: relative; z-index: 10;
        }

        .auth-header { background: white; padding: 30px 30px 20px; text-align: center; border-bottom: 1px solid #f0f2f5; }
        .brand-logo { width: 90px; height: auto; margin-bottom: 10px; }
        .brand-title { font-size: 20px; font-weight: 800; color: var(--primary); margin: 0; text-transform: uppercase; }
        .brand-subtitle { color: #64748b; font-size: 13px; margin-top: 5px; }

        .auth-form { padding: 30px; }
        .form-row { display: flex; gap: 15px; }
        .input-group { position: relative; margin-bottom: 15px; flex: 1; }
        .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #94a3b8; z-index: 5; }
        
        .form-input {
          width: 100%; padding: 12px 12px 12px 48px; border: 2px solid #e2e8f0; border-radius: 12px;
          font-size: 14px; outline: none; transition: all 0.3s; box-sizing: border-box; color: #334155; background: #f8fafc;
        }
        .form-input:focus { border-color: var(--gold); background: white; }
        
        .btn-primary {
          width: 100%; padding: 14px; background: var(--primary); color: white; border: none; border-radius: 12px;
          font-weight: 700; font-size: 15px; cursor: pointer; transition: all 0.2s; margin-top: 15px;
        }
        .btn-primary:hover { background: #102a56; transform: translateY(-2px); }
        
        .auth-footer { text-align: center; margin-top: 20px; font-size: 14px; color: #64748b; }
        .login-link { color: var(--primary); font-weight: 700; text-decoration: none; margin-left: 5px; }
        .login-link:hover { color: var(--gold); text-decoration: underline; }
        .error-box { background: #fee2e2; color: #991b1b; padding: 12px; border-radius: 8px; font-size: 13px; margin-bottom: 20px; text-align: center; }
        
        select.form-input { appearance: none; background: #f8fafc; cursor: pointer; }
        
        @media (max-width: 480px) { .form-row { flex-direction: column; gap: 0; } }
      `}</style>

      <div className="auth-card">
        <div className="auth-header">
          <img src={logo} alt="COTHM Logo" className="brand-logo" />
          <h1 className="brand-title">Student Registration</h1>
          <p className="brand-subtitle">Create your account to start submitting research</p>
        </div>

        <form className="auth-form" onSubmit={handleSignup}>
          {error && <div className="error-box">{error}</div>}

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
              <input type="text" name="batchNumber" className="form-input" placeholder="Batch No (e.g. 24)" onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input type="password" name="password" className="form-input" placeholder="Create Password" onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="auth-footer">
            Already registered? 
            <Link to="/login" className="login-link">Login Here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
import React from "react";
import { Link } from "react-router-dom";
import { FaRocket, FaShieldAlt, FaChartLine, FaArrowRight, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import logo from "./logo.png"; // ✅ IMPORT LOGO

const Home = () => {
  return (
    <div className="landing-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        
        :root { --primary: #1e3c72; --accent: #3b82f6; --text: #0f172a; --bg: #ffffff; }
        body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }

        /* NAVBAR */
        .navbar {
          display: flex; justify-content: space-between; align-items: center; 
          padding: 15px 40px; max-width: 1200px; margin: 0 auto;
          position: sticky; top: 0; background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px); z-index: 100; border-bottom: 1px solid #f1f5f9;
        }
        .logo-img { height: 50px; width: auto; } /* ✅ Logo Size */

        .nav-btn {
          text-decoration: none; font-weight: 600; padding: 10px 20px; border-radius: 8px; transition: 0.2s;
          display: flex; align-items: center; gap: 8px;
        }
        .login-btn { color: #64748b; }
        .login-btn:hover { color: var(--primary); background: #f1f5f9; }
        .signup-btn { background: var(--primary); color: white; }
        .signup-btn:hover { background: #162c55; transform: translateY(-2px); }

        /* HERO */
        .hero {
          min-height: 85vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 0 20px;
          background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 60%);
        }
        .hero-title {
          font-size: 3.5rem; font-weight: 800; letter-spacing: -1.5px; line-height: 1.1; margin: 0 0 20px 0;
          background: linear-gradient(135deg, #0f172a 0%, #1e3c72 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: slideUp 0.8s ease-out;
        }
        .hero-sub { font-size: 1.2rem; color: #64748b; max-width: 600px; margin: 0 auto 40px auto; line-height: 1.6; animation: slideUp 1s ease-out; }

        /* BUTTONS */
        .cta-group { display: flex; gap: 15px; justify-content: center; animation: slideUp 1.2s ease-out; }
        .hero-btn { padding: 16px 32px; border-radius: 12px; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 10px; transition: 0.3s; }
        .btn-primary { background: var(--primary); color: white; box-shadow: 0 10px 25px -5px rgba(30, 60, 114, 0.4); }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 20px 30px -10px rgba(30, 60, 114, 0.5); }
        
        /* FEATURES */
        .features { max-width: 1200px; margin: 0 auto; padding: 80px 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .feature-card { background: #f8fafc; padding: 40px; border-radius: 24px; border: 1px solid #e2e8f0; transition: 0.3s; }
        .feature-card:hover { transform: translateY(-5px); border-color: var(--accent); background: white; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .icon-box { width: 50px; height: 50px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--accent); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin-bottom: 20px; }

        /* FOOTER */
        .footer { border-top: 1px solid #e2e8f0; padding: 40px 20px; text-align: center; color: #64748b; font-size: 14px; background: #f8fafc; }

        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @media(max-width: 768px) { .hero-title { font-size: 2.5rem; } .navbar { padding: 15px 20px; } }
      `}</style>

      {/* NAVBAR */}
      <div className="navbar">
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <img src={logo} alt="COTHM Logo" className="logo-img" /> 
          <span style={{fontWeight:800, fontSize:20, color:'#1e3c72', letterSpacing:'-0.5px'}}>COTHM PORTAL</span>
        </div>
        <div style={{display:'flex', gap:10}}>
          <Link to="/login" className="nav-btn login-btn"><FaSignInAlt/> Login</Link>
          <Link to="/signup" className="nav-btn signup-btn"><FaUserPlus/> Register</Link>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div style={{background: '#e0f2fe', color:'#0284c7', padding:'5px 15px', borderRadius:20, fontSize:12, fontWeight:700, marginBottom:20, letterSpacing:1, textTransform:'uppercase'}}>
          Official Research Portal
        </div>
        <h1 className="hero-title">Elevate Your Academic <br/> Research Journey</h1>
        <p className="hero-sub">
          A seamless platform for COTHM students to submit theses, track approvals, and collaborate with supervisors in real-time.
        </p>
        <div className="cta-group">
          <Link to="/signup" className="hero-btn btn-primary">Get Started Now <FaArrowRight/></Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature-card">
          <div className="icon-box"><FaRocket/></div>
          <h3>Fast Submissions</h3>
          <p style={{color:'#64748b'}}>Drag & drop your research papers. Our intelligent system processes submissions instantly.</p>
        </div>
        <div className="feature-card">
          <div className="icon-box"><FaShieldAlt/></div>
          <h3>Secure & Private</h3>
          <p style={{color:'#64748b'}}>Your intellectual property is safe. We use enterprise-grade encryption to protect your data.</p>
        </div>
        <div className="feature-card">
          <div className="icon-box"><FaChartLine/></div>
          <h3>Real-time Tracking</h3>
          <p style={{color:'#64748b'}}>Stay updated with live status notifications and supervisor feedback instantly.</p>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 COTHM International. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
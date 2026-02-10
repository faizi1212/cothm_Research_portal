import React from "react";
import { Link } from "react-router-dom";
import { FaRocket, FaShieldAlt, FaChartLine, FaArrowRight, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import logo from "./logo.png"; 

const Home = () => {
  return (
    <div className="landing-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        
        :root {
          --primary: #2563eb;
          --primary-dark: #1e40af;
          --accent: #7c3aed; /* Violet accent */
          --text: #0f172a;
          --text-light: #475569;
        }

        body { 
          margin: 0; 
          font-family: 'Inter', sans-serif; 
          color: var(--text); 
          overflow-x: hidden;
          background-color: #f8fafc;
        }

        /* --- MODERN ANIMATED BACKGROUND --- */
        .landing-page {
          position: relative;
          width: 100%;
          min-height: 100vh;
          /* Tech Grid Pattern */
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          overflow: hidden;
        }

        /* Glowing Orbs (The "Aurora" Effect) */
        .landing-page::before {
          content: '';
          position: absolute;
          top: -10%; left: -10%; width: 50%; height: 50%;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, transparent 70%);
          filter: blur(80px);
          animation: float 10s infinite alternate;
          z-index: -1;
        }
        .landing-page::after {
          content: '';
          position: absolute;
          bottom: -10%; right: -10%; width: 50%; height: 50%;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%);
          filter: blur(80px);
          animation: float 8s infinite alternate-reverse;
          z-index: -1;
        }

        @keyframes float { 0% { transform: translate(0, 0); } 100% { transform: translate(30px, 30px); } }

        /* NAVBAR (Glassmorphism) */
        .navbar {
          display: flex; justify-content: space-between; align-items: center; 
          padding: 15px 40px; max-width: 1200px; margin: 0 auto;
          position: sticky; top: 0; 
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px); 
          z-index: 100; border-bottom: 1px solid rgba(255,255,255,0.3);
        }
        .logo-img { height: 45px; width: auto; }

        .nav-btn {
          text-decoration: none; font-weight: 600; padding: 10px 20px; border-radius: 50px; transition: 0.2s;
          display: flex; align-items: center; gap: 8px; font-size: 14px;
        }
        .login-btn { color: var(--text-light); }
        .login-btn:hover { color: var(--primary); background: rgba(37, 99, 235, 0.05); }
        .signup-btn { background: var(--primary); color: white; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2); }
        .signup-btn:hover { background: var(--primary-dark); transform: translateY(-1px); }

        /* HERO SECTION */
        .hero {
          min-height: 85vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 0 20px; position: relative;
        }
        
        .badge {
          background: white; border: 1px solid #e2e8f0; color: var(--primary);
          padding: 6px 16px; borderRadius: 30px; fontSize: 13px; fontWeight: 600;
          marginBottom: 25px; display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.03); animation: fadeIn 1s ease-out;
        }

        .hero-title {
          font-size: 4rem; font-weight: 800; letter-spacing: -2px; line-height: 1.1; margin: 0 0 25px 0;
          background: linear-gradient(135deg, #0f172a 30%, #2563eb 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: slideUp 0.8s ease-out;
        }
        .hero-sub { 
          font-size: 1.25rem; color: var(--text-light); max-width: 600px; margin: 0 auto 40px auto; 
          line-height: 1.6; animation: slideUp 1s ease-out; 
        }

        /* BUTTONS */
        .cta-group { display: flex; gap: 15px; justify-content: center; animation: slideUp 1.2s ease-out; }
        .hero-btn { 
          padding: 16px 36px; border-radius: 14px; font-weight: 700; text-decoration: none; 
          display: flex; align-items: center; gap: 10px; transition: 0.3s; font-size: 16px;
        }
        .btn-primary { 
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); 
          color: white; box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4); 
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 20px 30px -10px rgba(37, 99, 235, 0.5); }
        
        /* FEATURES (Bento Grid) */
        .features { 
          max-width: 1200px; margin: 0 auto; padding: 100px 20px; 
          display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; 
        }
        .feature-card { 
          background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(10px);
          padding: 40px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.5); 
          transition: 0.3s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
        }
        .feature-card:hover { 
          transform: translateY(-8px); border-color: var(--primary); 
          background: white; box-shadow: 0 20px 40px -5px rgba(0,0,0,0.05); 
        }
        .icon-box { 
          width: 55px; height: 55px; background: white; border-radius: 14px; 
          display: flex; align-items: center; justify-content: center; font-size: 26px; 
          color: var(--primary); box-shadow: 0 4px 10px rgba(0,0,0,0.05); margin-bottom: 25px; 
        }
        .ft-title { font-size: 20px; font-weight: 700; margin: 0 0 10px 0; color: var(--text); }
        .ft-desc { color: var(--text-light); line-height: 1.6; font-size: 15px; }

        /* FOOTER */
        .footer { 
          border-top: 1px solid #e2e8f0; padding: 40px 20px; text-align: center; 
          color: var(--text-light); font-size: 14px; background: white; 
        }

        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @media(max-width: 768px) { .hero-title { font-size: 2.8rem; } .navbar { padding: 15px 20px; } }
      `}</style>

      {/* NAVBAR */}
      <div className="navbar">
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <img src={logo} alt="COTHM Logo" className="logo-img" /> 
          <span style={{fontWeight:800, fontSize:20, color:'#0f172a', letterSpacing:'-0.5px'}}>COTHM PORTAL</span>
        </div>
        <div style={{display:'flex', gap:10}}>
          <Link to="/login" className="nav-btn login-btn"><FaSignInAlt/> Login</Link>
          <Link to="/signup" className="nav-btn signup-btn"><FaUserPlus/> Join Now</Link>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <span className="badge">🚀 v2.0 Now Available for All Batches</span>
        <h1 className="hero-title">Academic Research <br/> Made <span style={{color:'#2563eb'}}>Effortless.</span></h1>
        <p className="hero-sub">
          The official research management platform for COTHM International. 
          Submit proposals, get instant supervisor feedback, and track your thesis journey.
        </p>
        <div className="cta-group">
          <Link to="/signup" className="hero-btn btn-primary">Start Your Research <FaArrowRight/></Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature-card">
          <div className="icon-box" style={{color:'#2563eb'}}><FaRocket/></div>
          <h3 className="ft-title">Smart Submissions</h3>
          <p className="ft-desc">Drag & drop your research papers. Our intelligent system organizes versions and statuses automatically.</p>
        </div>
        <div className="feature-card">
          <div className="icon-box" style={{color:'#7c3aed'}}><FaShieldAlt/></div>
          <h3 className="ft-title">Secure & Private</h3>
          <p className="ft-desc">Your intellectual property is protected with enterprise-grade encryption. Only you and your supervisor have access.</p>
        </div>
        <div className="feature-card">
          <div className="icon-box" style={{color:'#059669'}}><FaChartLine/></div>
          <h3 className="ft-title">Live Tracking</h3>
          <p className="ft-desc">Never miss a deadline. Get real-time notifications for approvals, feedback, and upcoming submission dates.</p>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 COTHM International. Built for Excellence.</p>
      </footer>
    </div>
  );
};

export default Home;
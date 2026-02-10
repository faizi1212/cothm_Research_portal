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
          --primary: #3b82f6;       /* Bright Blue for buttons */
          --primary-dark: #2563eb;  /* Darker Blue for hover */
          --accent: #8b5cf6;        /* Soft Violet */
          --bg: #0f172a;            /* Deep Navy (Eye Comfort) */
          --card-bg: #1e293b;       /* Lighter Navy for cards */
          --text: #f1f5f9;          /* Soft White */
          --text-light: #94a3b8;    /* Muted Gray */
          --border: #334155;        /* Subtle Borders */
        }

        body { 
          margin: 0; 
          font-family: 'Inter', sans-serif; 
          color: var(--text); 
          background-color: var(--bg);
          overflow-x: hidden;
        }

        /* --- DARK MODE BACKGROUND --- */
        .landing-page {
          position: relative;
          width: 100%;
          min-height: 100vh;
          /* Subtle Grid Pattern */
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          overflow: hidden;
        }

        /* Ambient Glow (Aurora Effect) */
        .landing-page::before {
          content: '';
          position: absolute;
          top: -20%; left: -10%; width: 60%; height: 60%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
          filter: blur(100px);
          animation: float 10s infinite alternate;
          z-index: -1;
        }

        @keyframes float { 0% { transform: translate(0, 0); } 100% { transform: translate(30px, 30px); } }

        /* NAVBAR (Dark Glass) */
        .navbar {
          display: flex; justify-content: space-between; align-items: center; 
          padding: 20px 40px; max-width: 1200px; margin: 0 auto;
          position: sticky; top: 0; 
          background: rgba(15, 23, 42, 0.8); /* Dark Glass */
          backdrop-filter: blur(12px); 
          z-index: 100; border-bottom: 1px solid var(--border);
        }
        .logo-img { height: 40px; width: auto; }

        .nav-btn {
          text-decoration: none; font-weight: 600; padding: 10px 20px; border-radius: 50px; transition: 0.2s;
          display: flex; align-items: center; gap: 8px; font-size: 14px;
        }
        .login-btn { color: var(--text-light); }
        .login-btn:hover { color: white; background: rgba(255,255,255,0.05); }
        .signup-btn { background: var(--primary); color: white; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
        .signup-btn:hover { background: var(--primary-dark); transform: translateY(-1px); }

        /* HERO SECTION */
        .hero {
          min-height: 85vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 0 20px; position: relative;
        }
        
        .badge {
          background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); color: #60a5fa;
          padding: 6px 16px; border-radius: 30px; font-size: 13px; font-weight: 600;
          margin-bottom: 25px; display: inline-flex; align-items: center; gap: 8px;
          animation: fadeIn 1s ease-out;
        }

        .hero-title {
          font-size: 4rem; font-weight: 800; letter-spacing: -2px; line-height: 1.1; margin: 0 0 25px 0;
          background: linear-gradient(135deg, #ffffff 30%, #94a3b8 100%);
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
          background: var(--primary); color: white; 
          box-shadow: 0 10px 30px -5px rgba(59, 130, 246, 0.4); 
        }
        .btn-primary:hover { transform: translateY(-3px); background: var(--primary-dark); box-shadow: 0 20px 40px -10px rgba(59, 130, 246, 0.5); }
        
        /* FEATURES (Dark Cards) */
        .features { 
          max-width: 1200px; margin: 0 auto; padding: 100px 20px; 
          display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; 
        }
        .feature-card { 
          background: var(--card-bg); /* Dark Navy Card */
          padding: 40px; border-radius: 24px; border: 1px solid var(--border); 
          transition: 0.3s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        .feature-card:hover { 
          transform: translateY(-8px); border-color: var(--primary); 
          box-shadow: 0 20px 40px -5px rgba(0,0,0,0.3); 
        }
        .icon-box { 
          width: 55px; height: 55px; background: rgba(255,255,255,0.05); border-radius: 14px; 
          display: flex; align-items: center; justify-content: center; font-size: 26px; 
          color: var(--primary); margin-bottom: 25px; 
        }
        .ft-title { font-size: 20px; font-weight: 700; margin: 0 0 10px 0; color: white; }
        .ft-desc { color: var(--text-light); line-height: 1.6; font-size: 15px; }

        /* FOOTER */
        .footer { 
          border-top: 1px solid var(--border); padding: 40px 20px; text-align: center; 
          color: var(--text-light); font-size: 14px; background: var(--bg); 
        }

        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @media(max-width: 768px) { .hero-title { font-size: 2.8rem; } .navbar { padding: 15px 20px; } }
      `}</style>

      {/* NAVBAR */}
      <div className="navbar">
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <img src={logo} alt="COTHM Logo" className="logo-img" /> 
          <span style={{fontWeight:800, fontSize:20, color:'white', letterSpacing:'-0.5px'}}>COTHM PORTAL</span>
        </div>
        <div style={{display:'flex', gap:10}}>
          <Link to="/login" className="nav-btn login-btn"><FaSignInAlt/> Login</Link>
          <Link to="/signup" className="nav-btn signup-btn"><FaUserPlus/> Join Now</Link>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <span className="badge">🚀 v2.0 Now Available</span>
        <h1 className="hero-title">Academic Research <br/> Made <span style={{color:'#60a5fa'}}>Effortless.</span></h1>
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
          <div className="icon-box" style={{color:'#60a5fa'}}><FaRocket/></div>
          <h3 className="ft-title">Smart Submissions</h3>
          <p className="ft-desc">Drag & drop your research papers. Our intelligent system organizes versions and statuses automatically.</p>
        </div>
        <div className="feature-card">
          <div className="icon-box" style={{color:'#a78bfa'}}><FaShieldAlt/></div>
          <h3 className="ft-title">Secure & Private</h3>
          <p className="ft-desc">Your intellectual property is protected with enterprise-grade encryption. Only you and your supervisor have access.</p>
        </div>
        <div className="feature-card">
          <div className="icon-box" style={{color:'#34d399'}}><FaChartLine/></div>
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
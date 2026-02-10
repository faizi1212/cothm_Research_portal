import React from "react";
import { Link } from "react-router-dom";
import { FaUniversity, FaRocket, FaShieldAlt, FaChartLine, FaArrowRight, FaCheck } from "react-icons/fa";

const Home = () => {
  return (
    <div className="landing-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        
        :root {
          --primary: #1e3c72;
          --accent: #3b82f6;
          --text: #0f172a;
          --bg: #ffffff;
          --card-bg: #f8fafc;
        }

        body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; }

        /* HERO SECTION */
        .hero {
          min-height: 90vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 20px;
          background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
        }

        .badge {
          background: rgba(59, 130, 246, 0.1);
          color: var(--accent);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
          display: inline-block;
          border: 1px solid rgba(59, 130, 246, 0.2);
          animation: fadeIn 1s ease-out;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          letter-spacing: -2px;
          line-height: 1.1;
          margin: 0 0 20px 0;
          background: linear-gradient(135deg, #0f172a 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: slideUp 0.8s ease-out;
        }

        .hero-sub {
          font-size: 1.25rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto 40px auto;
          line-height: 1.6;
          animation: slideUp 1s ease-out;
        }

        .cta-group {
          display: flex;
          gap: 15px;
          justify-content: center;
          animation: slideUp 1.2s ease-out;
        }

        .btn {
          padding: 15px 30px;
          border-radius: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary {
          background: var(--primary);
          color: white;
          box-shadow: 0 10px 25px -5px rgba(30, 60, 114, 0.4);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 20px 30px -10px rgba(30, 60, 114, 0.5); }

        .btn-secondary {
          background: white;
          color: var(--text);
          border: 1px solid #e2e8f0;
        }
        .btn-secondary:hover { background: #f8fafc; }

        /* FEATURES GRID (Bento Box) */
        .features {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .feature-card {
          background: var(--card-bg);
          padding: 40px;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          transition: 0.3s;
        }
        .feature-card:hover { transform: translateY(-5px); border-color: var(--accent); }

        .icon-box {
          width: 50px; height: 50px;
          background: white;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; color: var(--accent);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          margin-bottom: 20px;
        }

        .ft-title { font-size: 20px; font-weight: 700; margin: 0 0 10px 0; }
        .ft-desc { color: #64748b; line-height: 1.6; }

        /* FOOTER */
        .footer {
          border-top: 1px solid #e2e8f0;
          padding: 40px 20px;
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }

        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        @media(max-width: 768px) { .hero-title { font-size: 2.5rem; } }
      `}</style>

      {/* NAVBAR */}
      <nav style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 40px', maxWidth:'1200px', margin:'0 auto'}}>
        <div style={{display:'flex', alignItems:'center', gap:10, fontWeight:'800', fontSize:20, color:'#1e3c72'}}>
          <FaUniversity size={28}/> COTHM
        </div>
        <div style={{display:'flex', gap:15}}>
          <Link to="/login" style={{textDecoration:'none', color:'#64748b', fontWeight:'600'}}>Login</Link>
          <Link to="/signup" style={{textDecoration:'none', color:'#1e3c72', fontWeight:'600'}}>Register</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <span className="badge">New: AI Powered Research Tools ⚡️</span>
        <h1 className="hero-title">The Future of <br/> Academic Research</h1>
        <p className="hero-sub">
          A powerful, enterprise-grade portal for COTHM students and faculty. 
          Submit theses, track approvals, and collaborate in real-time.
        </p>
        <div className="cta-group">
          <Link to="/signup" className="btn btn-primary">Get Started <FaArrowRight/></Link>
          <Link to="/login" className="btn btn-secondary">Student Login</Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature-card">
          <div className="icon-box"><FaRocket/></div>
          <h3 className="ft-title">Fast Submissions</h3>
          <p className="ft-desc">Drag & drop your research papers. Our intelligent system processes submissions instantly with live status tracking.</p>
        </div>
        <div className="feature-card">
          <div className="icon-box"><FaShieldAlt/></div>
          <h3 className="ft-title">Secure & Private</h3>
          <p className="ft-desc">Your intellectual property is safe. We use enterprise-grade encryption to protect your data.</p>
        </div>
        <div className="feature-card">
          <div className="icon-box"><FaChartLine/></div>
          <h3 className="ft-title">Real-time Analytics</h3>
          <p className="ft-desc">Track your batch progress with beautiful charts and insights. Export reports with one click.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2025 COTHM International. All rights reserved.</p>
        <div style={{marginTop:10, display:'flex', gap:15, justifyContent:'center'}}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Support</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
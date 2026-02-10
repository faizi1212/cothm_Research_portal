import React from "react";
import { Link } from "react-router-dom";
import { 
  FaRocket, FaShieldAlt, FaChartLine, FaArrowRight, FaSignInAlt, FaUserPlus, 
  FaUniversity, FaLaptopCode, FaGlobe, FaQuoteLeft 
} from "react-icons/fa";
import logo from "./logo.png"; 

const Home = () => {
  return (
    <div className="landing-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800&display=swap');
        
        :root {
          --primary: #3b82f6;       
          --primary-dark: #2563eb;  
          --accent: #8b5cf6;        
          --bg: #0f172a;            /* Deep Navy */
          --card-bg: #1e293b;       /* Lighter Navy */
          --text: #f1f5f9;          
          --text-light: #94a3b8;    
          --border: #334155;        
        }

        body { 
          margin: 0; font-family: 'Inter', sans-serif; 
          color: var(--text); background-color: var(--bg); overflow-x: hidden;
        }

        /* --- BACKGROUND & ANIMATIONS --- */
        .landing-page {
          position: relative; width: 100%;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        /* Aurora Glow */
        .glow-bg {
          position: absolute; width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
          filter: blur(80px); top: -200px; left: -100px; z-index: -1;
          animation: float 10s infinite alternate;
        }

        @keyframes float { 0% { transform: translate(0, 0); } 100% { transform: translate(30px, 30px); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

        /* --- NAVBAR --- */
        .navbar {
          display: flex; justify-content: space-between; align-items: center; 
          padding: 20px 40px; max-width: 1200px; margin: 0 auto;
          position: sticky; top: 0; background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px); z-index: 100; border-bottom: 1px solid var(--border);
        }
        
        /* Stylish Logo Text */
        .logo-text {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 22px;
          letter-spacing: 1px;
          text-transform: uppercase;
          background: linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .logo-img { height: 40px; width: auto; }
        
        .nav-link { color: var(--text-light); text-decoration: none; font-weight: 500; font-size: 14px; transition: 0.2s; }
        .nav-link:hover { color: white; }
        
        .nav-btn {
          text-decoration: none; font-weight: 600; padding: 10px 24px; border-radius: 50px; 
          font-size: 14px; transition: 0.2s; display: flex; align-items: center; gap: 8px;
        }
        .login-btn { color: white; border: 1px solid var(--border); background: transparent; }
        .login-btn:hover { background: rgba(255,255,255,0.05); border-color: white; }
        .signup-btn { background: var(--primary); color: white; border: none; }
        .signup-btn:hover { background: var(--primary-dark); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }

        /* --- HERO --- */
        .hero {
          min-height: 85vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 60px 20px; position: relative;
        }
        .badge {
          background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); color: #60a5fa;
          padding: 6px 16px; border-radius: 30px; font-size: 13px; font-weight: 600;
          margin-bottom: 25px; animation: slideUp 0.6s ease-out;
        }
        .hero-title {
          font-size: 4rem; font-weight: 800; letter-spacing: -2px; line-height: 1.1; margin-bottom: 25px;
          background: linear-gradient(135deg, #ffffff 30%, #94a3b8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: slideUp 0.8s ease-out;
        }
        .hero-sub { 
          font-size: 1.25rem; color: var(--text-light); max-width: 650px; margin: 0 auto 40px auto; 
          line-height: 1.6; animation: slideUp 1s ease-out; 
        }
        .cta-group { display: flex; gap: 15px; justify-content: center; animation: slideUp 1.2s ease-out; }
        .hero-btn { 
          padding: 16px 36px; border-radius: 12px; font-weight: 700; text-decoration: none; 
          display: flex; align-items: center; gap: 10px; transition: 0.3s; font-size: 16px;
        }
        .btn-primary { background: var(--primary); color: white; }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 30px -5px rgba(59, 130, 246, 0.4); }
        .btn-outline { background: transparent; border: 1px solid var(--border); color: white; }
        .btn-outline:hover { background: rgba(255,255,255,0.05); border-color: white; }

        /* --- SECTIONS --- */
        .section { max-width: 1200px; margin: 0 auto; padding: 80px 20px; }
        .section-header { text-align: center; margin-bottom: 60px; }
        .section-title { font-size: 2.5rem; font-weight: 700; margin-bottom: 15px; color: white; }
        .section-desc { color: var(--text-light); max-width: 600px; margin: 0 auto; line-height: 1.6; }

        /* --- STATS GRID --- */
        .stats-grid { 
          display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; 
          background: var(--card-bg); padding: 40px; border-radius: 20px; border: 1px solid var(--border);
          text-align: center; margin-bottom: 80px;
        }
        .stat-num { font-size: 3rem; font-weight: 800; color: white; margin-bottom: 5px; }
        .stat-label { color: var(--text-light); font-weight: 500; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }

        /* --- FEATURES / PROGRAMS --- */
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; }
        .feature-card { 
          background: var(--card-bg); padding: 40px; border-radius: 24px; border: 1px solid var(--border); 
          transition: 0.3s; position: relative; overflow: hidden;
        }
        .feature-card:hover { transform: translateY(-8px); border-color: var(--primary); }
        .icon-box { 
          width: 55px; height: 55px; background: rgba(255,255,255,0.05); border-radius: 14px; 
          display: flex; align-items: center; justify-content: center; font-size: 26px; 
          color: var(--primary); margin-bottom: 25px; 
        }
        
        /* --- TESTIMONIALS --- */
        .test-card {
          background: transparent; border: 1px solid var(--border); padding: 30px; border-radius: 20px;
        }
        .quote-icon { color: var(--primary); font-size: 24px; margin-bottom: 15px; opacity: 0.5; }
        .test-text { font-style: italic; color: var(--text-light); line-height: 1.6; margin-bottom: 20px; }
        .user-info { display: flex; align-items: center; gap: 12px; }
        .user-avatar { width: 40px; height: 40px; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; }

        /* --- CTA BANNER --- */
        .cta-section {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          border-radius: 30px; padding: 60px; text-align: center; margin: 80px 20px;
          position: relative; overflow: hidden;
        }
        .cta-bg-icon { position: absolute; font-size: 300px; color: white; opacity: 0.05; right: -50px; bottom: -50px; }

        /* --- FOOTER --- */
        .footer { border-top: 1px solid var(--border); padding: 50px 20px; background: #020617; text-align: center; }
        .footer-links { display: flex; justify-content: center; gap: 30px; margin-bottom: 30px; flex-wrap: wrap; }
        .f-link { color: var(--text-light); text-decoration: none; transition: 0.2s; }
        .f-link:hover { color: white; }

        @media(max-width: 768px) { 
          .hero-title { font-size: 2.5rem; } 
          .navbar { padding: 15px 20px; flex-direction: column; gap: 15px; }
          .stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* --- BACKGROUND GLOW --- */ }
      <div className="glow-bg"></div>

      {/* --- NAVBAR --- */}
      <nav className="navbar">
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <img src={logo} alt="COTHM Logo" className="logo-img" /> 
          <span className="logo-text">COTHM RESEARCH PORTAL</span>
        </div>
        <div style={{display:'flex', gap:25}} className="desktop-only">
          <a href="#features" className="nav-link">Features</a>
          <a href="#programs" className="nav-link">Programs</a>
          <a href="#research" className="nav-link">Research</a>
        </div>
        <div style={{display:'flex', gap:12}}>
          <Link to="/login" className="nav-btn login-btn"><FaSignInAlt/> Login</Link>
          <Link to="/signup" className="nav-btn signup-btn"><FaUserPlus/> Apply Now</Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="hero">
        <span className="badge">🎓 Empowering Education Through Innovation</span>
        <h1 className="hero-title">The Future of <br/> Academic <span style={{color:'#60a5fa'}}>Excellence.</span></h1>
        <p className="hero-sub">
          COTHM's official research portal streamlines thesis submissions, 
          enhances faculty collaboration, and provides real-time academic tracking for students.
        </p>
        <div className="cta-group">
          <Link to="/signup" className="hero-btn btn-primary">Start Research <FaArrowRight/></Link>
          <a href="#features" className="hero-btn btn-outline">Explore Features</a>
        </div>
      </section>

      {/* --- STATS COUNTER --- */}
      <section className="section" id="research">
        <div className="stats-grid">
          <div><div className="stat-num">5,000+</div><div className="stat-label">Students Enrolled</div></div>
          <div><div className="stat-num">1,200+</div><div className="stat-label">Research Papers</div></div>
          <div><div className="stat-num">150+</div><div className="stat-label">Expert Faculty</div></div>
          <div><div className="stat-num">25+</div><div className="stat-label">Global Partners</div></div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section className="section" id="features">
        <div className="section-header">
          <h2 className="section-title">Why Choose COTHM?</h2>
          <p className="section-desc">We provide world-class tools to ensure your academic success is seamless and secure.</p>
        </div>
        <div className="grid-3">
          <div className="feature-card">
            <div className="icon-box" style={{color:'#60a5fa'}}><FaRocket/></div>
            <h3 style={{color:'white', marginBottom:10}}>Smart Submissions</h3>
            <p style={{color:'var(--text-light)', lineHeight:1.6}}>Drag & drop your research papers. Our intelligent system organizes versions automatically.</p>
          </div>
          <div className="feature-card">
            <div className="icon-box" style={{color:'#a78bfa'}}><FaShieldAlt/></div>
            <h3 style={{color:'white', marginBottom:10}}>Secure & Private</h3>
            <p style={{color:'var(--text-light)', lineHeight:1.6}}>Enterprise-grade encryption keeps your intellectual property safe and confidential.</p>
          </div>
          <div className="feature-card">
            <div className="icon-box" style={{color:'#34d399'}}><FaChartLine/></div>
            <h3 style={{color:'white', marginBottom:10}}>Live Tracking</h3>
            <p style={{color:'var(--text-light)', lineHeight:1.6}}>Get real-time notifications for approvals, feedback, and upcoming submission dates.</p>
          </div>
        </div>
      </section>

      {/* --- PROGRAMS --- */}
      <section className="section" id="programs">
        <div className="section-header">
          <h2 className="section-title">Our Programs</h2>
          <p className="section-desc">Diverse faculties fostering innovation and practical skills.</p>
        </div>
        <div className="grid-3">
          <div className="feature-card" style={{borderColor: 'var(--border)'}}>
            <FaLaptopCode size={40} style={{marginBottom:20, color:'#3b82f6'}}/>
            <h3 style={{color:'white'}}>Computer Science</h3>
            <p style={{color:'var(--text-light)'}}>AI, Data Science, and Software Engineering tracks available.</p>
          </div>
          <div className="feature-card" style={{borderColor: 'var(--border)'}}>
            <FaGlobe size={40} style={{marginBottom:20, color:'#f59e0b'}}/>
            <h3 style={{color:'white'}}>Hospitality Management</h3>
            <p style={{color:'var(--text-light)'}}>World-renowned training for the global tourism industry.</p>
          </div>
          <div className="feature-card" style={{borderColor: 'var(--border)'}}>
            <FaUniversity size={40} style={{marginBottom:20, color:'#10b981'}}/>
            <h3 style={{color:'white'}}>Business Administration</h3>
            <p style={{color:'var(--text-light)'}}>Leadership, Finance, and Marketing for future CEOs.</p>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Faculty Voices</h2>
        </div>
        <div className="grid-3">
          <div className="test-card">
            <FaQuoteLeft className="quote-icon"/>
            <p className="test-text">"This portal has revolutionized how we grade theses. The real-time feedback loop is a game changer for students."</p>
            <div className="user-info">
              <div className="user-avatar">DR</div>
              <div><strong style={{display:'block'}}>Dr. Ahmed Khan</strong><span style={{fontSize:12, color:'var(--text-light)'}}>Dean of CS</span></div>
            </div>
          </div>
          <div className="test-card">
            <FaQuoteLeft className="quote-icon"/>
            <p className="test-text">"Secure, fast, and reliable. It allows us to focus on research quality rather than administrative paperwork."</p>
            <div className="user-info">
              <div className="user-avatar">MS</div>
              <div><strong style={{display:'block'}}>Ms. Sarah Ali</strong><span style={{fontSize:12, color:'var(--text-light)'}}>Senior Lecturer</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <div className="cta-section">
        <FaUniversity className="cta-bg-icon"/>
        <h2 style={{fontSize:'2.5rem', marginBottom:20, position:'relative'}}>Ready to Begin?</h2>
        <p style={{marginBottom:30, opacity:0.9, position:'relative'}}>Join thousands of students achieving academic excellence with COTHM.</p>
        <Link to="/signup" style={{background:'white', color:'#2563eb', padding:'15px 40px', borderRadius:50, textDecoration:'none', fontWeight:'bold', fontSize:18, position:'relative'}}>Apply Now</Link>
      </div>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:10, marginBottom:30}}>
          <img src={logo} alt="Logo" style={{height:30}}/>
          <span style={{fontWeight:800, fontSize:18, color:'white'}}>COTHM</span>
        </div>
        <div className="footer-links">
          <a href="#" className="f-link">About Us</a>
          <a href="#" className="f-link">Admissions</a>
          <a href="#" className="f-link">Research</a>
          <a href="#" className="f-link">Contact</a>
          <a href="#" className="f-link">Privacy Policy</a>
        </div>
        <p style={{color:'var(--text-light)', fontSize:12}}>© 2026 COTHM International. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
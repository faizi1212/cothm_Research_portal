import React from "react";
import { Link } from "react-router-dom";
import { 
  FaRocket, FaShieldAlt, FaChartLine, FaArrowRight, FaSignInAlt, FaUserPlus, 
  FaUniversity, FaUtensils, FaGlobe, FaQuoteLeft, 
  FaAward, FaVideo, FaCertificate, FaHotel, FaConciergeBell, FaWineGlassAlt, FaCookieBite
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
          --card-bg: rgba(30, 41, 59, 0.7); /* Translucent Navy */
          --text: #f1f5f9;          
          --text-light: #94a3b8;    
          --border: rgba(51, 65, 85, 0.5);        
        }

        body { 
          margin: 0; font-family: 'Inter', sans-serif; 
          color: var(--text); background-color: var(--bg); overflow-x: hidden;
        }

        /* --- BACKGROUND & ANIMATIONS --- */
        .landing-page {
          position: relative; width: 100%;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .glow-bg {
          position: absolute; width: 800px; height: 800px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          filter: blur(100px); top: -300px; left: -200px; z-index: -1;
          animation: float 15s infinite alternate;
        }

        @keyframes float { 0% { transform: translate(0, 0); } 100% { transform: translate(50px, 50px); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

        /* --- NAVBAR --- */
        .navbar {
          display: flex; justify-content: space-between; align-items: center; 
          padding: 20px 40px; max-width: 1300px; margin: 0 auto;
          position: sticky; top: 0; background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(15px); z-index: 100; border-bottom: 1px solid var(--border);
        }
        
        .logo-text {
          font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 24px; letter-spacing: 1.5px;
          text-transform: uppercase; background: linear-gradient(90deg, #ffffff 0%, #3b82f6 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .logo-img { height: 45px; width: auto; transition: transform 0.3s; }
        .logo-img:hover { transform: rotate(-5deg) scale(1.1); }
        
        .nav-link { color: var(--text-light); text-decoration: none; font-weight: 500; font-size: 14px; transition: 0.3s; }
        .nav-link:hover { color: white; text-shadow: 0 0 10px rgba(255,255,255,0.5); }
        
        .nav-btn {
          text-decoration: none; font-weight: 600; padding: 12px 28px; border-radius: 50px; 
          font-size: 14px; transition: 0.4s; display: flex; align-items: center; gap: 8px;
        }
        .login-btn { color: white; border: 1px solid var(--border); background: rgba(255,255,255,0.03); }
        .login-btn:hover { background: rgba(255,255,255,0.1); border-color: white; transform: translateY(-2px); }
        .signup-btn { background: var(--primary); color: white; border: none; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); }
        .signup-btn:hover { background: var(--primary-dark); transform: translateY(-3px); box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5); }

        /* --- HERO --- */
        .hero {
          min-height: 90vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 60px 20px; position: relative;
        }
        .badge {
          background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); color: #60a5fa;
          padding: 8px 20px; border-radius: 50px; font-size: 13px; font-weight: 600; text-transform: uppercase;
          margin-bottom: 30px; animation: slideUp 0.6s ease-out; letter-spacing: 1px;
        }
        .hero-title {
          font-size: 4.5rem; font-weight: 800; letter-spacing: -3px; line-height: 1; margin-bottom: 25px;
          background: linear-gradient(135deg, #ffffff 40%, #94a3b8 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: slideUp 0.8s ease-out;
        }
        .hero-sub { 
          font-size: 1.3rem; color: var(--text-light); max-width: 700px; margin: 0 auto 45px auto; 
          line-height: 1.7; animation: slideUp 1s ease-out; font-weight: 400;
        }
        .cta-group { display: flex; gap: 20px; justify-content: center; animation: slideUp 1.2s ease-out; }
        .hero-btn { 
          padding: 18px 40px; border-radius: 16px; font-weight: 700; text-decoration: none; 
          display: flex; align-items: center; gap: 12px; transition: 0.4s; font-size: 17px;
        }
        .btn-primary { background: var(--primary); color: white; box-shadow: 0 10px 30px -10px var(--primary); }
        .btn-primary:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 20px 40px -10px var(--primary); }
        .btn-outline { background: rgba(255,255,255,0.03); border: 1px solid var(--border); color: white; }
        .btn-outline:hover { background: rgba(255,255,255,0.1); border-color: white; transform: translateY(-3px); }

        /* --- SECTIONS --- */
        .section { max-width: 1200px; margin: 0 auto; padding: 100px 20px; }
        .section-header { text-align: center; margin-bottom: 70px; }
        .section-title { font-size: 2.8rem; font-weight: 800; margin-bottom: 20px; color: white; letter-spacing: -1px; }
        .section-desc { color: var(--text-light); max-width: 650px; margin: 0 auto; line-height: 1.8; font-size: 1.1rem; }

        /* CARDS / PROGRAMS GRID */
        .grid-programs { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); 
            gap: 25px; 
        }
        .program-card { 
          background: var(--card-bg); 
          padding: 45px 35px; 
          border-radius: 30px; 
          border: 1px solid var(--border); 
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          position: relative; 
          overflow: hidden;
          backdrop-filter: blur(10px);
        }
        .program-card:hover { 
          transform: translateY(-15px); 
          border-color: var(--primary); 
          background: rgba(30, 41, 59, 0.9);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .program-card::after {
          content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent);
          pointer-events: none;
        }
        .icon-circle { 
          width: 70px; height: 70px; background: rgba(59, 130, 246, 0.1); border-radius: 20px; 
          display: flex; align-items: center; justify-content: center; font-size: 30px; 
          color: var(--primary); margin-bottom: 30px; transition: 0.4s;
        }
        .program-card:hover .icon-circle {
          background: var(--primary); color: white; transform: rotateY(360deg);
        }
        .pg-name { font-size: 22px; font-weight: 800; margin: 0 0 12px 0; color: white; font-family: 'Outfit', sans-serif; }
        .pg-desc { color: var(--text-light); line-height: 1.6; font-size: 14px; }

        /* PARTNERS */
        .partners-section { text-align: center; padding: 80px 20px; background: rgba(2, 6, 23, 0.5); }
        .partners-grid { display: flex; justify-content: center; align-items: center; gap: 80px; flex-wrap: wrap; }
        .partner-logo { 
          display: flex; align-items: center; gap: 15px; 
          font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 30px; 
          color: #475569; transition: 0.4s; grayscale: 100%;
        }
        .partner-logo:hover { color: white; grayscale: 0%; transform: scale(1.1); }

        /* FOOTER */
        .footer { border-top: 1px solid var(--border); padding: 70px 20px; background: #020617; text-align: center; }
        
        @media(max-width: 768px) { 
          .hero-title { font-size: 2.8rem; } 
          .navbar { padding: 15px 20px; }
          .partners-grid { gap: 40px; }
        }
      `}</style>

      <div className="glow-bg"></div>

      {/* --- NAVBAR --- */}
      <nav className="navbar">
        <div style={{display:'flex', alignItems:'center', gap:15}}>
          <img src={logo} alt="COTHM Logo" className="logo-img" /> 
          <span className="logo-text">COTHM RESEARCH PORTAL</span>
        </div>
        <div style={{display:'flex', gap:30}} className="desktop-only">
          <a href="#programs" className="nav-link">Our Courses</a>
          <a href="#features" className="nav-link">Portal Features</a>
          <a href="#research" className="nav-link">Statistics</a>
        </div>
        <div style={{display:'flex', gap:15}}>
          <Link to="/login" className="nav-btn login-btn"><FaSignInAlt/> Login</Link>
          <Link to="/signup" className="nav-btn signup-btn"><FaUserPlus/> Join Now</Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="hero">
        <span className="badge">✨ Excellence in Hospitality & Culinary Arts</span>
        <h1 className="hero-title">Research Beyond <br/> the <span style={{color:'#60a5fa'}}>Horizon.</span></h1>
        <p className="hero-sub">
          The specialized research management platform for COTHM's leading programs. 
          Manage your culinary insights and hospitality theses with precision.
        </p>
        <div className="cta-group">
          <Link to="/signup" className="hero-btn btn-primary">Get Started <FaArrowRight/></Link>
          <a href="#programs" className="hero-btn btn-outline">Explore Programs</a>
        </div>
      </section>

      {/* --- PROGRAMS SECTION (CORRECTED) --- */}
      <section className="section" id="programs">
        <div className="section-header">
          <h2 className="section-title">Academic Programs</h2>
          <p className="section-desc">Pioneering excellence across our core specialized certifications and diplomas.</p>
        </div>
        <div className="grid-programs">
          <div className="program-card">
            <div className="icon-circle"><FaAward/></div>
            <h3 className="pg-name">GDICA</h3>
            <p className="pg-desc">Graduate Diploma in International Culinary Arts. Master the world-class culinary techniques.</p>
          </div>
          <div className="program-card">
            <div className="icon-circle"><FaUtensils/></div>
            <h3 className="pg-name">DCA</h3>
            <p className="pg-desc">Diploma in Culinary Arts. The foundation for professional chefs and culinary experts.</p>
          </div>
          <div className="program-card">
            <div className="icon-circle"><FaHotel/></div>
            <h3 className="pg-name">DIHO</h3>
            <p className="pg-desc">Diploma in International Hotel Operations. Excellence in global hospitality standards.</p>
          </div>
          <div className="program-card">
            <div className="icon-circle"><FaConciergeBell/></div>
            <h3 className="pg-name">DHTML</h3>
            <p className="pg-desc">Diploma in Hospitality and Tourism Management Management. Leading the future of travel.</p>
          </div>
        </div>
      </section>

      {/* --- STATS --- */}
      <section className="section" id="research" style={{paddingTop: 0}}>
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', 
          background: 'linear-gradient(rgba(30, 41, 59, 0.4), rgba(15, 23, 42, 0.4))', padding: '60px', 
          borderRadius: '40px', border: '1px solid var(--border)', textAlign: 'center'
        }}>
          <div><div style={{fontSize: '3.5rem', fontWeight: 800}}>8,000+</div><div style={{color:'var(--text-light)', fontWeight:600, fontSize:14, textTransform:'uppercase'}}>Alumni</div></div>
          <div><div style={{fontSize: '3.5rem', fontWeight: 800}}>1,500+</div><div style={{color:'var(--text-light)', fontWeight:600, fontSize:14, textTransform:'uppercase'}}>Active Researchers</div></div>
          <div><div style={{fontSize: '3.5rem', fontWeight: 800}}>98%</div><div style={{color:'var(--text-light)', fontWeight:600, fontSize:14, textTransform:'uppercase'}}>Success Rate</div></div>
          <div><div style={{fontSize: '3.5rem', fontWeight: 800}}>35+</div><div style={{color:'var(--text-light)', fontWeight:600, fontSize:14, textTransform:'uppercase'}}>Global Affiliations</div></div>
        </div>
      </section>

      {/* --- PARTNERS --- */}
      <section className="partners-section">
        <div style={{color:'var(--text-light)', fontSize:12, fontWeight:800, textTransform:'uppercase', letterSpacing:3, marginBottom:50}}>Recognized By Global Leaders</div>
        <div className="partners-grid">
          <div className="partner-logo"><FaVideo color="#f59e0b"/> typsy</div>
          <div className="partner-logo"><FaAward color="#06b6d4"/> QUALIFI</div>
          <div className="partner-logo"><FaUtensils color="#ef4444"/> MasterChef</div>
          <div className="partner-logo"><FaCertificate color="#8b5cf6"/> CTH UK</div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="footer">
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:10, marginBottom:40}}>
          <img src={logo} alt="Logo" style={{height:35}}/>
          <span style={{fontWeight:800, fontSize:22, color:'white', fontFamily:'Outfit'}}>COTHM</span>
        </div>
        <div style={{display:'flex', justifyContent:'center', gap:40, marginBottom:40, flexWrap:'wrap'}}>
          <a href="#" className="f-link">Campus Life</a>
          <a href="#" className="f-link">Research Ethics</a>
          <a href="#" className="f-link">Student Support</a>
          <a href="#" className="f-link">Privacy Policy</a>
        </div>
        <p style={{color:'var(--text-light)', fontSize:13}}>© 2026 COTHM International. Empowering hospitality leaders globally.</p>
      </footer>
    </div>
  );
};

export default Home;
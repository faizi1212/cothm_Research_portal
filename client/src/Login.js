import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from './logo.png'; // Import your logo

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      const userRole = res.data.user.role;
      
      if (userRole === "supervisor" || userRole === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
      
    } catch (err) {
      let errorMsg = "Invalid credentials. Please try again.";
      
      if (err.response) {
        errorMsg = err.response.data.message || err.response.data.error || errorMsg;
      } else if (err.request) {
        errorMsg = "Cannot connect to server. Please check your connection.";
      }
      
      setError(errorMsg);
      
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div style={styles.container}>
      {/* Animated Background Pattern */}
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.contentWrapper}>
        {/* Left Side - Branding */}
        <div style={styles.leftPanel}>
          <div style={styles.brandingContent}>
            {/* COTHM Logo */}
            <img src={logo} alt="COTHM Logo" style={styles.logo} />
            
            <h1 style={styles.welcomeTitle}>
              Welcome to
            </h1>
            <h2 style={styles.portalName}>
              COTHM Research Portal
            </h2>
            
            <p style={styles.tagline}>
              Empowering academic excellence through innovation
            </p>

            <div style={styles.decorativeLine}></div>

            <div style={styles.featureGrid}>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>📚</div>
                <div style={styles.featureText}>Secure Submission</div>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>⚡</div>
                <div style={styles.featureText}>Instant Feedback</div>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>📊</div>
                <div style={styles.featureText}>Track Progress</div>
              </div>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon}>🎓</div>
                <div style={styles.featureText}>Expert Guidance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div style={styles.rightPanel}>
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h3 style={styles.formTitle}>Sign In</h3>
              <p style={styles.formSubtitle}>Access your research dashboard</p>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <span style={styles.errorIcon}>⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div style={styles.inputWrapper}>
                <label style={styles.label}>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="your.email@cothm.edu.pk"
                  onChange={handleChange} 
                  value={formData.email}
                  required 
                  disabled={loading}
                  style={styles.input}
                />
              </div>

              <div style={styles.inputWrapper}>
                <label style={styles.label}>Password</label>
                <div style={styles.passwordContainer}>
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password" 
                    placeholder="Enter your password"
                    onChange={handleChange} 
                    value={formData.password}
                    required 
                    disabled={loading}
                    style={{...styles.input, paddingRight: '50px'}}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              <div style={styles.formOptions}>
                <label style={styles.rememberLabel}>
                  <input type="checkbox" style={styles.checkbox} />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" style={styles.forgotLink}>
                  Forgot Password?
                </Link>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={loading ? {...styles.submitBtn, ...styles.submitBtnDisabled} : styles.submitBtn}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}></span>
                    Signing In...
                  </>
                ) : (
                  "Sign In →"
                )}
              </button>
            </form>

            <div style={styles.signupSection}>
              <p style={styles.signupText}>
                Don't have an account? 
                <Link to="/signup" style={styles.signupLink}> Create Account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: `
      repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.03) 35px, rgba(255,255,255,.03) 70px),
      repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,255,255,.03) 35px, rgba(255,255,255,.03) 70px)
    `,
    animation: 'drift 20s linear infinite',
  },
  contentWrapper: {
    display: 'flex',
    maxWidth: '1200px',
    width: '100%',
    background: 'white',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 25px 80px rgba(0,0,0,0.25)',
    position: 'relative',
    zIndex: 1,
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    padding: '60px 50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  brandingContent: {
    textAlign: 'center',
    color: 'white',
  },
  logo: {
    width: '160px',
    height: 'auto',
    marginBottom: '30px',
    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
  },
  welcomeTitle: {
    fontSize: '20px',
    fontWeight: '300',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: '10px',
    opacity: 0.9,
  },
  portalName: {
    fontSize: '36px',
    fontWeight: '800',
    marginBottom: '20px',
    lineHeight: 1.2,
  },
  tagline: {
    fontSize: '16px',
    opacity: 0.8,
    fontStyle: 'italic',
    marginBottom: '40px',
  },
  decorativeLine: {
    width: '80px',
    height: '4px',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    margin: '0 auto 40px',
    borderRadius: '2px',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginTop: '30px',
  },
  featureCard: {
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  featureIcon: {
    fontSize: '32px',
    marginBottom: '10px',
  },
  featureText: {
    fontSize: '14px',
    fontWeight: '600',
  },
  rightPanel: {
    flex: 1,
    padding: '60px 50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formCard: {
    width: '100%',
    maxWidth: '420px',
  },
  formHeader: {
    marginBottom: '40px',
  },
  formTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: '8px',
  },
  formSubtitle: {
    fontSize: '15px',
    color: '#666',
  },
  errorBox: {
    background: '#fee',
    color: '#c53030',
    padding: '14px 18px',
    borderRadius: '10px',
    marginBottom: '24px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid #fcc',
  },
  errorIcon: {
    fontSize: '16px',
  },
  inputWrapper: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#999',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
  },
  formOptions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  rememberLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#555',
    cursor: 'pointer',
  },
  checkbox: {
    cursor: 'pointer',
  },
  forgotLink: {
    fontSize: '14px',
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
  },
  submitBtn: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '700',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  },
  submitBtnDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  spinner: {
    display: 'inline-block',
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginRight: '10px',
  },
  signupSection: {
    marginTop: '32px',
    textAlign: 'center',
  },
  signupText: {
    fontSize: '15px',
    color: '#666',
  },
  signupLink: {
    color: '#667eea',
    fontWeight: '700',
    textDecoration: 'none',
  },
};

// Add animations
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  @keyframes drift {
    0% { transform: translateX(0) translateY(0); }
    100% { transform: translateX(50px) translateY(50px); }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  input:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  }

  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5) !important;
  }
`;
document.head.appendChild(styleTag);

export default Login;
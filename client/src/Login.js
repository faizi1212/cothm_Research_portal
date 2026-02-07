import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
      {/* Animated Background */}
      <div style={styles.bgAnimation}>
        <div style={styles.circle1}></div>
        <div style={styles.circle2}></div>
        <div style={styles.circle3}></div>
      </div>

      {/* Left Side - Branding */}
      <div style={styles.leftPanel}>
        <div style={styles.brandingContent}>
          {/* COTHM Logo */}
          <div style={styles.logoContainer}>
            <div style={styles.logoShield}>
              <div style={styles.logoText}>COTHM</div>
            </div>
          </div>
          
          <h1 style={styles.brandTitle}>
            Research Portal
          </h1>
          
          <p style={styles.brandSubtitle}>
            College of Tourism & Hotel Management
          </p>

          <div style={styles.featureList}>
            <div style={styles.featureItem}>
              <span style={styles.checkmark}>✓</span>
              <span>Secure Thesis Submission</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.checkmark}>✓</span>
              <span>Real-time Supervisor Feedback</span>
            </div>
            <div style={styles.featureItem}>
              <span style={styles.checkmark}>✓</span>
              <span>Track Your Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Welcome Back</h2>
            <p style={styles.formSubtitle}>Sign in to access your research portal</p>
          </div>

          {error && (
            <div style={styles.errorAlert}>
              <span style={styles.errorIcon}>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
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

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="Enter your password"
                onChange={handleChange} 
                value={formData.password}
                required 
                disabled={loading}
                style={styles.input}
              />
            </div>

            <div style={styles.formOptions}>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" style={styles.checkbox} />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" style={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                ...styles.submitButton,
                ...(loading ? styles.submitButtonDisabled : {})
              }}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In →
                </>
              )}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerText}>or</span>
          </div>

          <div style={styles.signupPrompt}>
            <span style={styles.signupText}>Don't have an account? </span>
            <Link to="/signup" style={styles.signupLink}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  bgAnimation: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 0,
  },
  circle1: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    opacity: 0.1,
    top: '-200px',
    left: '-200px',
    animation: 'float 20s ease-in-out infinite',
  },
  circle2: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    opacity: 0.1,
    bottom: '-100px',
    right: '-100px',
    animation: 'float 15s ease-in-out infinite reverse',
  },
  circle3: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    opacity: 0.1,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'float 25s ease-in-out infinite',
  },
  leftPanel: {
    flex: 1,
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    position: 'relative',
    zIndex: 1,
  },
  brandingContent: {
    maxWidth: '500px',
    color: 'white',
    textAlign: 'center',
  },
  logoContainer: {
    marginBottom: '40px',
  },
  logoShield: {
    width: '120px',
    height: '140px',
    background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
    margin: '0 auto',
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '900',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '1px',
  },
  brandTitle: {
    fontSize: '48px',
    fontWeight: '800',
    marginBottom: '16px',
    letterSpacing: '-1px',
  },
  brandSubtitle: {
    fontSize: '18px',
    opacity: 0.9,
    marginBottom: '50px',
    fontWeight: '300',
  },
  featureList: {
    textAlign: 'left',
    display: 'inline-block',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
    fontSize: '16px',
  },
  checkmark: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
    fontWeight: 'bold',
  },
  rightPanel: {
    flex: 1,
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    position: 'relative',
    zIndex: 1,
  },
  formContainer: {
    width: '100%',
    maxWidth: '440px',
  },
  formHeader: {
    marginBottom: '40px',
  },
  formTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '8px',
  },
  formSubtitle: {
    fontSize: '16px',
    color: '#718096',
  },
  errorAlert: {
    background: '#fee',
    border: '1px solid #fcc',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    color: '#c53030',
    fontSize: '14px',
  },
  errorIcon: {
    marginRight: '12px',
    fontSize: '18px',
  },
  form: {
    marginBottom: '24px',
  },
  inputGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  formOptions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#4a5568',
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '8px',
    cursor: 'pointer',
  },
  forgotLink: {
    fontSize: '14px',
    color: '#2a5298',
    textDecoration: 'none',
    fontWeight: '600',
  },
  submitButton: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '700',
    color: 'white',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(30, 60, 114, 0.3)',
  },
  submitButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginRight: '8px',
  },
  divider: {
    textAlign: 'center',
    margin: '32px 0',
    position: 'relative',
  },
  dividerText: {
    background: 'white',
    padding: '0 16px',
    color: '#a0aec0',
    fontSize: '14px',
    position: 'relative',
    zIndex: 1,
  },
  signupPrompt: {
    textAlign: 'center',
  },
  signupText: {
    color: '#718096',
    fontSize: '15px',
  },
  signupLink: {
    color: '#2a5298',
    fontWeight: '700',
    textDecoration: 'none',
    fontSize: '15px',
  },
};

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes float {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    33% { transform: translate(30px, -30px) rotate(120deg); }
    66% { transform: translate(-20px, 20px) rotate(240deg); }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  input:focus {
    border-color: #2a5298 !important;
    box-shadow: 0 0 0 3px rgba(42, 82, 152, 0.1) !important;
  }

  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(30, 60, 114, 0.4) !important;
  }

  a:hover {
    opacity: 0.8;
  }
`;
document.head.appendChild(styleSheet);

export default Login;
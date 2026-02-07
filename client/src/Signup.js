import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from './logo.png';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  
  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        course: "N/A",
        batchNumber: "N/A"
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      let errorMsg = "Registration failed. Please try again.";
      
      if (err.response) {
        errorMsg = err.response.data.message || err.response.data.error || errorMsg;
      }
      
      setError(errorMsg);
      
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.contentWrapper}>
        <div style={styles.leftPanel}>
          <div style={styles.brandingContent}>
            <img src={logo} alt="COTHM Logo" style={styles.logo} />
            
            <h1 style={styles.welcomeTitle}>Join Our</h1>
            <h2 style={styles.portalName}>Academic Community</h2>
            
            <p style={styles.tagline}>
              Start your research journey with Pakistan's premier hospitality institution
            </p>

            <div style={styles.decorativeLine}></div>

            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>500+</div>
                <div style={styles.statLabel}>Students</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>50+</div>
                <div style={styles.statLabel}>Supervisors</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNumber}>95%</div>
                <div style={styles.statLabel}>Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.rightPanel}>
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h3 style={styles.formTitle}>Create Account</h3>
              <p style={styles.formSubtitle}>Join the research portal today</p>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <span style={styles.errorIcon}>⚠️</span>
                {error}
              </div>
            )}

            {success && (
              <div style={styles.successBox}>
                <span style={styles.successIcon}>✓</span>
                Account created! Redirecting to login...
              </div>
            )}

            <form onSubmit={handleSignup}>
              <div style={styles.nameRow}>
                <div style={styles.inputWrapperHalf}>
                  <label style={styles.label}>First Name</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    placeholder="John"
                    onChange={handleChange} 
                    value={formData.firstName}
                    required 
                    disabled={loading}
                    style={styles.input}
                  />
                </div>

                <div style={styles.inputWrapperHalf}>
                  <label style={styles.label}>Last Name</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    placeholder="Doe"
                    onChange={handleChange} 
                    value={formData.lastName}
                    required 
                    disabled={loading}
                    style={styles.input}
                  />
                </div>
              </div>

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
                    placeholder="At least 6 characters"
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

              <div style={styles.inputWrapper}>
                <label style={styles.label}>Confirm Password</label>
                <div style={styles.passwordContainer}>
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword" 
                    placeholder="Re-enter password"
                    onChange={handleChange} 
                    value={formData.confirmPassword}
                    required 
                    disabled={loading}
                    style={{...styles.input, paddingRight: '50px'}}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading || success}
                style={(loading || success) ? {...styles.submitBtn, ...styles.submitBtnDisabled} : styles.submitBtn}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}></span>
                    Creating Account...
                  </>
                ) : success ? (
                  "Account Created ✓"
                ) : (
                  "Create Account →"
                )}
              </button>
            </form>

            <div style={styles.loginSection}>
              <p style={styles.loginText}>
                Already have an account? 
                <Link to="/login" style={styles.loginLink}> Sign In</Link>
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
    lineHeight: 1.5,
  },
  decorativeLine: {
    width: '80px',
    height: '4px',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    margin: '0 auto 40px',
    borderRadius: '2px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px',
  },
  statBox: {
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    padding: '20px 10px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '12px',
    opacity: 0.8,
  },
  rightPanel: {
    flex: 1,
    padding: '50px 50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto',
  },
  formCard: {
    width: '100%',
    maxWidth: '420px',
  },
  formHeader: {
    marginBottom: '30px',
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
  successBox: {
    background: '#def7ec',
    color: '#03543f',
    padding: '14px 18px',
    borderRadius: '10px',
    marginBottom: '24px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid #84e1bc',
  },
  successIcon: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  inputWrapper: {
    marginBottom: '20px',
  },
  nameRow: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
  },
  inputWrapperHalf: {
    flex: 1,
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
    padding: '12px 16px',
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
    marginTop: '10px',
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
  loginSection: {
    marginTop: '28px',
    textAlign: 'center',
  },
  loginText: {
    fontSize: '15px',
    color: '#666',
  },
  loginLink: {
    color: '#667eea',
    fontWeight: '700',
    textDecoration: 'none',
  },
};

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

export default Signup;
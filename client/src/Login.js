import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaGraduationCap } from "react-icons/fa";
import logo from "./logo.png"; // ✅ Imports logo from src/logo.png

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ Claude AI Fix: Correct Endpoint
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // ✅ Claude AI Fix: Role-based redirect
      if (res.data.user.role === "admin" || res.data.user.role === "supervisor") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Login Failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Side - Image/Brand */}
      <div style={styles.leftPanel}>
        <div style={styles.overlay}>
          <div style={styles.brandContent}>
            <div style={styles.iconCircle}>
              <FaGraduationCap size={40} color="white" />
            </div>
            <h1 style={styles.brandTitle}>COTHM International</h1>
            <p style={styles.brandText}>
              Excellence in Hospitality & Management Education. 
              <br />Secure Research Submission Portal.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={styles.rightPanel}>
        <div style={styles.formContainer}>
          <div style={styles.logoHeader}>
            <img src={logo} alt="COTHM Logo" style={styles.logoImage} />
            <h2 style={styles.welcomeText}>Welcome Back!</h2>
            <p style={styles.subText}>Please access your dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <FaEnvelope style={styles.inputIcon} />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <FaLock style={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.loginBtn}>
              {loading ? "Authenticating..." : <>Sign In <FaArrowRight /></>}
            </button>
          </form>

          <div style={styles.footer}>
            New Student? <Link to="/signup" style={styles.link}>Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", minHeight: "100vh", fontFamily: "'Poppins', sans-serif", background: "#f8f9fc" },
  leftPanel: { flex: 1, position: "relative", backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070')", backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "center", justifyContent: "center" },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg, rgba(30, 60, 114, 0.9) 0%, rgba(42, 82, 152, 0.8) 100%)", display: "flex", alignItems: "center", justifyContent: "center" },
  brandContent: { color: "white", textAlign: "center", padding: "40px" },
  iconCircle: { width: "80px", height: "80px", background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", backdropFilter: "blur(10px)" },
  brandTitle: { fontSize: "32px", fontWeight: "700", marginBottom: "15px", letterSpacing: "1px" },
  brandText: { fontSize: "16px", opacity: 0.9, lineHeight: "1.6" },
  rightPanel: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", background: "white" },
  formContainer: { width: "100%", maxWidth: "420px" },
  logoHeader: { textAlign: "center", marginBottom: "40px" },
  logoImage: { height: "80px", marginBottom: "20px" }, // Adjust height as needed
  welcomeText: { fontSize: "28px", fontWeight: "700", color: "#333", marginBottom: "8px" },
  subText: { color: "#666", fontSize: "15px" },
  inputGroup: { marginBottom: "25px" },
  label: { display: "block", marginBottom: "10px", color: "#444", fontWeight: "600", fontSize: "14px" },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: "15px", color: "#1e3c72" },
  input: { width: "100%", padding: "15px 45px", borderRadius: "10px", border: "1px solid #e1e5ee", fontSize: "15px", outline: "none", transition: "all 0.3s", background: "#f8f9fc" },
  eyeIcon: { position: "absolute", right: "15px", cursor: "pointer", color: "#999" },
  loginBtn: { width: "100%", padding: "16px", background: "linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 10px 20px rgba(30, 60, 114, 0.2)", transition: "transform 0.2s" },
  footer: { marginTop: "30px", textAlign: "center", fontSize: "14px", color: "#666" },
  link: { color: "#1e3c72", fontWeight: "700", textDecoration: "none" }
};

export default Login;
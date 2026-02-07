import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaArrowLeft, FaUniversity, FaCopy } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [tempPassword, setTempPassword] = useState(null);
  const navigate = useNavigate();

  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    setTempPassword(null);

    try {
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      
      // Check if we got a temporary password (email failed scenario)
      if (response.data.temporaryPassword) {
        setTempPassword(response.data.temporaryPassword);
        setMessage("✅ Password reset successful! Use the password below to login.");
      } else {
        // Email was sent successfully
        setMessage(response.data.message || "✅ Password reset email sent! Check your inbox.");
      }
    } catch (err) {
      setError("❌ " + (err.response?.data?.error || err.response?.data?.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    alert("✅ Password copied to clipboard!");
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <FaUniversity size={40} color="#1e3c72" />
          <h2 style={styles.title}>Forgot Password?</h2>
          <p style={styles.subtitle}>Enter your email to reset your password</p>
        </div>

        {!tempPassword ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputWrapper}>
              <FaEnvelope style={styles.icon} />
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} style={styles.btn}>
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </form>
        ) : (
          <div style={styles.passwordBox}>
            <h3 style={styles.passwordTitle}>Your Temporary Password</h3>
            <div style={styles.passwordDisplay}>
              <code style={styles.password}>{tempPassword}</code>
              <button onClick={copyPassword} style={styles.copyBtn} title="Copy password">
                <FaCopy size={18} />
              </button>
            </div>
            <div style={styles.warningBox}>
              <strong>⚠️ Important:</strong> Copy this password now! You won't see it again.
            </div>
            <button onClick={goToLogin} style={styles.loginBtn}>
              Go to Login →
            </button>
          </div>
        )}

        {message && !tempPassword && <div style={styles.successMsg}>{message}</div>}
        {error && <div style={styles.errorMsg}>{error}</div>}

        <div style={styles.footer}>
          <Link to="/login" style={styles.link}>
            <FaArrowLeft /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { 
    minHeight: "100vh", 
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: "20px", 
    fontFamily: "'Poppins', sans-serif" 
  },
  card: { 
    background: "white", 
    padding: "40px", 
    borderRadius: "20px", 
    boxShadow: "0 25px 50px rgba(0,0,0,0.25)", 
    width: "100%", 
    maxWidth: "450px", 
    textAlign: "center" 
  },
  header: { marginBottom: "30px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#333", margin: "15px 0 5px" },
  subtitle: { color: "#666", fontSize: "14px" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  icon: { position: "absolute", left: "15px", color: "#1e3c72" },
  input: { 
    width: "100%", 
    padding: "14px 14px 14px 45px", 
    borderRadius: "10px", 
    border: "2px solid #eee", 
    fontSize: "15px", 
    outline: "none", 
    transition: "border 0.3s" 
  },
  btn: { 
    width: "100%", 
    padding: "14px", 
    background: "#1e3c72", 
    color: "white", 
    border: "none", 
    borderRadius: "10px", 
    fontSize: "16px", 
    fontWeight: "700", 
    cursor: "pointer", 
    transition: "0.2s" 
  },
  passwordBox: {
    background: "#f8f9fa",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "20px"
  },
  passwordTitle: {
    fontSize: "16px",
    color: "#333",
    marginBottom: "15px"
  },
  passwordDisplay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    background: "white",
    padding: "15px",
    borderRadius: "8px",
    border: "2px dashed #1e3c72",
    marginBottom: "15px"
  },
  password: {
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "3px",
    color: "#1e3c72",
    fontFamily: "monospace"
  },
  copyBtn: {
    background: "#1e3c72",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  warningBox: {
    background: "#fff3cd",
    border: "1px solid #ffc107",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "13px",
    color: "#856404",
    marginBottom: "15px"
  },
  loginBtn: {
    width: "100%",
    padding: "12px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer"
  },
  footer: { marginTop: "20px", fontSize: "14px" },
  link: { 
    color: "#1e3c72", 
    fontWeight: "600", 
    textDecoration: "none", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    gap: "8px" 
  },
  successMsg: { 
    marginTop: "15px", 
    padding: "10px", 
    background: "#dcfce7", 
    color: "#166534", 
    borderRadius: "8px", 
    fontSize: "14px" 
  },
  errorMsg: { 
    marginTop: "15px", 
    padding: "10px", 
    background: "#fee2e2", 
    color: "#991b1b", 
    borderRadius: "8px", 
    fontSize: "14px" 
  }
};

export default ForgotPassword;
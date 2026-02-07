import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaArrowLeft, FaUniversity } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setMessage("✅ Reset link sent! Check your email inbox.");
    } catch (err) {
      setError("❌ " + (err.response?.data?.message || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <FaUniversity size={40} color="#1e3c72" />
          <h2 style={styles.title}>Forgot Password?</h2>
          <p style={styles.subtitle}>Enter your email to receive a reset link</p>
        </div>

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
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && <div style={styles.successMsg}>{message}</div>}
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
  container: { minHeight: "100vh", background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Poppins', sans-serif" },
  card: { background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 25px 50px rgba(0,0,0,0.25)", width: "100%", maxWidth: "450px", textAlign: "center" },
  header: { marginBottom: "30px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#333", margin: "15px 0 5px" },
  subtitle: { color: "#666", fontSize: "14px" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  icon: { position: "absolute", left: "15px", color: "#1e3c72" },
  input: { width: "100%", padding: "14px 14px 14px 45px", borderRadius: "10px", border: "2px solid #eee", fontSize: "15px", outline: "none", transition: "border 0.3s" },
  btn: { width: "100%", padding: "14px", background: "#1e3c72", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "pointer", transition: "0.2s" },
  footer: { marginTop: "20px", fontSize: "14px" },
  link: { color: "#1e3c72", fontWeight: "600", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  successMsg: { marginTop: "15px", padding: "10px", background: "#dcfce7", color: "#166534", borderRadius: "8px", fontSize: "14px" },
  errorMsg: { marginTop: "15px", padding: "10px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", fontSize: "14px" }
};

export default ForgotPassword;
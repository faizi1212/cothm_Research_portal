import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaLock, FaUniversity } from "react-icons/fa";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match");

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/reset-password/${token}`, { password });
      alert("✅ Password Reset Successful! Please Login.");
      navigate("/login");
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Invalid or Expired Token"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <FaUniversity size={40} color="#1e3c72" />
        <h2 style={styles.title}>Reset Password</h2>
        <p style={styles.subtitle}>Enter your new secure password</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputWrapper}>
            <FaLock style={styles.icon} />
            <input type="password" placeholder="New Password" onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
          </div>
          <div style={styles.inputWrapper}>
            <FaLock style={styles.icon} />
            <input type="password" placeholder="Confirm New Password" onChange={(e) => setConfirmPassword(e.target.value)} required style={styles.input} />
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Resetting..." : "Set New Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Poppins', sans-serif" },
  card: { background: "white", padding: "40px", borderRadius: "20px", width: "100%", maxWidth: "450px", textAlign: "center" },
  title: { fontSize: "24px", fontWeight: "700", color: "#333", margin: "15px 0 5px" },
  subtitle: { color: "#666", fontSize: "14px", marginBottom: "30px" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputWrapper: { position: "relative" },
  icon: { position: "absolute", left: "15px", top: "14px", color: "#1e3c72" },
  input: { width: "100%", padding: "14px 14px 14px 45px", borderRadius: "10px", border: "2px solid #eee", fontSize: "15px", boxSizing: "border-box" },
  btn: { width: "100%", padding: "14px", background: "#1e3c72", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "700", cursor: "pointer" }
};

export default ResetPassword;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import logo from "./logo.png"; 

const Signup = () => {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = "https://cothm-research-portal.onrender.com";

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/register`, { ...formData, role: "student" });
      alert("✅ Registration Successful! Please Login.");
      navigate("/login");
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Signup Failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <img src={logo} alt="COTHM" style={styles.logo} />
          <h2 style={styles.title}>Student Registration</h2>
          <p style={styles.subtitle}>Create your research portal account</p>
        </div>

        <form onSubmit={handleSignup}>
          <div style={styles.row}>
            <div style={styles.inputWrapper}>
              <FaUser style={styles.icon} />
              <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required style={styles.input} />
            </div>
            <div style={styles.inputWrapper}>
              <FaUser style={styles.icon} />
              <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required style={styles.input} />
            </div>
          </div>

          <div style={styles.inputWrapper}>
            <FaEnvelope style={styles.icon} />
            <input type="email" name="email" placeholder="Student Email" onChange={handleChange} required style={styles.input} />
          </div>

          <div style={styles.inputWrapper}>
            <FaLock style={styles.icon} />
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Create Password" onChange={handleChange} required style={styles.input} />
            <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Creating Account..." : <>Create Account <FaArrowRight /></>}
          </button>
        </form>

        <p style={styles.footer}>
          Already registered? <Link to="/login" style={styles.link}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", background: "linear-gradient(135deg, #eef2f3 0%, #8e9eab 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif" },
  card: { background: "white", padding: "40px", borderRadius: "20px", boxShadow: "0 20px 40px rgba(0,0,0,0.1)", width: "100%", maxWidth: "480px" },
  header: { textAlign: "center", marginBottom: "30px" },
  logo: { height: "60px", marginBottom: "15px" },
  title: { fontSize: "24px", fontWeight: "700", color: "#333", margin: "0" },
  subtitle: { color: "#777", fontSize: "14px", marginTop: "5px" },
  row: { display: "flex", gap: "15px", marginBottom: "15px" },
  inputWrapper: { position: "relative", marginBottom: "15px", flex: 1 },
  icon: { position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#1e3c72" },
  input: { width: "100%", padding: "14px 14px 14px 45px", borderRadius: "10px", border: "1px solid #eee", background: "#f9f9f9", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  eyeBtn: { position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#888" },
  btn: { width: "100%", padding: "15px", background: "#1e3c72", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" },
  footer: { textAlign: "center", marginTop: "20px", fontSize: "14px", color: "#666" },
  link: { color: "#1e3c72", fontWeight: "700", textDecoration: "none" }
};

export default Signup;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaLayerGroup, FaUniversity } from "react-icons/fa";
import logo from "./logo.png"; // Ensure logo.png is in src folder

const Signup = () => {
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", batchNumber: "" });
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
          <div style={styles.logoCircle}>
             <FaUniversity size={30} color="white" />
          </div>
          <h2 style={styles.title}>Student Registration</h2>
          <p style={styles.subtitle}>Join the COTHM Research Portal</p>
        </div>

        <form onSubmit={handleSignup} style={styles.form}>
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
            <input type="email" name="email" placeholder="Student Email Address" onChange={handleChange} required style={styles.input} />
          </div>

          {/* ADDED BATCH NUMBER FIELD */}
          <div style={styles.inputWrapper}>
            <FaLayerGroup style={styles.icon} />
            <input type="text" name="batchNumber" placeholder="Batch Number (e.g. Batch-22)" onChange={handleChange} required style={styles.input} />
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
  container: { minHeight: "100vh", background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Poppins', sans-serif", padding: "20px" },
  card: { background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)", padding: "40px", borderRadius: "24px", boxShadow: "0 25px 50px rgba(0,0,0,0.2)", width: "100%", maxWidth: "500px" },
  header: { textAlign: "center", marginBottom: "30px" },
  logoCircle: { width: "60px", height: "60px", background: "#1e3c72", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 15px", boxShadow: "0 10px 20px rgba(30, 60, 114, 0.3)" },
  title: { fontSize: "26px", fontWeight: "700", color: "#333", margin: "0" },
  subtitle: { color: "#666", fontSize: "14px", marginTop: "5px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  row: { display: "flex", gap: "15px" },
  inputWrapper: { position: "relative", flex: 1 },
  icon: { position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#1e3c72" },
  input: { width: "100%", padding: "14px 14px 14px 45px", borderRadius: "12px", border: "2px solid #e1e5ee", background: "#f8f9fc", fontSize: "14px", outline: "none", transition: "all 0.3s", boxSizing: "border-box" },
  eyeBtn: { position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "#888" },
  btn: { width: "100%", padding: "16px", background: "linear-gradient(90deg, #1e3c72, #2a5298)", color: "white", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "600", cursor: "pointer", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 10px 20px rgba(30, 60, 114, 0.2)" },
  footer: { textAlign: "center", marginTop: "25px", fontSize: "14px", color: "#666" },
  link: { color: "#1e3c72", fontWeight: "700", textDecoration: "none" }
};

export default Signup;
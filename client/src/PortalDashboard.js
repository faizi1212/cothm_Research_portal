import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFileUpload, FaCheckCircle, FaExclamationCircle, FaClock, FaCommentDots, FaFilePdf, FaSignOutAlt, FaUserGraduate, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png"; 

const PortalDashboard = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStage, setUploadStage] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  const API_URL = "https://cothm-research-portal.onrender.com";
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => { fetchMyProject(); }, []);

  const fetchMyProject = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects/my-projects?email=${user.email}`);
      if (res.data && res.data.length > 0) setProject(res.data[0]);
    } catch (err) { console.error("Error", err); }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !uploadStage) return alert("Please select file and stage");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("studentEmail", user.email);
      formData.append("studentName", `${user.firstName} ${user.lastName}`);
      formData.append("stage", uploadStage);
      
      await axios.post(`${API_URL}/api/submit`, formData);
      alert("✅ Submitted successfully!");
      setFile(null); setUploadStage(""); fetchMyProject();
    } catch (err) { alert("❌ Failed: " + err.message); } 
    finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.removeItem("user"); navigate("/login"); };

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <div style={{...styles.sidebar, width: isSidebarOpen ? '260px' : '0px', padding: isSidebarOpen ? '20px' : '0'}}>
        <div style={styles.sidebarHeader}>
          <img src={logo} alt="COTHM" style={styles.sidebarLogo} />
          {isSidebarOpen && <h3 style={styles.sidebarTitle}>COTHM</h3>}
        </div>
        
        {isSidebarOpen && (
          <div style={styles.navLinks}>
            <div style={styles.navItemActive}><FaUserGraduate /> Dashboard</div>
            <div style={styles.navItem} onClick={handleLogout}><FaSignOutAlt /> Logout</div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Top Navbar */}
        <div style={styles.navbar}>
          <FaBars onClick={() => setSidebarOpen(!isSidebarOpen)} style={styles.menuIcon} />
          <div style={styles.userProfile}>
            <span style={styles.userBadge}>Student</span>
            <span style={styles.userName}>{user.firstName} {user.lastName}</span>
          </div>
        </div>

        <div style={styles.content}>
          <h2 style={styles.pageTitle}>My Research Dashboard</h2>

          {/* Status Section */}
          <div style={styles.grid}>
            {/* Project Status Card */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Current Status</h3>
              {project ? (
                <div style={{...styles.statusBox, background: project.status === 'Approved' ? '#dcfce7' : project.status === 'Rejected' ? '#fee2e2' : '#fef3c7', color: project.status === 'Approved' ? '#166534' : project.status === 'Rejected' ? '#991b1b' : '#92400e'}}>
                  {project.status === 'Approved' ? <FaCheckCircle size={24} /> : project.status === 'Rejected' ? <FaExclamationCircle size={24} /> : <FaClock size={24} />}
                  <span style={styles.statusText}>{project.status}</span>
                </div>
              ) : (
                <p>No project started.</p>
              )}
              
              {/* Supervisor Feedback */}
              {project?.feedback && (
                <div style={styles.feedbackCard}>
                  <div style={styles.feedbackHeader}><FaCommentDots /> Supervisor Feedback</div>
                  <p style={styles.feedbackText}>"{project.feedback}"</p>
                </div>
              )}
            </div>

            {/* Upload Card */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Submit Work</h3>
              <form onSubmit={handleSubmit}>
                <select value={uploadStage} onChange={(e) => setUploadStage(e.target.value)} style={styles.select} required>
                  <option value="">Select Submission Stage</option>
                  <option value="Proposal">Topic Proposal</option>
                  <option value="Chapter 1">Chapter 1</option>
                  <option value="Final Thesis">Final Thesis</option>
                </select>
                <div style={styles.uploadBox}>
                  <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" id="file" style={{display:'none'}} />
                  <label htmlFor="file" style={styles.uploadLabel}>
                    <FaFileUpload size={30} color="#1e3c72" />
                    <span>{file ? file.name : "Click to Upload Document"}</span>
                  </label>
                </div>
                <button type="submit" disabled={loading} style={styles.submitBtn}>
                  {loading ? "Uploading..." : "Submit for Review"}
                </button>
              </form>
            </div>
          </div>

          {/* History */}
          {project?.submissions?.length > 0 && (
            <div style={{...styles.card, marginTop: '20px'}}>
              <h3 style={styles.cardTitle}>Submission History</h3>
              {project.submissions.map((sub, i) => (
                <div key={i} style={styles.historyRow}>
                  <div style={styles.historyLeft}>
                    <FaFilePdf color="#e11d48" size={20} />
                    <div>
                      <div style={styles.historyStage}>{sub.stage}</div>
                      <div style={styles.historyDate}>{new Date(sub.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <a href={sub.fileUrl} target="_blank" rel="noreferrer" style={styles.viewBtn}>View File</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: '#f3f4f6', fontFamily: "'Inter', sans-serif" },
  sidebar: { background: '#1e3c72', color: 'white', transition: 'width 0.3s', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  sidebarLogo: { height: '40px' },
  sidebarTitle: { margin: 0, fontWeight: '700' },
  navLinks: { display: 'flex', flexDirection: 'column', gap: '10px' },
  navItem: { padding: '12px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1', transition: '0.2s' },
  navItemActive: { padding: '12px 15px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600' },
  main: { flex: 1, display: 'flex', flexDirection: 'column' },
  navbar: { background: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' },
  menuIcon: { cursor: 'pointer', color: '#64748b' },
  userProfile: { display: 'flex', alignItems: 'center', gap: '15px' },
  userBadge: { background: '#e0f2fe', color: '#0284c7', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  userName: { fontWeight: '600', color: '#333' },
  content: { padding: '30px', maxWidth: '1200px', margin: '0 auto', width: '100%' },
  pageTitle: { fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '30px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' },
  card: { background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' },
  cardTitle: { fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#334155' },
  statusBox: { padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' },
  statusText: { fontSize: '18px', fontWeight: '700' },
  feedbackCard: { background: '#f8fafc', borderLeft: '4px solid #1e3c72', padding: '15px', borderRadius: '8px' },
  feedbackHeader: { display: 'flex', alignItems: 'center', gap: '8px', color: '#1e3c72', fontWeight: '700', marginBottom: '8px', fontSize: '14px' },
  feedbackText: { color: '#475569', margin: 0, lineHeight: '1.5', fontStyle: 'italic' },
  select: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '15px', fontSize: '14px' },
  uploadBox: { border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '30px', textAlign: 'center', cursor: 'pointer', transition: '0.2s', marginBottom: '20px' },
  uploadLabel: { cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#64748b' },
  submitBtn: { width: '100%', padding: '14px', background: '#1e3c72', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
  historyRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f1f5f9' },
  historyLeft: { display: 'flex', alignItems: 'center', gap: '15px' },
  historyStage: { fontWeight: '600', color: '#334155' },
  historyDate: { fontSize: '12px', color: '#94a3b8' },
  viewBtn: { color: '#1e3c72', textDecoration: 'none', fontWeight: '600', fontSize: '14px', border: '1px solid #1e3c72', padding: '6px 12px', borderRadius: '6px' }
};

export default PortalDashboard;
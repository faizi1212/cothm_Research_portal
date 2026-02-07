import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserGraduate, FaCheckCircle, FaTimesCircle, FaClock, FaFilePdf, FaPaperPlane, FaSearch, FaFilter, FaSignOutAlt, FaSync } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // LOGIC: State for updates
  const [processingId, setProcessingId] = useState(null);
  const [feedbackInputs, setFeedbackInputs] = useState({});

  const navigate = useNavigate();
  const API_URL = "https://cothm-research-portal.onrender.com";

  useEffect(() => { fetchProjects(); }, []);

  // LOGIC: Fetch Data
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/projects/all`);
      setProjects(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  // LOGIC: Update Status & Feedback
  const handleUpdate = async (project, status) => {
    const feedback = feedbackInputs[project._id] || "";
    if (status === "Rejected" && !feedback) return alert("Please provide a reason for rejection.");
    
    setProcessingId(project._id);
    try {
      await axios.post(`${API_URL}/api/admin/update`, {
        email: project.studentEmail,
        status: status,
        comment: feedback
      });
      alert(`Project ${status} Successfully!`);
      fetchProjects();
      setFeedbackInputs({ ...feedbackInputs, [project._id]: "" });
    } catch (err) { alert("Update failed"); }
    finally { setProcessingId(null); }
  };

  const handleLogout = () => { localStorage.removeItem("user"); navigate("/login"); };

  // LOGIC: Filtering
  const filteredProjects = projects.filter(p => 
    (filterStatus === "All" || p.status === filterStatus) &&
    (p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || p.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status) => {
    if (status === 'Approved') return { bg: '#dcfce7', text: '#166534', icon: <FaCheckCircle /> };
    if (status === 'Rejected') return { bg: '#fee2e2', text: '#991b1b', icon: <FaTimesCircle /> };
    return { bg: '#fef3c7', text: '#92400e', icon: <FaClock /> };
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* Top Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          <div style={styles.logoIcon}><FaUserGraduate color="white" size={24} /></div>
          <div>
            <h2 style={styles.navTitle}>Supervisor Dashboard</h2>
            <span style={styles.navSubtitle}>COTHM International</span>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <FaSignOutAlt /> Logout
        </button>
      </nav>

      <div style={styles.mainContent}>
        {/* Stats & Filters Bar */}
        <div style={styles.actionBar}>
          <div style={styles.searchWrapper}>
            <FaSearch style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search student..." 
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div style={styles.filterWrapper}>
            <FaFilter style={styles.filterIcon} />
            <select style={styles.filterSelect} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Pending Review">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <button onClick={fetchProjects} style={styles.refreshBtn}>
            <FaSync className={loading ? "spin" : ""} /> Refresh
          </button>
        </div>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <h3>{projects.length}</h3>
            <p>Total Submissions</p>
          </div>
          <div style={{...styles.statCard, borderTop: '4px solid #f59e0b'}}>
            <h3>{projects.filter(p => p.status === 'Pending Review').length}</h3>
            <p>Pending Review</p>
          </div>
          <div style={{...styles.statCard, borderTop: '4px solid #10b981'}}>
            <h3>{projects.filter(p => p.status === 'Approved').length}</h3>
            <p>Approved</p>
          </div>
        </div>

        {/* GRID LAYOUT (Replaces Table) */}
        <div style={styles.gridContainer}>
          {filteredProjects.map((project) => {
            const statusStyle = getStatusColor(project.status);
            const latestSub = project.submissions?.[project.submissions.length - 1];

            return (
              <div key={project._id} style={styles.projectCard}>
                {/* Header of Card */}
                <div style={styles.cardHeader}>
                  <div style={styles.userInfo}>
                    <div style={styles.avatar}>{project.studentName.charAt(0)}</div>
                    <div>
                      <h4 style={styles.studentName}>{project.studentName}</h4>
                      <p style={styles.studentEmail}>{project.studentEmail}</p>
                      <p style={styles.batchInfo}>{project.batchNumber || "No Batch"}</p>
                    </div>
                  </div>
                  <div style={{...styles.statusBadge, background: statusStyle.bg, color: statusStyle.text}}>
                    {statusStyle.icon} {project.status}
                  </div>
                </div>

                {/* Body of Card */}
                <div style={styles.cardBody}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Latest Submission:</span>
                    <span style={styles.infoValue}>{latestSub?.stage || "N/A"}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Date:</span>
                    <span style={styles.infoValue}>{latestSub ? new Date(latestSub.date).toLocaleDateString() : "N/A"}</span>
                  </div>
                  
                  {/* File Download Button */}
                  {latestSub && (
                    <a href={latestSub.fileUrl} target="_blank" rel="noreferrer" style={styles.fileBtn}>
                      <FaFilePdf /> View Document
                    </a>
                  )}

                  {/* Feedback Section */}
                  <div style={styles.actionSection}>
                    <textarea
                      placeholder="Enter supervisor comments here..."
                      style={styles.feedbackInput}
                      value={feedbackInputs[project._id] !== undefined ? feedbackInputs[project._id] : (project.feedback || "")}
                      onChange={(e) => setFeedbackInputs({ ...feedbackInputs, [project._id]: e.target.value })}
                    />
                    
                    <div style={styles.btnGroup}>
                      <button 
                        onClick={() => handleUpdate(project, "Approved")}
                        disabled={processingId === project._id}
                        style={styles.approveBtn}
                      >
                        <FaCheckCircle /> Approve
                      </button>
                      <button 
                        onClick={() => handleUpdate(project, "Rejected")}
                        disabled={processingId === project._id}
                        style={styles.rejectBtn}
                      >
                        <FaTimesCircle /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  dashboardContainer: { minHeight: "100vh", background: "#f1f5f9", fontFamily: "'Inter', sans-serif" },
  navbar: { background: "#1e3c72", padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", color: "white" },
  navBrand: { display: "flex", alignItems: "center", gap: "15px" },
  logoIcon: { width: "40px", height: "40px", background: "rgba(255,255,255,0.2)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" },
  navTitle: { margin: 0, fontSize: "20px", fontWeight: "700" },
  navSubtitle: { margin: 0, fontSize: "12px", opacity: 0.8 },
  logoutBtn: { background: "rgba(255,255,255,0.15)", border: "none", color: "white", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", transition: "all 0.2s" },
  
  mainContent: { maxWidth: "1200px", margin: "0 auto", padding: "30px 20px" },
  
  // Stats
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" },
  statCard: { background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", textAlign: "center", borderTop: "4px solid #1e3c72" },
  
  // Actions
  actionBar: { display: "flex", gap: "15px", marginBottom: "30px", flexWrap: "wrap" },
  searchWrapper: { flex: 1, position: "relative", minWidth: "250px" },
  searchIcon: { position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#64748b" },
  searchInput: { width: "100%", padding: "12px 12px 12px 40px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", fontSize: "14px" },
  filterWrapper: { position: "relative" },
  filterSelect: { padding: "12px 35px 12px 15px", borderRadius: "8px", border: "1px solid #e2e8f0", outline: "none", background: "white", cursor: "pointer" },
  refreshBtn: { background: "white", border: "1px solid #e2e8f0", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", color: "#475569", fontWeight: "600" },

  // Grid
  gridContainer: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "25px" },
  
  // Card
  projectCard: { background: "white", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", overflow: "hidden", transition: "transform 0.2s" },
  cardHeader: { padding: "20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  userInfo: { display: "flex", gap: "12px", alignItems: "center" },
  avatar: { width: "40px", height: "40px", background: "#e0f2fe", color: "#0369a1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "18px" },
  studentName: { margin: 0, fontSize: "16px", fontWeight: "700", color: "#1e293b" },
  studentEmail: { margin: 0, fontSize: "12px", color: "#64748b" },
  batchInfo: { fontSize: "11px", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", color: "#475569", marginTop: "4px", display: "inline-block" },
  statusBadge: { padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" },
  
  cardBody: { padding: "20px" },
  infoRow: { display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px" },
  infoLabel: { color: "#64748b" },
  infoValue: { fontWeight: "600", color: "#334155" },
  
  fileBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "10px", marginTop: "15px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", textDecoration: "none", color: "#1e293b", fontWeight: "600", fontSize: "13px", transition: "background 0.2s" },
  
  actionSection: { marginTop: "20px", borderTop: "1px solid #f1f5f9", paddingTop: "15px" },
  feedbackInput: { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px", minHeight: "60px", marginBottom: "15px", resize: "vertical", fontFamily: "inherit" },
  btnGroup: { display: "flex", gap: "10px" },
  approveBtn: { flex: 1, padding: "10px", background: "#16a34a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: "600", fontSize: "13px" },
  rejectBtn: { flex: 1, padding: "10px", background: "#dc2626", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontWeight: "600", fontSize: "13px" }
};

export default AdminDashboard;
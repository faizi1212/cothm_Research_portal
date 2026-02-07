import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaUserGraduate, FaCheckCircle, FaTimesCircle, FaClock, 
  FaFilePdf, FaSearch, FaSignOutAlt, FaSync, FaTimes, 
  FaExternalLinkAlt, FaChevronRight, FaBullhorn, FaCalendarAlt, 
  FaFolderOpen, FaTrash, FaUpload, FaChartPie, FaFileDownload
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// 
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// --- TOAST NOTIFICATION COMPONENT ---
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      {type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
      <span>{message}</span>
    </div>
  );
};

const AdminDashboard = () => {
  // --- STATE ---
  const [projects, setProjects] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [resources, setResources] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All"); 
  
  // Modal & Processing State
  const [selectedProject, setSelectedProject] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // System Tab Inputs
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", message: "" });
  const [newDeadline, setNewDeadline] = useState("");
  const [newResource, setNewResource] = useState({ title: "", category: "Guidelines", file: null });

  const navigate = useNavigate();
  const API_URL = "https://cothm-research-portal.onrender.com";

  useEffect(() => { fetchData(); }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, aRes, rRes, sRes] = await Promise.all([
        axios.get(`${API_URL}/api/projects/all`),
        axios.get(`${API_URL}/api/announcements`),
        axios.get(`${API_URL}/api/resources`),
        axios.get(`${API_URL}/api/settings`)
      ]);

      setProjects(pRes.data);
      setAnnouncements(aRes.data);
      setResources(rRes.data);
      if(sRes.data.deadline) setNewDeadline(sRes.data.deadline.split('T')[0]);

    } catch (err) { 
      showToast("Failed to load data", "error");
    } finally { 
      setLoading(false); 
    }
  };

  // --- ANALYTICS HELPERS ---
  const getStatusData = () => {
    const approved = projects.filter(p => p.status === 'Approved').length;
    const rejected = projects.filter(p => p.status === 'Rejected').length;
    const pending = projects.filter(p => p.status === 'Pending Review').length;
    return [
      { name: 'Approved', value: approved, color: '#10b981' },
      { name: 'Pending', value: pending, color: '#f59e0b' },
      { name: 'Rejected', value: rejected, color: '#ef4444' },
    ];
  };

  const getBatchData = () => {
    const batches = {};
    projects.forEach(p => {
      const batch = p.batchNumber || "Unknown";
      batches[batch] = (batches[batch] || 0) + 1;
    });
    return Object.keys(batches).map(key => ({ name: `Batch ${key}`, students: batches[key] }));
  };

  const exportToCSV = () => {
    const headers = "Student Name,Email,Batch,Status,Last Submission Date\n";
    const rows = projects.map(p => {
      const lastSub = p.submissions.length > 0 ? new Date(p.submissions[p.submissions.length-1].date).toLocaleDateString() : "N/A";
      return `${p.studentName},${p.studentEmail},${p.batchNumber},${p.status},${lastSub}`;
    }).join("\n");
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cothm_students_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  // --- ACTIONS ---
  const handleUpdate = async (status) => {
    if (status === "Rejected" && !feedback.trim()) {
      showToast("Please provide a reason for rejection", "error");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/admin/update`, {
        email: selectedProject.studentEmail, status, comment: feedback
      });
      showToast(`Project ${status} Successfully!`, "success");
      fetchData(); handleCloseReview(); 
    } catch (err) { showToast("Update failed. Server Error.", "error"); } 
    finally { setIsSubmitting(false); }
  };

  const postAnnouncement = async () => {
    if(!newAnnouncement.title) return showToast("Title required", "error");
    try {
      await axios.post(`${API_URL}/api/announcements`, newAnnouncement);
      setNewAnnouncement({ title: "", message: "" });
      showToast("Announcement Posted");
      fetchData();
    } catch (err) { showToast("Failed to post", "error"); }
  };

  const setDeadline = async () => {
    try {
      await axios.post(`${API_URL}/api/settings`, { deadline: newDeadline });
      showToast("Deadline Updated");
    } catch (err) { showToast("Failed to set deadline", "error"); }
  };

  const uploadResource = async () => {
    if(!newResource.file) return showToast("File required", "error");
    try {
      const fd = new FormData();
      fd.append("title", newResource.title); fd.append("category", newResource.category); fd.append("file", newResource.file);
      await axios.post(`${API_URL}/api/resources`, fd);
      setNewResource({ title: "", category: "Guidelines", file: null });
      showToast("Resource Uploaded");
      fetchData();
    } catch (err) { showToast("Upload failed", "error"); }
  };

  const handleDelete = async (type, id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/api/${type}/${id}`);
      showToast("Deleted successfully");
      fetchData();
    } catch (err) { showToast("Delete failed", "error"); }
  };

  const handleLogout = () => { localStorage.removeItem("user"); navigate("/login"); };
  const handleOpenReview = (p) => { setSelectedProject(p); setFeedback(p.feedback || ""); };
  const handleCloseReview = () => { setSelectedProject(null); setFeedback(""); };

  // --- FILTERING ---
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = ["Analytics", "System"].includes(activeTab) ? true : 
                       activeTab === "All" ? true : p.status === (activeTab === "Pending" ? "Pending Review" : activeTab);
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (s) => s === 'Approved' ? 'status-approved' : s === 'Rejected' ? 'status-rejected' : 'status-pending';
  
  const counts = {
    All: projects.length,
    Pending: projects.filter(p => p.status === 'Pending Review').length,
    Approved: projects.filter(p => p.status === 'Approved').length,
    Rejected: projects.filter(p => p.status === 'Rejected').length,
    Analytics: <FaChartPie/>,
    System: "⚙️"
  };

  return (
    <div className="dashboard-container">
      <style>{`
        :root { --primary: #1e3c72; --primary-light: #2a5298; --success: #10b981; --danger: #ef4444; --warning: #f59e0b; --bg: #f8fafc; --surface: #ffffff; --text: #1e293b; --text-light: #64748b; }
        body { margin: 0; font-family: 'Inter', system-ui, sans-serif; background: var(--bg); }
        .navbar { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%); color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; }
        .nav-logo { background: rgba(255,255,255,0.2); padding: 8px; border-radius: 12px; display: flex; backdrop-filter: blur(5px); }
        .logout-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .logout-btn:hover { background: rgba(255,255,255,0.25); transform: translateY(-1px); }
        .main-content { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .action-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .search-box { position: relative; width: 300px; }
        .search-input { width: 100%; padding: 12px 12px 12px 45px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
        .search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: var(--text-light); }
        .tabs { display: flex; background: white; padding: 5px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); gap: 5px; }
        .tab { padding: 8px 16px; border-radius: 8px; border: none; background: transparent; color: var(--text-light); cursor: pointer; font-weight: 600; font-size: 13px; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
        .tab.active { background: var(--primary); color: white; shadow: 0 2px 8px rgba(30, 60, 114, 0.3); }
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; }
        .card { background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; padding: 20px; position: relative; overflow: hidden; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 20px -5px rgba(0,0,0,0.1); border-color: #cbd5e1; }
        .status-pill { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; height: fit-content; }
        .status-approved { background: #dcfce7; color: #166534; } .status-rejected { background: #fee2e2; color: #991b1b; } .status-pending { background: #fef3c7; color: #92400e; }
        .review-btn { width: 100%; margin-top: 15px; padding: 12px; background: white; border: 1px solid var(--primary); color: var(--primary); border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s; }
        .review-btn:hover { background: var(--primary); color: white; }
        .system-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 25px; }
        .system-card { background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .sys-input { width: 100%; padding: 12px; margin-bottom: 12px; border: 1px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; }
        .sys-btn { background: var(--primary); color: white; padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; width: 100%; }
        .chart-container { height: 300px; width: 100%; margin-top: 20px; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal { background: white; width: 90%; max-width: 600px; border-radius: 20px; padding: 30px; box-shadow: 0 25px 50px rgba(0,0,0,0.25); }
        .btn-action { flex: 1; padding: 14px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-approve { background: var(--success); color: white; } .btn-reject { background: var(--danger); color: white; }
        .doc-link { color: var(--primary); text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; }
        .toast { position: fixed; bottom: 30px; right: 30px; background: white; padding: 15px 25px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 12px; z-index: 2000; border-left: 5px solid var(--success); }
        .toast.error { border-left-color: var(--danger); }
        @media (max-width: 768px) { .action-header { flex-direction: column; align-items: stretch; } .tabs { overflow-x: auto; } .system-grid { grid-template-columns: 1fr; } }
      `}</style>

      <nav className="navbar">
        <div className="nav-brand">
          <div className="nav-logo"><FaUserGraduate color="white" size={24} /></div>
          <div><h2 style={{margin:0, fontSize:18}}>Supervisor Portal</h2><span style={{fontSize:12, opacity:0.8}}>COTHM International</span></div>
        </div>
        <button onClick={handleLogout} className="logout-btn"><FaSignOutAlt /> Logout</button>
      </nav>

      <div className="main-content">
        <div className="action-header">
          {activeTab !== "System" && activeTab !== "Analytics" && (
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input type="text" className="search-input" placeholder="Search students..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          )}

          <div className="tabs">
            {Object.keys(counts).map(tab => (
              <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab === "Pending" ? "Pending Review" : tab} {typeof counts[tab] === 'number' ? `(${counts[tab]})` : counts[tab]}
              </button>
            ))}
          </div>

          <button onClick={fetchData} className="logout-btn" style={{background: '#3b82f6', border: 'none'}}>
            <FaSync className={loading ? "spin" : ""} />
          </button>
        </div>

        {/* --- ANALYTICS TAB --- */}
        {activeTab === "Analytics" ? (
          <div className="system-grid">
            <div className="system-card">
              <h3><FaChartPie color="#1e3c72"/> Project Status Overview</h3>
              <div className="chart-container">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={getStatusData()} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {getStatusData().map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="system-card">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h3>📊 Students by Batch</h3>
                <button onClick={exportToCSV} className="sys-btn" style={{width:'auto', padding:'8px 15px', background:'#10b981'}}>
                  <FaFileDownload/> Export Report
                </button>
              </div>
              <div className="chart-container">
                <ResponsiveContainer>
                  <BarChart data={getBatchData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : activeTab === "System" ? (
          /* --- SYSTEM TAB --- */
          <div className="system-grid">
            <div className="system-card">
              <h3><FaBullhorn color="#1e3c72"/> Announcements</h3>
              <input className="sys-input" placeholder="Title" value={newAnnouncement.title} onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} />
              <textarea className="sys-input" rows="2" placeholder="Message" value={newAnnouncement.message} onChange={e => setNewAnnouncement({...newAnnouncement, message: e.target.value})} />
              <button className="sys-btn" onClick={postAnnouncement}>Post Announcement</button>
              
              <div style={{marginTop:20, maxHeight:200, overflowY:'auto'}}>
                {announcements.map(a => (
                  <div key={a._id} style={{padding:10, borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between'}}>
                    <div><strong>{a.title}</strong><br/><small style={{color:'#666'}}>{new Date(a.date).toLocaleDateString()}</small></div>
                    <button onClick={() => handleDelete('announcements', a._id)} style={{color:'red', border:'none', background:'none', cursor:'pointer'}}><FaTrash/></button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="system-card" style={{marginBottom: 20}}>
                <h3><FaCalendarAlt color="#1e3c72"/> Global Deadline</h3>
                <input type="date" className="sys-input" value={newDeadline} onChange={e => setNewDeadline(e.target.value)} />
                <button className="sys-btn" onClick={setDeadline}>Update Deadline</button>
              </div>

              <div className="system-card">
                <h3><FaFolderOpen color="#1e3c72"/> Resource Library</h3>
                <input className="sys-input" placeholder="Title" value={newResource.title} onChange={e => setNewResource({...newResource, title: e.target.value})} />
                <div style={{display:'flex', gap:10, marginBottom:10}}>
                  <select className="sys-input" value={newResource.category} onChange={e => setNewResource({...newResource, category: e.target.value})}>
                    <option>Guidelines</option><option>Templates</option>
                  </select>
                  <input type="file" onChange={e => setNewResource({...newResource, file: e.target.files[0]})} />
                </div>
                <button className="sys-btn" onClick={uploadResource}><FaUpload/> Upload</button>
              </div>
            </div>
          </div>
        ) : (
          /* --- PROJECTS GRID --- */
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <div key={project._id} className="card">
                <div className="card-top">
                  <div><h3>{project.studentName}</h3><p style={{color:'#64748b', fontSize:13}}>{project.studentEmail}</p></div>
                  <div className={`status-pill ${getStatusColor(project.status)}`}>{project.status === 'Pending Review' ? 'Pending' : project.status}</div>
                </div>
                <div style={{padding:20}}>
                  <div className="meta-row"><span style={{color:'#64748b'}}>Batch</span><strong>{project.batchNumber}</strong></div>
                  <div className="meta-row"><span style={{color:'#64748b'}}>Stage</span><strong>{project.submissions[project.submissions.length-1]?.stage || "N/A"}</strong></div>
                  <button className="review-btn" onClick={() => handleOpenReview(project)}>Review <FaChevronRight/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedProject && (
        <div className="modal-overlay" onClick={handleCloseReview}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div><h3>Reviewing: {selectedProject.studentName}</h3></div>
              <button className="modal-close" onClick={handleCloseReview}><FaTimes/></button>
            </div>
            <div className="modal-body">
              <div className="doc-preview">
                {selectedProject.submissions.length > 0 ? (
                  <a href={selectedProject.submissions[selectedProject.submissions.length-1].fileUrl} target="_blank" rel="noreferrer" className="doc-link">
                    <FaFilePdf size={20} color="red"/> Open Document <FaExternalLinkAlt/>
                  </a>
                ) : "No document"}
              </div>
              <textarea className="feedback-area" placeholder="Feedback..." value={feedback} onChange={e => setFeedback(e.target.value)}/>
              <div className="modal-actions">
                <button className="btn-action btn-reject" disabled={isSubmitting} onClick={() => handleUpdate("Rejected")}><FaTimesCircle/> Reject</button>
                <button className="btn-action btn-approve" disabled={isSubmitting} onClick={() => handleUpdate("Approved")}><FaCheckCircle/> Approve</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default AdminDashboard;
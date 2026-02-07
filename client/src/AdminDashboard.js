import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaUserGraduate, FaCheckCircle, FaTimesCircle, FaClock, 
  FaFilePdf, FaSearch, FaSignOutAlt, FaSync, FaTimes, 
  FaExternalLinkAlt, FaChevronRight, FaBullhorn, FaCalendarAlt, FaFolderOpen, FaTrash, FaUpload
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
  const [activeTab, setActiveTab] = useState("All"); // All, Pending, Approved, Rejected, System
  
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
      // Fetch ALL data in parallel
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

  // --- PROJECT ACTIONS ---
  const handleOpenReview = (project) => {
    setSelectedProject(project);
    setFeedback(project.feedback || "");
  };

  const handleCloseReview = () => {
    setSelectedProject(null);
    setFeedback("");
  };

  const handleUpdate = async (status) => {
    if (status === "Rejected" && !feedback.trim()) {
      showToast("Please provide a reason for rejection", "error");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/admin/update`, {
        email: selectedProject.studentEmail,
        status: status,
        comment: feedback
      });
      
      showToast(`Project ${status} Successfully!`, "success");
      fetchData(); 
      handleCloseReview(); 
    } catch (err) { 
      showToast("Update failed. Server Error.", "error");
    } finally { 
      setIsSubmitting(false); 
    }
  };

  // --- SYSTEM ACTIONS ---
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
      fd.append("title", newResource.title);
      fd.append("category", newResource.category);
      fd.append("file", newResource.file);
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

  // --- FILTERING ---
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.studentEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "All" || activeTab === "System" ? true : p.status === (activeTab === "Pending" ? "Pending Review" : activeTab);
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'status-approved';
      case 'Rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  // Counts
  const counts = {
    All: projects.length,
    Pending: projects.filter(p => p.status === 'Pending Review').length,
    Approved: projects.filter(p => p.status === 'Approved').length,
    Rejected: projects.filter(p => p.status === 'Rejected').length,
    System: "⚙️"
  };

  return (
    <div className="dashboard-container">
      <style>{`
        :root { --primary: #1e3c72; --primary-light: #2a5298; --success: #10b981; --danger: #ef4444; --warning: #f59e0b; --bg: #f8fafc; --surface: #ffffff; --text: #1e293b; --text-light: #64748b; }
        body { margin: 0; font-family: 'Inter', system-ui, sans-serif; background: var(--bg); }

        /* NAVBAR */
        .navbar { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%); color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 20px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; }
        .nav-brand { display: flex; align-items: center; gap: 1rem; }
        .nav-logo { background: rgba(255,255,255,0.2); padding: 8px; border-radius: 12px; display: flex; backdrop-filter: blur(5px); }
        .logout-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .logout-btn:hover { background: rgba(255,255,255,0.25); transform: translateY(-1px); }

        /* MAIN CONTENT */
        .main-content { max-width: 1200px; margin: 0 auto; padding: 2rem; }

        /* ACTION HEADER */
        .action-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .search-box { position: relative; width: 300px; }
        .search-input { width: 100%; padding: 12px 12px 12px 45px; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 14px; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
        .search-input:focus { outline: none; border-color: var(--primary); }
        .search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: var(--text-light); }

        /* TABS */
        .tabs { display: flex; background: white; padding: 5px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); gap: 5px; }
        .tab { padding: 8px 16px; border-radius: 8px; border: none; background: transparent; color: var(--text-light); cursor: pointer; font-weight: 600; font-size: 13px; transition: all 0.2s; }
        .tab.active { background: var(--primary); color: white; shadow: 0 2px 8px rgba(30, 60, 114, 0.3); }
        .tab:hover:not(.active) { background: #f1f5f9; }

        /* GRID */
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; }
        .card { background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: all 0.3s; border: 1px solid #f1f5f9; position: relative; overflow: hidden; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 20px -5px rgba(0,0,0,0.1); border-color: #cbd5e1; }
        .card-top { padding: 20px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; }
        .student-info h3 { margin: 0; font-size: 16px; color: var(--text); }
        .student-info p { margin: 4px 0 0; font-size: 13px; color: var(--text-light); }
        
        .status-pill { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; height: fit-content; }
        .status-approved { background: #dcfce7; color: #166534; } .status-rejected { background: #fee2e2; color: #991b1b; } .status-pending { background: #fef3c7; color: #92400e; }

        .card-body { padding: 20px; }
        .meta-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
        .meta-label { color: var(--text-light); } .meta-val { font-weight: 600; color: var(--text); }

        .review-btn { width: 100%; margin-top: 15px; padding: 12px; background: white; border: 1px solid var(--primary); color: var(--primary); border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .review-btn:hover { background: var(--primary); color: white; }

        /* MODAL */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 1000; animation: fadeIn 0.2s ease; }
        .modal { background: white; width: 90%; max-width: 600px; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; animation: slideUp 0.3s ease; }
        .modal-header { padding: 20px 30px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; }
        .modal-close { background: none; border: none; font-size: 20px; cursor: pointer; color: var(--text-light); }
        .modal-body { padding: 30px; }
        .doc-preview { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px; }
        .doc-link { color: var(--primary); text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; font-size: 16px; }
        .doc-link:hover { text-decoration: underline; }
        .feedback-area { width: 100%; padding: 15px; border: 1px solid #e2e8f0; border-radius: 12px; min-height: 100px; margin-bottom: 20px; font-family: inherit; resize: vertical; box-sizing: border-box; }
        .feedback-area:focus { outline: 2px solid var(--primary); border-color: transparent; }
        .modal-actions { display: flex; gap: 15px; }
        .btn-action { flex: 1; padding: 14px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: transform 0.1s; }
        .btn-action:active { transform: scale(0.98); }
        .btn-approve { background: var(--success); color: white; } .btn-reject { background: var(--danger); color: white; } .btn-approve:disabled, .btn-reject:disabled { opacity: 0.7; cursor: not-allowed; }

        /* SYSTEM TAB STYLES */
        .system-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 25px; }
        .system-card { background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .system-header { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .sys-input { width: 100%; padding: 12px; margin-bottom: 12px; border: 1px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; }
        .sys-btn { background: var(--primary); color: white; padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; width: 100%; }
        .sys-list { margin-top: 20px; max-height: 300px; overflow-y: auto; }
        .sys-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #f1f5f9; }
        .del-btn { color: var(--danger); cursor: pointer; background: none; border: none; }

        /* TOAST */
        .toast { position: fixed; bottom: 30px; right: 30px; background: white; padding: 15px 25px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 12px; font-weight: 600; animation: slideLeft 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); z-index: 2000; }
        .toast.success { border-left: 5px solid var(--success); color: var(--success); } .toast.error { border-left: 5px solid var(--danger); color: var(--danger); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } } @keyframes slideLeft { from { transform: translateX(100%); } to { transform: translateX(0); } } .spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }
        @media (max-width: 768px) { .action-header { flex-direction: column; align-items: stretch; } .search-box { width: 100%; } .tabs { overflow-x: auto; } }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          <div className="nav-logo"><FaUserGraduate color="white" size={24} /></div>
          <div>
            <h2 style={{margin:0, fontSize:18}}>Supervisor Portal</h2>
            <span style={{fontSize:12, opacity:0.8}}>COTHM International</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn"><FaSignOutAlt /> Logout</button>
      </nav>

      <div className="main-content">
        
        {/* TABS & SEARCH */}
        <div className="action-header">
          {activeTab !== "System" && (
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input type="text" className="search-input" placeholder="Search students..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          )}

          <div className="tabs">
            {Object.keys(counts).map(tab => (
              <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab === "Pending" ? "Pending Review" : tab} ({counts[tab]})
              </button>
            ))}
          </div>

          <button onClick={fetchData} className="logout-btn" style={{background: '#3b82f6', border: 'none'}}>
            <FaSync className={loading ? "spin" : ""} /> Refresh
          </button>
        </div>

        {/* --- SYSTEM VIEW --- */}
        {activeTab === "System" ? (
          <div className="system-grid">
            
            {/* ANNOUNCEMENTS */}
            <div className="system-card">
              <div className="system-header"><FaBullhorn color="#1e3c72"/> Announcements</div>
              <input className="sys-input" placeholder="Title" value={newAnnouncement.title} onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} />
              <textarea className="sys-input" rows="3" placeholder="Message" value={newAnnouncement.message} onChange={e => setNewAnnouncement({...newAnnouncement, message: e.target.value})} />
              <button className="sys-btn" onClick={postAnnouncement}>Post Announcement</button>
              
              <div className="sys-list">
                {announcements.map(a => (
                  <div key={a._id} className="sys-item">
                    <div>
                      <div style={{fontWeight:600}}>{a.title}</div>
                      <small style={{color:'#64748b'}}>{new Date(a.date).toLocaleDateString()}</small>
                    </div>
                    <button className="del-btn" onClick={() => handleDelete('announcements', a._id)}><FaTrash/></button>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div>
              {/* DEADLINE */}
              <div className="system-card" style={{marginBottom: 25}}>
                <div className="system-header"><FaCalendarAlt color="#1e3c72"/> Global Deadline</div>
                <input type="date" className="sys-input" value={newDeadline} onChange={e => setNewDeadline(e.target.value)} />
                <button className="sys-btn" onClick={setDeadline}>Update Deadline</button>
              </div>

              {/* RESOURCES */}
              <div className="system-card">
                <div className="system-header"><FaFolderOpen color="#1e3c72"/> Resource Library</div>
                <input className="sys-input" placeholder="Resource Title" value={newResource.title} onChange={e => setNewResource({...newResource, title: e.target.value})} />
                <select className="sys-input" value={newResource.category} onChange={e => setNewResource({...newResource, category: e.target.value})}>
                  <option>Guidelines</option><option>Templates</option><option>Samples</option>
                </select>
                <div style={{marginBottom:12}}>
                  <input type="file" onChange={e => setNewResource({...newResource, file: e.target.files[0]})} />
                </div>
                <button className="sys-btn" onClick={uploadResource}><FaUpload/> Upload File</button>

                <div className="sys-list">
                  {resources.map(r => (
                    <div key={r._id} className="sys-item">
                      <div>
                        <div style={{fontWeight:600}}>{r.title}</div>
                        <span style={{fontSize:10, background:'#f1f5f9', padding:'2px 6px', borderRadius:4}}>{r.category}</span>
                      </div>
                      <button className="del-btn" onClick={() => handleDelete('resources', r._id)}><FaTrash/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* --- PROJECTS GRID --- */
          <div className="projects-grid">
            {filteredProjects.map((project) => {
              const latestSub = project.submissions?.[project.submissions.length - 1];
              return (
                <div key={project._id} className="card">
                  <div className="card-top">
                    <div className="student-info">
                      <h3>{project.studentName}</h3>
                      <p>{project.studentEmail}</p>
                      <p style={{fontSize: 11, background: '#f1f5f9', display: 'inline-block', padding: '2px 6px', borderRadius: 4, marginTop: 4}}>
                        {project.batchNumber || "No Batch"}
                      </p>
                    </div>
                    <div className={`status-pill ${getStatusColor(project.status)}`}>
                      {project.status === 'Pending Review' ? 'Pending' : project.status}
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="meta-row"><span className="meta-label">Stage</span><span className="meta-val">{latestSub?.stage || "Not Started"}</span></div>
                    <div className="meta-row"><span className="meta-label">Submitted</span><span className="meta-val">{latestSub ? new Date(latestSub.date).toLocaleDateString() : "-"}</span></div>
                    <button className="review-btn" onClick={() => handleOpenReview(project)}>
                      {project.status === 'Pending Review' ? 'Review Submission' : 'View Details'} <FaChevronRight size={12}/>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- REVIEW MODAL --- */}
      {selectedProject && (
        <div className="modal-overlay" onClick={handleCloseReview}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div><h3 style={{margin:0}}>Reviewing: {selectedProject.studentName}</h3><span style={{fontSize:13, color:'#64748b'}}>{selectedProject.studentEmail}</span></div>
              <button className="modal-close" onClick={handleCloseReview}><FaTimes/></button>
            </div>
            <div className="modal-body">
              <div className="doc-preview">
                {selectedProject.submissions?.length > 0 ? (
                  <a href={selectedProject.submissions[selectedProject.submissions.length - 1].fileUrl} target="_blank" rel="noreferrer" className="doc-link">
                    <FaFilePdf size={24} color="#ef4444"/> Open Document <FaExternalLinkAlt size={12}/>
                  </a>
                ) : <p style={{color:'#94a3b8'}}>No document.</p>}
              </div>
              <label style={{fontWeight:600, fontSize:14, marginBottom:8, display:'block'}}>Supervisor Feedback</label>
              <textarea className="feedback-area" placeholder="Enter comments..." value={feedback} onChange={(e) => setFeedback(e.target.value)} />
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
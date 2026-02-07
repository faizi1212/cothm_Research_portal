import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaFileUpload, FaCheckCircle, FaExclamationCircle, FaClock, 
  FaCommentDots, FaFilePdf, FaSignOutAlt, FaUserGraduate, 
  FaBars, FaTimes, FaCloudUploadAlt, FaHistory, FaChevronRight 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Note: Ensure you have your logo at this path or remove the img tag
// import logo from "./logo.png"; 

const PortalDashboard = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStage, setUploadStage] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop
  const [toast, setToast] = useState(null); // Simple notification state
  
  const API_URL = "https://cothm-research-portal.onrender.com";
  const user = JSON.parse(localStorage.getItem("user")) || { firstName: "Student", lastName: "", email: "" };
  const navigate = useNavigate();

  useEffect(() => { 
    if(!user.email) navigate("/login");
    fetchMyProject(); 
    
    // Auto-close sidebar on mobile
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMyProject = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects/my-projects?email=${user.email}`);
      if (res.data && res.data.length > 0) setProject(res.data[0]);
    } catch (err) { console.error("Error", err); }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !uploadStage) {
      showToast("Please select both a file and a stage", "error");
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("studentEmail", user.email);
      formData.append("studentName", `${user.firstName} ${user.lastName}`);
      formData.append("stage", uploadStage);
      
      await axios.post(`${API_URL}/api/submit`, formData);
      
      showToast("Submission Uploaded Successfully!");
      setFile(null); 
      setUploadStage(""); 
      fetchMyProject();
    } catch (err) { 
      showToast("Upload Failed. Please try again.", "error");
    } finally { 
      setLoading(false); 
    }
  };

  const handleLogout = () => { localStorage.removeItem("user"); navigate("/login"); };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return { bg: '#dcfce7', text: '#166534', icon: <FaCheckCircle size={24}/> };
      case 'Rejected': return { bg: '#fee2e2', text: '#991b1b', icon: <FaExclamationCircle size={24}/> };
      default: return { bg: '#fef3c7', text: '#92400e', icon: <FaClock size={24}/> };
    }
  };

  const statusStyle = project ? getStatusColor(project.status) : {};

  return (
    <div className="portal-layout">
      {/* CSS STYLES INJECTED */}
      <style>{`
        :root {
          --primary: #1e3c72;
          --primary-dark: #102a56;
          --accent: #2a5298;
          --bg: #f3f4f6;
          --surface: #ffffff;
          --text: #1e293b;
          --text-light: #64748b;
          --border: #e2e8f0;
          --success: #10b981;
          --danger: #ef4444;
          --warning: #f59e0b;
        }
        
        body { margin: 0; font-family: 'Inter', system-ui, sans-serif; background: var(--bg); color: var(--text); }
        
        .portal-layout { display: flex; min-height: 100vh; position: relative; }
        
        /* SIDEBAR */
        .sidebar {
          background: linear-gradient(180deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          width: 260px;
          transition: transform 0.3s ease, width 0.3s ease;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 50;
        }
        .sidebar.closed { transform: translateX(-100%); width: 0; }
        .sidebar-header { padding: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 12px; }
        .sidebar-title { font-weight: 700; font-size: 20px; letter-spacing: 0.5px; margin: 0; }
        .nav-links { padding: 20px; flex: 1; }
        .nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 18px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 8px;
          color: rgba(255,255,255,0.8);
          font-weight: 500;
        }
        .nav-item:hover, .nav-item.active { background: rgba(255,255,255,0.15); color: white; transform: translateX(5px); }
        
        /* MAIN AREA */
        .main-wrapper { flex: 1; margin-left: 260px; transition: margin 0.3s ease; width: 100%; }
        .main-wrapper.full { margin-left: 0; }
        
        /* NAVBAR */
        .navbar {
          background: var(--surface);
          padding: 15px 30px;
          display: flex; justify-content: space-between; align-items: center;
          box-shadow: 0 2px 15px rgba(0,0,0,0.03);
          position: sticky; top: 0; z-index: 40;
        }
        .menu-btn { cursor: pointer; color: var(--text-light); transition: color 0.2s; }
        .menu-btn:hover { color: var(--primary); }
        .user-profile { display: flex; align-items: center; gap: 12px; }
        .user-badge { background: #e0f2fe; color: var(--accent); font-size: 11px; padding: 4px 10px; border-radius: 20px; font-weight: 700; text-transform: uppercase; }
        .user-avatar { width: 35px; height: 35px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; }
        
        /* CONTENT */
        .content { padding: 30px; max-width: 1200px; margin: 0 auto; }
        .page-header { margin-bottom: 30px; }
        .page-title { font-size: 28px; font-weight: 800; color: var(--text); margin: 0; }
        .page-subtitle { color: var(--text-light); margin-top: 5px; font-size: 14px; }
        
        /* CARDS */
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px; }
        .card {
          background: var(--surface);
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          border: 1px solid var(--border);
          transition: transform 0.2s;
        }
        .card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .card-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        
        /* STATUS BOX */
        .status-hero {
          padding: 25px; border-radius: 12px;
          display: flex; flex-direction: column; align-items: center; text-align: center;
          margin-bottom: 20px;
        }
        .status-icon-box { margin-bottom: 15px; }
        .status-label { font-size: 14px; opacity: 0.8; margin-bottom: 5px; font-weight: 600; text-transform: uppercase; }
        .status-value { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        
        /* FEEDBACK */
        .feedback-box { background: #f8fafc; border-left: 4px solid var(--primary); padding: 15px; border-radius: 8px; margin-top: 20px; }
        .feedback-header { font-size: 13px; color: var(--primary); font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
        .feedback-content { color: var(--text-light); font-size: 14px; font-style: italic; line-height: 1.5; }
        
        /* UPLOAD FORM */
        .form-group { margin-bottom: 20px; }
        .custom-select {
          width: 100%; padding: 12px; border-radius: 10px; border: 1px solid var(--border);
          background: white; color: var(--text); font-size: 14px; outline: none; transition: border 0.2s;
        }
        .custom-select:focus { border-color: var(--primary); }
        
        .upload-zone {
          border: 2px dashed var(--border); border-radius: 12px;
          padding: 40px 20px; text-align: center; cursor: pointer;
          transition: all 0.2s; background: #f8fafc;
        }
        .upload-zone:hover { border-color: var(--primary); background: #f1f5f9; }
        .upload-zone.active { border-color: var(--success); background: #ecfdf5; }
        .upload-icon { font-size: 40px; color: var(--text-light); margin-bottom: 10px; transition: color 0.2s; }
        .upload-zone:hover .upload-icon { color: var(--primary); }
        .upload-text { font-weight: 600; color: var(--text); margin-bottom: 4px; }
        .upload-subtext { font-size: 12px; color: var(--text-light); }
        
        .btn-submit {
          width: 100%; padding: 14px; background: var(--primary); color: white;
          border: none; border-radius: 10px; font-weight: 600; font-size: 15px;
          cursor: pointer; transition: background 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px;
        }
        .btn-submit:hover { background: var(--primary-dark); }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        
        /* HISTORY LIST */
        .history-list { display: flex; flex-direction: column; gap: 15px; }
        .history-item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 15px; background: #f8fafc; border-radius: 10px; border: 1px solid transparent;
          transition: all 0.2s;
        }
        .history-item:hover { border-color: var(--border); background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        .history-info { display: flex; align-items: center; gap: 15px; }
        .file-icon { color: #ef4444; font-size: 24px; }
        .stage-name { font-weight: 600; color: var(--text); font-size: 14px; }
        .sub-date { font-size: 12px; color: var(--text-light); }
        .btn-view {
          padding: 6px 12px; border: 1px solid var(--border); background: white;
          border-radius: 6px; color: var(--text); font-size: 12px; font-weight: 600;
          text-decoration: none; transition: all 0.2s;
        }
        .btn-view:hover { border-color: var(--primary); color: var(--primary); }

        /* TOAST */
        .toast {
          position: fixed; bottom: 20px; right: 20px;
          background: white; padding: 15px 20px; border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 10px;
          animation: slideIn 0.3s ease; z-index: 100; font-weight: 500; font-size: 14px;
        }
        .toast.success { border-left: 4px solid var(--success); }
        .toast.error { border-left: 4px solid var(--danger); }
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .main-wrapper { margin-left: 0; }
          .sidebar { position: fixed; }
        }
      `}</style>

      {/* --- SIDEBAR --- */}
      <div className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
        <div className="sidebar-header">
          <FaUserGraduate size={24} />
          <h1 className="sidebar-title">COTHM Portal</h1>
        </div>
        <div className="nav-links">
          <div className="nav-item active">
            <FaUserGraduate /> Dashboard
          </div>
          <div className="nav-item" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className={`main-wrapper ${isSidebarOpen ? '' : 'full'}`}>
        
        {/* Navbar */}
        <div className="navbar">
          <div className="menu-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <FaTimes size={20}/> : <FaBars size={20}/>}
          </div>
          <div className="user-profile">
            <div className="user-avatar">{user.firstName?.charAt(0)}</div>
            <div>
              <div style={{fontWeight:600, fontSize:14}}>{user.firstName} {user.lastName}</div>
              <span className="user-badge">Student</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="content">
          <div className="page-header">
            <h2 className="page-title">Research Dashboard</h2>
            <p className="page-subtitle">Track your thesis progress and submit documents.</p>
          </div>

          <div className="grid">
            
            {/* 1. STATUS CARD (Hero) */}
            <div className="card">
              <div className="card-title"><FaClock color="#1e3c72"/> Current Status</div>
              
              {project ? (
                <>
                  <div className="status-hero" style={{ background: statusStyle.bg, color: statusStyle.text }}>
                    <div className="status-icon-box">{statusStyle.icon}</div>
                    <div className="status-label">Project Status</div>
                    <div className="status-value">{project.status}</div>
                  </div>

                  {project.feedback && (
                    <div className="feedback-box">
                      <div className="feedback-header"><FaCommentDots/> Supervisor Feedback</div>
                      <p className="feedback-content">"{project.feedback}"</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="status-hero" style={{background: '#f1f5f9', color: '#64748b'}}>
                  <FaCloudUploadAlt size={40} style={{marginBottom:10, opacity:0.5}}/>
                  <div className="status-value" style={{fontSize:18}}>No Submission Yet</div>
                  <p style={{fontSize:13, marginTop:5}}>Upload your proposal to get started.</p>
                </div>
              )}
            </div>

            {/* 2. UPLOAD CARD */}
            <div className="card">
              <div className="card-title"><FaCloudUploadAlt color="#1e3c72"/> New Submission</div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <select 
                    className="custom-select"
                    value={uploadStage} 
                    onChange={(e) => setUploadStage(e.target.value)} 
                  >
                    <option value="">Select Submission Stage</option>
                    <option value="Proposal">Topic Proposal</option>
                    <option value="Chapter 1">Chapter 1</option>
                    <option value="Mid-Term">Mid-Term Report</option>
                    <option value="Final Thesis">Final Thesis</option>
                  </select>
                </div>

                <div className="form-group">
                  <input 
                    type="file" 
                    id="file-upload" 
                    onChange={handleFileChange} 
                    accept=".pdf,.doc,.docx" 
                    style={{display:'none'}} 
                  />
                  <label 
                    htmlFor="file-upload" 
                    className={`upload-zone ${file ? 'active' : ''}`}
                  >
                    <div className="upload-icon">
                      {file ? <FaFilePdf color="#ef4444"/> : <FaCloudUploadAlt/>}
                    </div>
                    <div className="upload-text">
                      {file ? file.name : "Click to select document"}
                    </div>
                    <div className="upload-subtext">
                      {file ? "Ready to upload" : "Supports PDF, DOC, DOCX"}
                    </div>
                  </label>
                </div>

                <button type="submit" disabled={loading} className="btn-submit">
                  {loading ? "Uploading..." : <><FaFileUpload/> Submit for Review</>}
                </button>
              </form>
            </div>
          </div>

          {/* 3. HISTORY SECTION */}
          {project?.submissions?.length > 0 && (
            <div className="card" style={{marginTop: 30}}>
              <div className="card-title"><FaHistory color="#1e3c72"/> Submission History</div>
              <div className="history-list">
                {project.submissions.slice().reverse().map((sub, i) => (
                  <div key={i} className="history-item">
                    <div className="history-info">
                      <FaFilePdf className="file-icon"/>
                      <div>
                        <div className="stage-name">{sub.stage}</div>
                        <div className="sub-date">Submitted on {new Date(sub.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="btn-view">
                      View File <FaChevronRight size={10} style={{marginLeft:4}}/>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* NOTIFICATION TOAST */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? <FaCheckCircle/> : <FaExclamationCircle/>}
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default PortalDashboard;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaFileUpload, FaCheckCircle, FaExclamationCircle, FaClock, 
  FaCommentDots, FaFilePdf, FaSignOutAlt, FaUserGraduate, 
  FaBars, FaTimes, FaCloudUploadAlt, FaHistory, FaChevronRight,
  FaBullhorn, FaFolderOpen, FaDownload, FaCalendarCheck
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PortalDashboard = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("Dashboard"); // 'Dashboard' or 'Resources'
  const [data, setData] = useState({ 
    project: null, 
    announcements: [], 
    resources: [], 
    deadline: null 
  });
  const [daysLeft, setDaysLeft] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStage, setUploadStage] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null);
  
  const API_URL = "https://cothm-research-portal.onrender.com";
  
  const user = JSON.parse(localStorage.getItem("user")) || { 
    firstName: "Student", lastName: "", email: "", batchNumber: "N/A" 
  };
  
  const navigate = useNavigate();

  // --- EFFECTS ---
  useEffect(() => { 
    if(!user.email) navigate("/login");
    fetchAllData(); 
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch everything in parallel
      const [pRes, aRes, rRes, sRes] = await Promise.all([
        axios.get(`${API_URL}/api/projects/my-projects?email=${user.email}`),
        axios.get(`${API_URL}/api/announcements`),
        axios.get(`${API_URL}/api/resources`),
        axios.get(`${API_URL}/api/settings`)
      ]);

      // Calculate Deadline
      let deadlineDate = sRes.data.deadline ? new Date(sRes.data.deadline) : null;
      if (deadlineDate) {
        const diff = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24));
        setDaysLeft(diff);
      }

      setData({
        project: pRes.data[0] || null,
        announcements: aRes.data || [],
        resources: rRes.data || [],
        deadline: deadlineDate
      });

    } catch (err) { console.error("Error fetching data", err); }
  };

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
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
      formData.append("batchNumber", user.batchNumber);
      
      await axios.post(`${API_URL}/api/submit`, formData);
      
      showToast("Submission Uploaded Successfully!");
      setFile(null); 
      setUploadStage(""); 
      fetchAllData(); // Refresh project data
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

  const statusStyle = data.project ? getStatusColor(data.project.status) : {};

  return (
    <div className="portal-layout">
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
        .portal-layout { display: flex; min-height: 100vh; position: relative; overflow-x: hidden; }
        
        /* SIDEBAR FIXED LAYOUT */
        .sidebar {
          background: linear-gradient(180deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white; width: 260px; height: 100vh; position: fixed; top: 0; left: 0; z-index: 50;
          transition: transform 0.3s ease; display: flex; flexDirection: column;
        }
        .sidebar.closed { transform: translateX(-100%); }
        
        .sidebar-header { padding: 25px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); flex-shrink: 0; }
        .sidebar-title { font-weight: 700; font-size: 20px; margin: 0; letter-spacing: 0.5px; }

        .nav-links { padding: 20px; flex-grow: 1; overflow-y: auto; }
        .nav-item { padding: 12px 16px; border-radius: 10px; cursor: pointer; transition: all 0.2s; margin-bottom: 8px; color: rgba(255,255,255,0.8); font-weight: 500; display: flex; align-items: center; gap: 12px; }
        .nav-item:hover, .nav-item.active { background: rgba(255,255,255,0.15); color: white; transform: translateX(5px); }

        .sidebar-footer { padding: 20px; border-top: 1px solid rgba(255,255,255,0.1); flex-shrink: 0; background: rgba(0,0,0,0.1); }
        .logout-btn { width: 100%; padding: 12px; background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; transition: all 0.2s; }
        .logout-btn:hover { background: rgba(239, 68, 68, 0.3); color: white; border-color: rgba(239, 68, 68, 0.5); }

        /* MAIN */
        .main-wrapper { flex: 1; margin-left: 260px; transition: margin 0.3s ease; width: 100%; }
        .main-wrapper.full { margin-left: 0; }
        
        /* NAVBAR */
        .navbar { background: var(--surface); padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 15px rgba(0,0,0,0.03); position: sticky; top: 0; z-index: 40; }
        .menu-btn { cursor: pointer; color: var(--text-light); }
        .user-profile { display: flex; align-items: center; gap: 15px; }
        .user-info { text-align: right; line-height: 1.2; }
        .user-name { font-weight: 600; font-size: 14px; color: var(--text); display: block; }
        .user-batch { font-size: 11px; color: var(--text-light); background: #f1f5f9; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 2px; }
        .user-avatar { width: 38px; height: 38px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; }
        
        /* CONTENT */
        .content { padding: 30px; max-width: 1200px; margin: 0 auto; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px; }
        
        /* CARDS */
        .card { background: var(--surface); border-radius: 16px; padding: 25px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid var(--border); margin-bottom: 25px; }
        .card-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        
        /* FEATURES */
        .deadline-box { background: #fff7ed; color: #c2410c; padding: 15px 20px; border-radius: 12px; font-weight: 600; text-align: center; margin-bottom: 25px; border: 1px solid #ffedd5; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .announcement-item { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 15px; border-radius: 8px; }
        .resource-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8fafc; border-radius: 10px; border: 1px solid var(--border); transition: 0.2s; }
        .resource-item:hover { background: white; border-color: var(--primary); }

        /* UPLOAD */
        .upload-container { position: relative; width: 100%; margin-top: 15px; }
        .hidden-input { display: none !important; }
        .upload-label { display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px dashed var(--border); border-radius: 12px; padding: 40px 20px; background: #f8fafc; cursor: pointer; transition: all 0.2s; width: 100%; box-sizing: border-box; }
        .upload-label:hover { border-color: var(--primary); background: #f1f5f9; }
        .upload-label.active { border-color: var(--success); background: #ecfdf5; }
        .btn-submit { width: 100%; padding: 14px; background: var(--primary); color: white; border: none; border-radius: 10px; font-weight: 600; margin-top: 20px; cursor: pointer; }
        .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        
        /* STATUS HERO */
        .status-hero { padding: 25px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; text-align: center; }
        .status-value { font-size: 24px; font-weight: 800; margin-top: 5px; }
        .feedback-box { background: #f8fafc; border-left: 4px solid var(--primary); padding: 15px; border-radius: 8px; margin-top: 20px; }
        
        /* HISTORY */
        .history-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8fafc; border-radius: 10px; margin-bottom: 10px; }
        .btn-view { padding: 6px 12px; border: 1px solid var(--border); background: white; border-radius: 6px; color: var(--text); text-decoration: none; font-size: 12px; font-weight: 600; }
        
        /* TOAST */
        .toast { position: fixed; bottom: 20px; right: 20px; background: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 10px; z-index: 100; border-left: 4px solid var(--success); }
        .toast.error { border-left-color: var(--danger); }
        
        @media (max-width: 768px) { .main-wrapper { margin-left: 0; } .sidebar { position: fixed; } }
      `}</style>

      {/* SIDEBAR */}
      <div className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
        <div style={{display:'flex', flexDirection:'column', flexGrow: 1}}>
          <div className="sidebar-header">
            <FaUserGraduate size={28} />
            <h1 className="sidebar-title">COTHM</h1>
          </div>
          
          <div className="nav-links">
            {/* TABS */}
            <div 
              className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('Dashboard')}
            >
              <FaUserGraduate /> Dashboard
            </div>
            <div 
              className={`nav-item ${activeTab === 'Resources' ? 'active' : ''}`}
              onClick={() => setActiveTab('Resources')}
            >
              <FaFolderOpen /> Resources
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={`main-wrapper ${isSidebarOpen ? '' : 'full'}`}>
        
        {/* NAVBAR */}
        <div className="navbar">
          <div className="menu-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <FaTimes size={20}/> : <FaBars size={20}/>}
          </div>
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">{user.firstName} {user.lastName}</span>
              <span className="user-batch">Batch: {user.batchNumber || "N/A"}</span>
            </div>
            <div className="user-avatar">{user.firstName?.charAt(0)}</div>
          </div>
        </div>

        <div className="content">
          <div className="page-header">
            <h2 className="page-title">{activeTab === 'Dashboard' ? 'Research Dashboard' : 'Resource Library'}</h2>
            <p className="page-subtitle">
              {activeTab === 'Dashboard' ? 'Track progress, submit work, and view announcements.' : 'Download templates and guidelines.'}
            </p>
          </div>

          {/* DEADLINE BANNER */}
          {daysLeft !== null && daysLeft > 0 && (
            <div className="deadline-box">
              <FaCalendarCheck /> 
              <span>Final Submission Deadline: {daysLeft} Days Remaining ({data.deadline?.toLocaleDateString()})</span>
            </div>
          )}

          {/* --- DASHBOARD TAB --- */}
          {activeTab === 'Dashboard' && (
            <div className="grid">
              
              {/* LEFT COLUMN */}
              <div>
                {/* 1. ANNOUNCEMENTS (NEW) */}
                <div className="card">
                  <div className="card-title"><FaBullhorn color="#1e3c72"/> Announcements</div>
                  {data.announcements.length === 0 ? <p style={{color:'#94a3b8', fontSize:14}}>No updates yet.</p> : 
                    data.announcements.map(a => (
                      <div key={a._id} className="announcement-item">
                        <strong style={{color:'#1e3c72'}}>{a.title}</strong>
                        <p style={{margin:'5px 0', fontSize:14, color:'#334155'}}>{a.message}</p>
                        <small style={{color:'#64748b', fontSize:12}}>{new Date(a.date).toLocaleDateString()}</small>
                      </div>
                    ))
                  }
                </div>

                {/* 2. PROJECT STATUS */}
                <div className="card">
                  <div className="card-title"><FaClock color="#1e3c72"/> Project Status</div>
                  {data.project ? (
                    <>
                      <div className="status-hero" style={{ background: statusStyle.bg, color: statusStyle.text }}>
                        <div>{statusStyle.icon}</div>
                        <div className="status-value">{data.project.status}</div>
                      </div>
                      {data.project.feedback && (
                        <div className="feedback-box">
                          <div style={{fontWeight:700, marginBottom:5, color:'var(--primary)'}}>Supervisor Feedback:</div>
                          <div style={{fontStyle:'italic'}}>"{data.project.feedback}"</div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="status-hero" style={{background: '#f1f5f9', color: '#64748b'}}>
                      <div>Not Started</div>
                      <div style={{fontSize:14, marginTop:5}}>No active project found.</div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div>
                {/* 3. UPLOAD CARD */}
                <div className="card">
                  <div className="card-title"><FaCloudUploadAlt color="#1e3c72"/> New Submission</div>
                  
                  <form onSubmit={handleSubmit}>
                    <div style={{marginBottom: 20}}>
                      <label style={{display:'block', marginBottom:8, fontSize:14, fontWeight:600}}>Select Stage</label>
                      <select 
                        style={{width:'100%', padding:12, borderRadius:10, border:'1px solid var(--border)'}}
                        value={uploadStage} 
                        onChange={(e) => setUploadStage(e.target.value)} 
                      >
                        <option value="">-- Choose Stage --</option>
                        <option value="Proposal">Topic Proposal</option>
                        <option value="Chapter 1">Chapter 1</option>
                        <option value="Mid-Term">Mid-Term Report</option>
                        <option value="Final Thesis">Final Thesis</option>
                      </select>
                    </div>

                    <div className="upload-container">
                      <input type="file" id="file-upload" className="hidden-input" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                      <label htmlFor="file-upload" className={`upload-label ${file ? 'active' : ''}`}>
                        <div style={{marginBottom:10}}>
                          {file ? <FaFilePdf size={32} color="#ef4444"/> : <FaCloudUploadAlt size={32} color="#64748b"/>}
                        </div>
                        <div style={{fontWeight:600, color:'var(--text)'}}>{file ? file.name : "Click here to upload document"}</div>
                        <div style={{fontSize:12, color:'var(--text-light)'}}>{file ? "Ready to submit" : "PDF, DOC, DOCX (Max 10MB)"}</div>
                      </label>
                    </div>

                    <button type="submit" disabled={loading} className="btn-submit">
                      {loading ? "Uploading..." : "Submit for Review"}
                    </button>
                  </form>
                </div>

                {/* 4. HISTORY */}
                {data.project?.submissions?.length > 0 && (
                  <div className="card">
                    <div className="card-title"><FaHistory color="#1e3c72"/> History</div>
                    {data.project.submissions.slice().reverse().map((sub, i) => (
                      <div key={i} className="history-item">
                        <div style={{display:'flex', alignItems:'center', gap:10}}>
                          <FaFilePdf color="#ef4444"/>
                          <div>
                            <div style={{fontWeight:600, fontSize:14}}>{sub.stage}</div>
                            <div style={{fontSize:11, color:'#94a3b8'}}>{new Date(sub.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="btn-view">View</a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- RESOURCES TAB --- */}
          {activeTab === 'Resources' && (
            <div className="grid">
              <div className="card" style={{gridColumn: '1 / -1'}}>
                <div className="card-title"><FaFolderOpen color="#1e3c72"/> Document Library</div>
                {data.resources.length === 0 ? <p style={{color:'#64748b', padding:20, textAlign:'center'}}>No resources uploaded yet.</p> : (
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20}}>
                    {data.resources.map(r => (
                      <div key={r._id} className="resource-item">
                        <div style={{display:'flex', alignItems:'center', gap:15}}>
                          <FaFilePdf size={24} color="#e11d48"/> 
                          <div>
                            <strong style={{display:'block', color:'#1e293b'}}>{r.title}</strong>
                            <span style={{fontSize:11, background:'#f1f5f9', padding:'2px 8px', borderRadius:10, color:'#475569'}}>{r.category}</span>
                          </div>
                        </div>
                        <a href={r.fileUrl} target="_blank" rel="noreferrer" className="btn-view" style={{display:'flex', alignItems:'center', gap:5}}>
                          <FaDownload/> Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

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
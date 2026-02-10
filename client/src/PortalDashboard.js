import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaFileUpload, FaCheckCircle, FaExclamationCircle, FaClock, 
  FaUserGraduate, FaBars, FaTimes, FaCloudUploadAlt, FaHistory, 
  FaBullhorn, FaFolderOpen, FaDownload, FaCalendarCheck, FaCog, FaBell, FaSignOutAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PortalDashboard = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [data, setData] = useState({ project: null, announcements: [], resources: [], deadline: null, notifications: [] });
  const [daysLeft, setDaysLeft] = useState(null);
  
  // Upload State
  const [file, setFile] = useState(null);
  const [uploadStage, setUploadStage] = useState("");
  const [loading, setLoading] = useState(false);
  
  // UI State
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  
  // Profile Settings State
  const [profile, setProfile] = useState({ firstName: "", lastName: "", password: "" });

  const API_URL = "https://cothm-research-portal.onrender.com";
  const user = JSON.parse(localStorage.getItem("user")) || { firstName: "Student", lastName: "" };
  const navigate = useNavigate();

  // --- INITIAL LOAD ---
  useEffect(() => { 
    if(!user.email) navigate("/login");
    
    // Set initial profile state
    setProfile({ firstName: user.firstName, lastName: user.lastName, password: "" });
    
    fetchAllData(); 
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, []);

  const fetchAllData = async () => {
    try {
      const [p, a, r, s, n] = await Promise.all([
        axios.get(`${API_URL}/api/projects/my-projects?email=${user.email}`),
        axios.get(`${API_URL}/api/announcements`),
        axios.get(`${API_URL}/api/resources`),
        axios.get(`${API_URL}/api/settings`),
        axios.get(`${API_URL}/api/notifications?email=${user.email}`)
      ]);

      // Calculate Deadline
      if (s.data.deadline) {
        setDaysLeft(Math.ceil((new Date(s.data.deadline) - new Date()) / (1000 * 60 * 60 * 24)));
      }

      setData({
        project: p.data[0] || null,
        announcements: a.data,
        resources: r.data,
        deadline: s.data.deadline ? new Date(s.data.deadline) : null,
        notifications: n.data
      });
    } catch (err) { console.error("Error loading data", err); }
  };

  // --- ACTIONS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !uploadStage) return alert("Please select a file and stage.");
    
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("studentEmail", user.email);
      fd.append("studentName", `${user.firstName} ${user.lastName}`);
      fd.append("stage", uploadStage);
      fd.append("batchNumber", user.batchNumber);
      
      await axios.post(`${API_URL}/api/submit`, fd);
      alert("✅ Submitted Successfully!");
      setFile(null); 
      setUploadStage(""); 
      fetchAllData();
    } catch (err) { alert("Upload Failed."); } 
    finally { setLoading(false); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/api/auth/update-profile`, { 
        email: user.email, 
        firstName: profile.firstName, 
        lastName: profile.lastName, 
        password: profile.password 
      });
      // Update local storage
      localStorage.setItem("user", JSON.stringify({ ...user, firstName: res.data.user.firstName, lastName: res.data.user.lastName }));
      alert("✅ Profile Updated Successfully!");
      setProfile({...profile, password: ""}); // Clear password field
    } catch(err) { alert("Update Failed"); }
  };

  const handleLogout = () => { localStorage.removeItem("user"); navigate("/login"); };

  // Helper for Status Colors
  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return { bg: '#dcfce7', text: '#166534', icon: <FaCheckCircle/> };
      case 'Rejected': return { bg: '#fee2e2', text: '#991b1b', icon: <FaExclamationCircle/> };
      default: return { bg: '#fef3c7', text: '#92400e', icon: <FaClock/> };
    }
  };
  const statusStyle = data.project ? getStatusColor(data.project.status) : { bg: '#f1f5f9', text: '#64748b', icon: <FaClock/> };

  return (
    <div className="portal-layout">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        :root {
          --primary: #1e3c72;
          --bg: #f1f5f9;
          --sidebar: #0f172a;
          --surface: #ffffff;
          --text: #1e293b;
          --border: #e2e8f0;
        }
        
        body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); }
        .portal-layout { display: flex; min-height: 100vh; overflow-x: hidden; }
        
        /* SIDEBAR */
        .sidebar {
          width: 260px;
          background: var(--sidebar);
          color: white;
          position: fixed;
          height: 100vh;
          z-index: 50;
          display: flex;
          flex-direction: column;
          padding: 20px;
          box-sizing: border-box;
          transition: transform 0.3s ease;
        }
        .sidebar.closed { transform: translateX(-100%); }
        
        .logo-area {
          display: flex; align-items: center; gap: 12px;
          padding-bottom: 20px; margin-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .logo-icon {
          width: 40px; height: 40px; background: #3b82f6;
          border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        
        .nav-links { flex: 1; }
        .nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 15px; border-radius: 8px;
          color: #cbd5e1; cursor: pointer; transition: 0.2s;
          margin-bottom: 5px; font-weight: 500;
        }
        .nav-item:hover, .nav-item.active { background: rgba(255,255,255,0.1); color: white; }
        .nav-item.active { background: #3b82f6; }
        
        .logout-btn {
          margin-top: auto; padding: 12px;
          background: rgba(239, 68, 68, 0.15); color: #fca5a5;
          border-radius: 8px; cursor: pointer; text-align: center;
          font-weight: 600; transition: 0.2s; display: flex; justify-content: center; gap: 8px; align-items: center;
        }
        .logout-btn:hover { background: rgba(239, 68, 68, 0.25); color: white; }

        /* MAIN CONTENT */
        .main-wrapper { flex: 1; margin-left: 260px; transition: margin 0.3s ease; width: 100%; display: flex; flex-direction: column; }
        .main-wrapper.full { margin-left: 0; }
        
        /* NAVBAR */
        .navbar {
          background: var(--surface);
          padding: 15px 30px;
          display: flex; justify-content: space-between; align-items: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          position: sticky; top: 0; z-index: 40;
        }
        
        .bell-container { position: relative; cursor: pointer; margin-right: 20px; }
        .badge { position: absolute; top: -5px; right: -5px; background: #ef4444; color: white; font-size: 10px; padding: 2px 5px; border-radius: 10px; border: 2px solid white; }
        
        .dropdown {
          position: absolute; top: 50px; right: 0; width: 300px;
          background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          border: 1px solid var(--border); overflow: hidden; z-index: 100;
        }
        .notif-item { padding: 12px 15px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #334155; }
        .notif-item:last-child { border: none; }
        .notif-time { font-size: 11px; color: #94a3b8; display: block; margin-top: 4px; }

        /* CONTENT */
        .content { padding: 30px; max-width: 1200px; margin: 0 auto; width: 100%; box-sizing: border-box; }
        .page-title { font-size: 24px; font-weight: 700; margin-bottom: 5px; color: #0f172a; }
        .page-sub { color: #64748b; margin-bottom: 30px; font-size: 14px; }

        /* CARDS */
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px; }
        .card { background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid var(--border); }
        .card-header { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 700; margin-bottom: 20px; color: #334155; }
        
        /* STATUS */
        .status-box { padding: 20px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 20px; }
        .status-val { font-size: 24px; font-weight: 800; margin-top: 8px; }
        
        /* UPLOAD */
        .upload-zone {
          border: 2px dashed #cbd5e1; border-radius: 12px; padding: 30px; text-align: center;
          background: #f8fafc; cursor: pointer; transition: 0.2s; margin-bottom: 15px;
        }
        .upload-zone:hover { border-color: var(--primary); background: #f1f5f9; }
        .btn-primary { width: 100%; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .btn-primary:disabled { opacity: 0.7; }

        /* LISTS */
        .list-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
        .list-item:last-child { border: none; }
        .announcement { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 8px; margin-bottom: 15px; }

        /* FORMS */
        .input-group { margin-bottom: 15px; }
        .label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #475569; }
        .input { width: 100%; padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; }

        @media (max-width: 1024px) { .sidebar { position: fixed; } .main-wrapper { margin-left: 0; } }
      `}</style>

      {/* --- SIDEBAR --- */}
      <div className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
        <div className="logo-area">
          <div className="logo-icon"><FaUserGraduate/></div>
          <div><h3 style={{margin:0, fontSize:18}}>COTHM</h3><span style={{fontSize:12, opacity:0.7}}>Student Portal</span></div>
        </div>
        
        <div className="nav-links">
          {['Dashboard', 'Resources', 'Settings'].map(tab => (
            <div 
              key={tab} 
              className={`nav-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Dashboard' && <FaUserGraduate/>}
              {tab === 'Resources' && <FaFolderOpen/>}
              {tab === 'Settings' && <FaCog/>}
              {tab}
            </div>
          ))}
        </div>

        <div className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt/> Logout
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className={`main-wrapper ${isSidebarOpen ? '' : 'full'}`}>
        
        {/* Top Navbar */}
        <div className="navbar">
          <div style={{cursor:'pointer', color:'#64748b'}} onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <FaTimes size={20}/> : <FaBars size={20}/>}
          </div>
          
          <div style={{display:'flex', alignItems:'center'}}>
            {/* Notification Bell */}
            <div className="bell-container" onClick={() => setShowNotif(!showNotif)}>
              <FaBell size={20} color="#64748b"/>
              {data.notifications.filter(n => !n.read).length > 0 && 
                <span className="badge">{data.notifications.filter(n => !n.read).length}</span>
              }
              {/* Dropdown */}
              {showNotif && (
                <div className="dropdown">
                  <div style={{padding:'15px', fontWeight:'700', background:'#f8fafc', borderBottom:'1px solid #e2e8f0'}}>Notifications</div>
                  {data.notifications.length === 0 ? <div style={{padding:20, textAlign:'center', color:'#94a3b8'}}>No notifications</div> :
                    data.notifications.map((n, i) => (
                      <div key={i} className="notif-item">
                        <div>{n.message}</div>
                        <span className="notif-time">{new Date(n.date).toLocaleDateString()}</span>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div style={{textAlign:'right', marginRight:15}}>
              <div style={{fontWeight:'600', fontSize:14}}>{user.firstName} {user.lastName}</div>
              <div style={{fontSize:11, color:'#64748b'}}>Batch {user.batchNumber || "N/A"}</div>
            </div>
            <div style={{width:40, height:40, background:'#3b82f6', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'700'}}>
              {user.firstName.charAt(0)}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="content">
          
          {/* DEADLINE BANNER */}
          {daysLeft !== null && daysLeft > 0 && (
            <div style={{background:'#fff7ed', border:'1px solid #ffedd5', color:'#c2410c', padding:15, borderRadius:12, marginBottom:25, display:'flex', alignItems:'center', gap:10, fontWeight:'600'}}>
              <FaCalendarCheck/> Final Submission Deadline: {daysLeft} Days Remaining ({data.deadline?.toLocaleDateString()})
            </div>
          )}

          {/* === DASHBOARD TAB === */}
          {activeTab === 'Dashboard' && (
            <div className="grid">
              
              {/* Left Column */}
              <div>
                <div className="card" style={{marginBottom:25}}>
                  <div className="card-header"><FaBullhorn color="#1e3c72"/> Announcements</div>
                  {data.announcements.length === 0 ? <p style={{color:'#94a3b8'}}>No updates yet.</p> :
                    data.announcements.map(a => (
                      <div key={a._id} className="announcement">
                        <strong style={{color:'#1e3c72'}}>{a.title}</strong>
                        <p style={{margin:'5px 0', fontSize:14}}>{a.message}</p>
                        <span style={{fontSize:11, color:'#64748b'}}>{new Date(a.date).toLocaleDateString()}</span>
                      </div>
                    ))
                  }
                </div>

                <div className="card">
                  <div className="card-header"><FaClock color="#1e3c72"/> Project Status</div>
                  {data.project ? (
                    <>
                      <div className="status-box" style={{background: statusStyle.bg, color: statusStyle.text}}>
                        {statusStyle.icon}
                        <div className="status-val">{data.project.status}</div>
                      </div>
                      {data.project.feedback && (
                        <div style={{background:'#f8fafc', padding:15, borderRadius:8, borderLeft:'4px solid #1e3c72'}}>
                          <div style={{fontWeight:700, fontSize:12, color:'#1e3c72', marginBottom:5}}>FEEDBACK</div>
                          <div style={{fontStyle:'italic', color:'#334155'}}>{data.project.feedback}</div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="status-box" style={{background:'#f1f5f9', color:'#64748b'}}>
                      <div>Not Started</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div>
                <div className="card">
                  <div className="card-header"><FaCloudUploadAlt color="#1e3c72"/> Submit Work</div>
                  <form onSubmit={handleSubmit}>
                    <div style={{marginBottom:15}}>
                      <label className="label">Submission Stage</label>
                      <select className="input" value={uploadStage} onChange={e=>setUploadStage(e.target.value)}>
                        <option value="">Select Stage</option><option>Proposal</option><option>Chapter 1</option><option>Final Thesis</option>
                      </select>
                    </div>
                    
                    <div className="upload-zone">
                      <input type="file" id="file" style={{display:'none'}} onChange={e=>setFile(e.target.files[0])}/>
                      <label htmlFor="file" style={{cursor:'pointer', width:'100%', display:'block'}}>
                        <FaCloudUploadAlt size={30} color="#94a3b8" style={{marginBottom:10}}/>
                        <div style={{fontWeight:600}}>{file ? file.name : "Click to Upload File"}</div>
                        <div style={{fontSize:12, color:'#94a3b8'}}>PDF, DOCX (Max 10MB)</div>
                      </label>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                      {loading ? "Uploading..." : "Submit for Review"}
                    </button>
                  </form>

                  {data.project?.submissions?.length > 0 && (
                    <div style={{marginTop:30}}>
                      <div className="card-header" style={{fontSize:16}}><FaHistory/> Submission History</div>
                      {data.project.submissions.slice().reverse().map((s, i) => (
                        <div key={i} className="list-item">
                          <div style={{display:'flex', gap:10, alignItems:'center'}}>
                            <FaCheckCircle color="#10b981"/>
                            <div>
                              <div style={{fontWeight:600, fontSize:14}}>{s.stage}</div>
                              <div style={{fontSize:11, color:'#94a3b8'}}>{new Date(s.date).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <a href={s.fileUrl} target="_blank" rel="noreferrer" style={{color:'#3b82f6', textDecoration:'none', fontWeight:600, fontSize:13}}>View</a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* === RESOURCES TAB === */}
          {activeTab === 'Resources' && (
            <div className="card">
              <div className="card-header"><FaFolderOpen color="#1e3c72"/> Document Library</div>
              <div className="grid">
                {data.resources.length === 0 ? <p style={{color:'#94a3b8'}}>No resources available.</p> : 
                  data.resources.map(r => (
                    <div key={r._id} style={{padding:15, border:'1px solid #e2e8f0', borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <div style={{display:'flex', gap:12, alignItems:'center'}}>
                        <div style={{width:40, height:40, background:'#e0f2fe', color:'#0284c7', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center'}}><FaFilePdf/></div>
                        <div>
                          <div style={{fontWeight:700, color:'#334155'}}>{r.title}</div>
                          <div style={{fontSize:11, background:'#f1f5f9', padding:'2px 6px', borderRadius:4, display:'inline-block'}}>{r.category}</div>
                        </div>
                      </div>
                      <a href={r.fileUrl} target="_blank" rel="noreferrer" style={{padding:'8px 15px', background:'white', border:'1px solid #e2e8f0', borderRadius:6, color:'#334155', textDecoration:'none', fontWeight:600, fontSize:13, display:'flex', gap:6, alignItems:'center'}}>
                        <FaDownload/> Download
                      </a>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* === SETTINGS TAB === */}
          {activeTab === 'Settings' && (
            <div className="card" style={{maxWidth:600, margin:'0 auto'}}>
              <div className="card-header"><FaCog color="#1e3c72"/> Profile Settings</div>
              <form onSubmit={handleUpdateProfile}>
                <div className="grid" style={{marginBottom:15}}>
                  <div className="input-group">
                    <label className="label">First Name</label>
                    <input className="input" value={profile.firstName} onChange={e=>setProfile({...profile, firstName:e.target.value})}/>
                  </div>
                  <div className="input-group">
                    <label className="label">Last Name</label>
                    <input className="input" value={profile.lastName} onChange={e=>setProfile({...profile, lastName:e.target.value})}/>
                  </div>
                </div>
                <div className="input-group" style={{marginBottom:25}}>
                  <label className="label">New Password (Optional)</label>
                  <input className="input" type="password" placeholder="Leave blank to keep current password" value={profile.password} onChange={e=>setProfile({...profile, password:e.target.value})}/>
                </div>
                <button className="btn-primary" style={{width:'auto', padding:'12px 25px'}}>Update Profile</button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PortalDashboard;
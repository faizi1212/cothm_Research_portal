import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaFileUpload, FaCheckCircle, FaExclamationCircle, FaClock, 
  FaUserGraduate, FaBars, FaTimes, FaCloudUploadAlt, FaHistory, 
  FaBullhorn, FaFolderOpen, FaDownload, FaCalendarCheck, FaCog, 
  FaBell, FaSignOutAlt, FaFilePdf, FaMoon, FaSun, FaTasks, FaTrash, FaSpinner
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// --- SKELETON COMPONENT (For Loading) ---
const Skeleton = ({ height, width, style }) => (
  <div style={{
    height: height || '20px', 
    width: width || '100%', 
    background: 'linear-gradient(90deg, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '8px',
    marginBottom: '10px',
    ...style
  }}></div>
);

const PortalDashboard = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [data, setData] = useState({ project: null, announcements: [], resources: [], deadline: null, notifications: [] });
  const [tasks, setTasks] = useState([]);
  const [daysLeft, setDaysLeft] = useState(null);
  
  // Upload & Drag-Drop State
  const [file, setFile] = useState(null);
  const [uploadStage, setUploadStage] = useState("");
  const [loading, setLoading] = useState(true); // Initial load
  const [uploading, setUploading] = useState(false); // File upload state
  const [isDragging, setIsDragging] = useState(false); // Drag hover state
  
  // UI State
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [profile, setProfile] = useState({ firstName: "", lastName: "", password: "" });
  const [newTask, setNewTask] = useState("");

  const API_URL = "https://cothm-research-portal.onrender.com";
  const user = JSON.parse(localStorage.getItem("user")) || { firstName: "Student", lastName: "" };
  const navigate = useNavigate();

  // --- INITIAL LOAD ---
  useEffect(() => { 
    if(!user.email) navigate("/login");
    setProfile({ firstName: user.firstName, lastName: user.lastName, password: "" });
    fetchAllData(); 
    fetchTasks();
    if (window.innerWidth < 1024) setSidebarOpen(false);
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const fetchAllData = async () => {
    try {
      const [p, a, r, s, n] = await Promise.all([
        axios.get(`${API_URL}/api/projects/my-projects?email=${user.email}`),
        axios.get(`${API_URL}/api/announcements`),
        axios.get(`${API_URL}/api/resources`),
        axios.get(`${API_URL}/api/settings`),
        axios.get(`${API_URL}/api/notifications?email=${user.email}`)
      ]);
      if (s.data.deadline) setDaysLeft(Math.ceil((new Date(s.data.deadline) - new Date()) / (1000 * 60 * 60 * 24)));
      setData({ project: p.data[0] || null, announcements: a.data, resources: r.data, deadline: s.data.deadline ? new Date(s.data.deadline) : null, notifications: n.data });
    } catch (err) { console.error("Error loading data", err); }
    finally { setLoading(false); }
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks?email=${user.email}`);
      setTasks(res.data);
    } catch(err) { console.error(err); }
  };

  // --- DRAG & DROP HANDLERS ---
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // --- ACTIONS ---
  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const addTask = async () => {
    if(!newTask.trim()) return;
    const res = await axios.post(`${API_URL}/api/tasks`, { studentEmail: user.email, title: newTask, status: "To Do" });
    setTasks([res.data, ...tasks]); setNewTask("");
  };

  const moveTask = async (id, currentStatus) => {
    const nextStatus = currentStatus === "To Do" ? "In Progress" : "Done";
    if (currentStatus === "Done") return;
    await axios.put(`${API_URL}/api/tasks/${id}`, { status: nextStatus });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    if(!window.confirm("Delete task?")) return;
    await axios.delete(`${API_URL}/api/tasks/${id}`);
    fetchTasks();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !uploadStage) return alert("Select file & stage");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file); fd.append("studentEmail", user.email);
      fd.append("studentName", `${user.firstName} ${user.lastName}`);
      fd.append("stage", uploadStage); fd.append("batchNumber", user.batchNumber);
      await axios.post(`${API_URL}/api/submit`, fd);
      alert("✅ Submitted!"); setFile(null); fetchAllData();
    } catch (err) { alert("Failed"); } finally { setUploading(false); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/auth/update-profile`, { email: user.email, ...profile });
      alert("✅ Updated!");
    } catch(err) { alert("Failed"); }
  };

  const handleLogout = () => { localStorage.removeItem("user"); navigate("/login"); };

  // --- UI HELPERS ---
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="portal-layout">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        :root {
          --primary: #1e3c72; --bg: #f1f5f9; --sidebar: #0f172a; --surface: #ffffff; --text: #1e293b; --text-light: #64748b; --border: #e2e8f0;
        }
        [data-theme='dark'] {
          --primary: #60a5fa; --bg: #0f172a; --sidebar: #020617; --surface: #1e293b; --text: #f8fafc; --text-light: #94a3b8; --border: #334155;
        }
        
        body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); transition: 0.3s; }
        .portal-layout { display: flex; min-height: 100vh; overflow-x: hidden; }
        
        .sidebar { width: 260px; background: var(--sidebar); color: white; position: fixed; height: 100vh; z-index: 50; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; transition: 0.3s; }
        .sidebar.closed { transform: translateX(-100%); }
        .logo-area { display: flex; align-items: center; gap: 12px; padding-bottom: 20px; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .logo-icon { width: 40px; height: 40px; background: #3b82f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 15px; border-radius: 8px; color: rgba(255,255,255,0.7); cursor: pointer; transition: 0.2s; margin-bottom: 5px; font-weight: 500; }
        .nav-item:hover, .nav-item.active { background: rgba(255,255,255,0.1); color: white; }
        .nav-item.active { background: #3b82f6; }
        .logout-btn { margin-top: auto; padding: 12px; background: rgba(239, 68, 68, 0.15); color: #fca5a5; border-radius: 8px; cursor: pointer; text-align: center; font-weight: 600; display: flex; justify-content: center; gap: 8px; align-items: center; }
        
        .main-wrapper { flex: 1; margin-left: 260px; transition: margin 0.3s ease; width: 100%; display: flex; flex-direction: column; }
        .main-wrapper.full { margin-left: 0; }
        
        .navbar { background: var(--surface); padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 20px rgba(0,0,0,0.03); position: sticky; top: 0; z-index: 40; transition: background 0.3s; }
        .icon-btn { cursor: pointer; color: var(--text-light); font-size: 20px; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; transition: 0.2s; }
        .icon-btn:hover { background: rgba(0,0,0,0.05); color: var(--text); }
        .dropdown { position: absolute; top: 60px; right: 20px; width: 300px; background: var(--surface); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); border: 1px solid var(--border); overflow: hidden; z-index: 100; }
        
        .content { padding: 30px; max-width: 1200px; margin: 0 auto; width: 100%; box-sizing: border-box; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px; }
        .card { background: var(--surface); border-radius: 16px; padding: 25px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid var(--border); transition: 0.3s; }
        .card-header { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 700; margin-bottom: 20px; color: var(--text); }
        
        /* DRAG & DROP ZONE */
        .upload-zone { 
          border: 2px dashed var(--border); border-radius: 12px; padding: 40px; text-align: center; 
          background: rgba(0,0,0,0.02); cursor: pointer; transition: 0.3s; margin-bottom: 15px; position: relative;
        }
        .upload-zone.drag-active { border-color: #3b82f6; background: rgba(59, 130, 246, 0.05); transform: scale(1.02); }
        .upload-zone:hover { border-color: var(--primary); }
        
        .btn-primary { width: 100%; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 8px; }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .input { width: 100%; padding: 10px 12px; border: 1px solid var(--border); background: var(--surface); color: var(--text); border-radius: 8px; box-sizing: border-box; }
        
        /* KANBAN */
        .kanban-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; overflow-x: auto; }
        .kanban-col { background: rgba(0,0,0,0.03); padding: 15px; border-radius: 12px; min-height: 400px; border: 1px solid var(--border); }
        .kanban-title { font-weight: 700; margin-bottom: 15px; color: var(--text-light); text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
        .task-card { background: var(--surface); padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid var(--border); box-shadow: 0 2px 4px rgba(0,0,0,0.02); cursor: pointer; position: relative; }
        .task-card:hover { transform: translateY(-2px); border-color: var(--primary); }
        .task-actions { position: absolute; top: 10px; right: 10px; display: none; gap: 5px; }
        .task-card:hover .task-actions { display: flex; }
        
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        
        @media (max-width: 1024px) { .sidebar { position: fixed; } .main-wrapper { margin-left: 0; } .kanban-board { grid-template-columns: 1fr; } }
      `}</style>

      {/* SIDEBAR */}
      <div className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
        <div className="logo-area"><div className="logo-icon"><FaUserGraduate/></div><div><h3 style={{margin:0}}>COTHM</h3><span style={{fontSize:12, opacity:0.7}}>Student Portal</span></div></div>
        <div className="nav-links">
          {['Dashboard', 'Tasks', 'Resources', 'Settings'].map(tab => (
            <div key={tab} className={`nav-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab === 'Dashboard' && <FaUserGraduate/>} {tab === 'Tasks' && <FaTasks/>} {tab === 'Resources' && <FaFolderOpen/>} {tab === 'Settings' && <FaCog/>} {tab}
            </div>
          ))}
        </div>
        <div className="logout-btn" onClick={handleLogout}><FaSignOutAlt/> Logout</div>
      </div>

      {/* MAIN */}
      <div className={`main-wrapper ${isSidebarOpen ? '' : 'full'}`}>
        <div className="navbar">
          <div className="icon-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>{isSidebarOpen ? <FaTimes/> : <FaBars/>}</div>
          <div style={{display:'flex', alignItems:'center', gap: 15}}>
            <div className="icon-btn" onClick={toggleTheme}>{darkMode ? <FaSun/> : <FaMoon/>}</div>
            <div className="bell-container" onClick={() => setShowNotif(!showNotif)}>
              <FaBell size={20} color={darkMode ? '#94a3b8' : '#64748b'}/>
              {data.notifications.filter(n => !n.read).length > 0 && <span className="badge">{data.notifications.filter(n => !n.read).length}</span>}
              {showNotif && (
                <div className="dropdown">
                  <div style={{padding:'15px', fontWeight:'700', borderBottom:'1px solid var(--border)'}}>Notifications</div>
                  {data.notifications.length === 0 ? <div style={{padding:20, textAlign:'center', color:'gray'}}>No notifications</div> : data.notifications.map((n, i) => <div key={i} style={{padding:15, borderBottom:'1px solid var(--border)', fontSize:13}}>{n.message}</div>)}
                </div>
              )}
            </div>
            <div style={{fontWeight:'600', fontSize:14}}>{user.firstName} {user.lastName}</div>
          </div>
        </div>

        <div className="content">
          <h2 className="page-title">{getGreeting()}, {user.firstName} 👋</h2>
          <p className="page-sub">Here is what's happening with your research today.</p>

          {daysLeft !== null && daysLeft > 0 && <div style={{background:'#fff7ed', border:'1px solid #ffedd5', color:'#c2410c', padding:15, borderRadius:12, marginBottom:25, display:'flex', alignItems:'center', gap:10, fontWeight:'600'}}><FaCalendarCheck/> Final Submission Deadline: {daysLeft} Days Remaining ({data.deadline?.toLocaleDateString()})</div>}

          {/* LOADING SKELETONS */}
          {loading ? (
            <div className="grid">
              <div className="card">
                <Skeleton height="30px" width="60%"/>
                <Skeleton height="150px"/>
              </div>
              <div className="card">
                <Skeleton height="30px" width="40%"/>
                <Skeleton height="200px"/>
              </div>
            </div>
          ) : (
            <>
              {/* DASHBOARD */}
              {activeTab === 'Dashboard' && (
                <div className="grid">
                  <div>
                    <div className="card" style={{marginBottom:25}}>
                      <div className="card-header"><FaBullhorn/> Announcements</div>
                      {data.announcements.length === 0 ? <p style={{color:'var(--text-light)'}}>No updates yet.</p> : data.announcements.map(a => <div key={a._id} style={{background: darkMode ? '#1e293b' : '#eff6ff', padding:15, borderRadius:8, marginBottom:10}}><strong>{a.title}</strong><p style={{margin:'5px 0', fontSize:14}}>{a.message}</p></div>)}
                    </div>
                    <div className="card">
                      <div className="card-header"><FaClock/> Status</div>
                      <div style={{background: data.project?.status === 'Approved' ? '#dcfce7' : '#f1f5f9', color: data.project?.status === 'Approved' ? '#166534' : '#64748b', padding:20, borderRadius:12, textAlign:'center', fontSize:20, fontWeight:'800'}}>{data.project?.status || "Not Started"}</div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header"><FaCloudUploadAlt/> Submit Work</div>
                    <form onSubmit={handleSubmit}>
                      <select className="input" style={{marginBottom:15}} value={uploadStage} onChange={e=>setUploadStage(e.target.value)}><option value="">Select Stage</option><option>Proposal</option><option>Chapter 1</option><option>Final</option></select>
                      
                      {/* DRAG & DROP ZONE */}
                      <div 
                        className={`upload-zone ${isDragging ? 'drag-active' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        <input type="file" id="file" style={{display:'none'}} onChange={e=>setFile(e.target.files[0])}/>
                        <label htmlFor="file" style={{cursor:'pointer', width:'100%', display:'block'}}>
                          <FaCloudUploadAlt size={40} color={isDragging ? "#3b82f6" : "#94a3b8"} style={{marginBottom:15}}/>
                          <div style={{fontWeight:600, fontSize:16}}>{file ? file.name : "Drag & Drop or Click to Upload"}</div>
                          <div style={{fontSize:12, color:'var(--text-light)', marginTop:5}}>Supports PDF, DOCX (Max 10MB)</div>
                        </label>
                      </div>

                      <button className="btn-primary" disabled={uploading}>
                        {uploading ? <><FaSpinner className="spin"/> Uploading...</> : "Submit for Review"}
                      </button>
                    </form>
                    {data.project?.submissions?.length > 0 && <div style={{marginTop:20, maxHeight:200, overflowY:'auto'}}>{data.project.submissions.map((s,i)=><div key={i} style={{padding:10, borderBottom:'1px solid var(--border)', fontSize:13}}>{s.stage} - {new Date(s.date).toLocaleDateString()}</div>)}</div>}
                  </div>
                </div>
              )}

              {/* KANBAN */}
              {activeTab === 'Tasks' && (
                <div>
                  <div style={{marginBottom:20, display:'flex', gap:10}}>
                    <input className="input" placeholder="New Task..." value={newTask} onChange={e=>setNewTask(e.target.value)} style={{maxWidth:300}}/>
                    <button className="btn-primary" style={{width:'auto', padding:'0 25px'}} onClick={addTask}>Add</button>
                  </div>
                  <div className="kanban-board">
                    {["To Do", "In Progress", "Done"].map(status => (
                      <div key={status} className="kanban-col">
                        <div className="kanban-title">{status}</div>
                        {tasks.filter(t => t.status === status).map(t => (
                          <div key={t._id} className="task-card" onClick={() => moveTask(t._id, t.status)}>
                            {t.title}
                            <div className="task-actions"><FaTrash color="red" onClick={(e) => { e.stopPropagation(); deleteTask(t._id); }}/></div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RESOURCES */}
              {activeTab === 'Resources' && (
                <div className="card">
                  <div className="card-header"><FaFolderOpen/> Library</div>
                  <div className="grid">
                    {data.resources.map(r => (
                      <div key={r._id} style={{padding:15, border:'1px solid var(--border)', borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <div style={{display:'flex', gap:12, alignItems:'center'}}><FaFilePdf color="#e11d48" size={24}/><div><strong>{r.title}</strong><br/><span style={{fontSize:11}}>{r.category}</span></div></div>
                        <a href={r.fileUrl} target="_blank" rel="noreferrer"><FaDownload/></a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SETTINGS */}
              {activeTab === 'Settings' && (
                <div className="card" style={{maxWidth:500, margin:'0 auto'}}>
                  <div className="card-header"><FaCog/> Profile</div>
                  <form onSubmit={handleUpdateProfile}>
                    <div style={{marginBottom:15}}><label style={{fontSize:13, fontWeight:600}}>Name</label><input className="input" value={profile.firstName} onChange={e=>setProfile({...profile, firstName:e.target.value})}/></div>
                    <div style={{marginBottom:15}}><label style={{fontSize:13, fontWeight:600}}>Password</label><input className="input" type="password" placeholder="New Password" value={profile.password} onChange={e=>setProfile({...profile, password:e.target.value})}/></div>
                    <button className="btn-primary">Update</button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortalDashboard;
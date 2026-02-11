import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaFileUpload, FaCheckCircle, FaExclamationCircle, FaClock, 
  FaUserGraduate, FaBars, FaTimes, FaCloudUploadAlt, FaHistory, 
  FaBullhorn, FaFolderOpen, FaDownload, FaCalendarCheck, FaCog, 
  FaBell, FaSignOutAlt, FaFilePdf, FaMoon, FaSun, FaTasks, FaTrash, 
  FaSpinner, FaRobot, FaMagic, FaQuoteRight, FaCopy, 
  FaChartPie, FaFire, FaTrophy, FaChevronRight // <--- Added Modern Icons
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'; // <--- Visual Charts

// --- SKELETON COMPONENT ---
const Skeleton = ({ height, width }) => (
  <div style={{
    height: height || '20px', width: width || '100%', 
    background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
    backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '12px', marginBottom: '10px'
  }}></div>
);

const PortalDashboard = () => {
  // --- STATE (Unchanged) ---
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [data, setData] = useState({ project: null, announcements: [], resources: [], deadline: null, notifications: [] });
  const [tasks, setTasks] = useState([]);
  const [daysLeft, setDaysLeft] = useState(null);
  
  // Upload State
  const [file, setFile] = useState(null);
  const [uploadStage, setUploadStage] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // AI Tools State
  const [aiKeyword, setAiKeyword] = useState("");
  const [generatedTopics, setGeneratedTopics] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [citationData, setCitationData] = useState({ author: "", year: "", title: "", url: "" });
  const [generatedCitation, setGeneratedCitation] = useState("");

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

  const fetchTasks = async () => { try { const res = await axios.get(`${API_URL}/api/tasks?email=${user.email}`); setTasks(res.data); } catch(err) { console.error(err); } };

  // --- LOGIC ---
  const generateTopics = () => {
    if(!aiKeyword.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const templates = [
        `The Impact of ${aiKeyword} on Global Hospitality Standards`,
        `Optimizing ${aiKeyword} Strategies for Modern Tourism`,
        `A Case Study: ${aiKeyword} in Emerging Markets`,
        `Sustainability Practices in ${aiKeyword}`
      ];
      setGeneratedTopics(templates.sort(() => 0.5 - Math.random()).slice(0, 3));
      setIsGenerating(false);
    }, 1500);
  };

  const generateCitation = () => { if(citationData.author) setGeneratedCitation(`${citationData.author} (${citationData.year||"n.d."}). ${citationData.title}. Retrieved from ${citationData.url}`); };
  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); alert("Copied to clipboard! 📋"); };
  
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); };
  const toggleTheme = () => { setDarkMode(!darkMode); localStorage.setItem("theme", !darkMode ? "dark" : "light"); };
  
  const addTask = async () => { if(!newTask.trim()) return; const res = await axios.post(`${API_URL}/api/tasks`, { studentEmail: user.email, title: newTask, status: "To Do" }); setTasks([res.data, ...tasks]); setNewTask(""); };
  const moveTask = async (id, status) => { if(status === "Done") return; await axios.put(`${API_URL}/api/tasks/${id}`, { status: status === "To Do" ? "In Progress" : "Done" }); fetchTasks(); };
  const deleteTask = async (id) => { if(window.confirm("Delete?")) { await axios.delete(`${API_URL}/api/tasks/${id}`); fetchTasks(); } };
  
  const handleSubmit = async (e) => {
    e.preventDefault(); if (!file || !uploadStage) return alert("Select file & stage");
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("studentEmail", user.email); fd.append("studentName", `${user.firstName} ${user.lastName}`); fd.append("stage", uploadStage); fd.append("batchNumber", user.batchNumber);
      await axios.post(`${API_URL}/api/submit`, fd); alert("✅ Submitted!"); setFile(null); fetchAllData();
    } catch (err) { alert("Failed"); } finally { setUploading(false); }
  };

  const handleUpdateProfile = async (e) => { e.preventDefault(); try { await axios.put(`${API_URL}/api/auth/update-profile`, { email: user.email, ...profile }); alert("✅ Updated!"); } catch(err) { alert("Failed"); } };
  const handleLogout = () => { localStorage.removeItem("user"); navigate("/login"); };
  
  // Progress Logic for Ring Chart
  const getProgress = () => {
    if (data.project?.status === 'Approved') return 100;
    if (data.project?.submissions?.length > 2) return 75;
    if (data.project?.submissions?.length > 0) return 30;
    return 10;
  };
  const progressData = [{ name: 'Done', value: getProgress(), color: '#3b82f6' }, { name: 'Left', value: 100-getProgress(), color: 'rgba(255,255,255,0.1)' }];

  return (
    <div className="portal-layout">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        :root { --primary: #6366f1; --primary-glow: rgba(99, 102, 241, 0.4); --bg: #f8fafc; --surface: rgba(255,255,255,0.6); --text: #0f172a; --text-light: #64748b; --border: #e2e8f0; }
        [data-theme='dark'] { --primary: #818cf8; --primary-glow: rgba(129, 140, 248, 0.3); --bg: #0f172a; --surface: rgba(30, 41, 59, 0.6); --text: #f1f5f9; --text-light: #94a3b8; --border: #334155; }
        
        body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--text); transition: background 0.3s; overflow-x: hidden; }
        .portal-layout { display: flex; min-height: 100vh; position: relative; }
        .portal-layout::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at 10% 10%, var(--primary-glow) 0%, transparent 40%); pointer-events: none; z-index: 0; }

        /* GLASS SIDEBAR */
        .sidebar { 
          width: 280px; background: var(--surface); backdrop-filter: blur(20px); border-right: 1px solid var(--border);
          color: var(--text); position: fixed; height: 100vh; z-index: 50; display: flex; flex-direction: column; padding: 25px; box-sizing: border-box; 
        }
        .sidebar.closed { transform: translateX(-100%); }
        .nav-item { 
          display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: 12px; 
          color: var(--text-light); cursor: pointer; transition: 0.3s; margin-bottom: 8px; font-weight: 600; font-size: 14px;
        }
        .nav-item:hover { background: rgba(99, 102, 241, 0.1); color: var(--primary); transform: translateX(5px); }
        .nav-item.active { background: var(--primary); color: white; box-shadow: 0 4px 15px var(--primary-glow); }

        /* MAIN AREA */
        .main-wrapper { flex: 1; margin-left: 280px; transition: margin 0.3s ease; padding: 30px; position: relative; z-index: 1; }
        .main-wrapper.full { margin-left: 0; }
        .navbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        
        /* BENTO GRID SYSTEM */
        .bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; }
        .bento-card { 
          background: var(--surface); backdrop-filter: blur(16px); border: 1px solid var(--border);
          border-radius: 24px; padding: 25px; transition: 0.3s; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
          position: relative; overflow: hidden; display: flex; flexDirection: column;
        }
        .bento-card:hover { transform: translateY(-5px); border-color: var(--primary); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.2); }
        .card-lg { grid-column: span 2; }
        .card-sm { grid-column: span 1; }
        .card-full { grid-column: span 3; }

        /* WIDGET STYLES */
        .card-title { font-size: 16px; fontWeight: 700; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; color: var(--text); }
        .stat-circle { position: relative; width: 120px; height: 120px; margin: 0 auto; }
        .stat-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 24px; font-weight: 800; }
        
        /* UPLOAD ZONE */
        .upload-zone { 
          border: 2px dashed var(--border); border-radius: 16px; padding: 40px; text-align: center; 
          background: rgba(255,255,255,0.02); cursor: pointer; transition: 0.3s; position: relative; flex: 1;
        }
        .upload-zone:hover, .upload-zone.drag-active { border-color: var(--primary); background: rgba(99, 102, 241, 0.05); }
        
        .btn-glow { 
          width: 100%; padding: 14px; background: linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%); 
          color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; justify-content: center; gap: 8px;
          box-shadow: 0 4px 15px var(--primary-glow); transition: 0.3s;
        }
        .btn-glow:hover { transform: translateY(-2px); box-shadow: 0 8px 25px var(--primary-glow); }
        .inp { width: 100%; padding: 14px; border: 2px solid var(--border); background: rgba(255,255,255,0.05); color: var(--text); border-radius: 12px; box-sizing: border-box; }
        
        /* AI RESULTS */
        .ai-pill { background: rgba(99, 102, 241, 0.1); padding: 12px 16px; border-radius: 12px; margin-top: 10px; border: 1px solid var(--primary); color: var(--primary); font-size: 13px; cursor: pointer; transition: 0.2s; }
        .ai-pill:hover { background: var(--primary); color: white; }

        @media (max-width: 1024px) { .sidebar { position: fixed; } .main-wrapper { margin-left: 0; } .bento-grid { grid-template-columns: 1fr; } .card-lg, .card-full { grid-column: span 1; } }
      `}</style>

      {/* SIDEBAR */}
      <div className={`sidebar ${isSidebarOpen ? '' : 'closed'}`}>
        <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:40, paddingBottom:20, borderBottom:'1px solid var(--border)'}}>
          <div style={{width:40, height:40, background:'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:20}}><FaUserGraduate/></div>
          <div><h3 style={{margin:0, fontSize:18}}>COTHM</h3><span style={{fontSize:12, opacity:0.7}}>Student Portal</span></div>
        </div>
        <div style={{flex:1}}>
          {['Dashboard', 'Tasks', 'AI Tools', 'Resources', 'Settings'].map(tab => (
            <div key={tab} className={`nav-item ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab === 'Dashboard' && <FaUserGraduate/>} 
              {tab === 'Tasks' && <FaTasks/>} 
              {tab === 'AI Tools' && <FaRobot/>} 
              {tab === 'Resources' && <FaFolderOpen/>} 
              {tab === 'Settings' && <FaCog/>} 
              {tab}
            </div>
          ))}
        </div>
        
        {/* GAMIFICATION BADGE */}
        <div style={{background: 'rgba(255,255,255,0.05)', padding:15, borderRadius:16, border:'1px solid var(--border)', marginBottom:20}}>
          <div style={{display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:8, color:'var(--text-light)'}}><span><FaTrophy style={{color:'#f59e0b'}}/> Scholar Level</span><span>Lvl 3</span></div>
          <div style={{height:6, background:'rgba(0,0,0,0.2)', borderRadius:10, overflow:'hidden'}}><div style={{width:'70%', height:'100%', background:'#f59e0b'}}></div></div>
        </div>

        <div onClick={handleLogout} className="nav-item" style={{color:'#ef4444', background:'rgba(239, 68, 68, 0.1)', justifyContent:'center'}}><FaSignOutAlt/> Logout</div>
      </div>

      {/* MAIN */}
      <div className={`main-wrapper ${isSidebarOpen ? '' : 'full'}`}>
        <div className="navbar">
          <div style={{display:'flex', gap:15, alignItems:'center'}}>
            <div className="icon-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}><FaBars size={20} color="var(--text)"/></div>
            <div><h1 style={{margin:0, fontSize:24}}>Welcome, {user.firstName} 👋</h1><p style={{margin:0, fontSize:14, color:'var(--text-light)'}}>Here is your academic overview.</p></div>
          </div>
          <div style={{display:'flex', gap:15}}>
            <div onClick={toggleTheme} style={{padding:10, background:'var(--surface)', borderRadius:'50%', cursor:'pointer', border:'1px solid var(--border)'}}>{darkMode?<FaSun color="#f59e0b"/>:<FaMoon color="#6366f1"/>}</div>
            <div style={{padding:10, background:'var(--surface)', borderRadius:'50%', cursor:'pointer', border:'1px solid var(--border)', position:'relative'}}><FaBell color="var(--text)"/><span style={{position:'absolute', top:0, right:0, width:10, height:10, background:'#ef4444', borderRadius:'50%', border:'2px solid var(--bg)'}}></span></div>
          </div>
        </div>

        <div className="content">
          {loading ? <Skeleton height="200px"/> : (
            <>
              {/* --- DASHBOARD TAB --- */}
              {activeTab === 'Dashboard' && (
                <div className="bento-grid">
                  {/* 1. PROGRESS WIDGET */}
                  <div className="bento-card card-sm" style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                    <div className="card-title" style={{width:'100%'}}><FaChartPie color="#3b82f6"/> Thesis Progress</div>
                    <div className="stat-circle">
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie data={progressData} innerRadius={40} outerRadius={55} dataKey="value" startAngle={90} endAngle={-270}><Cell fill="#6366f1"/><Cell fill="var(--border)"/></Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="stat-text">{getProgress()}%</div>
                    </div>
                    <div style={{fontSize:12, color:'var(--text-light)', marginTop:10}}>{data.project?.status || "Not Started"}</div>
                  </div>

                  {/* 2. DEADLINE & ANNOUNCEMENTS */}
                  <div className="bento-card card-lg" style={{display:'flex', flexDirection:'column'}}>
                    <div style={{display:'flex', gap:20, height:'100%'}}>
                      <div style={{flex:1, background: darkMode?'rgba(239, 68, 68, 0.1)':'#fee2e2', borderRadius:16, padding:20, color:'#ef4444', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <FaClock size={30} style={{marginBottom:10}}/>
                        <div style={{fontSize:32, fontWeight:800}}>{daysLeft || 0}</div>
                        <div style={{fontSize:12, textTransform:'uppercase', fontWeight:700}}>Days Remaining</div>
                      </div>
                      <div style={{flex:1.5, overflowY:'auto'}}>
                        <div className="card-title"><FaBullhorn color="#f59e0b"/> Updates</div>
                        {data.announcements.length === 0 ? <p style={{fontSize:13, color:'var(--text-light)'}}>No updates.</p> : data.announcements.map(a => (
                          <div key={a._id} style={{fontSize:13, marginBottom:10, paddingBottom:10, borderBottom:'1px solid var(--border)'}}>
                            <div style={{fontWeight:700}}>{a.title}</div>
                            <div style={{color:'var(--text-light)', marginTop:2}}>{a.message}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3. UPLOAD ZONE */}
                  <div className="bento-card card-lg">
                    <div className="card-title"><FaCloudUploadAlt color="#10b981"/> Submission Hub</div>
                    <form onSubmit={handleSubmit} style={{display:'flex', gap:20, height:'100%'}}>
                      <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                        <select className="inp" style={{marginBottom:15}} value={uploadStage} onChange={e=>setUploadStage(e.target.value)}><option value="">Select Stage</option><option>Proposal</option><option>Chapter 1</option><option>Final</option></select>
                        <button className="btn-glow" disabled={uploading}>{uploading ? <FaSpinner className="spin"/> : "Submit Work"}</button>
                      </div>
                      <div className={`upload-zone ${isDragging ? 'drag-active' : ''}`} onDragOver={handleDragOver} onDragLeave={e=>{e.preventDefault(); setIsDragging(false)}} onDrop={handleDrop}>
                        <input type="file" id="file" style={{display:'none'}} onChange={e=>setFile(e.target.files[0])}/>
                        <label htmlFor="file" style={{cursor:'pointer', width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                          <FaCloudUploadAlt size={30} color={isDragging?'#3b82f6':'var(--text-light)'} style={{marginBottom:10}}/>
                          <div style={{fontWeight:600}}>{file ? file.name : "Drag & Drop File Here"}</div>
                          <div style={{fontSize:12, color:'var(--text-light)'}}>PDF, DOCX (Max 10MB)</div>
                        </label>
                      </div>
                    </form>
                  </div>

                  {/* 4. AI QUICK ACCESS */}
                  <div className="bento-card card-sm" style={{background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)'}}>
                    <div className="card-title"><FaMagic color="#a855f7"/> AI Helper</div>
                    <p style={{fontSize:13, color:'var(--text-light)', marginBottom:15}}>Stuck on ideas? Use our AI tools to boost productivity.</p>
                    <button className="btn-glow" style={{background:'var(--surface)', color:'var(--text)', border:'1px solid var(--border)', boxShadow:'none'}} onClick={()=>setActiveTab('AI Tools')}>Open AI Tools <FaChevronRight/></button>
                  </div>
                </div>
              )}

              {/* --- AI TOOLS TAB --- */}
              {activeTab === 'AI Tools' && (
                <div className="bento-grid">
                  <div className="bento-card card-lg">
                    <div className="card-title"><FaRobot color="#3b82f6"/> Thesis Topic Generator</div>
                    <div style={{display:'flex', gap:10, marginBottom:20}}>
                      <input className="inp" placeholder="Enter keywords (e.g. Tourism, AI...)" value={aiKeyword} onChange={e=>setAiKeyword(e.target.value)}/>
                      <button className="btn-glow" style={{width:'auto', padding:'0 30px'}} onClick={generateTopics} disabled={isGenerating}>{isGenerating?"...":"Generate"}</button>
                    </div>
                    {generatedTopics.map((t, i) => (
                      <div key={i} className="ai-pill" onClick={() => copyToClipboard(t)}><FaCopy style={{marginRight:8}}/> {t}</div>
                    ))}
                  </div>
                  <div className="bento-card card-sm">
                    <div className="card-title"><FaQuoteRight color="#10b981"/> Citation Builder</div>
                    <input className="inp" placeholder="Author" style={{marginBottom:10}} onChange={e=>setCitationData({...citationData, author:e.target.value})}/>
                    <input className="inp" placeholder="Title" style={{marginBottom:10}} onChange={e=>setCitationData({...citationData, title:e.target.value})}/>
                    <button className="btn-glow" onClick={generateCitation}>Format (APA)</button>
                    {generatedCitation && <div className="ai-pill" onClick={()=>copyToClipboard(generatedCitation)} style={{fontStyle:'italic'}}>"{generatedCitation}"</div>}
                  </div>
                </div>
              )}

              {/* --- TASKS TAB (Kanban) --- */}
              {activeTab === 'Tasks' && (
                <div className="bento-grid">
                  {["To Do", "In Progress", "Done"].map(s => (
                    <div key={s} className="bento-card" style={{minHeight:400, background: 'rgba(255,255,255,0.03)'}}>
                      <div style={{fontSize:12, textTransform:'uppercase', letterSpacing:1, fontWeight:700, color:'var(--text-light)', marginBottom:15}}>{s}</div>
                      {tasks.filter(t=>t.status===s).map(t=>(
                        <div key={t._id} onClick={()=>moveTask(t._id,t.status)} style={{background:'var(--surface)', padding:15, borderRadius:12, marginBottom:10, border:'1px solid var(--border)', cursor:'pointer', position:'relative'}}>
                          {t.title}
                          <FaTrash style={{position:'absolute', right:10, top:18, color:'#ef4444', fontSize:12}} onClick={(e)=>{e.stopPropagation();deleteTask(t._id)}}/>
                        </div>
                      ))}
                      {s==="To Do" && <div style={{marginTop:15, display:'flex', gap:5}}><input className="inp" style={{padding:8}} placeholder="+ New Task" value={newTask} onChange={e=>setNewTask(e.target.value)}/><button className="btn-glow" style={{width:'auto'}} onClick={addTask}>Add</button></div>}
                    </div>
                  ))}
                </div>
              )}

              {/* --- RESOURCES TAB --- */}
              {activeTab === 'Resources' && (
                <div className="bento-card card-full">
                  <div className="card-title"><FaFolderOpen color="#f59e0b"/> Digital Library</div>
                  <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:20}}>
                    {data.resources.map(r => (
                      <div key={r._id} style={{padding:20, border:'1px solid var(--border)', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--bg)'}}>
                        <div style={{display:'flex', gap:12, alignItems:'center'}}><FaFilePdf color="#ef4444" size={24}/><div><div style={{fontWeight:600}}>{r.title}</div><div style={{fontSize:12, color:'var(--text-light)'}}>{r.category}</div></div></div>
                        <a href={r.fileUrl} target="_blank" rel="noreferrer" style={{color:'var(--text-light)'}}><FaDownload/></a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- SETTINGS TAB --- */}
              {activeTab === 'Settings' && (
                <div className="bento-card card-sm" style={{margin:'0 auto'}}>
                  <div className="card-title"><FaCog/> Profile Settings</div>
                  <form onSubmit={handleUpdateProfile}>
                    <input className="inp" style={{marginBottom:15}} value={profile.firstName} onChange={e=>setProfile({...profile, firstName:e.target.value})}/>
                    <input className="inp" style={{marginBottom:15}} type="password" placeholder="New Password" value={profile.password} onChange={e=>setProfile({...profile, password:e.target.value})}/>
                    <button className="btn-glow">Update Profile</button>
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
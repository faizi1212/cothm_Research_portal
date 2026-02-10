import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaUserGraduate, FaCheckCircle, FaTimesCircle, FaClock, FaFilePdf, FaSearch, 
  FaSignOutAlt, FaSync, FaTimes, FaExternalLinkAlt, FaChevronRight, FaBullhorn, 
  FaCalendarAlt, FaFolderOpen, FaTrash, FaUpload, FaChartPie, FaFileDownload, 
  FaBell, FaUsers, FaMoon, FaSun, FaBolt, FaCircle // <--- New Icons
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  // --- STATE ---
  const [data, setData] = useState({ projects: [], announcements: [], resources: [], notifications: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview"); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [inputs, setInputs] = useState({ title: "", message: "", deadline: "", resTitle: "", resCat: "Guidelines", resFile: null });

  const navigate = useNavigate();
  const API_URL = "https://cothm-research-portal.onrender.com";

  // --- MOCK ACTIVITY FEED ---
  const activityFeed = [
    { text: "Sarah submitted 'Final Thesis'", time: "2m ago", color: "#3b82f6" },
    { text: "New Student: John Doe joined", time: "15m ago", color: "#10b981" },
    { text: "System Backup Completed", time: "1h ago", color: "#8b5cf6" },
    { text: "Deadline updated by Admin", time: "2h ago", color: "#f59e0b" },
  ];

  useEffect(() => { 
    fetchData(); 
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const fetchData = async () => {
    try {
      const [p, a, r, s, n] = await Promise.all([
        axios.get(`${API_URL}/api/projects/all`),
        axios.get(`${API_URL}/api/announcements`),
        axios.get(`${API_URL}/api/resources`),
        axios.get(`${API_URL}/api/settings`),
        axios.get(`${API_URL}/api/notifications?email=admin@cothm.edu.pk`)
      ]);
      setData({ projects: p.data, announcements: a.data, resources: r.data, notifications: n.data, deadline: s.data.deadline });
      if(s.data.deadline) setInputs(prev => ({...prev, deadline: s.data.deadline.split('T')[0]}));
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  // --- HELPERS ---
  const getStatusData = () => [
    { name: 'Approved', value: data.projects.filter(p=>p.status==='Approved').length, color: '#10b981' },
    { name: 'Pending', value: data.projects.filter(p=>p.status==='Pending Review').length, color: '#f59e0b' },
    { name: 'Rejected', value: data.projects.filter(p=>p.status==='Rejected').length, color: '#ef4444' }
  ];
  const getBatchData = () => {
    const b = {}; data.projects.forEach(p => b[p.batchNumber||"Unknown"] = (b[p.batchNumber||"Unknown"]||0)+1);
    return Object.keys(b).map(k => ({name: `Batch ${k}`, students: b[k]}));
  };
  const exportToCSV = () => {
    const csv = "Name,Email,Status,Batch\n" + data.projects.map(p => `${p.studentName},${p.studentEmail},${p.status},${p.batchNumber}`).join("\n");
    const link = document.createElement("a"); link.href = "data:text/csv;charset=utf-8," + encodeURI(csv); link.download = "report.csv"; link.click();
  };

  const handleUpdate = async (status) => { await axios.post(`${API_URL}/api/admin/update`, { email: selectedProject.studentEmail, status, comment: feedback }); alert(`Project ${status}`); fetchData(); setSelectedProject(null); };
  const postAnnouncement = async () => { await axios.post(`${API_URL}/api/announcements`, { title: inputs.title, message: inputs.message }); alert("Posted"); fetchData(); setInputs({...inputs, title:"", message:""}); };
  const setDeadline = async () => { await axios.post(`${API_URL}/api/settings`, { deadline: inputs.deadline }); alert("Deadline Updated"); };
  const uploadResource = async () => { const fd = new FormData(); fd.append("title", inputs.resTitle); fd.append("category", inputs.resCat); fd.append("file", inputs.resFile); await axios.post(`${API_URL}/api/resources`, fd); alert("Uploaded"); fetchData(); };
  const handleDelete = async (type, id) => { if(window.confirm("Delete?")) { await axios.delete(`${API_URL}/api/${type}/${id}`); fetchData(); } };
  const filteredProjects = data.projects.filter(p => p.studentName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="admin-layout">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        :root { --primary: #1e3c72; --bg: #f1f5f9; --sidebar: #0f172a; --surface: #ffffff; --text: #1e293b; --text-light: #64748b; --border: #e2e8f0; }
        [data-theme='dark'] { --primary: #60a5fa; --bg: #0f172a; --sidebar: #020617; --surface: #1e293b; --text: #f8fafc; --text-light: #94a3b8; --border: #334155; }
        body { margin: 0; font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); }
        .admin-layout { display: flex; min-height: 100vh; }
        .sidebar { width: 260px; background: var(--sidebar); color: white; display: flex; flex-direction: column; position: fixed; height: 100vh; padding: 20px; box-sizing: border-box; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 15px; border-radius: 8px; color: #cbd5e1; cursor: pointer; transition: 0.2s; margin-bottom: 5px; }
        .nav-item:hover, .nav-item.active { background: rgba(255,255,255,0.1); color: white; }
        .nav-item.active { background: #3b82f6; }
        .main { margin-left: 260px; flex: 1; padding: 30px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin-bottom: 30px; }
        .stat-card { background: var(--surface); padding: 25px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center; border: 1px solid var(--border); }
        .stat-val { font-size: 28px; font-weight: 700; margin: 5px 0 0; }
        .table-card { background: var(--surface); border-radius: 16px; padding: 25px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid var(--border); }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 15px; border-bottom: 1px solid var(--border); color: var(--text-light); font-size: 13px; text-transform: uppercase; }
        .data-table td { padding: 15px; border-bottom: 1px solid var(--border); vertical-align: middle; font-size: 14px; color: var(--text); }
        
        /* PULSING DOT */
        .pulse-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 8px; }
        .pulse-green { background: #10b981; box-shadow: 0 0 0 rgba(16, 185, 129, 0.4); animation: pulse 2s infinite; }
        .pulse-yellow { background: #f59e0b; box-shadow: 0 0 0 rgba(245, 158, 11, 0.4); animation: pulse 2s infinite; }
        .pulse-red { background: #ef4444; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0; } 70% { box-shadow: 0 0 0 6px rgba(0,0,0,0); } 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); } }

        .inp { width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 12px; background: var(--bg); color: var(--text); box-sizing: border-box; }
        .btn-blue { background: #3b82f6; color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; width: 100%; transition: 0.2s; }
        .icon-btn { cursor: pointer; color: var(--text-light); font-size: 20px; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; transition: 0.2s; }
        .icon-btn:hover { background: rgba(0,0,0,0.05); color: var(--text); }
        .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(4px); }
        .modal-content { background: var(--surface); padding: 30px; border-radius: 20px; width: 500px; box-shadow: 0 20px 50px rgba(0,0,0,0.2); }
        
        /* ACTIVITY FEED */
        .activity-item { display: flex; gap: 12px; margin-bottom: 15px; font-size: 13px; align-items: center; }
        .activity-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        
        @media (max-width: 1024px) { .sidebar { display: none; } .main { margin-left: 0; } }
      `}</style>

      <div className="sidebar">
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:40, paddingBottom:20, borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
          <div style={{width:35, height:35, background:'#3b82f6', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center'}}><FaUserGraduate/></div>
          <div><h3 style={{margin:0, fontSize:18}}>COTHM</h3><span style={{fontSize:11, opacity:0.6}}>Admin Portal</span></div>
        </div>
        <div className={`nav-item ${activeTab==='Overview'?'active':''}`} onClick={() => setActiveTab('Overview')}><FaChartPie/> Overview</div>
        <div className={`nav-item ${activeTab==='Students'?'active':''}`} onClick={() => setActiveTab('Students')}><FaUsers/> Students</div>
        <div className={`nav-item ${activeTab==='System'?'active':''}`} onClick={() => setActiveTab('System')}><FaBullhorn/> System</div>
        <div className="nav-item" style={{marginTop:'auto'}} onClick={() => {localStorage.clear(); navigate('/login')}}><FaSignOutAlt/> Logout</div>
      </div>

      <div className="main">
        <div className="header">
          <div><h1 style={{margin:0, fontSize:24}}>Dashboard</h1><p style={{margin:'5px 0 0', color:'var(--text-light)', fontSize:14}}>Welcome back, Administrator</p></div>
          <div style={{display:'flex', gap:15, alignItems:'center'}}>
            <div className="icon-btn" onClick={toggleTheme}>{darkMode ? <FaSun/> : <FaMoon/>}</div>
            <div className="icon-btn"><FaBell/></div>
            <div style={{width:40, height:40, background:'#3b82f6', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold'}}>A</div>
          </div>
        </div>

        {activeTab === 'Overview' && (
          <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:25}}>
            <div>
              <div className="dashboard-grid">
                <div className="stat-card">
                  <div><div style={{color:'var(--text-light)', fontSize:14}}>Total Students</div><div className="stat-val">{data.projects.length}</div></div>
                  <div style={{width:50, height:50, borderRadius:12, background:'rgba(59,130,246,0.1)', color:'#3b82f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24}}><FaUsers/></div>
                </div>
                <div className="stat-card">
                  <div><div style={{color:'var(--text-light)', fontSize:14}}>Pending Review</div><div className="stat-val">{data.projects.filter(p=>p.status==='Pending Review').length}</div></div>
                  <div style={{width:50, height:50, borderRadius:12, background:'rgba(245,158,11,0.1)', color:'#f59e0b', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24}}><FaClock/></div>
                </div>
              </div>
              <div className="table-card" style={{height:300}}>
                <h3 style={{color:'var(--text)', margin:'0 0 20px 0'}}>Batch Overview</h3>
                <ResponsiveContainer><BarChart data={getBatchData()}><XAxis dataKey="name"/><YAxis/><Tooltip/><Bar dataKey="students" fill="#3b82f6" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer>
              </div>
            </div>
            
            {/* ✨ New: Live Activity Feed */}
            <div className="table-card">
              <h3 style={{color:'var(--text)', margin:'0 0 20px 0', display:'flex', alignItems:'center', gap:10}}><FaBolt color="#f59e0b"/> Live Activity</h3>
              {activityFeed.map((act, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-dot" style={{background: act.color}}></div>
                  <div style={{flex:1}}>
                    <div style={{color:'var(--text)', fontWeight:500}}>{act.text}</div>
                    <div style={{color:'var(--text-light)', fontSize:11}}>{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Students' && (
          <div className="table-card">
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:20}}>
              <h3 style={{color:'var(--text)', margin:0}}>Submissions</h3>
              <div style={{position:'relative'}}><FaSearch style={{position:'absolute', left:12, top:12, color:'gray'}}/><input className="inp" placeholder="Search..." style={{width:250, margin:0, paddingLeft:35}} onChange={e=>setSearchTerm(e.target.value)}/></div>
            </div>
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filteredProjects.map(p => (
                  <tr key={p._id} style={{borderBottom:'1px solid var(--border)'}}>
                    <td><strong>{p.studentName}</strong></td>
                    <td style={{color:'var(--text-light)'}}>{p.studentEmail}</td>
                    <td>
                      <div style={{display:'flex', alignItems:'center'}}>
                        {/* ✨ New: Pulsing Dot */}
                        <span className={`pulse-dot ${p.status==='Approved'?'pulse-green':p.status==='Rejected'?'pulse-red':'pulse-yellow'}`}></span>
                        {p.status}
                      </div>
                    </td>
                    <td><button className="btn-blue" style={{width:'auto', padding:'6px 15px', fontSize:12}} onClick={() => {setSelectedProject(p); setFeedback(p.feedback||"");}}>Review</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'System' && (
          <div className="dashboard-grid">
            <div className="table-card"><h3 style={{color:'var(--text)'}}>📢 Announcement</h3><input className="inp" placeholder="Title" onChange={e=>setInputs({...inputs, title:e.target.value})}/><textarea className="inp" rows="3" placeholder="Message" onChange={e=>setInputs({...inputs, message:e.target.value})}/><button className="btn-blue" onClick={postAnnouncement}>Post</button></div>
            <div>
              <div className="table-card" style={{marginBottom:20}}><h3 style={{color:'var(--text)'}}>📅 Deadline</h3><input type="date" className="inp" value={inputs.deadline} onChange={e=>setInputs({...inputs, deadline:e.target.value})}/><button className="btn-blue" onClick={setDeadline}>Set</button></div>
              <div className="table-card"><h3 style={{color:'var(--text)'}}>📂 Resource</h3><input className="inp" placeholder="Title" onChange={e=>setInputs({...inputs, resTitle:e.target.value})}/><input className="inp" type="file" onChange={e=>setInputs({...inputs, resFile:e.target.files[0]})}/><button className="btn-blue" onClick={uploadResource}>Upload</button></div>
            </div>
          </div>
        )}
      </div>

      {selectedProject && (
        <div className="modal-overlay" onClick={()=>setSelectedProject(null)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <h3 style={{color:'var(--text)'}}>Review Project</h3>
            {selectedProject.submissions.length>0 && <a href={selectedProject.submissions[selectedProject.submissions.length-1].fileUrl} target="_blank" rel="noreferrer" style={{display:'block', marginBottom:15, color:'#3b82f6', fontWeight:600}}>📄 Download</a>}
            <textarea className="inp" rows="4" value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="Feedback..."/>
            <div style={{display:'flex', gap:10}}><button className="btn-blue" style={{background:'#ef4444'}} onClick={()=>handleUpdate("Rejected")}>Reject</button><button className="btn-blue" style={{background:'#10b981'}} onClick={()=>handleUpdate("Approved")}>Approve</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
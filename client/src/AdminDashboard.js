import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaUserGraduate, FaCheckCircle, FaTimesCircle, FaClock, FaFilePdf, FaSearch, 
  FaSignOutAlt, FaSync, FaTimes, FaExternalLinkAlt, FaChevronRight, FaBullhorn, 
  FaCalendarAlt, FaFolderOpen, FaTrash, FaUpload, FaChartPie, FaFileDownload, 
  FaBell, FaUsers, FaMoon, FaSun, FaBolt, FaCircle 
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

  // Custom Tooltip for Charts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: darkMode ? '#1e293b' : 'white', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="admin-layout">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        :root {
          --primary: #6366f1; --primary-glow: rgba(99, 102, 241, 0.4);
          --bg: #f8fafc; --sidebar: #ffffff; 
          --surface: rgba(255, 255, 255, 0.7); 
          --text: #0f172a; --text-light: #64748b; --border: #e2e8f0;
          --glass-border: 1px solid rgba(255, 255, 255, 0.5);
          --shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
        }
        
        [data-theme='dark'] {
          --primary: #818cf8; --primary-glow: rgba(129, 140, 248, 0.3);
          --bg: #0f172a; --sidebar: #1e293b; 
          --surface: rgba(30, 41, 59, 0.6); 
          --text: #f1f5f9; --text-light: #94a3b8; --border: #334155;
          --glass-border: 1px solid rgba(255, 255, 255, 0.05);
          --shadow: 0 10px 30px -10px rgba(0,0,0,0.3);
        }

        body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--text); transition: background 0.4s ease; overflow-x: hidden; }
        
        /* LAYOUT */
        .admin-layout { display: flex; min-height: 100vh; position: relative; }
        .admin-layout::before {
          content: ''; position: absolute; top: -10%; left: -10%; width: 50%; height: 50%;
          background: radial-gradient(circle, var(--primary-glow) 0%, transparent 60%);
          z-index: 0; pointer-events: none;
        }

        /* SIDEBAR - GLASSMORPHISM */
        .sidebar { 
          width: 280px; background: var(--surface); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          color: var(--text); display: flex; flex-direction: column; position: fixed; height: 100vh; 
          padding: 30px 20px; box-sizing: border-box; border-right: var(--glass-border); z-index: 50;
        }
        
        .nav-item { 
          display: flex; align-items: center; gap: 14px; padding: 14px 18px; border-radius: 12px; 
          color: var(--text-light); cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
          margin-bottom: 8px; font-weight: 600; font-size: 14px;
        }
        .nav-item:hover { background: rgba(99, 102, 241, 0.08); color: var(--primary); transform: translateX(5px); }
        .nav-item.active { background: var(--primary); color: white; box-shadow: 0 4px 15px var(--primary-glow); }
        
        /* MAIN */
        .main { margin-left: 280px; flex: 1; padding: 40px; position: relative; z-index: 1; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        
        /* CARDS - GLASSMORPHISM */
        .glass-card { 
          background: var(--surface); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          border-radius: 24px; padding: 30px; 
          box-shadow: var(--shadow); border: var(--glass-border);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .glass-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
        
        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; margin-bottom: 30px; }

        /* STATS */
        .stat-val { font-size: 36px; font-weight: 800; margin: 10px 0 0; background: linear-gradient(135deg, var(--text) 0%, var(--text-light) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .stat-icon { width: 60px; height: 60px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 28px; }

        /* TABLE */
        .data-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; }
        .data-table th { text-align: left; padding: 15px; color: var(--text-light); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
        .data-table td { padding: 20px 15px; background: rgba(255,255,255,0.03); font-size: 14px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .data-table tr td:first-child { border-left: 1px solid var(--border); border-radius: 12px 0 0 12px; }
        .data-table tr td:last-child { border-right: 1px solid var(--border); border-radius: 0 12px 12px 0; }
        .data-table tr:hover td { background: rgba(99, 102, 241, 0.05); }

        /* ACTIVITY FEED */
        .activity-item { display: flex; gap: 15px; margin-bottom: 25px; position: relative; }
        .activity-item:not(:last-child)::after { content: ''; position: absolute; left: 5px; top: 20px; width: 2px; height: 30px; background: var(--border); }
        .activity-dot { width: 12px; height: 12px; border-radius: 50%; z-index: 2; border: 3px solid var(--surface); box-shadow: 0 0 0 2px var(--border); }

        /* PULSING STATUS */
        .pulse-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 10px; }
        .pulse-green { background: #10b981; box-shadow: 0 0 0 rgba(16, 185, 129, 0.6); animation: pulse 2s infinite; }
        .pulse-yellow { background: #f59e0b; box-shadow: 0 0 0 rgba(245, 158, 11, 0.6); animation: pulse 2s infinite; }
        .pulse-red { background: #ef4444; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0; } 70% { box-shadow: 0 0 0 8px rgba(0,0,0,0); } 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); } }

        /* FORM ELEMENTS */
        .inp { 
          width: 100%; padding: 16px; border: 2px solid var(--border); border-radius: 12px; margin-bottom: 15px; 
          background: transparent; color: var(--text); font-size: 14px; transition: 0.3s; box-sizing: border-box;
        }
        .inp:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 4px var(--primary-glow); }
        
        .btn-modern { 
          background: linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%); color: white; 
          padding: 14px 24px; border: none; border-radius: 12px; cursor: pointer; font-weight: 700; 
          width: 100%; transition: 0.3s; box-shadow: 0 4px 15px var(--primary-glow); letter-spacing: 0.5px;
        }
        .btn-modern:hover { transform: translateY(-2px); box-shadow: 0 8px 25px var(--primary-glow); }
        
        .icon-btn { 
          cursor: pointer; color: var(--text); width: 45px; height: 45px; border-radius: 50%; 
          display: flex; align-items: center; justify-content: center; transition: 0.3s; background: var(--surface); border: var(--glass-border);
        }
        .icon-btn:hover { background: var(--primary); color: white; transform: rotate(15deg); }

        /* MODAL */
        .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 1000; animation: fadeIn 0.3s; }
        .modal-content { background: var(--surface); border: var(--glass-border); padding: 40px; border-radius: 24px; width: 550px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); animation: zoomIn 0.3s; }

        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes zoomIn { from{transform:scale(0.95); opacity:0} to{transform:scale(1); opacity:1} }
        
        @media (max-width: 1024px) { .sidebar { display: none; } .main { margin-left: 0; } }
      `}</style>

      {/* SIDEBAR */}
      <div className="sidebar">
        <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:50, paddingBottom:25, borderBottom:'1px solid var(--border)'}}>
          <div style={{width:42, height:42, background:'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:22, boxShadow:'0 4px 12px rgba(59,130,246,0.3)'}}><FaUserGraduate/></div>
          <div><h3 style={{margin:0, fontSize:20, fontWeight:800}}>COTHM</h3><span style={{fontSize:12, opacity:0.6, letterSpacing:'1px', textTransform:'uppercase'}}>Admin Portal</span></div>
        </div>
        <div className={`nav-item ${activeTab==='Overview'?'active':''}`} onClick={() => setActiveTab('Overview')}><FaChartPie/> Overview</div>
        <div className={`nav-item ${activeTab==='Students'?'active':''}`} onClick={() => setActiveTab('Students')}><FaUsers/> Students</div>
        <div className={`nav-item ${activeTab==='System'?'active':''}`} onClick={() => setActiveTab('System')}><FaBullhorn/> System</div>
        <div className="nav-item" style={{marginTop:'auto', color:'#ef4444', background:'rgba(239, 68, 68, 0.1)'}} onClick={() => {localStorage.clear(); navigate('/login')}}><FaSignOutAlt/> Logout</div>
      </div>

      {/* MAIN */}
      <div className="main">
        <div className="header">
          <div><h1 style={{margin:0, fontSize:32, fontWeight:800, letterSpacing:'-1px'}}>Dashboard</h1><p style={{margin:'8px 0 0', color:'var(--text-light)', fontSize:15}}>Welcome back, Administrator</p></div>
          <div style={{display:'flex', gap:20, alignItems:'center'}}>
            <div className="icon-btn" onClick={toggleTheme}>{darkMode ? <FaSun/> : <FaMoon/>}</div>
            <div className="icon-btn" style={{position:'relative'}}><FaBell/><span style={{position:'absolute', top:10, right:12, width:8, height:8, background:'#ef4444', borderRadius:'50%'}}></span></div>
            <div style={{width:45, height:45, background:'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'800', fontSize:18, boxShadow:'0 4px 15px rgba(99,102,241,0.4)'}}>A</div>
          </div>
        </div>

        {activeTab === 'Overview' && (
          <div style={{display:'grid', gridTemplateColumns:'2.2fr 1fr', gap:30}}>
            <div>
              <div className="dashboard-grid">
                <div className="glass-card" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <div><div style={{color:'var(--text-light)', fontSize:14, fontWeight:600, textTransform:'uppercase'}}>Total Students</div><div className="stat-val">{data.projects.length}</div></div>
                  <div className="stat-icon" style={{background:'rgba(59,130,246,0.1)', color:'#3b82f6'}}><FaUsers/></div>
                </div>
                <div className="glass-card" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <div><div style={{color:'var(--text-light)', fontSize:14, fontWeight:600, textTransform:'uppercase'}}>Pending</div><div className="stat-val">{data.projects.filter(p=>p.status==='Pending Review').length}</div></div>
                  <div className="stat-icon" style={{background:'rgba(245,158,11,0.1)', color:'#f59e0b'}}><FaClock/></div>
                </div>
                <div className="glass-card" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <div><div style={{color:'var(--text-light)', fontSize:14, fontWeight:600, textTransform:'uppercase'}}>Approved</div><div className="stat-val">{data.projects.filter(p=>p.status==='Approved').length}</div></div>
                  <div className="stat-icon" style={{background:'rgba(16,185,129,0.1)', color:'#10b981'}}><FaCheckCircle/></div>
                </div>
              </div>
              
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:30}}>
                <div className="glass-card" style={{height:350}}>
                  <h3 style={{margin:'0 0 25px 0'}}>Status Distribution</h3>
                  <ResponsiveContainer><PieChart><Pie data={getStatusData()} innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>{getStatusData().map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip content={<CustomTooltip/>}/><Legend/></PieChart></ResponsiveContainer>
                </div>
                <div className="glass-card" style={{height:350}}>
                  <div style={{display:'flex', justifyContent:'space-between', marginBottom:20}}><h3 style={{margin:0}}>Batch Overview</h3><button onClick={exportToCSV} style={{background:'var(--surface)', border:'1px solid var(--border)', padding:'5px 12px', borderRadius:8, cursor:'pointer', color:'var(--text)'}}>Export CSV</button></div>
                  <ResponsiveContainer><BarChart data={getBatchData()}><XAxis dataKey="name" stroke="var(--text-light)"/><YAxis stroke="var(--text-light)"/><Tooltip content={<CustomTooltip/>}/><Bar dataKey="students" fill="url(#colorGradient)" radius={[6,6,0,0]}><defs><linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/><stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/></linearGradient></defs></Bar></BarChart></ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Live Activity Feed */}
            <div className="glass-card">
              <h3 style={{margin:'0 0 30px 0', display:'flex', alignItems:'center', gap:10}}><FaBolt color="#f59e0b"/> Live Activity</h3>
              {activityFeed.map((act, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-dot" style={{background: act.color, borderColor: act.color}}></div>
                  <div style={{flex:1}}>
                    <div style={{color:'var(--text)', fontWeight:700, fontSize:14}}>{act.text}</div>
                    <div style={{color:'var(--text-light)', fontSize:12, marginTop:4}}>{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Students' && (
          <div className="glass-card">
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:30, alignItems:'center'}}>
              <h3 style={{margin:0, fontSize:20}}>All Submissions</h3>
              <div style={{position:'relative'}}><FaSearch style={{position:'absolute', left:15, top:15, color:'var(--text-light)'}}/><input className="inp" placeholder="Search student..." style={{width:300, margin:0, paddingLeft:45, borderRadius:50}} onChange={e=>setSearchTerm(e.target.value)}/></div>
            </div>
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Batch</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {filteredProjects.map(p => (
                  <tr key={p._id}>
                    <td><div style={{display:'flex', alignItems:'center', gap:10}}><div style={{width:32, height:32, background:'var(--primary-glow)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--primary)', fontWeight:'bold'}}>{p.studentName.charAt(0)}</div><strong>{p.studentName}</strong></div></td>
                    <td style={{color:'var(--text-light)'}}>{p.studentEmail}</td>
                    <td><span style={{background:'var(--surface)', padding:'5px 10px', borderRadius:8, border:'1px solid var(--border)', fontSize:12}}>{p.batchNumber || 'N/A'}</span></td>
                    <td>
                      <div style={{display:'flex', alignItems:'center'}}>
                        <span className={`pulse-dot ${p.status==='Approved'?'pulse-green':p.status==='Rejected'?'pulse-red':'pulse-yellow'}`}></span>
                        <span style={{fontWeight:600, fontSize:13}}>{p.status}</span>
                      </div>
                    </td>
                    <td><button className="btn-modern" style={{width:'auto', padding:'8px 20px', fontSize:12, borderRadius:50}} onClick={() => {setSelectedProject(p); setFeedback(p.feedback||"");}}>Review</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'System' && (
          <div className="dashboard-grid">
            <div className="glass-card"><h3 style={{marginBottom:20}}>📢 Post Announcement</h3><input className="inp" placeholder="Announcement Title" onChange={e=>setInputs({...inputs, title:e.target.value})}/><textarea className="inp" rows="4" placeholder="Write your message here..." onChange={e=>setInputs({...inputs, message:e.target.value})}/><button className="btn-modern" onClick={postAnnouncement}>Post Announcement</button></div>
            <div>
              <div className="glass-card" style={{marginBottom:30}}><h3 style={{marginBottom:20}}>📅 Global Deadline</h3><input type="date" className="inp" value={inputs.deadline} onChange={e=>setInputs({...inputs, deadline:e.target.value})}/><button className="btn-modern" onClick={setDeadline}>Update Deadline</button></div>
              <div className="glass-card"><h3 style={{marginBottom:20}}>📂 Upload Resource</h3><input className="inp" placeholder="Resource Title" onChange={e=>setInputs({...inputs, resTitle:e.target.value})}/><div style={{background:'var(--bg)', padding:15, borderRadius:12, marginBottom:15, border:'2px dashed var(--border)', textAlign:'center', cursor:'pointer'}}><FaUpload style={{marginBottom:5, color:'var(--text-light)'}}/><input className="inp" type="file" style={{border:'none', padding:0, margin:0}} onChange={e=>setInputs({...inputs, resFile:e.target.files[0]})}/></div><button className="btn-modern" onClick={uploadResource}>Upload File</button></div>
            </div>
          </div>
        )}
      </div>

      {selectedProject && (
        <div className="modal-overlay" onClick={()=>setSelectedProject(null)}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}><h3 style={{margin:0}}>Review Project</h3><div onClick={()=>setSelectedProject(null)} style={{cursor:'pointer'}}><FaTimes/></div></div>
            <div style={{background:'var(--bg)', padding:15, borderRadius:12, marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div><div style={{fontSize:12, color:'var(--text-light)'}}>Student</div><div style={{fontWeight:700}}>{selectedProject.studentName}</div></div>
              {selectedProject.submissions.length>0 && <a href={selectedProject.submissions[selectedProject.submissions.length-1].fileUrl} target="_blank" rel="noreferrer" style={{color:'var(--primary)', fontWeight:600, display:'flex', alignItems:'center', gap:5, textDecoration:'none'}}><FaFileDownload/> View File</a>}
            </div>
            <textarea className="inp" rows="5" value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="Enter detailed feedback for the student..."/>
            <div style={{display:'flex', gap:15, marginTop:10}}>
              <button className="btn-modern" style={{background:'#ef4444', boxShadow:'0 4px 15px rgba(239,68,68,0.3)'}} onClick={()=>handleUpdate("Rejected")}>Reject</button>
              <button className="btn-modern" style={{background:'#10b981', boxShadow:'0 4px 15px rgba(16,185,129,0.3)'}} onClick={()=>handleUpdate("Approved")}>Approve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
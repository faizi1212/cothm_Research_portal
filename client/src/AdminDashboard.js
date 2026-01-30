import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';
import { 
  FaFilePdf, FaCheck, FaTimes, FaUserGraduate, FaSearch, FaFilter, FaClock, FaCheckCircle, FaTimesCircle 
} from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // YOUR ONLINE SERVER URL
  const API_URL = "https://cothm-research-portal.onrender.com/api/admin";

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const handleUpdate = async (email, newStatus) => {
    if(!window.confirm(`Are you sure you want to mark this as ${newStatus}?`)) return;
    try {
        await axios.post(`${API_URL}/update`, { email, status: newStatus });
        fetchProjects();
    } catch (error) {
        alert("Update failed");
    }
  };

  // Safe File Link
  const getSafeFileUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith("/uploads")) return url;
    return url; 
  };

  // --- CALCULATE STATS FOR GRAPHS ---
  const total = projects.length;
  const approved = projects.filter(p => p.status === 'Approved').length;
  const rejected = projects.filter(p => p.status === 'Rejected').length;
  const pending = projects.filter(p => p.status === 'Pending Review' || p.status === 'Pending').length;

  const data = [
    { name: 'Approved', value: approved, color: '#198754' }, // Green
    { name: 'Pending', value: pending, color: '#ffc107' },   // Yellow
    { name: 'Rejected', value: rejected, color: '#dc3545' }, // Red
  ];

  // --- FILTER & SEARCH LOGIC ---
  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === "All" ? true : p.status === filter;
    const matchesSearch = p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.regNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="dashboard-container" style={{minHeight: '100vh', background: '#121212', color: 'white'}}>
        
        <div className="container py-5">
            {/* 1. TOP HEADER */}
            <div className="row mb-5 align-items-center">
                <div className="col-md-6">
                    <h1 className="display-5 fw-bold text-warning">
                        <span style={{color: '#d4af37'}}>COTHM</span> SUPERVISOR
                    </h1>
                    <p className="text-secondary">Research & Thesis Management Portal</p>
                </div>
                <div className="col-md-6 text-end">
                    <div className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill" style={{background: '#2c2c2c'}}>
                        <FaClock className="text-warning" />
                        <span className="text-light">{new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* 2. STATS & GRAPHS SECTION */}
            <div className="row g-4 mb-5">
                {/* Left: Quick Stats Cards */}
                <div className="col-lg-8">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <div className="p-4 rounded-3 text-center h-100" style={{background: 'linear-gradient(145deg, #1e1e1e, #252525)', borderTop: '4px solid #0d6efd'}}>
                                <h3 className="display-4 fw-bold text-white">{total}</h3>
                                <div className="text-secondary small uppercase tracking-wider">Total Students</div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-3 text-center h-100" style={{background: 'linear-gradient(145deg, #1e1e1e, #252525)', borderTop: '4px solid #198754'}}>
                                <h3 className="display-4 fw-bold text-success">{approved}</h3>
                                <div className="text-secondary small">Approved Thesis</div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-3 text-center h-100" style={{background: 'linear-gradient(145deg, #1e1e1e, #252525)', borderTop: '4px solid #ffc107'}}>
                                <h3 className="display-4 fw-bold text-warning">{pending}</h3>
                                <div className="text-secondary small">Pending Review</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Pie Chart */}
                <div className="col-lg-4">
                    <div className="p-3 rounded-3 h-100 d-flex flex-column align-items-center justify-content-center" style={{background: '#1e1e1e'}}>
                        <h6 className="text-secondary mb-3">Submission Status</h6>
                        <div style={{ width: '100%', height: 180 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{backgroundColor: '#333', border: 'none'}} />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
      
            {/* 3. TOOLBAR (Search & Filter) */}
            <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-4 p-3 rounded-3" style={{background: '#1e1e1e'}}>
                <div className="d-flex gap-2">
                    {["All", "Pending Review", "Approved", "Rejected"].map(status => (
                        <button 
                            key={status}
                            className={`btn btn-sm px-3 rounded-pill fw-bold ${filter === status ? 'btn-light text-dark' : 'btn-outline-secondary'}`}
                            onClick={() => setFilter(status)}
                        >
                            {status === "All" ? "All Submissions" : status}
                        </button>
                    ))}
                </div>
                <div className="input-group" style={{maxWidth: '300px'}}>
                    <span className="input-group-text bg-dark border-secondary text-secondary"><FaSearch /></span>
                    <input 
                        type="text" 
                        className="form-control bg-dark border-secondary text-light" 
                        placeholder="Search Student..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* 4. DATA TABLE */}
            <div className="card shadow-lg border-0 overflow-hidden" style={{background: '#1e1e1e'}}>
                <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0 align-middle">
                        <thead className="text-secondary text-uppercase small" style={{background: '#252525'}}>
                            <tr>
                                <th className="p-4">Student Details</th>
                                <th className="p-4">Batch / Program</th>
                                <th className="p-4">Document</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredProjects.length === 0 ? (
                            <tr><td colSpan="5" className="text-center p-5 text-secondary">No submissions match your search.</td></tr>
                        ) : (
                            filteredProjects.map((p) => {
                                const latestSubmission = p.submissions.length > 0 ? p.submissions[p.submissions.length - 1] : null;

                                return (
                                <tr key={p._id} style={{borderBottom: '1px solid #333'}}>
                                    
                                    {/* Student */}
                                    <td className="p-4">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold" 
                                                 style={{width:'45px', height:'45px', background: '#d4af37', color: 'black'}}>
                                                {p.studentName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="fw-bold text-white">{p.studentName}</div>
                                                <div className="small text-secondary">{p.studentEmail}</div>
                                                <div className="small text-secondary mt-1">
                                                    <FaClock className="me-1"/> 
                                                    {latestSubmission ? new Date(latestSubmission.submittedAt).toLocaleDateString() : "N/A"}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    {/* Batch Fix: Try Batch, then Program, then N/A */}
                                    <td className="p-4">
                                        <div className="fw-bold text-light">{p.batch || p.program || "N/A"}</div>
                                        <div className="small text-warning font-monospace">{p.regNumber || "ID: ---"}</div>
                                    </td>
                                    
                                    {/* Document */}
                                    <td className="p-4">
                                        {latestSubmission ? (
                                            latestSubmission.fileUrl.startsWith("/uploads") ? (
                                                <span className="badge bg-danger">Broken Link</span>
                                            ) : (
                                                <a 
                                                    href={getSafeFileUrl(latestSubmission.fileUrl)} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="btn btn-warning btn-sm fw-bold d-inline-flex align-items-center gap-2"
                                                >
                                                    <FaFilePdf /> Review Thesis
                                                </a>
                                            )
                                        ) : <span className="text-secondary fst-italic">Pending Upload</span>}
                                    </td>

                                    {/* Status */}
                                    <td className="p-4">
                                        <span className={`badge rounded-pill px-3 py-2 ${
                                            p.status === 'Approved' ? 'bg-success text-white' : 
                                            p.status === 'Rejected' ? 'bg-danger text-white' : 'bg-warning text-dark'
                                        }`}>
                                            {p.status}
                                        </span>
                                    </td>

                                    {/* Actions (VISIBLE NOW) */}
                                    <td className="p-4 text-end">
                                        <div className="d-flex justify-content-end gap-2">
                                            <button 
                                                className="btn btn-success btn-sm px-3" 
                                                title="Approve"
                                                onClick={() => handleUpdate(p.studentEmail, "Approved")}
                                            >
                                                <FaCheckCircle className="me-1"/> Approve
                                            </button>
                                            <button 
                                                className="btn btn-danger btn-sm px-3" 
                                                title="Reject"
                                                onClick={() => handleUpdate(p.studentEmail, "Rejected")}
                                            >
                                                <FaTimesCircle className="me-1"/> Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                )
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminDashboard;
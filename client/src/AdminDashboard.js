import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css'; 
import { FaFilePdf, FaCheck, FaTimes, FaUserGraduate } from "react-icons/fa";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("All");

  // 1. YOUR ONLINE SERVER URL
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
    if(!window.confirm(`Mark this project as ${newStatus}?`)) return;
    try {
        await axios.post(`${API_URL}/update`, {
            email,
            status: newStatus
        });
        fetchProjects(); // Refresh table
    } catch (error) {
        alert("Update failed");
    }
  };

  // Helper to handle links (Clean Version)
  const getSafeFileUrl = (url) => {
    if (!url) return "#";
    // If it's a local test file (old broken upload), return as is
    if (url.startsWith("/uploads")) return url;
    
    // Server now handles "auto" detection, so we use the URL exactly as Cloudinary gives it.
    return url; 
  };

  // Filter Logic
  const filteredProjects = projects.filter(p => 
    filter === "All" ? true : p.status === filter
  );

  return (
    <div className="dashboard-container">
        <div className="dashboard-bg"></div>

        <div className="container py-5">
            
            {/* HEADER & STATS */}
            <div className="row mb-4 align-items-end">
                <div className="col-md-8">
                    <h1 className="cothm-title text-start">SUPERVISOR PORTAL</h1>
                    <p className="text-white-50">Manage Student Thesis Submissions</p>
                </div>
                <div className="col-md-4 text-end">
                    <div className="d-inline-block bg-dark rounded p-2 border border-secondary">
                        <span className="text-white-50 me-2">Total Submissions:</span>
                        <strong className="text-gold fs-5">{projects.length}</strong>
                    </div>
                </div>
            </div>

            {/* FILTERS */}
            <div className="card auth-card mb-4 p-3">
                <div className="d-flex gap-2">
                    {["All", "Pending Review", "Approved", "Rejected"].map(status => (
                        <button 
                            key={status}
                            className={`btn btn-sm rounded-pill px-3 ${filter === status ? 'btn-cothm' : 'btn-outline-light'}`}
                            onClick={() => setFilter(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>
      
            {/* DATA TABLE */}
            <div className="card auth-card shadow-lg border-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover table-dark mb-0 align-middle">
                        <thead className="text-gold text-uppercase small" style={{background: 'rgba(0,0,0,0.5)'}}>
                            <tr>
                                <th className="p-3">Student</th>
                                <th className="p-3">Batch / Reg ID</th>
                                <th className="p-3">Thesis Document</th>
                                <th className="p-3">Submission Date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredProjects.length === 0 ? (
                            <tr><td colSpan="6" className="text-center p-5 text-white-50">No submissions found.</td></tr>
                        ) : (
                            filteredProjects.map((p) => {
                                // Get the latest submission
                                const latestSubmission = p.submissions.length > 0 ? p.submissions[p.submissions.length - 1] : null;

                                return (
                                <tr key={p._id} style={{borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                                    
                                    {/* STUDENT INFO */}
                                    <td className="p-3">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{width:'40px', height:'40px'}}>
                                                <FaUserGraduate className="text-white" />
                                            </div>
                                            <div>
                                                <div className="fw-bold text-white">{p.studentName}</div>
                                                <div className="small text-white-50">{p.studentEmail}</div>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    {/* BATCH INFO */}
                                    <td className="p-3">
                                        <span className="badge bg-light text-dark mb-1">{p.program || "N/A"}</span>
                                        <div className="small text-gold font-monospace">{p.regNumber || "---"}</div>
                                    </td>
                                    
                                    {/* FILE DOWNLOAD */}
                                    <td className="p-3">
                                        {latestSubmission ? (
                                            latestSubmission.fileUrl.startsWith("/uploads") ? (
                                                <span className="text-danger small">Broken Link (Old Upload)</span>
                                            ) : (
                                                <a 
                                                    href={getSafeFileUrl(latestSubmission.fileUrl)} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="btn btn-sm btn-warning d-flex align-items-center gap-2 text-dark fw-bold"
                                                    style={{width: 'fit-content'}}
                                                >
                                                    <FaFilePdf /> View PDF
                                                </a>
                                            )
                                        ) : <span className="text-white-50 fst-italic">No File</span>}
                                    </td>

                                    {/* DATE */}
                                    <td className="p-3 text-white-50 small">
                                        {latestSubmission && latestSubmission.submittedAt
                                            ? new Date(latestSubmission.submittedAt).toLocaleDateString() 
                                            : "Just Now"}
                                    </td>

                                    {/* STATUS */}
                                    <td className="p-3">
                                        <span className={`badge ${
                                            p.status === 'Approved' ? 'bg-success' : 
                                            p.status === 'Rejected' ? 'bg-danger' : 'bg-info text-dark'
                                        }`}>
                                            {p.status}
                                        </span>
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="p-3 text-end">
                                        <button 
                                            className="btn btn-outline-success btn-sm me-2" 
                                            title="Approve"
                                            onClick={() => handleUpdate(p.studentEmail, "Approved")}
                                        >
                                            <FaCheck />
                                        </button>
                                        <button 
                                            className="btn btn-outline-danger btn-sm" 
                                            title="Reject"
                                            onClick={() => handleUpdate(p.studentEmail, "Rejected")}
                                        >
                                            <FaTimes />
                                        </button>
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
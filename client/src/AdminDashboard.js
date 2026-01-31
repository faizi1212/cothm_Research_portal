import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserGraduate, FaCheck, FaTimes } from "react-icons/fa";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const API_URL = "https://cothm-research-portal.onrender.com";

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/projects`);
      setProjects(res.data);
    } catch (err) { console.error("Error:", err); }
  };

  const handleStatusUpdate = async (studentEmail, newStatus) => {
    console.log(`Updating ${studentEmail} to ${newStatus}`); // Debug Log
    try {
      // Sending exact payload server expects
      await axios.post(`${API_URL}/api/admin/update`, { 
        email: studentEmail, 
        status: newStatus 
      });
      alert(`✅ Project ${newStatus}!`);
      fetchProjects(); // Refresh list immediately
    } catch (err) {
      console.error(err);
      alert("❌ Update Failed: " + (err.response?.data?.error || "Server Error"));
    }
  };

  return (
    <div className="container dashboard-container">
      <h2 className="text-white mb-4 fw-bold text-shadow">🎓 Admin Control Panel</h2>
      
      <div className="card-dashboard">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th className="p-3">Student Name</th>
                <th>Reg Number</th>
                <th>Current Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj, i) => (
                <tr key={i}>
                  <td className="p-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                        <FaUserGraduate/>
                      </div>
                      <div>
                        <div className="fw-bold text-navy">{proj.studentName}</div>
                        <small className="text-muted">{proj.studentEmail}</small>
                      </div>
                    </div>
                  </td>
                  <td>{proj.regNumber}</td>
                  <td>
                    <span className={`badge rounded-pill ${
                      proj.status === 'Approved' ? 'bg-success' : 
                      proj.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'
                    }`}>
                      {proj.status}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button 
                        onClick={() => handleStatusUpdate(proj.studentEmail, 'Approved')} 
                        className="btn btn-success btn-sm"
                      >
                        <FaCheck className="me-1"/> Approve
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(proj.studentEmail, 'Rejected')} 
                        className="btn btn-danger btn-sm"
                      >
                        <FaTimes className="me-1"/> Reject
                      </button>
                    </div>
                    {proj.submissions.length > 0 && (
                      <a href={proj.submissions[proj.submissions.length-1].fileUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary ms-2">
                        View Thesis
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
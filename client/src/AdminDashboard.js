import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserGraduate, FaCheck, FaTimes, FaFileAlt, FaPaperPlane } from "react-icons/fa";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  // State for the "Action Popup"
  const [selectedProject, setSelectedProject] = useState(null);
  const [actionType, setActionType] = useState(""); // "Approved" or "Rejected"
  const [comment, setComment] = useState("");
  
  const API_URL = "https://cothm-research-portal.onrender.com";

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/projects`);
      setProjects(res.data);
    } catch (err) { console.error("Error:", err); }
  };

  // 1. Open the Popup
  const initiateAction = (project, type) => {
    setSelectedProject(project);
    setActionType(type);
    setComment(""); // Reset comment
  };

  // 2. Send the Decision + Comment
  const submitDecision = async () => {
    if (!comment) return alert("Please write a reason for this decision.");

    try {
      // Update Status
      await axios.post(`${API_URL}/api/admin/update`, { 
        email: selectedProject.studentEmail, 
        status: actionType 
      });

      // Add Comment/Feedback
      await axios.post(`${API_URL}/api/admin/comment`, { 
        email: selectedProject.studentEmail, 
        comment: `[${actionType.toUpperCase()}] ${comment}` 
      });

      alert(`✅ Project ${actionType} Successfully!`);
      setSelectedProject(null); // Close popup
      fetchProjects(); // Refresh list
    } catch (err) {
      alert("❌ Error updating project");
    }
  };

  return (
    <div className="container dashboard-container">
      <h2 className="text-white mb-4 fw-bold">🎓 Supervisor Control Panel</h2>
      
      <div className="card-dashboard">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th className="p-3">Student</th>
                <th>Status</th>
                <th>Thesis</th>
                <th>Supervisor Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj, i) => (
                <tr key={i}>
                  <td className="p-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}><FaUserGraduate/></div>
                      <div>
                        <div className="fw-bold text-navy">{proj.studentName}</div>
                        <small className="text-muted">{proj.studentEmail}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge rounded-pill ${proj.status === 'Approved' ? 'bg-success' : proj.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>{proj.status}</span>
                  </td>
                  <td>
                    {proj.submissions.length > 0 ? (
                      <a href={proj.submissions[proj.submissions.length-1].fileUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
                        <FaFileAlt className="me-1"/> View File
                      </a>
                    ) : <span className="text-muted small">No file</span>}
                  </td>
                  <td>
                    <div className="btn-group">
                      <button 
                        onClick={() => initiateAction(proj, 'Approved')} 
                        className="btn btn-success btn-sm"
                      >
                        <FaCheck/> Approve
                      </button>
                      <button 
                        onClick={() => initiateAction(proj, 'Rejected')} 
                        className="btn btn-danger btn-sm"
                      >
                        <FaTimes/> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- DECISION POPUP (Modal) --- */}
      {selectedProject && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{background: "rgba(0,0,0,0.6)", zIndex: 1000}}>
          <div className="glass-card p-4" style={{maxWidth: "500px", background: "white", color: "#333"}}>
            <h4 className={`mb-3 fw-bold ${actionType === 'Approved' ? 'text-success' : 'text-danger'}`}>
              {actionType === 'Approved' ? <FaCheck className="me-2"/> : <FaTimes className="me-2"/>}
              {actionType} Project
            </h4>
            <p>You are about to <strong>{actionType}</strong> the thesis for <span className="fw-bold text-navy">{selectedProject.studentName}</span>.</p>
            
            <label className="form-label fw-bold">Reason / Feedback:</label>
            <textarea 
              className="form-control mb-3" 
              rows="4" 
              placeholder={`Why is this being ${actionType.toLowerCase()}? (e.g., "Formatting needs work", "Great job!")`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={() => setSelectedProject(null)}>Cancel</button>
              <button className={`btn ${actionType === 'Approved' ? 'btn-success' : 'btn-danger'}`} onClick={submitDecision}>
                Confirm Decision
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
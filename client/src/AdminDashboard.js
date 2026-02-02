import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserGraduate, FaCheck, FaTimes, FaFileAlt, FaComments } from "react-icons/fa";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [actionType, setActionType] = useState(""); 
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  
  const API_URL = "https://cothm-research-portal.onrender.com";

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects/all`);
      console.log("✅ Projects loaded:", res.data.length);
      setProjects(res.data);
    } catch (err) { 
      console.error("❌ Error fetching projects:", err); 
      alert("Failed to load projects. Make sure server is running.");
    }
  };

  const initiateAction = (project, type) => {
    setSelectedProject(project);
    setActionType(type);
    setComment(""); 
  };

  const submitDecision = async () => {
    if (!comment.trim()) {
      alert("⚠️ Please write feedback before submitting.");
      return;
    }
    
    setLoading(true);

    try {
      console.log("📤 Sending:", {
        email: selectedProject.studentEmail,
        status: actionType,
        comment: comment
      });

      // SINGLE API CALL - Sends everything at once
      const response = await axios.post(`${API_URL}/api/admin/update`, { 
        email: selectedProject.studentEmail, 
        status: actionType,
        comment: comment
      });

      console.log("✅ Server response:", response.data);
      alert(`✅ Project ${actionType} successfully!`);
      
      setSelectedProject(null); 
      setComment("");
      fetchProjects(); // Refresh the list
      
    } catch (err) {
      console.error("❌ Decision Error:", err);
      console.error("Error details:", err.response?.data);
      
      const errorMsg = err.response?.data?.error || err.message || "Unknown error";
      alert(`❌ Failed to ${actionType.toLowerCase()} project.\n\nError: ${errorMsg}\n\nCheck console for details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container dashboard-container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white fw-bold">🎓 Supervisor Control Panel</h2>
        <button onClick={fetchProjects} className="btn btn-outline-light btn-sm">
          🔄 Refresh
        </button>
      </div>
      
      <div className="card-dashboard">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th className="p-3">Student</th>
                <th>Course/Batch</th>
                <th>Status</th>
                <th>Feedback</th>
                <th>Submission</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted p-5">
                    📭 No projects submitted yet
                  </td>
                </tr>
              ) : (
                projects.map((proj, i) => (
                  <tr key={i}>
                    <td className="p-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                             style={{width: '40px', height: '40px', fontSize: '14px'}}>
                          <FaUserGraduate/>
                        </div>
                        <div>
                          <div className="fw-bold text-navy">{proj.studentName}</div>
                          <small className="text-muted">{proj.studentEmail}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <small className="text-muted">
                        {proj.course || 'N/A'}<br/>
                        Batch: {proj.batchNumber || 'N/A'}
                      </small>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${
                        proj.status === 'Approved' ? 'bg-success' : 
                        proj.status === 'Rejected' ? 'bg-danger' : 
                        'bg-warning text-dark'
                      }`}>
                        {proj.status}
                      </span>
                    </td>
                    <td style={{maxWidth: '200px'}}>
                      {proj.feedback ? (
                        <div className="small">
                          <FaComments className="text-primary me-1"/>
                          {proj.feedback.length > 50 
                            ? proj.feedback.substring(0, 50) + "..." 
                            : proj.feedback}
                        </div>
                      ) : (
                        <small className="text-muted fst-italic">No feedback yet</small>
                      )}
                    </td>
                    <td>
                      {proj.submissions && proj.submissions.length > 0 ? (
                        <a href={proj.submissions[proj.submissions.length-1].fileUrl} 
                           target="_blank" 
                           rel="noreferrer" 
                           className="btn btn-sm btn-outline-primary">
                          <FaFileAlt className="me-1"/> View
                        </a>
                      ) : (
                        <span className="text-muted small">No file</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          onClick={() => initiateAction(proj, 'Approved')} 
                          className="btn btn-success"
                          disabled={proj.status === 'Approved'}
                        >
                          <FaCheck/> Approve
                        </button>
                        <button 
                          onClick={() => initiateAction(proj, 'Rejected')} 
                          className="btn btn-danger"
                          disabled={proj.status === 'Rejected'}
                        >
                          <FaTimes/> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DECISION MODAL */}
      {selectedProject && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
          style={{background: "rgba(0,0,0,0.7)", zIndex: 1050}}
          onClick={() => !loading && setSelectedProject(null)}
        >
          <div 
            className="bg-white p-4 rounded-4 shadow-lg" 
            style={{maxWidth: "550px", width: "90%"}}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className={`mb-3 fw-bold ${actionType === 'Approved' ? 'text-success' : 'text-danger'}`}>
              {actionType === 'Approved' ? <FaCheck className="me-2"/> : <FaTimes className="me-2"/>}
              {actionType} Project
            </h4>
            
            <div className="alert alert-info mb-3">
              <strong>Student:</strong> {selectedProject.studentName}<br/>
              <strong>Email:</strong> {selectedProject.studentEmail}
            </div>
            
            <label className="form-label fw-bold">
              {actionType === 'Approved' ? 'Approval Comments:' : 'Rejection Reason:'}
            </label>
            <textarea 
              className="form-control mb-3" 
              rows="5" 
              placeholder={actionType === 'Approved' 
                ? "Write your approval comments and feedback..." 
                : "Explain why this project needs revision..."}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={loading}
              autoFocus
            ></textarea>

            <div className="d-flex justify-content-end gap-2">
              <button 
                className="btn btn-secondary" 
                onClick={() => setSelectedProject(null)} 
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className={`btn ${actionType === 'Approved' ? 'btn-success' : 'btn-danger'}`} 
                onClick={submitDecision} 
                disabled={loading || !comment.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Processing...
                  </>
                ) : (
                  `Confirm ${actionType}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
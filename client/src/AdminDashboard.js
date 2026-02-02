import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserGraduate, FaCheck, FaTimes, FaFileAlt, FaComments, FaClock } from "react-icons/fa";

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
      setProjects(res.data);
    } catch (err) { 
      console.error("Error fetching projects:", err); 
    }
  };

  const initiateAction = (project, type) => {
    setSelectedProject(project);
    setActionType(type);
    setComment(""); 
  };

  const submitDecision = async () => {
    if (!comment.trim()) {
      alert("⚠️ Please provide a reason or feedback for this decision.");
      return;
    }
    
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/admin/update`, { 
        email: selectedProject.studentEmail, 
        status: actionType,
        comment: comment
      });

      alert(`✅ Project ${actionType} successfully! Student will be notified.`);
      setSelectedProject(null); 
      setComment("");
      fetchProjects(); 
    } catch (err) {
      console.error("Decision Error:", err);
      alert("❌ Failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container dashboard-container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white fw-bold">🎓 Supervisor Dashboard</h2>
        <button onClick={fetchProjects} className="btn btn-outline-light btn-sm">
          🔄 Refresh
        </button>
      </div>
      
      <div className="card-dashboard">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th className="p-3">Student Information</th>
                <th>Status</th>
                <th>Supervisor Feedback</th>
                <th>Submitted File</th>
                <th className="text-center">Review Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted p-5">
                    📭 No project submissions yet
                  </td>
                </tr>
              ) : (
                projects.map((proj, i) => (
                  <tr key={i}>
                    <td className="p-3">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                             style={{width: '45px', height: '45px'}}>
                          <FaUserGraduate size={20}/>
                        </div>
                        <div>
                          <div className="fw-bold text-navy">{proj.studentName}</div>
                          <small className="text-muted d-block">{proj.studentEmail}</small>
                          <small className="text-muted">
                            {proj.course} | Batch: {proj.batchNumber}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${
                        proj.status === 'Approved' ? 'bg-success' : 
                        proj.status === 'Rejected' ? 'bg-danger' : 
                        'bg-warning text-dark'
                      }`}>
                        {proj.status === 'Pending Review' && <FaClock className="me-1"/>}
                        {proj.status === 'Approved' && <FaCheck className="me-1"/>}
                        {proj.status === 'Rejected' && <FaTimes className="me-1"/>}
                        {proj.status}
                      </span>
                    </td>
                    <td style={{maxWidth: '300px'}}>
                      {proj.feedback ? (
                        <div className="small bg-light p-2 rounded">
                          <FaComments className="text-primary me-1"/>
                          <strong>Your Feedback:</strong><br/>
                          <span className="text-muted">
                            {proj.feedback.length > 80 
                              ? proj.feedback.substring(0, 80) + "..." 
                              : proj.feedback}
                          </span>
                        </div>
                      ) : (
                        <small className="text-muted fst-italic">No feedback provided yet</small>
                      )}
                    </td>
                    <td>
                      {proj.submissions && proj.submissions.length > 0 ? (
                        <div>
                          <a href={proj.submissions[proj.submissions.length-1].fileUrl} 
                             target="_blank" 
                             rel="noreferrer" 
                             className="btn btn-sm btn-outline-primary">
                            <FaFileAlt className="me-1"/> View Submission
                          </a>
                          <div className="small text-muted mt-1">
                            {new Date(proj.submissions[proj.submissions.length-1].date).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted small">No file submitted</span>
                      )}
                    </td>
                    <td className="text-center">
                      {proj.status === 'Pending Review' ? (
                        <div className="btn-group-vertical btn-group-sm gap-2">
                          <button 
                            onClick={() => initiateAction(proj, 'Approved')} 
                            className="btn btn-success"
                          >
                            <FaCheck className="me-1"/> Approve
                          </button>
                          <button 
                            onClick={() => initiateAction(proj, 'Rejected')} 
                            className="btn btn-danger"
                          >
                            <FaTimes className="me-1"/> Reject
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => initiateAction(proj, proj.status === 'Approved' ? 'Rejected' : 'Approved')} 
                          className="btn btn-sm btn-outline-secondary"
                        >
                          Change Decision
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REVIEW MODAL */}
      {selectedProject && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
          style={{background: "rgba(0,0,0,0.75)", zIndex: 1050}}
          onClick={() => !loading && setSelectedProject(null)}
        >
          <div 
            className="bg-white p-4 rounded-4 shadow-lg" 
            style={{maxWidth: "600px", width: "90%"}}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className={`mb-3 fw-bold ${actionType === 'Approved' ? 'text-success' : 'text-danger'}`}>
              {actionType === 'Approved' ? (
                <>
                  <FaCheck className="me-2"/> Approve Project
                </>
              ) : (
                <>
                  <FaTimes className="me-2"/> Reject Project
                </>
              )}
            </h4>
            
            <div className="alert alert-info mb-3">
              <strong>Student:</strong> {selectedProject.studentName}<br/>
              <strong>Email:</strong> {selectedProject.studentEmail}<br/>
              <strong>Course:</strong> {selectedProject.course} | <strong>Batch:</strong> {selectedProject.batchNumber}
            </div>

            {selectedProject.feedback && (
              <div className="alert alert-warning mb-3">
                <strong>Previous Feedback:</strong><br/>
                <small>{selectedProject.feedback}</small>
              </div>
            )}
            
            <label className="form-label fw-bold">
              {actionType === 'Approved' ? (
                <>
                  <FaCheck className="text-success me-2"/>
                  Approval Comments & Suggestions:
                </>
              ) : (
                <>
                  <FaTimes className="text-danger me-2"/>
                  Rejection Reason & Required Changes:
                </>
              )}
            </label>
            <textarea 
              className="form-control mb-3" 
              rows="6" 
              placeholder={actionType === 'Approved' 
                ? "Provide positive feedback and any suggestions for future improvements..." 
                : "Clearly explain what needs to be improved or corrected. Be specific so the student knows what to fix..."}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={loading}
              autoFocus
            ></textarea>

            <div className="alert alert-light small mb-3">
              <strong>Note:</strong> The student will see this feedback on their dashboard along with the status update.
            </div>

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
                  <>
                    Confirm {actionType}
                  </>
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
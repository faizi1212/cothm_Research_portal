import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFileUpload, FaCheck, FaTimes, FaClock, FaComments, FaFileAlt } from "react-icons/fa";

const PortalDashboard = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStage, setUploadStage] = useState("");
  
  const API_URL = "https://cothm-research-portal.onrender.com";
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchMyProject();
  }, []);

  const fetchMyProject = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects/my-projects?email=${user.email}`);
      if (res.data && res.data.length > 0) {
        setProject(res.data[0]);
      }
    } catch (err) {
      console.error("Error fetching project:", err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    if (!uploadStage) {
      alert("Please select a submission stage");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("studentEmail", user.email);
      formData.append("studentName", `${user.firstName} ${user.lastName}`);
      formData.append("stage", uploadStage);
      formData.append("course", user.course || "N/A");
      formData.append("batchNumber", user.batchNumber || "N/A");

      await axios.post(`${API_URL}/api/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("✅ File submitted successfully! Status changed to 'Pending Review'");
      setFile(null);
      setUploadStage("");
      fetchMyProject();
      
    } catch (err) {
      console.error("Upload error:", err);
      alert("❌ Upload failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <FaCheck className="text-success"/>;
      case 'Rejected': return <FaTimes className="text-danger"/>;
      case 'Pending Review': return <FaClock className="text-warning"/>;
      default: return <FaClock className="text-muted"/>;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Approved': return 'bg-success';
      case 'Rejected': return 'bg-danger';
      case 'Pending Review': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container dashboard-container py-4">
      <h2 className="text-white fw-bold mb-4">
        📚 My Research Project
      </h2>

      {/* PROJECT STATUS CARD */}
      {project && (
        <div className="card mb-4 shadow-sm">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              {getStatusIcon(project.status)} Project Status
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p><strong>Student:</strong> {project.studentName}</p>
                <p><strong>Email:</strong> {project.studentEmail}</p>
                <p><strong>Course:</strong> {project.course}</p>
                <p><strong>Batch:</strong> {project.batchNumber}</p>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <strong>Current Status:</strong><br/>
                  <span className={`badge ${getStatusBadgeClass(project.status)} px-3 py-2 mt-2`}>
                    {getStatusIcon(project.status)} {project.status}
                  </span>
                </div>
                <p className="small text-muted">
                  Last updated: {new Date(project.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* SUPERVISOR FEEDBACK */}
            {project.feedback && (
              <div className="alert alert-info mt-3">
                <h6 className="fw-bold">
                  <FaComments className="me-2"/>
                  Supervisor Feedback:
                </h6>
                <p className="mb-0" style={{whiteSpace: 'pre-wrap'}}>
                  {project.feedback}
                </p>
              </div>
            )}

            {/* SUBMISSION HISTORY */}
            {project.submissions && project.submissions.length > 0 && (
              <div className="mt-4">
                <h6 className="fw-bold mb-3">
                  <FaFileAlt className="me-2"/>
                  Submission History:
                </h6>
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Stage</th>
                        <th>File</th>
                        <th>Submitted On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.submissions.map((sub, idx) => (
                        <tr key={idx}>
                          <td>{sub.stage}</td>
                          <td>
                            <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
                              <FaFileAlt className="me-1"/> View File
                            </a>
                          </td>
                          <td>{new Date(sub.date).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FILE UPLOAD FORM */}
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">
            <FaFileUpload className="me-2"/>
            {project?.status === 'Rejected' ? 'Resubmit Your Project' : 'Submit New File'}
          </h5>
        </div>
        <div className="card-body">
          {project?.status === 'Rejected' && (
            <div className="alert alert-warning mb-3">
              <strong>⚠️ Resubmission Required</strong><br/>
              Please review the supervisor's feedback above and make the necessary corrections before resubmitting.
            </div>
          )}

          {project?.status === 'Approved' && (
            <div className="alert alert-success mb-3">
              <strong>🎉 Congratulations!</strong><br/>
              Your project has been approved. You can still submit updates if needed.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Submission Stage:</label>
              <select 
                className="form-select" 
                value={uploadStage} 
                onChange={(e) => setUploadStage(e.target.value)}
                required
              >
                <option value="">-- Select Stage --</option>
                <option value="Proposal">Proposal</option>
                <option value="Literature Review">Literature Review</option>
                <option value="Methodology">Methodology</option>
                <option value="Draft Chapter">Draft Chapter</option>
                <option value="Final Submission">Final Submission</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Upload File:</label>
              <input 
                type="file" 
                className="form-control" 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                required
              />
              <small className="text-muted">Accepted formats: PDF, DOC, DOCX</small>
            </div>

            <button 
              type="submit" 
              className="btn btn-success w-100 py-2" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <FaFileUpload className="me-2"/>
                  Submit File
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* HELPFUL INFO */}
      <div className="card mt-4 bg-light">
        <div className="card-body">
          <h6 className="fw-bold">📋 Submission Guidelines:</h6>
          <ul className="mb-0 small">
            <li>All files must be in PDF, DOC, or DOCX format</li>
            <li>Your submission will be set to "Pending Review" after upload</li>
            <li>Check this page regularly for supervisor feedback</li>
            <li>If rejected, review feedback carefully and resubmit with corrections</li>
            <li>You can submit multiple files for different stages</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PortalDashboard;
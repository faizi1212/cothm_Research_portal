import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCloudUploadAlt, FaHistory, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const UserDashboard = () => {
  const [file, setFile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [projectStatus, setProjectStatus] = useState("Not Started");
  const [uploading, setUploading] = useState(false);
  
  // ONLINE SERVER URL
  const API_URL = "https://cothm-research-portal.onrender.com/api/user";
  
  // Get logged in user from local storage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
        fetchSubmissions();
    }
  }, []);

  const fetchSubmissions = async () => {
    try {
      // Fetch Project Status & Submissions
      const res = await axios.get(`${API_URL}/my-project?email=${user.email}`);
      if (res.data) {
          setSubmissions(res.data.submissions || []);
          setProjectStatus(res.data.status || "Pending Review");
      }
    } catch (err) {
      console.log("No previous submissions found.");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", user.email);
    formData.append("studentName", user.name);
    // Send Reg Number & Batch (if they exist in user profile)
    formData.append("regNumber", user.regNumber || "N/A"); 
    formData.append("batch", user.batch || "N/A"); 

    setUploading(true);

    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Thesis Uploaded Successfully!");
      setFile(null);
      fetchSubmissions(); // Refresh the list
    } catch (err) {
      alert("Upload Failed. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
      return <div className="text-white text-center mt-5">Please Login first.</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-bg"></div>
      <div className="container py-5">
        
        {/* HEADER */}
        <div className="row mb-5 align-items-center">
            <div className="col-md-8">
                <h1 className="text-white fw-bold display-5">Welcome, <span className="text-gold">{user.name}</span></h1>
                <p className="text-white-50">Track your thesis submission status.</p>
            </div>
            <div className="col-md-4 text-end">
                <div className="d-inline-block bg-dark border border-secondary p-3 rounded-3 shadow">
                    <div className="text-white-50 small text-uppercase letter-spacing-2">Current Status</div>
                    <div className={`fs-4 fw-bold ${
                        projectStatus === 'Approved' ? 'text-success' : 
                        projectStatus === 'Rejected' ? 'text-danger' : 'text-warning'
                    }`}>
                        {projectStatus.toUpperCase()}
                    </div>
                </div>
            </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="card mb-5 bg-dark border-secondary p-4 shadow-lg">
            <h5 className="text-white mb-4">Thesis Journey</h5>
            <div className="position-relative mx-4 mb-3">
                <div className="progress" style={{height: '6px', background: '#333'}}>
                    <div className="progress-bar" role="progressbar" 
                        style={{
                            width: projectStatus === 'Approved' ? '100%' : projectStatus === 'Rejected' ? '50%' : submissions.length > 0 ? '50%' : '5%',
                            background: projectStatus === 'Approved' ? '#198754' : projectStatus === 'Rejected' ? '#dc3545' : '#ffc107'
                        }}>
                    </div>
                </div>
                
                {/* Steps */}
                <div className="position-absolute top-0 start-0 translate-middle btn btn-sm btn-primary rounded-circle" style={{width: '30px', height:'30px', marginTop: '-10px'}}>1</div>
                <div className={`position-absolute top-0 start-50 translate-middle btn btn-sm rounded-circle ${submissions.length > 0 ? 'btn-warning' : 'btn-secondary'}`} style={{width: '30px', height:'30px', marginTop: '-10px'}}>2</div>
                <div className={`position-absolute top-0 start-100 translate-middle btn btn-sm rounded-circle ${projectStatus === 'Approved' ? 'btn-success' : 'btn-secondary'}`} style={{width: '30px', height:'30px', marginTop: '-10px'}}>3</div>
                
                {/* Labels */}
                <div className="d-flex justify-content-between mt-2 text-white-50 small">
                    <span>Registered</span>
                    <span>In Review</span>
                    <span>Approved</span>
                </div>
            </div>
        </div>

        <div className="row g-4">
            
            {/* UPLOAD CARD */}
            <div className="col-md-6">
                <div className="card h-100 bg-dark border-secondary shadow-lg">
                    <div className="card-header border-secondary bg-transparent py-3">
                        <h5 className="mb-0 text-white"><FaCloudUploadAlt className="me-2 text-warning"/> Submit New Version</h5>
                    </div>
                    <div className="card-body d-flex flex-column justify-content-center p-4">
                        <div className="border border-2 border-secondary border-dashed rounded p-5 text-center mb-4" 
                             style={{borderStyle: 'dashed', background: 'rgba(255,255,255,0.02)'}}>
                            <input 
                                type="file" 
                                className="form-control bg-dark text-white border-secondary mb-3" 
                                onChange={(e) => setFile(e.target.files[0])} 
                                accept=".pdf,.doc,.docx"
                            />
                            <p className="text-muted small mb-0">Allowed: PDF, DOCX (Max 10MB)</p>
                        </div>
                        <button 
                            className="btn btn-cothm w-100 py-3 fw-bold text-uppercase" 
                            onClick={handleUpload} 
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Upload Thesis"}
                        </button>
                    </div>
                </div>
            </div>

            {/* HISTORY CARD */}
            <div className="col-md-6">
                <div className="card h-100 bg-dark border-secondary shadow-lg">
                    <div className="card-header border-secondary bg-transparent py-3">
                        <h5 className="mb-0 text-white"><FaHistory className="me-2 text-info"/> Submission History</h5>
                    </div>
                    <div className="card-body p-0">
                        {submissions.length === 0 ? (
                            <div className="text-center p-5 text-secondary">
                                <p>No files uploaded yet.</p>
                            </div>
                        ) : (
                            <div className="list-group list-group-flush">
                                {submissions.slice().reverse().map((sub, index) => (
                                    <div key={index} className="list-group-item bg-transparent border-secondary text-white d-flex justify-content-between align-items-center p-3">
                                        <div>
                                            <div className="fw-bold text-white">Version {submissions.length - index}</div>
                                            <div className="small text-secondary">
                                                <FaClock className="me-1"/> 
                                                {new Date(sub.submittedAt).toLocaleDateString()} at {new Date(sub.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                        </div>
                                        <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light rounded-pill px-3">
                                            Download
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCloudUploadAlt, FaHistory, FaFileAlt } from "react-icons/fa";

const PortalDashboard = () => {
  const [file, setFile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [projectStatus, setProjectStatus] = useState("Not Started");
  const [uploading, setUploading] = useState(false);
  
  const API_URL = "https://cothm-research-portal.onrender.com";
  
  // 1. Get User
  const user = JSON.parse(localStorage.getItem("user"));

  // 2. Logic to Fix "Undefined" Name
  const getDisplayName = () => {
    if (!user) return "Student";
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.name) return user.name;
    // Last resort: use email prefix
    if (user.email) return user.email.split('@')[0];
    return "Student";
  };

  // 3. Safety Check
  if (!user) {
      window.location.href = "/";
      return null;
  }

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/status/${user.email}`);
        if (res.data) {
            setSubmissions(res.data.submissions || []);
            setProjectStatus(res.data.status || "Pending Review");
        }
      } catch (err) { console.log("No data found"); }
    };
    fetchSubmissions();
  }, [user.email]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentEmail", user.email);
    formData.append("studentName", getDisplayName()); // Send corrected name
    formData.append("stage", "Thesis Submission");

    setUploading(true);

    try {
      await axios.post(`${API_URL}/api/submit`, formData);
      alert("✅ Upload Successful!");
      setFile(null);
      window.location.reload(); // Refresh to see changes
    } catch (err) {
      alert("Upload Failed: " + (err.response?.data?.error || "Server Error"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard-container container">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          
          {/* WELCOME HEADER */}
          <div className="card-dashboard mb-4">
            <div className="card-body p-5 text-center">
              <h1 className="fw-bold text-navy">Welcome, <span className="text-gold">{getDisplayName()}</span></h1>
              <p className="text-muted">Manage your thesis submissions and track status.</p>
              
              <div className="d-inline-block px-4 py-2 rounded-pill bg-light border border-warning mt-3">
                <span className="fw-bold text-navy">Current Status: </span>
                <span className={`fw-bold ${projectStatus === 'Approved' ? 'text-success' : 'text-warning'}`}>
                  {projectStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* UPLOAD SECTION */}
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card-dashboard h-100">
                <div className="card-header-custom"><FaCloudUploadAlt className="me-2"/> Submit New Document</div>
                <div className="card-body p-4 text-center">
                  <div className="border border-2 border-light border-dashed rounded p-4 mb-3">
                     <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
                  </div>
                  <button className="btn-primary-custom" onClick={handleUpload} disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload Thesis"}
                  </button>
                </div>
              </div>
            </div>

            {/* HISTORY SECTION */}
            <div className="col-md-6">
              <div className="card-dashboard h-100">
                <div className="card-header-custom"><FaHistory className="me-2"/> Submission History</div>
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    {submissions.length === 0 ? (
                      <li className="list-group-item p-4 text-center text-muted">No submissions yet.</li>
                    ) : (
                      submissions.slice().reverse().map((sub, index) => (
                        <li key={index} className="list-group-item p-3 d-flex justify-content-between align-items-center">
                           <div>
                             <div className="fw-bold text-navy">Version {submissions.length - index}</div>
                             <small className="text-muted">{new Date(sub.submittedAt).toLocaleDateString()}</small>
                           </div>
                           <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
                             <FaFileAlt/> View
                           </a>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PortalDashboard;
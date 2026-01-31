import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCloudUploadAlt, FaHistory, FaClock } from "react-icons/fa";

const PortalDashboard = () => {
  const [file, setFile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [projectStatus, setProjectStatus] = useState("Not Started");
  const [uploading, setUploading] = useState(false);
  
  // ONLINE SERVER URL
  const API_URL = "https://cothm-research-portal.onrender.com/api/user";
  
  const user = JSON.parse(localStorage.getItem("user"));

  // SAFETY CHECK
  if (!user) {
      return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white">
            <div className="text-center">
                <h2>Access Denied</h2>
                <a href="/" className="btn btn-warning">Go to Login</a>
            </div>
        </div>
      );
  }

  useEffect(() => {
    if (user) fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(`${API_URL}/my-project?email=${user.email}`);
      if (res.data) {
          setSubmissions(res.data.submissions || []);
          setProjectStatus(res.data.status || "Pending Review");
      }
    } catch (err) { console.log("No submissions found."); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", user.email);
    formData.append("studentName", user.name);
    formData.append("regNumber", user.regNumber || "N/A"); 
    formData.append("batch", user.batch || "N/A"); 

    setUploading(true);

    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Upload Successful!");
      setFile(null);
      fetchSubmissions();
    } catch (err) {
      alert("Upload Failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-bg"></div>
      <div className="container py-5">
        <div className="row mb-5 align-items-center">
            <div className="col-md-8">
                <h1 className="text-white fw-bold">Welcome, <span className="text-gold">{user.name}</span></h1>
            </div>
            <div className="col-md-4 text-end">
                <div className="badge bg-dark border border-secondary p-3">
                    <div className="fs-5 fw-bold text-warning">{projectStatus.toUpperCase()}</div>
                </div>
            </div>
        </div>

        {/* UPLOAD SECTION */}
        <div className="card bg-dark border-secondary shadow-lg p-4">
            <h5 className="text-white mb-4"><FaCloudUploadAlt className="me-2"/> Submit Thesis</h5>
            <input type="file" className="form-control bg-dark text-white border-secondary mb-3" 
                   onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.doc,.docx"/>
            <button className="btn btn-warning w-100 fw-bold" onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Now"}
            </button>
        </div>

        {/* HISTORY SECTION */}
        <div className="mt-5">
            <h5 className="text-white"><FaHistory className="me-2"/> History</h5>
            <div className="list-group">
                {submissions.slice().reverse().map((sub, index) => (
                    <div key={index} className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between p-3">
                        <span>Version {submissions.length - index}</span>
                        <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light">Download</a>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PortalDashboard;
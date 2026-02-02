import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCloudUploadAlt, FaFilePdf, FaUserGraduate } from "react-icons/fa";

const PortalDashboard = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState({ user: {}, projects: [] });
  
  // Get User from Storage
  const user = JSON.parse(localStorage.getItem("user"));
  const API_URL = "https://cothm-research-portal.onrender.com"; 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // LOGIC CHECK: If role is Supervisor, get ALL projects. If Student, get MY projects.
      const endpoint = (user.role === "supervisor" || user.role === "admin") 
        ? "/api/projects/all" 
        : `/api/projects/my-projects?email=${user.email}`;

      const res = await axios.get(`${API_URL}${endpoint}`);
      setData({ user: user, projects: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentName", user.firstName + " " + user.lastName);
    formData.append("studentEmail", user.email);
    formData.append("course", user.course || "N/A");
    formData.append("batchNumber", user.batchNumber || "N/A");
    formData.append("stage", "Thesis Submission");

    setUploading(true);
    try {
      await axios.post(`${API_URL}/api/submit`, formData);
      alert("Thesis Uploaded Successfully!");
      setFile(null);
      fetchData(); 
    } catch (err) {
      alert("Upload Failed: " + (err.response?.data?.error || "Error"));
    }
    setUploading(false);
  };

  return (
    <div className="container mt-5 pt-5" style={{ minHeight: "100vh" }}>
      {/* HEADER */}
      <div className="row mb-4 mt-5">
        <div className="col-12 text-center text-white">
          <h1 className="fw-bold text-gold display-5">
            {(user.role === "supervisor" || user.role === "admin") ? "Supervisor Dashboard" : "Student Research Portal"}
          </h1>
          <p className="text-white-50">
            {(user.role === "supervisor" || user.role === "admin")
              ? "View and manage all student submissions below." 
              : "Manage your thesis progress and uploads."}
          </p>
        </div>
      </div>

      {/* UPLOAD SECTION (STUDENTS ONLY) */}
      {user.role === "student" && (
        <div className="row justify-content-center mb-5">
          <div className="col-md-8">
            <div className="card glass-card border-gold p-4 text-center">
              <div className="mb-3">
                <FaCloudUploadAlt size={50} className="text-gold mb-3" />
                <h4 className="text-white">Upload Thesis Document</h4>
              </div>
              <div className="input-group mb-3">
                <input type="file" className="form-control bg-dark text-white border-secondary" onChange={(e) => setFile(e.target.files[0])} />
                <button className="btn btn-gold fw-bold" onClick={handleUpload} disabled={uploading}>
                  {uploading ? "Uploading..." : "Submit File"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROJECTS LIST (SHARED VIEW) */}
      <div className="row">
        <div className="col-12">
          <h3 className="text-white border-bottom border-secondary pb-2 mb-4">
            {(user.role === "supervisor" || user.role === "admin") ? "All Student Submissions" : "My History"}
          </h3>
          
          <div className="row g-4">
            {data.projects.map((proj) => (
              <div className="col-md-6 col-lg-4" key={proj._id}>
                <div className="card h-100 bg-dark border-secondary shadow hover-card">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-gold rounded-circle p-3 me-3">
                        <FaUserGraduate size={20} />
                      </div>
                      <div>
                        <h5 className="card-title text-gold mb-0">{proj.studentName}</h5>
                        <small className="text-white-50 d-block">
                           {proj.course} | Batch {proj.batchNumber}
                        </small>
                      </div>
                    </div>
                    
                    {/* List Submissions */}
                    {proj.submissions && proj.submissions.map((sub, index) => (
                        <div key={index} className="mb-2 p-2 rounded bg-secondary bg-opacity-25">
                            <p className="card-text text-white small mb-1">
                                📄 {sub.fileName}
                            </p>
                            <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-gold btn-sm w-100">
                                Download / View
                            </a>
                        </div>
                    ))}

                    {(!proj.submissions || proj.submissions.length === 0) && (
                        <p className="text-muted small">No files uploaded yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {data.projects.length === 0 && (
              <div className="col-12 text-center text-white-50 py-5">
                <p>No submissions found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalDashboard;
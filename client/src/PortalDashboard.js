import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCloudUploadAlt, FaHistory, FaFileAlt, FaCommentDots, FaInfoCircle } from "react-icons/fa";

const PortalDashboard = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState({ submissions: [], comments: [], status: "Not Started" });
  const [uploading, setUploading] = useState(false);
  
  const API_URL = "https://cothm-research-portal.onrender.com";
  const user = JSON.parse(localStorage.getItem("user"));

  const getDisplayName = () => {
    if (!user) return "Student";
    if (user.firstName) return `${user.firstName} ${user.lastName || ""}`;
    return user.email.split('@')[0];
  };

  if (!user) { window.location.href = "/"; return null; }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/status/${user.email}`);
        if (res.data) setData(res.data);
      } catch (err) { console.log("No data found"); }
    };
    fetchData();
  }, [user.email]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file!");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentEmail", user.email);
    formData.append("studentName", getDisplayName());
    formData.append("stage", "Thesis Submission");
    setUploading(true);
    try {
      await axios.post(`${API_URL}/api/submit`, formData);
      alert("✅ Upload Successful!");
      window.location.reload();
    } catch (err) { alert("Upload Failed"); } finally { setUploading(false); }
  };

  return (
    <div className="dashboard-container container">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          
          {/* HEADER */}
          <div className="card-dashboard mb-4 p-5 text-center">
              <h1 className="fw-bold text-navy">Welcome, <span className="text-gold">{getDisplayName()}</span></h1>
              <div className="d-inline-block px-4 py-2 rounded-pill bg-light border border-warning mt-3">
                <span className="fw-bold text-navy">Current Status: </span>
                <span className={`fw-bold ${data.status === 'Approved' ? 'text-success' : data.status === 'Rejected' ? 'text-danger' : 'text-warning'}`}>
                  {data.status.toUpperCase()}
                </span>
              </div>
          </div>

          {/* SUPERVISOR FEEDBACK SECTION (New) */}
          {data.comments && data.comments.length > 0 && (
             <div className={`card mb-4 border-0 shadow-sm ${data.status === 'Rejected' ? 'bg-danger-subtle' : 'bg-light'}`}>
                 <div className="card-body p-4">
                     <h5 className="card-title fw-bold text-navy border-bottom pb-2">
                       <FaCommentDots className="me-2 text-warning"/> 
                       Supervisor Feedback
                     </h5>
                     <div className="mt-3">
                       {data.comments.slice().reverse().map((c, i) => (
                         <div key={i} className="d-flex align-items-start mb-3">
                           <FaInfoCircle className="mt-1 me-2 text-primary opacity-50"/>
                           <div>
                             <p className="mb-0 fw-bold text-dark">{c.text}</p>
                             <small className="text-muted">{new Date(c.date).toLocaleDateString()} at {new Date(c.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                           </div>
                         </div>
                       ))}
                     </div>
                 </div>
             </div>
          )}

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card-dashboard h-100 p-4 text-center">
                <h5 className="text-navy mb-3"><FaCloudUploadAlt/> Submit Thesis</h5>
                <div className="border border-2 border-light border-dashed rounded p-4 mb-3">
                   <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
                </div>
                <button className="btn-primary-custom" onClick={handleUpload} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload Thesis"}
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card-dashboard h-100 p-4">
                <h5 className="text-navy mb-3"><FaHistory/> History</h5>
                <ul className="list-group list-group-flush">
                   {data.submissions?.slice().reverse().map((sub, i) => (
                      <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                         <span>Version {data.submissions.length - i}</span>
                         <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary"><FaFileAlt/> View</a>
                      </li>
                   ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PortalDashboard;
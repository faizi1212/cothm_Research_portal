import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth, signOut } from "./firebase";
import Navbar from "./Navbar";
import Login from "./Login";
import Signup from "./Signup";
import AdminDashboard from "./AdminDashboard";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCloudUploadAlt, FaFilePdf } from "react-icons/fa"; 
import "./App.css";

// 🔐 SUPERVISOR SECURITY CONFIGURATION
const SUPERVISOR_EMAIL = "admin@cothm.edu.pk"; 

// --- SECURITY GUARD COMPONENT ---
const SupervisorRoute = ({ user, children }) => {
    if (!user) return <Navigate to="/login" />;
    if (user.email !== SUPERVISOR_EMAIL) return <Navigate to="/" />;
    return children;
};

// --- STUDENT DASHBOARD ---
const StudentDashboard = ({ user }) => {
    // 1. DEFINING VARIABLES (HOOKS) MUST COME FIRST
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState(null);
    const [studentProfile, setStudentProfile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    // 2. EFFECTS MUST COME NEXT
    useEffect(() => {
        if (user) fetchData(user.email);
    }, [user]);

    // 3. LOGIC & REDIRECTIONS COME LAST
    // If the Admin accidentally logs in here, redirect them to Admin Panel
    if (user.email === SUPERVISOR_EMAIL) return <Navigate to="/admin" />;

    const fetchData = async (email) => {
        try {
            const sRes = await axios.get(`http://192.168.18.131:5000/api/status/${email}`);
            setStatus(sRes.data);
            const pRes = await axios.get(`http://192.168.18.131:5000/api/profile/${email}`);
            setStudentProfile(pRes.data);
        } catch (err) { console.error(err); }
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a file.");
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("studentEmail", user.email);
        formData.append("studentName", user.displayName);
        formData.append("stage", "Final Thesis");

        try {
            await axios.post("http://192.168.18.131:5000/api/submit", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (e) => setProgress(Math.round((e.loaded / e.total) * 100))
            });
            alert("✅ Thesis Uploaded Successfully!");
            setFile(null);
            fetchData(user.email);
        } catch (error) { alert("Upload Failed."); }
        setUploading(false);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-bg"></div>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card auth-card mb-3 text-center p-4">
                            <h2 className="cothm-title">Welcome, {user.displayName}</h2>
                            <p className="text-white-50">Student Research Panel</p>
                        </div>

                        {/* PROFILE & STATUS */}
                        {studentProfile && (
                            <div className="card auth-card mb-4 p-3">
                                <div className="row text-center">
                                    <div className="col-4 border-end border-secondary">
                                        <small className="text-white-50 d-block">Reg No</small>
                                        <strong className="text-gold">{studentProfile.regNumber}</strong>
                                    </div>
                                    <div className="col-4 border-end border-secondary">
                                        <small className="text-white-50 d-block">Batch</small>
                                        <strong className="text-white">{studentProfile.program}</strong>
                                    </div>
                                    <div className="col-4">
                                        <small className="text-white-50 d-block">Status</small>
                                        <strong className={status?.status === 'Approved' ? "text-success" : "text-warning"}>{status?.status || "Pending"}</strong>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* UPLOAD BOX */}
                        <div className="card auth-card p-4">
                            <h4 className="text-gold mb-3">Upload Thesis</h4>
                            <div className="upload-box text-center p-4 mb-3" style={{border: '2px dashed #d4af37', borderRadius: '10px', background: 'rgba(255,255,255,0.05)'}}>
                                <input type="file" id="fileInput" className="d-none" onChange={(e) => setFile(e.target.files[0])} />
                                <label htmlFor="fileInput" style={{cursor: 'pointer', width: '100%'}}>
                                    {file ? <h5 className="text-white">{file.name}</h5> : <div><FaCloudUploadAlt size={40} className="text-gold mb-2"/><h5 className="text-white">Select File</h5></div>}
                                </label>
                            </div>
                            {uploading && <div className="progress mb-3" style={{height:'20px'}}><div className="progress-bar bg-success" style={{width:`${progress}%`}}>{progress}%</div></div>}
                            <button className="btn btn-cothm w-100 rounded-pill" onClick={handleUpload} disabled={uploading}>
                                {uploading ? "Uploading..." : "UPLOAD THESIS"}
                            </button>
                        </div>
                        <div className="text-center mt-4"><button className="btn btn-outline-light btn-sm" onClick={() => signOut(auth)}>Sign Out</button></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center mt-5 text-white">Loading Portal...</div>;

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={user ? <StudentDashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        
        {/* 🔐 SECURE ADMIN ROUTE */}
        <Route path="/admin" element={
            <SupervisorRoute user={user}>
                <AdminDashboard />
            </SupervisorRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
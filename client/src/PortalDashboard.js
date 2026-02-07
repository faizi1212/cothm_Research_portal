import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaFileUpload, FaCheck, FaTimes, FaClock, FaComments, FaFileAlt, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from './logo.png';

const PortalDashboard = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStage, setUploadStage] = useState("");
  
  const API_URL = "https://cothm-research-portal.onrender.com";
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

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

      alert("✅ File submitted successfully!");
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return '#10b981';
      case 'Rejected': return '#ef4444';
      case 'Pending Review': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <img src={logo} alt="COTHM" style={styles.headerLogo} />
          <div>
            <h1 style={styles.headerTitle}>Research Portal</h1>
            <p style={styles.headerSubtitle}>COTHM</p>
          </div>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <FaSignOutAlt /> Logout
        </button>
      </header>

      <div style={styles.content}>
        {/* Welcome Banner */}
        <div style={styles.welcomeBanner}>
          <div>
            <h2 style={styles.welcomeTitle}>Welcome, {user.firstName}! 👋</h2>
            <p style={styles.welcomeSubtitle}>Track your research progress and submit your work</p>
          </div>
        </div>

        {/* Status Card */}
        {project && (
          <div style={styles.statusCard}>
            <div style={styles.statusHeader}>
              <h3 style={styles.sectionTitle}>📊 Project Status</h3>
            </div>
            <div style={styles.statusBody}>
              <div style={{...styles.statusBadge, background: getStatusColor(project.status)}}>
                {project.status === 'Pending Review' && <FaClock />}
                {project.status === 'Approved' && <FaCheck />}
                {project.status === 'Rejected' && <FaTimes />}
                <span style={{marginLeft: '8px'}}>{project.status}</span>
              </div>

              {project.feedback && (
                <div style={styles.feedbackBox}>
                  <div style={styles.feedbackHeader}>
                    <FaComments style={{color: '#667eea'}} />
                    <span style={styles.feedbackTitle}>Supervisor Feedback</span>
                  </div>
                  <p style={styles.feedbackText}>{project.feedback}</p>
                </div>
              )}

              {project.submissions && project.submissions.length > 0 && (
                <div style={styles.submissionHistory}>
                  <h4 style={styles.historyTitle}>📁 Submission History</h4>
                  <div style={styles.historyList}>
                    {project.submissions.map((sub, idx) => (
                      <div key={idx} style={styles.historyItem}>
                        <div style={styles.historyInfo}>
                          <FaFileAlt style={{color: '#667eea'}} />
                          <span style={styles.historyStage}>{sub.stage}</span>
                          <span style={styles.historyDate}>
                            {new Date(sub.date).toLocaleDateString()}
                          </span>
                        </div>
                        <a href={sub.fileUrl} target="_blank" rel="noreferrer" style={styles.viewBtn}>
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload Card */}
        <div style={styles.uploadCard}>
          <div style={styles.uploadHeader}>
            <FaFileUpload style={{fontSize: '24px', color: '#667eea'}} />
            <h3 style={styles.sectionTitle}>Submit New File</h3>
          </div>
          
          {project?.status === 'Rejected' && (
            <div style={styles.warningBox}>
              <span style={{fontSize: '20px'}}>⚠️</span>
              <div>
                <strong>Resubmission Required</strong>
                <p style={{margin: '5px 0 0 0', fontSize: '14px'}}>
                  Please review supervisor feedback and make necessary corrections
                </p>
              </div>
            </div>
          )}

          {project?.status === 'Approved' && (
            <div style={styles.successBox}>
              <span style={{fontSize: '20px'}}>🎉</span>
              <div>
                <strong>Congratulations!</strong>
                <p style={{margin: '5px 0 0 0', fontSize: '14px'}}>
                  Your project has been approved
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.uploadForm}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Submission Stage</label>
              <select 
                value={uploadStage} 
                onChange={(e) => setUploadStage(e.target.value)}
                style={styles.select}
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

            <div style={styles.formGroup}>
              <label style={styles.label}>Choose File</label>
              <div style={styles.fileInputWrapper}>
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  required
                  style={styles.fileInput}
                  id="fileInput"
                />
                <label htmlFor="fileInput" style={styles.fileLabel}>
                  {file ? file.name : 'Choose PDF, DOC, or DOCX file'}
                </label>
              </div>
              <small style={styles.hint}>Maximum file size: 10MB</small>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={loading ? {...styles.submitBtn, opacity: 0.7} : styles.submitBtn}
            >
              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  Uploading...
                </>
              ) : (
                <>
                  <FaFileUpload /> Submit File
                </>
              )}
            </button>
          </form>
        </div>

        {/* Guidelines */}
        <div style={styles.guidelinesCard}>
          <h4 style={styles.guidelinesTitle}>📋 Submission Guidelines</h4>
          <ul style={styles.guidelinesList}>
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

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  headerLogo: {
    height: '50px',
    filter: 'brightness(0) invert(1)',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: '800',
    margin: 0,
  },
  headerSubtitle: {
    fontSize: '14px',
    opacity: 0.9,
    margin: 0,
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  welcomeBanner: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '40px',
    borderRadius: '16px',
    marginBottom: '30px',
    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
  },
  welcomeTitle: {
    fontSize: '32px',
    fontWeight: '800',
    margin: '0 0 10px 0',
  },
  welcomeSubtitle: {
    fontSize: '16px',
    opacity: 0.9,
    margin: 0,
  },
  statusCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  statusHeader: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
  },
  statusBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '12px 24px',
    borderRadius: '30px',
    color: 'white',
    fontWeight: '700',
    fontSize: '16px',
    alignSelf: 'flex-start',
  },
  feedbackBox: {
    background: '#f8f9ff',
    border: '2px solid #e0e7ff',
    borderRadius: '12px',
    padding: '20px',
  },
  feedbackHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  feedbackTitle: {
    fontWeight: '700',
    color: '#1a1a2e',
    fontSize: '16px',
  },
  feedbackText: {
    color: '#555',
    lineHeight: '1.6',
    margin: 0,
  },
  submissionHistory: {
    marginTop: '10px',
  },
  historyTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '15px',
    color: '#1a1a2e',
  },
  historyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    background: '#f9fafb',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
  },
  historyInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  historyStage: {
    fontWeight: '600',
    color: '#1a1a2e',
  },
  historyDate: {
    fontSize: '13px',
    color: '#999',
  },
  viewBtn: {
    background: '#667eea',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
  },
  uploadCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  uploadHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '25px',
  },
  warningBox: {
    background: '#fef3c7',
    border: '2px solid #fbbf24',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    color: '#92400e',
  },
  successBox: {
    background: '#d1fae5',
    border: '2px solid #10b981',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    color: '#065f46',
  },
  uploadForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontWeight: '600',
    color: '#333',
    fontSize: '14px',
  },
  select: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '2px solid #e0e0e0',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  fileInputWrapper: {
    position: 'relative',
  },
  fileInput: {
    display: 'none',
  },
  fileLabel: {
    display: 'block',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '2px dashed #e0e0e0',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: '#666',
  },
  hint: {
    fontSize: '13px',
    color: '#999',
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  guidelinesCard: {
    background: '#f0fdf4',
    border: '2px solid #86efac',
    borderRadius: '12px',
    padding: '25px',
  },
  guidelinesTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '15px',
    color: '#166534',
  },
  guidelinesList: {
    margin: 0,
    paddingLeft: '20px',
    color: '#166534',
    lineHeight: '1.8',
  },
};

const styleTag = document.createElement("style");
styleTag.innerHTML = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  select:focus, input:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
  }

  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5) !important;
  }

  label[for="fileInput"]:hover {
    border-color: #667eea !important;
    background: #f8f9ff !important;
  }
`;
document.head.appendChild(styleTag);

export default PortalDashboard;
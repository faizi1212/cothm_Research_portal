import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from './firebase';
import { useNavigate, Link } from 'react-router-dom';
import { FaLock, FaEnvelope } from 'react-icons/fa'; 
import './App.css'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            setError("Invalid Credentials.");
        }
    };

    return (
        <div>
            {/* 🎥 BACKGROUND VIDEO */}
            <video autoPlay loop muted className="video-bg">
                {/* This is a high-quality Pexels Hospitality Video */}
                <source src="https://videos.pexels.com/video-files/3196344/3196344-hd_1920_1080_25fps.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="auth-wrapper">
                <div className="card auth-card col-md-4 col-sm-10 col-12">
                    
                    <div className="auth-header">
                        <h1 className="cothm-title">COTHM INTERNATIONAL</h1>
                        <span className="cothm-subtitle">Research Portal</span>
                        <p className="portal-tagline text-white-50">Secure Academic Access</p>
                    </div>

                    <div className="card-body p-4">
                        {error && <div className="alert alert-danger text-center small">{error}</div>}

                        <form onSubmit={handleLogin}>
                            <div className="input-group mb-4">
                                <span className="input-group-text"><FaEnvelope size={18} /></span>
                                <input 
                                    type="email" className="form-control" placeholder="Student Email"
                                    value={email} onChange={(e) => setEmail(e.target.value)} required 
                                />
                            </div>

                            <div className="input-group mb-4">
                                <span className="input-group-text"><FaLock size={18} /></span>
                                <input 
                                    type="password" className="form-control" placeholder="Password"
                                    value={password} onChange={(e) => setPassword(e.target.value)} required 
                                />
                            </div>

                            <button type="submit" className="btn btn-cothm w-100 rounded-pill mb-3">
                                LOGIN TO PORTAL
                            </button>
                        </form>

                        <div className="text-center">
                            <span className="text-white-50 small">New Student? </span>
                            <Link to="/signup" className="link-cothm">Register Here</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
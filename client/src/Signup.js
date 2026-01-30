import React, { useState } from 'react';
import { auth, createUserWithEmailAndPassword, updateProfile } from './firebase';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; 
import { FaUser, FaIdCard, FaGraduationCap, FaEnvelope, FaLock } from 'react-icons/fa';
import './App.css'; 

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', regNumber: '', program: '', email: '', password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        const { firstName, lastName, regNumber, program, email, password } = formData;
        const fullName = `${firstName} ${lastName}`;

        if (!program) { setError("Select Program"); setLoading(false); return; }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: fullName });
            await axios.post('http://localhost:5000/api/register', { email, firstName, lastName, regNumber, program });
            navigate('/'); 
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div>
            {/* 🎥 BACKGROUND VIDEO */}
            <video autoPlay loop muted className="video-bg">
                <source src="https://videos.pexels.com/video-files/3196344/3196344-hd_1920_1080_25fps.mp4" type="video/mp4" />
            </video>

            <div className="auth-wrapper">
                <div className="card auth-card col-lg-6 col-md-8 col-12">
                    
                    <div className="auth-header">
                        <h1 className="cothm-title">COTHM INTERNATIONAL</h1>
                        <span className="cothm-subtitle">Student Registration</span>
                        <p className="portal-tagline text-white-50">Join the Hospitality Network</p>
                    </div>

                    <div className="card-body p-4">
                        {error && <div className="alert alert-danger text-center small">{error}</div>}
                        
                        <form onSubmit={handleSignup}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="input-group">
                                        <span className="input-group-text"><FaUser /></span>
                                        <input type="text" className="form-control" name="firstName" placeholder="First Name" onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="input-group">
                                        <span className="input-group-text"><FaUser /></span>
                                        <input type="text" className="form-control" name="lastName" placeholder="Last Name" onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="input-group">
                                        <span className="input-group-text"><FaIdCard /></span>
                                        <input type="text" className="form-control" name="regNumber" placeholder="Reg No" onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="input-group">
                                        <span className="input-group-text"><FaGraduationCap /></span>
                                        <select className="form-control form-select" name="program" onChange={handleChange} required>
                                            <option value="">Select Batch...</option>
                                            <option value="DHTML">DHTML</option>
                                            <option value="DCA">DCA</option>
                                            <option value="GDICA">GDICA</option>
                                            <option value="DIHO">DIHO</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="input-group">
                                    <span className="input-group-text"><FaEnvelope /></span>
                                    <input type="email" className="form-control" name="email" placeholder="Email Address" onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="input-group">
                                    <span className="input-group-text"><FaLock /></span>
                                    <input type="password" className="form-control" name="password" placeholder="Password" onChange={handleChange} required />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-cothm w-100 rounded-pill mb-3" disabled={loading}>
                                {loading ? "Processing..." : "REGISTER NOW"}
                            </button>
                        </form>

                        <div className="text-center">
                            <span className="text-white-50 small">Already Registered? </span>
                            <Link to="/login" className="link-cothm">Login Here</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
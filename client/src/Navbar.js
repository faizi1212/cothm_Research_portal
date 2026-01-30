import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, signOut } from './firebase';

const Navbar = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top" 
             style={{ background: 'rgba(0,0,0,0.9)', borderBottom: '1px solid #d4af37' }}>
            <div className="container">
                <Link className="navbar-brand text-gold fw-bold" to="/" style={{ letterSpacing: '2px' }}>
                    COTHM RESEARCH
                </Link>
                
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav align-items-center">
                        {!user ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/signup">Register</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item me-3">
                                    <span className="text-white-50 small">Signed in as: </span>
                                    <span className="text-gold fw-bold">{user.displayName}</span>
                                </li>
                                <li className="nav-item">
                                    <button 
                                        className="btn btn-sm btn-outline-warning rounded-pill px-3" 
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                        {/* Hidden link for you to access admin easily */}
                        <li className="nav-item ms-3">
                            <Link className="nav-link small text-secondary" to="/admin">Admin</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
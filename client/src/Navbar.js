import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserGraduate, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaShieldAlt } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Get User Data Safely
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.clear(); // Clear everything
    navigate("/");
  };

  // 2. Fix "Undefined" Name Issue
  const getDisplayName = () => {
    if (!user) return "Guest";
    // Check all possible database fields
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.name) return user.name;
    return "Student"; // Final fallback
  };

  // 3. Check for Admin Role (Case insensitive)
  const isAdmin = user && user.role && user.role.toLowerCase() === 'admin';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-glass sticky-top py-3">
      <div className="container">
        {/* BRAND */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <FaUserGraduate className="me-2 text-warning fs-3"/> 
          <span style={{letterSpacing: "1px"}}>COTHM <span className="text-info">PORTAL</span></span>
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            
            {user ? (
              /* --- LOGGED IN STATE --- */
              <>
                <li className="nav-item text-end me-2">
                  <div className="text-white-50 small" style={{lineHeight: "1"}}>Logged in as</div>
                  <div className="fw-bold text-white">{getDisplayName()}</div>
                </li>

                {/* ADMIN BUTTON - Explicit Check */}
                {isAdmin && (
                   <li className="nav-item">
                     <Link className="btn btn-info btn-sm fw-bold px-3 shadow-sm" to="/admin">
                       <FaShieldAlt className="me-1"/> Admin Panel
                     </Link>
                   </li>
                )}

                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3">
                    <FaSignOutAlt className="me-1"/> Logout
                  </button>
                </li>
              </>
            ) : (
              /* --- LOGGED OUT STATE --- */
              <>
                <li className="nav-item">
                  <Link className={`nav-link fw-bold ${location.pathname === '/' ? 'text-warning' : 'text-white'}`} to="/">
                    <FaSignInAlt className="me-1"/> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-gradient btn-sm rounded-pill px-4 shadow" to="/signup">
                    <FaUserPlus className="me-1"/> Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
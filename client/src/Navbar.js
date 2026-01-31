import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserGraduate, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaShieldAlt } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user data
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Helper to get display name
  const getDisplayName = () => {
    if (!user) return "";
    // Check various name formats to prevent "Undefined"
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.name) return user.name;
    return "Student"; // Fallback
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-black border-bottom border-warning sticky-top" style={{boxShadow: "0 4px 15px rgba(212, 175, 55, 0.2)"}}>
      <div className="container">
        {/* BRAND */}
        <Link className="navbar-brand fw-bold text-warning d-flex align-items-center" to="/" style={{ letterSpacing: "1px" }}>
          <FaUserGraduate className="me-2 fs-4"/> 
          <span>COTHM <span className="text-white">RESEARCH</span></span>
        </Link>

        <button 
          className="navbar-toggler border-secondary" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            
            {user ? (
              <>
                {/* WELCOME MESSAGE */}
                <li className="nav-item">
                  <div className="d-flex flex-column align-items-end me-3">
                    <span className="text-white-50 small" style={{fontSize: "0.75rem"}}>Welcome back,</span>
                    <span className="text-white fw-bold">{getDisplayName()}</span>
                  </div>
                </li>

                {/* ADMIN BUTTON - Only shows if role is 'admin' */}
                {user.role === 'admin' && (
                   <li className="nav-item">
                     <Link className="btn btn-warning btn-sm fw-bold px-3 text-dark d-flex align-items-center" to="/admin">
                       <FaShieldAlt className="me-2"/> Admin Panel
                     </Link>
                   </li>
                )}

                {/* LOGOUT BUTTON */}
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3 d-flex align-items-center">
                    <FaSignOutAlt className="me-2"/> Logout
                  </button>
                </li>
              </>
            ) : (
              /* LOGIN / SIGNUP LINKS */
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === '/' ? 'active text-warning fw-bold' : ''}`} to="/">
                    <FaSignInAlt className="me-1"/> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`btn btn-outline-warning btn-sm rounded-pill px-4 ${location.pathname === '/signup' ? 'active' : ''}`} to="/signup">
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
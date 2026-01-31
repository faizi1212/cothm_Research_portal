import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserGraduate, FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    // 1. Clear user data
    localStorage.removeItem("user");
    // 2. Redirect to Home (Login page)
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
      <div className="container">
        {/* BRAND NAME - Always goes to Home */}
        <Link className="navbar-brand fw-bold text-warning" to="/">
          <FaUserGraduate className="me-2"/> COTHM RESEARCH
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
          <ul className="navbar-nav ms-auto align-items-center">
            
            {/* IF USER IS LOGGED IN: SHOW LOGOUT */}
            {user ? (
              <>
                <li className="nav-item me-3">
                  <span className="text-white-50 small">
                    Hello, <span className="text-white fw-bold">{user.firstName || user.name}</span>
                  </span>
                </li>
                {user.role === 'admin' && (
                   <li className="nav-item">
                     <Link className="nav-link text-info" to="/admin">Admin Panel</Link>
                   </li>
                )}
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3">
                    <FaSignOutAlt className="me-2"/> Logout
                  </button>
                </li>
              </>
            ) : (
              /* IF USER IS NOT LOGGED IN: SHOW LOGIN / SIGNUP */
              <>
                <li className="nav-item">
                  {/* FIX: Link goes to "/" because that is where Login is */}
                  <Link className={`nav-link ${location.pathname === '/' ? 'active text-warning' : ''}`} to="/">
                    <FaSignInAlt className="me-1"/> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === '/signup' ? 'active text-warning' : ''}`} to="/signup">
                    <FaUserPlus className="me-1"/> Signup
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
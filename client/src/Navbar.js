import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top navbar-glass">
      <div className="container-fluid px-3">
        {/* BRAND SECTION */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to={user ? "/dashboard" : "/"}>
          <img 
            src="/logo.png" 
            alt="COTHM Logo" 
            style={{ height: "45px", objectFit: "contain" }} /* Reduced Height */
            className="d-inline-block align-text-top"
          />
          {/* COMPACT TITLE STYLING */}
          <span className="d-none d-sm-block" style={{ 
            fontFamily: "'Poppins', sans-serif", 
            fontWeight: "700", 
            fontSize: "1rem", /* Reduced to 16px (Standard size) */
            letterSpacing: "0.5px",
            background: "linear-gradient(to right, #fff, #c5a059)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            whiteSpace: "nowrap"
          }}>
            COTHM RESEARCH PORTAL
          </span>
        </Link>

        {/* TOGGLE BUTTON */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENU ITEMS */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-3">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-bold text-uppercase small" to="/">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-outline-warning rounded-pill px-4 fw-bold small" to="/signup">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* User Info - Compact Layout */}
                <li className="nav-item text-end d-none d-lg-block">
                  <div className="text-white fw-bold" style={{ fontSize: "0.85rem" }}>
                    Welcome, {user.firstName}
                  </div>
                  <div className="text-warning" style={{ fontSize: "0.7rem" }}>
                    {user.role === "supervisor" ? "SUPERVISOR" : `BATCH ${user.batchNumber || "N/A"}`}
                  </div>
                </li>

                <li className="nav-item">
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-danger btn-sm rounded-pill px-3 d-flex align-items-center gap-2 shadow-sm"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
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
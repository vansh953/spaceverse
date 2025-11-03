import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/home")}>
        🚀SPACEVERSE
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/home">Home</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/earth">Earth</Link>
        <Link to="/projects">Projects</Link>
       
        <Link to="/profile">My Profile</Link>
      </div>

      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </nav>
  );
}

export default Navbar;

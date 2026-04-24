import React from "react";
import "../styles/Navbar.css";
import Logo from "../../assets/logo.png"

function Navbar() {
  return (
    <nav className="navbar">
      <div className="header-left">
        <img
          src={Logo}
          alt="Logo"
          className="logo header-img"
          width="120"
        />
      </div>        

      <ul className="navbar-links">
        <li>Finances</li>
        <li>Productivity</li>
        <li>Opportunities</li>
        <li>Daily Habits</li>
      </ul>

      <button className="navbar-btn">
        Profile
      </button>
    </nav>
  );
}

export default Navbar; 
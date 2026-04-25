import React from "react";
import "../styles/elements/Navbar.css";
import Logo from "../../assets/logo.png"

function Navbar() {
  return (
    <nav className="navbar">

      <div className="navbar-left">
        <img
          src={Logo}
          alt="Logo"
          className="logo header-img"
          width="120"
        />

        <ul className="navbar-links">
          <li>Finances</li>
          <li>Productivity</li>
          <li>Opportunities</li>
          <li>Daily Habits</li>
        </ul>
      </div>

      <button className="navbar-btn">
        Profile
      </button>

    </nav>
  );
}

export default Navbar; 
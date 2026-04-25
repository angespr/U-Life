import React from "react";
import "../styles/startup/Homepage.css";
import Logo from "../../assets/logo.png";

function Homepage() {
  return (
    <div className="home-container">
      <div className="home-card">
        <h2 className="welcome-text">Welcome to</h2>

        <img
          src={Logo}
          alt="Logo"
          className="home-logo"
        />

        <div className="home-buttons">
          <a href="/login" className="btn login-btn">Login</a>
          <a href="/signup" className="btn signup-btn">Sign Up</a>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
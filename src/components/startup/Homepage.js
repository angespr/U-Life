import React from "react";
import { Link } from "react-router-dom";
import "../styles/startup/Homepage.css";
import Logo from "../../assets/logo.png";

function Homepage() {
  return (
    <div className="home-container">
      <div className="home-card">
        <h2 className="welcome-text">Welcome to:</h2>

        <img src={Logo} alt="Logo" className="home-logo" />

        <h3 className="message-text">
          Helping students manage life, deadlines, and everything in between!
        </h3>

        <div className="home-buttons">
          <Link to="/login" className="btn login-btn">
            Login
          </Link>

          <Link to="/signup" className="btn signup-btn">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
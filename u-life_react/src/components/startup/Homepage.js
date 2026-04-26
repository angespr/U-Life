import React from "react";
import { Link } from "react-router-dom";
import "../styles/startup/Homepage.css";
import Logo from "../../assets/logo.png";

function Homepage() {
  const emojis = ["📚", "✨", "🎯", "🏃‍♀️", "🧠", "☕"];

  return (
    <div className="home-container">
      <div className="emoji-layer">
        {Array.from({ length: 25 }).map((_, i) => {
          const emoji = emojis[i % emojis.length];

          return (
            <span
              key={i}
              className="floating-emoji"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${8 + Math.random() * 10}s`,
                fontSize: `${16 + Math.random() * 20}px`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            >
              {emoji}
            </span>
          );
        })}
      </div>

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
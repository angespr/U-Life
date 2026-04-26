import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/startup/Login&Signup.css";
import Logo from "../../assets/logo2.png";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";


function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [showSignupButton, setShowSignupButton] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        formData
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      setMessage("Account not found or password is incorrect.");
      setShowSignupButton(true);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <img src={Logo} alt="Logo" className="auth-logo" />

        <h2 className="auth-title">Login</h2>

        <form onSubmit={handleLogin} className="auth-form">
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" className="primary-btn login-btn">
            Login
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        {showSignupButton && (
          <button
            onClick={() => navigate("/signup")}
            className="secondary-btn"
          >
            Create an account
          </button>
        )}

        <p className="auth-switch-text">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
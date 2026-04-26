import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/startup/Login&Signup.css"
import Logo from "../../assets/logo2.png"

const API_URL = process.env.REACT_APP_API_URL;

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/signup`,
        formData
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      const backendMessage = error.response?.data?.message;

      if (backendMessage === "Email already exists.") {
        setMessage("Account already exists. Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setMessage(backendMessage || "Signup failed.");
      }
    }
  };

return (
    <div className="auth-page">
      <div className="auth-card">

        <img src={Logo} alt="Logo" className="auth-logo" />

        <h2 className="auth-title">Create Account</h2>

        <form onSubmit={handleSignup} className="auth-form">
          <input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />

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

          <button type="submit" className="primary-btn signup-btn">
            Sign Up
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;
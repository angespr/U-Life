import React, { useState } from "react";
import axios from "axios";
import "../styles/startup/Login&Signup.css"
import Logo from "../../assets/logo2.png"

function Signup() {
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
      const response = await axios.post("http://localhost:5000/api/auth/signup", formData);
      setMessage(response.data.message);
    } catch (error) {
      console.log(error);
      console.log(error.response?.data);
      setMessage(error.response?.data?.message || "Signup failed.");
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

        <p className="auth-message">{message}</p>
      </div>
    </div>
  );
}

export default Signup;
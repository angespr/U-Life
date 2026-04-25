import React, { useState } from "react";
import axios from "axios";
import "../styles/startup/Login&Signup.css"
import Logo from "../../assets/logo.png"

function Login({ goToSignup }) {
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
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setMessage("Login successful.");
      setShowSignupButton(false);
    } catch (error) {
      setMessage("Account not found or password is incorrect.");
      setShowSignupButton(true);
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
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

        <button type="submit">Login</button>
      </form>

      <p>{message}</p>

      {showSignupButton && (
        <button onClick={goToSignup}>
          Create an account
        </button>
      )}
    </div>
  );
}

export default Login;
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/elements/Navbar.css";
import Logo from "../../assets/logo.png";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const links = [
    { to: "/productivity", label: "Productivity", icon: "☆" },
    { to: "/opportunities", label: "Opportunities", icon: "⚛" },
    { to: "/habits", label: "Habits", icon: "♡" },
    { to: "/finances", label: "Finances", icon: "$" },
  ];

  return (
    <nav className="navbar">
      <button className="navbar-brand" onClick={() => navigate("/dashboard")}>
        <img src={Logo} alt="U-Life logo" className="navbar-logo-img" />
      </button>

      <div className="navbar-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="navbar-user">
        <NavLink to="/profile" className="profile-pill">
          {user?.name || "Profile"}
        </NavLink>
        <button className="navbar-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
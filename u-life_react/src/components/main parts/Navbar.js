// import React from "react";
// import "../styles/elements/Navbar.css";
// import Logo from "../../assets/logo.png"

// function Navbar() {
//   return (
//     <nav className="navbar">

//       <div className="navbar-left">
//         <img
//           src={Logo}
//           alt="Logo"
//           className="logo header-img"
//           width="120"
//         />

//         <ul className="navbar-links">
//           <li>Finances</li>
//           <li>Productivity</li>
//           <li>Opportunities</li>
//           <li>Daily Habits</li>
//         </ul>
//       </div>

//       <button className="navbar-btn">
//         Profile
//       </button>

//     </nav>
//   );
// }

// export default Navbar; 

import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/elements/Navbar.css";
import Logo from "../../assets/logo.png";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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

      <div className="navbar-user">
        {user && <span className="navbar-user-name">Hi, {user.name}</span>}

        <button className="navbar-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
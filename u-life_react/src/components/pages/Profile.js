import React from "react";
import { useNavigate } from "react-router-dom";
import PageStyle from "../main parts/PageStyle";
import "../styles/pages/FeaturePages.css";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const name = user.name || "User";
  const email = user.email || "No email saved";
  const initial = name.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <PageStyle>
      <div className="page-title-row">
        <div>
          <h1>Profile</h1>
          <p>View your U-Life account information.</p>
        </div>
      </div>

      <section className="profile-card">
        <div className="profile-avatar">{initial}</div>

        <div className="profile-info">
          <p className="eyebrow">Account</p>
          <h2>{name}</h2>
          <p>{email}</p>
        </div>

        <button className="profile-logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </section>
    </PageStyle>
  );
}

export default Profile;
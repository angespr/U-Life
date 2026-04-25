import React from "react";
import { useNavigate } from "react-router-dom";
import PageStyle from "../main parts/PageStyle";
import "../styles/pages/FeaturePages.css";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
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

      <section className="feature-card profile-card">
        <div className="profile-avatar">
          {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
        </div>

        <div>
          <h2>{user?.name || "U-Life User"}</h2>
          <p>{user?.email || "No email saved"}</p>
        </div>

        <button className="danger-button" onClick={logout}>
          Log Out
        </button>
      </section>
    </PageStyle>
  );
}

export default Profile;
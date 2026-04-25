import React, { useState } from "react";
import PageStyle from "../main parts/PageStyle";
import "../styles/pages/FeaturePages.css";

function Groups() {
  const [groups, setGroups] = useState([
    {
      name: "Roommate Budget",
      type: "Budgeting",
      members: 4,
      icon: "$",
    },
    {
      name: "Study Group - CS 101",
      type: "Study",
      members: 6,
      icon: "📖",
    },
    {
      name: "Weekend Adventures",
      type: "Friends",
      members: 8,
      icon: "📅",
    },
    {
      name: "Dorm Floor Chat",
      type: "Chat",
      members: 15,
      icon: "💬",
    },
  ]);

  const addGroup = () => {
    const name = prompt("Group name:");
    if (!name || !name.trim()) return;

    setGroups([
      ...groups,
      {
        name: name.trim(),
        type: "Custom",
        members: 1,
        icon: "👥",
      },
    ]);
  };

  return (
    <PageStyle>
      <div className="page-title-row">
        <div>
          <h1>Groups</h1>
          <p>Manage shared student spaces like budgeting, studying, outings, and chats.</p>
        </div>
        <button className="primary-action" onClick={addGroup}>
          + New Group
        </button>
      </div>

      <div className="group-grid">
        {groups.map((group) => (
          <section key={group.name} className="group-card">
            <div className="group-card-top">
              <div className="resource-icon">{group.icon}</div>
              <span>{group.members} members</span>
            </div>
            <h2>{group.name}</h2>
            <p>{group.type}</p>
          </section>
        ))}
      </div>
    </PageStyle>
  );
}

export default Groups;
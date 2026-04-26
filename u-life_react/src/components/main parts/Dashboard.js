import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageStyle from "./PageStyle";
import { loadULifeData, saveULifeData } from "../../data/ulifeStore";
import "../styles/pages/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(loadULifeData());
  const [activeTab, setActiveTab] = useState("productivity");

  const emojis = ["🔥", "🧠", "⚡", "📚"];
  const [emojiIndex, setEmojiIndex] = useState(
    data.dashboardEmojiIndex || 0
  );

  useEffect(() => {
    const update = () => setData(loadULifeData());
    window.addEventListener("ulifeDataUpdated", update);
    return () => window.removeEventListener("ulifeDataUpdated", update);
  }, []);

  const tabs = [
    { id: "productivity", label: "Productivity", path: "/productivity" },
    { id: "opportunities", label: "Opportunities", path: "/opportunities" },
    { id: "habits", label: "Habits", path: "/habits" },
    { id: "finances", label: "Finances", path: "/finances" },
  ];

  const pinnedItems = useMemo(() => {
    if (activeTab === "productivity") return data.productivityModules.filter((m) => m.pinned);
    if (activeTab === "opportunities") return data.opportunityModules.filter((m) => m.pinned);
    if (activeTab === "habits") return data.habitModules.filter((m) => m.pinned);
    return data.financeGroups.filter((m) => m.pinned);
  }, [activeTab, data]);

  const activePath = tabs.find((tab) => tab.id === activeTab)?.path || "/dashboard";

  const saveEmoji = (index) => {
    const updated = { ...data, dashboardEmojiIndex: index };
    saveULifeData(updated);
    setData(updated);
    setEmojiIndex(index);
  };

  const cycleEmoji = () => {
    const next = (emojiIndex + 1) % emojis.length;
    saveEmoji(next);
  };

  const removePin = (id) => {
    let updated = { ...data };

    if (activeTab === "productivity") {
      updated.productivityModules = data.productivityModules.map((m) =>
        m.id === id ? { ...m, pinned: false } : m
      );
    }

    if (activeTab === "opportunities") {
      updated.opportunityModules = data.opportunityModules.map((m) =>
        m.id === id ? { ...m, pinned: false } : m
      );
    }

    if (activeTab === "habits") {
      updated.habitModules = data.habitModules.map((m) =>
        m.id === id ? { ...m, pinned: false } : m
      );
    }

    if (activeTab === "finances") {
      updated.financeGroups = data.financeGroups.map((m) =>
        m.id === id ? { ...m, pinned: false } : m
      );
    }

    saveULifeData(updated);
    setData(updated);
  };

  const openItem = (item) => {
    if (activeTab === "opportunities") window.open(item.url, "_blank");
    else if (activeTab === "finances") navigate(`/finances?group=${item.id}`);
    else navigate(activePath);
  };

  return (
    <PageStyle>
      <section className="dashboard-hero ombre-panel">
        <p className="eyebrow">Welcome to your</p>

        <h1>
          Main Dashboard{" "}
          <span className="dashboard-emoji" onClick={cycleEmoji}>
            {emojis[emojiIndex]}
          </span>
        </h1>

        <p>
          Your central hub for productivity, opportunities, habits, and shared student finances.
        </p>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Pinned Modules</h2>
          <button className="dashboard-add-btn" onClick={() => navigate(activePath)}>
            + Add Module
          </button>
        </div>

        <div className="dashboard-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "dash-tab active" : "dash-tab"}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="module-grid">
          {pinnedItems.map((item) => (
            <article key={item.id} className="module-card">
              <div className="module-card-top">
                <button className="module-click-area" onClick={() => openItem(item)}>
                  <div className="module-icon">{activeTab === "finances" ? "$" : "📌"}</div>
                  <h3>{item.name}</h3>
                  <p>
                    {activeTab === "productivity" && `${item.items?.length || 0} checklist item(s)`}
                    {activeTab === "opportunities" && item.description}
                    {activeTab === "habits" && `Type: ${item.type}`}
                    {activeTab === "finances" && `${item.type} • ${item.members.length} member(s)`}
                  </p>
                  <span>Open →</span>
                </button>

                <button className="pin-corner pinned" onClick={() => removePin(item.id)}>
                  📌
                </button>
              </div>
            </article>
          ))}

          <button className="empty-add-box" onClick={() => navigate(activePath)}>
            <span>+</span>
            <p>
              {pinnedItems.length === 0
                ? `Add your first ${activeTab} module`
                : "Add another module"}
            </p>
          </button>
        </div>
      </section>
    </PageStyle>
  );
}

export default Dashboard;
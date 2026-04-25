import React from "react";
import { useNavigate } from "react-router-dom";
import PageStyle from "./PageStyle";
import "../styles/pages/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Productivity",
      description: "Homework, to-do lists, calendar, and Pomodoro timer.",
      path: "/productivity",
      icon: "☑️",
    },
    {
      title: "Opportunities",
      description: "Job search links, saved opportunities, and career actions.",
      path: "/opportunities",
      icon: "💼",
    },
    {
      title: "Habits",
      description: "Mental health, water intake, exercise, and custom habits.",
      path: "/habits",
      icon: "♡",
    },
    {
      title: "Finances",
      description: "Budget groups, roommate expenses, goals, and money trends.",
      path: "/finances",
      icon: "$",
    },
  ];

  return (
    <PageStyle>
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>Main Dashboard</h1>
          <p>
            Your central hub for productivity, opportunities, habits, and shared
            student finances.
          </p>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Pinned Modules</h2>

        <div className="module-grid">
          {modules.map((module) => (
            <button
              key={module.title}
              className="module-card"
              onClick={() => navigate(module.path)}
            >
              <div className="module-icon">{module.icon}</div>
              <h3>{module.title}</h3>
              <p>{module.description}</p>
              <span>Open →</span>
            </button>
          ))}
        </div>
      </section>
    </PageStyle>
  );
}

export default Dashboard;
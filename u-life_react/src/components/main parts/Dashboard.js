import React, { useState } from "react";
import "../styles/pages/Dashboard.css";
import Navbar from "./Navbar";

// tester modules before actual user ones
const initialModules = [
  { id: 1, label: "Task HW", link: "#taskhw" },
  { id: 2, label: "Task Eat Food", link: "#taskeatfood" },
  { id: 3, label: "Task Do XYZ", link: "#taskdoxyz" },
  { id: 4, label: "Task blah blah", link: "#taskblahblah" },
];

function Dashboard() {
  const [modules, setModules] = useState(initialModules);
  const [productivity, setProductivity] = useState([1, 2]);
  const [openDropdown, setOpenDropdown] = useState(false);

  const getModule = (id) => modules.find(m => m.id === id);

  const availableModules = modules.filter(m => !productivity.includes(m.id));

  const addToProductivity = (id) => {
    setProductivity(prev => [...prev, id]);
    setOpenDropdown(false);
  };

  const removeFromProductivity = (id) => {
    setProductivity(prev => prev.filter(mid => mid !== id));
  };

  return (
    <>
      <Navbar />

      <div className="dashboard-container">

        <div className="section-header">

          <div className="title-row">
            <h2 className="section-title">Productivity</h2>

            <button
              className="add-btn"
              onClick={() => setOpenDropdown(prev => !prev)}
            >
              +
            </button>
          </div>

          {openDropdown && (
            <div className="dropdown">
              {availableModules.length === 0 && (
                <div className="dropdown-item">No modules left</div>
              )}

              {availableModules.map(mod => (
                <div
                  key={mod.id}
                  className="dropdown-item"
                  onClick={() => addToProductivity(mod.id)}
                >
                  {mod.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid">
          {productivity.map(id => {
            const mod = getModule(id);
            if (!mod) return null;

            return (
              <a key={id} href={mod.link} className="card">
                <span>{mod.label}</span>
                <button
                  className="pin-btn active"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromProductivity(id);
                  }}
                >
                  ×
                </button>
              </a>
            );
          })}
        </div>

      </div>
    </>
  );
}

export default Dashboard;
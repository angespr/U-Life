import React, { useState } from "react";
import PageStyle from "../main parts/PageStyle";
import { loadULifeData, saveULifeData } from "../../data/ulifeStore";
import "../styles/pages/FeaturePages.css";

function OpportunityModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [stat, setStat] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreate({
      id: `opportunity-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || "Custom opportunity resource",
      url: url.trim() || "https://www.google.com",
      stat: stat.trim() || "User-added resource",
      icon: "★",
      pinned: false,
    });

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <form className="module-modal" onSubmit={submit}>
        <div className="modal-header">
          <h2>Add Opportunity Resource</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>

        <label>Resource / job name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>URL</label>
        <input value={url} placeholder="https://..." onChange={(e) => setUrl(e.target.value)} />

        <label>Status / quick stat</label>
        <input value={stat} onChange={(e) => setStat(e.target.value)} />

        <button className="modal-submit" type="submit">Create Resource</button>
      </form>
    </div>
  );
}

function Opportunity() {
  const [data, setData] = useState(loadULifeData());
  const [showModal, setShowModal] = useState(false);

  const saved = [
    { role: "Software Engineering Intern", company: "Tech Company Inc.", location: "Remote", status: "Applied" },
    { role: "Product Manager Intern", company: "Startup XYZ", location: "San Francisco, CA", status: "Saved" },
    { role: "Data Analyst Co-op", company: "Finance Corp", location: "New York, NY", status: "Interview" },
  ];

  const saveResources = (resources) => {
    const updated = { ...data, opportunityModules: resources };
    saveULifeData(updated);
    setData(updated);
  };

  const addResource = (resource) => saveResources([...data.opportunityModules, resource]);

  const togglePin = (id) => {
    saveResources(
      data.opportunityModules.map((resource) =>
        resource.id === id ? { ...resource, pinned: !resource.pinned } : resource
      )
    );
  };

  return (
    <PageStyle>
      <div className="page-title-row">
        <div>
          <h1>Opportunities Dashboard</h1>
          <p>Your central hub for career exploration and job hunting.</p>
        </div>
        <button className="primary-action" onClick={() => setShowModal(true)}>
          + New Resource
        </button>
      </div>

      <div className="opportunity-grid">
        {data.opportunityModules.map((resource) => (
          <article key={resource.id} className="opportunity-card">
            <div className="opportunity-top">
              <a href={resource.url} target="_blank" rel="noreferrer" className="resource-main-link">
                <div className="resource-icon">{resource.icon}</div>
              </a>

              <div className="card-actions">
                <button
                  className={resource.pinned ? "pin-btn pinned" : "pin-btn"}
                  onClick={() => togglePin(resource.id)}
                >
                  {resource.pinned ? "📌" : "📍"}
                </button>
                <a href={resource.url} target="_blank" rel="noreferrer" className="external-icon">
                  ↗
                </a>
              </div>
            </div>

            <h2>{resource.name}</h2>
            <p>{resource.description}</p>
            <div className="divider" />
            <span className="resource-stat">{resource.stat}</span>
          </article>
        ))}
      </div>

      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="quick-action-grid">
          <div className="quick-action-card">
            <h3>Update Resume</h3>
            <p>Last updated 2 weeks ago</p>
          </div>
          <div className="quick-action-card">
            <h3>Practice Interview</h3>
            <p>Common questions & answers</p>
          </div>
          <div className="quick-action-card">
            <h3>Network Events</h3>
            <p>3 events this week</p>
          </div>
        </div>
      </section>

      <section className="feature-card full-width">
        <h2>Saved Opportunities</h2>
        <div className="saved-list">
          {saved.map((item) => (
            <div key={item.role} className="saved-row">
              <div>
                <h3>{item.role}</h3>
                <p>{item.company} • {item.location}</p>
              </div>
              <span className={`status-pill ${item.status.toLowerCase()}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {showModal && <OpportunityModal onClose={() => setShowModal(false)} onCreate={addResource} />}
    </PageStyle>
  );
}

export default Opportunity;
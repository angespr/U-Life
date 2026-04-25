import React from "react";
import PageStyle from "../main parts/PageStyle";
import "../styles/pages/FeaturePages.css";

function Opportunity() {
  const resources = [
    {
      title: "LinkedIn",
      description: "Professional networking and job opportunities",
      stat: "5 new opportunities",
      url: "https://www.linkedin.com/jobs/",
      icon: "👥",
    },
    {
      title: "Handshake",
      description: "College career network for students and recent grads",
      stat: "12 new postings",
      url: "https://joinhandshake.com/",
      icon: "💼",
    },
    {
      title: "Indeed",
      description: "Job search engine with millions of listings",
      stat: "23 matches",
      url: "https://www.indeed.com/",
      icon: "📄",
    },
    {
      title: "GitHub",
      description: "Showcase your projects and contribute to open source",
      stat: "3 repo updates",
      url: "https://github.com/",
      icon: "<>",
    },
    {
      title: "Devpost",
      description: "Find and join hackathons to build your portfolio",
      stat: "4 upcoming hackathons",
      url: "https://devpost.com/",
      icon: "🏆",
    },
  ];

  const saved = [
    {
      role: "Software Engineering Intern",
      company: "Tech Company Inc.",
      location: "Remote",
      status: "Applied",
    },
    {
      role: "Product Manager Intern",
      company: "Startup XYZ",
      location: "San Francisco, CA",
      status: "Saved",
    },
    {
      role: "Data Analyst Co-op",
      company: "Finance Corp",
      location: "New York, NY",
      status: "Interview",
    },
  ];

  return (
    <PageStyle>
      <div className="page-title-row">
        <div>
          <h1>Opportunities Dashboard</h1>
          <p>Your central hub for career exploration and job hunting.</p>
        </div>
      </div>

      <div className="opportunity-grid">
        {resources.map((resource) => (
          <a
            key={resource.title}
            className="opportunity-card"
            href={resource.url}
            target="_blank"
            rel="noreferrer"
          >
            <div className="opportunity-top">
              <div className="resource-icon">{resource.icon}</div>
              <span className="external-icon">↗</span>
            </div>
            <h2>{resource.title}</h2>
            <p>{resource.description}</p>
            <div className="divider" />
            <span className="resource-stat">{resource.stat}</span>
          </a>
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
                <p>
                  {item.company} • {item.location}
                </p>
              </div>
              <span className={`status-pill ${item.status.toLowerCase()}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </PageStyle>
  );
}

export default Opportunity;
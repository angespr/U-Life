import React, { useState } from "react";
import PageStyle from "../main parts/PageStyle";
import { loadULifeData, saveULifeData } from "../../data/ulifeStore";
import "../styles/pages/FeaturePages.css";

function cleanUrl(url) {
  const trimmed = (url || "").trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function getDomain(url) {
  try {
    return new URL(cleanUrl(url)).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getLogoUrl(url) {
  const domain = getDomain(url);
  if (!domain) return "";
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

function ResourceLogo({ resource }) {
  const logo = getLogoUrl(resource.url);

  if (!logo) {
    return (
      <div className="resource-icon default-resource-icon">
        {resource.icon || "★"}
      </div>
    );
  }

  return (
    <div className="resource-icon website-logo-wrap">
      <img
        src={logo}
        alt={`${resource.name} logo`}
        className="website-logo"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          e.currentTarget.parentElement.classList.add("logo-fallback");
          e.currentTarget.parentElement.textContent = resource.icon || "★";
        }}
      />
    </div>
  );
}

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
      url: cleanUrl(url),
      stat: stat.trim() || "User-added resource",
      icon: "★",
      pinned: false,
    });

    onClose();
  };

  const previewResource = {
    name: name.trim() || "New resource",
    url,
    icon: "★",
  };

  return (
    <div className="modal-backdrop">
      <form className="module-modal" onSubmit={submit}>
        <div className="modal-header">
          <h2>Add Opportunity Resource</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="logo-preview-row">
          <ResourceLogo resource={previewResource} />
          <div>
            <strong>Logo Preview</strong>
            <p>
              {url.trim()
                ? getDomain(url)
                : "No website yet — using default star"}
            </p>
          </div>
        </div>

        <label>Resource / job site name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Website URL optional</label>
        <input
          value={url}
          placeholder="linkedin.com, indeed.com, or leave blank"
          onChange={(e) => setUrl(e.target.value)}
        />

        <label>Status / quick stat</label>
        <input value={stat} onChange={(e) => setStat(e.target.value)} />

        <button className="modal-submit" type="submit">
          Create Resource
        </button>
      </form>
    </div>
  );
}

function ResumeModal({ resume, onClose, onSave }) {
  const [title, setTitle] = useState(resume?.title || "");
  const [type, setType] = useState(resume?.type || "General");
  const [notes, setNotes] = useState(resume?.notes || "");
  const [fileName, setFileName] = useState(resume?.fileName || "");
  const [fileData, setFileData] = useState(resume?.fileData || "");
  const [fileType, setFileType] = useState(resume?.fileType || "");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setFileType(file.type);

    const reader = new FileReader();

    reader.onload = () => {
      setFileData(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    onSave({
      id: resume?.id || `resume-${Date.now()}`,
      title: title.trim(),
      type: type.trim() || "General",
      notes: notes.trim(),
      fileName,
      fileData,
      fileType,
      updatedAt: new Date().toLocaleDateString(),
    });

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <form className="module-modal" onSubmit={submit}>
        <div className="modal-header">
          <h2>{resume ? "Update Resume" : "Add Resume"}</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <label>Resume name</label>
        <input
          value={title}
          placeholder="Software Engineering Resume"
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Resume type</label>
        <input
          value={type}
          placeholder="SWE, Data Science, TPM, General..."
          onChange={(e) => setType(e.target.value)}
        />

        <label>Upload resume file</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
        />

        {fileName && (
          <p className="uploaded-file-name">
            Selected file: <strong>{fileName}</strong>
          </p>
        )}

        <label>Notes</label>
        <textarea
          value={notes}
          placeholder="What this resume is for, what needs to be improved, etc."
          onChange={(e) => setNotes(e.target.value)}
        />

        <button className="modal-submit" type="submit">
          {resume ? "Save Updates" : "Add Resume"}
        </button>
      </form>
    </div>
  );
}

function Opportunity() {
  const [data, setData] = useState(loadULifeData());

  const [showModal, setShowModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [editingResume, setEditingResume] = useState(null);

  const [jobTitle, setJobTitle] = useState("");
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionError, setQuestionError] = useState("");

  const [saved, setSaved] = useState([
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
  ]);

  const resumes = data.resumes || [];

  const saveData = (updatedData) => {
    saveULifeData(updatedData);
    setData(updatedData);
  };

  const saveResources = (resources) => {
    saveData({ ...data, opportunityModules: resources });
  };

  const addResource = (resource) => {
    saveResources([...data.opportunityModules, resource]);
  };

  const deleteResource = (id) => {
    saveResources(
      data.opportunityModules.filter((resource) => resource.id !== id)
    );
  };

  const togglePin = (id) => {
    saveResources(
      data.opportunityModules.map((resource) =>
        resource.id === id
          ? { ...resource, pinned: !resource.pinned }
          : resource
      )
    );
  };

  const saveResume = (resumeToSave) => {
    const exists = resumes.some((resume) => resume.id === resumeToSave.id);

    const updatedResumes = exists
      ? resumes.map((resume) =>
          resume.id === resumeToSave.id ? resumeToSave : resume
        )
      : [...resumes, resumeToSave];

    saveData({ ...data, resumes: updatedResumes });
  };

  const deleteResume = (id) => {
    saveData({
      ...data,
      resumes: resumes.filter((resume) => resume.id !== id),
    });
  };

  const openResumeModal = (resume = null) => {
    setEditingResume(resume);
    setShowResumeModal(true);
  };

  const deleteSavedOpportunity = (role) => {
    setSaved(saved.filter((item) => item.role !== role));
  };

  const getInterviewQuestions = async () => {
    if (!jobTitle.trim()) {
      setQuestionError("Please enter a job title first.");
      return;
    }

    try {
      setLoadingQuestions(true);
      setQuestionError("");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/interview/questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobTitle }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to get questions");
      }

      setInterviewQuestions(result.questions || []);
    } catch (error) {
      console.error("Failed to get interview questions:", error);
      setQuestionError(error.message || "Failed to get interview questions.");
    } finally {
      setLoadingQuestions(false);
    }
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
        {data.opportunityModules.map((resource) => {
          const safeUrl = cleanUrl(resource.url);

          return (
            <article key={resource.id} className="opportunity-card">
              <div className="opportunity-top">
                {safeUrl ? (
                  <a
                    href={safeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="resource-main-link"
                  >
                    <ResourceLogo resource={resource} />
                  </a>
                ) : (
                  <ResourceLogo resource={resource} />
                )}

                <div className="card-actions">
                  <button
                    className={resource.pinned ? "pin-btn pinned" : "pin-btn"}
                    onClick={() => togglePin(resource.id)}
                  >
                    {resource.pinned ? "📌" : "📍"}
                  </button>

                  <button
                    className="delete-module-btn"
                    onClick={() => deleteResource(resource.id)}
                  >
                    ×
                  </button>

                  {safeUrl && (
                    <a
                      href={safeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="external-icon"
                    >
                      ↗
                    </a>
                  )}
                </div>
              </div>

              <h2>{resource.name}</h2>
              <p>{resource.description}</p>

              <div className="divider" />

              <span className="resource-stat">{resource.stat}</span>
            </article>
          );
        })}
      </div>

      <section className="quick-actions">
        <h2>Quick Actions</h2>

        <div className="quick-action-grid">
          <button
            className="quick-action-card clickable-card"
            onClick={() => openResumeModal()}
          >
            <h3>Update Resume</h3>
            <p>
              {resumes.length > 0
                ? `${resumes.length} resume(s) saved`
                : "Add and manage your resumes"}
            </p>
          </button>

          <div className="quick-action-card interview-card">
            <h3>Practice Interview</h3>
            <p>Generate 5 questions for a specific role.</p>

            <div className="interview-input-row">
              <input
                value={jobTitle}
                placeholder="Software Engineering Intern"
                onChange={(e) => setJobTitle(e.target.value)}
              />

              <button onClick={getInterviewQuestions}>
                {loadingQuestions ? "Loading..." : "Get Questions"}
              </button>
            </div>

            {questionError && <p className="question-error">{questionError}</p>}
          </div>

          <div className="quick-action-card">
            <h3>Network Events</h3>
            <p>3 events this week</p>
          </div>
        </div>
      </section>

      {interviewQuestions.length > 0 && (
        <section className="feature-card full-width">
          <h2>Practice Interview Questions</h2>

          <div className="question-list">
            {interviewQuestions.map((question, index) => (
              <div key={index} className="question-card">
                <span>Question {index + 1}</span>
                <p>{question}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="feature-card full-width">
        <div className="section-header-row">
          <div>
            <h2>Resume Library</h2>
            <p>Store different resume versions for different roles.</p>
          </div>

          <button className="small-add-btn" onClick={() => openResumeModal()}>
            + Add Resume
          </button>
        </div>

        {resumes.length === 0 ? (
          <div className="empty-resume-box">
            <h3>No resumes stored yet</h3>
            <p>
              Add a resume file so you can quickly update and access it later.
            </p>
            <button onClick={() => openResumeModal()}>
              Add Your First Resume
            </button>
          </div>
        ) : (
          <div className="resume-list">
            {resumes.map((resume) => (
              <div key={resume.id} className="resume-row">
                <div>
                  <h3>{resume.title}</h3>
                  <p>
                    {resume.type} • Last updated {resume.updatedAt}
                  </p>

                  {resume.fileName && (
                    <p className="resume-file-name">{resume.fileName}</p>
                  )}

                  {resume.notes && (
                    <p className="resume-notes">{resume.notes}</p>
                  )}
                </div>

                <div className="resume-actions">
                  {resume.fileData && (
                    <a
                      href={resume.fileData}
                      download={resume.fileName || `${resume.title}.pdf`}
                    >
                      Download
                    </a>
                  )}

                  {resume.fileData && resume.fileType === "application/pdf" && (
                    <a href={resume.fileData} target="_blank" rel="noreferrer">
                      Preview
                    </a>
                  )}

                  <button onClick={() => openResumeModal(resume)}>
                    Update
                  </button>

                  <button
                    className="danger-btn"
                    onClick={() => deleteResume(resume.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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

              <div className="saved-actions">
                <span className={`status-pill ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>

                <button
                  className="delete-saved-btn"
                  onClick={() => deleteSavedOpportunity(item.role)}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showModal && (
        <OpportunityModal
          onClose={() => setShowModal(false)}
          onCreate={addResource}
        />
      )}

      {showResumeModal && (
        <ResumeModal
          resume={editingResume}
          onClose={() => {
            setShowResumeModal(false);
            setEditingResume(null);
          }}
          onSave={saveResume}
        />
      )}
    </PageStyle>
  );
}

export default Opportunity;
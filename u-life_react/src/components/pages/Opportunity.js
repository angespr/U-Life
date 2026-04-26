// import React, { useState } from "react";
// import PageStyle from "../main parts/PageStyle";
// import { loadULifeData, saveULifeData } from "../../data/ulifeStore";
// import "../styles/pages/FeaturePages.css";

// function cleanUrl(url) {
//   const trimmed = (url || "").trim();
//   if (!trimmed) return "";
//   return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
// }

// function getDomain(url) {
//   try {
//     return new URL(cleanUrl(url)).hostname.replace(/^www\./, "");
//   } catch {
//     return "";
//   }
// }

// function getLogoUrl(url) {
//   const domain = getDomain(url);
//   if (!domain) return "";
//   return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
// }

// function openResumePreview(resume) {
//   if (!resume?.fileData) return;

//   try {
//     const [header, base64Data] = resume.fileData.split(",");
//     const mimeType =
//       header?.match(/data:(.*);base64/)?.[1] ||
//       resume.fileType ||
//       "application/pdf";

//     const byteCharacters = atob(base64Data);
//     const byteNumbers = new Array(byteCharacters.length);

//     for (let i = 0; i < byteCharacters.length; i++) {
//       byteNumbers[i] = byteCharacters.charCodeAt(i);
//     }

//     const byteArray = new Uint8Array(byteNumbers);
//     const blob = new Blob([byteArray], { type: mimeType });
//     const blobUrl = URL.createObjectURL(blob);

//     window.open(blobUrl, "_blank", "noopener,noreferrer");
//   } catch (error) {
//     console.error("Resume preview failed:", error);
//     alert("Could not preview this file. Please try downloading it instead.");
//   }
// }

// function ResourceLogo({ resource }) {
//   const logo = getLogoUrl(resource.url);

//   if (!logo) {
//     return (
//       <div className="resource-icon default-resource-icon">
//         {resource.icon || "★"}
//       </div>
//     );
//   }

//   return (
//     <div className="resource-icon website-logo-wrap">
//       <img
//         src={logo}
//         alt={`${resource.name} logo`}
//         className="website-logo"
//         onError={(e) => {
//           e.currentTarget.style.display = "none";
//           e.currentTarget.parentElement.classList.add("logo-fallback");
//           e.currentTarget.parentElement.textContent = resource.icon || "★";
//         }}
//       />
//     </div>
//   );
// }

// function OpportunityModal({ onClose, onCreate }) {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [url, setUrl] = useState("");
//   const [stat, setStat] = useState("");

//   const submit = (e) => {
//     e.preventDefault();
//     if (!name.trim()) return;

//     onCreate({
//       id: `opportunity-${Date.now()}`,
//       name: name.trim(),
//       description: description.trim() || "Custom opportunity resource",
//       url: cleanUrl(url),
//       stat: stat.trim() || "User-added resource",
//       icon: "★",
//       pinned: false,
//     });

//     onClose();
//   };

//   const previewResource = {
//     name: name.trim() || "New resource",
//     url,
//     icon: "★",
//   };

//   return (
//     <div className="modal-backdrop">
//       <form className="module-modal" onSubmit={submit}>
//         <div className="modal-header">
//           <h2>Add Opportunity Resource</h2>
//           <button type="button" onClick={onClose}>
//             ×
//           </button>
//         </div>

//         <div className="logo-preview-row">
//           <ResourceLogo resource={previewResource} />
//           <div>
//             <strong>Logo Preview</strong>
//             <p>
//               {url.trim()
//                 ? getDomain(url)
//                 : "No website yet — using default star"}
//             </p>
//           </div>
//         </div>

//         <label>Resource / job site name</label>
//         <input value={name} onChange={(e) => setName(e.target.value)} />

//         <label>Description</label>
//         <input
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />

//         <label>Website URL optional</label>
//         <input
//           value={url}
//           placeholder="linkedin.com, indeed.com, or leave blank"
//           onChange={(e) => setUrl(e.target.value)}
//         />

//         <label>Status / quick stat</label>
//         <input value={stat} onChange={(e) => setStat(e.target.value)} />

//         <button className="modal-submit" type="submit">
//           Create Resource
//         </button>
//       </form>
//     </div>
//   );
// }

// function ResumeModal({ resume, onClose, onSave }) {
//   const [title, setTitle] = useState(resume?.title || "");
//   const [type, setType] = useState(resume?.type || "General");
//   const [notes, setNotes] = useState(resume?.notes || "");
//   const [fileName, setFileName] = useState(resume?.fileName || "");
//   const [fileData, setFileData] = useState(resume?.fileData || "");
//   const [fileType, setFileType] = useState(resume?.fileType || "");

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setFileName(file.name);
//     setFileType(file.type || "application/pdf");

//     const reader = new FileReader();
//     reader.onload = () => setFileData(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const submit = (e) => {
//     e.preventDefault();
//     if (!title.trim()) return;

//     onSave({
//       id: resume?.id || `resume-${Date.now()}`,
//       title: title.trim(),
//       type: type.trim() || "General",
//       notes: notes.trim(),
//       fileName,
//       fileData,
//       fileType,
//       updatedAt: new Date().toLocaleDateString(),
//     });

//     onClose();
//   };

//   return (
//     <div className="modal-backdrop">
//       <form className="module-modal" onSubmit={submit}>
//         <div className="modal-header">
//           <h2>{resume ? "Update Resume" : "Add Resume"}</h2>
//           <button type="button" onClick={onClose}>
//             ×
//           </button>
//         </div>

//         <label>Resume name</label>
//         <input
//           value={title}
//           placeholder="Software Engineering Resume"
//           onChange={(e) => setTitle(e.target.value)}
//         />

//         <label>Resume type</label>
//         <input
//           value={type}
//           placeholder="SWE, Data Science, TPM, General..."
//           onChange={(e) => setType(e.target.value)}
//         />

//         <label>Upload resume file</label>
//         <input
//           type="file"
//           accept=".pdf,application/pdf,.doc,.docx"
//           onChange={handleFileUpload}
//         />

//         {fileName && (
//           <p className="uploaded-file-name">
//             Selected file: <strong>{fileName}</strong>
//           </p>
//         )}

//         <label>Notes</label>
//         <textarea
//           value={notes}
//           placeholder="What this resume is for, what needs to be improved, etc."
//           onChange={(e) => setNotes(e.target.value)}
//         />

//         <button className="modal-submit" type="submit">
//           {resume ? "Save Updates" : "Add Resume"}
//         </button>
//       </form>
//     </div>
//   );
// }

// function Opportunity() {
//   const [data, setData] = useState(loadULifeData());

//   const [showModal, setShowModal] = useState(false);
//   const [showResumeModal, setShowResumeModal] = useState(false);
//   const [showResumeLibrary, setShowResumeLibrary] = useState(false);
//   const [showInterviewBox, setShowInterviewBox] = useState(false);
//   const [editingResume, setEditingResume] = useState(null);

//   const [jobTitle, setJobTitle] = useState("");
//   const [interviewQuestions, setInterviewQuestions] = useState([]);
//   const [loadingQuestions, setLoadingQuestions] = useState(false);
//   const [questionError, setQuestionError] = useState("");

//   const [saved, setSaved] = useState([
//     {
//       role: "Software Engineering Intern",
//       company: "Tech Company Inc.",
//       location: "Remote",
//       status: "Applied",
//     },
//     {
//       role: "Product Manager Intern",
//       company: "Startup XYZ",
//       location: "San Francisco, CA",
//       status: "Saved",
//     },
//     {
//       role: "Data Analyst Co-op",
//       company: "Finance Corp",
//       location: "New York, NY",
//       status: "Interview",
//     },
//   ]);

//   const resumes = data.resumes || [];

//   const saveData = (updatedData) => {
//     saveULifeData(updatedData);
//     setData(updatedData);
//   };

//   const saveResources = (resources) => {
//     saveData({ ...data, opportunityModules: resources });
//   };

//   const addResource = (resource) => {
//     saveResources([...(data.opportunityModules || []), resource]);
//   };

//   const deleteResource = (id) => {
//     saveResources(
//       (data.opportunityModules || []).filter((resource) => resource.id !== id)
//     );
//   };

//   const togglePin = (id) => {
//     saveResources(
//       (data.opportunityModules || []).map((resource) =>
//         resource.id === id
//           ? { ...resource, pinned: !resource.pinned }
//           : resource
//       )
//     );
//   };

//   const saveResume = (resumeToSave) => {
//     const exists = resumes.some((resume) => resume.id === resumeToSave.id);

//     const updatedResumes = exists
//       ? resumes.map((resume) =>
//           resume.id === resumeToSave.id ? resumeToSave : resume
//         )
//       : [...resumes, resumeToSave];

//     saveData({ ...data, resumes: updatedResumes });
//     setShowResumeLibrary(true);
//   };

//   const deleteResume = (id) => {
//     saveData({
//       ...data,
//       resumes: resumes.filter((resume) => resume.id !== id),
//     });
//   };

//   const openResumeModal = (resume = null) => {
//     setEditingResume(resume);
//     setShowResumeModal(true);
//   };

//   const deleteSavedOpportunity = (role) => {
//     setSaved(saved.filter((item) => item.role !== role));
//   };

//   const getInterviewQuestions = async () => {
//     if (!jobTitle.trim()) {
//       setQuestionError("Please enter a job title first.");
//       return;
//     }

//     try {
//       setLoadingQuestions(true);
//       setQuestionError("");

//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/api/interview/questions`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ jobTitle }),
//         }
//       );

//       const text = await response.text();

//       let result;
//       try {
//         result = JSON.parse(text);
//       } catch {
//         throw new Error(
//           `Backend did not return JSON. Status: ${response.status}. Response: ${text.slice(
//             0,
//             80
//           )}`
//         );
//       }

//       if (!response.ok) {
//         throw new Error(result.message || "Failed to get questions");
//       }

//       setInterviewQuestions(result.questions || []);
//     } catch (error) {
//       console.error("Failed to get interview questions:", error);
//       setQuestionError(error.message || "Failed to get interview questions.");
//     } finally {
//       setLoadingQuestions(false);
//     }
//   };

//   return (
//     <PageStyle>
//       <div className="page-title-row">
//         <div>
//           <h1>Opportunities Dashboard</h1>
//           <p>Your central hub for career exploration and job hunting.</p>
//         </div>

//         <button className="primary-action" onClick={() => setShowModal(true)}>
//           + New Resource
//         </button>
//       </div>

//       <div className="opportunity-grid">
//         {(data.opportunityModules || []).map((resource) => {
//           const safeUrl = cleanUrl(resource.url);

//           return (
//             <article key={resource.id} className="opportunity-card">
//               <div className="opportunity-top">
//                 {safeUrl ? (
//                   <a
//                     href={safeUrl}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="resource-main-link"
//                   >
//                     <ResourceLogo resource={resource} />
//                   </a>
//                 ) : (
//                   <ResourceLogo resource={resource} />
//                 )}

//                 <div className="card-actions">
//                   <button
//                     className={resource.pinned ? "pin-btn pinned" : "pin-btn"}
//                     onClick={() => togglePin(resource.id)}
//                   >
//                     {resource.pinned ? "📌" : "📍"}
//                   </button>

//                   <button
//                     className="delete-module-btn"
//                     onClick={() => deleteResource(resource.id)}
//                   >
//                     ×
//                   </button>

//                   {safeUrl && (
//                     <a
//                       href={safeUrl}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="external-icon"
//                     >
//                       ↗
//                     </a>
//                   )}
//                 </div>
//               </div>

//               <h2>{resource.name}</h2>
//               <p>{resource.description}</p>

//               <div className="divider" />

//               <span className="resource-stat">{resource.stat}</span>
//             </article>
//           );
//         })}
//       </div>

//       <section className="quick-actions">
//         <h2>Quick Actions</h2>

//         <div className="quick-action-grid">
//           <button
//             className="quick-action-card clickable-card"
//             onClick={() => setShowResumeLibrary((prev) => !prev)}
//           >
//             <h3>Update Resume</h3>
//             <p>
//               {resumes.length > 0
//                 ? `${resumes.length} resume(s) saved`
//                 : "Add and manage your resumes"}
//             </p>
//           </button>

//           <button
//             className="quick-action-card clickable-card"
//             onClick={() => setShowInterviewBox((prev) => !prev)}
//           >
//             <h3>Practice Interview</h3>
//             <p>
//               {interviewQuestions.length > 0
//                 ? `${interviewQuestions.length} question(s) ready`
//                 : "Generate role-specific interview questions"}
//             </p>
//           </button>

//           <div className="quick-action-card">
//             <h3>Network Events</h3>
//             <p>3 events this week</p>
//           </div>
//         </div>
//       </section>

//       {showInterviewBox && (
//         <section className="feature-card full-width interview-panel">
//           <div className="section-header-row">
//             <div>
//               <h2>Practice Interview</h2>
//               <p>Enter a role and generate 5 realistic practice questions.</p>
//             </div>
//           </div>

//           <div className="interview-generator-box">
//             <input
//               value={jobTitle}
//               placeholder="Software Engineering Intern"
//               onChange={(e) => setJobTitle(e.target.value)}
//             />

//             <button onClick={getInterviewQuestions} disabled={loadingQuestions}>
//               {loadingQuestions ? "Generating..." : "Generate Questions"}
//             </button>
//           </div>

//           {questionError && <p className="question-error">{questionError}</p>}

//           {interviewQuestions.length > 0 && (
//             <div className="question-list professional-question-list">
//               {interviewQuestions.map((question, index) => (
//                 <div
//                   key={index}
//                   className="question-card professional-question-card"
//                 >
//                   <div className="question-number">Question {index + 1}</div>
//                   <p>{question}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       )}

//       {showResumeLibrary && (
//         <section className="feature-card full-width">
//           <div className="section-header-row">
//             <div>
//               <h2>Resume Library</h2>
//               <p>Store different resume versions for different roles.</p>
//             </div>

//             <button className="small-add-btn" onClick={() => openResumeModal()}>
//               + Add Resume
//             </button>
//           </div>

//           {resumes.length === 0 ? (
//             <div className="empty-resume-box">
//               <h3>No resumes stored yet</h3>
//               <p>
//                 Add a resume file so you can quickly update and access it later.
//               </p>
//               <button onClick={() => openResumeModal()}>
//                 Add Your First Resume
//               </button>
//             </div>
//           ) : (
//             <div className="resume-list">
//               {resumes.map((resume) => (
//                 <div key={resume.id} className="resume-row">
//                   <div>
//                     <h3>{resume.title}</h3>
//                     <p>
//                       {resume.type} • Last updated {resume.updatedAt}
//                     </p>

//                     {resume.fileName && (
//                       <p className="resume-file-name">{resume.fileName}</p>
//                     )}

//                     {resume.notes && (
//                       <p className="resume-notes">{resume.notes}</p>
//                     )}
//                   </div>

//                   <div className="resume-actions">
//                     {resume.fileData && (
//                       <a
//                         href={resume.fileData}
//                         download={resume.fileName || `${resume.title}.pdf`}
//                       >
//                         Download
//                       </a>
//                     )}

//                     {resume.fileData &&
//                       (resume.fileType === "application/pdf" ||
//                         resume.fileName?.toLowerCase().endsWith(".pdf")) && (
//                         <button
//                           type="button"
//                           onClick={() => openResumePreview(resume)}
//                         >
//                           Preview
//                         </button>
//                       )}

//                     <button onClick={() => openResumeModal(resume)}>
//                       Update
//                     </button>

//                     <button
//                       className="danger-btn"
//                       onClick={() => deleteResume(resume.id)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       )}

//       <section className="feature-card full-width">
//         <h2>Saved Opportunities</h2>

//         <div className="saved-list">
//           {saved.map((item) => (
//             <div key={item.role} className="saved-row">
//               <div>
//                 <h3>{item.role}</h3>
//                 <p>
//                   {item.company} • {item.location}
//                 </p>
//               </div>

//               <div className="saved-actions">
//                 <span className={`status-pill ${item.status.toLowerCase()}`}>
//                   {item.status}
//                 </span>

//                 <button
//                   className="delete-saved-btn"
//                   onClick={() => deleteSavedOpportunity(item.role)}
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {showModal && (
//         <OpportunityModal
//           onClose={() => setShowModal(false)}
//           onCreate={addResource}
//         />
//       )}

//       {showResumeModal && (
//         <ResumeModal
//           resume={editingResume}
//           onClose={() => {
//             setShowResumeModal(false);
//             setEditingResume(null);
//           }}
//           onSave={saveResume}
//         />
//       )}
//     </PageStyle>
//   );
// }

// export default Opportunity;

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

function openResumePreview(resume) {
  if (!resume.fileData) return;

  const byteString = atob(resume.fileData.split(",")[1]);
  const mimeString = resume.fileData.split(",")[0].split(":")[1].split(";")[0];

  const byteNumbers = new Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    byteNumbers[i] = byteString.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeString });
  const blobUrl = URL.createObjectURL(blob);

  window.open(blobUrl, "_blank");
}

function getGoogleMapEmbedUrl(query) {
  if (!query) return "";
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
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
          <button type="button" onClick={onClose}>×</button>
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
    reader.onload = () => setFileData(reader.result);
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
          <button type="button" onClick={onClose}>×</button>
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
  const [showResumeLibrary, setShowResumeLibrary] = useState(false);
  const [showInterviewBox, setShowInterviewBox] = useState(false);
  const [showEventsBox, setShowEventsBox] = useState(false);
  const [editingResume, setEditingResume] = useState(null);

  const [jobTitle, setJobTitle] = useState("");
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionError, setQuestionError] = useState("");

  const [eventPrompt, setEventPrompt] = useState("");
  const [networkEvents, setNetworkEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventError, setEventError] = useState("");

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
    saveResources(data.opportunityModules.filter((resource) => resource.id !== id));
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
    setShowResumeLibrary(true);
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

      const text = await response.text();

      let result;
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(
          `Backend did not return JSON. Status: ${response.status}. Response: ${text.slice(
            0,
            80
          )}`
        );
      }

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

  const getNetworkEvents = async () => {
    if (!eventPrompt.trim()) {
      setEventError("Please enter what kind of networking events you want.");
      return;
    }

    try {
      setLoadingEvents(true);
      setEventError("");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/interview/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ eventPrompt }),
        }
      );

      const text = await response.text();

      let result;
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(
          `Backend did not return JSON. Status: ${response.status}. Response: ${text.slice(
            0,
            80
          )}`
        );
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to search networking events");
      }

      setNetworkEvents(result.events || []);
    } catch (error) {
      console.error("Failed to search networking events:", error);
      setEventError(error.message || "Failed to search networking events.");
    } finally {
      setLoadingEvents(false);
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
            onClick={() => setShowResumeLibrary((prev) => !prev)}
          >
            <h3>Update Resume</h3>
            <p>
              {resumes.length > 0
                ? `${resumes.length} resume(s) saved`
                : "Add and manage your resumes"}
            </p>
          </button>

          <button
            className="quick-action-card clickable-card"
            onClick={() => setShowInterviewBox((prev) => !prev)}
          >
            <h3>Practice Interview</h3>
            <p>
              {interviewQuestions.length > 0
                ? `${interviewQuestions.length} question(s) ready`
                : "Generate role-specific interview questions"}
            </p>
          </button>

          <button
            className="quick-action-card clickable-card"
            onClick={() => setShowEventsBox((prev) => !prev)}
          >
            <h3>Network Events</h3>
            <p>
              {networkEvents.length > 0
                ? `${networkEvents.length} event(s) found`
                : "Search for networking events"}
            </p>
          </button>
        </div>
      </section>

      {showInterviewBox && (
        <section className="feature-card full-width interview-panel">
          <div className="section-header-row">
            <div>
              <h2>Practice Interview</h2>
              <p>Enter a role and generate 5 realistic practice questions.</p>
            </div>
          </div>

          <form
            className="interview-generator-box"
            onSubmit={(e) => {
              e.preventDefault();
              getInterviewQuestions();
            }}
          >
            <input
              value={jobTitle}
              placeholder="Software Engineering Intern"
              onChange={(e) => setJobTitle(e.target.value)}
            />

            <button type="submit" disabled={loadingQuestions}>
              {loadingQuestions ? "Generating..." : "Generate Questions"}
            </button>
          </form>

          {questionError && <p className="question-error">{questionError}</p>}

          {interviewQuestions.length > 0 && (
            <div className="question-list professional-question-list">
              {interviewQuestions.map((question, index) => (
                <div
                  key={index}
                  className="question-card professional-question-card"
                >
                  <div className="question-number">Question {index + 1}</div>
                  <p>{question}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {showEventsBox && (
        <section className="feature-card full-width network-events-panel">
          <div className="section-header-row">
            <div>
              <h2>Networking Events Finder</h2>
              <p>Search for upcoming networking events based on your goals.</p>
            </div>
          </div>

          <form
            className="interview-generator-box"
            onSubmit={(e) => {
              e.preventDefault();
              getNetworkEvents();
            }}
          >
            <input
              placeholder="Tech networking events in Seattle this month"
              value={eventPrompt}
              onChange={(e) => setEventPrompt(e.target.value)}
            />

            <button type="submit" disabled={loadingEvents}>
              {loadingEvents ? "Searching..." : "Search Events"}
            </button>
          </form>

          {eventError && <p className="question-error">{eventError}</p>}

          {networkEvents.length > 0 && (
            <div className="event-list">
              {networkEvents.map((event, index) => {
                const mapQuery =
                  event.mapQuery ||
                  `${event.name || ""} ${event.location || ""} ${event.city || ""}`;

                return (
                  <div key={index} className="event-card">
                    <div className="event-card-content">
                      <div className="question-number">Event {index + 1}</div>
                      <h3>{event.name || "Unnamed event"}</h3>

                      <div className="event-detail-grid">
                        <p><strong>Occasion:</strong> {event.occasion || "Not listed"}</p>
                        <p><strong>Date:</strong> {event.date || "Date not listed"}</p>
                        <p><strong>Time:</strong> {event.time || "Time not listed"}</p>
                        <p><strong>Location:</strong> {event.location || "Location not listed"}</p>
                        <p><strong>City:</strong> {event.city || "City not listed"}</p>
                      </div>

                      {event.description && (
                        <p className="event-description">{event.description}</p>
                      )}

                      {event.link && (
                        <a
                          className="event-link"
                          href={event.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View Event ↗
                        </a>
                      )}
                    </div>

                    {mapQuery && event.location !== "Online" && (
                      <div className="event-map">
                        <iframe
                          title={`Map for ${event.name || `event-${index}`}`}
                          src={getGoogleMapEmbedUrl(mapQuery)}
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!loadingEvents && networkEvents.length === 0 && eventPrompt && !eventError && (
            <div className="empty-resume-box">
              <h3>No events shown yet</h3>
              <p>Try a more specific prompt with a city, industry, and timeframe.</p>
            </div>
          )}
        </section>
      )}

      {showResumeLibrary && (
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
              <p>Add a resume file so you can quickly update and access it later.</p>
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
                      <button onClick={() => openResumePreview(resume)}>
                        Preview
                      </button>
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
      )}

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
import React, { useMemo, useState } from "react";
import PageStyle from "../main parts/PageStyle";
import { loadULifeData, saveULifeData } from "../../data/ulifeStore";
import "../styles/pages/FeaturePages.css";

function ProgressBar({ value, max }) {
  const percent = Math.min(100, Math.round((value / max) * 100));

  return (
    <div>
      <div className="progress-label">
        <span>{value} / {max}</span>
        <span>{percent}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function HabitModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("checklist");
  const [goal, setGoal] = useState("7");
  const [items, setItems] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreate({
      id: `habit-${Date.now()}`,
      name: name.trim(),
      type,
      goal: Number(goal) || 7,
      value: 0,
      pinned: false,
      items: items
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((text, index) => ({ id: Date.now() + index, text, done: false })),
    });

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <form className="module-modal" onSubmit={submit}>
        <div className="modal-header">
          <h2>Add Habit Module</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>

        <label>Habit name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Module type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="checklist">Checklist</option>
          <option value="counter">Counter</option>
        </select>

        {type === "counter" && (
          <>
            <label>Goal number</label>
            <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} />
          </>
        )}

        {type === "checklist" && (
          <>
            <label>Checklist items, separated by commas</label>
            <textarea value={items} onChange={(e) => setItems(e.target.value)} />
          </>
        )}

        <button className="modal-submit" type="submit">Create Habit</button>
      </form>
    </div>
  );
}

function HabitModule({ module, onUpdate, onTogglePin, onDelete }) {
  const [input, setInput] = useState("");

  const completed = useMemo(() => {
    if (!module.items) return 0;
    return module.items.filter((item) => item.done).length;
  }, [module.items]);

  const addChecklistItem = () => {
    if (!input.trim()) return;
    onUpdate({
      ...module,
      items: [...(module.items || []), { id: Date.now(), text: input.trim(), done: false }],
    });
    setInput("");
  };

  const toggleChecklistItem = (id) => {
    onUpdate({
      ...module,
      items: module.items.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      ),
    });
  };

  const deleteChecklistItem = (id) => {
    onUpdate({ ...module, items: module.items.filter((item) => item.id !== id) });
  };

  return (
    <section className="feature-card">
      <div className="card-heading-row">
          <h2>{module.name}</h2>

          <div className="card-actions">
            <button
              className={module.pinned ? "pin-btn pinned" : "pin-btn"}
              onClick={onTogglePin}
            >
              {module.pinned ? "📌 Pinned" : "📍 Pin"}
            </button>

            <button className="delete-module-btn" onClick={onDelete}>
              ×
            </button>
          </div>
        </div>

      {module.type === "mood" && (
        <>
          <p>How are you feeling today?</p>
          <div className="mood-grid">
            {["Good", "Okay", "Not Great"].map((option) => (
              <button
                key={option}
                className={module.mood === option ? "mood-card selected" : "mood-card"}
                onClick={() => onUpdate({ ...module, mood: option })}
              >
                <span>{option === "Good" ? "☺" : option === "Okay" ? "😐" : "☹"}</span>
                {option}
              </button>
            ))}
          </div>
        </>
      )}

      {module.type === "counter" && (
        <>
          <ProgressBar value={module.value || 0} max={module.goal || 1} />
          <div className="counter-row">
            <button onClick={() => onUpdate({ ...module, value: Math.max(0, (module.value || 0) - 1) })}>
              -
            </button>
            <button
              className="wide"
              onClick={() => onUpdate({ ...module, value: Math.min(module.goal || 1, (module.value || 0) + 1) })}
            >
              Add Progress
            </button>
            <button onClick={() => onUpdate({ ...module, value: Math.min(module.goal || 1, (module.value || 0) + 1) })}>
              +
            </button>
          </div>
          <button className="secondary full-button" onClick={() => onUpdate({ ...module, value: 0 })}>
            Reset
          </button>
        </>
      )}

      {module.type === "checklist" && (
        <>
          <p>Progress: {completed} / {module.items?.length || 0}</p>
          <ProgressBar value={completed} max={module.items?.length || 1} />

          <div className="task-list">
            {(module.items || []).map((item) => (
              <div key={item.id} className="task-row">
                <label>
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleChecklistItem(item.id)}
                  />
                  <span className={item.done ? "done" : ""}>{item.text}</span>
                </label>
                <button className="delete-btn" onClick={() => deleteChecklistItem(item.id)}>×</button>
              </div>
            ))}
          </div>

          <div className="input-row">
            <input
              value={input}
              placeholder="Add new habit..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addChecklistItem()}
            />
            <button onClick={addChecklistItem}>+</button>
          </div>
        </>
      )}
    </section>
  );
}

function Habits() {
  const [data, setData] = useState(loadULifeData());
  const [showModal, setShowModal] = useState(false);

  const saveModules = (modules) => {
    const updated = { ...data, habitModules: modules };
    saveULifeData(updated);
    setData(updated);
  };

  const addModule = (module) => saveModules([...data.habitModules, module]);

  const updateModule = (updatedModule) => {
    saveModules(data.habitModules.map((module) => module.id === updatedModule.id ? updatedModule : module));
  };

  const togglePin = (id) => {
    saveModules(data.habitModules.map((module) => module.id === id ? { ...module, pinned: !module.pinned } : module));
  };

  const deleteModule = (id) => {
    saveModules(data.habitModules.filter((module) => module.id !== id));
  };

  return (
    <PageStyle>
      <div className="page-title-row">
        <div>
          <h1>Daily Habits</h1>
          <p>Track mental health, water intake, exercise, and custom habits.</p>
        </div>
        <button className="primary-action" onClick={() => setShowModal(true)}>
          + New Habit
        </button>
      </div>

      <div className="habit-layout">
        {data.habitModules.map((module) => (
          <HabitModule
            key={module.id}
            module={module}
            onUpdate={updateModule}
            onTogglePin={() => togglePin(module.id)}
            onDelete={() => deleteModule(module.id)}
          />
        ))}
      </div>

      {showModal && <HabitModal onClose={() => setShowModal(false)} onCreate={addModule} />}
    </PageStyle>
  );
}

export default Habits;
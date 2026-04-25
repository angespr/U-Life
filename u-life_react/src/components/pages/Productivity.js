import React, { useEffect, useMemo, useState } from "react";
import PageStyle from "../main parts/PageStyle";
import { loadULifeData, saveULifeData } from "../../data/ulifeStore";
import "../styles/pages/FeaturePages.css";

function ModuleModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [items, setItems] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreate({
      id: `productivity-${Date.now()}`,
      name: name.trim(),
      type: "checklist",
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
          <h2>Add Productivity Module</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>

        <label>Module name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Checklist items, separated by commas</label>
        <textarea
          value={items}
          placeholder="Study OS, Finish lab, Email professor"
          onChange={(e) => setItems(e.target.value)}
        />

        <button className="modal-submit" type="submit">Create Module</button>
      </form>
    </div>
  );
}

function TaskModule({ module, onUpdate, onTogglePin }) {
  const [input, setInput] = useState("");
  const completed = module.items.filter((item) => item.done).length;

  const addItem = () => {
    if (!input.trim()) return;
    onUpdate({
      ...module,
      items: [...module.items, { id: Date.now(), text: input.trim(), done: false }],
    });
    setInput("");
  };

  const toggleItem = (id) => {
    onUpdate({
      ...module,
      items: module.items.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      ),
    });
  };

  const deleteItem = (id) => {
    onUpdate({ ...module, items: module.items.filter((item) => item.id !== id) });
  };

  return (
    <section className="feature-card">
      <div className="card-heading-row">
        <h2>{module.name}</h2>
        <div className="card-actions">
          <span className="small-pill">{completed}/{module.items.length || 0}</span>
          <button className={module.pinned ? "pin-btn pinned" : "pin-btn"} onClick={onTogglePin}>
            {module.pinned ? "📌 Pinned" : "📍 Pin"}
          </button>
        </div>
      </div>

      <div className="task-list">
        {module.items.map((item) => (
          <div key={item.id} className="task-row">
            <label>
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggleItem(item.id)}
              />
              <span className={item.done ? "done" : ""}>{item.text}</span>
            </label>
            <button className="delete-btn" onClick={() => deleteItem(item.id)}>×</button>
          </div>
        ))}
      </div>

      <div className="input-row">
        <input
          value={input}
          placeholder={`Add item to ${module.name}...`}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
        />
        <button onClick={addItem}>+</button>
      </div>
    </section>
  );
}

function PomodoroTimer() {
  const WORK_SECONDS = 25 * 60;
  const BREAK_SECONDS = 5 * 60;

  const [seconds, setSeconds] = useState(WORK_SECONDS);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState("Focus Time");

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setSeconds((current) => {
        if (current > 1) return current - 1;

        const nextIsBreak = mode === "Focus Time";
        setMode(nextIsBreak ? "Break Time" : "Focus Time");
        return nextIsBreak ? BREAK_SECONDS : WORK_SECONDS;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [running, mode]);

  const time = useMemo(() => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  }, [seconds]);

  const reset = () => {
    setRunning(false);
    setMode("Focus Time");
    setSeconds(WORK_SECONDS);
  };

  return (
    <section className="feature-card timer-card">
      <h2>Pomodoro Timer</h2>
      <div className="timer-display">{time}</div>
      <p>{mode}</p>

      <div className="timer-controls">
        <button onClick={() => setRunning(!running)}>
          {running ? "Pause" : "Start"}
        </button>
        <button className="secondary" onClick={reset}>Reset</button>
      </div>

      <div className="note-box">
        Work: 25 minutes<br />
        Break: 5 minutes
      </div>
    </section>
  );
}

function Productivity() {
  const [data, setData] = useState(loadULifeData());
  const [showModal, setShowModal] = useState(false);

  const saveModules = (modules) => {
    const updated = { ...data, productivityModules: modules };
    saveULifeData(updated);
    setData(updated);
  };

  const addModule = (module) => saveModules([...data.productivityModules, module]);

  const updateModule = (updatedModule) => {
    saveModules(
      data.productivityModules.map((module) =>
        module.id === updatedModule.id ? updatedModule : module
      )
    );
  };

  const togglePin = (id) => {
    saveModules(
      data.productivityModules.map((module) =>
        module.id === id ? { ...module, pinned: !module.pinned } : module
      )
    );
  };

  return (
    <PageStyle>
      <div className="page-title-row">
        <div>
          <h1>Productivity Dashboard</h1>
          <p>Homework, action items, calendar connection, and focused study sessions.</p>
        </div>
        <button className="primary-action" onClick={() => setShowModal(true)}>
          + New Module
        </button>
      </div>

      <div className="productivity-layout">
        <div className="left-stack">
          {data.productivityModules.map((module) => (
            <TaskModule
              key={module.id}
              module={module}
              onUpdate={updateModule}
              onTogglePin={() => togglePin(module.id)}
            />
          ))}

          <section className="feature-card">
            <h2>Calendar</h2>
            <div className="calendar-box">
              <div className="calendar-icon">▣</div>
              <p>Connect your Google Calendar</p>
              <button onClick={() => alert("Google Calendar OAuth can be connected here later.")}>
                Connect Calendar
              </button>
            </div>
          </section>
        </div>

        <PomodoroTimer />
      </div>

      {showModal && <ModuleModal onClose={() => setShowModal(false)} onCreate={addModule} />}
    </PageStyle>
  );
}

export default Productivity;
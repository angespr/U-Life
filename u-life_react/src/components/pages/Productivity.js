import React, { useEffect, useMemo, useState } from "react";
import PageStyle from "../main parts/PageStyle";
import "../styles/pages/FeaturePages.css";

const HOMEWORK_DEFAULTS = ["Complete CS homework assignment", "Read Chapter 5 for History"];
const TODO_DEFAULTS = ["Buy groceries"];

function useStoredList(key, defaults) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    return defaults.map((text, index) => ({
      id: Date.now() + index,
      text,
      done: false,
    }));
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(items));
  }, [key, items]);

  return [items, setItems];
}

function TaskPanel({ title, placeholder, storageKey, defaults }) {
  const [items, setItems] = useStoredList(storageKey, defaults);
  const [input, setInput] = useState("");
  const completed = items.filter((item) => item.done).length;

  const addItem = () => {
    if (!input.trim()) return;
    setItems([...items, { id: Date.now(), text: input.trim(), done: false }]);
    setInput("");
  };

  const toggleItem = (id) => {
    setItems(items.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <section className="feature-card">
      <div className="card-heading-row">
        <h2>{title}</h2>
        <span className="small-pill">{completed}/{items.length || 0}</span>
      </div>

      <div className="task-list">
        {items.map((item) => (
          <div key={item.id} className="task-row">
            <label>
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggleItem(item.id)}
              />
              <span className={item.done ? "done" : ""}>{item.text}</span>
            </label>
            <button className="delete-btn" onClick={() => deleteItem(item.id)}>
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="input-row">
        <input
          value={input}
          placeholder={placeholder}
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

export default function Productivity() {
  return (
    <PageStyle>
      <div className="page-title-row">
        <div>
          <h1>Productivity Dashboard</h1>
          <p>Homework, action items, calendar connection, and focused study sessions.</p>
        </div>
      </div>

      <div className="productivity-layout">
        <div className="left-stack">
          <TaskPanel
            title="Homework"
            placeholder="Add homework task..."
            storageKey="ulife_homework"
            defaults={HOMEWORK_DEFAULTS}
          />

          <TaskPanel
            title="To-Do"
            placeholder="Add action item..."
            storageKey="ulife_todos"
            defaults={TODO_DEFAULTS}
          />

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
    </PageStyle>
  );
}
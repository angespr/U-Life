import React, { useEffect, useMemo, useState } from "react";
import PageStyle from "../main parts/PageStyle";
import { loadULifeData, saveULifeData } from "../../data/ulifeStore";
import "../styles/pages/FeaturePages.css";

const BACKEND_URL = "http://localhost:5000";

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
        .map((text, index) => ({
          id: Date.now() + index,
          text,
          done: false,
        })),
    });

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <form className="module-modal" onSubmit={submit}>
        <div className="modal-header">
          <h2>Add Productivity Module</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <label>Module name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Checklist items, separated by commas</label>
        <textarea
          value={items}
          placeholder="Study OS, Finish lab, Email professor"
          onChange={(e) => setItems(e.target.value)}
        />

        <button className="modal-submit" type="submit">
          Create Module
        </button>
      </form>
    </div>
  );
}

function TaskModule({ module, onUpdate, onTogglePin, onDelete }) {
  const [input, setInput] = useState("");
  const completed = module.items.filter((item) => item.done).length;

  const addItem = () => {
    if (!input.trim()) return;

    onUpdate({
      ...module,
      items: [
        ...module.items,
        {
          id: Date.now(),
          text: input.trim(),
          done: false,
        },
      ],
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
    onUpdate({
      ...module,
      items: module.items.filter((item) => item.id !== id),
    });
  };

  return (
    <section className="feature-card">
      <div className="card-heading-row">
        <h2>{module.name}</h2>

        <div className="card-actions">
          <span className="small-pill">{completed}/{module.items.length || 0}</span>

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

            <button className="delete-btn" onClick={() => deleteItem(item.id)}>
              ×
            </button>
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

        <button className="secondary" onClick={reset}>
          Reset
        </button>
      </div>

      <div className="note-box">
        Work: 25 minutes
        <br />
        Break: 5 minutes
      </div>
    </section>
  );
}

function formatCalendarDate(event) {
  const rawDate = event.start?.dateTime || event.start?.date;

  if (!rawDate) return "No start time";

  const date = new Date(rawDate);

  if (Number.isNaN(date.getTime())) {
    return rawDate;
  }

  return date.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: event.start?.dateTime ? "numeric" : undefined,
    minute: event.start?.dateTime ? "2-digit" : undefined,
  });
}

function CalendarModule({ userId }) {
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState("");

  const connectGoogleCalendar = async () => {
    try {
      setError("");

      const response = await fetch(
        `${BACKEND_URL}/api/google/calendar/auth-url?userId=${encodeURIComponent(
          userId
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get Google auth URL.");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Google Calendar connection failed:", error);
      setError("Could not connect Google Calendar. Make sure your backend is running.");
    }
  };

  const checkCalendarStatus = async () => {
    try {
      setLoadingStatus(true);
      setError("");

      const response = await fetch(
        `${BACKEND_URL}/api/google/calendar/status?userId=${encodeURIComponent(
          userId
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to check calendar status.");
      }

      setCalendarConnected(Boolean(data.connected));
    } catch (error) {
      console.error("Could not check calendar status:", error);
      setError("Could not check Google Calendar connection.");
    } finally {
      setLoadingStatus(false);
    }
  };

  const loadCalendarEvents = async () => {
    try {
      setLoadingEvents(true);
      setError("");

      const response = await fetch(
        `${BACKEND_URL}/api/google/calendar/events?userId=${encodeURIComponent(
          userId
        )}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load calendar events.");
      }

      setCalendarEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Could not load calendar events:", error);
      setError("Could not load calendar events.");
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    checkCalendarStatus();
  }, [userId]);

  useEffect(() => {
    if (calendarConnected) {
      loadCalendarEvents();
    }
  }, [calendarConnected]);

  return (
    <section className="feature-card">
      <h2>Calendar</h2>

      {loadingStatus ? (
        <div className="calendar-box">
          <div className="calendar-icon">▣</div>
          <p>Checking Google Calendar connection...</p>
        </div>
      ) : !calendarConnected ? (
        <div className="calendar-box">
          <div className="calendar-icon">▣</div>
          <p>Connect your Google Calendar</p>

          <button onClick={connectGoogleCalendar}>Connect Calendar</button>

          {error && <p className="calendar-error">{error}</p>}
        </div>
      ) : (
        <div className="calendar-events-box">
          <div className="calendar-connected-row">
            <span className="calendar-connected-pill">
              Google Calendar Connected
            </span>

            <button className="pin-btn" onClick={loadCalendarEvents}>
              {loadingEvents ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {error && <p className="calendar-error">{error}</p>}

          {loadingEvents && calendarEvents.length === 0 ? (
            <p>Loading upcoming events...</p>
          ) : calendarEvents.length === 0 ? (
            <p>No upcoming events found.</p>
          ) : (
            <div className="calendar-event-list">
              {calendarEvents.map((event) => (
                <div className="calendar-event-row" key={event.id}>
                  <h3>{event.summary || "Untitled Event"}</h3>
                  <p>{formatCalendarDate(event)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function Productivity() {
  const [data, setData] = useState(loadULifeData());
  const [showModal, setShowModal] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id || user._id || user.email || "demo-user";

  const saveModules = (modules) => {
    const updated = { ...data, productivityModules: modules };
    saveULifeData(updated);
    setData(updated);
  };

  const addModule = (module) => {
    saveModules([...data.productivityModules, module]);
  };

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

  const deleteModule = (id) => {
    saveModules(data.productivityModules.filter((module) => module.id !== id));
  };

  return (
    <PageStyle>
      <div className="page-title-row">
        <div>
          <h1>Productivity Dashboard</h1>
          <p>
            Homework, action items, calendar connection, and focused study
            sessions.
          </p>
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
              onDelete={() => deleteModule(module.id)}
          />
          ))}

          <CalendarModule userId={userId} />
        </div>

        <PomodoroTimer />
      </div>

      {showModal && (
        <ModuleModal
          onClose={() => setShowModal(false)}
          onCreate={addModule}
        />
      )}
    </PageStyle>
  );
}

export default Productivity;
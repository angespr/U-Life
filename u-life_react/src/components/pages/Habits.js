import React, { useMemo, useState } from "react";
import PageStyle from "../main parts/PageStyle";
import "../styles/pages/FeaturePages.css";

function ProgressBar({ value, max }) {
  const percent = Math.min(100, Math.round((value / max) * 100));

  return (
    <div>
      <div className="progress-label">
        <span>
          {value} / {max}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function Habits() {
  const [mood, setMood] = useState("");
  const [water, setWater] = useState(0);
  const [exercise, setExercise] = useState(0);
  const [habitInput, setHabitInput] = useState("");
  const [customHabits, setCustomHabits] = useState([
    { id: 1, text: "Morning meditation", done: false },
    { id: 2, text: "Exercise 30 min", done: false },
    { id: 3, text: "Read for 20 min", done: false },
  ]);

  const completedCustom = useMemo(
    () => customHabits.filter((habit) => habit.done).length,
    [customHabits]
  );

  const addHabit = () => {
    if (!habitInput.trim()) return;
    setCustomHabits([
      ...customHabits,
      {
        id: Date.now(),
        text: habitInput.trim(),
        done: false,
      },
    ]);
    setHabitInput("");
  };

  const toggleHabit = (id) => {
    setCustomHabits(
      customHabits.map((habit) =>
        habit.id === id ? { ...habit, done: !habit.done } : habit
      )
    );
  };

  const deleteHabit = (id) => {
    setCustomHabits(customHabits.filter((habit) => habit.id !== id));
  };

  return (
    <PageStyle>
      <div className="page-title-row">
        <div>
          <h1>Daily Habits</h1>
          <p>Track mental health, water intake, exercise, and custom habits.</p>
        </div>
      </div>

      <div className="habit-layout">
        <section className="feature-card">
          <h2>Mental Health Check</h2>
          <p>How are you feeling today?</p>

          <div className="mood-grid">
            {["Good", "Okay", "Not Great"].map((option) => (
              <button
                key={option}
                className={mood === option ? "mood-card selected" : "mood-card"}
                onClick={() => setMood(option)}
              >
                <span>
                  {option === "Good" ? "☺" : option === "Okay" ? "😐" : "☹"}
                </span>
                {option}
              </button>
            ))}
          </div>
        </section>

        <section className="feature-card">
          <h2>💧 Water Intake</h2>
          <ProgressBar value={water} max={8} />

          <div className="counter-row">
            <button onClick={() => setWater(Math.max(0, water - 1))}>-</button>
            <button className="wide" onClick={() => setWater(Math.min(8, water + 1))}>
              Add Glass
            </button>
            <button onClick={() => setWater(Math.min(8, water + 1))}>+</button>
          </div>
        </section>

        <section className="feature-card">
          <h2>🏃 Exercise</h2>
          <ProgressBar value={exercise} max={30} />

          <div className="exercise-grid">
            <button onClick={() => setExercise(Math.min(30, exercise + 10))}>
              +10 min
            </button>
            <button onClick={() => setExercise(Math.min(30, exercise + 20))}>
              +20 min
            </button>
            <button onClick={() => setExercise(Math.min(30, exercise + 30))}>
              +30 min
            </button>
          </div>

          <button className="secondary full-button" onClick={() => setExercise(0)}>
            Reset
          </button>
        </section>

        <section className="feature-card">
          <h2>Custom Habits</h2>
          <p>
            Progress: {completedCustom} / {customHabits.length}
          </p>
          <ProgressBar value={completedCustom} max={customHabits.length || 1} />

          <div className="task-list">
            {customHabits.map((habit) => (
              <div key={habit.id} className="task-row">
                <label>
                  <input
                    type="checkbox"
                    checked={habit.done}
                    onChange={() => toggleHabit(habit.id)}
                  />
                  <span className={habit.done ? "done" : ""}>{habit.text}</span>
                </label>
                <button className="delete-btn" onClick={() => deleteHabit(habit.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="input-row">
            <input
              value={habitInput}
              placeholder="Add new habit..."
              onChange={(e) => setHabitInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHabit()}
            />
            <button onClick={addHabit}>+</button>
          </div>
        </section>
      </div>
    </PageStyle>
  );
}

export default Habits;
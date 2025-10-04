import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Schedule.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const START_HOUR = 8;   // 8:00 AM
const END_HOUR = 18;    // 6:00 PM

const DAY_TO_COL = { Mon: 2, Tue: 3, Wed: 4, Thu: 5, Fri: 6 };

function hourLabel(h) {
  const ampm = h >= 12 ? "PM" : "AM";
  const hr12 = ((h + 11) % 12) + 1;
  return `${hr12}:00 ${ampm}`;
}

function parseTime(t) {
  if (!t) return { h: START_HOUR, m: 0 };
  const [hh, mm] = t.split(":").map(Number);
  return { h: hh, m: mm || 0 };
}

export default function Schedule() {
  const hours = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) hours.push(h);

  const [selected, setSelected] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("selectedCourses") || "[]";
      const list = JSON.parse(raw);
      if (Array.isArray(list)) setSelected(list);
    } catch (e) {
      console.error("Could not read selectedCourses from localStorage", e);
    }
  }, []);

  const [removeId, setRemoveId] = useState("");

  function removeSelected() {
    const next = selected.filter((c) => String(c.id) !== String(removeId));
    setSelected(next);
    localStorage.setItem("selectedCourses", JSON.stringify(next));
    setRemoveId("");
  }

  function clearSchedule() {
    localStorage.removeItem("selectedCourses");
    setSelected([]);
    setRemoveId("");
  }

  return (
    <div className="schedule-page">
      <div className="sched-layout">
        {/* Left sidebar */}
        <aside className="sched-sidebar">
          <h2 className="sidebar-title">Menu</h2>

          <Link to="/classSearch" className="btn">Course Catalog</Link>

          {selected.length > 0 && (
            <div className="remove-panel">
              <label className="label">Remove a class</label>
              <select
                className="select"
                value={removeId}
                onChange={(e) => setRemoveId(e.target.value)}
              >
                <option value="">— choose —</option>
                {selected.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.title}
                  </option>
                ))}
              </select>

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button className="btn" onClick={removeSelected} disabled={!removeId}>
                  Remove
                </button>
                <button className="btn ghost" onClick={clearSchedule}>
                  Clear all
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Main grid */}
        <main className="sched-main">
          <h1 className="sched-title">Weekly Schedule</h1>

          <div className="grid">
            {/* top-left corner */}
            <div className="corner" />

            {/* day headers */}
            {DAYS.map((d) => (
              <div key={d} className="day-header">{d}</div>
            ))}

            {/* time labels + empty cells */}
            {hours.map((h) => (
              <React.Fragment key={h}>
                <div className="time-cell">{hourLabel(h)}</div>
                {DAYS.map((d) => (
                  <div key={d + h} className="slot-cell" />
                ))}
              </React.Fragment>
            ))}

            {/* COURSE BLOCKS */}
            {selected.flatMap((c) => {
              const { h: sh, m: sm } = parseTime(c.start);
              const { h: eh, m: em } = parseTime(c.end);
              const startRow = (sh - START_HOUR) + 2; // header row is 1
              const durationMin = (eh * 60 + em) - (sh * 60 + sm);
              const rowSpan = Math.max(1, Math.ceil(durationMin / 60));
              const offsetFrac = Math.max(0, Math.min(59, sm)) / 60; // minute offset

              const days = Array.isArray(c.days) ? c.days : [];
              return days.map((day) => {
                const col = DAY_TO_COL[day];
                if (!col) return null;

                return (
                  <div
                    key={`${c.id}-${day}`}
                    className="course-cell"
                    style={{
                      gridColumn: `${col} / ${col + 1}`,
                      gridRow: `${startRow} / span ${rowSpan}`,
                    }}
                  >
                    <div
                      className="course-block"
                      style={{
                        marginTop: `calc(var(--slot-h) * ${offsetFrac})`,
                        height: `calc(100% - var(--slot-h) * ${offsetFrac} - 6px)`,
                      }}
                    >
                      <div className="course-title">{c.code}</div>
                      <div className="course-meta">
                        {c.title} • {c.instructor} • {c.start}–{c.end}
                      </div>
                    </div>
                  </div>
                );
              });
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// Map "MWF" -> ["Mon","Wed","Fri"], "TR" -> ["Tue","Thu"]
function parseDays(short) {
  const map = { M: "Mon", T: "Tue", W: "Wed", R: "Thu", F: "Fri" };
  return (short || "")
    .split("")
    .map((ch) => map[ch])
    .filter(Boolean);
}

// Normalize DB row -> UI course shape
function normalize(row) {
  return {
    id: row.id ?? `${row.code}-${row.start_time}-${row.days}`,
    code: row.code,
    title: row.title,
    instructor: row.instructor,
    start: row.start_time,    // DB uses start_time
    end: row.end_time,        // DB uses end_time
    days: Array.isArray(row.days) ? row.days : parseDays(row.days),
  };
}

const MOCK = [
  { id: 1, code: "CPTS101", title: "Intro to Computer Science", instructor: "Dr. Smith",   start: "09:00", end: "10:15", days: ["Mon","Wed","Fri"] },
  { id: 2, code: "CPTS322", title: "Software Engineering",     instructor: "Dr. Lee",     start: "11:00", end: "12:15", days: ["Tue","Thu"]       },
  { id: 3, code: "MATH201", title: "Calculus I",                instructor: "Dr. Johnson", start: "14:00", end: "15:15", days: ["Mon","Wed","Fri"] },
];

export default function ClassSearch() {
     const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("http://localhost:3001/api/courses") // via Vite proxy (to :3001)
      .then((res) => {
        if (!res.ok) throw new Error("bad status");
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        const list = Array.isArray(json) ? json.map(normalize) : [];
        setCourses(list.length ? list : MOCK);
        setUsingMock(!list.length);
      })
      .catch(() => {
        if (cancelled) return;
        setCourses(MOCK);
        setUsingMock(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function addToSchedule(course) {
    const key = "selectedCourses";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const already = existing.some((c) => c.id === course.id);
    const updated = already ? existing : [...existing, course];
    localStorage.setItem(key, JSON.stringify(updated));
    navigate("/schedule");
  }

  return (
    <div
      style={{
        colorScheme: "light",
        background: "#f6f8fb",
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
        marginRight: "calc(50% - 50vw)",
        height: "100vh",
        overflowY: "scroll",
        boxSizing: "border-box",
        padding: 16,
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ margin: 0, color: "#0f172a" }}>Available Courses</h2>
        {usingMock && (
          <p style={{ fontSize: 12, color: "#6b7280" }}>
            (Showing mock data — backend DB at <code>/api/courses</code> returned 500 or empty.)
          </p>
        )}
        <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 0 0" }}>
          {courses.map((c) => (
            <li
              key={c.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 10,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontWeight: 800, color: "#0f172a" }}>
                  {c.code} — {c.title}
                </div>
                <div style={{ fontSize: 13, color: "#374151" }}>
                  {c.instructor} · {c.days.join("/")} · {c.start}–{c.end}
                </div>
              </div>
              <button
                onClick={() => addToSchedule(c)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #cbd5e1",
                  background: "#f8fafc",
                  color: "#0f172a",
                  cursor: "pointer",
                }}
              >
                Add to Schedule
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

}

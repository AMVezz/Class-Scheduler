import React from "react";
import { Link } from "react-router-dom";
import "./Schedule.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const START_HOUR = 8;   // 8:00 AM
const END_HOUR = 18;    // 6:00 PM

function hourLabel(h) {
  const ampm = h >= 12 ? "PM" : "AM";
  const hr12 = ((h + 11) % 12) + 1;
  return `${hr12}:00 ${ampm}`;
}

export default function Schedule() {
  const hours = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) hours.push(h);

  return (
    <div className="schedule-page">{/* full-bleed + force light colors */}
      <div className="sched-layout">
        {/* Left sidebar */}
        <aside className="sched-sidebar">
          <h2 className="sidebar-title">Menu</h2>
          <Link to="/classSearch" className="btn">Course Catalog</Link>
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
          </div>
        </main>
      </div>
    </div>
  );
}

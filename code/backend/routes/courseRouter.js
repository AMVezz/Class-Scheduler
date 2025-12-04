// code/backend/routes/courseRouter.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /api/courses  -> list all courses
router.get("/", async (_req, res) => {
  try {
    const result = await db.query(
      `SELECT id, code, title, instructor, start_time, end_time, days
       FROM courses
       ORDER BY id`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("GET /api/courses failed:", err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// routes/courseRouter.js
router.get("/search", async (req, res) => {
  try {
    const { q = "", name = "", professor = "" } = req.query;
    // EITHER call the repository:
    // const rows = await CourseRepo.search({ q, name, professor });

    // OR query directly without the repo (works the same):
    const terms = [], vals = []; let i = 1;
    const T = (s) => (typeof s === "string" ? s.trim() : "");
    const qv = T(q), nv = T(name), pv = T(professor);

    if (qv) { terms.push(`(code ILIKE '%'||$${i}||'%' OR title ILIKE '%'||$${i}||'%' OR instructor ILIKE '%'||$${i}||'%')`); vals.push(qv); }
    else {
      if (nv) { terms.push(`(code ILIKE '%'||$${i}||'%' OR title ILIKE '%'||$${i}||'%')`); vals.push(nv); i++; }
      if (pv) { terms.push(`instructor ILIKE '%'||$${i}||'%'`); vals.push(pv); }
    }
    if (!terms.length) return res.status(200).json([]);

    const sql = `
      SELECT id, code, title, instructor, start_time, end_time, days
      FROM courses
      WHERE ${terms.join(" AND ")}
      ORDER BY code ASC
      LIMIT 200
    `;
    const r = await db.query(sql, vals);
    res.status(200).json(r.rows);
  } catch (e) {
    console.error("GET /api/courses/search failed:", e);
    res.status(500).json({ error: "Failed to search courses" });
  }
});

// GET /api/courses/:id  -> single course by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // basic validation
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const result = await db.query(
      `SELECT id, code, title, instructor, start_time, end_time, days
       FROM courses
       WHERE id = $1`,
      [Number(id)]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(`GET /api/courses/${id} failed:`, err);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

module.exports = router;

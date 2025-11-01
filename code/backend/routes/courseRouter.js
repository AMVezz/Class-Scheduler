// code/backend/routes/courseRouter.js
const express = require("express");
const cors = require('cors');
const db      = require("../config/db");

const router = express.Router();
router.use(cors());

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

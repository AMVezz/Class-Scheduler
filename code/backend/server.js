require('dotenv').config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const courseRouter = require("./routes/courseRouter"); // matches file name exactly


const app = express();

app.use("/api/courses", courseRouter);

app.get("/whoami", (_req, res) => res.send("server.js is running"));


const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend API is running 🚀");
});

// Example DB route
app.get("/api/courses", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM courses");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
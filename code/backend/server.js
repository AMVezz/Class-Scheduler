require('dotenv').config();
const express = require("express");
const cors = require("cors");
const courseRouter = require("./routes/courseRouter");

const app = express();
const PORT = process.env.PORT || 3001;

// middleware first
app.use(cors());
app.use(express.json());

// mount router
app.use("/api/courses", courseRouter);

// health
app.get("/", (_req, res) => res.send("Backend API is running"));
app.get("/whoami", (_req, res) => res.send("server.js is running"));

// no duplicate /api/courses here

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

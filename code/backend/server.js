const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const fs = require("fs");

const app = express();
app.use(express.json());

// Allow your frontend origin
app.use(cors({ origin: "http://localhost:5173" }));

// Load service account
const serviceAccount = JSON.parse(
  fs.readFileSync("serviceAccountKey.json", "utf8")
);

// Fix newlines in private key
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Example protected API
app.get("/api/protected", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.json({ message: `Hello ${decodedToken.email}, you are authorized!` });
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
});


const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
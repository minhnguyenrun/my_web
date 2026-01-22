const express = require("express");
const pool = require("./db");
const path = require("path");

const app = express();
app.use(express.json());

// serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// API
app.get("/api/users", async (req, res) => {
  const [rows] = await pool.query("SELECT id, email FROM users");
  res.json(rows);
});

app.post("/api/users", async (req, res) => {
  const { email, password } = req.body;
  await pool.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, password]
  );
  res.json({ success: true });
});

app.listen(8000, () =>
  console.log("Open: http://localhost:8000")
);

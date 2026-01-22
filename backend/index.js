const express = require("express");
const path = require("path");
const pool = require("./db");

const app = express();
app.use(express.json());

// serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// API
app.get("/api/users", async (req, res) => {
  const result = await pool.query("SELECT id, email FROM users");
  res.json(result.rows);
});

app.post("/api/users", async (req, res) => {
  const { email, password } = req.body;
  await pool.query(
    "INSERT INTO users (email, password) VALUES ($1, $2)",
    [email, password]
  );
  res.json({ success: true });
});

app.listen(8000, () =>
  console.log("Open: http://localhost:8000")
);

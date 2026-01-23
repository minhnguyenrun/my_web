import express from "express";
import cors from "cors";
import pool from "./db.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

/* Serve frontend */
app.use(express.static(path.join(__dirname, "../public")));

/* ------------------ API USERS ------------------ */

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const { name } = req.body;
    const result = await pool.query(
      "INSERT INTO users(name) VALUES($1) RETURNING *",
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- SCHOLARSHIPS ---------------- */

app.get("/api/scholarships", async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT id, title, summary, deadline FROM scholarships ORDER BY created_at DESC"
    );
    res.json(r.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/scholarships/:id", async (req, res) => {
  try {
    const r = await pool.query(
      "SELECT * FROM scholarships WHERE id=$1",
      [req.params.id]
    );
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/admin/scholarships", async (req, res) => {
  try {
    const { title, summary, content, deadline } = req.body;
    const r = await pool.query(
      `INSERT INTO scholarships(title,summary,content,deadline)
       VALUES($1,$2,$3,$4) RETURNING *`,
      [title, summary, content, deadline]
    );
    res.json(r.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- APPLICATION ---------------- */

app.post("/api/apply", async (req, res) => {
  try {
    const { scholarship_id, full_name, email, note } = req.body;
    await pool.query(
      `INSERT INTO applications(scholarship_id, full_name, email, note)
       VALUES($1,$2,$3,$4)`,
      [scholarship_id, full_name, email, note]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------- FRONTEND FALLBACK -------------- */

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

/* ----------------- START ---------------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));

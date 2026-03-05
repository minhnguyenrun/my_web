import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public")));

// Serve scholarship HTML files
app.get('/scholarships/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, "../public/scholarships", req.params.filename));
});

// Fallback route for SPA
app.get('*', (req, res) => {
  if (req.path.endsWith('.html') || req.path.endsWith('.css') || req.path.endsWith('.js')) {
    res.status(404).send('File not found');
  } else {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  }
});

export default app;

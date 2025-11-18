const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database("database.db");

// ===== REGISTRO =====
app.post("/api/register", (req, res) => {
  const {
    name,
    email,
    password,
    country = "",
    avatar = "assets/img/default-avatar-profile-icon.jpg"
  } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, country, avatar)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(name, email, password, country, avatar);

    res.json({ success: true, message: "Usuario registrado" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Correo ya registrado" });
  }
});

// ===== LOGIN =====
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const stmt = db.prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
  const user = stmt.get(email);

  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  if (user.password !== password)
    return res.status(401).json({ message: "Contraseña incorrecta" });

  res.json(user);
});

// ===== ACTUALIZAR PROGRESO =====
app.patch("/api/progress/:id", (req, res) => {
  const { id } = req.params;
  const { progressEnglish, progressFrench, progressRussian } = req.body;

  const stmt = db.prepare(`
    UPDATE users SET 
      progressEnglish = ?, 
      progressFrench = ?,
      progressRussian = ?
    WHERE id = ?
  `);

  stmt.run(progressEnglish, progressFrench, progressRussian, id);

  res.json({ success: true });
});

// Servir FRONTEND
app.use(express.static("../"));

app.listen(4000, () => {
  console.log("Servidor SQLite ejecutándose en http://localhost:4000");
});


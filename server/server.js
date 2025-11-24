const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database("database.db");

// ===== INICIALIZAR BASE DE DATOS =====
// Crear tabla de usuarios si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    country TEXT DEFAULT '',
    avatar TEXT DEFAULT 'assets/img/default-avatar-profile-icon.jpg',
    level TEXT DEFAULT 'Principiante',
    progressEnglish INTEGER DEFAULT 0,
    progressFrench INTEGER DEFAULT 0,
    progressRussian INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log("Base de datos inicializada correctamente");


// ===== REGISTRO =====
app.post("/api/register", async (req, res) => {
  const {
    name,
    email,
    password,
    country = "",
    avatar = "assets/img/default-avatar-profile-icon.jpg"
  } = req.body;

  try {
    // Hash de la contraseña con bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, country, avatar)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(name, email, hashedPassword, country, avatar);

    res.json({ success: true, message: "Usuario registrado" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Correo ya registrado" });
  }
});

// ===== LOGIN =====
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const stmt = db.prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
  const user = stmt.get(email);

  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  // Verificar contraseña hasheada con bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Contraseña incorrecta" });
  }

  res.json(user);
});

// ===== GOOGLE LOGIN =====
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("1020252781524-ofd58tkv7rpuvles3odrlb3mltjpgrgb.apps.googleusercontent.com");

app.post("/api/auth/google", async (req, res) => {
  const { token } = req.body;

  console.log("=== Google Auth Request ===");
  console.log("Token recibido:", token ? `${token.substring(0, 50)}...` : "NO HAY TOKEN");

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "1020252781524-ofd58tkv7rpuvles3odrlb3mltjpgrgb.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();

    const { email, name, picture } = payload;
    console.log("Usuario de Google:", { email, name });

    // Buscar usuario en DB
    const stmt = db.prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    let user = stmt.get(email);

    if (!user) {
      console.log("Usuario no existe, registrando automáticamente...");
      // Si no existe, lo registramos automáticamente
      // Hash de contraseña dummy para usuarios de Google
      const hashedDummyPassword = await bcrypt.hash("GOOGLE_AUTH_USER", 10);

      const insert = db.prepare(`
        INSERT INTO users (name, email, password, country, avatar)
        VALUES (?, ?, ?, ?, ?)
      `);
      insert.run(name, email, hashedDummyPassword, "", picture);
      user = stmt.get(email);
      console.log("Usuario registrado exitosamente");
    } else {
      console.log("Usuario ya existe en BD");
    }

    res.json(user);

  } catch (error) {
    console.error("=== ERROR en Google Auth ===");
    console.error("Tipo de error:", error.name);
    console.error("Mensaje:", error.message);
    console.error("Stack:", error.stack);
    res.status(401).json({ message: "Token de Google inválido" });
  }
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

// ===== ACTUALIZAR DATOS DEL USUARIO =====
app.patch("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, country, avatar } = req.body;

  try {
    // Validaciones
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "El nombre debe tener al menos 2 caracteres"
      });
    }

    const stmt = db.prepare(`
      UPDATE users SET 
        name = ?, 
        country = ?,
        avatar = ?
      WHERE id = ?
    `);

    stmt.run(name.trim(), country || "", avatar || "assets/img/default-avatar-profile-icon.jpg", id);

    // Obtener usuario actualizado
    const userStmt = db.prepare("SELECT * FROM users WHERE id = ? LIMIT 1");
    const updatedUser = userStmt.get(id);

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar perfil" });
  }
});

// ===== RESETEAR CONTRASEÑA =====
app.post("/api/reset-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validar que vengan los datos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos"
      });
    }

    // Validar longitud de contraseña
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe tener al menos 8 caracteres"
      });
    }

    // Buscar usuario por email
    const userStmt = db.prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    const user = userStmt.get(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No existe una cuenta con ese correo"
      });
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar contraseña
    const updateStmt = db.prepare("UPDATE users SET password = ? WHERE email = ?");
    updateStmt.run(hashedPassword, email);

    res.json({ success: true, message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al resetear contraseña:", error);
    res.status(500).json({ success: false, message: "Error al actualizar la contraseña" });
  }
});

// ===== ELIMINAR CUENTA DE USUARIO =====
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  try {
    // Verificar que el usuario existe
    const userStmt = db.prepare("SELECT * FROM users WHERE id = ? LIMIT 1");
    const user = userStmt.get(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // Eliminar usuario
    const deleteStmt = db.prepare("DELETE FROM users WHERE id = ?");
    deleteStmt.run(id);

    res.json({
      success: true,
      message: "Cuenta eliminada correctamente"
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar la cuenta"
    });
  }
});

// Servir FRONTEND
app.use(express.static("../"));

app.listen(4000, () => {
  console.log("Servidor SQLite ejecutándose en http://localhost:4000");
});

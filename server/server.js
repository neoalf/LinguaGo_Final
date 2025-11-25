/* ============================================================
   server.js - Servidor Backend de LinguaGo
   ============================================================
   
   TECNOLOGÍAS:
   - Express: Framework web para Node.js
   - SQLite (better-sqlite3): Base de datos local
   - bcrypt: Encriptación de contraseñas
   - Google OAuth2: Autenticación con Google
   - CORS: Permite peticiones desde el frontend
   
   FUNCIONALIDADES:
   - Registro e inicio de sesión de usuarios
   - Autenticación con Google
   - Gestión de perfiles de usuario
   - Seguimiento de progreso por idioma
   - Recuperación y restablecimiento de contraseñas
   - Eliminación de cuentas
   ============================================================ */

// ============================================================
// IMPORTACIÓN DE DEPENDENCIAS
// ============================================================
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");

// ============================================================
// CONFIGURACIÓN DEL SERVIDOR EXPRESS
// ============================================================
const app = express();
// CORS configuracion para mobile y web app
app.use(cors({
  origin: [
    'http://localhost:4000',       // Web API
    'http://localhost:8100',       // Ionic dev server
    'http://localhost:8101',       // Ionic dev server (otro)
    'capacitor://localhost',       // iOS Capacitor
    'ionic://localhost',           // Android Capacitor
    'http://localhost',            // localhost general
    'http://localhost:3000',       // localhost alternativo
    'http://127.0.0.1:5500',       // otro localhost alternativo
  ],
  credentials: true
}));
app.use(express.json()); // Permite recibir JSON en el body de las peticiones

// ============================================================
// CONEXIÓN A LA BASE DE DATOS SQLITE
// ============================================================
const db = new Database("database.db");

// ============================================================
// INICIALIZAR BASE DE DATOS
// Crea la tabla de usuarios si no existe
// ============================================================
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


// ============================================================
// ENDPOINT: REGISTRO DE NUEVOS USUARIOS
// POST /api/register
// ============================================================
// Crea una nueva cuenta de usuario con contraseña encriptada
app.post("/api/register", async (req, res) => {
  const {
    name,
    email,
    password,
    country = "",
    avatar = "assets/img/default-avatar-profile-icon.jpg"
  } = req.body;

  try {
    // ============================================================
    // SEGURIDAD: Hash de la contraseña con bcrypt
    // Se usa 10 salt rounds para un balance entre seguridad y rendimiento
    // ============================================================
    const hashedPassword = await bcrypt.hash(password, 10);

    // Preparar consulta SQL para insertar usuario
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, country, avatar)
      VALUES (?, ?, ?, ?, ?)
    `);

    // Ejecutar inserción con contraseña hasheada
    stmt.run(name, email, hashedPassword, country, avatar);

    res.json({ success: true, message: "Usuario registrado" });
  } catch (error) {
    // Error típico: email duplicado (UNIQUE constraint)
    res.status(400).json({ success: false, message: "Correo ya registrado" });
  }
});

// ============================================================
// ENDPOINT: INICIO DE SESIÓN
// POST /api/login
// ============================================================
// Verifica credenciales y devuelve datos del usuario
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // Buscar usuario por email
  const stmt = db.prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
  const user = stmt.get(email);

  // Verificar si el usuario existe
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  // ============================================================
  // SEGURIDAD: Verificar contraseña hasheada con bcrypt
  // bcrypt.compare() compara la contraseña en texto plano con el hash
  // ============================================================
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Contraseña incorrecta" });
  }

  // Login exitoso: devolver datos del usuario
  res.json(user);
});

// ============================================================
// ENDPOINT: AUTENTICACIÓN CON GOOGLE
// POST /api/auth/google
// ============================================================
// Verifica el token de Google y registra/loguea al usuario
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("1020252781524-ofd58tkv7rpuvles3odrlb3mltjpgrgb.apps.googleusercontent.com");

app.post("/api/auth/google", async (req, res) => {
  const { token } = req.body;

  console.log("=== Google Auth Request ===");
  console.log("Token recibido:", token ? `${token.substring(0, 50)}...` : "NO HAY TOKEN");

  try {
    // ============================================================
    // VERIFICAR TOKEN DE GOOGLE
    // Google OAuth2 verifica que el token sea válido y no haya sido manipulado
    // ============================================================
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "1020252781524-ofd58tkv7rpuvles3odrlb3mltjpgrgb.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();

    const { email, name, picture } = payload;
    console.log("Usuario de Google:", { email, name });

    // Buscar si el usuario ya existe en la base de datos
    const stmt = db.prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    let user = stmt.get(email);

    if (!user) {
      console.log("Usuario no existe, registrando automáticamente...");

      // ============================================================
      // REGISTRO AUTOMÁTICO DE USUARIOS DE GOOGLE
      // Si es la primera vez que inicia sesión, se crea su cuenta
      // ============================================================
      // Hash de contraseña dummy para usuarios de Google
      // (no usarán contraseña, solo Google OAuth)
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

    // Devolver datos del usuario
    res.json(user);

  } catch (error) {
    console.error("=== ERROR en Google Auth ===");
    console.error("Tipo de error:", error.name);
    console.error("Mensaje:", error.message);
    console.error("Stack:", error.stack);
    res.status(401).json({ message: "Token de Google inválido" });
  }
});

// ============================================================
// ENDPOINT: ACTUALIZAR PROGRESO DE IDIOMAS
// PATCH /api/progress/:id
// ============================================================
// Actualiza el progreso del usuario en los 3 idiomas
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

// ============================================================
// ENDPOINT: ACTUALIZAR DATOS DEL PERFIL
// PATCH /api/users/:id
// ============================================================
// Permite al usuario actualizar su nombre, país y avatar
app.patch("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, country, avatar } = req.body;

  try {
    // ============================================================
    // VALIDACIÓN: Nombre debe tener al menos 2 caracteres
    // ============================================================
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "El nombre debe tener al menos 2 caracteres"
      });
    }

    // Preparar y ejecutar actualización
    const stmt = db.prepare(`
      UPDATE users SET 
        name = ?, 
        country = ?,
        avatar = ?
      WHERE id = ?
    `);

    stmt.run(name.trim(), country || "", avatar || "assets/img/default-avatar-profile-icon.jpg", id);

    // Obtener y devolver usuario actualizado
    const userStmt = db.prepare("SELECT * FROM users WHERE id = ? LIMIT 1");
    const updatedUser = userStmt.get(id);

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar perfil" });
  }
});

// ============================================================
// ENDPOINT: RESTABLECER CONTRASEÑA
// POST /api/reset-password
// ============================================================
// Permite al usuario cambiar su contraseña olvidada
app.post("/api/reset-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    // ============================================================
    // VALIDACIONES
    // ============================================================
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos"
      });
    }

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

    // ============================================================
    // SEGURIDAD: Encriptar nueva contraseña con bcrypt
    // ============================================================
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar contraseña en la base de datos
    const updateStmt = db.prepare("UPDATE users SET password = ? WHERE email = ?");
    updateStmt.run(hashedPassword, email);

    res.json({ success: true, message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al resetear contraseña:", error);
    res.status(500).json({ success: false, message: "Error al actualizar la contraseña" });
  }
});

// ============================================================
// ENDPOINT: ELIMINAR CUENTA DE USUARIO
// DELETE /api/users/:id
// ============================================================
// Elimina permanentemente la cuenta del usuario
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  try {
    // Verificar que el usuario existe antes de eliminar
    const userStmt = db.prepare("SELECT * FROM users WHERE id = ? LIMIT 1");
    const user = userStmt.get(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // Eliminar usuario de la base de datos
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

// ============================================================
// SERVIR ARCHIVOS ESTÁTICOS DEL FRONTEND
// Permite acceder a HTML, CSS, JS e imágenes desde el servidor
// ============================================================
app.use(express.static("../"));

// ============================================================
// INICIAR SERVIDOR EN EL PUERTO 4000
// ============================================================
app.listen(4000, () => {
  console.log("Servidor SQLite ejecutándose en http://localhost:4000");
});

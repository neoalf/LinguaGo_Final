const Database = require("better-sqlite3");
const db = new Database("database.db");

// Crear tabla de usuarios si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    country TEXT,
    avatar TEXT,
    progressEnglish INTEGER DEFAULT 0,
    progressFrench INTEGER DEFAULT 0,
    progressRussian INTEGER DEFAULT 0
  );
`);

console.log("Base de datos inicializada.");

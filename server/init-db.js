/* ============================================================
   init-db.js - Inicialización de la Base de Datos
   ============================================================
   
   PROPÓSITO:
   Script auxiliar para crear la estructura inicial de la base de datos.
   Crea la tabla de usuarios con todos los campos necesarios.
   
   USO:
   node init-db.js
   
   NOTA: Este script es opcional ya que server.js también inicializa
   la base de datos automáticamente al arrancar.
   ============================================================ */

const Database = require("better-sqlite3");
const db = new Database("database.db");

// ============================================================
// CREAR TABLA DE USUARIOS
// Define la estructura de datos para almacenar usuarios
// ============================================================
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

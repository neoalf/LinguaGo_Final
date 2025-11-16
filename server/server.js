// server/server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const jsonServer = require("json-server");

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// 🔹 Servir los archivos del FRONTEND (una carpeta arriba)
app.use(express.static(path.join(__dirname, "..")));

// 🔹 API simulada con JSON Server
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();
app.use("/api", middlewares, router);

// 🔹 Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor LinguaGo activo en http://localhost:${PORT}`);
});

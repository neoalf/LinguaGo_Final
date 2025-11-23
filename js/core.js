/* ============================================================
   core.js
   Funciones globales para todo el sitio LinguaGo
   ============================================================ */

// ===== Configuración global del proyecto =====
// Se crea el objeto global "LinguaGo" donde se almacenarán
// variables y funciones accesibles desde todo el sitio.
// API_BASE es la URL donde JSON Server expone los endpoints.

window.LinguaGo = {
  API_BASE: "http://localhost:4000/api"  // JSON Server
};


// ===== Botón "volver arriba" =====
// Se crea dinámicamente un botón flotante para regresar al inicio.

const topBtn = document.createElement("button");
topBtn.innerHTML = "↑";                 // Texto del botón
topBtn.classList.add("lg-btn-top");     // Clase CSS personalizada
document.body.appendChild(topBtn);      // Se agrega al documento

// Muestra u oculta el botón según la posición del scroll.

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    topBtn.classList.add("show");     // Mostrar botón
  } else {
    topBtn.classList.remove("show");   // Ocultar botón
  }
});

// Al hacer clic, el usuario vuelve suavemente al inicio de la página.

topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ============================================================
// NAVBAR RESPONSIVE
// Maneja el menú hamburguesa en pantallas pequeñas
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("js-hamburger");
  const nav = document.getElementById("js-nav");

  if (hamburger && nav) {
    // Alterna el menú cuando se hace clic al icono hamburguesa.
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation(); // Evitar que el click se propague
      hamburger.classList.toggle("active");
      nav.classList.toggle("show");
    });

    // Cuando se hace clic en un enlace del menú:
    // se cierra automáticamente (mejora UX).
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("show");
        hamburger.classList.remove("active");
      });
    });

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener("click", (e) => {
      // Si el menú está abierto y el clic no es dentro del nav ni del hamburger
      if (nav.classList.contains("show")) {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
          nav.classList.remove("show");
          hamburger.classList.remove("active");
        }
      }
    });

    // Prevenir que los clics dentro del nav cierren el menú
    nav.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
});


// ============================================================
// SISTEMA DE SESIÓN
// Maneja login, logout y persistencia en localStorage
// ============================================================

// Obtiene el usuario actualmente autenticado desde localStorage.

function getActiveUser() {
  return JSON.parse(localStorage.getItem("linguagoUser"));
}


// Guarda el usuario autenticado en localStorage.

function setActiveUser(user) {
  localStorage.setItem("linguagoUser", JSON.stringify(user));
}

// Cierra sesión eliminando al usuario y redirigiendo al login.

function logout() {
  localStorage.removeItem("linguagoUser");
  window.location.href = "login.html";
}

// ============================================================
// VERIFICAR SESIÓN EN PÁGINAS PRIVADAS
// Evita que usuarios no autenticados accedan a secciones protegidas
// ============================================================

function verifySession() {
  const user = getActiveUser();
  if (!user) window.location.href = "login.html";     // Si no hay usuario, lo envía al login.
  else console.log("Usuario activo:", user.email || user.name);    // Solo para debug
}

// ============================================================
// RE-EXPORTAR FUNCIONES EN EL NAMESPACE Global
// ============================================================
const API_BASE = "http://localhost:4000/api"; // Definir aquí para que esté disponible
window.LinguaGo = { API_BASE, getActiveUser, setActiveUser, logout, verifySession };

// ============================================================
// SISTEMA GLOBAL DE NOTIFICACIONES (TOASTS)
// Muestra alertas modernas y temporales (éxito, error, etc.)
// ============================================================

// Asegura que LinguaGo exista para evitar errores.

window.LinguaGo = window.LinguaGo || {};

// Asegura que API_BASE esté disponible.

LinguaGo.API_BASE = "http://localhost:4000/api";  // Backend

// ===== Crear función de toast =====

LinguaGo.toast = function (message, type = "info") {

  // Contenedor donde se insertarán los toasts.
  const container = document.getElementById("toast-container");
  if (!container) return;

  // Crear elemento del toast.

  const toast = document.createElement("div");
  toast.classList.add("linguago-toast", `toast-${type}`);

  // Iconos por tipo de mensaje.
  const icons = {
    success: "fa-check-circle",
    info: "fa-info-circle",
    warning: "fa-exclamation-circle",
    error: "fa-times-circle"
  };

  // Se arma el contenido del toast.
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;

  // Se agrega al contenedor.
  container.appendChild(toast);

  // Se elimina el toast después de 4 segundos
  setTimeout(() => {
    toast.remove();
  }, 4000);
};


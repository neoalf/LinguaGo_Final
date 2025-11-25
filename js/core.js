/* ============================================================
   core.js
   Funciones globales para todo el sitio LinguaGo
   ============================================================ */

// ============================================================
// CONFIGURACIÓN GLOBAL DE LA API
// ============================================================
// Inicializa el objeto global LinguaGo con la URL base de la API
window.LinguaGo = {
  API_BASE: "http://localhost:4000/api"
};

// ============================================================
// BOTÓN DE SCROLL HACIA ARRIBA
// ============================================================
// Crea dinámicamente un botón para volver al inicio de la página
const topBtn = document.createElement("button");
topBtn.innerHTML = "↑";
topBtn.classList.add("lg-btn-top");
document.body.appendChild(topBtn);

// Muestra el botón cuando el usuario hace scroll más de 400px
window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    topBtn.classList.add("show");
  } else {
    topBtn.classList.remove("show");
  }
});

// Al hacer clic en el botón, hace scroll suave hacia el inicio
topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ============================================================
// MENÚ HAMBURGUESA (NAVEGACIÓN MÓVIL)
// ============================================================
// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Obtiene referencias al botón hamburguesa y al menú de navegación
  const hamburger = document.getElementById("js-hamburger");
  const nav = document.getElementById("js-nav");

  // Solo ejecuta si ambos elementos existen en la página
  if (hamburger && nav) {
    // Al hacer clic en el botón hamburguesa, alterna la visibilidad del menú
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation(); // Evita que el clic se propague al documento
      hamburger.classList.toggle("active");
      nav.classList.toggle("show");
    });

    // Cierra el menú cuando se hace clic en cualquier enlace de navegación
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("show");
        hamburger.classList.remove("active");
      });
    });

    // Cierra el menú si se hace clic fuera de él
    document.addEventListener("click", (e) => {
      if (nav.classList.contains("show")) {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
          nav.classList.remove("show");
          hamburger.classList.remove("active");
        }
      }
    });

    // Evita que los clics dentro del menú lo cierren
    nav.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
});

// ============================================================
// GESTIÓN DE SESIÓN DE USUARIO
// ============================================================

/**
 * Obtiene el usuario activo desde localStorage
 * @returns {Object|null} Objeto del usuario o null si no hay sesión
 */
function getActiveUser() {
  return JSON.parse(localStorage.getItem("linguagoUser"));
}

/**
 * Guarda el usuario activo en localStorage
 * @param {Object} user - Objeto del usuario a guardar
 */
function setActiveUser(user) {
  localStorage.setItem("linguagoUser", JSON.stringify(user));
}

/**
 * Cierra la sesión del usuario y redirige a login
 */
function logout() {
  localStorage.removeItem("linguagoUser");
  window.location.href = "login.html";
}

/**
 * Verifica si hay una sesión activa, redirige a login si no la hay
 */
function verifySession() {
  const user = getActiveUser();
  if (!user) window.location.href = "login.html";
  else console.log("Usuario activo:", user.email || user.name);
}

// ============================================================
// EXPORTACIÓN DE FUNCIONES GLOBALES
// ============================================================
// Define la URL base de la API y exporta las funciones de sesión
const API_BASE = "http://localhost:4000/api";
window.LinguaGo = { API_BASE, getActiveUser, setActiveUser, logout, verifySession };

// Asegura que el objeto LinguaGo exista (patrón de inicialización segura)
window.LinguaGo = window.LinguaGo || {};
LinguaGo.API_BASE = "http://localhost:4000/api";

// ============================================================
// SISTEMA DE NOTIFICACIONES TOAST
// ============================================================
/**
 * Muestra una notificación toast temporal
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación: 'success', 'info', 'warning', 'error'
 */
LinguaGo.toast = function (message, type = "info") {
  // Busca el contenedor de toasts en el DOM
  const container = document.getElementById("toast-container");
  if (!container) return;

  // Crea el elemento toast
  const toast = document.createElement("div");
  toast.classList.add("linguago-toast", `toast-${type}`);

  // Define los iconos de Font Awesome para cada tipo de notificación
  const icons = {
    success: "fa-check-circle",
    info: "fa-info-circle",
    warning: "fa-exclamation-circle",
    error: "fa-times-circle"
  };

  // Construye el HTML del toast con icono y mensaje
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
  container.appendChild(toast);

  // Elimina automáticamente el toast después de 4 segundos
  setTimeout(() => {
    toast.remove();
  }, 4000);
};

// Crea un alias global para facilitar el uso de las notificaciones
window.showToast = LinguaGo.toast;
/* ============================================================
   core.js
   Funciones globales para todo el sitio LinguaGo
   ============================================================ */

// ===== URL base del servidor =====
// core.js
window.LinguaGo = {
  API_BASE: "http://localhost:4000/api"  // JSON Server
};


// ===== Botón "volver arriba" =====
const topBtn = document.createElement("button");
topBtn.innerHTML = "↑";
topBtn.classList.add("lg-btn-top");
document.body.appendChild(topBtn);

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    topBtn.classList.add("show");
  } else {
    topBtn.classList.remove("show");
  }
});

topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== Navbar responsive =====
const hamburger = document.getElementById("js-hamburger");
const nav = document.getElementById("js-nav");
if (hamburger && nav) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    nav.classList.toggle("show");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("show");
      hamburger.classList.remove("active");
    });
  });
}

// ===== Sesión =====
function getActiveUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function setActiveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// ===== Verificar sesión en páginas privadas =====
function verifySession() {
  const user = getActiveUser();
  if (!user) window.location.href = "login.html";
  else console.log("Usuario activo:", user.email);
}

// Exportar funciones
window.LinguaGo = { API_BASE, getActiveUser, setActiveUser, logout, verifySession };

// ============================================================
// SISTEMA GLOBAL DE NOTIFICACIONES (TOASTS) - LINGUAGO
// ============================================================
window.LinguaGo = window.LinguaGo || {};
LinguaGo.API_BASE = "http://localhost:4000/api";  // Backend

LinguaGo.toast = function (message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.classList.add("linguago-toast", `toast-${type}`);

  // Icono según tipo
  const icons = {
    success: "fa-check-circle",
    info: "fa-info-circle",
    warning: "fa-exclamation-circle",
    error: "fa-times-circle"
  };

  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
  container.appendChild(toast);

  // Eliminar automáticamente después de animación
  setTimeout(() => {
    toast.remove();
  }, 4000);
};


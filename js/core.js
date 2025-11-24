/* ============================================================
   core.js
   Funciones globales para todo el sitio LinguaGo
   ============================================================ */

window.LinguaGo = {
  API_BASE: "http://localhost:4000/api"
};

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

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("js-hamburger");
  const nav = document.getElementById("js-nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      hamburger.classList.toggle("active");
      nav.classList.toggle("show");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("show");
        hamburger.classList.remove("active");
      });
    });

    document.addEventListener("click", (e) => {
      if (nav.classList.contains("show")) {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
          nav.classList.remove("show");
          hamburger.classList.remove("active");
        }
      }
    });

    nav.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
});

function getActiveUser() {
  return JSON.parse(localStorage.getItem("linguagoUser"));
}

function setActiveUser(user) {
  localStorage.setItem("linguagoUser", JSON.stringify(user));
}

function logout() {
  localStorage.removeItem("linguagoUser");
  window.location.href = "login.html";
}

function verifySession() {
  const user = getActiveUser();
  if (!user) window.location.href = "login.html";
  else console.log("Usuario activo:", user.email || user.name);
}

const API_BASE = "http://localhost:4000/api";
window.LinguaGo = { API_BASE, getActiveUser, setActiveUser, logout, verifySession };

window.LinguaGo = window.LinguaGo || {};
LinguaGo.API_BASE = "http://localhost:4000/api";

LinguaGo.toast = function (message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.classList.add("linguago-toast", `toast-${type}`);

  const icons = {
    success: "fa-check-circle",
    info: "fa-info-circle",
    warning: "fa-exclamation-circle",
    error: "fa-times-circle"
  };

  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
};

window.showToast = LinguaGo.toast;
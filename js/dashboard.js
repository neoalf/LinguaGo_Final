/* ============================================================
   dashboard.js
   Dashboard con progreso persistente en localStorage
   ============================================================ */

// Simulación de API base
const API_BASE = `${LinguaGo.API_BASE || ""}`;

// Elementos principales
const userNameEl = document.getElementById("lg-username");
const courseListEl = document.getElementById("courseList");
const logoutBtn = document.getElementById("logoutBtn");

//  Verificar sesión
let user = JSON.parse(localStorage.getItem("linguagoUser"));
if (!user) {
  window.location.href = "login.html";
} else {
  userNameEl.textContent = `¡Bienvenido, ${user.name}!`;
}

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("linguagoUser"));

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Cargar nombre
  document.getElementById("lg-user-name").textContent = user.name;

  // Cargar nivel (si no existe, mostrar “Principiante”)
  document.getElementById("lg-user-level").textContent =
    user.level || "Principiante";

  // Avatar (si el user acepta imagen más adelante)
  document.getElementById("lg-user-avatar").src =
    user.avatar || "assets/img/default-avatar.png";

  // Progreso total (promedio de los cursos)
  const progress =
    (Number(user.progressEnglish || 0) +
      Number(user.progressFrench || 0) +
      Number(user.progressRussian || 0)) /
    3;

  document.getElementById("lg-user-progress").style.width = progress + "%";
});

//  Datos iniciales de cursos
const defaultCourses = [
  {
    id: "english",
    title: "English Start: Tu primer paso hacia el inglés.",
    desc: "Aprende inglés desde cero con vocabulario básico y práctica auditiva.",
    img: "assets/img/Britain.png",
  },
  {
    id: "french",
    title: "Bonjour Français: Tu inicio en el idioma del amor.",
    desc: "Aprende francés de manera divertida con frases útiles.",
    img: "assets/img/France.jpg",
  },
  {
    id: "russian",
    title: "Privet Ruso: Tu puerta al idioma más fascinante.",
    desc: "Domina el alfabeto cirílico y frases comunes en ruso.",
    img: "assets/img/russian.jpeg",
  }
];

// Inicializar progreso si no existe
if (!user.progress) {
  user.progress = {
    english: 0,
    french: 0,
    russian: 0
  };
  localStorage.setItem("linguagoUser", JSON.stringify(user));
}

// Renderizar cursos
function renderCourses() {
  courseListEl.innerHTML = "";

  defaultCourses.forEach(course => {
    const progress = user.progress[course.id] || 0;

    const card = document.createElement("div");
    card.classList.add("lg-course-card");

    card.innerHTML = `
      <div class="lg-course-text">
        <div class="lg-progress"><div class="lg-progress-bar" style="width:${progress}%;"></div></div>
        <h3>${course.title}</h3>
        <p>${course.desc}</p>
        <button class="lg-course-btn" data-id="${course.id}">
          ${progress >= 100 ? "Completado 🎉" : "Continuar"}
        </button>
      </div>
      <img src="${course.img}" alt="${course.title}" class="lg-course-img">
    `;

    courseListEl.appendChild(card);
  });

  attachButtonEvents();
}

// Escuchar clicks en botones
function attachButtonEvents() {
  document.querySelectorAll(".lg-course-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      let progress = user.progress[id] || 0;

      if (progress < 100) {
        progress = Math.min(100, progress + 10);
        user.progress[id] = progress;
        localStorage.setItem("linguagoUser", JSON.stringify(user));
        renderCourses();

       

      } else {
        LinguaGo.toast("¡Ya completaste este curso! 🎉");
      }
    });
  });
}

// Función opcional para sincronizar con backend
async function syncProgressWithServer(userId, courseId, progress) {
  try {
    await fetch(`${API_BASE}/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        progress: { ...user.progress, [courseId]: progress }
      })
    });
  } catch (err) {
    console.warn("No se pudo sincronizar el progreso con el servidor:", err);
  }
}

// Cerrar sesión
logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("linguagoUser");
  window.location.href = "index.html";
});

// Render inicial
renderCourses();


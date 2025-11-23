/* ============================================================
   dashboard.js
   Dashboard con progreso persistente en localStorage
   ============================================================ */

// API base del sistema (útil si luego se usa un backend real)
const API_BASE = `${LinguaGo.API_BASE || ""}`;

// Elementos principales del DOM
const userNameEl = document.getElementById("lg-username");
const courseListEl = document.getElementById("courseList");
const logoutBtn = document.getElementById("logoutBtn");


// ============================================================
// VERIFICAR SESIÓN DEL USUARIO
// Si no hay sesión, no se permite entrar al dashboard
// ============================================================

let user = JSON.parse(localStorage.getItem("linguagoUser"));
if (!user) {
  window.location.href = "login.html";
} else {
  userNameEl.textContent = `¡Bienvenido, ${user.name}!`;  // Saludo inicial
}


// ============================================================
// CARGA DE DATOS DEL USUARIO AL CARGAR EL DOM
// Rellena avatar, nombre, nivel y barra general de progreso
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("linguagoUser"));

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Mostrar nombre
  document.getElementById("lg-user-name").textContent = user.name;

  // Mostrar nivel del usuario (o principiante si no existe)
  document.getElementById("lg-user-level").textContent =
    user.level || "Principiante";

  // Avatar por defecto si no existe uno guardado
  document.getElementById("lg-user-avatar").src =
    user.avatar || "assets/img/default-avatar.png";

  // Calcular progreso general como promedio de los tres cursos
  const progress =
    (Number(user.progressEnglish || 0) +
      Number(user.progressFrench || 0) +
      Number(user.progressRussian || 0)) / 3;

  // Actualizar barra de progreso
  document.getElementById("lg-user-progress").style.width = progress + "%";
});


// ============================================================
// DATOS PREDEFINIDOS DE CURSOS MOSTRADOS EN EL DASHBOARD
// (sirven como catálogo que siempre se renderiza)
// ============================================================

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


// ============================================================
// INICIALIZAR PROGRESO DEL USUARIO SI NO EXISTE
// Esto asegura consistencia en nuevos usuarios
// ============================================================

if (!user.progress) {
  user.progress = {
    english: 0,
    french: 0,
    russian: 0
  };
  localStorage.setItem("linguagoUser", JSON.stringify(user));
}


// ============================================================
// RENDERIZAR LA LISTA DE CURSOS EN EL DASHBOARD
// Crea tarjetas dinámicas para cada curso con barra de progreso
// ============================================================

function renderCourses() {
  courseListEl.innerHTML = ""; // Limpiar lista previa

  defaultCourses.forEach(course => {
    const progress = user.progress[course.id] || 0;

    // Crear tarjeta del curso
    const card = document.createElement("div");
    card.classList.add("lg-course-card");

    // Contenido HTML dinámico
    card.innerHTML = `
      <div class="lg-course-text">
        <div class="lg-progress">
          <div class="lg-progress-bar" style="width:${progress}%;"></div>
        </div>
        <h3>${course.title}</h3>
        <p>${course.desc}</p>
        <button class="lg-course-btn" data-id="${course.id}">
          ${progress >= 100 ? "Completado 🎉" : "Continuar"}
        </button>
      </div>
      <img src="${course.img}" alt="${course.title}" class="lg-course-img">
    `;

    // Añadir al dashboard
    courseListEl.appendChild(card);
  });

  // Agregar listeners a los botones
  attachButtonEvents();
}


// ============================================================
// MANEJAR CLICS EN LOS BOTONES DE LOS CURSOS
// Cada clic aumenta el progreso +10% hasta 100%
// ============================================================

function attachButtonEvents() {
  document.querySelectorAll(".lg-course-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      let progress = user.progress[id] || 0;

      // Si no está al 100%, incrementa progreso
      if (progress < 100) {
        progress = Math.min(100, progress + 10);
        user.progress[id] = progress;

        // Guardar en localStorage
        localStorage.setItem("linguagoUser", JSON.stringify(user));

        // ============================================================
        // ACTUALIZAR EN SERVIDOR
        // PATCH /api/progress/:id
        // ============================================================
        fetch(`${LinguaGo.API_BASE}/progress/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            progressEnglish: user.progress.english,
            progressFrench: user.progress.french,
            progressRussian: user.progress.russian
          })
        }).catch(err => console.error("Error guardando progreso:", err));

        // Volver a renderizar tarjetas
        renderCourses();

      } else {
        // Si ya está completado
        LinguaGo.toast("¡Ya completaste este curso! 🎉");
      }
    });
  });
}

// CERRAR SESIÓN DESDE EL DASHBOARD
// Limpia localStorage y vuelve a la página principal

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("linguagoUser");
  window.location.href = "index.html";
});

// RENDER INICIAL DEL DASHBOARD
renderCourses();



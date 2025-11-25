/* ============================================================
   dashboard.js
   Dashboard con progreso persistente en localStorage
   ============================================================ */

// ============================================================
// DATOS PREDEFINIDOS DE CURSOS MOSTRADOS EN EL DASHBOARD
// Estos son los 3 cursos disponibles en LinguaGo.
// Cada curso tiene: id único, título, descripción e imagen.
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
// INICIALIZACIÓN AL CARGAR EL DOM
// Todo el código se ejecuta cuando el DOM está completamente cargado
// ============================================================
console.log("dashboard.js cargado");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded disparado");

  // ============================================================
  // 1. VERIFICAR SESIÓN DEL USUARIO
  // Si no hay usuario logueado, redirige al login
  // ============================================================
  let user = JSON.parse(localStorage.getItem("linguagoUser"));
  console.log("Usuario desde localStorage:", user);

  if (!user) {
    console.log("No hay usuario, redirigiendo a login");
    window.location.href = "login.html";
    return;
  }

  // ============================================================
  // 2. OBTENER REFERENCIAS A ELEMENTOS DEL DOM
  // Estos elementos se usan para mostrar información del usuario
  // ============================================================
  const userNameEl = document.getElementById("lg-username");
  const courseListEl = document.getElementById("courseList");
  const logoutBtn = document.getElementById("logoutBtn");
  const closeBannerBtn = document.getElementById("closeBannerBtn");
  const welcomeBanner = document.getElementById("welcomeBanner");

  console.log("Elementos encontrados:", {
    userNameEl,
    courseListEl,
    logoutBtn,
    closeBannerBtn,
    welcomeBanner
  });

  // ============================================================
  // 3. MOSTRAR DATOS DEL USUARIO EN LA INTERFAZ
  // Actualiza nombre, nivel, avatar y progreso general
  // ============================================================

  // Mensaje de bienvenida personalizado
  if (userNameEl) userNameEl.textContent = `¡Bienvenido, ${user.name}!`;

  // Panel lateral: nombre del usuario
  const panelName = document.getElementById("lg-user-name");
  if (panelName) panelName.textContent = user.name;

  // Panel lateral: nivel del usuario (por defecto "Principiante")
  const panelLevel = document.getElementById("lg-user-level");
  if (panelLevel) panelLevel.textContent = user.level || "Principiante";

  // Panel lateral: avatar del usuario
  const panelAvatar = document.getElementById("lg-user-avatar");
  if (panelAvatar) panelAvatar.src = user.avatar || "assets/img/default-avatar.png";

  // Calcular progreso general como promedio de los 3 idiomas
  const progress =
    (Number(user.progressEnglish || 0) +
      Number(user.progressFrench || 0) +
      Number(user.progressRussian || 0)) / 3;

  // Actualizar barra de progreso visual
  const panelProgress = document.getElementById("lg-user-progress");
  if (panelProgress) panelProgress.style.width = progress + "%";

  // ============================================================
  // 4. INICIALIZAR ESTRUCTURA DE PROGRESO
  // Migra datos antiguos (progressEnglish, etc.) al nuevo formato
  // Si el usuario no tiene progreso, lo inicializa en 0
  // ============================================================
  if (!user.progress) {
    user.progress = {
      english: user.progressEnglish || 0,
      french: user.progressFrench || 0,
      russian: user.progressRussian || 0
    };
    localStorage.setItem("linguagoUser", JSON.stringify(user));
    console.log("Progreso inicializado:", user.progress);
  } else {
    console.log("Usuario ya tiene progreso:", user.progress);
  }

  // ============================================================
  // 5. RENDERIZAR CURSOS DISPONIBLES
  // Crea dinámicamente las tarjetas de cada curso con su progreso
  // ============================================================

  /**
   * Renderiza todas las tarjetas de cursos en el contenedor
   */
  function renderCourses() {
    console.log("renderCourses llamado");
    console.log("courseListEl:", courseListEl);

    if (!courseListEl) {
      console.error("courseListEl no encontrado!");
      return;
    }

    // Limpiar contenido previo
    courseListEl.innerHTML = "";

    console.log("Renderizando", defaultCourses.length, "cursos");

    // Crear una tarjeta por cada curso
    defaultCourses.forEach(course => {
      const progress = user.progress[course.id] || 0;
      console.log(`Renderizando curso ${course.id} con progreso ${progress}%`);

      const card = document.createElement("div");
      card.classList.add("lg-course-card");

      // Estructura HTML de la tarjeta
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

      courseListEl.appendChild(card);
    });

    console.log("Cursos renderizados, adjuntando eventos");
    attachButtonEvents();
  }

  /**
   * Adjunta eventos de clic a los botones de cada curso
   * Al hacer clic, redirige a la página del curso correspondiente
   */
  function attachButtonEvents() {
    document.querySelectorAll(".lg-course-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        console.log(`Botón clickeado para curso: ${id}`);

        // Mapeo de IDs de cursos a sus páginas HTML
        const coursePages = {
          english: "curso-ingles.html",
          french: "curso-frances.html",
          russian: "curso-ruso.html"
        };

        // Redirigir a la página del curso
        if (coursePages[id]) {
          window.location.href = coursePages[id];
        } else {
          console.error(`No se encontró página para el curso: ${id}`);
        }
      });
    });
  }

  // Ejecutar renderizado inicial
  console.log("Llamando a renderCourses()");
  renderCourses();

  // ============================================================
  // 6. EVENT LISTENERS - ACCIONES DEL USUARIO
  // ============================================================

  // ============================================================
  // EVENTO: Cerrar sesión
  // Elimina datos del usuario y redirige a la página principal
  // ============================================================
  if (logoutBtn) {
    console.log("Adjuntando event listener a logoutBtn");
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Logout clickeado");
      localStorage.removeItem("linguagoUser");
      window.location.href = "index.html";
    });
  } else {
    console.error("Logout button not found");
  }

  // ============================================================
  // EVENTO: Cerrar banner de bienvenida
  // Oculta el mensaje de bienvenida pero mantiene la imagen
  // ============================================================
  if (closeBannerBtn && welcomeBanner) {
    console.log("Adjuntando event listener a closeBannerBtn");
    closeBannerBtn.addEventListener("click", () => {
      console.log("Close banner clickeado");
      // Solo ocultar el texto y el botón, mantener la imagen
      const bannerText = document.querySelector(".lg-dashboard-banner-text");
      if (bannerText) bannerText.style.display = "none";
      closeBannerBtn.style.display = "none";
    });
  } else {
    console.error("Banner elements not found", { closeBannerBtn, welcomeBanner });
  }

  console.log("Dashboard inicializado completamente");
});

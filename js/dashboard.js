/* ============================================================
   dashboard.js
   Dashboard con progreso persistente en localStorage
   ============================================================ */

// ============================================================
// DATOS PREDEFINIDOS DE CURSOS MOSTRADOS EN EL DASHBOARD
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
// ============================================================
console.log("dashboard.js cargado");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded disparado");

  // 1. VERIFICAR SESIÓN
  let user = JSON.parse(localStorage.getItem("linguagoUser"));
  console.log("Usuario desde localStorage:", user);

  if (!user) {
    console.log("No hay usuario, redirigiendo a login");
    window.location.href = "login.html";
    return;
  }

  // 2. OBTENER ELEMENTOS DEL DOM
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

  // 3. MOSTRAR DATOS DEL USUARIO
  if (userNameEl) userNameEl.textContent = `¡Bienvenido, ${user.name}!`;

  const panelName = document.getElementById("lg-user-name");
  if (panelName) panelName.textContent = user.name;

  const panelLevel = document.getElementById("lg-user-level");
  if (panelLevel) panelLevel.textContent = user.level || "Principiante";

  const panelAvatar = document.getElementById("lg-user-avatar");
  if (panelAvatar) panelAvatar.src = user.avatar || "assets/img/default-avatar.png";

  // Calcular progreso general
  const progress =
    (Number(user.progressEnglish || 0) +
      Number(user.progressFrench || 0) +
      Number(user.progressRussian || 0)) / 3;

  const panelProgress = document.getElementById("lg-user-progress");
  if (panelProgress) panelProgress.style.width = progress + "%";

  // 4. INICIALIZAR PROGRESO SI NO EXISTE
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

  // 5. RENDERIZAR CURSOS
  function renderCourses() {
    console.log("renderCourses llamado");
    console.log("courseListEl:", courseListEl);

    if (!courseListEl) {
      console.error("courseListEl no encontrado!");
      return;
    }

    courseListEl.innerHTML = "";

    console.log("Renderizando", defaultCourses.length, "cursos");

    defaultCourses.forEach(course => {
      const progress = user.progress[course.id] || 0;
      console.log(`Renderizando curso ${course.id} con progreso ${progress}%`);

      const card = document.createElement("div");
      card.classList.add("lg-course-card");

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

  console.log("Llamando a renderCourses()");
  renderCourses();

  // 6. EVENT LISTENERS

  // Logout
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

  // Cerrar Banner
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

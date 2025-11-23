/**
 * Controla testimonios, carrusel de idiomas y botón volver arriba.
 * Implementación con patrón MVC para mantener orden y separación de responsabilidades.
 */

// ================== MODELO ==================
const Model = (function () {
  // Clave para almacenar datos en localStorage
  const STORAGE_KEY = "lg_data_v1";

  // Estado inicial (primer uso de la app)
  const initialState = {
    testimonials: [
      {
        quote: "Gracias a LinguaGo ahora puedo mantener conversaciones en inglés sin miedo. ¡Las lecciones son claras y prácticas!",
        name: "Ana Juárez Pavón",
        meta: "Diseñadora de modas, Nicaragua",
        avatar: "assets/img/Ana-Juarez.png"
      },
      {
        quote: "Las clases son dinámicas y prácticas. Pude mejorar mi pronunciación en pocas semanas.",
        name: "Diego Méndez",
        meta: "Estudiante, Costa Rica",
        avatar: "assets/img/Diego-Mendez.png"
      },
      {
        quote: "Aprender francés fue mucho más divertido de lo que imaginaba. ¡LinguaGo me ayudó a hacerlo fácil y entretenido!",
        name: "María López",
        meta: "Chef, El Salvador",
        avatar: "assets/img/Maria-Lopez.png"
      }
    ]
  };

  // Carga estado desde localStorage o inicializa si no existe
  function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  }

  const state = load();

  return {
    getTestimonials: () => state.testimonials
  };
})();



// ================== VISTA ==================
const View = (function () {

  // Renderiza un testimonio dentro de un contenedor
  function renderTestimonial(container, data) {
    container.innerHTML = `
      <blockquote class="lg-test-quote">“${escapeHTML(data.quote)}”</blockquote>
      <div class="lg-test-author">
        <img src="${data.avatar}" class="lg-test-avatar" alt="Avatar ${data.name}">
        <div>
          <div class="lg-test-name">${escapeHTML(data.name)}</div>
          <div class="lg-test-meta">${escapeHTML(data.meta)}</div>
        </div>
      </div>
      <div class="lg-test-stars">★★★★★</div>
    `;
  }

  // Sanitiza texto para evitar inyección HTML (RNF12)
  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[m]));
  }

  return { renderTestimonial };
})();



// ================== CONTROLADOR ==================
const Controller = (function (Model, View) {

  const testimonials = Model.getTestimonials();
  let current = 0; // Testimonio actual mostrado

  // Función principal de inicialización
  function init() {
    const testCard = document.getElementById("js-test-card");
    const dotsContainer = document.getElementById("js-test-dots");
    const btnTop = document.getElementById("js-btn-top");

    // Render inicial del primer testimonio
    View.renderTestimonial(testCard, testimonials[current]);
    renderDots();

    // Cambio automático cada 5 segundos
    setInterval(() => nextTestimonial(), 5000);

    // Clic en los dots para cambiar testimonio
    dotsContainer.addEventListener("click", e => {
      if (e.target.classList.contains("lg-dot")) {
        current = Number(e.target.dataset.index);
        updateTestimonial();
      }
    });

    // Mostrar / ocultar botón "Volver arriba"
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) btnTop.classList.add("show");
      else btnTop.classList.remove("show");
    });

    btnTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Auto-scroll del carrusel de idiomas
    autoScrollLanguages();


    // ===== Menú hamburguesa (overlay lateral) =====
    // Se maneja en core.js para todo el sitio.



    // ===== Llamada a la acción: "Iniciar ahora" =====
    const startBtn = document.getElementById("js-cta");
    if (startBtn) {
      startBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "login.html";
      });
    }

    // ===== Botones del carrusel de idiomas =====
    const langButtons = document.querySelectorAll(".lg-lang-btn");
    langButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "login.html";
      });
    });
  }

  // Renderiza los botones de navegación (dots)
  function renderDots() {
    const dotsContainer = document.getElementById("js-test-dots");
    dotsContainer.innerHTML = "";
    testimonials.forEach((_, i) => {
      const btn = document.createElement("button");
      btn.className = "lg-dot" + (i === 0 ? " lg-dot--active" : "");
      btn.dataset.index = i;
      dotsContainer.appendChild(btn);
    });
  }

  // Avanza al siguiente testimonio
  function nextTestimonial() {
    current = (current + 1) % testimonials.length;
    updateTestimonial();
  }

  // Actualiza testimonio y estado visual de los dots
  function updateTestimonial() {
    const testCard = document.getElementById("js-test-card");
    const dots = document.querySelectorAll(".lg-dot");

    View.renderTestimonial(testCard, testimonials[current]);

    dots.forEach((d, i) =>
      d.classList.toggle("lg-dot--active", i === current)
    );
  }

  // Carrusel automático horizontal para tarjetas de idiomas
  function autoScrollLanguages() {
    const carousel = document.getElementById("js-lang-carousel");
    if (!carousel) return;

    let scrollPos = 0;

    setInterval(() => {
      scrollPos += 300;

      // Reiniciar scroll al llegar al final
      if (scrollPos >= carousel.scrollWidth - carousel.clientWidth) {
        scrollPos = 0;
      }

      carousel.scrollTo({ left: scrollPos, behavior: "smooth" });
    }, 4000);
  }

  return { init };

})(Model, View);


// ================== INICIO ==================
// Se ejecuta al cargar la página
document.addEventListener("DOMContentLoaded", Controller.init);

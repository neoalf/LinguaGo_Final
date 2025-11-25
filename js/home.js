/**
 * ============================================================
 * home.js - Página principal de LinguaGo
 * ============================================================
 * Controla testimonios, carrusel de idiomas y botón volver arriba.
 * Implementación con patrón MVC para mantener orden y separación de responsabilidades.
 * 
 * ARQUITECTURA:
 * - Model: Maneja los datos (testimonios) y su persistencia en localStorage
 * - View: Renderiza los elementos visuales en el DOM
 * - Controller: Coordina la lógica de negocio y eventos
 */

// ============================================================
// MODELO (MODEL) - Capa de datos
// ============================================================
// Maneja el estado de la aplicación y la persistencia de datos.
// Los testimonios se guardan en localStorage para mantener consistencia.
const Model = (function () {
  // Clave para almacenar datos en localStorage
  const STORAGE_KEY = "lg_data_v1";

  // Estado inicial (primer uso de la app)
  // Contiene los testimonios de usuarios satisfechos con LinguaGo
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
        avatar: "assets/img/Diego-Mendez.jpeg"
      },
      {
        quote: "Aprender francés fue mucho más divertido de lo que imaginaba. ¡LinguaGo me ayudó a hacerlo fácil y entretenido!",
        name: "María López",
        meta: "Chef, El Salvador",
        avatar: "assets/img/Maria-Lopez.png"
      }
    ]
  };

  /**
   * Carga el estado desde localStorage o inicializa si no existe
   * @returns {Object} Estado de la aplicación con testimonios
   */
  function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  }

  const state = load();

  // API pública del modelo
  return {
    getTestimonials: () => state.testimonials
  };
})();



// ============================================================
// VISTA (VIEW) - Capa de presentación
// ============================================================
// Responsable de renderizar elementos en el DOM.
// No contiene lógica de negocio, solo presentación visual.
const View = (function () {

  /**
   * Renderiza un testimonio dentro de un contenedor
   * @param {HTMLElement} container - Elemento donde se renderizará el testimonio
   * @param {Object} data - Datos del testimonio (quote, name, meta, avatar)
   */
  function renderTestimonial(container, data) {
    container.innerHTML = `
      <blockquote class="lg-test-quote">"${escapeHTML(data.quote)}"</blockquote>
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

  /**
   * Sanitiza texto para evitar inyección HTML (XSS)
   * Reemplaza caracteres especiales por sus entidades HTML
   * @param {string} str - Texto a sanitizar
   * @returns {string} Texto seguro para insertar en HTML
   */
  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[m]));
  }

  // API pública de la vista
  return { renderTestimonial };
})();



// ============================================================
// CONTROLADOR (CONTROLLER) - Capa de lógica de negocio
// ============================================================
// Coordina el flujo de datos entre el Modelo y la Vista.
// Maneja eventos del usuario y actualiza la interfaz.
const Controller = (function (Model, View) {

  const testimonials = Model.getTestimonials();
  let current = 0; // Índice del testimonio actual mostrado

  /**
   * Función principal de inicialización
   * Se ejecuta cuando el DOM está listo
   */
  function init() {
    const testCard = document.getElementById("js-test-card");
    const dotsContainer = document.getElementById("js-test-dots");
    const btnTop = document.getElementById("js-btn-top");

    // Renderizar el primer testimonio
    View.renderTestimonial(testCard, testimonials[current]);
    renderDots();

    // Cambio automático de testimonio cada 5 segundos
    setInterval(() => nextTestimonial(), 5000);

    // ============================================================
    // EVENTO: Clic en los dots (puntos de navegación)
    // Permite al usuario cambiar manualmente de testimonio
    // ============================================================
    dotsContainer.addEventListener("click", e => {
      if (e.target.classList.contains("lg-dot")) {
        current = Number(e.target.dataset.index);
        updateTestimonial();
      }
    });

    // ============================================================
    // EVENTO: Scroll de la página
    // Muestra/oculta el botón "Volver arriba" según la posición
    // ============================================================
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) btnTop.classList.add("show");
      else btnTop.classList.remove("show");
    });

    // ============================================================
    // EVENTO: Clic en botón "Volver arriba"
    // Hace scroll suave hacia el inicio de la página
    // ============================================================
    btnTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Iniciar carrusel automático de idiomas
    autoScrollLanguages();


    // ============================================================
    // NOTA: Menú hamburguesa (overlay lateral)
    // Se maneja en core.js para todo el sitio.
    // ============================================================



    // ============================================================
    // EVENTO: Botón "Iniciar ahora" (Call to Action)
    // Redirige al usuario a la página de login
    // ============================================================
    const startBtn = document.getElementById("js-cta");
    if (startBtn) {
      startBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "login.html";
      });
    }

    // ============================================================
    // EVENTO: Botones del carrusel de idiomas
    // Todos redirigen al login para que el usuario se registre
    // ============================================================
    const langButtons = document.querySelectorAll(".lg-lang-btn");
    langButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "login.html";
      });
    });
  }

  /**
   * Renderiza los botones de navegación (dots) para los testimonios
   * Crea un punto por cada testimonio disponible
   */
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

  /**
   * Avanza al siguiente testimonio
   * Usa módulo (%) para volver al inicio al llegar al final
   */
  function nextTestimonial() {
    current = (current + 1) % testimonials.length;
    updateTestimonial();
  }

  /**
   * Actualiza el testimonio mostrado y el estado visual de los dots
   * Sincroniza la vista con el estado actual
   */
  function updateTestimonial() {
    const testCard = document.getElementById("js-test-card");
    const dots = document.querySelectorAll(".lg-dot");

    View.renderTestimonial(testCard, testimonials[current]);

    // Actualizar estado activo de los dots
    dots.forEach((d, i) =>
      d.classList.toggle("lg-dot--active", i === current)
    );
  }

  /**
   * Carrusel automático horizontal para tarjetas de idiomas
   * Hace scroll automático cada 4 segundos
   */
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

  // API pública del controlador
  return { init };

})(Model, View);


// ============================================================
// INICIO DE LA APLICACIÓN
// ============================================================
// Se ejecuta cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", Controller.init);

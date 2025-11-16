/**
 Controla testimonios, carrusel de idiomas y botón volver arriba.
 */

// ================== MODELO ==================
const Model = (function() {
  const STORAGE_KEY = "lg_data_v1";

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
const View = (function() {
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

  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    }[m]));
  }

  return { renderTestimonial };
})();

// ================== CONTROLADOR ==================
const Controller = (function(Model, View) {
  const testimonials = Model.getTestimonials();
  let current = 0;

  function init() {
    const testCard = document.getElementById("js-test-card");
    const dotsContainer = document.getElementById("js-test-dots");
    const btnTop = document.getElementById("js-btn-top");

    // Render inicial
    View.renderTestimonial(testCard, testimonials[current]);
    renderDots();

    // Cambio automático de testimonios
    setInterval(() => nextTestimonial(), 5000);

    // Evento click en dots
    dotsContainer.addEventListener("click", e => {
      if (e.target.classList.contains("lg-dot")) {
        current = Number(e.target.dataset.index);
        updateTestimonial();
      }
    });

    // Mostrar botón "Volver arriba"
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) btnTop.classList.add("show");
      else btnTop.classList.remove("show");
    });

    btnTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Carrusel de idiomas auto-scroll
    autoScrollLanguages();

// ===== Menú hamburguesa (overlay lateral) =====
const hamburger = document.getElementById('js-hamburger');
const nav = document.getElementById('js-nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  nav.classList.toggle('show');
});

// Cerrar menú al hacer clic en un enlace
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('show');
    hamburger.classList.remove('active');
  });
});

// ===== Botón "Iniciar ahora" =====
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

  function nextTestimonial() {
    current = (current + 1) % testimonials.length;
    updateTestimonial();
  }

  function updateTestimonial() {
    const testCard = document.getElementById("js-test-card");
    const dots = document.querySelectorAll(".lg-dot");
    View.renderTestimonial(testCard, testimonials[current]);
    dots.forEach((d, i) =>
      d.classList.toggle("lg-dot--active", i === current)
    );
  }

  // Carrusel de idiomas: desplazamiento automático suave
  function autoScrollLanguages() {
    const carousel = document.getElementById("js-lang-carousel");
    if (!carousel) return;
    let scrollPos = 0;
    setInterval(() => {
      scrollPos += 300;
      if (scrollPos >= carousel.scrollWidth - carousel.clientWidth) scrollPos = 0;
      carousel.scrollTo({ left: scrollPos, behavior: "smooth" });
    }, 4000);
  }

  return { init };
})(Model, View);

// ================== INICIO ==================
document.addEventListener("DOMContentLoaded", Controller.init);
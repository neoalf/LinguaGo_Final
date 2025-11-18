/* ============================================================
   curso.js
   Control centralizado de progreso para los cursos de idiomas
   ============================================================ */

// Elementos principales del DOM
const video = document.getElementById("lessonVideo");      // Video de la lección
const progressBar = document.getElementById("progressBar"); // Barra de progreso visual
const progressValue = document.getElementById("progressValue"); // Texto del porcentaje

// ============================================================
// CREAR BOTÓN DE REINICIO DE PROGRESO
// El botón se crea dinámicamente para mantener limpio el HTML
// ============================================================

const resetBtn = document.createElement("button");
resetBtn.textContent = "Reiniciar progreso";
resetBtn.classList.add("lg-reset-btn");

// Se inserta dentro del contenedor de progreso si existe
const progressContainer = document.querySelector(".lg-course-progress");
if (progressContainer) progressContainer.appendChild(resetBtn);


// ============================================================
// VERIFICAR SESIÓN DEL USUARIO
// Evita acceso de usuarios no autenticados
// ============================================================

let user = JSON.parse(localStorage.getItem("linguagoUser"));
if (!user) {
  window.location.href = "login.html";  // Redirige si no hay sesión
}


// ============================================================
// DETECTAR IDIOMA DE LA LECCIÓN SEGÚN LA URL
// Esto permite manejar progreso independiente por idioma
// ============================================================

const path = window.location.pathname.toLowerCase();
let langKey = "";

// Se identifica el idioma según el nombre del archivo o carpeta
if (path.includes("ingles")) langKey = "english";
else if (path.includes("frances")) langKey = "french";
else if (path.includes("ruso")) langKey = "russian";
else langKey = "unknown";  // fallback por si falta coincidencia


// ============================================================
// INICIALIZAR ESTRUCTURA DE PROGRESO DEL USUARIO
// Asegura que existan los objetos necesarios antes de usarlos
// ============================================================

if (!user.progress) user.progress = {};              // Si no existe el objeto "progress", se crea
if (!user.progress[langKey]) user.progress[langKey] = 0;  // Si no existe progreso del idioma, inicia en 0


// Mostrar el progreso actual en pantalla
updateProgress(user.progress[langKey]);


/* ============================================================
   FUNCIONES PRINCIPALES
   ============================================================ */

// Actualiza la barra y el texto del porcentaje de progreso
function updateProgress(value) {
  if (progressBar && progressValue) {
    progressBar.style.width = `${value}%`;    // Ajusta ancho visual
    progressValue.textContent = `${value}%`;  // Actualiza número
  }
}

// Guarda el progreso actualizado en localStorage y refresca la UI
function saveProgress(newValue) {
  user.progress[langKey] = newValue;                                      // Actualiza memoria local
  localStorage.setItem("linguagoUser", JSON.stringify(user));             // Persistencia
  updateProgress(newValue);                                               // Actualización visual
}


/* ============================================================
   EVENTOS
   ============================================================ */

// ============================================================
// EVENTO: Finalización del video → aumenta progreso +10%
// ============================================================

if (video) {
  video.addEventListener("ended", () => {
    let progress = user.progress[langKey] || 0;

    if (progress < 100) {
      progress = Math.min(100, progress + 10);      // Máximo permitido: 100%
      saveProgress(progress);

      // Notificación amigable
      LinguaGo.toast(
        `¡Excelente! Tu progreso en ${langKey.toUpperCase()} ha aumentado al ${progress}%.`
      );

    } else {
      // Si ya está al máximo
      LinguaGo.toast("🎉 ¡Ya completaste esta lección!");
    }
  });
}


// ============================================================
// EVENTO: Botón de reinicio de progreso
// ============================================================

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    const confirmReset = confirm(`¿Deseas reiniciar tu progreso en ${langKey.toUpperCase()}?`);

    if (confirmReset) {
      saveProgress(0);
      LinguaGo.toast("Tu progreso ha sido reiniciado.");
    }
  });
}



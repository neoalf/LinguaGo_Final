/* ============================================================
   curso.js
   Control centralizado de progreso para los cursos de idiomas
   ============================================================ */

const video = document.getElementById("lessonVideo");
const progressBar = document.getElementById("progressBar");
const progressValue = document.getElementById("progressValue");

// Crear botón de reinicio dinámicamente
const resetBtn = document.createElement("button");
resetBtn.textContent = "Reiniciar progreso";
resetBtn.classList.add("lg-reset-btn");

// Insertar el botón después del progreso (si existe el contenedor)
const progressContainer = document.querySelector(".lg-course-progress");
if (progressContainer) progressContainer.appendChild(resetBtn);

// Verificar sesión activa
let user = JSON.parse(localStorage.getItem("linguagoUser"));
if (!user) {
  window.location.href = "login.html";
}

// Detectar idioma actual
const path = window.location.pathname.toLowerCase();
let langKey = "";

if (path.includes("ingles")) langKey = "english";
else if (path.includes("frances")) langKey = "french";
else if (path.includes("ruso")) langKey = "russian";
else langKey = "unknown"; // fallback

// Inicializar progreso si no existe
if (!user.progress) user.progress = {};
if (!user.progress[langKey]) user.progress[langKey] = 0;

// Mostrar progreso inicial
updateProgress(user.progress[langKey]);

/* ============================================================
   FUNCIONES
   ============================================================ */

function updateProgress(value) {
  if (progressBar && progressValue) {
    progressBar.style.width = `${value}%`;
    progressValue.textContent = `${value}%`;
  }
}

function saveProgress(newValue) {
  user.progress[langKey] = newValue;
  localStorage.setItem("linguagoUser", JSON.stringify(user));
  updateProgress(newValue);
}

/* ============================================================
   EVENTOS
   ============================================================ */

// Al terminar el video → +10 %
if (video) {
  video.addEventListener("ended", () => {
    let progress = user.progress[langKey] || 0;

    if (progress < 100) {
      progress = Math.min(100, progress + 10);
      saveProgress(progress);
      LinguaGo.toast(`¡Excelente! Tu progreso en ${langKey.toUpperCase()} ha aumentado al ${progress}%.`);
    } else {
      LinguaGo.toast("🎉 ¡Ya completaste esta lección!");
    }
  });
}

// 🔁 Reiniciar progreso manualmente
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    const confirmReset = confirm(`¿Deseas reiniciar tu progreso en ${langKey.toUpperCase()}?`);
    if (confirmReset) {
      saveProgress(0);
      LinguaGo.toast("Tu progreso ha sido reiniciado.");
    }
  });
}

/* ============================================================
   OPCIONAL: Sincronización con servidor (desactivada por defecto)
   ============================================================ */
async function syncProgressWithServer(userId, lang, value) {
  try {
    await fetch(`${LinguaGo.API_BASE}/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        progress: { ...user.progress, [lang]: value }
      })
    });
  } catch (err) {
    console.warn("No se pudo sincronizar con el servidor:", err);
  }
}

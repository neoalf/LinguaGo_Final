// ===============================
// PERFIL BÁSICO – LINGUAGO
// Maneja la visualización del perfil del usuario autenticado
// ===============================

// ============================================================
// VERIFICAR SESIÓN ACTIVA
// Si no hay usuario logueado, se redirige al login.
// Evita que alguien acceda a la página manualmente.
// ============================================================

const session = JSON.parse(localStorage.getItem("linguagoUser"));
if (!session) {
  window.location.href = "login.html";
}


// ============================================================
// REFERENCIAS A ELEMENTOS DEL DOM
// ============================================================

const avatarImg    = document.getElementById("profileAvatar");
const nameField    = document.getElementById("profileName");
const emailField   = document.getElementById("profileEmail");
const countryField = document.getElementById("profileCountry");
const progressBar  = document.getElementById("profileProgress");
const progressTxt  = document.getElementById("profileProgressText");
const logoutBtn    = document.getElementById("logoutBtn");


// ============================================================
// FUNCIÓN: Cargar datos del usuario en la vista
// Rellena avatar, nombre, correo, país y progreso total.
// ============================================================

function loadProfile() {
  // Avatar (usa uno por defecto si el usuario no tiene)
  avatarImg.src = session.avatar || "assets/img/default-avatar-profile-icon.jpg";

  // Datos de texto básicos
  nameField.textContent  = session.name;
  emailField.textContent = session.email;

  // Mostrar país o guion en caso de no existir en el perfil
  countryField.textContent = session.country
    ? `País: ${session.country}`
    : "País: —";

  // Progreso general (si no existe, se toma como 0)
  const progress = session.progress || 0;

  progressBar.style.width = progress + "%";
  progressTxt.textContent = progress + "% completado";
}

// Ejecuta carga inicial del perfil
loadProfile();


// ============================================================
// CERRAR SESIÓN
// Limpia localStorage y devuelve al login.
// ============================================================

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("linguagoUser");
  window.location.href = "login.html";
});

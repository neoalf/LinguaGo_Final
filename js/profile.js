// ===============================
// PERFIL BÁSICO – LINGUAGO
// ===============================

// Verificar sesión
const session = JSON.parse(localStorage.getItem("linguagoUser"));
if (!session) {
  window.location.href = "login.html";
}

// Asignar elementos
const avatarImg   = document.getElementById("profileAvatar");
const nameField   = document.getElementById("profileName");
const emailField  = document.getElementById("profileEmail");
const countryField= document.getElementById("profileCountry");
const progressBar = document.getElementById("profileProgress");
const progressTxt = document.getElementById("profileProgressText");
const logoutBtn   = document.getElementById("logoutBtn");

// Cargar datos
function loadProfile() {
  avatarImg.src     = session.avatar || "assets/img/default-avatar-profile-icon.jpg";
  nameField.textContent  = session.name;
  emailField.textContent = session.email;
  countryField.textContent = session.country ? `País: ${session.country}` : "País: —";

  // Progreso general
  const progress = session.progress || 0;
  progressBar.style.width = progress + "%";
  progressTxt.textContent = progress + "% completado";
}

loadProfile();

// Cerrar sesión
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("linguagoUser");
  window.location.href = "login.html";
});

// ===============================
// PERFIL BÁSICO – LINGUAGO
// Maneja la visualización y edición del perfil del usuario autenticado
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

const avatarImg = document.getElementById("profileAvatar");
const nameField = document.getElementById("profileName");
const emailField = document.getElementById("profileEmail");
const countryField = document.getElementById("profileCountry");
const progressBar = document.getElementById("profileProgress");
const progressTxt = document.getElementById("profileProgressText");
const logoutBtn = document.getElementById("logoutBtn");

// Modos y campos de edición
const viewMode = document.getElementById("viewMode");
const editMode = document.getElementById("editMode");
const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const editName = document.getElementById("editName");
const editCountry = document.getElementById("editCountry");
const editAvatar = document.getElementById("editAvatar");
const displayEmail = document.getElementById("displayEmail");

// Variable para guardar datos originales
let originalData = {};


// ============================================================
// FUNCIÓN: Cargar datos del usuario en la vista
// Rellena avatar, nombre, correo, país y progreso total.
// ============================================================

function loadProfile() {
  // Avatar (usa uno por defecto si el usuario no tiene)
  avatarImg.src = session.avatar || "assets/img/default-avatar-profile-icon.jpg";

  // Datos de texto básicos
  nameField.textContent = session.name;
  emailField.textContent = session.email;
  displayEmail.textContent = session.email;

  // Mostrar país o guion en caso de no existir en el perfil
  countryField.textContent = session.country
    ? `País: ${session.country}`
    : "País: —";

  // Progreso general: promedio de los 3 idiomas
  const progressEnglish = session.progressEnglish || 0;
  const progressFrench = session.progressFrench || 0;
  const progressRussian = session.progressRussian || 0;
  const progress = Math.round((progressEnglish + progressFrench + progressRussian) / 3);

  progressBar.style.width = progress + "%";
  progressTxt.textContent = progress + "% completado";
}

// Ejecuta carga inicial del perfil
loadProfile();


// ============================================================
// FUNCIÓN: Activar modo edición
// ============================================================

function enableEditMode() {
  // Guardar datos originales
  originalData = {
    name: session.name,
    country: session.country || "",
    avatar: session.avatar || "assets/img/default-avatar-profile-icon.jpg"
  };

  // Llenar campos de edición
  editName.value = session.name;
  editCountry.value = session.country || "";
  editAvatar.value = session.avatar || "";

  // Cambiar visibilidad
  viewMode.style.display = "none";
  editMode.style.display = "block";
  editBtn.style.display = "none";
  saveBtn.style.display = "inline-flex";
  cancelBtn.style.display = "inline-flex";
}


// ============================================================
// FUNCIÓN: Cancelar edición
// ============================================================

function cancelEdit() {
  // Restaurar vista
  viewMode.style.display = "block";
  editMode.style.display = "none";
  editBtn.style.display = "inline-flex";
  saveBtn.style.display = "none";
  cancelBtn.style.display = "none";
}


// ============================================================
// FUNCIÓN: Guardar cambios
// ============================================================

async function saveProfile() {
  // Validar campos
  const newName = editName.value.trim();
  const newCountry = editCountry.value.trim();
  const newAvatar = editAvatar.value.trim();

  if (!newName || newName.length < 2) {
    showToast("El nombre debe tener al menos 2 caracteres", "error");
    return;
  }

  try {
    // Enviar al servidor
    const response = await fetch(`http://localhost:4000/api/users/${session.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: newName,
        country: newCountry,
        avatar: newAvatar || "assets/img/default-avatar-profile-icon.jpg"
      })
    });

    const data = await response.json();

    if (data.success) {
      // Actualizar sesión en localStorage
      session.name = data.user.name;
      session.country = data.user.country;
      session.avatar = data.user.avatar;
      localStorage.setItem("linguagoUser", JSON.stringify(session));

      // Actualizar vista
      loadProfile();
      cancelEdit();

      showToast("Perfil actualizado correctamente", "success");
    } else {
      showToast(data.message || "Error al actualizar perfil", "error");
    }
  } catch (error) {
    console.error("Error al guardar perfil:", error);
    showToast("Error de conexión con el servidor", "error");
  }
}


// ============================================================
// EVENT LISTENERS
// ============================================================

editBtn.addEventListener("click", enableEditMode);
cancelBtn.addEventListener("click", cancelEdit);
saveBtn.addEventListener("click", saveProfile);


// ============================================================
// CERRAR SESIÓN
// Limpia localStorage y devuelve al login.
// ============================================================

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("linguagoUser");
  window.location.href = "login.html";
});

// ============================================================
// ELIMINAR CUENTA
// Elimina permanentemente la cuenta del usuario
// ============================================================

const deleteAccountBtn = document.getElementById("deleteAccountBtn");

if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener("click", async () => {
    const confirmDelete = confirm(
      "Estás seguro de que deseas eliminar tu cuenta?\n\nEsta acción NO se puede deshacer y perderás todos tus datos de progreso."
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:4000/api/users/${session.id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (data.success) {
        showToast("Cuenta eliminada. Hasta pronto!", "info");

        // Limpiar sesión
        localStorage.removeItem("linguagoUser");

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        showToast(data.message || "Error al eliminar la cuenta", "error");
      }
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      showToast("Error de conexión con el servidor", "error");
    }
  });
}

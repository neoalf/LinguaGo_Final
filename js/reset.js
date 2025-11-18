/* ============================================================
   reset.js - Manejo de restablecimiento de contraseña
   ============================================================ */

// Referencia al formulario de restablecimiento
const resetForm = document.getElementById("resetForm");


// ============================================================
// EVENTO: Enviar formulario de restablecimiento
// ============================================================

if (resetForm) {
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Obtener contraseñas ingresadas
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirmPassword").value.trim();

    // Validación de longitud mínima
    if (password.length < 8) {
      LinguaGo.toast("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    // Validación de coincidencia
    if (password !== confirm) {
      LinguaGo.toast("Las contraseñas no coinciden.");
      return;
    }

    // ============================================================
    // IDENTIFICAR USUARIO A RECUPERAR
    // Se obtiene correo que fue guardado en forgot.js
    // (simulación de token temporal real).
    // ============================================================

    const email = localStorage.getItem("recoverEmail");

    if (!email) {
      LinguaGo.toast("No se encontró información de recuperación. Intenta nuevamente.");
      window.location.href = "forgot-password.html";
      return;
    }

    try {
      // ============================================================
      // BUSCAR USUARIO POR EMAIL
      // GET /users?email=<correo>
      // ============================================================
      const res = await fetch(`${LinguaGo.API_BASE}/users?email=${email}`);
      const users = await res.json();

      if (users.length === 0) {
        LinguaGo.toast("No existe una cuenta con ese correo.");
        return;
      }

      const user = users[0];

      // ============================================================
      // ACTUALIZAR CONTRASEÑA
      // JSON Server permite PATCH para modificar solo un campo.
      // ============================================================
      const update = await fetch(`${LinguaGo.API_BASE}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }) //Nueva pass
      });

      // ============================================================
      // RESPUESTAS
      // ============================================================
      if (update.ok) {
        LinguaGo.toast("Contraseña actualizada correctamente.");

        // Limpiar dato temporal de recuperación
        localStorage.removeItem("recoverEmail");

        // Redirigir al login
        window.location.href = "login.html";
      } else {
        LinguaGo.toast("Error al actualizar la contraseña.");
      }

    } catch (err) {
      console.error(err);
      LinguaGo.toast("Error de conexión con el servidor.");
    }
  });
}

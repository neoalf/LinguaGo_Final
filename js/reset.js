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
      showToast("La contraseña debe tener al menos 8 caracteres", "warning");
      return;
    }

    // Validación de coincidencia
    if (password !== confirm) {
      showToast("Las contraseñas no coinciden", "warning");
      return;
    }

    // ============================================================
    // IDENTIFICAR USUARIO A RECUPERAR
    // Se obtiene correo que fue guardado en forgot.js
    // (simulación de token temporal real).
    // ============================================================

    const email = localStorage.getItem("recoverEmail");

    if (!email) {
      showToast("No se encontró información de recuperación. Intenta nuevamente", "error");
      setTimeout(() => {
        window.location.href = "forgot-password.html";
      }, 2000);
      return;
    }

    try {
      // ============================================================
      // ACTUALIZAR CONTRASEÑA EN EL SERVIDOR
      // POST /api/reset-password
      // ============================================================
      const response = await fetch("http://localhost:4000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      // ============================================================
      // RESPUESTAS
      // ============================================================
      if (data.success) {
        showToast("Contraseña actualizada correctamente", "success");

        // Limpiar dato temporal de recuperación
        localStorage.removeItem("recoverEmail");

        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        showToast(data.message || "Error al actualizar la contraseña", "error");
      }

    } catch (err) {
      console.error(err);
      showToast("Error de conexión con el servidor", "error");
    }
  });
}

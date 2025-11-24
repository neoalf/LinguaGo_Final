/* ============================================================
   forgot.js - Manejo de recuperación de contraseña (simulada)
   ============================================================ */

// Obtener referencia al formulario de recuperación
const forgotForm = document.getElementById("forgotForm");


// ============================================================
// EVENTO: Enviar formulario de recuperación
// ============================================================

if (forgotForm) {
  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita recargar la página

    // Obtener correo ingresado
    const email = document.getElementById("email").value.trim();

    // Validar que no esté vacío
    if (!email) {
      showToast("Por favor, ingresa tu correo electrónico", "warning");
      return;
    }

    try {
      // ============================================================
      // BÚSQUEDA DEL USUARIO EN EL SERVIDOR SQLITE
      // Nota: Como no tenemos un endpoint específico para verificar email,
      // simulamos la verificación. En un sistema real, el servidor
      // verificaría el email y enviaría un correo de recuperación.
      // ============================================================

      // Por ahora, aceptamos cualquier email y mostramos el mensaje de éxito
      // En producción, aquí se haría una llamada al servidor para verificar
      showToast(`Se ha enviado un enlace de recuperación a: ${email}`, "success");

      // Guardar correo temporalmente para usarlo en reset-password.html
      localStorage.setItem("recoverEmail", email);

      // Redirigir al formulario de restablecimiento después de 2 segundos
      setTimeout(() => {
        window.location.href = "reset-password.html";
      }, 2000);

    } catch (err) {
      // Error de conexión o similar
      console.error(err);
      showToast("Error al conectar con el servidor", "error");
    }
  });
}

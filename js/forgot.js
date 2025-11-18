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
      LinguaGo.toast("Por favor, ingresa tu correo electrónico.");
      return;
    }

    try {

      // ============================================================
      // BÚSQUEDA DEL USUARIO EN JSON SERVER
      // Consulta al backend para saber si el correo existe
      // (GET /users?email=<correo>)
      // ============================================================
      const res = await fetch(`${LinguaGo.API_BASE}/users?email=${email}`);
      const users = await res.json();

      // Si no existe ninguna cuenta asociada
      if (users.length === 0) {
        LinguaGo.toast("No se encontró ninguna cuenta con ese correo.");

        // NOTA: el siguiente bloque redirige al login después de 5 seg.
      
      setTimeout(() => {
      window.location.href = "login.html";
      }, 5000);

      }

      // ============================================================
      // SIMULACIÓN DEL ENVÍO DE CORREO DE RECUPERACIÓN
      // Aquí solo mostramos un mensaje; en un sistema real se enviaría
      // un correo con un enlace de restablecimiento seguro.
      // ============================================================
      LinguaGo.toast(`Se ha enviado un enlace de recuperación a: ${email}`);

      // Guardar correo temporalmente para usarlo en reset-password.html
      localStorage.setItem("recoverEmail", email);

      // Redirigir al formulario de restablecimiento
      window.location.href = "reset-password.html";
  

    } catch (err) {
      // Error de conexión o similar
      console.error(err);
      LinguaGo.toast("Error al conectar con el servidor.");
    }
  });
}


/* ============================================================
   forgot.js - Manejo de recuperación de contraseña (simulada)
   ============================================================ */

const forgotForm = document.getElementById("forgotForm");

if (forgotForm) {
  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();

    if (!email) {
      LinguaGo.toast("Por favor, ingresa tu correo electrónico.");
      return;
    }

    try {
      // Verificar si el correo existe
      const res = await fetch(`${LinguaGo.API_BASE}/users?email=${email}`);
      const users = await res.json();

      if (users.length === 0) {
        LinguaGo.toast("No se encontró ninguna cuenta con ese correo.");
        return;
      }

      // En entorno real se enviaría un correo con link temporal
      // Aquí simulamos el proceso:
      LinguaGo.toast(`Se ha enviado un enlace de recuperación a: ${email}`);

      // Simulación: redirigir al reset
    localStorage.setItem("recoverEmail", email);
    window.location.href = "reset-password.html";


      // Simulación: Redirigir al login
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } catch (err) {
      console.error(err);
      LinguaGo.toast("Error al conectar con el servidor.");
    }
  });
}

/* ============================================================
   reset.js - Manejo de restablecimiento de contraseña
   ============================================================ */

const resetForm = document.getElementById("resetForm");

if (resetForm) {
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirmPassword").value.trim();

    if (password.length < 8) {
      LinguaGo.toast("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirm) {
      LinguaGo.toast("Las contraseñas no coinciden.");
      return;
    }

    // Simulamos usuario actual (puede venir del correo o token)
    const email = localStorage.getItem("recoverEmail");

    if (!email) {
      LinguaGo.toast("No se encontró información de recuperación. Intenta nuevamente.");
      window.location.href = "forgot-password.html";
      return;
    }

    try {
      // Buscar usuario por correo
      const res = await fetch(`${LinguaGo.API_BASE}/users?email=${email}`);
      const users = await res.json();

      if (users.length === 0) {
        LinguaGo.toast("No existe una cuenta con ese correo.");
        return;
      }

      const user = users[0];

      // Actualizar contraseña
      const update = await fetch(`${LinguaGo.API_BASE}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      if (update.ok) {
        LinguaGo.toast("Contraseña actualizada correctamente.");
        localStorage.removeItem("recoverEmail");
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

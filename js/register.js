/* ============================================================
   register.js
   Registra nuevos usuarios en el servidor (SQLite API)
   ============================================================ */

// Referencias del formulario y botón de mostrar contraseña
const regForm = document.getElementById("registerForm");
const togglePass = document.getElementById("togglePass");


// ============================================================
// MOSTRAR / OCULTAR CONTRASEÑA
// Cambia entre type="password" y type="text" y actualiza el ícono.
// ============================================================

if (togglePass) {
  togglePass.addEventListener("click", () => {
    const passField = document.getElementById("password");
    const isHidden = passField.type === "password";

    passField.type = isHidden ? "text" : "password";
    togglePass.classList.toggle("fa-eye-slash", isHidden);
  });
}

// ============================================================
// ENVÍO DEL FORMULARIO DE REGISTRO
// ============================================================

if (regForm) {
  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validación mínima
    if (!name || !email || !password) {
      LinguaGo.toast("Completa todos los campos antes de continuar.");
      return;
    }

    try {
      // ============================================================
      // CREAR NUEVO USUARIO
      // POST /api/register
      // ============================================================

      const newUser = {
        name,
        email,
        password,
        country: "",
        avatar: "assets/img/default-avatar-profile-icon.jpg"
      };

      // Enviar al servidor
      const res = await fetch(`${LinguaGo.API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      const data = await res.json();

      // ============================================================
      // RESPUESTA
      // ============================================================
      if (res.ok) {
        LinguaGo.toast("Registro exitoso. Ahora puedes iniciar sesión.");
        window.location.href = "login.html";
      } else {
        // Muestra el mensaje de error del servidor (ej. "Correo ya registrado")
        LinguaGo.toast(data.message || "Error al registrar usuario.");
      }

    } catch (err) {
      console.error(err);
      LinguaGo.toast("No se pudo conectar con el servidor.");
    }
  });
}

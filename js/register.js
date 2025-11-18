/* ============================================================
   register.js
   Registra nuevos usuarios en el servidor (JSON Server)
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
      // VERIFICAR SI YA EXISTE EL CORREO
      // GET /users?email=<correo>
      // ============================================================
      const checkRes = await fetch(`${LinguaGo.API_BASE}/users?email=${email}`);
      const existing = await checkRes.json();

      if (existing.length > 0) {
        LinguaGo.toast("Este correo ya está registrado.");
        return;
      }

      // ============================================================
      // CREAR NUEVO USUARIO

      const newUser = {
        name,
        email,
        password, // Texto plano por el momento
        country: "",
        avatar: "assets/img/default-avatar-profile-icon.jpg",
        progress: { english: 0, french: 0, russian: 0 }
      };

      // Enviar al servidor
      const res = await fetch(`${LinguaGo.API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      // ============================================================
      // RESPUESTA
      // ============================================================
      if (res.ok) {
        LinguaGo.toast("Registro exitoso. Ahora puedes iniciar sesión.");
        window.location.href = "login.html";
      } else {
        LinguaGo.toast("Error al registrar usuario.");
      }

    } catch (err) {
      console.error(err);
      LinguaGo.toast("No se pudo conectar con el servidor.");
    }
  });
}

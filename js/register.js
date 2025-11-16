/* ============================================================
   register.js
   Registra nuevos usuarios en el servidor (JSON Server)
   ============================================================ */

const regForm = document.getElementById("registerForm");
const togglePass = document.getElementById("togglePass");

// Mostrar/ocultar contraseña
if (togglePass) {
  togglePass.addEventListener("click", () => {
    const passField = document.getElementById("password");
    const isHidden = passField.type === "password";
    passField.type = isHidden ? "text" : "password";
    togglePass.classList.toggle("fa-eye-slash", isHidden);
  });
}

// Enviar registro
if (regForm) {
  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !email || !password) {
      LinguaGo.toast("Completa todos los campos antes de continuar.");
      return;
    }

    try {
      // Verificar si el correo ya está registrado
      const checkRes = await fetch(`${LinguaGo.API_BASE}/users?email=${email}`);
      const existing = await checkRes.json();

      if (existing.length > 0) {
        LinguaGo.toast("Este correo ya está registrado.");
        return;
      }

      // Crear nuevo usuario
      const newUser = {
        name,
        email,
        password,
        country: "",
        avatar: "assets/img/default-avatar-profile-icon.jpg",
        progress: { english: 0, french: 0, russian: 0 }
      };

      const res = await fetch(`${LinguaGo.API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

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

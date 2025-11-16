/* ============================================================
   login.js
   Maneja el inicio de sesión real contra JSON Server
   ============================================================ */



   // Referencias del formulario
const loginForm = document.getElementById("loginForm");

// Validar sesión activa
if (localStorage.getItem("linguagoUser")) {
  window.location.href = "dashboard.html";
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      LinguaGo.toast("Por favor, completa todos los campos.");
      return;
    }

    try {
      // Consultar usuario existente
      const res = await fetch(`${LinguaGo.API_BASE}/users?email=${email}`);
      const users = await res.json();

      if (users.length === 0) {
        LinguaGo.toast("No existe una cuenta con ese correo.");
        return;
      }

      const user = users[0];

      // Validar contraseña
      if (user.password !== password) {
        LinguaGo.toast("Contraseña incorrecta.");
        return;
      }

      // Guardar sesión en localStorage
      localStorage.setItem("linguagoUser", JSON.stringify(user));

      LinguaGo.toast(`Bienvenido de nuevo, ${user.name}`);
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error(err);
      LinguaGo.toast("Error al conectar con el servidor.");
    }
  });
}


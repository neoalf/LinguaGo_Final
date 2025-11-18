/* ============================================================
   login.js
   Maneja el inicio de sesión real contra JSON Server
   ============================================================ */

// Referencia al formulario de login
const loginForm = document.getElementById("loginForm");


// ============================================================
// VERIFICAR SESIÓN ACTIVA
// Si el usuario ya inició sesión antes, se redirige al dashboard.
// Evita que vuelva a la página de login.
// ============================================================

if (localStorage.getItem("linguagoUser")) {
  window.location.href = "dashboard.html";
}


// ============================================================
// EVENTO: Envío del formulario de login
// ============================================================

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita recarga de página

    // Obtener valores ingresados
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validación básica
    if (!email || !password) {
      LinguaGo.toast("Por favor, completa todos los campos.");
      return;
    }

    try {
      // ============================================================
      // CONSULTA AL SERVIDOR PARA BUSCAR EL USUARIO
      // GET /users?email=<correo>
      // ============================================================
      const res = await fetch(`${LinguaGo.API_BASE}/users?email=${email}`);
      const users = await res.json();

      // Si no existe ningún usuario con ese correo
      if (users.length === 0) {
        LinguaGo.toast("No existe una cuenta con ese correo.");
        return;
      }

      const user = users[0]; // Primer resultado encontrado

      // ============================================================
      // VALIDACIÓN DE CONTRASEÑA
      // ============================================================
      if (user.password !== password) {
        LinguaGo.toast("Contraseña incorrecta.");
        return;
      }

      // ============================================================
      // INICIO DE SESIÓN EXITOSO
      // Guardamos al usuario completo en localStorage
      // para mantener la sesión activa.
      // ============================================================
      localStorage.setItem("linguagoUser", JSON.stringify(user));

      LinguaGo.toast(`Bienvenido de nuevo, ${user.name}`);

      // Redirigir al dashboard
      window.location.href = "dashboard.html";

    } catch (err) {
      // Error en la comunicación con el servidor (JSON Server apagado, URL incorrecta, etc.)
      console.error(err);
      LinguaGo.toast("Error al conectar con el servidor.");
    }
  });
}



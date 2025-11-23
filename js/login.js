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
      // CONSULTA AL SERVIDOR PARA INICIAR SESIÓN
      // POST /api/login
      // ============================================================
      const res = await fetch(`${LinguaGo.API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      // Si hay error (usuario no encontrado o contraseña incorrecta)
      if (!res.ok) {
        LinguaGo.toast(data.message || "Error al iniciar sesión");
        return;
      }

      // ============================================================
      // INICIO DE SESIÓN EXITOSO
      // Guardamos al usuario completo en localStorage
      // ============================================================
      localStorage.setItem("linguagoUser", JSON.stringify(data));

      LinguaGo.toast(`Bienvenido de nuevo, ${data.name}`);

      // Redirigir al dashboard
      window.location.href = "dashboard.html";

    } catch (err) {
      // Error en la comunicación con el servidor
      console.error(err);
      LinguaGo.toast("Error al conectar con el servidor.");
    }
  });
}



// ============================================================
// GOOGLE LOGIN HANDLER
// ============================================================
window.handleGoogleCredential = async function (response) {
  try {
    const res = await fetch(`${LinguaGo.API_BASE}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: response.credential })
    });

    const data = await res.json();

    if (!res.ok) {
      LinguaGo.toast(data.message || "Error al iniciar sesión con Google");
      return;
    }

    // Guardar usuario y redirigir
    localStorage.setItem("linguagoUser", JSON.stringify(data));
    LinguaGo.toast(`Bienvenido, ${data.name}`);
    window.location.href = "dashboard.html";

  } catch (err) {
    console.error(err);
    LinguaGo.toast("Error de conexión con Google Login");
  }
};

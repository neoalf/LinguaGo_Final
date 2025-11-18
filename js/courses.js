/* ============================================================
   courses.js
   CRUD básico de cursos (JSON Server)
   ============================================================ */

// Verifica que el usuario tenga sesión activa.
// Si no, será redirigido desde verifySession().
LinguaGo.verifySession();

// Elementos principales del DOM
const courseList = document.getElementById("courseList");  // Lista donde se mostrarán los cursos
const courseForm = document.getElementById("courseForm");  // Formulario para crear cursos

// ============================================================
// Cargar cursos desde el backend (JSON Server)
// ============================================================
async function loadCourses() {
  // Petición GET al endpoint
  const res = await fetch(`${LinguaGo.API_BASE}/courses`);
  const data = await res.json();

  // Actualiza la lista en pantalla
  renderCourses(data);
}

// ============================================================
// Renderizar cursos en el DOM
// Convierte el arreglo de cursos en elementos <li>
// ============================================================
function renderCourses(courses) {
  if (!courseList) return;

  // Limpia lista previa
  courseList.innerHTML = "";

  // Crear <li> por cada curso
  courses.forEach(course => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${course.title}</strong> (${course.language})
      <button class="del-btn" data-id="${course.id}">🗑️</button>
    `;

    // Insertar en el DOM
    courseList.appendChild(li);
  });
}

// ============================================================
// Crear nuevo curso (evento submit del formulario)
// ============================================================
if (courseForm) {
  courseForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita recarga de la página

    // Obtiene valores del formulario
    const title = document.getElementById("courseTitle").value;
    const language = document.getElementById("courseLang").value;

    // Petición POST para guardar nuevo curso
    const res = await fetch(`${LinguaGo.API_BASE}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, language })
    });

    // Si todo sale bien, recarga la lista
    if (res.ok) loadCourses();
  });
}

// ============================================================
// Evento global para manejar eliminación de cursos
// Se escucha en document para evitar problemas con elementos dinámicos
// ============================================================
document.addEventListener("click", async (e) => {
  // Verifica si el clic proviene de un botón de eliminar
  if (e.target.classList.contains("del-btn")) {
    const id = e.target.dataset.id;

    // Petición DELETE al endpoint correspondiente
    await fetch(`${LinguaGo.API_BASE}/courses/${id}`, { method: "DELETE" });

    // Recarga lista actualizada
    loadCourses();
  }
});

// ============================================================
// Cargar cursos al iniciar la página
// ============================================================
loadCourses();


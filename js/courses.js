/* ============================================================
   courses.js
   CRUD básico de cursos (JSON Server)
   ============================================================ */
LinguaGo.verifySession();

const courseList = document.getElementById("courseList");
const courseForm = document.getElementById("courseForm");

async function loadCourses() {
  const res = await fetch(`${LinguaGo.API_BASE}/courses`);
  const data = await res.json();
  renderCourses(data);
}

function renderCourses(courses) {
  if (!courseList) return;
  courseList.innerHTML = "";
  courses.forEach(course => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${course.title}</strong> (${course.language})
      <button class="del-btn" data-id="${course.id}">🗑️</button>
    `;
    courseList.appendChild(li);
  });
}

if (courseForm) {
  courseForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("courseTitle").value;
    const language = document.getElementById("courseLang").value;

    const res = await fetch(`${LinguaGo.API_BASE}/courses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, language })
    });

    if (res.ok) loadCourses();
  });
}

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("del-btn")) {
    const id = e.target.dataset.id;
    await fetch(`${LinguaGo.API_BASE}/courses/${id}`, { method: "DELETE" });
    loadCourses();
  }
});

loadCourses();

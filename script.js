// ===== SELECT ELEMENTS =====
const input = document.getElementById("taskInput");
const dateInput = document.getElementById("dueDate");
const addBtn = document.getElementById("addBtn");
const priorityInput = document.getElementById("priorityInput");
const list = document.getElementById("taskList");
const tabs = document.querySelectorAll(".tab");

const totalEl = document.getElementById("totalTasks");
const activeEl = document.getElementById("activeTasks");
const completedEl = document.getElementById("completedTasks");

const toggleBtn = document.getElementById("themeToggle");
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

// ===== STATE =====
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let dragId = null;

// ===== ADD TASK =====
addBtn.addEventListener("click", () => {

    const text = input.value.trim();
    const date = dateInput.value;
    const priority = priorityInput.value;

    if (!text) return;

    tasks.push({
        id: Date.now(),
        text,
        completed: false,
        date,
        priority
    });

    input.value = "";
    dateInput.value = "";
    priorityInput.value = "medium";

    saveTasks();
    renderTasks();
});

// ===== SAVE =====
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===== DELETE =====
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// ===== TOGGLE =====
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

// ===== FILTER =====
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    currentFilter = tab.dataset.filter;
    renderTasks();
  });
});

// ===== STATS =====
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;

  totalEl.textContent = `Total: ${total}`;
  activeEl.textContent = `Active: ${active}`;
  completedEl.textContent = `Done: ${completed}`;
}

// ===== RENDER =====
const priority = task.priority || "medium";

li.innerHTML = `
    <div>
        <span class="task-text">${task.text}</span><br>

        <span class="date">${task.date || ""}</span>

        <span class="priority-badge priority-${priority}">
            ${priority.toUpperCase()} PRIORITY
        </span>
    </div>

    <div class="actions">
        <button class="done-btn">
            ${task.completed ? "↩️ Undo" : "✅ Done"}
        </button>

        <button class="delete-btn">❌</button>
    </div>
`;

  <div class="actions">
    <button class="done-btn">
      ${task.completed ? "↩️ Undo" : "✅ Done"}
    </button>
    <button class="delete-btn">❌</button>
  </div>
`;

    // Toggle
    // Mark Done / Undo
li.querySelector(".done-btn").addEventListener("click", () => {
  toggleTask(task.id);
});

// Delete
li.querySelector(".delete-btn").addEventListener("click", () => {
  deleteTask(task.id);
});

    // Delete
    li.querySelector(".delete-btn").addEventListener("click", () => {
      deleteTask(task.id);
    });

    // Drag
    li.addEventListener("dragstart", () => {
      dragId = task.id;
    });

    li.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    li.addEventListener("drop", () => {
      const fromIndex = tasks.findIndex(t => t.id === dragId);
      const toIndex = tasks.findIndex(t => t.id === task.id);

      const item = tasks.splice(fromIndex, 1)[0];
      tasks.splice(toIndex, 0, item);

      saveTasks();
      renderTasks();
    });

    list.appendChild(li);
  });

  updateStats();
  drawChart();
}

// ===== THEME TOGGLE =====
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");

  toggleBtn.textContent = document.body.classList.contains("light")
    ? "🌞"
    : "🌙";
});

// ===== GRAPH =====
function drawChart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;
  const total = tasks.length || 1;

  const completedHeight = (completed / total) * 100;
  const pendingHeight = (pending / total) * 100;

  ctx.fillStyle = "#6c63ff";
  ctx.fillRect(50, 120 - completedHeight, 40, completedHeight);

  ctx.fillStyle = "#ff4d4d";
  ctx.fillRect(120, 120 - pendingHeight, 40, pendingHeight);

  ctx.fillStyle = "#fff";
  ctx.fillText("Done", 50, 115);
  ctx.fillText("Pending", 120, 115);
}

// ===== INIT =====
renderTasks();

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

        text: text,

        completed: false,

        date: date,

        priority: priority

    });

    input.value = "";
    dateInput.value = "";
    priorityInput.value = "medium";

    saveTasks();

    renderTasks();

});


// ===== SAVE TASKS =====

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// ===== DELETE TASK =====

function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();

}


// ===== TOGGLE TASK =====

function toggleTask(id) {

    tasks = tasks.map(task =>

        task.id === id
            ? { ...task, completed: !task.completed }
            : task

    );

    saveTasks();

    renderTasks();

}


// ===== FILTER TASKS =====

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        tabs.forEach(t => t.classList.remove("active"));

        tab.classList.add("active");

        currentFilter = tab.dataset.filter;

        renderTasks();

    });

});


// ===== UPDATE STATISTICS =====

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(t => t.completed).length;

    const active = total - completed;

    totalEl.textContent = `Total: ${total}`;

    activeEl.textContent = `Active: ${active}`;

    completedEl.textContent = `Done: ${completed}`;

}


// ===== RENDER TASKS =====

function renderTasks() {

    list.innerHTML = "";

    // Filter tasks

    const filteredTasks = tasks.filter(task => {

        if (currentFilter === "active") {

            return !task.completed;

        }

        if (currentFilter === "completed") {

            return task.completed;

        }

        return true;

    });


    // Display each task

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.draggable = true;


        // Get priority

        const priority = task.priority || "medium";


        // Task text

        const taskText = document.createElement("span");

        taskText.className = "task-text";

        taskText.textContent = task.text;


        // Task date

        const date = document.createElement("span");

        date.className = "date";

        date.textContent = task.date || "";


        // Priority badge

        const priorityBadge = document.createElement("span");

        priorityBadge.className =
            `priority-badge priority-${priority}`;

        priorityBadge.textContent =
            `${priority.toUpperCase()} PRIORITY`;


        // Task information section

        const taskInfo = document.createElement("div");

        taskInfo.appendChild(taskText);

        taskInfo.appendChild(document.createElement("br"));

        taskInfo.appendChild(date);

        taskInfo.appendChild(document.createElement("br"));

        taskInfo.appendChild(priorityBadge);


        // Action buttons section

        const actions = document.createElement("div");

        actions.className = "actions";


        // Done / Undo button

        const doneBtn = document.createElement("button");

        doneBtn.className = "done-btn";

        doneBtn.textContent = task.completed
            ? "↩️ Undo"
            : "✅ Done";


        // Delete button

        const deleteBtn = document.createElement("button");

        deleteBtn.className = "delete-btn";

        deleteBtn.textContent = "❌";


        actions.appendChild(doneBtn);

        actions.appendChild(deleteBtn);


        // Add elements to task

        li.appendChild(taskInfo);

        li.appendChild(actions);


        // Toggle completion

        doneBtn.addEventListener("click", () => {

            toggleTask(task.id);

        });


        // Delete task

        deleteBtn.addEventListener("click", () => {

            deleteTask(task.id);

        });


        // Drag and drop

        li.addEventListener("dragstart", () => {

            dragId = task.id;

        });


        li.addEventListener("dragover", (e) => {

            e.preventDefault();

        });


        li.addEventListener("drop", () => {

            const fromIndex = tasks.findIndex(
                t => t.id === dragId
            );

            const toIndex = tasks.findIndex(
                t => t.id === task.id
            );

            if (fromIndex === -1 || toIndex === -1) return;

            const item = tasks.splice(fromIndex, 1)[0];

            tasks.splice(toIndex, 0, item);

            saveTasks();

            renderTasks();

        });


        // Add task to list

        list.appendChild(li);

    });


    updateStats();

    drawChart();

}


// ===== THEME TOGGLE =====

toggleBtn.addEventListener("click", () => {

    document.body.classList.toggle("light");

    toggleBtn.textContent =
        document.body.classList.contains("light")
            ? "🌞"
            : "🌙";

});


// ===== PRODUCTIVITY GRAPH =====

function drawChart() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const completed = tasks.filter(t => t.completed).length;

    const pending = tasks.length - completed;

    const total = tasks.length || 1;


    const completedHeight = (completed / total) * 100;

    const pendingHeight = (pending / total) * 100;


    // Completed tasks bar

    ctx.fillStyle = "#6c63ff";

    ctx.fillRect(50, 120 - completedHeight, 40, completedHeight);


    // Pending tasks bar

    ctx.fillStyle = "#ff4d4d";

    ctx.fillRect(120, 120 - pendingHeight, 40, pendingHeight);


    // Graph labels

    ctx.fillStyle = "#fff";

    ctx.fillText("Done", 50, 115);

    ctx.fillText("Pending", 120, 115);

}


// ===== INITIALIZATION =====

renderTasks();
// Elementos del DOM
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const totalTasksSpan = document.getElementById('totalTasks');
const completedTasksSpan = document.getElementById('completedTasks');
const pendingTasksSpan = document.getElementById('pendingTasks');
const filterButtons = document.querySelectorAll('.filter-btn');

// Variables
let tasks = [];
let currentFilter = 'all';

// Storage (localStorage)
const STORAGE_KEY = 'tareas_guardadas';

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    setupEventListeners();
});

// Configurar evento listeners
function setupEventListeners() {
    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Filtros
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderTasks();
        });
    });
}

// Agregar tarea
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Por favor, ingresa una tarea');
        taskInput.focus();
        return;
    }

    if (taskText.length > 100) {
        alert('La tarea no puede exceder 100 caracteres');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    tasks.unshift(task);
    saveTasks();
    renderTasks();

    taskInput.value = '';
    taskInput.focus();
}

// Marcar tarea como completada
function toggleTaskCompletion(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Eliminar tarea
function deleteTask(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }
}

// Renderizar lista de tareas
function renderTasks() {
    taskList.innerHTML = '';

    let filteredTasks = tasks;

    // Aplicar filtro
    if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    } else if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(t => !t.completed);
    }

    // Renderizar tareas
    if (filteredTasks.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;

            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="toggleTaskCompletion(${task.id})"
                >
                <span class="task-text">${escapeHtml(task.text)}</span>
                <div class="task-actions">
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Eliminar</button>
                </div>
            `;

            taskList.appendChild(li);
        });
    }

    updateStatistics();
}

// Actualizar estadísticas
function updateStatistics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalTasksSpan.textContent = total;
    completedTasksSpan.textContent = completed;
    pendingTasksSpan.textContent = pending;
}

// Guardar tareas en localStorage
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Cargar tareas de localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (storedTasks) {
        try {
            tasks = JSON.parse(storedTasks);
        } catch (error) {
            console.error('Error al cargar tareas:', error);
            tasks = [];
        }
    }
}

// Escapar caracteres HTML para seguridad
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Función para limpiar todas las tareas completadas (opcional)
function clearCompletedTasks() {
    if (confirm('¿Deseas eliminar todas las tareas completadas?')) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
    }
}

// Función para limpiar todas las tareas (opcional)
function clearAllTasks() {
    if (confirm('¿Deseas eliminar TODAS las tareas? Esta acción no se puede deshacer.')) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}
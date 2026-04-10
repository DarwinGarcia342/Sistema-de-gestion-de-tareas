const DOM = {
    taskInput: document.getElementById('taskInput'),
    addTaskButton: document.getElementById('addTaskButton'),
    taskList: document.getElementById('taskList'),
    emptyState: document.getElementById('emptyState'),
    totalTasksSpan: document.getElementById('totalTasks'),
    completedTasksSpan: document.getElementById('completedTasks'),
    pendingTasksSpan: document.getElementById('pendingTasks'),
    filterButtons: document.querySelectorAll('.filter-btn')
};

let tasks = [];
let currentFilter = 'all';

const STORAGE_KEY = 'tareas_guardadas';

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    setupEventListeners();
});

const setupEventListeners = () => {
    DOM.addTaskButton.addEventListener('click', addTask);
    DOM.taskInput.addEventListener('keypress', e => e.key === 'Enter' && addTask());
    DOM.filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            DOM.filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderTasks();
        });
    });
};


const addTask = () => {
    const taskText = DOM.taskInput.value.trim();

    if (!taskText) {
        alert('Por favor, ingresa una tarea');
        DOM.taskInput.focus();
        return;
    }

    if (taskText.length > 100) {
        alert('La tarea no puede exceder 100 caracteres');
        return;
    }

    tasks.unshift({
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toLocaleString()
    });

    saveTasks();
    renderTasks();
    DOM.taskInput.value = '';
    DOM.taskInput.focus();
};


const toggleTaskCompletion = id => {
    const task = tasks.find(t => t.id === id);
    task && (task.completed = !task.completed, saveTasks(), renderTasks());
};


const deleteTask = id => confirm('¿Estás seguro de que deseas eliminar esta tarea?') && 
    (tasks = tasks.filter(t => t.id !== id), saveTasks(), renderTasks());


const renderTasks = () => {
    DOM.taskList.innerHTML = '';

    const filteredTasks = currentFilter === 'completed' 
        ? tasks.filter(t => t.completed)
        : currentFilter === 'pending' 
        ? tasks.filter(t => !t.completed)
        : tasks;

    DOM.emptyState.style.display = filteredTasks.length === 0 ? 'block' : 'none';
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskCompletion(${task.id})">
            <span class="task-text">${escapeHtml(task.text)}</span>
            <div class="task-actions">
                <button class="delete-btn" onclick="deleteTask(${task.id})">Eliminar</button>
            </div>
        `;
        DOM.taskList.appendChild(li);
    });
    
    updateStatistics();
};


const updateStatistics = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    DOM.totalTasksSpan.textContent = total;
    DOM.completedTasksSpan.textContent = completed;
    DOM.pendingTasksSpan.textContent = total - completed;
};


const saveTasks = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));


const loadTasks = () => {
    try {
        const storedTasks = localStorage.getItem(STORAGE_KEY);
        tasks = storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        tasks = [];
    }
};


const escapeHtml = text => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};


const clearCompletedTasks = () => confirm('¿Deseas eliminar todas las tareas completadas?') && 
    (tasks = tasks.filter(t => !t.completed), saveTasks(), renderTasks());


const clearAllTasks = () => confirm('¿Deseas eliminar TODAS las tareas? Esta acción no se puede deshacer.') && 
    (tasks = [], saveTasks(), renderTasks());
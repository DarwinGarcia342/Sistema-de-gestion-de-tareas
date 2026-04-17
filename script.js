const DOM = {
    taskInput: document.getElementById('taskInput'),
    taskAssignee: document.getElementById('taskAssignee'),
    taskCategory: document.getElementById('taskCategory'),
    addTaskButton: document.getElementById('addTaskButton'),
    taskList: document.getElementById('taskList'),
    emptyState: document.getElementById('emptyState'),
    totalTasksSpan: document.getElementById('totalTasks'),
    completedTasksSpan: document.getElementById('completedTasks'),
    workTasksSpan: document.getElementById('workTasks'),
    studyTasksSpan: document.getElementById('studyTasks'),
    freelanceTasksSpan: document.getElementById('freelanceTasks'),
    filterButtons: document.querySelectorAll('.filter-btn')
};

let tasks = [];
let currentFilter = 'all';
const STORAGE_KEY = 'darwin_pro_tasks';

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    setupEventListeners();
});

const setupEventListeners = () => {
    DOM.addTaskButton.addEventListener('click', addTask);
    DOM.taskInput.addEventListener('keypress', e => e.key === 'Enter' && addTask());
    
    // VALIDACIÓN: No permite números
    [DOM.taskInput, DOM.taskAssignee].forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[0-9]/g, '');
        });
    });

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
    const text = DOM.taskInput.value.trim();
    const assignee = DOM.taskAssignee.value.trim() || "Darwin";
    const category = DOM.taskCategory.value;

    if (!text) return alert('Por favor, escribe una tarea');

    tasks.unshift({
        id: Date.now(),
        text,
        assignee,
        category,
        completed: false
    });

    saveAndRender();
    DOM.taskInput.value = '';
    DOM.taskAssignee.value = '';
};

const renderTasks = () => {
    DOM.taskList.innerHTML = '';
    const filtered = tasks.filter(t => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'completed') return t.completed;
        if (currentFilter === 'pending') return !t.completed;
        return t.category === currentFilter;
    });

    DOM.emptyState.style.display = filtered.length === 0 ? 'block' : 'none';

    filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <div style="flex:1; margin-left:15px">
                <span style="font-weight:600">${task.text}</span>
                <span class="category-badge badge-${task.category.toLowerCase()}">${task.category}</span>
                <br><small>👤 ${task.assignee}</small>
            </div>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Eliminar</button>
        `;
        DOM.taskList.appendChild(li);
    });
    updateStats();
};

const updateStats = () => {
    DOM.totalTasksSpan.textContent = tasks.length;
    DOM.completedTasksSpan.textContent = tasks.filter(t => t.completed).length;
    DOM.workTasksSpan.textContent = tasks.filter(t => t.category === 'Trabajo').length;
    DOM.studyTasksSpan.textContent = tasks.filter(t => t.category === 'Estudio').length;
    DOM.freelanceTasksSpan.textContent = tasks.filter(t => t.category === 'Freelance').length;
};

const toggleTask = id => {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveAndRender();
    }
};

const deleteTask = id => {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
};

const saveAndRender = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    renderTasks();
};

const loadTasks = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    tasks = stored ? JSON.parse(stored) : [];
};

window.clearCompletedTasks = () => {
    tasks = tasks.filter(t => !t.completed);
    saveAndRender();
};

window.clearAllTasks = () => {
    if(confirm('¿Seguro que quieres borrar todo?')) {
        tasks = [];
        saveAndRender();
    }
};
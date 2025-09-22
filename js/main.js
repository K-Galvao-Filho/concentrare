import * as state from './state.js';
import * as dom from './dom.js';
import * as ui from './ui.js';
import * as timer from './timer.js';
import { initAudio, playSelectedSound } from './audio.js';

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
}

function saveTasks() {
    localStorage.setItem('pomodoroTasks', JSON.stringify(state.tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('pomodoroTasks');
    if (savedTasks) {
        try {
            let parsedTasks = JSON.parse(savedTasks);
            state.setTasks(parsedTasks.filter(task => task && typeof task.id !== 'undefined' && typeof task.text !== 'undefined'));
        } catch (error) {
            console.error("Erro ao carregar tarefas:", error);
            state.setTasks([]);
        }
    }
    ui.renderTasks();
}

function saveSettings() {
    const newSettings = {
        ...state.settings,
        pomodoro: parseInt(dom.inputs.pomodoro.value),
        shortBreak: parseInt(dom.inputs.shortBreak.value),
        longBreak: parseInt(dom.inputs.longBreak.value),
        pomodorosPerCycle: parseInt(dom.inputs.pomodorosPerCycle.value),
        totalCycles: parseInt(dom.inputs.totalCycles.value),
        alarmSound: dom.alarmSoundSelect.value,
        autoStartBreaks: dom.autoStartBreaksSwitch.checked,
    };
    state.setSettings(newSettings);
    localStorage.setItem('pomodoroSettings', JSON.stringify(state.settings));
    dom.settingsModal.hide();
    timer.resetApp();
}

function loadSettings() {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
        const newSettings = { ...state.settings, ...JSON.parse(savedSettings) };
        state.setSettings(newSettings);
    }
    dom.inputs.pomodoro.value = state.settings.pomodoro;
    dom.inputs.shortBreak.value = state.settings.shortBreak;
    dom.inputs.longBreak.value = state.settings.longBreak;
    dom.inputs.pomodorosPerCycle.value = state.settings.pomodorosPerCycle;
    dom.inputs.totalCycles.value = state.settings.totalCycles;
    dom.alarmSoundSelect.value = state.settings.alarmSound;
    dom.ambientSoundSelect.value = state.settings.ambientSound;
    dom.autoStartBreaksSwitch.checked = state.settings.autoStartBreaks;
    dom.youtubePlayerContainer.classList.toggle('hidden', state.settings.ambientSound.startsWith('youtube_') === false);
}

function handleKeyPress(e) {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') { e.preventDefault(); state.isRunning ? timer.pauseTimer() : timer.startTimer(); }
    if (e.code === 'KeyS' && state.isRunning) timer.stopTimer();
    if (e.altKey && e.code === 'KeyP') timer.switchMode('pomodoro');
    if (e.altKey && e.code === 'KeyC') timer.switchMode('shortBreak');
    if (e.altKey && e.code === 'KeyL') timer.switchMode('longBreak');
}

function init() {
    loadSettings();
    loadTasks();
    ui.setupTheme();
    
    dom.startBtn.addEventListener('click', () => { initAudio(); requestNotificationPermission(); timer.startTimer(); });
    dom.pauseBtn.addEventListener('click', timer.pauseTimer);
    dom.stopBtn.addEventListener('click', timer.stopTimer);
    dom.nextBtn.addEventListener('click', timer.skipToNextMode);
    dom.saveSettingsBtn.addEventListener('click', saveSettings);
    dom.themeToggleBtn.addEventListener('click', ui.toggleTheme);
    document.addEventListener('keydown', handleKeyPress);
    dom.statsModalEl.addEventListener('show.bs.modal', ui.renderStats);
    dom.pomodoroWidget.addEventListener('animationend', () => dom.pomodoroWidget.classList.remove('timer-ended-flash'));
    dom.clearCompletedBtn.addEventListener('click', () => {
        const newTasks = state.tasks.filter(task => !task.completed);
        state.setTasks(newTasks);
        saveTasks();
        ui.renderTasks();
    });

    dom.ambientSoundSelect.addEventListener('change', () => {
        const newSettings = { ...state.settings, ambientSound: dom.ambientSoundSelect.value };
        state.setSettings(newSettings);
        localStorage.setItem('pomodoroSettings', JSON.stringify(state.settings));
        if (state.isRunning && state.currentMode === 'pomodoro') {
            playSelectedSound(state.settings.ambientSound);
        } else {
            dom.youtubePlayerContainer.classList.toggle('hidden', state.settings.ambientSound.startsWith('youtube_') === false);
        }
    });

    dom.modeButtons.forEach(btn => btn.addEventListener('click', () => timer.switchMode(btn.dataset.mode)));
    
    dom.taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        const text = dom.taskInput.value.trim();
        if (text) {
            const newTasks = [...state.tasks, { id: Date.now(), text, completed: false }];
            state.setTasks(newTasks);
            dom.taskInput.value = '';
            saveTasks();
            ui.renderTasks();
        }
    });

    dom.taskList.addEventListener('click', (e) => {
        const li = e.target.closest('li');
        if (!li) return;
        const id = parseInt(li.dataset.id);

        if (e.target.type === 'checkbox') {
            const newTasks = state.tasks.map(task => 
                task.id === id ? { ...task, completed: e.target.checked } : task
            );
            state.setTasks(newTasks);
            saveTasks();
            ui.renderTasks();
        } else if (e.target.closest('.delete-task-btn')) {
            li.classList.add('fading-out');
            setTimeout(() => {
                const newTasks = state.tasks.filter(t => t.id !== id);
                state.setTasks(newTasks);
                saveTasks();
                ui.renderTasks();
            }, 300);
        }
    });

    dom.taskList.addEventListener('dblclick', (e) => {
        if (e.target.classList.contains('task-text')) {
            const li = e.target.closest('li');
            const id = parseInt(li.dataset.id);
            const task = state.tasks.find(t => t.id === id);
            
            const input = document.createElement('input');
            input.type = 'text';
            input.value = task.text;
            input.classList.add('task-edit-input');
            
            e.target.replaceWith(input);
            input.focus();
            
            const saveEdit = () => {
                const newText = input.value.trim();
                const newTasks = state.tasks.map(t =>
                    t.id === id ? { ...t, text: newText || task.text } : t
                );
                state.setTasks(newTasks);
                saveTasks();
                ui.renderTasks();
            };
            
            input.addEventListener('blur', saveEdit);
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') input.blur();
                if (event.key === 'Escape') ui.renderTasks();
            });
        }
    });
    
    let draggedItem = null;
    dom.taskList.addEventListener('dragstart', (e) => {
        draggedItem = e.target;
        setTimeout(() => e.target.classList.add('dragging'), 0);
    });
    
    dom.taskList.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
        draggedItem = null;
    });

    dom.taskList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(dom.taskList, e.clientY);
        const currentDragged = document.querySelector('.dragging');
        if (afterElement == null) {
            dom.taskList.appendChild(currentDragged);
        } else {
            dom.taskList.insertBefore(currentDragged, afterElement);
        }
    });
    
    dom.taskList.addEventListener('drop', () => {
        const newOrderIds = Array.from(dom.taskList.querySelectorAll('li')).map(li => parseInt(li.dataset.id));
        const newTasks = newOrderIds.map(id => state.tasks.find(task => task.id === id));
        state.setTasks(newTasks);
        saveTasks();
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    timer.switchMode('pomodoro');
    ui.updateCounters();
}

init();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(reg => console.log('Service worker registrado.')).catch(err => console.log('Service worker: Erro:', err));
    });
}
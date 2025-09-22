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
        } else if (e.target.closest('.delete-task-btn')) {
            const newTasks = state.tasks.filter(t => t.id !== id);
            state.setTasks(newTasks);
        }
        saveTasks();
        ui.renderTasks();
    });
    
    timer.switchMode('pomodoro');
    ui.updateCounters();
}

init();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(reg => console.log('Service worker registrado.')).catch(err => console.log('Service worker: Erro:', err));
    });
}
document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const pomodoroWidget = document.getElementById('pomodoro-container');
    const timerDisplay = document.getElementById('timer-display');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const pomodoroCounterDisplay = document.getElementById('pomodoro-counter');
    const cycleCounterDisplay = document.getElementById('cycle-counter');
    const progressRing = document.querySelector('.progress-ring-fg');
    const radius = progressRing.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
    progressRing.style.strokeDashoffset = circumference;
    const settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const favicon = document.getElementById('favicon');
    const announcer = document.getElementById('announcer');

    const favicons = {
        default: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⏰</text></svg>",
        playing: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>▶️</text></svg>",
        paused: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⏸️</text></svg>"
    };

    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const taskSummary = document.getElementById('task-summary');
    const alarmSoundSelect = document.getElementById('alarm-sound-select');
    const ambientSoundSelect = document.getElementById('ambient-sound-select');
    const statsModal = new bootstrap.Modal(document.getElementById('statsModal'));
    const statsToday = document.getElementById('stats-today');
    const statsTotal = document.getElementById('stats-total');
    
    const inputs = {
        pomodoro: document.getElementById('pomodoro-time'),
        shortBreak: document.getElementById('short-break-time'),
        longBreak: document.getElementById('long-break-time'),
        pomodorosPerCycle: document.getElementById('pomodoros-per-cycle'),
        totalCycles: document.getElementById('total-cycles')
    };

    // --- ESTADO DA APLICAÇÃO ---
    let timer;
    let isRunning = false;
    let currentMode = 'pomodoro';
    let timeLeft;
    let pomodorosCompletedInCycle = 0;
    let currentCycle = 1;
    let tasks = [];
    let isAudioUnlocked = false;

    let settings = {
        pomodoro: 25, shortBreak: 5, longBreak: 15,
        pomodorosPerCycle: 4, totalCycles: 1, 
        alarmSound: 'notification1',
        ambientSound: 'none'
    };

    // --- FUNÇÕES ---
    function announce(message) { announcer.textContent = message; }

    function unlockAudioContext() {
        if (isAudioUnlocked) return;
        const allSounds = document.querySelectorAll('audio');
        allSounds.forEach(sound => {
            sound.play().catch(() => {});
            sound.pause();
            sound.currentTime = 0;
        });
        isAudioUnlocked = true;
        console.log("Contexto de áudio destravado.");
    }
    
    function stopAllAmbientSounds() {
        document.querySelectorAll('.ambient-sound').forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    function handleTimerEnd() {
        pauseTimer();
        const alarm = document.getElementById(settings.alarmSound);
        if (alarm) {
            alarm.currentTime = 0;
            const playPromise = alarm.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => console.error("Erro ao tocar o som de alarme:", error));
            }
        }
        pomodoroWidget.classList.add('timer-ended-flash');

        if (currentMode === 'pomodoro') {
            pomodorosCompletedInCycle++;
            updatePomodoroHistory();
            if (pomodorosCompletedInCycle >= settings.pomodorosPerCycle) {
                if (currentCycle >= settings.totalCycles) {
                    sendNotification("Ciclos completos!", "Bom trabalho! Você completou todos os seus ciclos.");
                    resetApp(); return;
                }
                currentCycle++;
                pomodorosCompletedInCycle = 0;
                sendNotification("Hora da Pausa Longa!", `Relaxe por ${settings.longBreak} minutos.`);
                switchMode('longBreak');
            } else {
                sendNotification("Hora da Pausa Curta!", `Faça uma pausa de ${settings.shortBreak} minutos.`);
                switchMode('shortBreak');
            }
        } else {
            sendNotification("De volta ao Foco!", `Vamos para mais ${settings.pomodoro} minutos de trabalho.`);
            switchMode('pomodoro');
        }
        updateCounters();
        setTimeout(startTimer, 1000);
    }

    function resetApp() {
        pauseTimer();
        pomodorosCompletedInCycle = 0;
        currentCycle = 1;
        updateCounters();
        switchMode('pomodoro');
        favicon.href = favicons.default;
    }

    function renderTasks() {
        taskList.innerHTML = '';
        let completedCount = 0;
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.dataset.id = task.id;
            li.innerHTML = `<input type="checkbox" ${task.completed ? 'checked' : ''}><span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span><button class="delete-task-btn" aria-label="Deletar Tarefa"><i class="bi bi-trash"></i></button>`;
            taskList.appendChild(li);
            if (task.completed) completedCount++;
        });
        taskSummary.textContent = `${completedCount} / ${tasks.length}`;
    }

    function saveTasks() { localStorage.setItem('pomodoroTasks', JSON.stringify(tasks)); }
    function loadTasks() { const savedTasks = localStorage.getItem('pomodoroTasks'); if (savedTasks) { tasks = JSON.parse(savedTasks); } renderTasks(); }

    function requestNotificationPermission() { if ('Notification' in window && Notification.permission !== 'granted') { Notification.requestPermission(); } }
    function sendNotification(title, body) { if ('Notification' in window && Notification.permission === 'granted') { new Notification(title, { body }); } }

    function handleKeyPress(e) {
        if (e.target.tagName === 'INPUT') return;
        if (e.code === 'Space') { e.preventDefault(); isRunning ? pauseTimer() : startTimer(); }
        if (e.code === 'KeyS' && isRunning) stopTimer();
        if (e.altKey && e.code === 'KeyP') switchMode('pomodoro');
        if (e.altKey && e.code === 'KeyC') switchMode('shortBreak');
        if (e.altKey && e.code === 'KeyL') switchMode('longBreak');
    }

    function updatePomodoroHistory() {
        const history = JSON.parse(localStorage.getItem('pomodoroHistory')) || {};
        const today = new Date().toISOString().slice(0, 10);
        history[today] = (history[today] || 0) + 1;
        localStorage.setItem('pomodoroHistory', JSON.stringify(history));
    }

    function renderStats() {
        const history = JSON.parse(localStorage.getItem('pomodoroHistory')) || {};
        const today = new Date().toISOString().slice(0, 10);
        statsToday.textContent = history[today] || 0;
        statsTotal.textContent = Object.values(history).reduce((sum, count) => sum + count, 0);
    }

    function updateCounters() {
        pomodoroCounterDisplay.textContent = `Pomodoro: ${pomodorosCompletedInCycle} / ${settings.pomodorosPerCycle}`;
        cycleCounterDisplay.textContent = `Ciclo: ${currentCycle} / ${settings.totalCycles}`;
    }

    function saveSettings() {
        settings.pomodoro = parseInt(inputs.pomodoro.value);
        settings.shortBreak = parseInt(inputs.shortBreak.value);
        settings.longBreak = parseInt(inputs.longBreak.value);
        settings.pomodorosPerCycle = parseInt(inputs.pomodorosPerCycle.value);
        settings.totalCycles = parseInt(inputs.totalCycles.value);
        settings.alarmSound = alarmSoundSelect.value;
        settings.ambientSound = ambientSoundSelect.value;
        localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
        settingsModal.hide();
        resetApp();
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem('pomodoroSettings');
        if (savedSettings) { Object.assign(settings, JSON.parse(savedSettings)); }
        inputs.pomodoro.value = settings.pomodoro;
        inputs.shortBreak.value = settings.shortBreak;
        inputs.longBreak.value = settings.longBreak;
        inputs.pomodorosPerCycle.value = settings.pomodorosPerCycle;
        inputs.totalCycles.value = settings.totalCycles;
        alarmSoundSelect.value = settings.alarmSound;
        ambientSoundSelect.value = settings.ambientSound;
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.title = `${timerDisplay.textContent} - Pomodoro`;
    }

    function setProgress(percent) { const offset = circumference - (percent / 100) * circumference; progressRing.style.strokeDashoffset = offset; }

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        updateControlButtons();
        favicon.href = favicons.playing;
        announce("Timer iniciado.");
        
        if (currentMode === 'pomodoro' && settings.ambientSound !== 'none') {
            const ambientSound = document.getElementById(settings.ambientSound);
            if (ambientSound) {
                ambientSound.play().catch(e => console.error("Erro ao tocar som ambiente:", e));
            }
        }

        const totalTime = settings[currentMode] * 60;
        timer = setInterval(() => {
            timeLeft--;
            const percentComplete = ((totalTime - timeLeft) / totalTime) * 100;
            setProgress(percentComplete);
            updateTimerDisplay();
            if (timeLeft <= 0) { handleTimerEnd(); }
        }, 1000);
    }

    function pauseTimer() {
        isRunning = false;
        updateControlButtons();
        clearInterval(timer);
        if (timeLeft > 0) { favicon.href = favicons.paused; }
        announce("Timer pausado.");
        stopAllAmbientSounds();
    }

    function stopTimer() {
        pauseTimer();
        favicon.href = favicons.default;
        switchMode(currentMode);
    }

    function switchMode(mode) {
        pauseTimer();
        currentMode = mode;
        timeLeft = settings[mode] * 60;
        modeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
        const modeNames = { pomodoro: "Pomodoro", shortBreak: "Pausa Curta", longBreak: "Pausa Longa" };
        announce(`Modo alterado para ${modeNames[mode]}.`);
        updateTimerDisplay();
        setProgress(0);
    }

    function updateControlButtons() {
        startBtn.classList.toggle('hidden', isRunning);
        pauseBtn.classList.toggle('hidden', !isRunning);
        stopBtn.classList.toggle('hidden', !isRunning);
    }

    function setupTheme() {
        const savedTheme = localStorage.getItem('pomodoroTheme') || 'light';
        document.body.classList.toggle('theme-dark', savedTheme === 'dark');
        themeToggleBtn.innerHTML = savedTheme === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
    }

    function toggleTheme() {
        const isDark = document.body.classList.toggle('theme-dark');
        localStorage.setItem('pomodoroTheme', isDark ? 'dark' : 'light');
        themeToggleBtn.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
    }

    function init() {
        loadSettings();
        loadTasks();
        setupTheme();
        
        startBtn.addEventListener('click', () => { unlockAudioContext(); requestNotificationPermission(); startTimer(); });
        pauseBtn.addEventListener('click', pauseTimer);
        stopBtn.addEventListener('click', stopTimer);
        saveSettingsBtn.addEventListener('click', saveSettings);
        themeToggleBtn.addEventListener('click', toggleTheme);
        document.addEventListener('keydown', handleKeyPress);
        document.getElementById('statsModal').addEventListener('show.bs.modal', renderStats);
        pomodoroWidget.addEventListener('animationend', () => pomodoroWidget.classList.remove('timer-ended-flash'));

        modeButtons.forEach(btn => btn.addEventListener('click', () => switchMode(btn.dataset.mode)));
        
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault(); const text = taskInput.value.trim();
            if (text) { tasks.push({ id: Date.now(), text, completed: false }); taskInput.value = ''; saveTasks(); renderTasks(); }
        });

        taskList.addEventListener('click', (e) => {
            const li = e.target.closest('li'); if (!li) return; const id = parseInt(li.dataset.id);
            if (e.target.type === 'checkbox') { const task = tasks.find(t => t.id === id); task.completed = e.target.checked; }
            if (e.target.closest('.delete-task-btn')) { tasks = tasks.filter(t => t.id !== id); }
            saveTasks(); renderTasks();
        });
        
        switchMode('pomodoro');
        updateCounters();
    }

    init();

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(reg => console.log('Service worker registrado.')).catch(err => console.log('Service worker: Erro:', err));
        });
    }
});
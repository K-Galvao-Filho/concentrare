document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const pomodoroWidget = document.getElementById('pomodoro-container');
    const timerDisplay = document.getElementById('timer-display');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const nextBtn = document.getElementById('next-btn');
    const pomodoroCounterDisplay = document.getElementById('pomodoro-counter');
    const cycleCounterDisplay = document.getElementById('cycle-counter');
    const youtubePlayerContainer = document.getElementById('youtube-player-container');
    const ambientSoundSelect = document.getElementById('ambient-sound-select-main');
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
    const autoStartBreaksSwitch = document.getElementById('auto-start-breaks-switch');
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
    let settings = {
        pomodoro: 25, shortBreak: 5, longBreak: 15,
        pomodorosPerCycle: 4, totalCycles: 1, 
        alarmSound: 'notification1',
        ambientSound: 'none',
        autoStartBreaks: true
    };
    
    // --- ESTADO DOS SISTEMAS DE ÁUDIO ---
    let youtubePlayer;
    let audioContext;
    let audioBuffers = new Map();
    let currentAmbientSource = null;
    let isAudioInitialized = false;

    // --- LÓGICA DE ÁUDIO HÍBRIDA ---

    // Função mestre para tocar o som selecionado
    function playSelectedSound(soundId) {
        stopAllSounds(); // Garante que tudo pare antes de começar um novo som

        if (soundId === 'youtube') {
            youtubePlayerContainer.classList.remove('hidden');
            playYoutubeMusic();
        } else {
            youtubePlayerContainer.classList.add('hidden');
            playAmbientSound(soundId);
        }
    }

    // Função mestre para parar todos os sons
    function stopAllSounds() {
        stopAmbientSound();
        pauseYoutubeMusic();
    }

    // --- LÓGICA DA API DO YOUTUBE ---
    window.onYouTubeIframeAPIReady = function() {
        youtubePlayer = new YT.Player('youtube-player', {
            height: '150',
            width: '100%',
            videoId: 'jfKfPfyJRdk', // Lofi Girl Live Stream
            playerVars: { 'autoplay': 0, 'controls': 1, 'loop': 1, 'playlist': 'jfKfPfyJRdk' },
            events: { 'onReady': onPlayerReady }
        });
    }

    function onPlayerReady(event) {
        event.target.setVolume(50);
    }

    function playYoutubeMusic() {
        if (youtubePlayer && typeof youtubePlayer.playVideo === 'function') {
            youtubePlayer.playVideo();
        }
    }

    function pauseYoutubeMusic() {
        if (youtubePlayer && typeof youtubePlayer.pauseVideo === 'function') {
            youtubePlayer.pauseVideo();
        }
    }

    // --- LÓGICA DA WEB AUDIO API (Sons Locais) ---
    function initAudio() {
        if (isAudioInitialized) return;
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            document.querySelectorAll('audio').forEach(sound => {
                sound.play().catch(() => {});
                sound.pause();
                sound.currentTime = 0;
            });
            isAudioInitialized = true;
            console.log("Contexto de áudio inicializado com sucesso.");
        } catch (e) {
            console.error("Web Audio API não é suportada neste navegador.", e);
        }
    }

    async function getAudioBuffer(soundId) {
        if (audioBuffers.has(soundId)) { return audioBuffers.get(soundId); }
        if (!audioContext) { console.error("AudioContext não foi inicializado."); return null; }
        try {
            const response = await fetch(`assets/sounds/ambient/${soundId}.mp3`);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            audioBuffers.set(soundId, audioBuffer);
            return audioBuffer;
        } catch (error) {
            console.error(`Erro ao carregar o som ${soundId}:`, error);
            return null;
        }
    }

    async function playAmbientSound(soundId) {
        if (soundId === 'none' || !audioContext) return;
        const buffer = await getAudioBuffer(soundId);
        if (!buffer) return;
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(audioContext.destination);
        source.start(0);
        currentAmbientSource = source;
    }

    function stopAmbientSound() {
        if (currentAmbientSource) {
            currentAmbientSource.stop(0);
            currentAmbientSource = null;
        }
    }

    // --- FUNÇÕES GERAIS E DO TIMER ---
    function announce(message) { announcer.textContent = message; }

    function skipToNextMode() {
        if (confirm('Você tem certeza que deseja pular para a próxima fase?')) {
            handleTimerEnd();
        }
    }

    function handleTimerEnd() {
        pauseTimer();
        const alarm = document.getElementById(settings.alarmSound);
        if (alarm) { alarm.play().catch(error => console.error("Erro ao tocar alarme:", error)); }
        pomodoroWidget.classList.add('timer-ended-flash');

        if (currentMode === 'pomodoro') {
            pomodorosCompletedInCycle++;
            updatePomodoroHistory();
            
            let nextMode;
            if (pomodorosCompletedInCycle >= settings.pomodorosPerCycle) {
                if (currentCycle >= settings.totalCycles) {
                    sendNotification("Ciclos completos!", "Bom trabalho! Você completou todos os seus ciclos.");
                    resetApp(); 
                    return;
                }
                currentCycle++;
                pomodorosCompletedInCycle = 0;
                nextMode = 'longBreak';
            } else {
                nextMode = 'shortBreak';
            }
            
            switchMode(nextMode);

            if (settings.autoStartBreaks) {
                const breakName = nextMode === 'longBreak' ? 'Pausa Longa' : 'Pausa Curta';
                sendNotification(`Hora da ${breakName}!`, "A pausa começará em breve.");
                setTimeout(startTimer, 1000);
            } else {
                sendNotification("Sessão de Foco Concluída!", "Clique em INICIAR para começar sua pausa.");
                startBtn.innerHTML = '<i class="bi bi-play-fill"></i> INICIAR PAUSA';
            }
        } else {
            sendNotification("De volta ao Foco!", `Vamos para mais ${settings.pomodoro} minutos de trabalho.`);
            switchMode('pomodoro');
            setTimeout(startTimer, 1000);
        }
        updateCounters();
    }

    function resetApp() {
        pauseTimer();
        pomodorosCompletedInCycle = 0;
        currentCycle = 1;
        updateCounters();
        switchMode('pomodoro');
        favicon.href = favicons.default;
    }

    function renderTasks() { /* ... (código da função) ... */ }
    function saveTasks() { /* ... (código da função) ... */ }
    function loadTasks() { /* ... (código da função) ... */ }
    function requestNotificationPermission() { /* ... (código da função) ... */ }
    function sendNotification(title, body) { /* ... (código da função) ... */ }
    function handleKeyPress(e) { /* ... (código da função) ... */ }
    function updatePomodoroHistory() { /* ... (código da função) ... */ }
    function renderStats() { /* ... (código da função) ... */ }
    function updateCounters() { /* ... (código da função) ... */ }

    function saveSettings() {
        settings.pomodoro = parseInt(inputs.pomodoro.value);
        settings.shortBreak = parseInt(inputs.shortBreak.value);
        settings.longBreak = parseInt(inputs.longBreak.value);
        settings.pomodorosPerCycle = parseInt(inputs.pomodorosPerCycle.value);
        settings.totalCycles = parseInt(inputs.totalCycles.value);
        settings.alarmSound = alarmSoundSelect.value;
        settings.autoStartBreaks = autoStartBreaksSwitch.checked;
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
        autoStartBreaksSwitch.checked = settings.autoStartBreaks;
        youtubePlayerContainer.classList.toggle('hidden', settings.ambientSound !== 'youtube');
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.title = `${timerDisplay.textContent} - Pomodoro`;
    }    
    
    function setProgress(percent) { /* ... (código da função) ... */ }

    function startTimer() {
        if (isRunning) return;
        startBtn.innerHTML = '<i class="bi bi-play-fill"></i> INICIAR';
        isRunning = true;
        updateControlButtons();
        favicon.href = favicons.playing;
        announce("Timer iniciado.");
        
        if (currentMode === 'pomodoro') {
            playSelectedSound(settings.ambientSound);
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
        stopAllSounds();
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
        nextBtn.classList.toggle('hidden', !isRunning);
    }

    function setupTheme() { /* ... (código da função) ... */ }
    function toggleTheme() { /* ... (código da função) ... */ }

    function init() {
        loadSettings();
        loadTasks();
        setupTheme();
        
        startBtn.addEventListener('click', () => { initAudio(); requestNotificationPermission(); startTimer(); });
        pauseBtn.addEventListener('click', pauseTimer);
        stopBtn.addEventListener('click', stopTimer);
        nextBtn.addEventListener('click', skipToNextMode);
        saveSettingsBtn.addEventListener('click', saveSettings);
        themeToggleBtn.addEventListener('click', toggleTheme);
        document.addEventListener('keydown', handleKeyPress);
        document.getElementById('statsModal').addEventListener('show.bs.modal', renderStats);
        pomodoroWidget.addEventListener('animationend', () => pomodoroWidget.classList.remove('timer-ended-flash'));

        ambientSoundSelect.addEventListener('change', () => {
            settings.ambientSound = ambientSoundSelect.value;
            localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
            if (isRunning && currentMode === 'pomodoro') {
                playSelectedSound(settings.ambientSound);
            } else {
                youtubePlayerContainer.classList.toggle('hidden', settings.ambientSound !== 'youtube');
            }
        });

        modeButtons.forEach(btn => btn.addEventListener('click', () => switchMode(btn.dataset.mode)));
        taskForm.addEventListener('submit', (e) => { /* ... (código do listener) ... */ });
        taskList.addEventListener('click', (e) => { /* ... (código do listener) ... */ });
        
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
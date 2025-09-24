export const pomodoroWidget = document.getElementById('pomodoro-container');
export const timerDisplay = document.getElementById('timer-display');
export const modeButtons = document.querySelectorAll('.mode-btn');
export const startBtn = document.getElementById('start-btn');
export const pauseBtn = document.getElementById('pause-btn');
export const stopBtn = document.getElementById('stop-btn');
export const nextBtn = document.getElementById('next-btn');
export const pomodoroCounterDisplay = document.getElementById('pomodoro-counter');
export const cycleCounterDisplay = document.getElementById('cycle-counter');
export const youtubePlayerContainer = document.getElementById('youtube-player-container');
export const ambientSoundSelect = document.getElementById('ambient-sound-select-main');
export const progressRing = document.querySelector('.progress-ring-fg');
export const themeToggleBtn = document.getElementById('theme-toggle-btn');
export const favicon = document.getElementById('favicon');
export const announcer = document.getElementById('announcer');

// Favicons (se você os tiver definido)
export const favicons = {
    default: "data:image/svg+xml,...",
    playing: "data:image/svg+xml,...",
    paused: "data:image/svg+xml,..."
};

// --- Tarefas ---
export const taskForm = document.getElementById('task-form');
export const taskInput = document.getElementById('task-input');
export const taskPomodoroEstimate = document.getElementById('task-pomodoro-estimate');
export const taskList = document.getElementById('task-list');
export const taskSummary = document.getElementById('task-summary');
export const clearCompletedBtn = document.getElementById('clear-completed-btn');

// --- Modais ---
export const settingsModalEl = document.getElementById('settingsModal');
export const settingsModal = new bootstrap.Modal(settingsModalEl);
export const saveSettingsBtn = document.getElementById('save-settings-btn');

export const statsModalEl = document.getElementById('statsModal');
export const statsModal = new bootstrap.Modal(statsModalEl);
export const statsToday = document.getElementById('stats-today');
export const statsTotal = document.getElementById('stats-total');

export const taskCompletedModalEl = document.getElementById('taskCompletedModal');
export const taskCompletedModal = new bootstrap.Modal(taskCompletedModalEl);
export const completedTaskName = document.getElementById('completed-task-name');
export const startNextTaskBtn = document.getElementById('start-next-task-btn');
export const returnToStandardBtn = document.getElementById('return-to-standard-btn');

export const restartTaskModalEl = document.getElementById('restartTaskModal');
export const restartTaskModal = new bootstrap.Modal(restartTaskModalEl);
export const confirmRestartBtn = document.getElementById('confirm-restart-btn');

// --- Inputs das Configurações ---
export const inputs = {
    pomodoro: document.getElementById('pomodoro-time'),
    shortBreak: document.getElementById('short-break-time'),
    longBreak: document.getElementById('long-break-time'),
    pomodorosPerCycle: document.getElementById('pomodoros-per-cycle'),
    totalCycles: document.getElementById('total-cycles')
};

// --- Controles Avançados das Configurações ---
export const alarmSoundSelect = document.getElementById('alarm-sound-select');
export const autoStartBreaksSwitch = document.getElementById('auto-start-breaks-switch');
export const browserNotificationsSwitch = document.getElementById('browser-notifications-switch');
export const autoStartPomodorosSwitch = document.getElementById('auto-start-pomodoros-switch');
export const tickingSoundSwitch = document.getElementById('ticking-sound-switch');
export const strictTaskModeSwitch = document.getElementById('strict-task-mode-switch');
export const onTaskCompletedActionSelect = document.getElementById('on-task-completed-action-select');
export const alarmVolumeSlider = document.getElementById('alarm-volume-slider');
export const ambientVolumeSlider = document.getElementById('ambient-volume-slider');

// --- Elementos de Áudio ---
export const tickingSoundAudio = document.getElementById('ticking-sound');

// --- Propriedades do Círculo de Progresso ---
export const radius = progressRing.r.baseVal.value;
export const circumference = 2 * Math.PI * radius;
progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
progressRing.style.strokeDashoffset = circumference;
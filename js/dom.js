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
export const settingsModalEl = document.getElementById('settingsModal');
export const settingsModal = new bootstrap.Modal(settingsModalEl);
export const saveSettingsBtn = document.getElementById('save-settings-btn');
export const themeToggleBtn = document.getElementById('theme-toggle-btn');
export const favicon = document.getElementById('favicon');
export const announcer = document.getElementById('announcer');

export const favicons = {
    default: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⏰</text></svg>",
    playing: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>▶️</text></svg>",
    paused: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⏸️</text></svg>"
};

export const taskForm = document.getElementById('task-form');
export const taskInput = document.getElementById('task-input');
export const taskList = document.getElementById('task-list');
export const taskSummary = document.getElementById('task-summary');
export const alarmSoundSelect = document.getElementById('alarm-sound-select');
export const autoStartBreaksSwitch = document.getElementById('auto-start-breaks-switch');
export const statsModalEl = document.getElementById('statsModal');
export const statsModal = new bootstrap.Modal(statsModalEl);
export const statsToday = document.getElementById('stats-today');
export const statsTotal = document.getElementById('stats-total');

export const inputs = {
    pomodoro: document.getElementById('pomodoro-time'),
    shortBreak: document.getElementById('short-break-time'),
    longBreak: document.getElementById('long-break-time'),
    pomodorosPerCycle: document.getElementById('pomodoros-per-cycle'),
    totalCycles: document.getElementById('total-cycles')
};

export const radius = progressRing.r.baseVal.value;
export const circumference = 2 * Math.PI * radius;
progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
progressRing.style.strokeDashoffset = circumference;
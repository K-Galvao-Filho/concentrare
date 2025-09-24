// Guarda todas as variáveis de estado da aplicação.

export let timer;
export let isRunning = false;
export let currentMode = 'pomodoro';
export let timeLeft;
export let pomodorosCompletedInCycle = 0;
export let currentCycle = 1;
export let tasks = [];
export let activeTaskId = null;
export let taskJustCompleted = false; 


// Objeto central de configurações com todos os valores padrão
export let settings = {
    pomodoro: 25, 
    shortBreak: 5, 
    longBreak: 15,
    pomodorosPerCycle: 4, 
    totalCycles: 1, 
    alarmSound: 'none',
    ambientSound: 'none',
    autoStartBreaks: true,
    autoStartPomodoros: false,
    browserNotificationsEnabled: true,
    tickingSoundEnabled: false,
    strictTaskMode: false,
    onTaskCompletedAction: 'ask', // pode ser 'ask', 'startNext', ou 'revertToStandard'
    alarmVolume: 1.0, // de 0.0 a 1.0
    ambientVolume: 0.5 // de 0.0 a 1.0
};

// Funções para modificar o estado de forma controlada (setters)
export function setTimer(newTimer) { timer = newTimer; }
export function setIsRunning(running) { isRunning = running; }
export function setCurrentMode(mode) { currentMode = mode; }
export function setTimeLeft(time) { timeLeft = time; }
export function incrementPomodoros() { pomodorosCompletedInCycle++; }
export function resetPomodoros() { pomodorosCompletedInCycle = 0; }
export function incrementCycles() { currentCycle++; }
export function resetCycles() { currentCycle = 1; }
export function setTasks(newTasks) { tasks = newTasks; }
export function setActiveTaskId(id) { activeTaskId = id; }
export function setSettings(newSettings) { settings = newSettings; }
export function setTaskJustCompleted(value) { taskJustCompleted = value; }

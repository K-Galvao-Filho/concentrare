import * as dom from './dom.js';
import * as state from './state.js';

export function updateTimerDisplay() {
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    dom.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.title = `${dom.timerDisplay.textContent} - Pomodoro`;
}

export function setProgress(percent) {
    const offset = dom.circumference - (percent / 100) * dom.circumference;
    dom.progressRing.style.strokeDashoffset = offset;
}

export function updateControlButtons() {
    dom.startBtn.classList.toggle('hidden', state.isRunning);
    dom.pauseBtn.classList.toggle('hidden', !state.isRunning);
    dom.stopBtn.classList.toggle('hidden', !state.isRunning);
    dom.nextBtn.classList.toggle('hidden', !state.isRunning);
}

export function updateCounters() {
    dom.pomodoroCounterDisplay.textContent = `Pomodoro: ${state.pomodorosCompletedInCycle} / ${state.settings.pomodorosPerCycle}`;
    dom.cycleCounterDisplay.textContent = `Ciclo: ${state.currentCycle} / ${state.settings.totalCycles}`;
}

export function renderTasks() {
    dom.taskList.innerHTML = '';
    let completedCount = 0;
    state.tasks.forEach(task => {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.innerHTML = `<input type="checkbox" ${task.completed ? 'checked' : ''}><span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span><button class="delete-task-btn" aria-label="Deletar Tarefa"><i class="bi bi-trash"></i></button>`;
        dom.taskList.appendChild(li);
        if (task.completed) completedCount++;
    });
    dom.taskSummary.textContent = `${completedCount} / ${state.tasks.length}`;
}

export function renderStats() {
    const history = JSON.parse(localStorage.getItem('pomodoroHistory')) || {};
    const today = new Date().toISOString().slice(0, 10);
    dom.statsToday.textContent = history[today] || 0;
    dom.statsTotal.textContent = Object.values(history).reduce((sum, count) => sum + count, 0);
}

export function setupTheme() {
    const savedTheme = localStorage.getItem('pomodoroTheme') || 'light';
    document.body.classList.toggle('theme-dark', savedTheme === 'dark');
    dom.themeToggleBtn.innerHTML = savedTheme === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
}

export function toggleTheme() {
    const isDark = document.body.classList.toggle('theme-dark');
    localStorage.setItem('pomodoroTheme', isDark ? 'dark' : 'light');
    dom.themeToggleBtn.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
}

export function announce(message) {
    dom.announcer.textContent = message;
}
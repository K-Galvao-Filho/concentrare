import * as dom from './dom.js';
import * as state from './state.js';

export function updateTimerDisplay() {
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    dom.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.title = `${dom.timerDisplay.textContent} - CONCENTRARE`;
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
    const activeTask = state.activeTaskId ? state.tasks.find(t => t.id === state.activeTaskId) : null;

    let pomodoroCurrent;
    let pomodoroTotal;
    let pomodoroDisplayNumber;
    let cycleDisplayNumber = state.currentCycle;

    if (activeTask) {
        dom.cycleCounterDisplay.style.display = 'none';
        pomodoroTotal = activeTask.pomodorosEst;
        pomodoroCurrent = activeTask.pomodorosDone;
    } else {
        dom.cycleCounterDisplay.style.display = 'inline';
        pomodoroTotal = state.settings.pomodorosPerCycle;
        pomodoroCurrent = state.pomodorosCompletedInCycle;
    }

    pomodoroDisplayNumber = pomodoroCurrent;
    if (state.currentMode === 'pomodoro' && pomodoroCurrent < pomodoroTotal) {
        pomodoroDisplayNumber = pomodoroCurrent + 1;
    }
    
    if (state.currentMode === 'longBreak' && !activeTask) {
        pomodoroDisplayNumber = pomodoroTotal;
    }
    
    if (state.currentMode === 'longBreak' && state.currentCycle > 1) {
        cycleDisplayNumber = state.currentCycle - 1;
    }

    dom.pomodoroCounterDisplay.textContent = `Pomodoro: ${pomodoroDisplayNumber} / ${pomodoroTotal}`;
    dom.cycleCounterDisplay.textContent = `Ciclo: ${cycleDisplayNumber} / ${state.settings.totalCycles}`;
}

export function renderTasks() {
    dom.taskList.innerHTML = '';
    let completedCount = 0;
    state.tasks.forEach(task => {
        let displayPomodorosDone = task.pomodorosDone;

        const isTaskActive = task.id === state.activeTaskId;

        if (isTaskActive && state.currentMode === 'longBreak') {
            displayPomodorosDone = task.pomodorosEst;
        } else {
            const isTaskActiveAndInProgress = 
                isTaskActive &&
                state.currentMode === 'pomodoro' &&
                task.pomodorosDone < task.pomodorosEst;

            if (isTaskActiveAndInProgress) {
                displayPomodorosDone++;
            }
        }

        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.draggable = true;
        
        if(isTaskActive) {
            li.classList.add('active-task');
        }
        
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <div class="task-controls">
                <span class="task-pomodoro-count">${displayPomodorosDone} / ${task.pomodorosEst}</span>
                <button class="set-active-task-btn" title="Marcar como tarefa ativa">
                    <i class="bi bi-bullseye"></i>
                </button>
                <button class="delete-task-btn" aria-label="Deletar Tarefa" title="Deletar tarefa">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        
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

export function updateStartButtonState() {
    const hasIncompleteTasks = state.tasks.some(task => !task.completed);
    let isDisabled = false;
    let title = "";

    if (state.settings.strictTaskMode) {
        if (!hasIncompleteTasks) {
            // Se não há tarefas incompletas, desabilita.
            isDisabled = true;
            title = "Todas as tarefas foram concluídas!";
        } else if (state.activeTaskId === null) {
            // Se há tarefas, mas nenhuma está selecionada, desabilita.
            isDisabled = true;
            title = "Selecione uma tarefa para iniciar";
        }
    }
    
    dom.startBtn.disabled = isDisabled;
    dom.startBtn.title = title;
}

export function announce(message) {
    dom.announcer.textContent = message;
}
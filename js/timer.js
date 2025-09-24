import * as state from './state.js';
import * as ui from './ui.js';
import * as dom from './dom.js';
import * as audio from './audio.js';

function updatePomodoroHistory() {
    const history = JSON.parse(localStorage.getItem('pomodoroHistory')) || {};
    const today = new Date().toISOString().slice(0, 10);
    history[today] = (history[today] || 0) + 1;
    localStorage.setItem('pomodoroHistory', JSON.stringify(history));
}

function sendNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted' && state.settings.browserNotificationsEnabled) {
        new Notification(title, { body });
    }
}

export function startNextTask() {
    const lastCompletedTask = state.tasks.find(t => t.id === state.activeTaskId);
    const lastCompletedIndex = state.tasks.indexOf(lastCompletedTask);
    const nextTask = state.tasks.find((task, index) => index > lastCompletedIndex && !task.completed);
    state.setActiveTaskId(nextTask ? nextTask.id : null);
    ui.renderTasks();
    ui.updateCounters();
}

export function returnToStandardMode() {
    state.setActiveTaskId(null);
    ui.renderTasks();
    ui.updateCounters();
}

export function handleTimerEnd() {
    pauseTimer();
    if (state.settings.alarmSound !== 'none') {
        const alarm = document.getElementById(state.settings.alarmSound);
        if (alarm) {
            alarm.volume = state.settings.alarmVolume;
            alarm.currentTime = 0;
            alarm.play().catch(error => console.error("Erro ao tocar alarme:", error));
        }
    }
    dom.pomodoroWidget.classList.add('timer-ended-flash');

    if (state.currentMode === 'pomodoro') {
        dom.tickingSoundAudio.pause();
        updatePomodoroHistory();
        state.incrementPomodoros();
        let taskJustCompleted = false;
        const activeTask = state.activeTaskId ? state.tasks.find(t => t.id === state.activeTaskId) : null;
        let nextMode;
        if (activeTask) {
            activeTask.pomodorosDone++;
            if (activeTask.pomodorosDone >= activeTask.pomodorosEst) {
                activeTask.completed = true;
                state.setTaskJustCompleted(true);
                taskJustCompleted = true;
                localStorage.setItem('pomodoroTasks', JSON.stringify(state.tasks));
            } else {
                localStorage.setItem('pomodoroTasks', JSON.stringify(state.tasks));
            }
        }
        if (state.pomodorosCompletedInCycle >= state.settings.pomodorosPerCycle) {
            if (!activeTask && state.currentCycle >= state.settings.totalCycles) {
                sendNotification("Ciclos completos!", "Bom trabalho! Você completou todos os seus ciclos.");
                resetApp();
                return;
            }
            if (!activeTask) {
                state.incrementCycles();
            }
            nextMode = 'longBreak';
            state.resetPomodoros();
        } else {
            nextMode = 'shortBreak';
        }
        switchMode(nextMode);
        if (state.settings.autoStartBreaks) {
            const breakName = nextMode === 'longBreak' ? 'Pausa Longa' : 'Pausa Curta';
            sendNotification(`Hora da ${breakName}!`, "A pausa começará em breve.");
            setTimeout(startTimer, 1000);
        } else if (!taskJustCompleted) {
            sendNotification("Sessão de Foco Concluída!", "Clique em INICIAR para começar sua pausa.");
            dom.startBtn.innerHTML = '<i class="bi bi-play-fill"></i> INICIAR PAUSA';
        }
    } else { // Fim de uma pausa
        switchMode('pomodoro');
        
        let shouldShowModal = false;

        if (state.taskJustCompleted) {
            state.setTaskJustCompleted(false);
            const action = state.settings.onTaskCompletedAction;
            if (action === 'ask') {
                shouldShowModal = true;
            } else if (action === 'startNext') {
                startNextTask();
            } else { // revertToStandard
                returnToStandardMode();
            }
        }

        if (shouldShowModal) {
            const completedTask = state.tasks.find(t => t.id === state.activeTaskId);
            if (completedTask) {
                dom.completedTaskName.textContent = completedTask.text;
            }
            dom.taskCompletedModal.show();
        } else {
            sendNotification("De volta ao Foco!", "Vamos para a próxima sessão.");
            const activeTask = state.activeTaskId ? state.tasks.find(t => t.id === state.activeTaskId) : null;
            const canAutoStart = !activeTask || !activeTask.completed;
            if (state.settings.autoStartPomodoros && canAutoStart) {
                setTimeout(startTimer, 1000);
            }
        }
    }
    ui.updateCounters();
    ui.renderTasks();
    ui.updateStartButtonState();
}

export function proceedToStartTimer() {
    if (state.isRunning) return;
    if (state.currentMode === 'pomodoro' && state.settings.tickingSoundEnabled) {
        dom.tickingSoundAudio.volume = state.settings.ambientVolume;
        dom.tickingSoundAudio.currentTime = 0;
        dom.tickingSoundAudio.play();
    }
    dom.startBtn.innerHTML = '<i class="bi bi-play-fill"></i> INICIAR';
    state.setIsRunning(true);
    ui.updateControlButtons();
    dom.favicon.href = dom.favicons.playing;
    ui.announce("Timer iniciado.");
    if (state.currentMode === 'pomodoro') {
        audio.playSelectedSound(state.settings.ambientSound);
    }
    const totalTime = state.settings[state.currentMode] * 60;
    const newTimer = setInterval(() => {
        state.setTimeLeft(state.timeLeft - 1);
        const percentComplete = ((totalTime - state.timeLeft) / totalTime) * 100;
        ui.setProgress(percentComplete);
        ui.updateTimerDisplay();
        if (state.timeLeft <= 0) { handleTimerEnd(); }
    }, 1000);
    state.setTimer(newTimer);
}

export function startTimer() {
    const activeTask = state.activeTaskId ? state.tasks.find(t => t.id === state.activeTaskId) : null;
    if (state.currentMode === 'pomodoro' && activeTask && activeTask.completed) {
        dom.restartTaskModal.show();
    } else {
        proceedToStartTimer();
    }
}

export function pauseTimer() {
    dom.tickingSoundAudio.pause();
    state.setIsRunning(false);
    ui.updateControlButtons();
    clearInterval(state.timer);
    if (state.timeLeft > 0) { dom.favicon.href = dom.favicons.paused; }
    ui.announce("Timer pausado.");
    audio.stopAllSounds();
}

export function stopTimer() {
    dom.tickingSoundAudio.pause();
    dom.tickingSoundAudio.currentTime = 0;
    pauseTimer();
    dom.favicon.href = dom.favicons.default;
    switchMode(state.currentMode);
}

export function switchMode(mode) {
    pauseTimer();
    state.setCurrentMode(mode);
    state.setTimeLeft(state.settings[mode] * 60);
    dom.modeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
    const modeNames = { pomodoro: "Pomodoro", shortBreak: "Pausa Curta", longBreak: "Pausa Longa" };
    ui.announce(`Modo alterado para ${modeNames[mode]}.`);
    ui.updateTimerDisplay();
    ui.setProgress(0);
    ui.updateCounters();
}

export function skipToNextMode() {
    if (confirm('Você tem certeza que deseja pular para a próxima fase?')) {
        handleTimerEnd();
    }
}

export function resetApp() {
    pauseTimer();
    state.resetPomodoros();
    state.resetCycles();
    switchMode('pomodoro');
    dom.favicon.href = dom.favicons.default;
}
import * as state from './state.js';
import * as ui from './ui.js';
import * as dom from './dom.js';
import { playSelectedSound, stopAllSounds } from './audio.js';

// Funções que controlam a lógica do timer.

function updatePomodoroHistory() {
    const history = JSON.parse(localStorage.getItem('pomodoroHistory')) || {};
    const today = new Date().toISOString().slice(0, 10);
    history[today] = (history[today] || 0) + 1;
    localStorage.setItem('pomodoroHistory', JSON.stringify(history));
}

function sendNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
    }
}

export function handleTimerEnd() {
    pauseTimer();
    const alarm = document.getElementById(state.settings.alarmSound);
    if (alarm) { alarm.play().catch(error => console.error("Erro ao tocar alarme:", error)); }
    dom.pomodoroWidget.classList.add('timer-ended-flash');

    if (state.currentMode === 'pomodoro') {
        state.incrementPomodoros();
        updatePomodoroHistory();
        
        let nextMode;
        if (state.pomodorosCompletedInCycle >= state.settings.pomodorosPerCycle) {
            if (state.currentCycle >= state.settings.totalCycles) {
                sendNotification("Ciclos completos!", "Bom trabalho!");
                resetApp(); 
                return;
            }
            state.incrementCycles();
            state.resetPomodoros();
            nextMode = 'longBreak';
        } else {
            nextMode = 'shortBreak';
        }
        
        switchMode(nextMode);

        if (state.settings.autoStartBreaks) {
            const breakName = nextMode === 'longBreak' ? 'Pausa Longa' : 'Pausa Curta';
            sendNotification(`Hora da ${breakName}!`, "A pausa começará em breve.");
            setTimeout(startTimer, 1000);
        } else {
            sendNotification("Sessão de Foco Concluída!", "Clique em INICIAR para começar sua pausa.");
            dom.startBtn.innerHTML = '<i class="bi bi-play-fill"></i> INICIAR PAUSA';
        }
    } else {
        sendNotification("De volta ao Foco!", `Vamos para mais ${state.settings.pomodoro} minutos de trabalho.`);
        switchMode('pomodoro');
        setTimeout(startTimer, 1000);
    }
    ui.updateCounters();
}

export function startTimer() {
    if (state.isRunning) return;
    dom.startBtn.innerHTML = '<i class="bi bi-play-fill"></i> INICIAR';
    state.setIsRunning(true);
    ui.updateControlButtons();
    dom.favicon.href = dom.favicons.playing;
    ui.announce("Timer iniciado.");
    
    if (state.currentMode === 'pomodoro') {
        playSelectedSound(state.settings.ambientSound);
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

export function pauseTimer() {
    state.setIsRunning(false);
    ui.updateControlButtons();
    clearInterval(state.timer);
    if (state.timeLeft > 0) { dom.favicon.href = dom.favicons.paused; }
    ui.announce("Timer pausado.");
    stopAllSounds();
}

export function stopTimer() {
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
    ui.updateCounters();
    switchMode('pomodoro');
    dom.favicon.href = dom.favicons.default;
}
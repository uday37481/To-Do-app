// Feature: Pomodoro Timer (UMD-style globals)

window.Pomodoro = (function () {
    let intervalId = null;
    let remainingSeconds = 0;
    let currentTaskEl = null;

    function formatTime(totalSeconds) {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
        return m + ':' + s;
    }

    function updateDisplay() {
        const el = document.getElementById('pomodoro-timer');
        if (el) el.textContent = formatTime(remainingSeconds);
    }

    function showPanel(show = true) {
        const panel = document.getElementById('pomodoro-panel');
        if (panel) panel.hidden = !show;
        if (panel && show) panel.classList.remove('complete');
    }

    function start(durationMinutes = 25, taskEl = null) {
        if (intervalId) clearInterval(intervalId);
        remainingSeconds = Math.max(1, Math.floor(durationMinutes * 60));
        currentTaskEl = taskEl || null;
        updateDisplay();
        showPanel(true);
        intervalId = setInterval(() => {
            remainingSeconds -= 1;
            updateDisplay();
            if (remainingSeconds <= 0) {
                clearInterval(intervalId);
                intervalId = null;
                const panel = document.getElementById('pomodoro-panel');
                if (panel) panel.classList.add('complete');
                if (currentTaskEl && !currentTaskEl.classList.contains('done')) {
                    currentTaskEl.classList.add('done');
                    const doneBtn = currentTaskEl.querySelector('.btn');
                    if (doneBtn) doneBtn.textContent = 'Undo';
                    // Trigger progress/analytics update
                    if (window.updateTaskStats) window.updateTaskStats();
                }
            }
        }, 1000);
    }
    
    function pause() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    function reset(durationMinutes = 25) {
        pause();
        remainingSeconds = Math.max(1, Math.floor(durationMinutes * 60));
        updateDisplay();
        showPanel(true);
    }

    // UI button wiring
    document.addEventListener('DOMContentLoaded', () => {
        const panel = document.getElementById('pomodoro-panel');
        const startBtn = document.getElementById('pomodoro-start');
        const pauseBtn = document.getElementById('pomodoro-pause');
        const resetBtn = document.getElementById('pomodoro-reset');
        const pomodoroBtn = document.getElementById('pomodoro-btn');
        if (startBtn) startBtn.onclick = () => start();
        if (pauseBtn) pauseBtn.onclick = pause;
        if (resetBtn) resetBtn.onclick = reset;
        if (pomodoroBtn) pomodoroBtn.onclick = () => showPanel(true);
    });

    // Allow starting Pomodoro for a specific task from main.js
    return { start, pause, reset, showPanel };
})();

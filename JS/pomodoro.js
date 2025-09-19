// Feature: Pomodoro Timer (UMD-style globals)

window.Pomodoro = (function () {
	let intervalId = null;
	let remainingSeconds = 0;

	function formatTime(totalSeconds) {
		const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
		const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
		return m + ':' + s;
	}

	function updateDisplay() {
		const el = document.getElementById('pomodoro-timer');
		if (el) el.textContent = formatTime(remainingSeconds);
	}

	function start(durationMinutes = 25) {
		if (intervalId) clearInterval(intervalId);
		remainingSeconds = Math.max(1, Math.floor(durationMinutes * 60));
		updateDisplay();
		intervalId = setInterval(() => {
			remainingSeconds -= 1;
			updateDisplay();
			if (remainingSeconds <= 0) {
				clearInterval(intervalId);
				intervalId = null;
				const panel = document.getElementById('pomodoro-panel');
				if (panel) panel.classList.add('complete');
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
	}

	return { start, pause, reset };
})();

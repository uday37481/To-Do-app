// Feature: Voice Input (UMD-style globals)

window.VoiceInput = (function () {
	let recognizing = false;

	function init() {
		// Placeholder: no-op unless Web Speech API is available
	}

	function start() {
		recognizing = true;
		const status = document.getElementById('voice-status');
		if (status) status.hidden = false;
	}

	function stop() {
		recognizing = false;
		const status = document.getElementById('voice-status');
		if (status) status.hidden = true;
	}

	return { init, start, stop };
})();

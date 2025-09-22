// Feature: Voice Input (UMD-style globals)

window.VoiceInput = (function () {
    let recognizing = false;
    let recognition = null;

    function init() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => showStatus('Listening...');
        recognition.onend = () => hideStatus();
        recognition.onerror = (e) => showStatus('Error: ' + e.error, true);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim();
            if (transcript) {
                addTaskFromVoice(transcript);
                showStatus('Added: "' + transcript + '"', false, 1200);
            }
        };
    }

    function showStatus(msg, isError = false, timeout = 0) {
        const status = document.getElementById('voice-status');
        const text = status?.querySelector('.voice-text');
        if (status && text) {
            text.textContent = msg;
            status.hidden = false;
            status.style.background = isError ? '#ff5252' : '#ff6b6b';
            if (timeout) setTimeout(() => { status.hidden = true; }, timeout);
        }
    }

    function hideStatus() {
        const status = document.getElementById('voice-status');
        if (status) status.hidden = true;
    }

    function start() {
        if (!recognition) return;
        recognizing = true;
        recognition.start();
    }

    function stop() {
        if (!recognition) return;
        recognizing = false;
        recognition.stop();
    }

    function addTaskFromVoice(text) {
        const input = document.getElementById('todo-input');
        if (!input) return;
        input.value = text;
        const addBtn = document.getElementById('add-btn');
        if (addBtn) addBtn.click();
    }

    // UI button wiring
    document.addEventListener('DOMContentLoaded', () => {
        init();
        const btn = document.getElementById('voice-input-btn');
        const stopBtn = document.getElementById('stop-voice');
        if (btn) btn.onclick = () => start();
        if (stopBtn) stopBtn.onclick = () => stop();
    });

    return { init, start, stop };
})();

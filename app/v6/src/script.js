document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    const state = {
        mood: 'friendly',
        energy: 5,
        spookiness: 2,
    };

    // --- DOM ELEMENTS ---
    const ghost = document.getElementById('ghost');
    const mouth = document.getElementById('mouth');
    const shadow = document.getElementById('shadow');
    const currentMoodDisplay = document.getElementById('current-mood');
    const currentEnergyDisplay = document.getElementById('current-energy');
    
    // --- AUDIO ---
    let audioContext;
    let masterGain;
    const activeSources = [];

    function initAudio() {
        if (!audioContext) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                masterGain = audioContext.createGain();
                masterGain.gain.value = 0.7; // Global volume
                masterGain.connect(audioContext.destination);
            } catch (e) {
                console.error("Web Audio API is not supported in this browser");
            }
        }
    }

    function playSound(type) {
        if (!audioContext) return;

        // Stop any previous long sounds
        activeSources.forEach(source => source.stop());
        activeSources.length = 0;

        let source;
        const now = audioContext.currentTime;

        switch (type) {
            case 'hello':
                // Two simple tones
                const osc1 = audioContext.createOscillator();
                const osc2 = audioContext.createOscillator();
                osc1.type = 'sine';
                osc2.type = 'sine';
                osc1.frequency.setValueAtTime(440, now);
                osc2.frequency.setValueAtTime(554.37, now + 0.2);
                
                const gain = audioContext.createGain();
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(1, now + 0.05);
                gain.gain.linearRampToValueAtTime(0, now + 0.4);

                osc1.connect(gain);
                osc2.connect(gain);
                gain.connect(masterGain);
                osc1.start(now);
                osc2.start(now + 0.2);
                osc1.stop(now + 0.2);
                osc2.stop(now + 0.4);
                break;

            case 'boo':
                const booOsc = audioContext.createOscillator();
                const booGain = audioContext.createGain();
                booOsc.type = 'sawtooth';
                booOsc.frequency.setValueAtTime(150, now);
                booOsc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
                booGain.gain.setValueAtTime(0, now);
                booGain.gain.linearRampToValueAtTime(1, now + 0.05);
                booGain.gain.linearRampToValueAtTime(0, now + 0.5);
                
                booOsc.connect(booGain);
                booGain.connect(masterGain);
                booOsc.start(now);
                booOsc.stop(now + 0.5);
                break;
                
            case 'wind':
            case 'whisper':
                source = audioContext.createBufferSource();
                const bufferSize = audioContext.sampleRate * 2; // 2 seconds
                const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1; // White noise
                }
                source.buffer = buffer;

                const filter = audioContext.createBiquadFilter();
                filter.type = type === 'wind' ? 'lowpass' : 'bandpass';
                filter.frequency.value = type === 'wind' ? 400 : 1000;
                filter.Q.value = type === 'wind' ? 5 : 10;

                source.connect(filter);
                filter.connect(masterGain);
                source.start(now);
                activeSources.push(source); // So it can be stopped
                break;
        }
    }


    // --- CORE FUNCTIONS ---
    function updateAppearance() {
        if (state.energy < 3) state.mood = 'tired';
        else if (state.spookiness > 6) state.mood = 'spooky';
        else if (state.energy > 7) state.mood = 'playful';
        else state.mood = 'friendly';
        
        ghost.classList.toggle('spooky-mode', state.spookiness > 5);
        
        const mouthHeight = 2 + Math.floor(state.energy / 2);
        const mouthWidth = 15 + state.energy;
        mouth.style.height = `${mouthHeight}px`;
        mouth.style.width = `${mouthWidth}px`;
        mouth.style.opacity = state.energy === 0 ? '0' : '1';

        ghost.parentElement.style.animationDuration = `${10 - state.energy}s`;
        shadow.style.width = `${120 - (state.energy * 5)}px`;
        shadow.style.opacity = `${0.7 - (state.energy * 0.04)}`;
        
        currentMoodDisplay.textContent = state.mood;
        currentEnergyDisplay.textContent = state.energy;
    }
    
    // Tap interaction
    ghost.addEventListener('click', () => {
        if (ghost.classList.contains('jiggle')) return;
        ghost.classList.add('jiggle');
        ghost.addEventListener('animationend', () => {
            ghost.classList.remove('jiggle');
        }, { once: true });
    });


    // --- CONTROLS ---
    // Modal
    const settingsModal = document.getElementById('settings-modal');
    const settingsToggle = document.getElementById('settings-toggle');
    const closeModalBtn = document.getElementById('close-modal-btn');
    settingsToggle.addEventListener('click', () => settingsModal.classList.add('open'));
    closeModalBtn.addEventListener('click', () => settingsModal.classList.remove('open'));

    // Sliders
    document.getElementById('energy-slider').addEventListener('input', (e) => {
        state.energy = parseInt(e.target.value, 10);
        updateAppearance();
    });
    document.getElementById('spooky-slider').addEventListener('input', (e) => {
        state.spookiness = parseInt(e.target.value, 10);
        updateAppearance();
    });
    
    // On-screen buttons
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            initAudio(); // Initialize audio on first user interaction
            const action = e.target.dataset.action;
            if (action) handleAction(action);

            const sound = e.target.dataset.sound;
            if (sound) playSound(sound);
        });
    });

    function handleAction(action) {
        switch(action) {
            case 'chat':
                // Add chat logic here if needed
                break;
            case 'spooky':
                // Add visual spooky effect here
                break;
            // Add other actions...
        }
    }

    // --- INITIALIZATION ---
    updateAppearance();
});

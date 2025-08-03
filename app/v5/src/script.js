document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    const state = {
        mood: 'friendly',
        energy: 5,
        spookiness: 2,
        isAnimating: false,
    };

    // --- DOM ELEMENTS ---
    const ghost = document.getElementById('ghost');
    const leftEye = document.getElementById('left-eye');
    const rightEye = document.getElementById('right-eye');
    const mouth = document.getElementById('mouth');
    const eyes = document.querySelector('.eyes');
    const shadow = document.querySelector('.shadow');
    const sparklesContainer = document.getElementById('sparkles-container');

    // UI Elements
    const currentStateDisplay = document.getElementById('current-state');
    const currentMoodDisplay = document.getElementById('current-mood');
    const currentEnergyDisplay = document.getElementById('current-energy');
    const chatBubble = document.getElementById('chat-bubble');

    // Modal & Controls
    const settingsModal = document.getElementById('settings-modal');
    const settingsToggle = document.getElementById('settings-toggle');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const energySlider = document.getElementById('energy-slider');
    const spookySlider = document.getElementById('spooky-slider');
    const controlButtons = document.querySelectorAll('.control-btn');
    const audioButtons = document.querySelectorAll('[data-sound]');

    // --- CHAT MESSAGES ---
    const chatMessages = {
        friendly: ["Hi there! ✨", "Isn't it a lovely night?", "I'm Bogart, the friendly ghost.", "Wanna float around?"],
        playful: ["Catch me if you can!", "Let's play a game!", "Whee!", "This is fun!"],
        spooky: ["Boo! 👻", "The shadows are calling...", "Do you hear that?", "You can't see me..."],
        tired: ["I'm feeling a bit transparent...", "Need to... rest...", "So sleepy..."],
    };

    // --- CORE FUNCTIONS ---

    function updateAppearance() {
        // Update mood based on energy and spookiness
        if (state.energy < 3) {
            state.mood = 'tired';
        } else if (state.spookiness > 6) {
            state.mood = 'spooky';
        } else if (state.energy > 7) {
            state.mood = 'playful';
        } else {
            state.mood = 'friendly';
        }
        
        // Update ghost color and effects based on spookiness
        ghost.classList.toggle('spooky-mode', state.spookiness > 5);
        
        // Update eye and mouth size based on energy
        const eyeSize = 12 + state.energy; // 12px to 22px
        leftEye.style.height = `${eyeSize}px`;
        rightEye.style.height = `${eyeSize}px`;

        const mouthHeight = 2 + Math.floor(state.energy / 2);
        mouth.style.height = `${mouthHeight}px`;
        mouth.style.transform = `translateX(-50%) scaleX(${1 + state.energy / 20})`;

        // Update float animation speed
        ghost.parentElement.style.animationDuration = `${10 - state.energy}s`;

        // Update shadow based on energy (higher energy = more floaty = smaller shadow)
        shadow.style.width = `${140 - (state.energy * 5)}px`;
        shadow.style.opacity = `${0.7 - (state.energy * 0.04)}`;

        // Update UI display
        currentMoodDisplay.textContent = state.mood;
        currentEnergyDisplay.textContent = state.energy;
    }
    
    // --- INTERACTIVITY ---

    // Eye Tracking
    window.addEventListener('mousemove', (e) => {
        const rect = ghost.getBoundingClientRect();
        const ghostX = rect.left + rect.width / 2;
        const ghostY = rect.top + rect.height / 2;

        const deltaX = e.clientX - ghostX;
        const deltaY = e.clientY - ghostY;
        
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.min(6, Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 0.05);

        const eyeMoveX = Math.cos(angle) * distance;
        const eyeMoveY = Math.sin(angle) * distance;

        eyes.style.transform = `translate(${eyeMoveX}px, ${eyeMoveY}px)`;
    });

    // Show Chat Message
    function showChatMessage() {
        if (chatBubble.classList.contains('show')) return;

        const messages = chatMessages[state.mood] || chatMessages.friendly;
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        chatBubble.textContent = message;
        chatBubble.classList.add('show');
        
        setTimeout(() => {
            chatBubble.classList.remove('show');
        }, 3000);
    }

    // --- MODAL & CONTROLS ---

    function toggleModal() {
        settingsModal.classList.toggle('open');
    }

    settingsToggle.addEventListener('click', toggleModal);
    closeModalBtn.addEventListener('click', toggleModal);

    energySlider.addEventListener('input', (e) => {
        state.energy = parseInt(e.target.value, 10);
        updateAppearance();
    });

    spookySlider.addEventListener('input', (e) => {
        state.spookiness = parseInt(e.target.value, 10);
        updateAppearance();
    });
    
    controlButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action) handleAction(action);

            const sound = e.target.dataset.sound;
            if (sound) handleSound(sound);
        });
    });

    // --- ACTIONS & ANIMATIONS ---

    function handleAction(action) {
        if (state.isAnimating) return;
        state.isAnimating = true;

        switch (action) {
            case 'chat':
                showChatMessage();
                break;
            case 'sparkle':
                createSparkles(20);
                break;
            case 'wobble':
            case 'zoom':
            case 'spooky':
            case 'pulse':
                ghost.classList.add(action);
                ghost.addEventListener('animationend', () => {
                    ghost.classList.remove(action);
                }, { once: true });
                break;
        }

        // Reset animation flag
        setTimeout(() => { state.isAnimating = false; }, 1000);
    }
    
    function createSparkles(count) {
        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            const size = Math.random() * 6 + 2;
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;
            sparkle.style.animationDelay = `${Math.random() * 0.5}s`;
            sparklesContainer.appendChild(sparkle);

            sparkle.addEventListener('animationend', () => {
                sparkle.remove();
            });
        }
    }
    
    // --- AUDIO ---
    
    function handleSound(sound) {
        const allAudio = document.querySelectorAll('audio');
        if (sound === 'stop') {
            allAudio.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
            return;
        }
        
        const audioElement = document.getElementById(`audio-${sound}`);
        if (audioElement) {
            // NOTE: This will fail if the src is '#'. 
            // Replace '#' in index.html with valid paths to your sound files.
            audioElement.currentTime = 0;
            audioElement.play().catch(e => console.error(`Could not play sound: ${sound}. Is the src path correct?`, e));
        } else {
            console.warn(`Audio element for '${sound}' not found.`);
        }
    }

    // --- INITIALIZATION ---
    updateAppearance();
    setTimeout(showChatMessage, 1500); // Welcome message
});

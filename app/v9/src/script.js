document.addEventListener('DOMContentLoaded', () => {
    // --- STABLE VIEWPORT HEIGHT ---
    const setAppHeight = () => {
        document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    window.addEventListener('resize', setAppHeight);
    setAppHeight();

    // --- STATE & DOM ELEMENTS ---
    const state = { mood: 'friendly', energy: 5, spookiness: 5 };
    const DOMElements = {
        container: document.getElementById('container'),
        ghost: document.getElementById('ghost'),
        bodyColorFill: document.getElementById('body-color-fill'),
        eyes: document.querySelectorAll('.eye'),
        mouth: document.getElementById('mouth'),
        shadow: document.getElementById('shadow'),
        sparkleContainer: document.getElementById('sparkle-container'),
        chatBubble: document.getElementById('chat-bubble'),
        currentMoodDisplay: document.getElementById('current-mood'),
        currentEnergyDisplay: document.getElementById('current-energy'),
        ghostContainer: document.getElementById('ghost-container')
    };
    
    // --- NEW AUDIO SYSTEM ---
    const playSound = (soundName) => {
        // Creates a new audio object each time, allowing for overlaps
        const audio = new Audio(`./static/${soundName}.mp3`);
        audio.play().catch(error => console.error(`Error playing sound: ${soundName}`, error));
    };

    // --- CORE LOGIC ---
    const CHAT_MESSAGES = {
        friendly: ["Hi there! ✨", "Isn't it a lovely night?", "I'm Bogart!", "Wanna float around?"],
        playful: ["Catch me if you can!", "Whee!", "This is fun!", "Boop!"],
        spooky: ["Boo! 👻", "The shadows are calling...", "Do you hear that?", "I see you..."],
        tired: ["I'm feeling a bit transparent...", "Need to... rest...", "*yawn*", "So sleepy..."],
    };
    
    function updateAppearance() {
        // Determine mood
        if (state.energy < 3) state.mood = 'tired';
        else if (state.spookiness > 7) state.mood = 'spooky';
        else if (state.energy > 7) state.mood = 'playful';
        else state.mood = 'friendly';
        DOMElements.currentMoodDisplay.textContent = state.mood;
        DOMElements.currentEnergyDisplay.textContent = state.energy;

        // Energy effects
        const energyRatio = state.energy / 10;
        DOMElements.ghostContainer.style.setProperty('--idle-speed', `${10 - energyRatio * 6}s`); // Faster animation
        DOMElements.ghost.style.setProperty('--idle-scale', `${1 + energyRatio * 0.1}`); // Wackier movement

        // Spookiness effects
        const spookyRatio = state.spookiness / 10;
        const color = `hsl(${250 + spookyRatio * 40}, ${70 + spookyRatio * 30}%, ${90 - spookyRatio * 40}%)`;
        DOMElements.bodyColorFill.style.setProperty('--ghost-color', color);
        DOMElements.eyes.forEach(eye => {
            eye.style.boxShadow = `0 0 ${spookyRatio * 20}px ${spookyRatio * 5}px rgba(255, 0, 50, ${spookyRatio * 0.8})`;
        });
    }

    function triggerAction(actionName) {
        const ghost = DOMElements.ghost;
        if (ghost.classList.contains(actionName)) return;
        ghost.classList.add(actionName);
        
        // Play sound associated with action
        const soundMap = { 'pulse': 'pulse', 'spooky': 'glitch', 'sparkle': 'sparkle' };
        if (soundMap[actionName]) playSound(soundMap[actionName]);

        const animatedElement = (actionName === 'pulse') ? DOMElements.bodyColorFill : ghost;
        animatedElement.addEventListener('animationend', () => {
            ghost.classList.remove(actionName);
        }, { once: true });
    }
    
    function showChatMessage() {
        const bubble = DOMElements.chatBubble;
        if (bubble.classList.contains('show')) return;
        const messages = CHAT_MESSAGES[state.mood];
        bubble.textContent = messages[Math.floor(Math.random() * messages.length)];
        bubble.classList.add('show');
        setTimeout(() => bubble.classList.remove('show'), 2500);
    }

    function createSparkles(count = 25) {
        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            const size = Math.random() * 15 + 5;
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;
            sparkle.style.animationDelay = `${Math.random() * 0.2}s`;
            DOMElements.sparkleContainer.appendChild(sparkle);
            sparkle.addEventListener('animationend', () => sparkle.remove());
        }
    }

    // --- IDLE MODE LOGIC ---
    let idleTimer;
    let randomEventInterval;

    function enterIdleMode() {
        DOMElements.container.classList.add('is-idle');
        const randomActions = [
            () => { state.energy = Math.floor(Math.random() * 11); updateAppearance(); },
            () => { state.spookiness = Math.floor(Math.random() * 11); updateAppearance(); },
            showChatMessage,
            () => triggerAction('pulse'),
        ];
        
        const triggerRandomEvent = () => {
            const randomAction = randomActions[Math.floor(Math.random() * randomActions.length)];
            randomAction();
            // Reschedule with jitter
            clearInterval(randomEventInterval);
            randomEventInterval = setInterval(triggerRandomEvent, 2000 + Math.random() * 2000);
        };
        randomEventInterval = setInterval(triggerRandomEvent, 2000 + Math.random() * 2000);
    }

    function exitIdleMode() {
        if (DOMElements.container.classList.contains('is-idle')) {
            DOMElements.container.classList.remove('is-idle');
            clearInterval(randomEventInterval);
        }
    }

    function resetIdleTimer() {
        exitIdleMode();
        clearTimeout(idleTimer);
        idleTimer = setTimeout(enterIdleMode, 3000);
    }

    // --- EVENT LISTENERS ---
    ['click', 'touchstart', 'input'].forEach(eventType => {
        window.addEventListener(eventType, resetIdleTimer);
    });
    
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.action;
            const sound = e.currentTarget.dataset.sound;
            if (action) {
                if (action === 'chat') showChatMessage();
                else if (action === 'sparkle') createSparkles();
                else triggerAction(action);
            }
            if (sound) playSound(sound);
        });
    });
    
    document.getElementById('settings-toggle').addEventListener('click', () => {
        document.getElementById('settings-modal').classList.add('open');
    });
    document.getElementById('close-modal-btn').addEventListener('click', () => {
        document.getElementById('settings-modal').classList.remove('open');
    });

    document.getElementById('energy-slider').addEventListener('input', e => { state.energy = parseInt(e.target.value, 10); updateAppearance(); });
    document.getElementById('spooky-slider').addEventListener('input', e => { state.spookiness = parseInt(e.target.value, 10); updateAppearance(); });

    // --- INITIALIZATION ---
    updateAppearance();
    resetIdleTimer();
});

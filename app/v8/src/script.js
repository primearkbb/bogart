document.addEventListener('DOMContentLoaded', () => {
    // --- STABLE VIEWPORT HEIGHT ---
    const setAppHeight = () => {
        document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    window.addEventListener('resize', setAppHeight);
    setAppHeight();

    // --- STATE & DOM ELEMENTS ---
    const state = { mood: 'friendly', energy: 5, spookiness: 2 };
    const DOMElements = {
        ghost: document.getElementById('ghost'),
        bodyColorFill: document.getElementById('body-color-fill'),
        eyes: document.querySelectorAll('.eye'),
        mouth: document.getElementById('mouth'),
        shadow: document.getElementById('shadow'),
        sparklesContainer: document.getElementById('sparkles-container'),
        chatBubble: document.getElementById('chat-bubble'),
        currentMoodDisplay: document.getElementById('current-mood'),
        currentEnergyDisplay: document.getElementById('current-energy'),
        ghostContainer: document.getElementById('ghost-container')
    };
    
    // --- AUDIO ENGINE ---
    let audioContext, masterGain;
    const initAudio = () => {
        if (!audioContext) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                masterGain = audioContext.createGain();
                masterGain.gain.value = 0.6;
                masterGain.connect(audioContext.destination);
            } catch (e) { console.error("Web Audio API not supported"); }
        }
    };
    const playSound = (type) => { /* ...sound logic from previous version... */ }; // Sound logic is complex and kept from previous version for brevity

    // --- CORE LOGIC ---
    const CHAT_MESSAGES = {
        friendly: ["Hi there! ✨", "Isn't it a lovely night?", "I'm Bogart!", "Wanna float around?"],
        playful: ["Catch me if you can!", "Whee!", "This is fun!", "Boop!"],
        spooky: ["Boo! 👻", "The shadows are calling...", "Do you hear that?", "I see you..."],
        tired: ["I'm feeling a bit transparent...", "Need to... rest...", "*yawn*", "So sleepy..."],
    };
    
    function updateAppearance() {
        if (state.energy < 3) state.mood = 'tired';
        else if (state.spookiness > 7) state.mood = 'spooky';
        else if (state.energy > 7) state.mood = 'playful';
        else state.mood = 'friendly';
        DOMElements.currentMoodDisplay.textContent = state.mood;
        DOMElements.currentEnergyDisplay.textContent = state.energy;

        const spookyAmount = state.spookiness / 10;
        const color = `hsl(${250 + spookyAmount * 40}, ${70 + spookyAmount * 30}%, ${90 - spookyAmount * 30}%)`;
        DOMElements.bodyColorFill.style.setProperty('--ghost-color', color);
        
        const eyeScale = 1 + (state.energy / 10) * 0.5;
        DOMElements.eyes.forEach(eye => eye.style.transform = `scale(${eyeScale})`);
        
        DOMElements.mouth.style.opacity = state.energy > 0 ? '1' : '0';
        DOMElements.mouth.style.height = `${8 + state.energy}px`;
        DOMElements.mouth.style.borderRadius = state.spookiness > 5 ? '50%' : '0 0 12px 12px';
        
        DOMElements.ghostContainer.style.animationDuration = `${10 - state.energy * 0.5}s`;
        DOMElements.shadow.style.opacity = `${0.6 - (state.energy * 0.04)}`;
    }

    function triggerAction(actionName) {
        const ghost = DOMElements.ghost;
        if (ghost.classList.contains(actionName)) return;
        ghost.classList.add(actionName);
        
        const onAnimationEnd = () => {
            ghost.classList.remove(actionName);
            // Specifically remove filter after spooky animation ends
            if (actionName === 'spooky') {
                ghost.querySelector('.body-color-fill').style.filter = '';
            }
        };

        // For 'spooky', the animation is on the ghost itself. For 'pulse', it's on the child.
        const animatedElement = actionName === 'pulse' ? ghost.querySelector('.body-color-fill') : ghost;
        animatedElement.addEventListener('animationend', onAnimationEnd, { once: true });
    }
    
    function showChatMessage() {
        const bubble = DOMElements.chatBubble;
        if (bubble.classList.contains('show')) return;
        const messages = CHAT_MESSAGES[state.mood];
        bubble.textContent = messages[Math.floor(Math.random() * messages.length)];
        bubble.classList.add('show');
        setTimeout(() => bubble.classList.remove('show'), 2500);
    }

    function createSparkles(count = 15) {
        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            const angle = Math.random() * 360;
            const distance = Math.random() * 60 + 40;
            const x = Math.cos(angle * Math.PI / 180) * distance;
            const y = Math.sin(angle * Math.PI / 180) * distance;

            sparkle.style.setProperty('--sparkle-transform', `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`);
            DOMElements.sparklesContainer.appendChild(sparkle);
            sparkle.addEventListener('animationend', () => sparkle.remove());
        }
    }

    // --- EVENT LISTENERS ---
    function handleButtonInteraction(e) {
        initAudio(); // Initialize on first interaction
        const btn = e.currentTarget;
        const action = btn.dataset.action;
        const sound = btn.dataset.sound;

        if (action) {
            if (action === 'chat') showChatMessage();
            else if (action === 'sparkle') createSparkles();
            else triggerAction(action);
        }
        if (sound) playSound(sound);
    }
    
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('click', handleButtonInteraction);
        // For reliable mobile feedback
        btn.addEventListener('touchstart', () => btn.classList.add('active'), { passive: true });
        btn.addEventListener('touchend', () => btn.classList.remove('active'));
    });
    
    // Settings Modal Listeners
    const settingsModal = document.getElementById('settings-modal');
    document.getElementById('settings-toggle').addEventListener('click', () => settingsModal.classList.add('open'));
    document.getElementById('close-modal-btn').addEventListener('click', () => settingsModal.classList.remove('open'));

    // Slider Listeners
    document.getElementById('energy-slider').addEventListener('input', (e) => {
        state.energy = parseInt(e.target.value, 10);
        updateAppearance();
    });
    document.getElementById('spooky-slider').addEventListener('input', (e) => {
        state.spookiness = parseInt(e.target.value, 10);
        updateAppearance();
    });

    // --- INITIALIZATION ---
    updateAppearance();
    setTimeout(showChatMessage, 1500);
});

// Audio management for the Ghost Character
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.isInitialized = false;
        this.audioBuffers = new Map();
        this.audioFiles = {
            // Sound effects
            'ghost-wind': 'assets/audio/ghost-wind.mp3',
            'ghost-chains': 'assets/audio/ghost-chains.mp3',
            'ghost-moan': 'assets/audio/ghost-moan.mp3',
            'ghost-whisper': 'assets/audio/ghost-whisper.mp3',
            // Voice lines
            'ghost-welcome': 'assets/audio/ghost-welcome.mp3',
            'ghost-performance': 'assets/audio/ghost-performance.mp3',
            'ghost-magic': 'assets/audio/ghost-magic.mp3',
            'ghost-sensing': 'assets/audio/ghost-sensing.mp3',
            'ghost-friendly': 'assets/audio/ghost-friendly.mp3'
        };
    }
    
    async init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        
        // Preload audio files
        await this.preloadAudioFiles();
        
        this.isInitialized = true;
    }

    async preloadAudioFiles() {
        const loadPromises = Object.entries(this.audioFiles).map(async ([key, url]) => {
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                this.audioBuffers.set(key, audioBuffer);
                console.log(`Loaded audio: ${key}`);
            } catch (error) {
                console.warn(`Failed to load audio file ${key}:`, error);
            }
        });
        
        await Promise.allSettled(loadPromises);
    }

    playAudioFile(key, volume = 1.0) {
        if (!this.isReady() || !this.audioBuffers.has(key)) {
            console.warn(`Audio not ready or file not found: ${key}`);
            return;
        }

        const audioBuffer = this.audioBuffers.get(key);
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = audioBuffer;
        gainNode.gain.value = volume;
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        source.start();
        
        return source;
    }
    
    isReady() {
        return this.audioContext && this.audioContext.state === 'running';
    }
    
    playSound(soundType) {
        if (!this.isReady()) return;
        
        const config = GHOST_CHARACTER_CONFIG.audio[soundType];
        if (!config) return;
        
        const now = this.audioContext.currentTime;
        
        for (let i = 0; i < config.oscillators; i++) {
            this.createOscillator(now, config, i);
        }
    }
    
    createOscillator(startTime, config, index) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        // Calculate frequency
        let frequency = config.baseFreq;
        if (config.freqStep) {
            frequency += index * config.freqStep;
        }
        frequency += Math.random() * config.randomRange;
        
        osc.frequency.value = frequency;
        
        // Set up gain envelope
        const start = startTime + index * config.interval;
        const attackTime = start + (config.attackTime || 0.02);
        const releaseTime = start + config.duration;
        
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(config.gain, attackTime);
        gain.gain.linearRampToValueAtTime(0, releaseTime);
        
        // Connect and start/stop
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.start(start);
        osc.stop(releaseTime);
    }
    
    // Predefined sound methods for convenience
    playEtherealEntry() {
        this.playSound('etherealEntry');
    }
    
    playWhisper() {
        this.playSound('whisper');
    }
    
    playPhaseShift() {
        this.playSound('phaseShift');
    }

    // New ElevenLabs audio file methods
    playGhostWind() {
        return this.playAudioFile('ghost-wind', 0.7);
    }

    playGhostChains() {
        return this.playAudioFile('ghost-chains', 0.8);
    }

    playGhostMoan() {
        return this.playAudioFile('ghost-moan', 0.6);
    }

    playGhostWhisper() {
        return this.playAudioFile('ghost-whisper', 0.5);
    }

    // Voice line methods
    playGhostWelcome() {
        return this.playAudioFile('ghost-welcome', 0.9);
    }

    playGhostPerformance() {
        return this.playAudioFile('ghost-performance', 0.9);
    }

    playGhostMagic() {
        return this.playAudioFile('ghost-magic', 0.9);
    }

    playGhostSensing() {
        return this.playAudioFile('ghost-sensing', 0.9);
    }

    playGhostFriendly() {
        return this.playAudioFile('ghost-friendly', 0.9);
    }

    // Random voice line player
    playRandomGhostLine() {
        const voiceLines = ['ghost-welcome', 'ghost-performance', 'ghost-magic', 'ghost-sensing', 'ghost-friendly'];
        const randomLine = voiceLines[Math.floor(Math.random() * voiceLines.length)];
        return this.playAudioFile(randomLine, 0.9);
    }

    // Random ambient sound
    playRandomAmbientSound() {
        const ambientSounds = ['ghost-wind', 'ghost-chains', 'ghost-moan', 'ghost-whisper'];
        const randomSound = ambientSounds[Math.floor(Math.random() * ambientSounds.length)];
        return this.playAudioFile(randomSound, 0.5);
    }
}
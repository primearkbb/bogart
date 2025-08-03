// Audio management for the Ghost Character
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.isInitialized = false;
        this.audioElements = new Map();
        this.playingAudio = new Set(); // Track currently playing audio to prevent overlaps
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
        
        // Preload audio files using HTML5 Audio elements
        this.preloadAudioElements();
        
        this.isInitialized = true;
    }

    preloadAudioElements() {
        Object.entries(this.audioFiles).forEach(([key, url]) => {
            try {
                const audio = new Audio();
                audio.preload = 'auto';
                audio.volume = 0.8;
                audio.src = url;
                
                // Handle loading events
                audio.addEventListener('canplaythrough', () => {
                    console.log(`Audio loaded: ${key}`);
                });
                
                audio.addEventListener('error', (error) => {
                    console.warn(`Failed to load audio file ${key}:`, error);
                });
                
                this.audioElements.set(key, audio);
            } catch (error) {
                console.warn(`Failed to create audio element for ${key}:`, error);
            }
        });
        
        console.log(`Created ${this.audioElements.size} audio elements out of ${Object.keys(this.audioFiles).length}`);
    }

    playAudioFile(key, volume = 1.0) {
        // Prevent audio overlap
        if (this.playingAudio.has(key)) {
            console.log(`Audio ${key} already playing, skipping`);
            return null;
        }

        if (!this.audioElements.has(key)) {
            console.warn(`Audio file not found: ${key}`);
            // Fallback to generated sound
            this.playWhisper();
            return null;
        }

        const audio = this.audioElements.get(key);
        
        // Mark as playing
        this.playingAudio.add(key);
        
        // Reset audio to beginning and set volume
        audio.currentTime = 0;
        audio.volume = Math.max(0, Math.min(1, volume));
        
        // Add ended event listener to remove from playing set
        const onEnded = () => {
            this.playingAudio.delete(key);
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('pause', onEnded);
            audio.removeEventListener('error', onEnded);
        };
        
        audio.addEventListener('ended', onEnded, { once: true });
        audio.addEventListener('pause', onEnded, { once: true });
        audio.addEventListener('error', onEnded, { once: true });
        
        // Play the audio
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log(`Playing audio: ${key}`);
            }).catch(error => {
                console.warn(`Failed to play audio ${key}:`, error);
                this.playingAudio.delete(key); // Remove from playing set on error
                // Fallback to generated sound
                this.playWhisper();
            });
        }
        
        return audio;
    }
    
    isReady() {
        return this.isInitialized && this.audioElements.size > 0;
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
        console.log(`Playing random ghost line: ${randomLine}`);
        return this.playAudioFile(randomLine, 0.9);
    }

    // Random ambient sound
    playRandomAmbientSound() {
        const ambientSounds = ['ghost-wind', 'ghost-chains', 'ghost-moan', 'ghost-whisper'];
        const randomSound = ambientSounds[Math.floor(Math.random() * ambientSounds.length)];
        return this.playAudioFile(randomSound, 0.5);
    }
}
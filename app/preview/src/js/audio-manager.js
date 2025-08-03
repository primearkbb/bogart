// Audio management for the Devil Imp
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.isInitialized = false;
    }
    
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        this.isInitialized = true;
    }
    
    isReady() {
        return this.audioContext && this.audioContext.state === 'running';
    }
    
    playSound(soundType) {
        if (!this.isReady()) return;
        
        const config = DEVIL_IMP_CONFIG.audio[soundType];
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
    playDemonicEntry() {
        this.playSound('demonicEntry');
    }
    
    playCackle() {
        this.playSound('cackle');
    }
    
    playViewportAttack() {
        this.playSound('viewportAttack');
    }
}
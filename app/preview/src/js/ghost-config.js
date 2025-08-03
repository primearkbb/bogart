// Configuration constants for the Ghost Character application
const GHOST_CHARACTER_CONFIG = {
    // Rendering settings
    engine: {
        antialias: true,
        preserveDrawingBuffer: true,
        stencil: true
    },
    
    // Scene settings
    scene: {
        clearColor: { r: 0.02, g: 0.05, b: 0.12 }, // Deep ethereal blue
        fogStart: 8,
        fogEnd: 25
    },
    
    // Camera settings - positioned for viewport-contained stationary character
    camera: {
        position: { x: 0, y: 2.5, z: -5 },  // Closer to better frame the character
        target: { x: 0, y: 1.5, z: 0 }      // Slightly higher target for better view
    },
    
    // Lighting settings
    lighting: {
        ambient: {
            intensity: 0.4,
            diffuse: { r: 0.6, g: 0.8, b: 1.0 }, // Cool ethereal light
            groundColor: { r: 0.1, g: 0.2, b: 0.3 }
        },
        ethereal: {
            intensity: 2.0,
            range: 15,
            diffuse: { r: 0.7, g: 0.9, b: 1.0 } // Ghostly blue-white glow
        }
    },
    
    // Character settings
    character: {
        size: {
            headDiameter: 1.4,
            bodyDiameter: 1.2,
            eyeDiameter: 0.3,
            pupilDiameter: 0.15
        },
        materials: {
            ghost: {
                diffuse: { r: 0.9, g: 0.95, b: 1.0 }, // Ethereal white-blue
                specular: { r: 0.8, g: 0.9, b: 1.0 },
                emissive: { r: 0.2, g: 0.3, b: 0.5 }, // Soft glow
                specularPower: 128,
                roughness: 0.1,
                alpha: 0.7 // Translucent
            },
            eye: {
                diffuse: { r: 0.6, g: 0.8, b: 1.0 }, // Ethereal blue eyes
                emissive: { r: 0.4, g: 0.6, b: 0.9 },
                specularPower: 256
            },
            dark: {
                diffuse: { r: 0.1, g: 0.15, b: 0.2 }, // Dark ethereal features
                specular: { r: 0.3, g: 0.4, b: 0.5 },
                specularPower: 64
            }
        }
    },
    
    // AI behavior settings
    ai: {
        moods: ['ethereal', 'mysterious', 'gentle', 'playful', 'melancholic', 'curious'],
        activities: ['greeting_audience', 'fourth_wall_break', 'performance_trick', 'audience_engagement', 'showing_off', 'observing', 'drifting', 'performing', 'phase_interaction'],
        timers: {
            moodChangeMin: 12,
            moodChangeMax: 20,
            activityChangeMin: 4,
            activityChangeMax: 10,
            speechMin: 8,
            speechMax: 18,
            blinkMin: 3,
            blinkMax: 7
        },
        movement: {
            driftRadius: 12,
            speed: 1.5,
            floatIntensity: 0.25, // More pronounced floating
            gentleFloatIntensity: 0.15
        }
    },
    
    // Particle system settings
    particles: {
        count: 1200,
        emitRate: 200,
        minSize: 0.03,
        maxSize: 0.3,
        minLifeTime: 0.8,
        maxLifeTime: 2.5,
        colors: {
            start: { r: 0.8, g: 0.9, b: 1.0, a: 0.8 }, // Ethereal white-blue
            end: { r: 0.4, g: 0.6, b: 0.9, a: 0.3 }     // Fading blue
        }
    },
    
    // Speech timing
    speech: {
        displayDuration: 4000, // Slightly longer for contemplative nature
        bubbleOffset: 120
    },
    
    // Audio settings (ethereal tones instead of demonic)
    audio: {
        etherealEntry: {
            oscillators: 6,
            baseFreq: 200,
            freqStep: 100,
            randomRange: 80,
            gain: 0.08, // Softer than demonic
            duration: 0.4,
            interval: 0.2
        },
        whisper: {
            oscillators: 4,
            baseFreq: 150,
            freqStep: 50,
            randomRange: 60,
            gain: 0.06,
            duration: 0.2,
            interval: 0.15
        },
        phaseShift: {
            oscillators: 8,
            baseFreq: 100,
            randomRange: 150,
            gain: 0.1,
            duration: 0.3,
            interval: 0.1
        }
    }
};
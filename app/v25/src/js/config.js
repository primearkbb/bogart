// Configuration constants for the Devil Imp application
const DEVIL_IMP_CONFIG = {
    // Rendering settings
    engine: {
        antialias: true,
        preserveDrawingBuffer: true,
        stencil: true
    },
    
    // Scene settings
    scene: {
        clearColor: { r: 0.05, g: 0.02, b: 0.08 },
        fogStart: 8,
        fogEnd: 25
    },
    
    // Camera settings
    camera: {
        position: { x: 0, y: 2.5, z: -7 },
        target: { x: 0, y: 1.2, z: 0 }
    },
    
    // Lighting settings
    lighting: {
        ambient: {
            intensity: 0.3,
            diffuse: { r: 0.4, g: 0.2, b: 0.6 },
            groundColor: { r: 0.2, g: 0.1, b: 0.1 }
        },
        fire: {
            intensity: 1.5,
            range: 12,
            diffuse: { r: 1, g: 0.3, b: 0 }
        }
    },
    
    // Character settings
    character: {
        size: {
            headDiameter: 1.4,
            bodyDiameter: 1.2,
            hornHeight: 0.8,
            eyeDiameter: 0.25,
            pupilDiameter: 0.12
        },
        materials: {
            imp: {
                diffuse: { r: 0.9, g: 0.1, b: 0.1 },
                specular: { r: 0.8, g: 0.2, b: 0.2 },
                emissive: { r: 0.3, g: 0.05, b: 0.05 },
                specularPower: 64,
                roughness: 0.3
            },
            eye: {
                diffuse: { r: 1, g: 0.9, b: 0 },
                emissive: { r: 0.8, g: 0.7, b: 0 },
                specularPower: 256
            },
            dark: {
                diffuse: { r: 0.1, g: 0.1, b: 0.1 },
                specular: { r: 0.3, g: 0.3, b: 0.3 },
                specularPower: 128
            }
        }
    },
    
    // AI behavior settings
    ai: {
        moods: ['showoff', 'mischievous', 'angry', 'playful', 'menacing', 'curious'],
        activities: ['greeting_audience', 'fourth_wall_break', 'performance_trick', 'audience_engagement', 'showboating', 'observing', 'prowling', 'performing', 'viewport_interaction'],
        timers: {
            moodChangeMin: 15,
            moodChangeMax: 25,
            activityChangeMin: 5,
            activityChangeMax: 12,
            speechMin: 6,
            speechMax: 15,
            blinkMin: 2,
            blinkMax: 5
        },
        movement: {
            prowlRadius: 10,
            speed: 2,
            floatIntensity: 0.15,
            angryFloatIntensity: 0.3
        }
    },
    
    // Particle system settings
    particles: {
        count: 800,
        emitRate: 150,
        minSize: 0.05,
        maxSize: 0.4,
        minLifeTime: 0.5,
        maxLifeTime: 1.2,
        colors: {
            start: { r: 1, g: 0.6, b: 0, a: 1 },
            end: { r: 1, g: 0.2, b: 0, a: 1 }
        }
    },
    
    // Speech timing
    speech: {
        displayDuration: 3500,
        bubbleOffset: 120
    },
    
    // Audio settings
    audio: {
        demonicEntry: {
            oscillators: 8,
            baseFreq: 100,
            freqStep: 80,
            randomRange: 150,
            gain: 0.15,
            duration: 0.3,
            interval: 0.15
        },
        cackle: {
            oscillators: 6,
            baseFreq: 200,
            freqStep: 60,
            randomRange: 120,
            gain: 0.12,
            duration: 0.15,
            interval: 0.1
        },
        viewportAttack: {
            oscillators: 10,
            baseFreq: 50,
            randomRange: 200,
            gain: 0.2,
            duration: 0.05,
            interval: 0.05
        }
    }
};
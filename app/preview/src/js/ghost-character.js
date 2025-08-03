// Resource cleanup manager
class ResourceManager {
    constructor() {
        this.resources = new Set();
        this.intervals = new Set();
        this.timeouts = new Set();
        this.eventListeners = new Map();
    }
    
    addResource(resource) {
        this.resources.add(resource);
    }
    
    addInterval(id) {
        this.intervals.add(id);
    }
    
    addTimeout(id) {
        this.timeouts.add(id);
    }
    
    addEventListener(element, event, handler) {
        if (!this.eventListeners.has(element)) {
            this.eventListeners.set(element, []);
        }
        this.eventListeners.get(element).push({ event, handler });
    }
    
    cleanup() {
        this.intervals.forEach(id => clearInterval(id));
        this.intervals.clear();
        
        this.timeouts.forEach(id => clearTimeout(id));
        this.timeouts.clear();
        
        this.eventListeners.forEach((listeners, element) => {
            listeners.forEach(({ event, handler }) => {
                element.removeEventListener(event, handler);
            });
        });
        this.eventListeners.clear();
        
        this.resources.forEach(resource => {
            if (resource && typeof resource.dispose === 'function') {
                resource.dispose();
            }
        });
        this.resources.clear();
    }
}

// Performance monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            memory: 0,
            renderTime: 0
        };
        this.startTime = performance.now();
    }
    
    update(engine) {
        if (engine) {
            this.metrics.fps = engine.getFps();
        }
        
        if (performance.memory) {
            this.metrics.memory = performance.memory.usedJSHeapSize / 1024 / 1024;
        }
        
        if (this.metrics.fps < 30) {
            // Low FPS detected - performance adjustments needed
        }
        
        if (this.metrics.memory > 100) {
            // High memory usage detected - cleanup needed
        }
    }
    
    getMetrics() {
        return { ...this.metrics };
    }
}

// Main Ghost Character class that orchestrates all components
class GhostCharacter {
    constructor() {
        this.canvas = document.getElementById("renderCanvas");
        this.engine = null;
        this.scene = null;
        this.camera = null;
        this.characterParts = null;
        this.characterMaterials = null;
        this.particleSystem = null;
        
        // Component managers
        this.audioManager = new AudioManager();
        this.aiController = new AIController();
        this.characterBuilder = null;
        this.advancedCharacterBuilder = null;
        this.resourceManager = new ResourceManager();
        this.performanceMonitor = new PerformanceMonitor();
        
        // Performance optimization flags
        this.performanceMode = 'auto'; // auto, low, high
        this.lowPerformanceMode = false;
        
        // Animation tracking
        this.currentAnimation = null;
        this.isRiggedCharacter = false;
        
        // Render loop time tracking
        this.time = 0;
    }
    
    // Helper method to track timeouts
    setTrackedTimeout(callback, delay) {
        const id = setTimeout(callback, delay);
        this.resourceManager.addTimeout(id);
        return id;
    }
    
    // Helper method to track intervals
    setTrackedInterval(callback, delay) {
        const id = setInterval(callback, delay);
        this.resourceManager.addInterval(id);
        return id;
    }
    
    async init() {
        try {
            this.setupEventListeners();
            await this.createEngine();
            await this.createScene();
            this.startRenderLoop();
            
            // Initial ethereal greeting after dramatic pause
            const greetingTimeout = this.setTrackedTimeout(() => {
                this.speak('greeting_audience');
                this.audioManager.playEtherealEntry();
                // Maybe play welcome voice line (50% chance)
                if (Math.random() < 0.5) {
                    const welcomeTimeout = this.setTrackedTimeout(() => {
                        this.audioManager.playGhostWelcome();
                    }, 3000 + Math.random() * 4000);
                }
                const loadingEl = document.getElementById('loading');
                if (loadingEl) loadingEl.style.display = 'none';
                
                // Show initial performance spotlight
                this.showSpotlight();
            }, 2000);
            
        } catch (error) {
            // Silent error handling in production
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.innerHTML = 'Failed to manifest ghost: Please refresh to try again';
            }
        }
    }
    
    setupEventListeners() {
        // Audio initialization on user interaction
        const initAudio = async () => {
            await this.audioManager.init();
            document.getElementById('info').style.display = 'none';
        };
        
        this.canvas.addEventListener('click', initAudio, { once: true });
        
        // Also enable on any user interaction
        document.addEventListener('click', initAudio, { once: true });
        document.addEventListener('keydown', initAudio, { once: true });
        
        // Handle window resize and orientation changes
        const handleViewportChange = () => {
            if (this.engine) this.engine.resize();
            // Reposition speech bubble to maintain viewport containment
            const speechBubble = document.getElementById('speechBubble');
            if (speechBubble && speechBubble.style.display !== 'none') {
                // Small delay to ensure viewport dimensions are updated
                const resizeTimeout = setTimeout(() => this.positionSpeechBubble(), 100);
                }
        };
        
        window.addEventListener("resize", handleViewportChange);
        window.addEventListener("orientationchange", handleViewportChange);
    }
    
    async createEngine() {
        const config = GHOST_CHARACTER_CONFIG.engine;
        console.log('🔧 Attempting to create Babylon.js engine...');
        console.log('Canvas element:', this.canvas);
        console.log('Canvas dimensions:', this.canvas.width, 'x', this.canvas.height);
        
        // Ensure canvas has proper dimensions
        if (this.canvas.width === 0 || this.canvas.height === 0) {
            this.canvas.width = 800;
            this.canvas.height = 600;
            console.log('⚡ Set default canvas dimensions');
        }
        
        try {
            // Try to create engine with various fallback options
            let engineOptions = [
                { ...config }, // Original config
                { antialias: false, preserveDrawingBuffer: true, stencil: true }, // Reduced config
                { antialias: false, preserveDrawingBuffer: false, stencil: false }, // Minimal config
                { antialias: false, preserveDrawingBuffer: false, stencil: false, powerPreference: "high-performance" }, // Try high performance
                { antialias: false, preserveDrawingBuffer: false, stencil: false, powerPreference: "low-power" }, // Try low power
                { antialias: false, preserveDrawingBuffer: false, stencil: false, failIfMajorPerformanceCaveat: false }, // Allow performance caveats
                {} // Default config
            ];
            
            // Also try different WebGL context types
            const contextTypes = [true, false]; // true = webgl, false = experimental-webgl
            
            for (let contextType of contextTypes) {
                for (let i = 0; i < engineOptions.length; i++) {
                    try {
                        console.log(`🔧 Engine creation attempt ${i + 1} (webgl: ${contextType}) with config:`, engineOptions[i]);
                        this.engine = new BABYLON.Engine(this.canvas, contextType, engineOptions[i]);
                        
                        if (this.engine) {
                            console.log('✅ Babylon.js engine created successfully');
                            console.log('Engine info:', {
                                webgl: this.engine._gl ? 'available' : 'not available',
                                version: this.engine.version,
                                capabilities: this.engine.getCaps()
                            });
                            return;
                        }
                    } catch (engineError) {
                        console.warn(`⚠️ Engine creation attempt ${i + 1} (webgl: ${contextType}) failed:`, engineError.message);
                        continue;
                    }
                }
            }
            
            throw new Error('All engine creation attempts failed - WebGL may not be available on this device/browser');
        } catch (error) {
            console.error('❌ Failed to create Babylon.js engine:', error);
            
            // Show user-friendly error message
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.innerHTML = 'WebGL not supported on this device/browser. Please try a different browser or enable hardware acceleration.';
                loadingElement.style.color = '#ff6666';
            }
            
            throw error;
        }
    }
    
    async createScene() {
        // Create scene
        this.scene = new BABYLON.Scene(this.engine);
        const sceneConfig = GHOST_CHARACTER_CONFIG.scene;
        this.scene.clearColor = new BABYLON.Color3(sceneConfig.clearColor.r, sceneConfig.clearColor.g, sceneConfig.clearColor.b);
        
        // Setup fog for ethereal atmosphere
        this.scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
        this.scene.fogColor = this.scene.clearColor;
        this.scene.fogStart = sceneConfig.fogStart;
        this.scene.fogEnd = sceneConfig.fogEnd;
        
        // Create camera
        this.createCamera();
        
        // Create lighting
        this.createLighting();
        
        // Use basic character builder for stability
        this.characterBuilder = new CharacterBuilder(this.scene);
        const characterData = await this.characterBuilder.createCharacter();
        this.characterParts = characterData.parts;
        this.characterMaterials = characterData.materials;
        this.characterBuilder.createGround(this.characterMaterials);
        this.particleSystem = this.characterBuilder.createParticleSystem(this.characterParts.root);
        this.isAdvancedCharacter = false;
        
        // Check if we loaded a rigged model
        this.isRiggedCharacter = !!(this.characterParts.skeleton && this.characterParts.animationGroups);
        
        if (this.isRiggedCharacter) {
            console.log("✅ Successfully loaded rigged Ghost FBX model!");
            console.log(`- Skeleton: ${this.characterParts.skeleton ? 'Yes' : 'No'}`);
            console.log(`- Animations: ${this.characterParts.animationGroups ? this.characterParts.animationGroups.length : 0}`);
            console.log(`- Meshes: ${this.characterParts.meshes ? this.characterParts.meshes.length : 0}`);
        } else {
            console.log("ℹ️ Using procedural ghost model (FBX load failed or not available)");
        }
        
        // Immediately set character to look at viewer
        this.initializeViewerFocus();
        
        // Boundaries removed - character is now stationary in viewport center
    }
    
    createCamera() {
        const cameraConfig = GHOST_CHARACTER_CONFIG.camera;
        this.camera = new BABYLON.UniversalCamera("camera", 
            new BABYLON.Vector3(cameraConfig.position.x, cameraConfig.position.y, cameraConfig.position.z), 
            this.scene
        );
        this.camera.setTarget(new BABYLON.Vector3(cameraConfig.target.x, cameraConfig.target.y, cameraConfig.target.z));
        // Removed camera controls - camera is now fixed for viewport-contained character
        // this.camera.attachControl(this.canvas, true);
    }
    
    createLighting() {
        const lightingConfig = GHOST_CHARACTER_CONFIG.lighting;
        
        // Ambient light
        const ambientLight = new BABYLON.HemisphericLight("ambient", new BABYLON.Vector3(0, 1, 0), this.scene);
        const ambientConfig = lightingConfig.ambient;
        ambientLight.intensity = ambientConfig.intensity;
        ambientLight.diffuse = new BABYLON.Color3(ambientConfig.diffuse.r, ambientConfig.diffuse.g, ambientConfig.diffuse.b);
        ambientLight.groundColor = new BABYLON.Color3(ambientConfig.groundColor.r, ambientConfig.groundColor.g, ambientConfig.groundColor.b);
        
        // Ethereal light
        const etherealLight = new BABYLON.PointLight("ethereal", new BABYLON.Vector3(0, 1, 0), this.scene);
        const etherealConfig = lightingConfig.ethereal;
        etherealLight.diffuse = new BABYLON.Color3(etherealConfig.diffuse.r, etherealConfig.diffuse.g, etherealConfig.diffuse.b);
        etherealLight.intensity = etherealConfig.intensity;
        etherealLight.range = etherealConfig.range;
    }
    
    // createViewportBoundaries method removed - character is now stationary and doesn't need collision boundaries
    
    initializeViewerFocus() {
        // Ensure character immediately looks at viewer (180 degree turn to face camera)
        if (this.characterParts.root) {
            // Position character to face viewer - rotate 180 degrees
            this.characterParts.root.rotation.y = Math.PI;
            this.characterParts.root.position.set(0, 0, 0);
        }
        
        // Set eye tracking target to viewer
        if (this.characterParts.eyeSystem && this.characterParts.eyeSystem.lookTarget) {
            this.characterParts.eyeSystem.lookTarget.position.set(0, 2, -5);
        }
        
        // Set head to look at viewer
        if (this.characterParts.head) {
            this.characterParts.head.rotation.x = -0.1; // Slight downward angle
            this.characterParts.head.rotation.y = 0;    // Face forward
        }
    }
    
    speak(category) {
        const text = this.aiController.getRandomPhrase(category);
        const speechBubble = document.getElementById('speechBubble');
        speechBubble.textContent = text;
        speechBubble.style.display = 'block';
        
        // Position speech bubble above character
        this.positionSpeechBubble();
        
        // Hide after configured time
        const hideTimeout = this.setTrackedTimeout(() => {
            if (speechBubble) {
                speechBubble.style.display = 'none';
            }
        }, GHOST_CHARACTER_CONFIG.speech.displayDuration);
    }
    
    positionSpeechBubble() {
        const speechBubble = document.getElementById('speechBubble');
        if (!speechBubble) return;
        
        try {
            const worldPos = new BABYLON.Vector3(0, 3.5, 0);
            const screenPos = BABYLON.Vector3.Project(
                worldPos,
                BABYLON.Matrix.Identity(),
                this.scene.getTransformMatrix(),
                this.camera.viewport.toGlobal(this.engine.getRenderWidth(), this.engine.getRenderHeight())
            );
            
            // Get viewport dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Get speech bubble dimensions (approximate from CSS)
            const bubbleWidth = Math.min(340, viewportWidth * 0.9);
            const bubbleHeight = 100; // Approximate height
            const margin = 10;
            
            // Calculate constrained position
            let targetX = screenPos.x;
            let targetY = screenPos.y - GHOST_CHARACTER_CONFIG.speech.bubbleOffset;
            
            // Constrain X position (accounting for transform: translate(-50%, 0))
            const minX = (bubbleWidth / 2) + margin;
            const maxX = viewportWidth - (bubbleWidth / 2) - margin;
            targetX = Math.max(minX, Math.min(maxX, targetX));
            
            // Constrain Y position
            const minY = margin;
            const maxY = viewportHeight - bubbleHeight - margin;
            targetY = Math.max(minY, Math.min(maxY, targetY));
            
            speechBubble.style.left = targetX + 'px';
            speechBubble.style.top = targetY + 'px';
            speechBubble.style.transform = 'translate(-50%, 0)';
        } catch (e) {
            // Fallback positioning with viewport constraints
            speechBubble.style.left = '50%';
            speechBubble.style.top = 'clamp(60px, 20%, calc(100vh - 160px))';
            speechBubble.style.transform = 'translate(-50%, 0)';
        }
    }
    
    blink() {
        if (this.characterParts.leftEye && this.characterParts.rightEye) {
            this.characterParts.leftEye.scaling.y = 0.1;
            this.characterParts.rightEye.scaling.y = 0.1;
            const blinkTimeout = setTimeout(() => {
                if (this.characterParts.leftEye && this.characterParts.rightEye) {
                    this.characterParts.leftEye.scaling.y = 1;
                    this.characterParts.rightEye.scaling.y = 1;
                }
            }, 200); // Slightly longer blink for ghostly effect
        }
    }
    
    updateAnimations(deltaTime) {
        if (!this.characterParts.root) return;
        
        const aiState = this.aiController.state;
        
        // Use rigged animations if available, otherwise use procedural
        if (this.isRiggedCharacter) {
            this.updateRiggedAnimations(deltaTime, aiState);
        } else {
            this.updateProceduralAnimations(deltaTime, aiState);
        }
    }
    
    updateRiggedAnimations(deltaTime, aiState) {
        // Handle rigged character animations
        const baseFloatIntensity = this.aiController.getFloatIntensity();
        const performanceMultiplier = 1 + (this.aiController.getPerformanceLevel() - 1) * 0.4;
        const floatIntensity = baseFloatIntensity * performanceMultiplier;
        this.characterParts.root.position.y = 0.2 + Math.sin(this.time * 1.2) * floatIntensity;
        
        // Play appropriate animations based on AI state
        if (this.characterParts.animationGroups) {
            this.playStateAnimation(aiState);
        }
        
        // Character movement removed - character now stays stationary in viewport center
        // Character rotation is reset to face viewer (180 degrees)
        if (this.characterParts.root) {
            this.characterParts.root.rotation.y = BABYLON.Scalar.Lerp(this.characterParts.root.rotation.y, Math.PI, deltaTime * 2);
        }
    }
    
    updateProceduralAnimations(deltaTime, aiState) {
        // Enhanced floating animation based on performance level - more pronounced for ghost
        const baseFloatIntensity = this.aiController.getFloatIntensity();
        const performanceMultiplier = 1 + (this.aiController.getPerformanceLevel() - 1) * 0.4;
        const floatIntensity = baseFloatIntensity * performanceMultiplier;
        this.characterParts.root.position.y = 0.2 + Math.sin(this.time * 1.2) * floatIntensity;
        
        // Basic eye tracking
        if (this.characterParts.leftEye && this.characterParts.rightEye) {
            // Simple eye following behavior
            const lookIntensity = 0.1;
            const time = this.time * 0.5;
            this.characterParts.leftEye.rotation.y = Math.sin(time) * lookIntensity;
            this.characterParts.rightEye.rotation.y = Math.sin(time) * lookIntensity;
        }
        
        // Fourth wall breaking - enhanced head tracking with ethereal movement
        if (this.aiController.isLookingAtViewer()) {
            if (this.characterParts.head) {
                // More fluid ghostly head movement (facing viewer)
                const targetRotY = Math.sin(this.time * 0.2) * 0.1;
                const targetRotX = -0.1 + Math.sin(this.time * 0.15) * 0.03;
                this.characterParts.head.rotation.y = BABYLON.Scalar.Lerp(this.characterParts.head.rotation.y, targetRotY, deltaTime * 2);
                this.characterParts.head.rotation.x = BABYLON.Scalar.Lerp(this.characterParts.head.rotation.x, targetRotX, deltaTime * 2);
            }
        } else {
            // Gentle ethereal drifting movement (still facing generally toward viewer)
            if (this.characterParts.head) {
                const subtleRotY = Math.sin(this.time * 0.08) * 0.03;
                const subtleRotX = -0.03;
                this.characterParts.head.rotation.y = BABYLON.Scalar.Lerp(this.characterParts.head.rotation.y, subtleRotY, deltaTime * 0.8);
                this.characterParts.head.rotation.x = BABYLON.Scalar.Lerp(this.characterParts.head.rotation.x, subtleRotX, deltaTime * 0.8);
            }
        }
        
        // Performance trick animations
        this.updatePerformanceTrickAnimations(deltaTime);
        
        // Enhanced limb animations using advanced character system
        if (this.characterParts.limbs) {
            const armSpeed = this.getPerformanceArmSpeed();
            
            if (aiState.activity === 'performance_trick') {
                // Basic performance animations
                if (this.characterParts.leftArm && this.characterParts.rightArm) {
                    this.characterParts.leftArm.rotation.z = 0.5 + Math.sin(this.time * 4) * 0.3;
                    this.characterParts.rightArm.rotation.z = -0.5 - Math.sin(this.time * 4) * 0.3;
                }
            } else if (aiState.activity === 'fourth_wall_break') {
                // Advanced pointing gesture using limb chains - more fluid for ghost
                if (this.characterParts.limbs.rightArm) {
                    const rightArm = this.characterParts.limbs.rightArm;
                    if (rightArm.shoulder) {
                        rightArm.shoulder.rotation.z = -0.6;
                        rightArm.shoulder.rotation.x = -0.15;
                    }
                    if (rightArm.elbow) {
                        rightArm.elbow.rotation.z = 0.2;
                    }
                }
                
                if (this.characterParts.limbs.leftArm && this.characterParts.limbs.leftArm.shoulder) {
                    this.characterParts.limbs.leftArm.shoulder.rotation.z = 0.2 + Math.sin(this.time * 2) * 0.15;
                }
            } else {
                // Regular ethereal limb movement
                if (this.characterParts.limbs.leftArm && this.characterParts.limbs.leftArm.shoulder) {
                    this.characterParts.limbs.leftArm.shoulder.rotation.z = 0.3 + Math.sin(this.time * armSpeed * 0.8) * 0.2;
                }
                if (this.characterParts.limbs.rightArm && this.characterParts.limbs.rightArm.shoulder) {
                    this.characterParts.limbs.rightArm.shoulder.rotation.z = -0.3 - Math.sin(this.time * armSpeed * 0.8) * 0.2;
                }
            }
        }
        
        // Simple wavy bottom animation for the simplified ghost body
        if (this.characterParts.body) {
            // Add subtle body wave animation to enhance the wavy bottom effect
            const waveTime = this.time * 2.0;
            this.characterParts.body.rotation.z = Math.sin(waveTime) * 0.03;
            this.characterParts.body.rotation.x = Math.sin(waveTime * 0.7) * 0.02;
        }
        
        // Character movement removed - character now stays stationary in viewport center
        // Character rotation is reset to face viewer (180 degrees)
        if (this.characterParts.root) {
            this.characterParts.root.rotation.y = BABYLON.Scalar.Lerp(this.characterParts.root.rotation.y, Math.PI, deltaTime * 2);
        }
        
        // Viewport interaction animation - more ethereal
        if (aiState.activity === 'phase_interaction') {
            const phaseIntensity = Math.sin(this.time * 8) * 0.05;
            this.characterParts.root.position.y += phaseIntensity;
            
            // Ethereal gestures
            if (this.characterParts.leftArm && this.characterParts.rightArm) {
                this.characterParts.leftArm.rotation.z = 0.15 + Math.sin(this.time * 6) * 0.3;
                this.characterParts.rightArm.rotation.z = -0.15 - Math.sin(this.time * 6) * 0.3;
            }
        }
        
        // Performance animation
        if (aiState.isPerforming) {
            // Special ethereal performance gestures
            if (this.characterParts.head) {
                this.characterParts.head.rotation.y = Math.sin(this.time * 2) * 0.3;
            }
        }
    }
    
    playStateAnimation(aiState) {
        if (!this.characterParts.animationGroups || this.characterParts.animationGroups.length === 0) return;
        
        // Map AI states to animation names
        const animationMap = {
            'idle': ['idle', 'float', 'rest'],
            'performance_trick': ['perform', 'dance', 'trick', 'gesture'],
            'fourth_wall_break': ['point', 'wave', 'acknowledge'],
            'audience_engagement': ['friendly', 'greet', 'welcome'],
            'showing_off': ['show', 'display', 'present'],
            'phase_interaction': ['phase', 'ethereal', 'magic']
        };
        
        const possibleAnimations = animationMap[aiState.activity] || animationMap['idle'];
        
        // Find matching animation
        let targetAnimation = null;
        for (const animName of possibleAnimations) {
            targetAnimation = this.characterParts.animationGroups.find(anim => 
                anim.name.toLowerCase().includes(animName.toLowerCase())
            );
            if (targetAnimation) break;
        }
        
        // If no specific animation found, use the first available or keep idle
        if (!targetAnimation && this.characterParts.animationGroups.length > 0) {
            targetAnimation = this.characterParts.idleAnimation || this.characterParts.animationGroups[0];
        }
        
        // Play the animation if different from current
        if (targetAnimation && targetAnimation !== this.currentAnimation) {
            // Stop current animation
            if (this.currentAnimation) {
                this.currentAnimation.stop();
            }
            
            // Start new animation
            targetAnimation.start(true, 1.0, targetAnimation.from, targetAnimation.to, false);
            this.currentAnimation = targetAnimation;
        }
    }
    
    updatePerformanceTrickAnimations(deltaTime) {
        const currentTrick = this.aiController.getCurrentTrick();
        const aiState = this.aiController.state;
        
        if (!currentTrick || !this.characterParts.root) return;
        
        switch (currentTrick) {
            case 'ethereal_dance':
                this.characterParts.root.rotation.y += deltaTime * 2;
                break;
                
            case 'phase_shift':
                this.characterParts.root.position.y += Math.sin(this.time * 5) * 0.3;
                // Add transparency animation
                if (this.characterMaterials.ghost) {
                    this.characterMaterials.ghost.alpha = 0.4 + Math.sin(this.time * 4) * 0.3;
                }
                break;
                
            case 'ethereal_pose':
                if (this.characterParts.leftArm && this.characterParts.rightArm) {
                    this.characterParts.leftArm.rotation.z = -1.0;
                    this.characterParts.rightArm.rotation.z = 1.0;
                    this.characterParts.leftArm.rotation.x = Math.sin(this.time * 3) * 0.2;
                    this.characterParts.rightArm.rotation.x = Math.sin(this.time * 3) * 0.2;
                }
                break;
                
            case 'gentle_bow':
                if (this.characterParts.body) {
                    this.characterParts.body.rotation.x = Math.sin(this.time * 1.5) * 0.3 - 0.2;
                }
                if (this.characterParts.head) {
                    this.characterParts.head.rotation.x = Math.sin(this.time * 1.5) * 0.15 - 0.3;
                }
                break;
                
            case 'ethereal_display':
                // Enhanced particle effects handled in updateLighting
                break;
        }
    }
    
    getPerformanceArmSpeed() {
        const aiState = this.aiController.state;
        const baseSpeed = this.aiController.getArmSpeed() * 0.7; // Slower, more ethereal
        
        if (aiState.activity === 'performance_trick') {
            return baseSpeed * 1.2;
        } else if (aiState.activity === 'fourth_wall_break') {
            return baseSpeed * 0.6;
        }
        
        return baseSpeed;
    }
    
    showSpotlight() {
        const spotlight = document.getElementById('performanceSpotlight');
        if (spotlight) {
            spotlight.style.display = 'block';
        }
    }
    
    hideSpotlight() {
        const spotlight = document.getElementById('performanceSpotlight');
        if (spotlight) {
            spotlight.style.display = 'none';
        }
    }
    
    updateLighting() {
        // Ethereal light flicker based on mood
        const etherealLight = this.scene.getLightByName("ethereal");
        if (etherealLight) {
            const mood = this.aiController.state.mood;
            const intensity = mood === 'melancholic' ? 1.8 : 2.0;
            const flicker = mood === 'mysterious' ? 0.6 : 0.2;
            etherealLight.intensity = intensity + Math.sin(this.time * 6) * flicker;
        }
    }
    
    startRenderLoop() {
        this.scene.registerBeforeRender(() => {
            const deltaTime = this.engine.getDeltaTime() / 1000;
            this.time += deltaTime;
            
            // Update AI behavior
            this.aiController.update(deltaTime);
            
            // Update performance monitoring and adjust quality if needed
            this.performanceMonitor.update(this.engine);
            this.adjustPerformanceIfNeeded();
            
            // Handle speech with performance categories
            if (this.aiController.shouldSpeak()) {
                const aiState = this.aiController.state;
                let speechCategory = 'observing';
                
                // Choose speech category based on current activity
                switch (aiState.activity) {
                    case 'fourth_wall_break':
                        speechCategory = 'fourth_wall_break';
                        // Play sensing voice line occasionally
                        if (Math.random() < 0.15) {
                            this.setTrackedTimeout(() => this.audioManager.playGhostSensing(), 1000 + Math.random() * 2000);
                        }
                        break;
                    case 'performance_trick':
                        speechCategory = 'performance_trick';
                        // Play performance or magic voice line
                        if (Math.random() < 0.2) {
                            const voiceLine = Math.random() < 0.5 ? 'playGhostPerformance' : 'playGhostMagic';
                            this.setTrackedTimeout(() => this.audioManager[voiceLine](), 800 + Math.random() * 3000);
                        }
                        break;
                    case 'audience_engagement':
                        speechCategory = 'audience_engagement';
                        // Play friendly voice line
                        if (Math.random() < 0.15) {
                            this.setTrackedTimeout(() => this.audioManager.playGhostFriendly(), 1200 + Math.random() * 2500);
                        }
                        break;
                    case 'showing_off':
                        speechCategory = 'showing_off';
                        // Play magic voice line
                        if (Math.random() < 0.12) {
                            this.setTrackedTimeout(() => this.audioManager.playGhostMagic(), 900 + Math.random() * 2800);
                        }
                        break;
                    case 'greeting_audience':
                        speechCategory = 'greeting_audience';
                        break;
                    default:
                        speechCategory = 'observing';
                        // Occasionally play ambient sounds
                        if (Math.random() < 0.05) {
                            this.setTrackedTimeout(() => this.audioManager.playRandomAmbientSound(), 2000 + Math.random() * 4000);
                        }
                }
                
                this.speak(speechCategory);
                // Play ghost voice line randomly (only 30% chance)
                if (Math.random() < 0.3) {
                    this.audioManager.playRandomGhostLine();
                }
                this.aiController.resetSpeechTimer();
            }
            
            // Handle blinking
            if (this.aiController.shouldBlink()) {
                this.blink();
                this.aiController.resetBlinkTimer();
            }
            
            // Handle phase interactions
            if (this.aiController.state.activity === 'phase_interaction') {
                if (Math.random() < 0.008) { // 0.8% chance per frame during interaction
                    this.speak('phase_interaction');
                    // Only occasionally play phase shift sound
                    if (Math.random() < 0.3) {
                        this.audioManager.playPhaseShift();
                    }
                    // Add eerie sound effects during phase interactions
                    if (Math.random() < 0.2) {
                        this.setTrackedTimeout(() => this.audioManager.playGhostWind(), 1500 + Math.random() * 3000);
                    }
                }
            }
            
            // Handle spotlight visibility
            if (this.aiController.shouldShowSpotlight()) {
                this.showSpotlight();
            } else {
                this.hideSpotlight();
            }
            
            // Update animations and lighting
            this.updateAnimations(deltaTime);
            this.updateLighting();
            
            // Update debug info
            this.updateDebugInfo();
        });
        
        // Start render loop
        this.engine.runRenderLoop(() => {
            if (this.scene && this.scene.activeCamera) {
                this.scene.render();
            }
        });
    }
    
    adjustPerformanceIfNeeded() {
        const metrics = this.performanceMonitor.getMetrics();
        
        // Switch to low performance mode if FPS is consistently low
        if (metrics.fps < 25 && !this.lowPerformanceMode) {
            this.lowPerformanceMode = true;
            this.enableLowPerformanceMode();
        }
        
        // Switch back to normal mode if performance improves
        if (metrics.fps > 45 && this.lowPerformanceMode) {
            this.lowPerformanceMode = false;
            this.disableLowPerformanceMode();
        }
    }
    
    enableLowPerformanceMode() {
        // Reduce animation frequency
        if (this.particleSystem) {
            this.particleSystem.emitRate *= 0.5;
        }
        
        // Reduce render resolution if needed
        if (this.engine && this.engine.getHardwareScalingLevel() === 1) {
            this.engine.setHardwareScalingLevel(1.5);
        }
    }
    
    disableLowPerformanceMode() {
        // Restore normal animation frequency
        if (this.particleSystem) {
            this.particleSystem.emitRate *= 2;
        }
        
        // Restore normal render resolution
        if (this.engine && this.engine.getHardwareScalingLevel() > 1) {
            this.engine.setHardwareScalingLevel(1);
        }
    }
    
    updateDebugInfo() {
        const debugElement = document.getElementById('debug');
        if (debugElement) {
            const aiState = this.aiController.state;
            const perfMode = this.lowPerformanceMode ? ' (Low Perf)' : '';
            const modelType = this.isRiggedCharacter ? ' | Model: RIGGED FBX' : ' | Model: Procedural';
            debugElement.innerHTML = 
                `FPS: ${this.engine.getFps().toFixed(0)} | Mood: ${aiState.mood} | Activity: ${aiState.activity} | Performance: ${aiState.performanceLevel.toFixed(1)} | Attention: ${aiState.audienceAttention.toFixed(0)}%${perfMode}${modelType}`;
        }
    }
    
    dispose() {
        // Cleanup resource manager (handles timeouts, intervals, etc.)
        if (this.resourceManager) {
            this.resourceManager.cleanup();
        }
        
        // Cleanup animations
        if (this.currentAnimation) {
            this.currentAnimation.stop();
        }
        if (this.characterParts && this.characterParts.animationGroups) {
            this.characterParts.animationGroups.forEach(animGroup => {
                if (animGroup) animGroup.dispose();
            });
        }
        
        // Cleanup advanced character systems
        if (this.advancedCharacterBuilder) {
            this.advancedCharacterBuilder.dispose();
        }
        
        // Cleanup basic character systems
        if (this.particleSystem) {
            this.particleSystem.dispose();
        }
        
        // Cleanup audio manager
        if (this.audioManager) {
            // Stop any ongoing audio
            if (this.audioManager.audioContext && this.audioManager.audioContext.state !== 'closed') {
                this.audioManager.audioContext.close();
            }
        }
        
        // Cleanup AI controller
        this.aiController = null;
        
        // Cleanup scene
        if (this.scene) {
            this.scene.dispose();
        }
        
        // Cleanup engine last
        if (this.engine) {
            this.engine.dispose();
        }
    }
}
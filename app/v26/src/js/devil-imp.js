// Main Devil Imp class that orchestrates all components
class DevilImp {
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
        
        // Resource management
        this.resourceManager = new ResourceManager();
        this.performanceMonitor = new PerformanceMonitor();
        this.timeouts = new Set();
        
        // Render loop time tracking
        this.time = 0;
    }
    
    async init() {
        try {
            this.setupEventListeners();
            await this.createEngine();
            await this.createScene();
            this.startRenderLoop();
            
            // Initial greeting after dramatic pause
            const greetingTimeout = setTimeout(() => {
                this.speak('greeting_audience');
                this.audioManager.playDemonicEntry();
                const loadingEl = document.getElementById('loading');
                if (loadingEl) loadingEl.style.display = 'none';
                
                // Show initial performance spotlight
                this.showSpotlight();
            }, 2000);
            this.timeouts.add(greetingTimeout);
            
        } catch (error) {
            console.error("Failed to initialize Devil Imp:", error);
            document.getElementById('loading').innerHTML = 'Failed to summon imp: ' + error.message;
        }
    }
    
    setupEventListeners() {
        // Audio initialization on user interaction
        this.canvas.addEventListener('click', () => {
            this.audioManager.init();
            document.getElementById('info').style.display = 'none';
        }, { once: true });
        
        // Handle window resize and orientation changes
        const handleViewportChange = () => {
            if (this.engine) this.engine.resize();
            // Reposition speech bubble to maintain viewport containment
            const speechBubble = document.getElementById('speechBubble');
            if (speechBubble && speechBubble.style.display !== 'none') {
                // Small delay to ensure viewport dimensions are updated
                setTimeout(() => this.positionSpeechBubble(), 100);
            }
        };
        
        window.addEventListener("resize", handleViewportChange);
        window.addEventListener("orientationchange", handleViewportChange);
    }
    
    async createEngine() {
        const config = DEVIL_IMP_CONFIG.engine;
        this.engine = new BABYLON.Engine(this.canvas, true, config);
    }
    
    async createScene() {
        // Create scene
        this.scene = new BABYLON.Scene(this.engine);
        const sceneConfig = DEVIL_IMP_CONFIG.scene;
        this.scene.clearColor = new BABYLON.Color3(sceneConfig.clearColor.r, sceneConfig.clearColor.g, sceneConfig.clearColor.b);
        
        // Setup fog
        this.scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
        this.scene.fogColor = this.scene.clearColor;
        this.scene.fogStart = sceneConfig.fogStart;
        this.scene.fogEnd = sceneConfig.fogEnd;
        
        // Create camera
        this.createCamera();
        
        // Create lighting
        this.createLighting();
        
        // Create advanced character with fallback
        try {
            this.advancedCharacterBuilder = new AdvancedCharacterBuilder(this.scene);
            const characterData = await this.advancedCharacterBuilder.createAdvancedCharacter();
            this.characterParts = characterData.parts;
            this.characterMaterials = characterData.materials;
            this.isAdvancedCharacter = true;
        } catch (error) {
            console.warn("Advanced character failed, using fallback:", error);
            // Fallback to basic character
            this.characterBuilder = new CharacterBuilder(this.scene);
            const characterData = this.characterBuilder.createCharacter();
            this.characterParts = characterData.parts;
            this.characterMaterials = characterData.materials;
            this.characterBuilder.createGround(this.characterMaterials);
            this.particleSystem = this.characterBuilder.createParticleSystem(this.characterParts.root);
            this.isAdvancedCharacter = false;
        }
        
        // Immediately set character to look at viewer
        this.initializeViewerFocus();
        
        // Boundaries removed - character is now stationary in viewport center
    }
    
    createCamera() {
        const cameraConfig = DEVIL_IMP_CONFIG.camera;
        this.camera = new BABYLON.UniversalCamera("camera", 
            new BABYLON.Vector3(cameraConfig.position.x, cameraConfig.position.y, cameraConfig.position.z), 
            this.scene
        );
        this.camera.setTarget(new BABYLON.Vector3(cameraConfig.target.x, cameraConfig.target.y, cameraConfig.target.z));
        // Removed camera controls - camera is now fixed for viewport-contained character
        // this.camera.attachControl(this.canvas, true);
    }
    
    createLighting() {
        const lightingConfig = DEVIL_IMP_CONFIG.lighting;
        
        // Ambient light
        const ambientLight = new BABYLON.HemisphericLight("ambient", new BABYLON.Vector3(0, 1, 0), this.scene);
        const ambientConfig = lightingConfig.ambient;
        ambientLight.intensity = ambientConfig.intensity;
        ambientLight.diffuse = new BABYLON.Color3(ambientConfig.diffuse.r, ambientConfig.diffuse.g, ambientConfig.diffuse.b);
        ambientLight.groundColor = new BABYLON.Color3(ambientConfig.groundColor.r, ambientConfig.groundColor.g, ambientConfig.groundColor.b);
        
        // Fire light
        const fireLight = new BABYLON.PointLight("fire", new BABYLON.Vector3(0, 1, 0), this.scene);
        const fireConfig = lightingConfig.fire;
        fireLight.diffuse = new BABYLON.Color3(fireConfig.diffuse.r, fireConfig.diffuse.g, fireConfig.diffuse.b);
        fireLight.intensity = fireConfig.intensity;
        fireLight.range = fireConfig.range;
    }
    
    // createViewportBoundaries method removed - character is now stationary and doesn't need collision boundaries
    
    initializeViewerFocus() {
        // Ensure character immediately looks at viewer
        if (this.characterParts.root) {
            // Position character to face viewer
            this.characterParts.root.rotation.y = 0;
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
        const hideTimeout = setTimeout(() => {
            if (speechBubble) {
                speechBubble.style.display = 'none';
            }
        }, DEVIL_IMP_CONFIG.speech.displayDuration);
        this.timeouts.add(hideTimeout);
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
            let targetY = screenPos.y - DEVIL_IMP_CONFIG.speech.bubbleOffset;
            
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
            }, 150);
            this.timeouts.add(blinkTimeout);
        }
    }
    
    updateAnimations(deltaTime) {
        if (!this.characterParts.root) return;
        
        const aiState = this.aiController.state;
        
        // Enhanced floating animation based on performance level
        const baseFloatIntensity = this.aiController.getFloatIntensity();
        const performanceMultiplier = 1 + (this.aiController.getPerformanceLevel() - 1) * 0.3;
        const floatIntensity = baseFloatIntensity * performanceMultiplier;
        this.characterParts.root.position.y = 0.1 + Math.sin(this.time * 1.5) * floatIntensity;
        
        // Advanced eye tracking and viewer focus
        if (this.advancedCharacterBuilder) {
            this.advancedCharacterBuilder.updateEyeTracking(deltaTime);
        }
        
        // Fourth wall breaking - enhanced head tracking
        if (this.aiController.isLookingAtViewer()) {
            if (this.characterParts.head) {
                // More pronounced head movement toward viewer
                const targetRotY = Math.sin(this.time * 0.3) * 0.15;
                const targetRotX = -0.15 + Math.sin(this.time * 0.2) * 0.05;
                this.characterParts.head.rotation.y = BABYLON.Scalar.Lerp(this.characterParts.head.rotation.y, targetRotY, deltaTime * 3);
                this.characterParts.head.rotation.x = BABYLON.Scalar.Lerp(this.characterParts.head.rotation.x, targetRotX, deltaTime * 3);
            }
        } else {
            // Still maintain some viewer awareness even when not actively breaking fourth wall
            if (this.characterParts.head) {
                const subtleRotY = Math.sin(this.time * 0.1) * 0.05;
                const subtleRotX = -0.05;
                this.characterParts.head.rotation.y = BABYLON.Scalar.Lerp(this.characterParts.head.rotation.y, subtleRotY, deltaTime * 1);
                this.characterParts.head.rotation.x = BABYLON.Scalar.Lerp(this.characterParts.head.rotation.x, subtleRotX, deltaTime * 1);
            }
        }
        
        // Performance trick animations
        this.updatePerformanceTrickAnimations(deltaTime);
        
        // Enhanced limb animations using advanced character system
        if (this.characterParts.limbs) {
            const armSpeed = this.getPerformanceArmSpeed();
            
            if (aiState.activity === 'performance_trick') {
                // Use advanced performance animations
                const currentTrick = this.aiController.getCurrentTrick();
                if (this.advancedCharacterBuilder && currentTrick) {
                    this.advancedCharacterBuilder.playPerformanceAnimation(currentTrick);
                }
            } else if (aiState.activity === 'fourth_wall_break') {
                // Advanced pointing gesture using limb chains
                if (this.characterParts.limbs.rightArm) {
                    const rightArm = this.characterParts.limbs.rightArm;
                    if (rightArm.shoulder) {
                        rightArm.shoulder.rotation.z = -0.8;
                        rightArm.shoulder.rotation.x = -0.2;
                    }
                    if (rightArm.elbow) {
                        rightArm.elbow.rotation.z = 0.3;
                    }
                }
                
                if (this.characterParts.limbs.leftArm && this.characterParts.limbs.leftArm.shoulder) {
                    this.characterParts.limbs.leftArm.shoulder.rotation.z = 0.3 + Math.sin(this.time * 3) * 0.2;
                }
            } else {
                // Regular limb movement with advanced joint system
                if (this.characterParts.limbs.leftArm && this.characterParts.limbs.leftArm.shoulder) {
                    this.characterParts.limbs.leftArm.shoulder.rotation.z = 0.4 + Math.sin(this.time * armSpeed) * 0.3;
                }
                if (this.characterParts.limbs.rightArm && this.characterParts.limbs.rightArm.shoulder) {
                    this.characterParts.limbs.rightArm.shoulder.rotation.z = -0.4 - Math.sin(this.time * armSpeed) * 0.3;
                }
            }
        }
        
        // Advanced tail animation with joint-based movement
        if (this.characterParts.tail && this.characterParts.tail.joints) {
            // Advanced tail uses joint-based animation from the character builder
            // This is handled automatically by the GSAP animations in setupIdleAnimations
        } else if (this.characterParts.tailSegments) {
            // Fallback for basic tail animation
            this.characterParts.tailSegments.forEach((segment, i) => {
                segment.position.x = Math.sin(this.time * 2.5 + i * 0.8) * 0.15;
                segment.rotation.z = Math.sin(this.time * 2 + i * 0.5) * 0.2;
            });
        }
        
        // Character movement removed - character now stays stationary in viewport center
        // Character rotation is reset to face viewer
        if (this.characterParts.root) {
            this.characterParts.root.rotation.y = BABYLON.Scalar.Lerp(this.characterParts.root.rotation.y, 0, deltaTime * 3);
        }
        
        // Reset leg positions to idle when stationary
        if (this.characterParts.limbs && this.characterParts.limbs.leftLeg && this.characterParts.limbs.rightLeg) {
            const leftLeg = this.characterParts.limbs.leftLeg;
            const rightLeg = this.characterParts.limbs.rightLeg;
            
            if (leftLeg.hip) leftLeg.hip.rotation.x = BABYLON.Scalar.Lerp(leftLeg.hip.rotation.x, 0, deltaTime * 5);
            if (leftLeg.knee) leftLeg.knee.rotation.x = BABYLON.Scalar.Lerp(leftLeg.knee.rotation.x, 0, deltaTime * 5);
            if (rightLeg.hip) rightLeg.hip.rotation.x = BABYLON.Scalar.Lerp(rightLeg.hip.rotation.x, 0, deltaTime * 5);
            if (rightLeg.knee) rightLeg.knee.rotation.x = BABYLON.Scalar.Lerp(rightLeg.knee.rotation.x, 0, deltaTime * 5);
        } else if (this.characterParts.leftLeg && this.characterParts.rightLeg) {
            // Fallback basic idle position
            this.characterParts.leftLeg.rotation.x = BABYLON.Scalar.Lerp(this.characterParts.leftLeg.rotation.x, 0, deltaTime * 5);
            this.characterParts.rightLeg.rotation.x = BABYLON.Scalar.Lerp(this.characterParts.rightLeg.rotation.x, 0, deltaTime * 5);
        }
        
        // Viewport interaction animation
        if (aiState.activity === 'viewport_interaction') {
            const attackIntensity = Math.sin(this.time * 15) * 0.1;
            this.characterParts.root.position.y += attackIntensity;
            
            // Aggressive gestures
            if (this.characterParts.leftArm && this.characterParts.rightArm) {
                this.characterParts.leftArm.rotation.z = 0.2 + Math.sin(this.time * 10) * 0.5;
                this.characterParts.rightArm.rotation.z = -0.2 - Math.sin(this.time * 10) * 0.5;
            }
        }
        
        // Performance animation
        if (aiState.isPerforming) {
            // Special performance gestures
            if (this.characterParts.head) {
                this.characterParts.head.rotation.y = Math.sin(this.time * 3) * 0.5;
            }
        }
    }
    
    updatePerformanceTrickAnimations(deltaTime) {
        const currentTrick = this.aiController.getCurrentTrick();
        const aiState = this.aiController.state;
        
        if (!currentTrick || !this.characterParts.root) return;
        
        switch (currentTrick) {
            case 'spin_dance':
                this.characterParts.root.rotation.y += deltaTime * 3;
                break;
                
            case 'levitation':
                this.characterParts.root.position.y += Math.sin(this.time * 4) * 0.2;
                break;
                
            case 'magic_pose':
                if (this.characterParts.leftArm && this.characterParts.rightArm) {
                    this.characterParts.leftArm.rotation.z = -1.2;
                    this.characterParts.rightArm.rotation.z = 1.2;
                    this.characterParts.leftArm.rotation.x = Math.sin(this.time * 5) * 0.3;
                    this.characterParts.rightArm.rotation.x = Math.sin(this.time * 5) * 0.3;
                }
                break;
                
            case 'dramatic_bow':
                if (this.characterParts.body) {
                    this.characterParts.body.rotation.x = Math.sin(this.time * 2) * 0.4 - 0.3;
                }
                if (this.characterParts.head) {
                    this.characterParts.head.rotation.x = Math.sin(this.time * 2) * 0.2 - 0.5;
                }
                break;
                
            case 'fire_display':
                // Enhanced particle effects handled in updateLighting
                break;
        }
    }
    
    getPerformanceArmSpeed() {
        const aiState = this.aiController.state;
        const baseSpeed = this.aiController.getArmSpeed();
        
        if (aiState.activity === 'performance_trick') {
            return baseSpeed * 1.5;
        } else if (aiState.activity === 'fourth_wall_break') {
            return baseSpeed * 0.8;
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
        // Fire light flicker based on mood
        const fireLight = this.scene.getLightByName("fire");
        if (fireLight) {
            const mood = this.aiController.state.mood;
            const intensity = mood === 'angry' ? 2.5 : 1.5;
            const flicker = mood === 'menacing' ? 0.8 : 0.3;
            fireLight.intensity = intensity + Math.sin(this.time * 12) * flicker;
        }
    }
    
    startRenderLoop() {
        this.scene.registerBeforeRender(() => {
            const deltaTime = this.engine.getDeltaTime() / 1000;
            this.time += deltaTime;
            
            // Update AI behavior
            this.aiController.update(deltaTime);
            
            // Update performance monitoring
            this.performanceMonitor.update(this.engine);
            
            // Handle speech with performance categories
            if (this.aiController.shouldSpeak()) {
                const aiState = this.aiController.state;
                let speechCategory = 'observing';
                
                // Choose speech category based on current activity
                switch (aiState.activity) {
                    case 'fourth_wall_break':
                        speechCategory = 'fourth_wall_break';
                        break;
                    case 'performance_trick':
                        speechCategory = 'performance_trick';
                        break;
                    case 'audience_engagement':
                        speechCategory = 'audience_engagement';
                        break;
                    case 'showboating':
                        speechCategory = 'showboating';
                        break;
                    case 'greeting_audience':
                        speechCategory = 'greeting_audience';
                        break;
                    default:
                        speechCategory = 'observing';
                }
                
                this.speak(speechCategory);
                this.audioManager.playCackle();
                this.aiController.resetSpeechTimer();
            }
            
            // Handle blinking
            if (this.aiController.shouldBlink()) {
                this.blink();
                this.aiController.resetBlinkTimer();
            }
            
            // Handle viewport interactions
            if (this.aiController.state.activity === 'viewport_interaction') {
                if (Math.random() < 0.02) { // 2% chance per frame during interaction
                    this.speak('viewport_interaction');
                    this.audioManager.playViewportAttack();
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
    
    updateDebugInfo() {
        const debugElement = document.getElementById('debug');
        if (debugElement) {
            const aiState = this.aiController.state;
            debugElement.innerHTML = 
                `FPS: ${this.engine.getFps().toFixed(0)} | Mood: ${aiState.mood} | Activity: ${aiState.activity} | Performance: ${aiState.performanceLevel.toFixed(1)} | Attention: ${aiState.audienceAttention.toFixed(0)}%`;
        }
    }
    
    dispose() {
        // Clear all timeouts
        this.timeouts.forEach(id => clearTimeout(id));
        this.timeouts.clear();
        
        // Cleanup resource manager
        if (this.resourceManager) {
            this.resourceManager.cleanup();
        }
        
        // Cleanup advanced character systems
        if (this.advancedCharacterBuilder) {
            this.advancedCharacterBuilder.dispose();
        }
        
        // Cleanup basic character systems
        if (this.particleSystem) {
            this.particleSystem.dispose();
        }
        
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
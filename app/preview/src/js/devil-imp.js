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
            setTimeout(() => {
                this.speak('greeting_audience');
                this.audioManager.playDemonicEntry();
                document.getElementById('loading').style.display = 'none';
                
                // Show initial performance spotlight
                this.showSpotlight();
            }, 2000);
            
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
        
        // Handle window resize
        window.addEventListener("resize", () => {
            if (this.engine) this.engine.resize();
        });
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
        
        // Create character
        this.characterBuilder = new CharacterBuilder(this.scene);
        const characterData = this.characterBuilder.createCharacter();
        this.characterParts = characterData.parts;
        this.characterMaterials = characterData.materials;
        
        // Create environment
        this.characterBuilder.createGround(this.characterMaterials);
        this.particleSystem = this.characterBuilder.createParticleSystem(this.characterParts.root);
        
        // Create viewport boundaries (invisible)
        this.createViewportBoundaries();
    }
    
    createCamera() {
        const cameraConfig = DEVIL_IMP_CONFIG.camera;
        this.camera = new BABYLON.UniversalCamera("camera", 
            new BABYLON.Vector3(cameraConfig.position.x, cameraConfig.position.y, cameraConfig.position.z), 
            this.scene
        );
        this.camera.setTarget(new BABYLON.Vector3(cameraConfig.target.x, cameraConfig.target.y, cameraConfig.target.z));
        this.camera.attachControl(this.canvas, true);
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
    
    createViewportBoundaries() {
        // Create invisible walls at viewport edges for collision detection
        const boundaryMaterial = new BABYLON.StandardMaterial("boundary", this.scene);
        boundaryMaterial.alpha = 0;
        
        const boundaries = [];
        const boundaryHeight = 5;
        const boundaryDistance = 12;
        
        // Create boundaries
        const boundaryConfigs = [
            { name: "frontBoundary", width: 20, height: boundaryHeight, depth: 0.1, pos: { x: 0, y: 0, z: -boundaryDistance } },
            { name: "leftBoundary", width: 0.1, height: boundaryHeight, depth: 20, pos: { x: -boundaryDistance, y: 0, z: 0 } },
            { name: "rightBoundary", width: 0.1, height: boundaryHeight, depth: 20, pos: { x: boundaryDistance, y: 0, z: 0 } }
        ];
        
        boundaryConfigs.forEach(config => {
            const boundary = BABYLON.MeshBuilder.CreateBox(config.name, {
                width: config.width,
                height: config.height,
                depth: config.depth
            }, this.scene);
            boundary.position.set(config.pos.x, config.pos.y, config.pos.z);
            boundary.material = boundaryMaterial;
            boundaries.push(boundary);
        });
        
        this.boundaries = boundaries;
    }
    
    speak(category) {
        const text = this.aiController.getRandomPhrase(category);
        const speechBubble = document.getElementById('speechBubble');
        speechBubble.textContent = text;
        speechBubble.style.display = 'block';
        
        // Position speech bubble above character
        this.positionSpeechBubble();
        
        // Hide after configured time
        setTimeout(() => {
            speechBubble.style.display = 'none';
        }, DEVIL_IMP_CONFIG.speech.displayDuration);
    }
    
    positionSpeechBubble() {
        const speechBubble = document.getElementById('speechBubble');
        try {
            const worldPos = new BABYLON.Vector3(0, 3.5, 0);
            const screenPos = BABYLON.Vector3.Project(
                worldPos,
                BABYLON.Matrix.Identity(),
                this.scene.getTransformMatrix(),
                this.camera.viewport.toGlobal(this.engine.getRenderWidth(), this.engine.getRenderHeight())
            );
            
            speechBubble.style.left = screenPos.x + 'px';
            speechBubble.style.top = (screenPos.y - DEVIL_IMP_CONFIG.speech.bubbleOffset) + 'px';
            speechBubble.style.transform = 'translate(-50%, 0)';
        } catch (e) {
            // Fallback positioning
            speechBubble.style.left = '50%';
            speechBubble.style.top = '20%';
            speechBubble.style.transform = 'translate(-50%, 0)';
        }
    }
    
    blink() {
        if (this.characterParts.leftEye && this.characterParts.rightEye) {
            this.characterParts.leftEye.scaling.y = 0.1;
            this.characterParts.rightEye.scaling.y = 0.1;
            setTimeout(() => {
                this.characterParts.leftEye.scaling.y = 1;
                this.characterParts.rightEye.scaling.y = 1;
            }, 150);
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
        
        // Fourth wall breaking - look directly at viewer
        if (this.aiController.isLookingAtViewer()) {
            if (this.characterParts.head) {
                // Head tracks towards viewer/camera
                const targetRotY = Math.sin(this.time * 0.5) * 0.1; // Subtle head movement
                const targetRotX = -0.1; // Slight downward angle to "look" at viewer
                this.characterParts.head.rotation.y = BABYLON.Scalar.Lerp(this.characterParts.head.rotation.y, targetRotY, deltaTime * 2);
                this.characterParts.head.rotation.x = BABYLON.Scalar.Lerp(this.characterParts.head.rotation.x, targetRotX, deltaTime * 2);
            }
        }
        
        // Performance trick animations
        this.updatePerformanceTrickAnimations(deltaTime);
        
        // Enhanced arm animations based on activity
        const armSpeed = this.getPerformanceArmSpeed();
        if (this.characterParts.leftArm && this.characterParts.rightArm) {
            if (aiState.activity === 'performance_trick') {
                // Dramatic performance gestures
                this.characterParts.leftArm.rotation.z = 0.2 + Math.sin(this.time * armSpeed) * 0.8;
                this.characterParts.rightArm.rotation.z = -0.2 - Math.sin(this.time * armSpeed + Math.PI) * 0.8;
            } else if (aiState.activity === 'fourth_wall_break') {
                // Pointing and gesturing at viewer
                this.characterParts.leftArm.rotation.z = 0.3 + Math.sin(this.time * 3) * 0.2;
                this.characterParts.rightArm.rotation.z = -0.8; // Pointing gesture
            } else {
                // Regular arm movement
                this.characterParts.leftArm.rotation.z = 0.6 + Math.sin(this.time * armSpeed) * 0.4;
                this.characterParts.rightArm.rotation.z = -0.6 - Math.sin(this.time * armSpeed) * 0.4;
            }
        }
        
        // Tail animation
        if (this.characterParts.tailSegments) {
            this.characterParts.tailSegments.forEach((segment, i) => {
                segment.position.x = Math.sin(this.time * 2.5 + i * 0.8) * 0.15;
                segment.rotation.z = Math.sin(this.time * 2 + i * 0.5) * 0.2;
            });
        }
        
        // Movement towards target
        if (aiState.targetPosition) {
            const direction = aiState.targetPosition.subtract(this.characterParts.root.position);
            direction.y = 0;
            
            if (direction.length() > 0.2) {
                direction.normalize();
                const speed = this.aiController.getMovementSpeed();
                this.characterParts.root.position.addInPlace(direction.scale(deltaTime * speed));
                
                // Face movement direction
                const angle = Math.atan2(direction.x, direction.z);
                this.characterParts.root.rotation.y = BABYLON.Scalar.LerpAngle(
                    this.characterParts.root.rotation.y, angle, deltaTime * 3
                );
                
                // Walking animation
                if (this.characterParts.leftLeg && this.characterParts.rightLeg) {
                    this.characterParts.leftLeg.rotation.x = Math.sin(this.time * 8) * 0.4;
                    this.characterParts.rightLeg.rotation.x = -Math.sin(this.time * 8) * 0.4;
                }
            } else {
                // Stop walking animation
                if (this.characterParts.leftLeg && this.characterParts.rightLeg) {
                    this.characterParts.leftLeg.rotation.x = BABYLON.Scalar.Lerp(this.characterParts.leftLeg.rotation.x, 0, deltaTime * 5);
                    this.characterParts.rightLeg.rotation.x = BABYLON.Scalar.Lerp(this.characterParts.rightLeg.rotation.x, 0, deltaTime * 5);
                }
            }
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
}
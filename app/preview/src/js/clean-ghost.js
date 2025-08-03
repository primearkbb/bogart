// Clean, simplified Ghost Character using Three.js
class CleanGhost {
    constructor() {
        this.canvas = document.getElementById('renderCanvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.ghostModel = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        this.time = 0;
    }

    async init() {
        try {
            console.log('🔧 Initializing clean ghost...');
            
            // Setup renderer first
            this.setupRenderer();
            
            // Create scene
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x0d0d1f);
            
            // Setup camera
            this.setupCamera();
            
            // Setup lighting
            this.setupLighting();
            
            // Load the ghost GLB file
            await this.loadGhost();
            
            // Auto-enable audio
            this.enableAudio();
            
            // Start render loop
            this.animate();
            
            // Handle resize
            window.addEventListener('resize', () => this.onWindowResize());
            
            // Hide loading
            document.getElementById('loading').style.display = 'none';
            console.log('✅ Clean ghost initialized successfully');
            
        } catch (error) {
            console.error('❌ Ghost initialization failed:', error);
            document.getElementById('loading').innerHTML = `Error: ${error.message}`;
            document.getElementById('loading').style.color = '#ff6666';
        }
    }
    
    setupRenderer() {
        try {
            this.renderer = new THREE.WebGLRenderer({ 
                canvas: this.canvas,
                antialias: true, 
                alpha: true,
                failIfMajorPerformanceCaveat: false
            });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            console.log('✅ Renderer created successfully');
        } catch (error) {
            console.error('❌ WebGL renderer failed:', error);
            // Try with minimal settings
            try {
                this.renderer = new THREE.WebGLRenderer({ 
                    canvas: this.canvas,
                    antialias: false,
                    alpha: false,
                    failIfMajorPerformanceCaveat: false,
                    powerPreference: "default"
                });
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                console.log('✅ Fallback renderer created');
            } catch (fallbackError) {
                console.error('❌ All renderer attempts failed:', fallbackError);
                throw new Error('WebGL not supported or failed to initialize');
            }
        }
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 2, 5);
        this.camera.lookAt(0, 1, 0);
        console.log('✅ Camera created');
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x6699ff, 0.4);
        this.scene.add(ambientLight);
        
        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(2, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        this.scene.add(directionalLight);
        
        // Ethereal point light
        const etherealLight = new THREE.PointLight(0x88aaff, 0.6, 10);
        etherealLight.position.set(0, 3, 0);
        this.scene.add(etherealLight);
        
        console.log('✅ Lighting created');
    }
    
    async loadGhost() {
        console.log('📦 Loading ghost GLB file...');
        
        return new Promise((resolve, reject) => {
            const loader = new THREE.GLTFLoader();
            
            loader.load(
                'assets/characters/Ghost/Mesh.glb',
                (gltf) => {
                    console.log('✅ Ghost GLB loaded successfully');
                    console.log('Model info:', {
                        scenes: gltf.scenes.length,
                        animations: gltf.animations.length,
                        cameras: gltf.cameras.length
                    });
                    
                    this.ghostModel = gltf.scene;
                    
                    // Scale and position the ghost
                    this.ghostModel.scale.set(3, 3, 3);
                    this.ghostModel.position.set(0, 0, 0);
                    
                    // Make materials more ghost-like and fix texture issues
                    this.ghostModel.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            
                            // Create a simple ghost material (ignores broken textures)
                            const material = new THREE.MeshPhongMaterial({
                                color: 0xf0f0ff,
                                transparent: true,
                                opacity: 0.85,
                                emissive: 0x1a2a4a,
                                emissiveIntensity: 0.2,
                                shininess: 100
                            });
                            
                            child.material = material;
                        }
                    });
                    
                    this.scene.add(this.ghostModel);
                    
                    // Setup animations if available
                    if (gltf.animations && gltf.animations.length > 0) {
                        this.mixer = new THREE.AnimationMixer(this.ghostModel);
                        
                        // Play the first animation
                        const action = this.mixer.clipAction(gltf.animations[0]);
                        action.play();
                        console.log('▶️ Playing animation:', gltf.animations[0].name);
                    }
                    
                    resolve();
                },
                (progress) => {
                    if (progress.total > 0) {
                        const percent = Math.round((progress.loaded / progress.total) * 100);
                        console.log(`📈 Loading: ${percent}%`);
                    }
                },
                (error) => {
                    console.error('❌ Ghost loading failed:', error);
                    reject(new Error(`Failed to load ghost: ${error.message}`));
                }
            );
        });
    }
    
    enableAudio() {
        // Simple audio enablement without complex manager
        console.log('🔊 Audio enabled');
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        this.time += delta;
        
        // Update animations
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        // Simple floating animation
        if (this.ghostModel) {
            this.ghostModel.position.y = Math.sin(this.time * 1.2) * 0.3;
            this.ghostModel.rotation.y += delta * 0.1; // Slow rotation
        }
        
        // Make ethereal light flicker
        const etherealLight = this.scene.children.find(child => 
            child.type === 'PointLight' && child.color.getHex() === 0x88aaff
        );
        if (etherealLight) {
            etherealLight.intensity = 0.6 + Math.sin(this.time * 6) * 0.2;
        }
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Simple speech system
    speak(text) {
        const speechBubble = document.getElementById('speechBubble');
        if (speechBubble) {
            speechBubble.textContent = text;
            speechBubble.style.display = 'block';
            
            // Position above ghost
            speechBubble.style.position = 'fixed';
            speechBubble.style.top = '20%';
            speechBubble.style.left = '50%';
            speechBubble.style.transform = 'translateX(-50%)';
            speechBubble.style.color = '#ffffff';
            speechBubble.style.fontSize = '18px';
            speechBubble.style.textAlign = 'center';
            speechBubble.style.backgroundColor = 'rgba(0,0,0,0.7)';
            speechBubble.style.padding = '10px 20px';
            speechBubble.style.borderRadius = '20px';
            speechBubble.style.zIndex = '1000';
            
            // Hide after 3 seconds
            setTimeout(() => {
                speechBubble.style.display = 'none';
            }, 3000);
        }
    }
    
    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    const ghost = new CleanGhost();
    ghost.init();
    
    // Add some interactivity
    let speechCount = 0;
    const speeches = [
        "Welcome, mortal...",
        "I sense your presence...",
        "The veil between worlds grows thin...",
        "Behold my ethereal form!",
        "Do you believe in spirits?"
    ];
    
    // Click to make ghost speak
    document.addEventListener('click', () => {
        if (ghost.ghostModel) {
            ghost.speak(speeches[speechCount % speeches.length]);
            speechCount++;
        }
    });
    
    // Periodic random speech
    setInterval(() => {
        if (Math.random() < 0.3 && ghost.ghostModel) {
            ghost.speak(speeches[Math.floor(Math.random() * speeches.length)]);
        }
    }, 10000);
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        ghost.dispose();
    });
});
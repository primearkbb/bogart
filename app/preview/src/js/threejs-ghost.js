// Simple Ghost Character using Three.js
class ThreeJSGhost {
    constructor() {
        this.container = document.getElementById('container');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.ghostModel = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
    }

    async init() {
        try {
            console.log('🔧 Initializing Three.js ghost...');
            
            // Create scene
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x0d0d1f);
            console.log('✅ Scene created');
            
            // Create camera
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.set(0, 2, 5);
            this.camera.lookAt(0, 1, 0);
            console.log('✅ Camera created');
            
            // Create renderer
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.container.appendChild(this.renderer.domElement);
            console.log('✅ Renderer created');
            
            // Create lighting
            const ambientLight = new THREE.AmbientLight(0x6699ff, 0.4);
            this.scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(0, 10, 5);
            directionalLight.castShadow = true;
            this.scene.add(directionalLight);
            console.log('✅ Lighting created');
            
            // Load the ghost GLB file
            await this.loadGhost();
            
            // Start render loop
            this.animate();
            
            // Handle resize
            window.addEventListener('resize', () => this.onWindowResize());
            
            // Hide loading
            document.getElementById('loading').style.display = 'none';
            console.log('✅ Ghost initialized successfully');
            
        } catch (error) {
            console.error('❌ Ghost initialization failed:', error);
            document.getElementById('loading').innerHTML = `Error: ${error.message}`;
        }
    }
    
    async loadGhost() {
        console.log('📦 Loading ghost GLB file...');
        
        return new Promise((resolve, reject) => {
            const loader = new THREE.GLTFLoader();
            
            loader.load(
                'assets/characters/Ghost/Mesh.glb',
                (gltf) => {
                    console.log('✅ Ghost GLB loaded successfully');
                    
                    this.ghostModel = gltf.scene;
                    
                    // Scale and position the ghost
                    this.ghostModel.scale.set(2, 2, 2);
                    this.ghostModel.position.set(0, 0, 0);
                    
                    // Make materials more ghost-like
                    this.ghostModel.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            
                            if (child.material) {
                                // Make it slightly transparent and glowing
                                child.material.transparent = true;
                                child.material.opacity = 0.9;
                                
                                // Add emissive glow
                                if (child.material.emissive) {
                                    child.material.emissive.setHex(0x1a2a4a);
                                }
                            }
                        }
                    });
                    
                    this.scene.add(this.ghostModel);
                    
                    // Setup animations if available
                    if (gltf.animations && gltf.animations.length > 0) {
                        this.mixer = new THREE.AnimationMixer(this.ghostModel);
                        const action = this.mixer.clipAction(gltf.animations[0]);
                        action.play();
                        console.log('▶️ Playing animation:', gltf.animations[0].name);
                    }
                    
                    // Start floating animation
                    this.startFloatingAnimation();
                    
                    resolve();
                },
                (progress) => {
                    const percent = Math.round((progress.loaded / progress.total) * 100);
                    console.log(`📈 Loading: ${percent}% (${progress.loaded}/${progress.total})`);
                },
                (error) => {
                    console.error('❌ Ghost loading failed:', error);
                    reject(new Error(`Failed to load ghost: ${error.message}`));
                }
            );
        });
    }
    
    startFloatingAnimation() {
        if (!this.ghostModel) return;
        
        // Simple floating animation using GSAP-like behavior (manual implementation)
        this.floatOffset = 0;
        this.originalY = this.ghostModel.position.y;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        // Update animations
        if (this.mixer) {
            this.mixer.update(delta);
        }
        
        // Update floating
        if (this.ghostModel) {
            this.floatOffset += delta * 2; // Speed of floating
            this.ghostModel.position.y = this.originalY + Math.sin(this.floatOffset) * 0.3;
            
            // Slight rotation
            this.ghostModel.rotation.y += delta * 0.2;
        }
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Initialize the ghost when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    const ghost = new ThreeJSGhost();
    ghost.init();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        ghost.dispose();
    });
});
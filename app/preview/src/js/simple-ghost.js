// Simple Ghost Character using Babylon.js
class SimpleGhost {
    constructor() {
        this.canvas = document.getElementById("renderCanvas");
        this.engine = null;
        this.scene = null;
        this.camera = null;
        this.ghostMesh = null;
    }

    async init() {
        try {
            console.log('🔧 Initializing simple ghost...');
            
            // Create engine
            this.engine = new BABYLON.Engine(this.canvas, true);
            console.log('✅ Engine created');
            
            // Create scene
            this.scene = new BABYLON.Scene(this.engine);
            this.scene.clearColor = new BABYLON.Color3(0.05, 0.05, 0.15);
            console.log('✅ Scene created');
            
            // Create camera
            this.camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 2, -5), this.scene);
            this.camera.setTarget(new BABYLON.Vector3(0, 1, 0));
            console.log('✅ Camera created');
            
            // Create lighting
            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
            light.intensity = 0.8;
            console.log('✅ Lighting created');
            
            // Load the ghost GLB file
            await this.loadGhost();
            
            // Start render loop
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
            
            // Handle resize
            window.addEventListener("resize", () => {
                this.engine.resize();
            });
            
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
            BABYLON.SceneLoader.ImportMesh("", "assets/characters/Ghost/", "Mesh.glb", this.scene, 
                (meshes, particleSystems, skeletons, animationGroups) => {
                    console.log(`✅ Ghost loaded: ${meshes.length} meshes, ${animationGroups.length} animations`);
                    
                    if (meshes.length === 0) {
                        reject(new Error('No meshes found in GLB file'));
                        return;
                    }
                    
                    // Store the main mesh
                    this.ghostMesh = meshes[0];
                    
                    // Scale and position the ghost
                    this.ghostMesh.scaling = new BABYLON.Vector3(2, 2, 2);
                    this.ghostMesh.position = new BABYLON.Vector3(0, 0, 0);
                    
                    // Make it slightly transparent and glowing
                    if (this.ghostMesh.material) {
                        this.ghostMesh.material.alpha = 0.9;
                        if (this.ghostMesh.material.emissiveColor) {
                            this.ghostMesh.material.emissiveColor = new BABYLON.Color3(0.1, 0.2, 0.3);
                        }
                    }
                    
                    // Start floating animation
                    this.startFloatingAnimation();
                    
                    // Play any animations if available
                    if (animationGroups && animationGroups.length > 0) {
                        console.log('▶️ Starting animation:', animationGroups[0].name);
                        animationGroups[0].start(true);
                    }
                    
                    resolve();
                },
                (progress) => {
                    console.log(`📈 Loading: ${Math.round((progress.loaded / progress.total) * 100)}%`);
                },
                (scene, message, exception) => {
                    console.error('❌ Ghost loading failed:', message, exception);
                    reject(new Error(`Failed to load ghost: ${message}`));
                }
            );
        });
    }
    
    startFloatingAnimation() {
        if (!this.ghostMesh) return;
        
        // Simple floating animation
        const animationKeys = [];
        animationKeys.push({
            frame: 0,
            value: 0
        });
        animationKeys.push({
            frame: 60,
            value: 0.3
        });
        animationKeys.push({
            frame: 120,
            value: 0
        });
        
        const floatAnimation = new BABYLON.Animation("ghostFloat", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        floatAnimation.setKeys(animationKeys);
        
        this.ghostMesh.animations.push(floatAnimation);
        this.scene.beginAnimation(this.ghostMesh, 0, 120, true);
    }
    
    dispose() {
        if (this.engine) {
            this.engine.dispose();
        }
    }
}

// Initialize the ghost when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    const ghost = new SimpleGhost();
    ghost.init();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        ghost.dispose();
    });
});
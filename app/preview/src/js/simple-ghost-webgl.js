// Simple Ghost with WebGL detection
(function() {
    console.log('Starting ghost initialization...');
    
    // First, check if WebGL is available
    function checkWebGL() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }
    
    if (!checkWebGL()) {
        console.error('WebGL not available!');
        document.getElementById('loading').innerHTML = 'WebGL not available. Please enable hardware acceleration in your browser settings.';
        document.getElementById('loading').style.color = '#ff6666';
        return;
    }
    
    console.log('WebGL is available, proceeding...');
    
    // Simple Three.js implementation
    class Ghost {
        constructor() {
            this.scene = null;
            this.camera = null;
            this.renderer = null;
            this.mesh = null;
            this.time = 0;
        }
        
        init() {
            try {
                // Scene
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color(0x0d0d1f);
                
                // Camera
                this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
                this.camera.position.z = 5;
                
                // Renderer - with explicit context
                const canvas = document.getElementById('renderCanvas');
                this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                
                // Simple ghost geometry
                const geometry = new THREE.SphereGeometry(1, 32, 32);
                const material = new THREE.MeshBasicMaterial({ 
                    color: 0xf0f0ff,
                    transparent: true,
                    opacity: 0.8
                });
                this.mesh = new THREE.Mesh(geometry, material);
                this.scene.add(this.mesh);
                
                // Light
                const light = new THREE.DirectionalLight(0xffffff, 1);
                light.position.set(1, 1, 1);
                this.scene.add(light);
                
                // Hide loading
                document.getElementById('loading').style.display = 'none';
                
                // Start animation
                this.animate();
                
                console.log('Ghost initialized successfully!');
                
            } catch (error) {
                console.error('Failed to initialize:', error);
                document.getElementById('loading').innerHTML = 'Error: ' + error.message;
            }
        }
        
        animate() {
            requestAnimationFrame(() => this.animate());
            
            this.time += 0.01;
            
            // Float animation
            if (this.mesh) {
                this.mesh.position.y = Math.sin(this.time * 2) * 0.3;
                this.mesh.rotation.y += 0.01;
            }
            
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    // Wait for Three.js to load
    function waitForThree() {
        if (typeof THREE !== 'undefined') {
            console.log('Three.js loaded, creating ghost...');
            const ghost = new Ghost();
            ghost.init();
        } else {
            console.log('Waiting for Three.js...');
            setTimeout(waitForThree, 100);
        }
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForThree);
    } else {
        waitForThree();
    }
})();
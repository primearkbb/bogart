// Character building and 3D model creation for Ghost Character
class CharacterBuilder {
    constructor(scene) {
        this.scene = scene;
        this.config = GHOST_CHARACTER_CONFIG.character;
        
        // Register FBX loader if available
        this.initializeFBXLoader();
    }
    
    initializeFBXLoader() {
        // Wait for scripts to load and try to initialize FBX loader
        const initializeLoader = () => {
            console.log("🔍 Checking for FBX loader availability...");
            console.log("Global objects:", Object.keys(window).filter(k => k.includes('FBX') || k.includes('fbx')));
            console.log("FBXLoader available:", typeof FBXLoader !== 'undefined');
            console.log("BABYLONJS FBX available:", typeof BABYLONJS !== 'undefined' && BABYLONJS.FBXLoader);
            console.log("BABYLON.SceneLoader available:", typeof BABYLON !== 'undefined' && BABYLON.SceneLoader);
            
            let FBXLoaderClass = null;
            
            // Try different ways to access the FBX loader
            if (typeof FBXLoader !== 'undefined') {
                FBXLoaderClass = FBXLoader;
                console.log("📦 Using global FBXLoader");
            } else if (typeof BABYLONJS !== 'undefined' && BABYLONJS.FBXLoader) {
                FBXLoaderClass = BABYLONJS.FBXLoader;
                console.log("📦 Using BABYLONJS.FBXLoader");
            } else if (window.BABYLONJS && window.BABYLONJS.FBXLoader) {
                FBXLoaderClass = window.BABYLONJS.FBXLoader;
                console.log("📦 Using window.BABYLONJS.FBXLoader");
            }
            
            if (FBXLoaderClass && BABYLON.SceneLoader) {
                console.log("🔧 Registering FBX loader plugin...");
                try {
                    BABYLON.SceneLoader.RegisterPlugin(new FBXLoaderClass());
                    console.log("✅ FBX loader registered successfully");
                    
                    // Test if FBX extension is now supported
                    const isSupported = BABYLON.SceneLoader.IsPluginForExtensionAvailable('.fbx');
                    console.log("📋 FBX extension supported:", isSupported);
                    return true;
                } catch (error) {
                    console.error("❌ Failed to register FBX loader:", error);
                }
            } else {
                console.error("❌ FBX loader not available");
                console.error("Available loaders:", BABYLON.SceneLoader ? Object.keys(BABYLON.SceneLoader._registeredPlugins || {}) : 'SceneLoader not available');
            }
            return false;
        };
        
        // Try immediately
        if (initializeLoader()) return;
        
        // Try again after a delay
        setTimeout(() => {
            if (initializeLoader()) return;
            
            // Final attempt after longer delay
            setTimeout(initializeLoader, 1000);
        }, 500);
    }
    
    createMaterials() {
        const materials = {};
        
        // Ghost material (ethereal translucent) - improved
        materials.ghost = new BABYLON.StandardMaterial("ghostMat", this.scene);
        const ghostConfig = this.config.materials.ghost;
        materials.ghost.diffuseColor = new BABYLON.Color3(0.95, 0.98, 1.0);
        materials.ghost.specularColor = new BABYLON.Color3(0.9, 0.95, 1.0);
        materials.ghost.emissiveColor = new BABYLON.Color3(0.15, 0.25, 0.4);
        materials.ghost.specularPower = 200;
        materials.ghost.alpha = 0.85;
        materials.ghost.alphaMode = BABYLON.Engine.ALPHA_BLEND;
        materials.ghost.backFaceCulling = false;
        
        // Eye material (ethereal glowing blue) - improved
        materials.eye = new BABYLON.StandardMaterial("eyeMat", this.scene);
        materials.eye.diffuseColor = new BABYLON.Color3(0.4, 0.7, 1.0);
        materials.eye.emissiveColor = new BABYLON.Color3(0.3, 0.5, 0.8);
        materials.eye.specularPower = 400;
        materials.eye.specularColor = new BABYLON.Color3(0.8, 0.9, 1.0);
        
        // Dark material (pupils, ethereal features)
        materials.dark = new BABYLON.StandardMaterial("darkMat", this.scene);
        const darkConfig = this.config.materials.dark;
        materials.dark.diffuseColor = new BABYLON.Color3(darkConfig.diffuse.r, darkConfig.diffuse.g, darkConfig.diffuse.b);
        materials.dark.specularColor = new BABYLON.Color3(darkConfig.specular.r, darkConfig.specular.g, darkConfig.specular.b);
        materials.dark.specularPower = darkConfig.specularPower;
        materials.dark.alpha = 0.8;
        materials.dark.alphaMode = BABYLON.Engine.ALPHA_BLEND;
        
        // Ground material (ethereal mist)
        materials.ground = new BABYLON.StandardMaterial("groundMat", this.scene);
        materials.ground.diffuseColor = new BABYLON.Color3(0.08, 0.12, 0.18);
        materials.ground.specularColor = new BABYLON.Color3(0.1, 0.15, 0.2);
        materials.ground.emissiveColor = new BABYLON.Color3(0.02, 0.05, 0.1);
        
        return materials;
    }
    
    async createCharacter() {
        const materials = this.createMaterials();
        
        // Create ghost root
        const ghostRoot = new BABYLON.TransformNode("ghostRoot", this.scene);
        const parts = { root: ghostRoot };
        
        console.log("🚀 Starting Ghost GLB model loading...");
        
        // GLB is supported out of the box by Babylon.js
        console.log("🎯 GLB loader available, loading Ghost mesh...");
        const meshResult = await this.loadGhostMesh(ghostRoot, materials);
        
        if (meshResult.success) {
            console.log("✅ Ghost GLB mesh loaded successfully");
            parts.meshes = meshResult.meshes;
            parts.skeleton = meshResult.skeleton;
            parts.animationGroups = meshResult.animationGroups;
            
            // Set up animations
            this.setupGhostAnimations(parts);
            
            return { parts, materials };
        } else {
            throw new Error(`Ghost GLB character loading failed: ${meshResult.error}`);
        }
    }

    createProceduralCharacter(ghostRoot, materials) {
        const parts = { root: ghostRoot };
        
        // Create simplified ghost geometry
        const ghostGeometry = this.createSimpleGhostGeometry(materials.ghost, ghostRoot);
        parts.head = ghostGeometry.head;
        parts.body = ghostGeometry.body;
        
        // Eyes (better proportioned and positioned)
        parts.leftEye = this.createEye("leftEye", -0.25, 2.2, 0.5, materials.eye, ghostRoot);
        parts.rightEye = this.createEye("rightEye", 0.25, 2.2, 0.5, materials.eye, ghostRoot);
        
        // Pupils (properly sized)
        parts.leftPupil = this.createPupil("leftPupil", -0.25, 2.2, 0.52, materials.dark, ghostRoot);
        parts.rightPupil = this.createPupil("rightPupil", 0.25, 2.2, 0.52, materials.dark, ghostRoot);
        
        // Mouth (subtle, ethereal)
        parts.mouth = this.createMouth(materials.dark, ghostRoot);
        
        // Simple floating arms - better positioned
        parts.leftArm = this.createSimpleArm("leftArm", -0.7, 1.6, 0.2, materials.ghost, ghostRoot);
        parts.rightArm = this.createSimpleArm("rightArm", 0.7, 1.6, -0.2, materials.ghost, ghostRoot);
        
        return { parts, materials };
    }
    
    createEnhancedProceduralCharacter(ghostRoot, materials) {
        const parts = { root: ghostRoot };
        
        console.log("🎨 Building enhanced ghost with more detail...");
        
        // Create more detailed ghost geometry with better proportions
        const ghostGeometry = this.createDetailedGhostGeometry(materials.ghost, ghostRoot);
        parts.head = ghostGeometry.head;
        parts.body = ghostGeometry.body;
        parts.bodySegments = ghostGeometry.segments; // Multiple body segments for better animation
        
        // More realistic eyes with pupils
        parts.leftEye = this.createDetailedEye("leftEye", -0.3, 2.3, 0.5, materials.eye, ghostRoot);
        parts.rightEye = this.createDetailedEye("rightEye", 0.3, 2.3, 0.5, materials.eye, ghostRoot);
        
        // Pupils with slight glow
        parts.leftPupil = this.createGlowingPupil("leftPupil", -0.3, 2.3, 0.52, materials.dark, ghostRoot);
        parts.rightPupil = this.createGlowingPupil("rightPupil", 0.3, 2.3, 0.52, materials.dark, ghostRoot);
        
        // More expressive mouth
        parts.mouth = this.createExpressiveMouth(materials.dark, ghostRoot);
        
        // More detailed floating arms with segments
        const leftArmData = this.createSegmentedArm("leftArm", -0.8, 1.8, 0.3, materials.ghost, ghostRoot);
        const rightArmData = this.createSegmentedArm("rightArm", 0.8, 1.8, -0.3, materials.ghost, ghostRoot);
        
        parts.leftArm = leftArmData.root;
        parts.rightArm = rightArmData.root;
        parts.armSegments = {
            left: leftArmData.segments,
            right: rightArmData.segments
        };
        
        // Add some ethereal wisps
        parts.wisps = this.createEtherealWisps(materials.ghost, ghostRoot);
        
        console.log("✨ Enhanced procedural ghost created with detailed segments");
        
        return { parts, materials };
    }
    
    createSimpleGhostGeometry(material, parent) {
        // Create a simple, clean ghost geometry with improved proportions
        
        // Head: Full sphere positioned better
        const head = BABYLON.MeshBuilder.CreateSphere("ghostHead", {
            diameter: 1.2,
            segments: 24
        }, this.scene);
        head.position.y = 2.1;
        head.material = material;
        head.parent = parent;
        
        // Body: Improved shape with better proportions
        const body = this.createImprovedGhostBody("ghostBody", material, parent);
        
        return { head, body };
    }
    
    createImprovedGhostBody(name, material, parent) {
        // Create a simple but elegant ghost body shape
        const body = BABYLON.MeshBuilder.CreateCylinder(name, {
            height: 2.2,
            diameterTop: 1.0,
            diameterBottom: 1.4,
            tessellation: 16,
            faceColors: [
                new BABYLON.Color4(0.95, 0.98, 1.0, 0.85), // top
                new BABYLON.Color4(0.9, 0.95, 1.0, 0.7),   // bottom
                new BABYLON.Color4(0.95, 0.98, 1.0, 0.8)   // sides
            ]
        }, this.scene);
        
        body.position.y = 1.0;
        body.material = material;
        body.parent = parent;
        
        // Add wavy bottom edge using simple scaling animation
        body.scaling.y = 1.0;
        
        return body;
    }

    createWavyBottomCylinder(name, material, parent) {
        // Create custom geometry for cylinder with wavy bottom edge
        const height = 2.0;
        const radius = 0.6;
        const segments = 32;
        const waveAmplitude = 0.1;
        const waveFrequency = 6;
        
        const positions = [];
        const indices = [];
        const normals = [];
        const uvs = [];
        
        // Create vertices
        // Top center vertex
        positions.push(0, height / 2, 0);
        normals.push(0, 1, 0);
        uvs.push(0.5, 0.5);
        
        // Top ring vertices
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            positions.push(x, height / 2, z);
            normals.push(0, 1, 0);
            uvs.push(0.5 + Math.cos(angle) * 0.5, 0.5 + Math.sin(angle) * 0.5);
        }
        
        // Body vertices (straight sides)
        for (let ring = 0; ring <= 10; ring++) {
            const y = height / 2 - (ring / 10) * height;
            
            for (let i = 0; i <= segments; i++) {
                const angle = (i / segments) * Math.PI * 2;
                let currentRadius = radius;
                
                // Add wavy effect to bottom rings
                if (ring > 7) {
                    const waveProgress = (ring - 7) / 3; // Last 3 rings get wavy
                    const wave = Math.sin(angle * waveFrequency) * waveAmplitude * waveProgress;
                    currentRadius += wave;
                }
                
                const x = Math.cos(angle) * currentRadius;
                const z = Math.sin(angle) * currentRadius;
                
                positions.push(x, y, z);
                
                // Normal calculation
                const normal = new BABYLON.Vector3(x, 0, z).normalize();
                normals.push(normal.x, normal.y, normal.z);
                
                // UV coordinates
                uvs.push(i / segments, 1 - ring / 10);
            }
        }
        
        // Create indices
        // Top cap
        for (let i = 0; i < segments; i++) {
            indices.push(0, i + 1, i + 2 > segments ? 1 : i + 2);
        }
        
        // Body rings
        for (let ring = 0; ring < 10; ring++) {
            const ringStart = 1 + segments + 1 + ring * (segments + 1);
            const nextRingStart = ringStart + segments + 1;
            
            for (let i = 0; i < segments; i++) {
                const current = ringStart + i;
                const next = ringStart + i + 1;
                const currentNext = nextRingStart + i;
                const nextNext = nextRingStart + i + 1;
                
                // Two triangles per quad
                indices.push(current, nextNext, next);
                indices.push(current, currentNext, nextNext);
            }
        }
        
        // Create the mesh
        const mesh = new BABYLON.Mesh(name, this.scene);
        const vertexData = new BABYLON.VertexData();
        
        vertexData.positions = positions;
        vertexData.indices = indices;
        vertexData.normals = normals;
        vertexData.uvs = uvs;
        
        vertexData.applyToMesh(mesh);
        
        mesh.position.y = 1.0;
        mesh.material = material;
        mesh.parent = parent;
        
        return mesh;
    }
    
    createSimpleArm(name, x, y, rotZ, material, parent) {
        // Simple tapered cylinder for arms - improved proportions
        const arm = BABYLON.MeshBuilder.CreateCylinder(name, {
            height: 0.8,
            diameterTop: 0.18,
            diameterBottom: 0.12,
            tessellation: 12
        }, this.scene);
        arm.position.set(x, y, 0);
        arm.rotation.z = rotZ;
        arm.material = material;
        arm.parent = parent;
        return arm;
    }
    
    
    createEye(name, x, y, z, material, parent) {
        const eye = BABYLON.MeshBuilder.CreateSphere(name, {
            diameter: 0.2,
            segments: 12
        }, this.scene);
        eye.position.set(x, y, z);
        eye.material = material;
        eye.parent = parent;
        return eye;
    }
    
    createPupil(name, x, y, z, material, parent) {
        const pupil = BABYLON.MeshBuilder.CreateSphere(name, {
            diameter: 0.08,
            segments: 8
        }, this.scene);
        pupil.position.set(x, y, z);
        pupil.material = material;
        pupil.parent = parent;
        return pupil;
    }
    
    createMouth(material, parent) {
        // Subtle ethereal mouth - small and mysterious
        const mouth = BABYLON.MeshBuilder.CreateSphere("mouth", {
            diameter: 0.12,
            segments: 8
        }, this.scene);
        mouth.position.set(0, 2.0, 0.52);
        mouth.scaling.set(1.2, 0.6, 0.8);
        mouth.material = material;
        mouth.parent = parent;
        return mouth;
    }
    
    
    createGround(materials) {
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {
            width: 30,
            height: 30,
            subdivisions: 8
        }, this.scene);
        ground.material = materials.ground;
        ground.receiveShadows = true;
        return ground;
    }
    
    async loadGhostMesh(ghostRoot, materials) {
        const meshPath = "assets/characters/Ghost/";
        const meshFile = "Mesh.glb";
        console.log("🔄 Attempting to load Ghost mesh from:", meshPath + meshFile);
        console.log("Full URL:", window.location.origin + window.location.pathname + meshPath + meshFile);
        
        // Check if GLB loader is available (should always be true)
        if (!BABYLON.SceneLoader.IsPluginForExtensionAvailable('.glb')) {
            console.error("❌ GLB loader plugin is not available");
            return { success: false, error: "GLB loader not available" };
        }
        
        console.log("✅ GLB loader is available");
        
        return new Promise((resolve) => {
            // Add progress callback to see loading progress
            const onProgress = (progress) => {
                if (progress.total > 0) {
                    const percent = Math.round((progress.loaded / progress.total) * 100);
                    console.log(`📈 Loading progress: ${percent}%`);
                }
            };
            
            const onError = (scene, message, exception) => {
                console.error("❌ Failed to load Ghost mesh:", message);
                if (exception) {
                    console.error("Exception details:", exception);
                }
                console.error("Full path attempted:", window.location.origin + "/" + meshPath + meshFile);
                resolve({ success: false, error: message || "Unknown error" });
            };
            
            const onSuccess = (meshes, particleSystems, skeletons, animationGroups) => {
                console.log("🎉 GLB load success!");
                console.log(`📊 Loaded: ${meshes.length} meshes, ${skeletons.length} skeletons, ${animationGroups.length} animations`);
                
                if (meshes && meshes.length > 0) {
                    // Log mesh details
                    meshes.forEach((mesh, i) => {
                        console.log(`  Mesh ${i}: ${mesh.name} (vertices: ${mesh.getTotalVertices()})`);
                    });
                    
                    // Log animation details
                    if (animationGroups && animationGroups.length > 0) {
                        animationGroups.forEach((anim, i) => {
                            console.log(`  Animation ${i}: ${anim.name} (${anim.from}-${anim.to} frames)`);
                        });
                    }
                    
                    // Parent all meshes to ghost root
                    meshes.forEach(mesh => {
                        if (mesh.parent === null) {
                            mesh.parent = ghostRoot;
                        }
                        
                        // Apply ghost materials to all meshes
                        if (mesh.material) {
                            // Keep existing material but make it ethereal
                            mesh.material.alpha = 0.85;
                            mesh.material.alphaMode = BABYLON.Engine.ALPHA_BLEND;
                            mesh.material.backFaceCulling = false;
                            
                            // Add ethereal glow
                            if (mesh.material.emissiveColor) {
                                mesh.material.emissiveColor = new BABYLON.Color3(0.15, 0.25, 0.4);
                            }
                        } else {
                            mesh.material = materials.ghost;
                        }
                    });
                    
                    // Scale the ghost appropriately
                    ghostRoot.scaling = new BABYLON.Vector3(2, 2, 2);
                    
                    resolve({
                        success: true,
                        meshes,
                        skeleton: skeletons[0],
                        animationGroups: animationGroups || []
                    });
                } else {
                    console.warn("⚠️ GLB loaded but no meshes found");
                    resolve({ success: false, error: "No meshes in GLB file" });
                }
            };
            
            BABYLON.SceneLoader.ImportMesh("", meshPath, meshFile, this.scene, onSuccess, onProgress, onError);
        });
    }
    
    setupGhostAnimations(parts) {
        // GLB files include animations, so we just need to set up the default idle animation
        if (parts.animationGroups && parts.animationGroups.length > 0) {
            console.log("🎭 Setting up ghost animations...");
            
            // Find and start idle animation if available
            const idleAnimation = parts.animationGroups.find(anim => 
                anim.name.toLowerCase().includes('idle') || 
                anim.name.toLowerCase().includes('float') ||
                anim.name.toLowerCase().includes('default')
            );
            
            if (idleAnimation) {
                console.log(`▶️ Starting idle animation: ${idleAnimation.name}`);
                parts.idleAnimation = idleAnimation;
                idleAnimation.start(true, 1.0, idleAnimation.from, idleAnimation.to, false);
            } else if (parts.animationGroups.length > 0) {
                // If no idle animation found, use the first available animation
                console.log(`▶️ Starting first available animation: ${parts.animationGroups[0].name}`);
                parts.idleAnimation = parts.animationGroups[0];
                parts.animationGroups[0].start(true, 1.0, parts.animationGroups[0].from, parts.animationGroups[0].to, false);
            }
        } else {
            console.log("ℹ️ No animations found in GLB file");
        }
    }
    
    createParticleSystem(emitter) {
        // Simplified particle system for better performance
        const particleSystem = new BABYLON.ParticleSystem("etherealParticles", 300, this.scene);
        
        // Create simple white texture
        particleSystem.particleTexture = null; // Use default
        
        particleSystem.emitter = emitter;
        particleSystem.minEmitBox = new BABYLON.Vector3(-0.3, 0, -0.3);
        particleSystem.maxEmitBox = new BABYLON.Vector3(0.3, 0, 0.3);
        
        particleSystem.color1 = new BABYLON.Color4(0.8, 0.9, 1.0, 0.6);
        particleSystem.color2 = new BABYLON.Color4(0.6, 0.8, 0.9, 0.3);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0);
        
        particleSystem.minSize = 0.02;
        particleSystem.maxSize = 0.15;
        particleSystem.minLifeTime = 1.0;
        particleSystem.maxLifeTime = 2.0;
        particleSystem.emitRate = 50;
        
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        particleSystem.gravity = new BABYLON.Vector3(0, -0.5, 0);
        particleSystem.direction1 = new BABYLON.Vector3(-1, 1, -1);
        particleSystem.direction2 = new BABYLON.Vector3(1, 2, 1);
        particleSystem.minEmitPower = 0.3;
        particleSystem.maxEmitPower = 0.8;
        particleSystem.updateSpeed = 0.01;
        
        particleSystem.start();
        return particleSystem;
    }
    
    // Enhanced procedural methods
    createDetailedGhostGeometry(material, parent) {
        // Head with better proportions
        const head = BABYLON.MeshBuilder.CreateSphere("ghostHead", {
            diameter: 1.4,
            segments: 32 // More segments for smoother appearance
        }, this.scene);
        head.position.y = 2.2;
        head.material = material;
        head.parent = parent;
        
        // Multi-segment body for better animation
        const segments = [];
        const segmentCount = 4;
        
        for (let i = 0; i < segmentCount; i++) {
            const y = 1.6 - i * 0.4;
            const radius = 0.6 + i * 0.1; // Wider at bottom
            
            const segment = BABYLON.MeshBuilder.CreateSphere(`bodySegment${i}`, {
                diameter: radius * 2,
                segments: 24
            }, this.scene);
            
            segment.position.y = y;
            segment.scaling.y = 0.8; // Flatten slightly
            segment.material = material;
            segment.parent = parent;
            segments.push(segment);
        }
        
        // Main body is first segment
        const body = segments[0];
        
        return { head, body, segments };
    }
    
    createDetailedEye(name, x, y, z, material, parent) {
        const eye = BABYLON.MeshBuilder.CreateSphere(name, {
            diameter: 0.25,
            segments: 16
        }, this.scene);
        eye.position.set(x, y, z);
        eye.material = material;
        eye.parent = parent;
        return eye;
    }
    
    createGlowingPupil(name, x, y, z, material, parent) {
        const pupil = BABYLON.MeshBuilder.CreateSphere(name, {
            diameter: 0.1,
            segments: 12
        }, this.scene);
        pupil.position.set(x, y, z);
        pupil.material = material;
        pupil.parent = parent;
        return pupil;
    }
    
    createExpressiveMouth(material, parent) {
        const mouth = BABYLON.MeshBuilder.CreateTorus("mouth", {
            diameter: 0.2,
            thickness: 0.03,
            tessellation: 16
        }, this.scene);
        mouth.position.set(0, 2.0, 0.55);
        mouth.rotation.x = Math.PI / 2;
        mouth.scaling.set(1.5, 1.0, 0.6);
        mouth.material = material;
        mouth.parent = parent;
        return mouth;
    }
    
    createSegmentedArm(name, x, y, rotZ, material, parent) {
        const armRoot = new BABYLON.TransformNode(name + "Root", this.scene);
        armRoot.position.set(x, y, 0);
        armRoot.rotation.z = rotZ;
        armRoot.parent = parent;
        
        const segments = [];
        const segmentCount = 3;
        
        for (let i = 0; i < segmentCount; i++) {
            const segment = BABYLON.MeshBuilder.CreateCylinder(name + `Segment${i}`, {
                height: 0.3,
                diameterTop: 0.2 - i * 0.02,
                diameterBottom: 0.18 - i * 0.02,
                tessellation: 12
            }, this.scene);
            
            segment.position.y = -i * 0.25;
            segment.material = material;
            segment.parent = armRoot;
            segments.push(segment);
        }
        
        return { root: armRoot, segments };
    }
    
    createEtherealWisps(material, parent) {
        const wisps = [];
        const wispCount = 6;
        
        for (let i = 0; i < wispCount; i++) {
            const wisp = BABYLON.MeshBuilder.CreateSphere(`wisp${i}`, {
                diameter: 0.1 + Math.random() * 0.05,
                segments: 8
            }, this.scene);
            
            // Random position around ghost
            const angle = (i / wispCount) * Math.PI * 2;
            const radius = 1.2 + Math.random() * 0.5;
            wisp.position.set(
                Math.cos(angle) * radius,
                1.5 + Math.random() * 1.0,
                Math.sin(angle) * radius
            );
            
            // Create wisp material with higher transparency
            const wispMaterial = material.clone(`wispMat${i}`);
            wispMaterial.alpha = 0.3 + Math.random() * 0.2;
            wisp.material = wispMaterial;
            wisp.parent = parent;
            
            wisps.push(wisp);
        }
        
        return wisps;
    }
}
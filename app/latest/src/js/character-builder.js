// Character building and 3D model creation for Ghost Character
class CharacterBuilder {
    constructor(scene) {
        this.scene = scene;
        this.config = GHOST_CHARACTER_CONFIG.character;
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
    
    createCharacter() {
        const materials = this.createMaterials();
        const size = this.config.size;
        
        // Create ghost root
        const ghostRoot = new BABYLON.TransformNode("ghostRoot", this.scene);
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
}
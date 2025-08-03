// Character building and 3D model creation for Ghost Character
class CharacterBuilder {
    constructor(scene) {
        this.scene = scene;
        this.config = GHOST_CHARACTER_CONFIG.character;
    }
    
    createMaterials() {
        const materials = {};
        
        // Ghost material (ethereal translucent)
        materials.ghost = new BABYLON.StandardMaterial("ghostMat", this.scene);
        const ghostConfig = this.config.materials.ghost;
        materials.ghost.diffuseColor = new BABYLON.Color3(ghostConfig.diffuse.r, ghostConfig.diffuse.g, ghostConfig.diffuse.b);
        materials.ghost.specularColor = new BABYLON.Color3(ghostConfig.specular.r, ghostConfig.specular.g, ghostConfig.specular.b);
        materials.ghost.emissiveColor = new BABYLON.Color3(ghostConfig.emissive.r, ghostConfig.emissive.g, ghostConfig.emissive.b);
        materials.ghost.specularPower = ghostConfig.specularPower;
        materials.ghost.roughness = ghostConfig.roughness;
        materials.ghost.alpha = ghostConfig.alpha;
        materials.ghost.alphaMode = BABYLON.Engine.ALPHA_BLEND;
        
        // Eye material (ethereal glowing blue)
        materials.eye = new BABYLON.StandardMaterial("eyeMat", this.scene);
        const eyeConfig = this.config.materials.eye;
        materials.eye.diffuseColor = new BABYLON.Color3(eyeConfig.diffuse.r, eyeConfig.diffuse.g, eyeConfig.diffuse.b);
        materials.eye.emissiveColor = new BABYLON.Color3(eyeConfig.emissive.r, eyeConfig.emissive.g, eyeConfig.emissive.b);
        materials.eye.specularPower = eyeConfig.specularPower;
        
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
        
        // Eyes (larger, more ethereal)
        parts.leftEye = this.createEye("leftEye", -0.35, 2.1, 0.6, materials.eye, ghostRoot);
        parts.rightEye = this.createEye("rightEye", 0.35, 2.1, 0.6, materials.eye, ghostRoot);
        
        // Pupils (smaller, more mysterious)
        parts.leftPupil = this.createPupil("leftPupil", -0.35, 2.1, 0.65, materials.dark, ghostRoot);
        parts.rightPupil = this.createPupil("rightPupil", 0.35, 2.1, 0.65, materials.dark, ghostRoot);
        
        // Mouth (subtle, ethereal)
        parts.mouth = this.createMouth(materials.dark, ghostRoot);
        
        // Simple floating arms
        parts.leftArm = this.createSimpleArm("leftArm", -0.8, 1.4, 0.3, materials.ghost, ghostRoot);
        parts.rightArm = this.createSimpleArm("rightArm", 0.8, 1.4, -0.3, materials.ghost, ghostRoot);
        
        return { parts, materials };
    }
    
    createSimpleGhostGeometry(material, parent) {
        // Create a simple, clean ghost geometry with:
        // - Semi-sphere head on top
        // - Cylinder body 
        // - Wavy bottom edge
        
        // Head: Semi-sphere (hemisphere)
        const head = BABYLON.MeshBuilder.CreateSphere("ghostHead", {
            diameter: 1.4,
            segments: 32,
            slice: Math.PI // Only upper half (hemisphere)
        }, this.scene);
        head.position.y = 2.3;
        head.material = material;
        head.parent = parent;
        
        // Body: Cylinder with custom wavy bottom
        const body = this.createWavyBottomCylinder("ghostBody", material, parent);
        
        return { head, body };
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
        // Simple tapered cylinder for arms
        const arm = BABYLON.MeshBuilder.CreateCylinder(name, {
            height: 1.0,
            diameterTop: 0.25,
            diameterBottom: 0.15,
            tessellation: 16
        }, this.scene);
        arm.position.set(x, y, 0);
        arm.rotation.z = rotZ;
        arm.material = material;
        arm.parent = parent;
        return arm;
    }
    
    
    createEye(name, x, y, z, material, parent) {
        const eye = BABYLON.MeshBuilder.CreateSphere(name, {
            diameter: this.config.size.eyeDiameter,
            segments: 16
        }, this.scene);
        eye.position.set(x, y, z);
        eye.material = material;
        eye.parent = parent;
        return eye;
    }
    
    createPupil(name, x, y, z, material, parent) {
        const pupil = BABYLON.MeshBuilder.CreateSphere(name, {
            diameter: this.config.size.pupilDiameter,
            segments: 8
        }, this.scene);
        pupil.position.set(x, y, z);
        pupil.material = material;
        pupil.parent = parent;
        return pupil;
    }
    
    createMouth(material, parent) {
        // Subtle ethereal mouth - less prominent than the imp's
        const mouth = BABYLON.MeshBuilder.CreateTorus("mouth", {
            diameter: 0.3,
            thickness: 0.03,
            tessellation: 16
        }, this.scene);
        mouth.position.set(0, 1.8, 0.6);
        mouth.rotation.x = Math.PI / 2;
        mouth.scaling.y = 0.6;
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
        const config = GHOST_CHARACTER_CONFIG.particles;
        const particleSystem = new BABYLON.ParticleSystem("etherealParticles", config.count, this.scene);
        
        // Simple ethereal particle texture
        const etherealTexture = new BABYLON.Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAABklEQVQIHWPY/x8AAm8B6F6F0wsAAAAASUVORK5CYII=", this.scene);
        particleSystem.particleTexture = etherealTexture;
        
        particleSystem.emitter = emitter;
        particleSystem.minEmitBox = new BABYLON.Vector3(-0.8, 0, -0.8);
        particleSystem.maxEmitBox = new BABYLON.Vector3(0.8, 0, 0.8);
        
        const startColor = config.colors.start;
        const endColor = config.colors.end;
        particleSystem.color1 = new BABYLON.Color4(startColor.r, startColor.g, startColor.b, startColor.a);
        particleSystem.color2 = new BABYLON.Color4(endColor.r, endColor.g, endColor.b, endColor.a);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0);
        
        particleSystem.minSize = config.minSize;
        particleSystem.maxSize = config.maxSize;
        particleSystem.minLifeTime = config.minLifeTime;
        particleSystem.maxLifeTime = config.maxLifeTime;
        particleSystem.emitRate = config.emitRate;
        
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        particleSystem.gravity = new BABYLON.Vector3(0, -1, 0); // Gentle downward drift
        particleSystem.direction1 = new BABYLON.Vector3(-2, 3, -2);
        particleSystem.direction2 = new BABYLON.Vector3(2, 5, 2);
        particleSystem.minEmitPower = 0.5;
        particleSystem.maxEmitPower = 1.5;
        particleSystem.updateSpeed = 0.008; // Slower, more ethereal movement
        
        // Add ethereal particle behavior
        particleSystem.startSizeFunction = () => {
            return config.minSize + Math.random() * (config.maxSize - config.minSize);
        };
        
        particleSystem.start();
        return particleSystem;
    }
}
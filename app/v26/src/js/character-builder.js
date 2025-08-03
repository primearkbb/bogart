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
        
        // Head (more elongated and ethereal)
        parts.head = BABYLON.MeshBuilder.CreateSphere("head", {
            diameter: size.headDiameter,
            segments: 32
        }, this.scene);
        parts.head.position.y = 2.0;
        parts.head.scaling.y = 1.1; // Slightly elongated
        parts.head.material = materials.ghost;
        parts.head.parent = ghostRoot;
        
        // Body (flowing, ethereal form)
        parts.body = BABYLON.MeshBuilder.CreateSphere("body", {
            diameter: size.bodyDiameter,
            segments: 32
        }, this.scene);
        parts.body.position.y = 1;
        parts.body.scaling.set(1.2, 1.6, 1.0); // More flowing shape
        parts.body.material = materials.ghost;
        parts.body.parent = ghostRoot;
        
        // Ethereal wispy extensions instead of horns
        parts.leftWisp = this.createWisp("leftWisp", -0.4, 2.8, 0, materials.ghost, ghostRoot);
        parts.rightWisp = this.createWisp("rightWisp", 0.4, 2.8, 0, materials.ghost, ghostRoot);
        
        // Eyes (larger, more ethereal)
        parts.leftEye = this.createEye("leftEye", -0.35, 2.1, 0.6, materials.eye, ghostRoot);
        parts.rightEye = this.createEye("rightEye", 0.35, 2.1, 0.6, materials.eye, ghostRoot);
        
        // Pupils (smaller, more mysterious)
        parts.leftPupil = this.createPupil("leftPupil", -0.35, 2.1, 0.65, materials.dark, ghostRoot);
        parts.rightPupil = this.createPupil("rightPupil", 0.35, 2.1, 0.65, materials.dark, ghostRoot);
        
        // Mouth (subtle, ethereal)
        parts.mouth = this.createMouth(materials.dark, ghostRoot);
        
        // Limbs (translucent, flowing)
        parts.leftArm = this.createArm("leftArm", -0.8, 1.4, 0.3, materials.ghost, ghostRoot);
        parts.rightArm = this.createArm("rightArm", 0.8, 1.4, -0.3, materials.ghost, ghostRoot);
        
        // No legs - ghost tapers into ethereal mist
        parts.ghostTail = this.createGhostTail(materials.ghost, ghostRoot);
        
        return { parts, materials };
    }
    
    createWisp(name, x, y, z, material, parent) {
        // Create ethereal wispy extensions that float around the ghost's head
        const wisp = BABYLON.MeshBuilder.CreateSphere(name, {
            diameter: 0.4,
            segments: 16
        }, this.scene);
        wisp.position.set(x, y, z);
        wisp.scaling.set(0.3, 0.8, 0.3); // Elongated wispy shape
        wisp.material = material;
        wisp.parent = parent;
        
        // Add subtle rotation animation
        const wisps = [wisp];
        for (let i = 1; i < 3; i++) {
            const childWisp = BABYLON.MeshBuilder.CreateSphere(name + "_child" + i, {
                diameter: 0.2 - i * 0.05,
                segments: 12
            }, this.scene);
            childWisp.position.set(0, i * 0.3, 0);
            childWisp.material = material;
            childWisp.parent = wisp;
            wisps.push(childWisp);
        }
        
        return wisp;
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
    
    createArm(name, x, y, rotZ, material, parent) {
        // Ghostly arms that taper and become more ethereal
        const arm = BABYLON.MeshBuilder.CreateCylinder(name, {
            height: 1.2,
            diameterTop: 0.3,
            diameterBottom: 0.1, // Tapers to wispy end
            tessellation: 16
        }, this.scene);
        arm.position.set(x, y, 0);
        arm.rotation.z = rotZ;
        arm.material = material;
        arm.parent = parent;
        return arm;
    }
    
    createGhostTail(material, parent) {
        // Ghost tapers into ethereal mist instead of having legs
        const tailSegments = [];
        for (let i = 0; i < 8; i++) {
            const segment = BABYLON.MeshBuilder.CreateSphere("ghostTailSeg" + i, {
                diameter: 1.0 - i * 0.12, // Starts wide and tapers
                segments: 16
            }, this.scene);
            segment.position.set(0, 0.5 - i * 0.08, 0);
            segment.scaling.y = 0.6 - i * 0.05; // Gets more compressed
            segment.material = material;
            segment.parent = parent;
            
            // Make lower segments more transparent
            if (i > 3) {
                const segmentMaterial = material.clone("ghostTailMat" + i);
                segmentMaterial.alpha = material.alpha * (1 - i * 0.1);
                segment.material = segmentMaterial;
            }
            
            tailSegments.push(segment);
        }
        return tailSegments;
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
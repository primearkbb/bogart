// Character building and 3D model creation
class CharacterBuilder {
    constructor(scene) {
        this.scene = scene;
        this.config = DEVIL_IMP_CONFIG.character;
    }
    
    createMaterials() {
        const materials = {};
        
        // Imp material (red skin)
        materials.imp = new BABYLON.StandardMaterial("impMat", this.scene);
        const impConfig = this.config.materials.imp;
        materials.imp.diffuseColor = new BABYLON.Color3(impConfig.diffuse.r, impConfig.diffuse.g, impConfig.diffuse.b);
        materials.imp.specularColor = new BABYLON.Color3(impConfig.specular.r, impConfig.specular.g, impConfig.specular.b);
        materials.imp.emissiveColor = new BABYLON.Color3(impConfig.emissive.r, impConfig.emissive.g, impConfig.emissive.b);
        materials.imp.specularPower = impConfig.specularPower;
        materials.imp.roughness = impConfig.roughness;
        
        // Eye material (glowing yellow)
        materials.eye = new BABYLON.StandardMaterial("eyeMat", this.scene);
        const eyeConfig = this.config.materials.eye;
        materials.eye.diffuseColor = new BABYLON.Color3(eyeConfig.diffuse.r, eyeConfig.diffuse.g, eyeConfig.diffuse.b);
        materials.eye.emissiveColor = new BABYLON.Color3(eyeConfig.emissive.r, eyeConfig.emissive.g, eyeConfig.emissive.b);
        materials.eye.specularPower = eyeConfig.specularPower;
        
        // Dark material (horns, pupils, mouth)
        materials.dark = new BABYLON.StandardMaterial("darkMat", this.scene);
        const darkConfig = this.config.materials.dark;
        materials.dark.diffuseColor = new BABYLON.Color3(darkConfig.diffuse.r, darkConfig.diffuse.g, darkConfig.diffuse.b);
        materials.dark.specularColor = new BABYLON.Color3(darkConfig.specular.r, darkConfig.specular.g, darkConfig.specular.b);
        materials.dark.specularPower = darkConfig.specularPower;
        
        // Ground material
        materials.ground = new BABYLON.StandardMaterial("groundMat", this.scene);
        materials.ground.diffuseColor = new BABYLON.Color3(0.15, 0.08, 0.08);
        materials.ground.specularColor = new BABYLON.Color3(0.1, 0.05, 0.05);
        
        return materials;
    }
    
    createCharacter() {
        const materials = this.createMaterials();
        const size = this.config.size;
        
        // Create imp root
        const impRoot = new BABYLON.TransformNode("impRoot", this.scene);
        const parts = { root: impRoot };
        
        // Head
        parts.head = BABYLON.MeshBuilder.CreateSphere("head", {
            diameter: size.headDiameter,
            segments: 32
        }, this.scene);
        parts.head.position.y = 1.8;
        parts.head.material = materials.imp;
        parts.head.parent = impRoot;
        
        // Body
        parts.body = BABYLON.MeshBuilder.CreateSphere("body", {
            diameter: size.bodyDiameter,
            segments: 32
        }, this.scene);
        parts.body.position.y = 1;
        parts.body.scaling.y = 1.4;
        parts.body.material = materials.imp;
        parts.body.parent = impRoot;
        
        // Horns
        parts.leftHorn = this.createHorn("leftHorn", -0.35, 2.6, -0.4, materials.dark, impRoot);
        parts.rightHorn = this.createHorn("rightHorn", 0.35, 2.6, 0.4, materials.dark, impRoot);
        
        // Eyes
        parts.leftEye = this.createEye("leftEye", -0.3, 1.95, 0.55, materials.eye, impRoot);
        parts.rightEye = this.createEye("rightEye", 0.3, 1.95, 0.55, materials.eye, impRoot);
        
        // Pupils
        parts.leftPupil = this.createPupil("leftPupil", -0.3, 1.95, 0.62, materials.dark, impRoot);
        parts.rightPupil = this.createPupil("rightPupil", 0.3, 1.95, 0.62, materials.dark, impRoot);
        
        // Mouth
        parts.mouth = this.createMouth(materials.dark, impRoot);
        
        // Limbs
        parts.leftArm = this.createArm("leftArm", -0.7, 1.3, 0.6, materials.imp, impRoot);
        parts.rightArm = this.createArm("rightArm", 0.7, 1.3, -0.6, materials.imp, impRoot);
        parts.leftLeg = this.createLeg("leftLeg", -0.3, 0.3, materials.imp, impRoot);
        parts.rightLeg = this.createLeg("rightLeg", 0.3, 0.3, materials.imp, impRoot);
        
        // Tail
        parts.tailSegments = this.createTail(materials.imp, impRoot);
        
        return { parts, materials };
    }
    
    createHorn(name, x, y, rotZ, material, parent) {
        const horn = BABYLON.MeshBuilder.CreateCylinder(name, {
            height: this.config.size.hornHeight,
            diameterBottom: 0.25,
            diameterTop: 0.02,
            tessellation: 12
        }, this.scene);
        horn.position.set(x, y, 0);
        horn.rotation.z = rotZ;
        horn.material = material;
        horn.parent = parent;
        return horn;
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
        const mouth = BABYLON.MeshBuilder.CreateTorus("mouth", {
            diameter: 0.5,
            thickness: 0.06,
            tessellation: 16
        }, this.scene);
        mouth.position.set(0, 1.6, 0.5);
        mouth.rotation.x = Math.PI / 2;
        mouth.scaling.y = 0.4;
        mouth.material = material;
        mouth.parent = parent;
        return mouth;
    }
    
    createArm(name, x, y, rotZ, material, parent) {
        const arm = BABYLON.MeshBuilder.CreateCylinder(name, {
            height: 1,
            diameter: 0.25,
            tessellation: 12
        }, this.scene);
        arm.position.set(x, y, 0);
        arm.rotation.z = rotZ;
        arm.material = material;
        arm.parent = parent;
        return arm;
    }
    
    createLeg(name, x, y, material, parent) {
        const leg = BABYLON.MeshBuilder.CreateCylinder(name, {
            height: 1,
            diameterTop: 0.25,
            diameterBottom: 0.3,
            tessellation: 12
        }, this.scene);
        leg.position.set(x, y, 0);
        leg.material = material;
        leg.parent = parent;
        return leg;
    }
    
    createTail(material, parent) {
        const tailSegments = [];
        for (let i = 0; i < 6; i++) {
            const segment = BABYLON.MeshBuilder.CreateSphere("tailSeg" + i, {
                diameter: 0.18 - i * 0.025,
                segments: 12
            }, this.scene);
            segment.position.set(0, 1 - i * 0.12, -0.4 - i * 0.25);
            segment.material = material;
            segment.parent = parent;
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
        const config = DEVIL_IMP_CONFIG.particles;
        const particleSystem = new BABYLON.ParticleSystem("fireParticles", config.count, this.scene);
        
        // Simple particle texture
        const fireTexture = new BABYLON.Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAABklEQVQIHWPY/x8AAm8B6F6F0wsAAAAASUVORK5CYII=", this.scene);
        particleSystem.particleTexture = fireTexture;
        
        particleSystem.emitter = emitter;
        particleSystem.minEmitBox = new BABYLON.Vector3(-0.5, 0, -0.5);
        particleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0, 0.5);
        
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
        particleSystem.gravity = new BABYLON.Vector3(0, 3, 0);
        particleSystem.direction1 = new BABYLON.Vector3(-1, 5, -1);
        particleSystem.direction2 = new BABYLON.Vector3(1, 5, 1);
        particleSystem.minEmitPower = 0.8;
        particleSystem.maxEmitPower = 1.5;
        particleSystem.updateSpeed = 0.008;
        
        particleSystem.start();
        return particleSystem;
    }
}
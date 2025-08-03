// Advanced character builder for Ghost Character with cutting-edge animation and materials
class AdvancedCharacterBuilder {
    constructor(scene) {
        this.scene = scene;
        this.config = GHOST_CHARACTER_CONFIG.character;
        this.animationManager = null;
        this.facialRig = null;
        this.skeletalSystem = null;
    }
    
    async createAdvancedCharacter() {
        // Create sophisticated materials first
        const materials = this.createAdvancedMaterials();
        
        // Create character with advanced rigging
        const characterData = await this.createRiggedCharacter(materials);
        
        // Setup advanced animation systems
        this.setupAdvancedAnimations(characterData);
        
        // Create facial expression system
        this.createFacialExpressionSystem(characterData);
        
        // Setup advanced lighting
        this.setupAdvancedLighting();
        
        // Create environment
        this.createAdvancedEnvironment(materials);
        
        return characterData;
    }
    
    createAdvancedMaterials() {
        const materials = {};
        
        // Advanced PBR material for ghost ethereal form
        materials.ghostForm = new BABYLON.PBRMaterial("advancedGhostForm", this.scene);
        materials.ghostForm.baseColor = new BABYLON.Color3(0.9, 0.95, 1.0);
        materials.ghostForm.metallicFactor = 0.0;
        materials.ghostForm.roughnessFactor = 0.1;
        materials.ghostForm.emissiveColor = new BABYLON.Color3(0.2, 0.3, 0.5);
        materials.ghostForm.alpha = 0.6;
        materials.ghostForm.alphaMode = BABYLON.Engine.ALPHA_BLEND;
        
        // Add ethereal subsurface scattering
        materials.ghostForm.subSurface.isScatteringEnabled = true;
        materials.ghostForm.subSurface.scatteringColor = new BABYLON.Color3(0.6, 0.8, 1.0);
        materials.ghostForm.subSurface.translucencyIntensity = 0.8;
        
        // Advanced eye material with ethereal properties
        materials.eyes = new BABYLON.PBRMaterial("advancedEyes", this.scene);
        materials.eyes.baseColor = new BABYLON.Color3(0.6, 0.8, 1.0);
        materials.eyes.metallicFactor = 0.2;
        materials.eyes.roughnessFactor = 0.0;
        materials.eyes.emissiveColor = new BABYLON.Color3(0.4, 0.6, 0.9);
        
        // Create procedural iris texture
        const irisTexture = new BABYLON.DynamicTexture("irisTexture", 256, this.scene);
        this.createIrisPattern(irisTexture);
        materials.eyes.baseTexture = irisTexture;
        
        // Advanced wispy material for ethereal extensions
        materials.wisps = new BABYLON.PBRMaterial("advancedWisps", this.scene);
        materials.wisps.baseColor = new BABYLON.Color3(0.8, 0.9, 1.0);
        materials.wisps.metallicFactor = 0.0;
        materials.wisps.roughnessFactor = 0.0;
        materials.wisps.emissiveColor = new BABYLON.Color3(0.3, 0.5, 0.8);
        materials.wisps.alpha = 0.4;
        materials.wisps.alphaMode = BABYLON.Engine.ALPHA_BLEND;
        
        // Add procedural ethereal patterns
        const wispTexture = new BABYLON.DynamicTexture("wispTexture", 512, this.scene);
        this.createWispTexture(wispTexture);
        materials.wisps.baseTexture = wispTexture;
        
        // Ethereal aura material
        materials.aura = new BABYLON.PBRMaterial("etherealAura", this.scene);
        materials.aura.baseColor = new BABYLON.Color3(0.7, 0.9, 1.0);
        materials.aura.emissiveColor = new BABYLON.Color3(0.4, 0.7, 1.0);
        materials.aura.alpha = 0.3;
        materials.aura.alphaMode = BABYLON.Engine.ALPHA_BLEND;
        
        return materials;
    }
    
    createIrisPattern(texture) {
        const context = texture.getContext();
        const size = texture.getSize();
        
        // Create realistic iris pattern
        const centerX = size.width / 2;
        const centerY = size.height / 2;
        const radius = size.width / 2;
        
        const imageData = context.createImageData(size.width, size.height);
        const data = imageData.data;
        
        for (let y = 0; y < size.height; y++) {
            for (let x = 0; x < size.width; x++) {
                const index = (y * size.width + x) * 4;
                const dx = x - centerX;
                const dy = y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx);
                
                if (distance < radius * 0.9) {
                    // Ethereal iris pattern with flowing energy
                    const radialPattern = Math.sin(angle * 8) * 0.5 + 0.5;
                    const circularPattern = Math.sin(distance * 0.08) * 0.4 + 0.6;
                    const intensity = radialPattern * circularPattern;
                    
                    data[index] = Math.floor(255 * intensity * 0.6);     // R - less red
                    data[index + 1] = Math.floor(255 * intensity * 0.8); // G 
                    data[index + 2] = Math.floor(255 * intensity);       // B - more blue
                    data[index + 3] = 255; // A
                } else {
                    // Outer ring (ethereal sclera)
                    data[index] = 200;
                    data[index + 1] = 220;
                    data[index + 2] = 255;
                    data[index + 3] = 255;
                }
                
                // Pupil
                if (distance < radius * 0.2) {
                    data[index] = 20;
                    data[index + 1] = 20;
                    data[index + 2] = 20;
                    data[index + 3] = 255;
                }
            }
        }
        
        context.putImageData(imageData, 0, 0);
        texture.update();
    }
    
    createWispTexture(texture) {
        const context = texture.getContext();
        const size = texture.getSize();
        
        // Create ethereal wispy texture with flowing energy
        const imageData = context.createImageData(size.width, size.height);
        const data = imageData.data;
        
        for (let y = 0; y < size.height; y++) {
            for (let x = 0; x < size.width; x++) {
                const index = (y * size.width + x) * 4;
                
                // Ethereal flowing pattern
                const time = Date.now() * 0.001; // For animation
                let intensity = 0.8 + Math.sin(x * 0.02 + time) * 0.2;
                
                // Add flowing energy streams
                const flow = Math.sin(y * 0.05 + x * 0.03 + time * 2) * 0.3;
                intensity += flow;
                
                // Add ethereal sparkles
                if (Math.random() < 0.001) {
                    intensity += 0.5; // Sparkle highlight
                }
                
                // Gradient from center to edges
                const centerX = size.width / 2;
                const centerY = size.height / 2;
                const distFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                const gradient = 1 - (distFromCenter / (size.width / 2));
                intensity *= Math.max(0.1, gradient);
                
                data[index] = Math.floor(255 * Math.min(intensity * 0.8, 1));     // R
                data[index + 1] = Math.floor(255 * Math.min(intensity * 0.9, 1)); // G
                data[index + 2] = Math.floor(255 * Math.min(intensity, 1));       // B
                data[index + 3] = Math.floor(255 * Math.min(intensity * 0.6, 1)); // A
            }
        }
        
        context.putImageData(imageData, 0, 0);
        texture.update();
    }
    
    async createRiggedCharacter(materials) {
        const parts = {};
        
        // Create main character root with advanced transform controls
        parts.root = new BABYLON.TransformNode("advancedGhostRoot", this.scene);
        
        // Advanced head with detailed geometry
        parts.head = await this.createAdvancedHead(materials, parts.root);
        
        // Create sophisticated eye system
        parts.eyeSystem = this.createAdvancedEyeSystem(materials, parts.head);
        
        // Advanced body with ethereal simulation
        parts.body = this.createAdvancedBody(materials, parts.root);
        
        // Create flexible limb system
        parts.limbs = this.createAdvancedLimbs(materials, parts.root);
        
        // Advanced ethereal tail with physics
        parts.tail = this.createAdvancedTail(materials, parts.root);
        
        // Create bone system for advanced animation
        parts.skeleton = this.createSkeletalSystem(parts);
        
        return { parts, materials };
    }
    
    async createAdvancedHead(materials, parent) {
        // Create head with more sophisticated geometry
        const head = BABYLON.MeshBuilder.CreateSphere("advancedHead", {
            diameter: 1.6,
            segments: 64 // Higher resolution for better deformation
        }, this.scene);
        
        // Apply advanced ethereal material
        head.material = materials.ghostForm;
        head.position.y = 2.0;
        head.scaling.y = 1.1; // Slightly elongated ghostly head
        head.parent = parent;
        
        // Create facial feature anchors
        head.facialAnchors = {
            leftEyebrow: new BABYLON.TransformNode("leftEyebrow", this.scene),
            rightEyebrow: new BABYLON.TransformNode("rightEyebrow", this.scene),
            mouth: new BABYLON.TransformNode("mouthAnchor", this.scene),
            jaw: new BABYLON.TransformNode("jawAnchor", this.scene)
        };
        
        // Position facial anchors
        head.facialAnchors.leftEyebrow.position.set(-0.3, 2.1, 0.6);
        head.facialAnchors.rightEyebrow.position.set(0.3, 2.1, 0.6);
        head.facialAnchors.mouth.position.set(0, 1.7, 0.7);
        head.facialAnchors.jaw.position.set(0, 1.6, 0.5);
        
        // Parent anchors to head
        Object.values(head.facialAnchors).forEach(anchor => {
            anchor.parent = head;
        });
        
        // Add vertex animation capabilities
        head.morphTargets = this.createFacialMorphTargets(head);
        
        return head;
    }
    
    createAdvancedEyeSystem(materials, head) {
        const eyeSystem = {
            leftEye: null,
            rightEye: null,
            leftPupil: null,
            rightPupil: null,
            eyeController: new BABYLON.TransformNode("eyeController", this.scene)
        };
        
        // Create highly detailed eyes
        eyeSystem.leftEye = BABYLON.MeshBuilder.CreateSphere("leftEye", {
            diameter: 0.35,
            segments: 32
        }, this.scene);
        eyeSystem.leftEye.position.set(-0.35, 2.0, 0.65);
        eyeSystem.leftEye.material = materials.eyes;
        eyeSystem.leftEye.parent = head;
        
        eyeSystem.rightEye = BABYLON.MeshBuilder.CreateSphere("rightEye", {
            diameter: 0.35,
            segments: 32
        }, this.scene);
        eyeSystem.rightEye.position.set(0.35, 2.0, 0.65);
        eyeSystem.rightEye.material = materials.eyes;
        eyeSystem.rightEye.parent = head;
        
        // Advanced pupil tracking system
        this.setupAdvancedEyeTracking(eyeSystem, head);
        
        return eyeSystem;
    }
    
    setupAdvancedEyeTracking(eyeSystem, head) {
        // Create invisible target for eye tracking
        eyeSystem.lookTarget = new BABYLON.TransformNode("eyeLookTarget", this.scene);
        eyeSystem.lookTarget.position.set(0, 2, -5); // Default look at viewer
        
        // Advanced eye tracking with realistic constraints
        eyeSystem.trackTarget = (deltaTime) => {
            const leftEye = eyeSystem.leftEye;
            const rightEye = eyeSystem.rightEye;
            const target = eyeSystem.lookTarget;
            
            if (!leftEye || !rightEye || !target) return;
            
            // Calculate look direction for each eye
            const leftEyeWorld = leftEye.getAbsolutePosition();
            const rightEyeWorld = rightEye.getAbsolutePosition(); 
            const targetWorld = target.getAbsolutePosition();
            
            // Left eye tracking
            const leftLookDir = targetWorld.subtract(leftEyeWorld).normalize();
            const leftLookMatrix = BABYLON.Matrix.LookAtLH(
                BABYLON.Vector3.Zero(),
                leftLookDir,
                BABYLON.Vector3.Up()
            );
            const leftTargetRotation = BABYLON.Quaternion.FromRotationMatrix(leftLookMatrix);
            leftEye.rotationQuaternion = leftEye.rotationQuaternion || BABYLON.Quaternion.Identity();
            BABYLON.Quaternion.SlerpToRef(leftEye.rotationQuaternion, leftTargetRotation, deltaTime * 3, leftEye.rotationQuaternion);
            
            // Right eye tracking
            const rightLookDir = targetWorld.subtract(rightEyeWorld).normalize();
            const rightLookMatrix = BABYLON.Matrix.LookAtLH(
                BABYLON.Vector3.Zero(),
                rightLookDir,
                BABYLON.Vector3.Up()
            );
            const rightTargetRotation = BABYLON.Quaternion.FromRotationMatrix(rightLookMatrix);
            rightEye.rotationQuaternion = rightEye.rotationQuaternion || BABYLON.Quaternion.Identity();
            BABYLON.Quaternion.SlerpToRef(rightEye.rotationQuaternion, rightTargetRotation, deltaTime * 3, rightEye.rotationQuaternion);
        };
    }
    
    createAdvancedBody(materials, parent) {
        const body = BABYLON.MeshBuilder.CreateSphere("advancedBody", {
            diameter: 1.4,
            segments: 48
        }, this.scene);
        
        body.position.y = 1.0;
        body.scaling.set(1.2, 1.6, 1.0); // More flowing ghostly shape
        body.material = materials.ghostForm;
        body.parent = parent;
        
        // Add breathing animation capability
        body.breathingOffset = 0;
        
        return body;
    }
    
    createAdvancedLimbs(materials, parent) {
        const limbs = {};
        
        // Create arm chain with multiple joints
        limbs.leftArm = this.createArmChain("left", materials, parent);
        limbs.rightArm = this.createArmChain("right", materials, parent);
        
        // Create leg chain with multiple joints
        limbs.leftLeg = this.createLegChain("left", materials, parent);
        limbs.rightLeg = this.createLegChain("right", materials, parent);
        
        return limbs;
    }
    
    createArmChain(side, materials, parent) {
        const isLeft = side === "left";
        const xMultiplier = isLeft ? -1 : 1;
        
        const armChain = {
            shoulder: new BABYLON.TransformNode(`${side}Shoulder`, this.scene),
            upperArm: null,
            elbow: new BABYLON.TransformNode(`${side}Elbow`, this.scene),
            forearm: null,
            wrist: new BABYLON.TransformNode(`${side}Wrist`, this.scene),
            hand: null
        };
        
        // Position joints
        armChain.shoulder.position.set(xMultiplier * 0.8, 1.6, 0);
        armChain.shoulder.parent = parent;
        
        // Upper arm
        armChain.upperArm = BABYLON.MeshBuilder.CreateCylinder(`${side}UpperArm`, {
            height: 0.8,
            diameter: 0.25,
            tessellation: 16
        }, this.scene);
        armChain.upperArm.material = materials.ghostForm;
        armChain.upperArm.parent = armChain.shoulder;
        armChain.upperArm.position.y = -0.4;
        
        // Elbow
        armChain.elbow.position.set(0, -0.8, 0);
        armChain.elbow.parent = armChain.shoulder;
        
        // Forearm
        armChain.forearm = BABYLON.MeshBuilder.CreateCylinder(`${side}Forearm`, {
            height: 0.7,
            diameterTop: 0.25,
            diameterBottom: 0.2,
            tessellation: 16
        }, this.scene);
        armChain.forearm.material = materials.ghostForm;
        armChain.forearm.parent = armChain.elbow;
        armChain.forearm.position.y = -0.35;
        
        // Wrist
        armChain.wrist.position.set(0, -0.7, 0);
        armChain.wrist.parent = armChain.elbow;
        
        // Hand
        armChain.hand = BABYLON.MeshBuilder.CreateSphere(`${side}Hand`, {
            diameter: 0.3,
            segments: 16
        }, this.scene);
        armChain.hand.material = materials.ghostForm;
        armChain.hand.parent = armChain.wrist;
        armChain.hand.scaling.set(1.2, 0.8, 0.6);
        
        return armChain;
    }
    
    createLegChain(side, materials, parent) {
        const isLeft = side === "left";
        const xMultiplier = isLeft ? -1 : 1;
        
        const legChain = {
            hip: new BABYLON.TransformNode(`${side}Hip`, this.scene),
            thigh: null,
            knee: new BABYLON.TransformNode(`${side}Knee`, this.scene),
            shin: null,
            ankle: new BABYLON.TransformNode(`${side}Ankle`, this.scene),
            foot: null
        };
        
        // Position joints
        legChain.hip.position.set(xMultiplier * 0.3, 0.6, 0);
        legChain.hip.parent = parent;
        
        // Thigh
        legChain.thigh = BABYLON.MeshBuilder.CreateCylinder(`${side}Thigh`, {
            height: 0.9,
            diameterTop: 0.3,
            diameterBottom: 0.25,
            tessellation: 16
        }, this.scene);
        legChain.thigh.material = materials.ghostForm;
        legChain.thigh.parent = legChain.hip;
        legChain.thigh.position.y = -0.45;
        
        // Knee
        legChain.knee.position.set(0, -0.9, 0);
        legChain.knee.parent = legChain.hip;
        
        // Shin
        legChain.shin = BABYLON.MeshBuilder.CreateCylinder(`${side}Shin`, {
            height: 0.8,
            diameterTop: 0.25,
            diameterBottom: 0.22,
            tessellation: 16
        }, this.scene);
        legChain.shin.material = materials.ghostForm;
        legChain.shin.parent = legChain.knee;
        legChain.shin.position.y = -0.4;
        
        // Ankle
        legChain.ankle.position.set(0, -0.8, 0);
        legChain.ankle.parent = legChain.knee;
        
        // Foot
        legChain.foot = BABYLON.MeshBuilder.CreateBox(`${side}Foot`, {
            width: 0.25,
            height: 0.15,
            depth: 0.6
        }, this.scene);
        legChain.foot.material = materials.ghostForm;
        legChain.foot.parent = legChain.ankle;
        legChain.foot.position.set(0, -0.075, 0.2);
        
        return legChain;
    }
    
    createAdvancedTail(materials, parent) {
        const tail = {
            segments: [],
            joints: []
        };
        
        const segmentCount = 8;
        let currentParent = parent;
        
        for (let i = 0; i < segmentCount; i++) {
            // Create joint
            const joint = new BABYLON.TransformNode(`tailJoint${i}`, this.scene);
            joint.position.set(0, 1 - i * 0.08, -0.3 - i * 0.25);
            joint.parent = currentParent;
            tail.joints.push(joint);
            
            // Create segment
            const segment = BABYLON.MeshBuilder.CreateSphere(`tailSegment${i}`, {
                diameter: 0.2 - i * 0.02,
                segments: 16
            }, this.scene);
            segment.material = materials.ghostForm;
            segment.parent = joint;
            tail.segments.push(segment);
            
            currentParent = joint;
        }
        
        return tail;
    }
    
    createSkeletalSystem(characterParts) {
        // Create bone hierarchy for advanced animation
        const skeleton = new BABYLON.Skeleton("ghostSkeleton", "ghostSkeleton", this.scene);
        
        // This would typically be done with imported rigged models
        // For now, we'll use the transform nodes as bone references
        
        return skeleton;
    }
    
    setupAdvancedAnimations(characterData) {
        const { parts } = characterData;
        
        // Initialize GSAP timeline for complex animations
        this.animationTimeline = gsap.timeline({ repeat: -1 });
        
        // Setup breathing animation
        this.setupBreathingAnimation(parts.body);
        
        // Setup idle animations
        this.setupIdleAnimations(parts);
        
        // Setup performance animations
        this.setupPerformanceAnimations(parts);
        
        // Setup eye tracking
        if (parts.eyeSystem && parts.eyeSystem.trackTarget) {
            this.eyeTrackingUpdate = parts.eyeSystem.trackTarget;
        }
    }
    
    setupBreathingAnimation(body) {
        if (!body) return;
        
        gsap.to(body.scaling, {
            duration: 3,
            y: 1.65,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });
    }
    
    setupIdleAnimations(parts) {
        // Subtle floating animation
        if (parts.root) {
            gsap.to(parts.root.position, {
                duration: 4,
                y: 0.15,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true
            });
        }
        
        // Tail swaying
        if (parts.tail && parts.tail.joints) {
            parts.tail.joints.forEach((joint, index) => {
                gsap.to(joint.rotation, {
                    duration: 2 + index * 0.3,
                    z: Math.sin(index) * 0.3,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                    delay: index * 0.2
                });
            });
        }
    }
    
    setupPerformanceAnimations(parts) {
        // Create performance animation presets
        this.performanceAnimations = {
            wave: () => this.createWaveAnimation(parts.limbs),
            bow: () => this.createBowAnimation(parts.body, parts.head),
            dance: () => this.createDanceAnimation(parts.root),
            point: () => this.createPointAnimation(parts.limbs.rightArm)
        };
    }
    
    createWaveAnimation(limbs) {
        if (!limbs || !limbs.rightArm) return;
        
        const tl = gsap.timeline();
        tl.to(limbs.rightArm.shoulder.rotation, { duration: 0.5, z: -1.2, ease: "back.out(1.7)" })
          .to(limbs.rightArm.elbow.rotation, { duration: 0.3, z: 0.8, ease: "power2.out" }, 0.2)
          .to(limbs.rightArm.wrist.rotation, { duration: 0.8, z: 0.5, repeat: 3, yoyo: true, ease: "sine.inOut" }, 0.5)
          .to(limbs.rightArm.shoulder.rotation, { duration: 0.5, z: 0, ease: "back.in(1.7)" }, 2)
          .to(limbs.rightArm.elbow.rotation, { duration: 0.3, z: 0, ease: "power2.in" }, 2.2);
        
        return tl;
    }
    
    createBowAnimation(body, head) {
        if (!body || !head) return;
        
        const tl = gsap.timeline();
        tl.to([body.rotation, head.rotation], { 
            duration: 1, 
            x: 0.6, 
            ease: "power2.out" 
        })
          .to([body.rotation, head.rotation], { 
            duration: 1, 
            x: 0, 
            ease: "power2.in",
            delay: 0.5 
        });
        
        return tl;
    }
    
    createDanceAnimation(root) {
        if (!root) return;
        
        const tl = gsap.timeline();
        tl.to(root.rotation, { 
            duration: 2, 
            y: Math.PI * 2, 
            ease: "power2.inOut" 
        })
          .to(root.position, { 
            duration: 2, 
            y: 0.3, 
            ease: "bounce.out" 
        }, 0);
        
        return tl;
    }
    
    createPointAnimation(rightArm) {
        if (!rightArm) return;
        
        const tl = gsap.timeline();
        tl.to(rightArm.shoulder.rotation, { duration: 0.3, z: -0.8, ease: "power2.out" })
          .to(rightArm.elbow.rotation, { duration: 0.2, z: 0.2, ease: "power2.out" }, 0.1)
          .set({}, {}, 1) // Hold pose
          .to(rightArm.shoulder.rotation, { duration: 0.3, z: 0, ease: "power2.in" })
          .to(rightArm.elbow.rotation, { duration: 0.2, z: 0, ease: "power2.in" }, 1.1);
        
        return tl;
    }
    
    createFacialExpressionSystem(characterData) {
        // Advanced facial expression system would go here
        // This would typically involve morph targets or bone-based facial rigging
        this.facialExpressions = {
            neutral: () => {},
            smile: () => {},
            frown: () => {},
            surprised: () => {},
            angry: () => {},
            wink: () => {}
        };
    }
    
    setupAdvancedLighting() {
        // Skip HDR for now to avoid loading issues, use procedural lighting instead
        // Create procedural environment
        this.scene.environmentIntensity = 0.4;
        
        // Add rim lighting for dramatic effect
        const rimLight = new BABYLON.DirectionalLight("rimLight", new BABYLON.Vector3(-1, -1, 1), this.scene);
        rimLight.diffuse = new BABYLON.Color3(1, 0.6, 0.2);
        rimLight.intensity = 1.5;
        
        // Key light
        const keyLight = new BABYLON.DirectionalLight("keyLight", new BABYLON.Vector3(1, -0.5, -1), this.scene);
        keyLight.diffuse = new BABYLON.Color3(1, 0.9, 0.8);
        keyLight.intensity = 2;
        
        // Fill light
        const fillLight = new BABYLON.HemisphericLight("fillLight", new BABYLON.Vector3(0, 1, 0), this.scene);
        fillLight.diffuse = new BABYLON.Color3(0.6, 0.7, 1);
        fillLight.intensity = 0.3;
    }
    
    createAdvancedEnvironment(materials) {
        // Create more sophisticated environment
        const ground = BABYLON.MeshBuilder.CreateGround("advancedGround", {
            width: 40,
            height: 40,
            subdivisions: 32
        }, this.scene);
        
        // Advanced ground material
        const groundMaterial = new BABYLON.PBRMaterial("advancedGround", this.scene);
        groundMaterial.baseColor = new BABYLON.Color3(0.1, 0.05, 0.05);
        groundMaterial.metallicFactor = 0.1;
        groundMaterial.roughnessFactor = 0.9;
        ground.material = groundMaterial;
        ground.receiveShadows = true;
        
        // Add environmental effects
        this.createAdvancedParticleSystem();
        this.createAtmosphericEffects();
        
        return ground;
    }
    
    createAdvancedParticleSystem() {
        // Multiple particle systems for layered ethereal effects
        const etherealSystem = new BABYLON.ParticleSystem("advancedEthereal", 1500, this.scene);
        
        // More realistic ethereal texture
        const etherealTexture = new BABYLON.Texture("data:image/svg+xml;base64," + btoa(`
            <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="ethereal" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.8" />
                        <stop offset="30%" style="stop-color:#aaccff;stop-opacity:0.6" />
                        <stop offset="60%" style="stop-color:#6699ff;stop-opacity:0.4" />
                        <stop offset="100%" style="stop-color:#336699;stop-opacity:0" />
                    </radialGradient>
                </defs>
                <circle cx="32" cy="32" r="32" fill="url(#ethereal)" />
            </svg>
        `), this.scene);
        
        etherealSystem.particleTexture = etherealTexture;
        etherealSystem.emitRate = 180;
        etherealSystem.minEmitBox = new BABYLON.Vector3(-0.5, 0, -0.5);
        etherealSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0, 0.5);
        
        // Advanced ethereal particle properties
        etherealSystem.color1 = new BABYLON.Color4(0.8, 0.9, 1.0, 0.8);
        etherealSystem.color2 = new BABYLON.Color4(0.6, 0.8, 1.0, 0.6);
        etherealSystem.colorDead = new BABYLON.Color4(0.4, 0.6, 0.9, 0);
        
        etherealSystem.minSize = 0.05;
        etherealSystem.maxSize = 0.4;
        etherealSystem.minLifeTime = 1.0;
        etherealSystem.maxLifeTime = 3.0;
        
        etherealSystem.gravity = new BABYLON.Vector3(0, -0.5, 0); // Gentle downward drift
        etherealSystem.direction1 = new BABYLON.Vector3(-1, 2, -1);
        etherealSystem.direction2 = new BABYLON.Vector3(1, 4, 1);
        
        etherealSystem.minEmitPower = 0.3;
        etherealSystem.maxEmitPower = 1.2;
        etherealSystem.updateSpeed = 0.008;
        
        etherealSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        etherealSystem.start();
        
        return etherealSystem;
    }
    
    createAtmosphericEffects() {
        // Add atmospheric scattering, volumetric lighting, etc.
        // This would typically involve post-processing effects
    }
    
    // Animation control methods
    playPerformanceAnimation(animationName) {
        if (this.performanceAnimations[animationName]) {
            return this.performanceAnimations[animationName]();
        }
    }
    
    setFacialExpression(expression) {
        if (this.facialExpressions[expression]) {
            this.facialExpressions[expression]();
        }
    }
    
    updateEyeTracking(deltaTime) {
        if (this.eyeTrackingUpdate) {
            this.eyeTrackingUpdate(deltaTime);
        }
    }
    
    // Cleanup
    dispose() {
        if (this.animationTimeline) {
            this.animationTimeline.kill();
        }
    }
}
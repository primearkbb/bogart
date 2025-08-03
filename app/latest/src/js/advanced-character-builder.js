// Advanced character builder for Ghost Character with cutting-edge animation and materials
class AdvancedCharacterBuilder {
    constructor(scene) {
        this.scene = scene;
        this.config = GHOST_CHARACTER_CONFIG.character;
        this.animationManager = null;
        this.facialRig = null;
        this.skeletalSystem = null;
    }

    createUnifiedGhostMesh(name, options) {
        // Create a unified ethereal mesh that flows naturally
        const { topRadius, bottomRadius, height, segments, etherealShape, flowingBottom } = options;
        
        // Create custom geometry for unified ghost form
        const positions = [];
        const indices = [];
        const normals = [];
        const uvs = [];
        
        const segmentHeight = height / segments;
        
        for (let i = 0; i <= segments; i++) {
            const y = i * segmentHeight - height / 2;
            const progress = i / segments;
            
            // Create ethereal flowing shape using sinusoidal variation
            let radius = topRadius + (bottomRadius - topRadius) * progress;
            
            if (etherealShape) {
                // Add ethereal undulation to make it more ghost-like
                const undulation = Math.sin(progress * Math.PI * 2) * 0.1 + Math.sin(progress * Math.PI * 4) * 0.05;
                radius += undulation;
            }
            
            if (flowingBottom && progress > 0.7) {
                // Create wispy trailing bottom for ghost effect
                const fadeOut = (progress - 0.7) / 0.3;
                radius *= (1 - fadeOut * 0.6);
            }
            
            // Create vertices for this ring
            const ringVertices = 32;
            for (let j = 0; j <= ringVertices; j++) {
                const angle = (j / ringVertices) * Math.PI * 2;
                
                // Add ethereal displacement
                let currentRadius = radius;
                if (etherealShape) {
                    const displacement = Math.sin(angle * 3 + progress * Math.PI) * 0.05;
                    currentRadius += displacement;
                }
                
                const x = Math.cos(angle) * currentRadius;
                const z = Math.sin(angle) * currentRadius;
                
                positions.push(x, y, z);
                
                // Calculate normal (simplified)
                const normal = new BABYLON.Vector3(x, 0, z).normalize();
                normals.push(normal.x, normal.y, normal.z);
                
                // UV coordinates
                uvs.push(j / ringVertices, progress);
            }
        }
        
        // Create indices for triangles
        const ringsVertexCount = 33; // ringVertices + 1
        for (let i = 0; i < segments; i++) {
            for (let j = 0; j < 32; j++) { // ringVertices
                const current = i * ringsVertexCount + j;
                const next = current + ringsVertexCount;
                
                // Create two triangles for each quad
                indices.push(current, next, current + 1);
                indices.push(current + 1, next, next + 1);
            }
        }
        
        // Create mesh
        const mesh = new BABYLON.Mesh(name, this.scene);
        const vertexData = new BABYLON.VertexData();
        
        vertexData.positions = positions;
        vertexData.indices = indices;
        vertexData.normals = normals;
        vertexData.uvs = uvs;
        
        vertexData.applyToMesh(mesh);
        
        return mesh;
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
        
        // Create static ethereal wispy texture (no real-time animation for performance)
        const imageData = context.createImageData(size.width, size.height);
        const data = imageData.data;
        
        for (let y = 0; y < size.height; y++) {
            for (let x = 0; x < size.width; x++) {
                const index = (y * size.width + x) * 4;
                
                // Static ethereal flowing pattern (removed time-based animation)
                let intensity = 0.8 + Math.sin(x * 0.02) * 0.2;
                
                // Add static flowing energy streams
                const flow = Math.sin(y * 0.05 + x * 0.03) * 0.3;
                intensity += flow;
                
                // Static ethereal sparkles (deterministic pattern instead of random)
                if ((x + y * 3) % 1000 === 0) {
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
        // Create unified ghostly head with flowing ethereal shape
        const head = this.createUnifiedGhostMesh("advancedHead", {
            topRadius: 0.9,
            bottomRadius: 0.7,
            height: 1.8,
            segments: 32, // Reduced segments for better performance
            etherealShape: true
        });
        
        // Apply advanced ethereal material
        head.material = materials.ghostForm;
        head.position.y = 2.0;
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
        // Create unified flowing ghostly torso that connects seamlessly with head
        const body = this.createUnifiedGhostMesh("advancedBody", {
            topRadius: 0.7,
            bottomRadius: 0.4,
            height: 2.2,
            segments: 24, // Reduced segments for better performance
            etherealShape: true,
            flowingBottom: true
        });
        
        body.position.y = 0.8;
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
        
        // Create flowing upper arm using unified ghost mesh
        armChain.upperArm = this.createUnifiedGhostMesh(`${side}UpperArm`, {
            topRadius: 0.15,
            bottomRadius: 0.12,
            height: 0.8,
            segments: 16,
            etherealShape: true,
            flowingBottom: false
        });
        armChain.upperArm.material = materials.ghostForm;
        armChain.upperArm.parent = armChain.shoulder;
        armChain.upperArm.position.y = -0.4;
        
        // Elbow
        armChain.elbow.position.set(0, -0.8, 0);
        armChain.elbow.parent = armChain.shoulder;
        
        // Create flowing forearm with ethereal taper
        armChain.forearm = this.createUnifiedGhostMesh(`${side}Forearm`, {
            topRadius: 0.12,
            bottomRadius: 0.08,
            height: 0.7,
            segments: 16,
            etherealShape: true,
            flowingBottom: true
        });
        armChain.forearm.material = materials.ghostForm;
        armChain.forearm.parent = armChain.elbow;
        armChain.forearm.position.y = -0.35;
        
        // Wrist
        armChain.wrist.position.set(0, -0.7, 0);
        armChain.wrist.parent = armChain.elbow;
        
        // Create ethereal hand with wispy fingers
        armChain.hand = this.createUnifiedGhostMesh(`${side}Hand`, {
            topRadius: 0.08,
            bottomRadius: 0.04,
            height: 0.3,
            segments: 12,
            etherealShape: true,
            flowingBottom: true
        });
        armChain.hand.material = materials.wisps;
        armChain.hand.parent = armChain.wrist;
        armChain.hand.scaling.set(1.2, 1.0, 0.8);
        
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
        // Create a single unified flowing tail instead of segments
        const tail = this.createUnifiedGhostMesh("etherealTail", {
            topRadius: 0.3,
            bottomRadius: 0.02,
            height: 2.5,
            segments: 32,
            etherealShape: true,
            flowingBottom: true
        });
        
        // Position and orient the tail
        tail.position.set(0, 0.8, -0.5);
        tail.rotation.x = Math.PI * 0.1; // Slight backward angle
        tail.material = materials.wisps;
        tail.parent = parent;
        
        // Create joint system for animation
        const tailSystem = {
            mainTail: tail,
            joints: [],
            segments: [tail]
        };
        
        // Add invisible joints along the tail for animation control
        for (let i = 0; i < 8; i++) {
            const joint = new BABYLON.TransformNode(`tailJoint${i}`, this.scene);
            const progress = i / 7;
            joint.position.set(0, 0.8 - progress * 1.5, -0.5 - progress * 1.0);
            joint.parent = parent;
            tailSystem.joints.push(joint);
        }
        
        return tailSystem;
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
        
        // Initialize GSAP timeline for complex animations with proper cleanup tracking
        this.animationTimeline = gsap.timeline({ repeat: -1 });
        this.activeAnimations = new Set(); // Track all active animations for cleanup
        
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
        
        const breathingAnim = gsap.to(body.scaling, {
            duration: 3,
            y: 1.65,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });
        
        this.activeAnimations.add(breathingAnim);
    }
    
    setupIdleAnimations(parts) {
        // Subtle floating animation
        if (parts.root) {
            const floatAnim = gsap.to(parts.root.position, {
                duration: 4,
                y: 0.15,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true
            });
            this.activeAnimations.add(floatAnim);
        }
        
        // Tail swaying
        if (parts.tail && parts.tail.joints) {
            parts.tail.joints.forEach((joint, index) => {
                const tailAnim = gsap.to(joint.rotation, {
                    duration: 2 + index * 0.3,
                    z: Math.sin(index) * 0.3,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                    delay: index * 0.2
                });
                this.activeAnimations.add(tailAnim);
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
        // Optimized particle system with reduced count for better performance
        const etherealSystem = new BABYLON.ParticleSystem("advancedEthereal", 800, this.scene);
        
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
        etherealSystem.emitRate = 120; // Reduced emit rate for better performance
        etherealSystem.minEmitBox = new BABYLON.Vector3(-0.5, 0, -0.5);
        etherealSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0, 0.5);
        
        // Advanced ethereal particle properties
        etherealSystem.color1 = new BABYLON.Color4(0.8, 0.9, 1.0, 0.8);
        etherealSystem.color2 = new BABYLON.Color4(0.6, 0.8, 1.0, 0.6);
        etherealSystem.colorDead = new BABYLON.Color4(0.4, 0.6, 0.9, 0);
        
        etherealSystem.minSize = 0.05;
        etherealSystem.maxSize = 0.4;
        etherealSystem.minLifeTime = 0.8; // Reduced lifetime for better performance
        etherealSystem.maxLifeTime = 2.5;
        
        etherealSystem.gravity = new BABYLON.Vector3(0, -0.5, 0); // Gentle downward drift
        etherealSystem.direction1 = new BABYLON.Vector3(-1, 2, -1);
        etherealSystem.direction2 = new BABYLON.Vector3(1, 4, 1);
        
        etherealSystem.minEmitPower = 0.3;
        etherealSystem.maxEmitPower = 1.2;
        etherealSystem.updateSpeed = 0.016; // Reduced update frequency for better performance
        
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
        // Kill main timeline
        if (this.animationTimeline) {
            this.animationTimeline.kill();
            this.animationTimeline = null;
        }
        
        // Kill all tracked animations to prevent memory leaks
        if (this.activeAnimations) {
            this.activeAnimations.forEach(animation => {
                if (animation && typeof animation.kill === 'function') {
                    animation.kill();
                }
            });
            this.activeAnimations.clear();
        }
        
        // Clear performance animations
        if (this.performanceAnimations) {
            this.performanceAnimations = null;
        }
        
        // Clear eye tracking
        this.eyeTrackingUpdate = null;
    }
}
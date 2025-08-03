// Procedural Ghost Creator
function createProceduralGhost(scene) {
    const ghostGroup = new THREE.Group();
    
    // Ghost body - elongated sphere
    const bodyGeometry = new THREE.SphereGeometry(1, 32, 32);
    // Stretch the body vertically
    bodyGeometry.scale(1, 1.5, 1);
    
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0xf0f0ff,
        emissive: 0x404080,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
    });
    
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    ghostGroup.add(body);
    
    // Ghost tail - cone shape
    const tailGeometry = new THREE.ConeGeometry(0.8, 1.5, 32, 1, true);
    const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
    tail.position.y = -0.5;
    tail.rotation.z = Math.PI;
    ghostGroup.add(tail);
    
    // Wavy bottom edge using multiple torus shapes
    for (let i = 0; i < 3; i++) {
        const waveGeometry = new THREE.TorusGeometry(0.6 - i * 0.1, 0.1, 8, 32);
        const wave = new THREE.Mesh(waveGeometry, bodyMaterial);
        wave.position.y = -1.2 + i * 0.1;
        wave.rotation.x = Math.PI / 2;
        ghostGroup.add(wave);
    }
    
    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const eyeMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
        emissive: 0x222244,
        emissiveIntensity: 0.5
    });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.3, 0.8, 0.8);
    ghostGroup.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.3, 0.8, 0.8);
    ghostGroup.add(rightEye);
    
    // Eye glow
    const eyeGlowGeometry = new THREE.SphereGeometry(0.08, 12, 12);
    const eyeGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0x6699ff,
        transparent: true,
        opacity: 0.8
    });
    
    const leftEyeGlow = new THREE.Mesh(eyeGlowGeometry, eyeGlowMaterial);
    leftEyeGlow.position.set(-0.3, 0.8, 0.9);
    ghostGroup.add(leftEyeGlow);
    
    const rightEyeGlow = new THREE.Mesh(eyeGlowGeometry, eyeGlowMaterial);
    rightEyeGlow.position.set(0.3, 0.8, 0.9);
    ghostGroup.add(rightEyeGlow);
    
    // Mouth (simple dark oval)
    const mouthGeometry = new THREE.SphereGeometry(0.1, 16, 8);
    mouthGeometry.scale(1.5, 0.8, 0.5);
    const mouth = new THREE.Mesh(mouthGeometry, eyeMaterial);
    mouth.position.set(0, 0.5, 0.85);
    ghostGroup.add(mouth);
    
    // Arms (optional simple spheres)
    const armGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    armGeometry.scale(1, 2, 0.5);
    
    const leftArm = new THREE.Mesh(armGeometry, bodyMaterial);
    leftArm.position.set(-0.8, 0.3, 0);
    leftArm.rotation.z = 0.3;
    ghostGroup.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, bodyMaterial);
    rightArm.position.set(0.8, 0.3, 0);
    rightArm.rotation.z = -0.3;
    ghostGroup.add(rightArm);
    
    // Add some particles for ethereal effect
    const particleCount = 20;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 3;
        particlePositions[i * 3 + 1] = Math.random() * 2 - 0.5;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x88aaff,
        size: 0.1,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    ghostGroup.add(particles);
    
    // Scale the entire ghost
    ghostGroup.scale.set(1.5, 1.5, 1.5);
    
    // Store references for animation
    ghostGroup.userData = {
        body: body,
        tail: tail,
        leftEye: leftEye,
        rightEye: rightEye,
        leftArm: leftArm,
        rightArm: rightArm,
        particles: particles,
        particlePositions: particlePositions
    };
    
    return ghostGroup;
}

// Animation function for the procedural ghost
function animateProceduralGhost(ghost, time) {
    if (!ghost || !ghost.userData) return;
    
    const userData = ghost.userData;
    
    // Float animation
    ghost.position.y = Math.sin(time * 1.2) * 0.3;
    
    // Rotate slowly
    ghost.rotation.y += 0.005;
    
    // Arm waving
    if (userData.leftArm) {
        userData.leftArm.rotation.z = 0.3 + Math.sin(time * 2) * 0.2;
    }
    if (userData.rightArm) {
        userData.rightArm.rotation.z = -0.3 - Math.sin(time * 2 + 0.5) * 0.2;
    }
    
    // Eye blinking (occasional)
    if (Math.sin(time * 0.5) > 0.98) {
        userData.leftEye.scale.y = 0.1;
        userData.rightEye.scale.y = 0.1;
    } else {
        userData.leftEye.scale.y = 1;
        userData.rightEye.scale.y = 1;
    }
    
    // Particle animation
    if (userData.particles && userData.particlePositions) {
        const positions = userData.particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += 0.01; // Float up
            if (positions[i + 1] > 2) {
                positions[i + 1] = -0.5; // Reset to bottom
            }
        }
        userData.particles.geometry.attributes.position.needsUpdate = true;
    }
    
    // Tail wobble
    if (userData.tail) {
        userData.tail.rotation.x = Math.sin(time * 3) * 0.05;
        userData.tail.rotation.z = Math.PI + Math.sin(time * 2.5) * 0.05;
    }
}
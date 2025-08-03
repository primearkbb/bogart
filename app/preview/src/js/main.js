// Browser compatibility checker
class CompatibilityChecker {
    static check() {
        const issues = [];
        
        if (!this.checkWebGL()) {
            issues.push('WebGL not supported');
        }
        
        if (!this.checkWebAudio()) {
            issues.push('Web Audio API not supported');
        }
        
        if (!this.checkEssentialFeatures()) {
            issues.push('Essential JavaScript features missing');
        }
        
        return {
            compatible: issues.length === 0,
            issues
        };
    }
    
    static checkWebGL() {
        try {
            const canvas = document.createElement('canvas');
            const webglContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            console.log('WebGL context creation result:', !!webglContext);
            if (webglContext) {
                console.log('WebGL vendor:', webglContext.getParameter(webglContext.VENDOR));
                console.log('WebGL renderer:', webglContext.getParameter(webglContext.RENDERER));
            }
            return !!(window.WebGLRenderingContext && webglContext);
        } catch (e) {
            console.error('WebGL check error:', e);
            return false;
        }
    }
    
    static checkWebAudio() {
        return !!(window.AudioContext || window.webkitAudioContext);
    }
    
    static checkEssentialFeatures() {
        return !!(
            window.requestAnimationFrame &&
            window.Promise &&
            Array.prototype.forEach &&
            Object.keys &&
            JSON.parse &&
            JSON.stringify
        );
    }
}

// Application entry point with production safeguards
window.addEventListener('DOMContentLoaded', () => {
    // Check browser compatibility first
    const compatibility = CompatibilityChecker.check();
    if (!compatibility.compatible) {
        console.warn('Compatibility issues detected:', compatibility.issues);
        // Continue anyway for testing - the app might still work
        console.log('🚀 Attempting to run app despite compatibility warnings...');
    }
    
    let ghostCharacter = null;
    
    try {
        // Initialize the Ghost Character application
        ghostCharacter = new GhostCharacter();
        // Expose globally for testing
        window.ghostCharacter = ghostCharacter;
        ghostCharacter.init();
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (ghostCharacter) {
                ghostCharacter.dispose();
            }
        });
        
    } catch (error) {
        // Show detailed error for debugging
        console.error('Critical initialization error:', error);
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.innerHTML = `Critical Error: ${error.message}`;
            loadingElement.style.color = '#ff3333';
        }
    }
    
    // Global error handling
    window.addEventListener('error', (event) => {
        // Show detailed error for debugging
        console.error('Global error:', event.error || event.message, 'at', event.filename, ':', event.lineno);
        const loadingElement = document.getElementById('loading');
        if (loadingElement && loadingElement.style.display !== 'none') {
            const errorMsg = event.error ? event.error.message : event.message;
            loadingElement.innerHTML = `Error: ${errorMsg}`;
            loadingElement.style.color = '#ff3333';
        }
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        // Show detailed promise rejection for debugging
        console.error('Unhandled promise rejection:', event.reason);
        const loadingElement = document.getElementById('loading');
        if (loadingElement && loadingElement.style.display !== 'none') {
            loadingElement.innerHTML = `Promise Error: ${event.reason.message || event.reason}`;
            loadingElement.style.color = '#ff3333';
        }
        event.preventDefault(); // Prevent default browser behavior
    });
});
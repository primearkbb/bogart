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
            return !!(window.WebGLRenderingContext && 
                     (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
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
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.innerHTML = `Browser not supported: ${compatibility.issues.join(', ')}`;
            loadingElement.style.color = '#ff3333';
        }
        return;
    }
    
    let ghostCharacter = null;
    
    try {
        // Initialize the Ghost Character application
        ghostCharacter = new GhostCharacter();
        ghostCharacter.init();
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (ghostCharacter) {
                ghostCharacter.dispose();
            }
        });
        
    } catch (error) {
        // Silent error handling in production
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.innerHTML = 'Critical Error: Application failed to start';
            loadingElement.style.color = '#ff3333';
        }
    }
    
    // Global error handling
    window.addEventListener('error', (event) => {
        // Silent error handling in production
        const loadingElement = document.getElementById('loading');
        if (loadingElement && loadingElement.style.display !== 'none') {
            loadingElement.innerHTML = 'Error: Application encountered an issue';
            loadingElement.style.color = '#ff3333';
        }
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        // Silent promise rejection handling in production
        event.preventDefault(); // Prevent default browser behavior
    });
});
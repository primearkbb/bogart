// Production fixes and improvements

// Enhanced error handling wrapper
class ProductionErrorHandler {
    static wrap(fn, context = 'Unknown') {
        return function(...args) {
            try {
                return fn.apply(this, args);
            } catch (error) {
                console.error(`[${context}] Error:`, error);
                // In production, you might want to send to error tracking service
                // ErrorTracker.report(error, context);
                return null;
            }
        };
    }
    
    static async wrapAsync(fn, context = 'Unknown') {
        try {
            return await fn();
        } catch (error) {
            console.error(`[${context}] Async Error:`, error);
            return null;
        }
    }
}

// Performance monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            memory: 0,
            renderTime: 0
        };
        this.startTime = performance.now();
    }
    
    update(engine) {
        if (engine) {
            this.metrics.fps = engine.getFps();
        }
        
        // Monitor memory usage if available
        if (performance.memory) {
            this.metrics.memory = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
        }
        
        // Check for performance issues
        if (this.metrics.fps < 30) {
            console.warn('Low FPS detected:', this.metrics.fps);
        }
        
        if (this.metrics.memory > 100) { // Over 100MB
            console.warn('High memory usage:', this.metrics.memory + 'MB');
        }
    }
    
    getMetrics() {
        return { ...this.metrics };
    }
}

// Resource cleanup manager
class ResourceManager {
    constructor() {
        this.resources = new Set();
        this.intervals = new Set();
        this.timeouts = new Set();
        this.eventListeners = new Map();
    }
    
    addResource(resource) {
        this.resources.add(resource);
    }
    
    addInterval(id) {
        this.intervals.add(id);
    }
    
    addTimeout(id) {
        this.timeouts.add(id);
    }
    
    addEventListener(element, event, handler) {
        if (!this.eventListeners.has(element)) {
            this.eventListeners.set(element, []);
        }
        this.eventListeners.get(element).push({ event, handler });
    }
    
    cleanup() {
        // Clear all intervals
        this.intervals.forEach(id => clearInterval(id));
        this.intervals.clear();
        
        // Clear all timeouts
        this.timeouts.forEach(id => clearTimeout(id));
        this.timeouts.clear();
        
        // Remove all event listeners
        this.eventListeners.forEach((listeners, element) => {
            listeners.forEach(({ event, handler }) => {
                element.removeEventListener(event, handler);
            });
        });
        this.eventListeners.clear();
        
        // Dispose all resources
        this.resources.forEach(resource => {
            if (resource && typeof resource.dispose === 'function') {
                resource.dispose();
            }
        });
        this.resources.clear();
    }
}

// Browser compatibility checker
class CompatibilityChecker {
    static check() {
        const issues = [];
        
        // Check WebGL support
        if (!this.checkWebGL()) {
            issues.push('WebGL not supported');
        }
        
        // Check Web Audio API
        if (!this.checkWebAudio()) {
            issues.push('Web Audio API not supported');
        }
        
        // Check essential JavaScript features
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

// Content Security Policy helper
class CSPHelper {
    static validateExternalResources() {
        const allowedDomains = [
            'cdn.babylonjs.com',
            'cdnjs.cloudflare.com',
            'fonts.googleapis.com'
        ];
        
        const scripts = document.querySelectorAll('script[src]');
        const links = document.querySelectorAll('link[href]');
        
        const issues = [];
        
        scripts.forEach(script => {
            const src = script.src;
            if (src && !this.isDomainAllowed(src, allowedDomains)) {
                issues.push(`Unauthorized script: ${src}`);
            }
        });
        
        links.forEach(link => {
            const href = link.href;
            if (href && !this.isDomainAllowed(href, allowedDomains)) {
                issues.push(`Unauthorized resource: ${href}`);
            }
        });
        
        return issues;
    }
    
    static isDomainAllowed(url, allowedDomains) {
        try {
            const domain = new URL(url).hostname;
            return allowedDomains.some(allowed => domain.includes(allowed));
        } catch (e) {
            return false; // Invalid URL
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ProductionErrorHandler,
        PerformanceMonitor,
        ResourceManager,
        CompatibilityChecker,
        CSPHelper
    };
}
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
        console.error('Failed to initialize Ghost Character application:', error);
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.innerHTML = 'Critical Error: Application failed to start';
            loadingElement.style.color = '#ff3333';
        }
    }
    
    // Global error handling
    window.addEventListener('error', (event) => {
        console.error('Runtime error:', event.error);
        // Don't expose technical details in production
        const loadingElement = document.getElementById('loading');
        if (loadingElement && loadingElement.style.display !== 'none') {
            loadingElement.innerHTML = 'Error: Application encountered an issue';
            loadingElement.style.color = '#ff3333';
        }
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        event.preventDefault(); // Prevent default browser behavior
    });
});
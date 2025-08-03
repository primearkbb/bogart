// Application entry point
window.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize the Devil Imp application
        const devilImp = new DevilImp();
        devilImp.init();
        
        // Global error handling
        window.addEventListener('error', (event) => {
            console.error('Application error:', event.error);
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.innerHTML = 'Error: Failed to initialize application';
                loadingElement.style.color = '#ff3333';
            }
        });
        
    } catch (error) {
        console.error('Failed to initialize Devil Imp application:', error);
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.innerHTML = 'Critical Error: ' + error.message;
            loadingElement.style.color = '#ff3333';
        }
    }
});
// State for the toggle
let isPanelCollapsed = false;
let isInitialized = false;
let originalWidth = null;
let originalMinWidth = null;

import { init as initDesignManager } from './pages/design-manager.js';
import { init as initDesignPreviewer } from './pages/design-previewer.js';

// Function to determine which page we are viewing
function getCurrentPage() {
    const url = window.location.href;
    if (url.includes('design-manager')) {
        return 'design-manager';
    } else if (url.includes('design-previewer')) {
        return 'design-previewer';
    }
    return null;
}

// Initialize the corresponding functionality according to the page
function initializePage() {
    const currentPage = getCurrentPage();
    if (currentPage === 'design-manager') {
        initDesignManager();
    } else if (currentPage === 'design-previewer') {
        initDesignPreviewer();
    }
}


// Observador de mutaciones para manejar cambios dinámicos en el DOM
const observer = new MutationObserver(() => {
    initializePage();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Inicialización inicial
initializePage();
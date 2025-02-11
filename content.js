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
        window.designManager.init();
    } else if (currentPage === 'design-previewer') {
        window.designPreviewer.init();
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
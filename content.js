function getCurrentPage() {
    const url = window.location.href;
    if (url.includes('design-manager')) {
        return 'design-manager';
    }
    return null;
}

function waitForElement(selector, callback, maxAttempts = 10) {
    let attempts = 0;

    const checkElement = () => {
        attempts++;
        const element = document.querySelector(selector);

        if (element) {
            callback(element);
        } else if (attempts < maxAttempts) {
            setTimeout(checkElement, 1000);
        }
    };

    checkElement();
}

function initializePage() {
    const currentPage = getCurrentPage();
    if (!currentPage) return;

    // Esperar a que el editor esté completamente cargado
    waitForElement('.code-pane-editor', (editorWrapper) => {
        // Solo inicializar si estamos en la página correcta y el editor está presente
        if (currentPage === 'design-manager') {
            try {
                window.designManager.init();
            } catch (error) {
                // Silent fail if the module is not yet loaded
            }
        }
    });
}

// Observar cambios en el DOM para reinicializar cuando sea necesario
const observer = new MutationObserver((mutations) => {
    const hasRelevantChanges = mutations.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => {
            return node.classList && 
                   (node.classList.contains('CodeMirror') || 
                    node.classList.contains('code-pane-editor'));
        });
    });

    if (hasRelevantChanges) {
        initializePage();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

initializePage();
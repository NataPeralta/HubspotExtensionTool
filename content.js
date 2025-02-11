function waitForElement(selector, callback, maxAttempts = 50) {  
    let attempts = 0;

    const checkElement = () => {
        attempts++;
        console.log(`[Content Script] Buscando elemento ${selector} (intento ${attempts}/${maxAttempts})`);
        const element = document.querySelector(selector);

        if (element) {
            console.log(`[Content Script] Elemento ${selector} encontrado`);
            callback(element);
        } else if (attempts < maxAttempts) {
            console.log(`[Content Script] Elemento ${selector} no encontrado, reintentando...`);
            setTimeout(checkElement, 100); 
        } else {
            console.log(`[Content Script] Máximo de intentos alcanzado para ${selector}`);
        }
    };

    checkElement();
}

function initializePage() {
    console.log('[Content Script] Iniciando inicialización de la página');
    waitForElement('.code-pane-editor', () => {
        if (typeof window.designManager !== 'undefined') {
            console.log('[Content Script] Design Manager encontrado, iniciando...');
            window.designManager.init();
        } else {
            console.log('[Content Script] Design Manager no encontrado, reintentando...');
            setTimeout(initializePage, 500);
        }
    });
}

// Inicializar cuando se detecten cambios en el DOM
const observer = new MutationObserver((mutations) => {
    console.log('[Content Script] Cambios en el DOM detectados, verificando cambios relevantes...');
    const hasRelevantChanges = mutations.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => {
            return node.classList && 
                   (node.classList.contains('code-pane-editor'));
        });
    });

    if (hasRelevantChanges) {
        console.log('[Content Script] Cambios relevantes encontrados, reinicializando...');
        initializePage();
    }
});

console.log('[Content Script] Configurando observador de mutaciones...');
observer.observe(document.body, {
    childList: true,
    subtree: true
});

if (document.readyState === 'loading') {
    console.log('[Content Script] Documento aún cargando, esperando DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    console.log('[Content Script] Documento ya cargado, inicializando inmediatamente...');
    initializePage();
}
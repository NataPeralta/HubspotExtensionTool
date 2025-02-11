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

function findCodeMirrorInstance() {
    // Actualizado con los selectores específicos de HubSpot
    const possibleSelectors = [
        '.cm-s-hubspot-canvas-dark',
        '.CodeMirror.cm-s-hubspot-canvas-dark',
        '.editor-container .CodeMirror',
        '.UIFlex__StyledFlex-sc-123tvm-0 .CodeMirror'
    ];

    for (const selector of possibleSelectors) {
        console.log(`[Content Script] Intentando selector: ${selector}`);
        const element = document.querySelector(selector);
        if (element) {
            console.log(`[Content Script] Editor encontrado con selector: ${selector}`);

            // Buscar la instancia de CodeMirror
            if (element.CodeMirror) {
                console.log('[Content Script] Instancia de CodeMirror encontrada directamente');
                return element.CodeMirror;
            }

            // Buscar en el elemento padre
            const parent = element.parentElement;
            if (parent && parent.CodeMirror) {
                console.log('[Content Script] Instancia de CodeMirror encontrada en elemento padre');
                return parent.CodeMirror;
            }

            // Buscar en elementos hijos
            const nestedEditor = element.querySelector('.CodeMirror');
            if (nestedEditor && nestedEditor.CodeMirror) {
                console.log('[Content Script] Instancia de CodeMirror encontrada en elemento hijo');
                return nestedEditor.CodeMirror;
            }
        }
    }

    console.log('[Content Script] No se encontró instancia de CodeMirror');
    return null;
}

function initializePage() {
    console.log('[Content Script] Iniciando inicialización de la página');

    const checkForCodeMirror = () => {
        console.log('[Content Script] Buscando instancia de CodeMirror...');
        const cmInstance = findCodeMirrorInstance();

        if (cmInstance) {
            console.log('[Content Script] CodeMirror encontrado, inicializando...');
            if (typeof window.designManager !== 'undefined') {
                window.designManager.init(cmInstance);
            } else {
                console.log('[Content Script] Design Manager no encontrado, reintentando...');
                setTimeout(checkForCodeMirror, 500);
            }
        } else {
            console.log('[Content Script] CodeMirror no encontrado, reintentando...');
            setTimeout(checkForCodeMirror, 500);
        }
    };

    // Esperar a que la página esté completamente cargada
    setTimeout(checkForCodeMirror, 1000);
}

// Inicializar cuando se detecten cambios en el DOM
const observer = new MutationObserver((mutations) => {
    console.log('[Content Script] Cambios en el DOM detectados, verificando cambios relevantes...');
    const hasRelevantChanges = mutations.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => {
            if (node.classList) {
                const hasRelevantClass = node.classList.contains('CodeMirror') || 
                                       node.classList.contains('cm-editor') ||
                                       node.classList.contains('cm-s-hubspot-canvas-dark');
                if (hasRelevantClass) {
                    console.log('[Content Script] Detectado nuevo elemento relevante:', node.classList);
                }
                return hasRelevantClass;
            }
            return false;
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
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
});

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    console.log('[Content Script] Documento aún cargando, esperando DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    console.log('[Content Script] Documento ya cargado, inicializando inmediatamente...');
    initializePage();
}
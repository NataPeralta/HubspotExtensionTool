window.designManager = (function() {
    let state = {
        isInitialized: false,
        editor: null
    };

    function waitForCodeMirrorInstance(element, maxAttempts = 50) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const checkInstance = () => {
                attempts++;
                console.log('[Design Manager] Intentando acceder a la instancia de CodeMirror:', {
                    attempt: attempts,
                    hasInstance: !!element.CodeMirror,
                    elementProperties: Object.keys(element)
                });

                if (element.CodeMirror) {
                    console.log('[Design Manager] Instancia de CodeMirror encontrada después de', attempts, 'intentos');
                    resolve(element.CodeMirror);
                } else if (attempts < maxAttempts) {
                    setTimeout(checkInstance, 100);
                } else {
                    console.log('[Design Manager] No se pudo encontrar la instancia de CodeMirror después de', maxAttempts, 'intentos');
                    reject(new Error('CodeMirror instance not found'));
                }
            };
            checkInstance();
        });
    }

    function findAndSetupEditor() {
        console.log('[Design Manager] Buscando editor...');

        // Buscar el wrapper del editor
        const editorWrapper = document.querySelector('.code-pane-editor.ide-codemirror-wrapper');
        console.log('[Design Manager] Estado del wrapper:', {
            found: !!editorWrapper,
            classList: editorWrapper?.classList?.toString(),
            children: editorWrapper?.children?.length
        });

        if (!editorWrapper) {
            console.log('[Design Manager] Wrapper del editor no encontrado');
            // Listar todos los elementos con clase similar para debugging
            const possibleWrappers = document.querySelectorAll('[class*="code-pane"],[class*="codemirror"],[class*="editor"]');
            console.log('[Design Manager] Elementos similares encontrados:', Array.from(possibleWrappers).map(el => ({
                className: el.className,
                id: el.id,
                tagName: el.tagName
            })));
            return;
        }

        // Buscar la instancia de CodeMirror
        const editorElement = editorWrapper.querySelector('.CodeMirror.cm-s-hubspot-canvas-dark');
        console.log('[Design Manager] Estado del elemento CodeMirror:', {
            found: !!editorElement,
            classList: editorElement?.classList?.toString(),
            hasCodeMirror: !!editorElement?.CodeMirror
        });

        if (!editorElement) {
            console.log('[Design Manager] Elemento CodeMirror no encontrado');
            return;
        }

        // Si encontramos el elemento pero no tiene la instancia, esperamos
        if (!state.editor && editorElement) {
            console.log('[Design Manager] Esperando a que la instancia de CodeMirror se inicialice...');
            waitForCodeMirrorInstance(editorElement)
                .then(cmInstance => {
                    console.log('[Design Manager] Nueva instancia de editor encontrada, configurando...', {
                        mode: cmInstance.getOption('mode'),
                        theme: cmInstance.getOption('theme'),
                        lineNumbers: cmInstance.getOption('lineNumbers')
                    });
                    state.editor = cmInstance;
                })
                .catch(error => {
                    console.error('[Design Manager] Error al esperar la instancia:', error);
                });
        }
    }

    function init() {
        console.log('[Design Manager] Iniciando inicialización...');
        if (state.isInitialized) {
            console.log('[Design Manager] Ya inicializado, saliendo...');
            return;
        }

        findAndSetupEditor();

        const editorObserver = new MutationObserver(() => {
            console.log('[Design Manager] Cambios en el DOM detectados, verificando editor...');
            findAndSetupEditor();
        });

        editorObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        state.isInitialized = true;
        console.log('[Design Manager] Inicialización completada');
    }

    return { init };
})();
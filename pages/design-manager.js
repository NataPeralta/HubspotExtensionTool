window.designManager = (function() {
    let state = {
        isInitialized: false,
        editor: null
    };

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

        if (!editorElement?.CodeMirror) {
            console.log('[Design Manager] Instancia de CodeMirror no encontrada');
            // Listar todas las instancias de CodeMirror para debugging
            const allCodeMirrors = document.querySelectorAll('.CodeMirror');
            console.log('[Design Manager] Todas las instancias de CodeMirror:', Array.from(allCodeMirrors).map(el => ({
                className: el.className,
                hasInstance: !!el.CodeMirror
            })));
            return;
        }

        if (!state.editor) {
            console.log('[Design Manager] Nueva instancia de editor encontrada, configurando...');
            state.editor = editorElement.CodeMirror;
            console.log('[Design Manager] Editor configurado exitosamente', {
                mode: state.editor.getOption('mode'),
                theme: state.editor.getOption('theme'),
                lineNumbers: state.editor.getOption('lineNumbers')
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
window.designManager = (function() {
    let state = {
        isInitialized: false,
        editor: null
    };

    function findAndSetupEditor() {
        console.log('[Design Manager] Buscando editor...');
        const editorWrapper = document.querySelector('.code-pane-editor.ide-codemirror-wrapper');
        if (!editorWrapper) {
            console.log('[Design Manager] Wrapper del editor no encontrado');
            return;
        }

        const editorElement = editorWrapper.querySelector('.CodeMirror.cm-s-hubspot-canvas-dark');
        if (!editorElement?.CodeMirror) {
            console.log('[Design Manager] Instancia de CodeMirror no encontrada');
            return;
        }

        if (!state.editor) {
            console.log('[Design Manager] Nueva instancia de editor encontrada, configurando...');
            state.editor = editorElement.CodeMirror;
            console.log('[Design Manager] Editor configurado exitosamente');
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
window.designManager = (function() {
    let state = {
        isInitialized: false,
        editorElement: null,
        customControls: null
    };

    function createCustomControls() {
        const controls = document.createElement('div');
        controls.className = 'hubspot-extension-controls';
        controls.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            background: #2d3e50;
            padding: 5px;
            z-index: 1000;
        `;

        // Aquí agregaremos los botones y controles de la extensión
        return controls;
    }

    function findAndSetupEditor() {
        console.log('[Design Manager] Buscando editor...');

        // Buscar el wrapper del editor
        const editorWrapper = document.querySelector('.code-pane-editor.ide-codemirror-wrapper');

        if (!editorWrapper) {
            console.log('[Design Manager] Editor no encontrado, reintentando...');
            return;
        }

        if (!state.customControls) {
            console.log('[Design Manager] Inicializando controles personalizados...');
            state.customControls = createCustomControls();
            editorWrapper.appendChild(state.customControls);
            console.log('[Design Manager] Controles agregados al editor');
        }

        // Guardar referencia al elemento del editor
        state.editorElement = editorWrapper;
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
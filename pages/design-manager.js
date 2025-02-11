window.designManager = (function() {
    let state = {
        isInitialized: false,
        editorInstance: null,
        editorElement: null,
        customControls: null
    };

    function createCustomControls() {
        const controls = document.createElement('div');
        controls.className = 'hubspot-extension-controls';
        controls.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #2d3e50;
            padding: 5px;
            z-index: 9999;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;

        // Crear botón de toggle para el panel
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Toggle Editor';
        toggleButton.style.cssText = `
            background: #00a4bd;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-family: 'Helvetica Neue', Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
        `;

        toggleButton.addEventListener('mouseover', () => {
            toggleButton.style.backgroundColor = '#0091a8';
        });

        toggleButton.addEventListener('mouseout', () => {
            toggleButton.style.backgroundColor = '#00a4bd';
        });

        toggleButton.addEventListener('click', () => {
            console.log('[Design Manager] Toggle button clicked');
            if (state.editorElement) {
                const parentContainer = state.editorElement.closest('.editor-container');
                if (parentContainer) {
                    parentContainer.style.display = 
                        parentContainer.style.display === 'none' ? 'block' : 'none';
                    console.log('[Design Manager] Editor visibility toggled:', parentContainer.style.display);
                }
            }
        });

        controls.appendChild(toggleButton);
        return controls;
    }

    function setupEditor(editorInstance) {
        console.log('[Design Manager] Configurando editor...');

        if (!editorInstance) {
            console.warn('[Design Manager] No se proporcionó instancia del editor');
            return;
        }

        state.editorInstance = editorInstance;
        const editorElement = editorInstance.getWrapperElement();

        if (!editorElement) {
            console.warn('[Design Manager] No se encontró el elemento wrapper del editor');
            return;
        }

        state.editorElement = editorElement;

        if (!state.customControls) {
            console.log('[Design Manager] Inicializando controles personalizados...');
            state.customControls = createCustomControls();
            // Agregar los controles al body para que sean fijos en la pantalla
            document.body.appendChild(state.customControls);
            console.log('[Design Manager] Controles agregados al documento');
        }
    }

    function init(editorInstance) {
        console.log('[Design Manager] Iniciando inicialización...');
        if (state.isInitialized) {
            console.log('[Design Manager] Ya inicializado, saliendo...');
            return;
        }

        setupEditor(editorInstance);
        state.isInitialized = true;
        console.log('[Design Manager] Inicialización completada');
    }

    return { init };
})();
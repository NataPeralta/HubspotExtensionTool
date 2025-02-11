window.designPreviewer = (function() {
    let state = {
        isInitialized: false
    };

    function findTargetPanel() {
        console.log('[Design Previewer] Buscando panel objetivo...');
        const panel = document.querySelector("body > div > div > div.previewer-app > div > div.UIFlex__StyledFlex-sc-165q45q-0.jpmCLU.private-flex.preview-module-container > div.UIFlex__StyledFlex-sc-165q45q-0.hOVOWK.private-flex.preview-module-sidebar");
        console.log('[Design Previewer] Estado del panel:', panel ? 'Encontrado' : 'No encontrado');
        return panel;
    }

    function findButtonContainer() {
        console.log('[Design Previewer] Buscando contenedor del botón...');
        const container = document.querySelector("body > div > div > div.previewer-app > div > div.preview-options-toolbar");
        console.log('[Design Previewer] Estado del contenedor:', container ? 'Encontrado' : 'No encontrado');
        return container;
    }

    async function init() {
        console.log('[Design Previewer] Iniciando inicialización...');

        if (state.isInitialized) {
            console.log('[Design Previewer] Ya inicializado, saliendo...');
            return;
        }

        const buttonContainer = findButtonContainer();
        console.log('[Design Previewer] Estado de inicialización:', {
            buttonContainer: buttonContainer ? 'Presente' : 'Ausente',
            hasToggleButton: buttonContainer?.querySelector('.toggle-button') ? 'Sí' : 'No'
        });

        if (!buttonContainer || buttonContainer.querySelector('.toggle-button')) {
            console.log('[Design Previewer] No se puede inicializar: contenedor no encontrado o botón ya existe');
            return;
        }

        state.isInitialized = true;
        console.log('[Design Previewer] Inicialización completada con éxito');
    }

    return { init };
})();
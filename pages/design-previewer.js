let isPanelCollapsed = false;
let isInitialized = false;
let originalWidth = null;
let originalMinWidth = null;

function findTargetPanel() {
    console.log('Buscando panel objetivo en Design Previewer...');
    const panel = document.querySelector("body > div > div > div.previewer-app > div > div.UIFlex__StyledFlex-sc-165q45q-0.jpmCLU.private-flex.preview-module-container > div.UIFlex__StyledFlex-sc-165q45q-0.hOVOWK.private-flex.preview-module-sidebar");
    console.log('Panel encontrado:', panel);
    return panel;
}

function findButtonContainer() {
    console.log('Buscando contenedor del botón en Design Previewer...');
    const container = document.querySelector("body > div > div > div.previewer-app > div > div.preview-options-toolbar");
    console.log('Contenedor encontrado:', container);
    return container;
}

function togglePanel() {
    const panel = findTargetPanel();
    if (!panel) {
        console.log('No se pudo encontrar el panel para toggle');
        return;
    }

    isPanelCollapsed = !isPanelCollapsed;
    console.log('Cambiando estado del panel:', isPanelCollapsed);

    if (isPanelCollapsed) {
        originalWidth = panel.style.width || window.getComputedStyle(panel).width;
        originalMinWidth = panel.style.minWidth || window.getComputedStyle(panel).minWidth;
        console.log('Guardando dimensiones originales:', { originalWidth, originalMinWidth });

        panel.style.width = '0px';
        panel.style.minWidth = 'none';
        panel.classList.add('collapsed');
    } else {
        console.log('Restaurando dimensiones originales:', { originalWidth, originalMinWidth });
        panel.style.width = originalWidth;
        panel.style.minWidth = originalMinWidth;
        panel.classList.remove('collapsed');
    }

    window.utils.saveToggleState(isPanelCollapsed);
}

async function init() {
    if (isInitialized) {
        console.log('Design Previewer ya está inicializado');
        return;
    }

    console.log('Inicializando Design Previewer...');
    isPanelCollapsed = await window.utils.initializeToggleState();

    const buttonContainer = findButtonContainer();
    if (!buttonContainer || buttonContainer.querySelector('.toggle-button')) {
        console.log('No se puede inicializar: contenedor no encontrado o botón ya existe');
        return;
    }

    const toggleButton = window.utils.createToggleButton();
    buttonContainer.appendChild(toggleButton);
    toggleButton.addEventListener('click', togglePanel);

    if (isPanelCollapsed) {
        const panel = findTargetPanel();
        if (panel) {
            originalWidth = panel.style.width || window.getComputedStyle(panel).width;
            originalMinWidth = panel.style.minWidth || window.getComputedStyle(panel).minWidth;
            console.log('Aplicando estado colapsado inicial:', { originalWidth, originalMinWidth });

            panel.style.width = '0px';
            panel.style.minWidth = 'none';
            panel.classList.add('collapsed');
        }
    }

    isInitialized = true;
    console.log('Design Previewer inicializado completamente');
}

window.designPreviewer = { init };
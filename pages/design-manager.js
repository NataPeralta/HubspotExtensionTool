let isPanelCollapsed = false;
let isInitialized = false;
let originalWidth = null;
let originalMinWidth = null;

function findTargetPanel() {
    console.log('Buscando panel objetivo en Design Manager...');
    const panel = document.querySelector("body > div.page > div > div.tour-container > div > div.UIFlex__StyledFlex-sc-123tvm-0.hrHyrW.private-flex.resizable-panes.application-pane > div.UIBox__Box-ya7skb-0.hCEmYI.private-flex__child.resizable-pane.application-container__main.is--vertical > div > div.editor-container > div > div.UIFlex__StyledFlex-sc-123tvm-0.hrHyrW.private-flex.resizable-panes > div.UIBox__Box-ya7skb-0.hCDAKA.private-flex__child.resizable-pane.is--vertical");
    console.log('Panel encontrado:', panel);
    return panel;
}

function findButtonContainer() {
    console.log('Buscando contenedor del botón en Design Manager...');
    const container = document.querySelector("body > div.page > div > div.tour-container > div > div.UIFlex__StyledFlex-sc-123tvm-0.hrHyrW.private-flex.resizable-panes.application-pane > div.UIBox__Box-ya7skb-0.hCEmYI.private-flex__child.resizable-pane.application-container__main.is--vertical > div > div.editor-container > div > div.private-tool-bar.editor-toolbar > div > div:nth-child(3) > div");
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
        console.log('Design Manager ya está inicializado');
        return;
    }

    console.log('Inicializando Design Manager...');
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
    console.log('Design Manager inicializado completamente');
}

window.designManager = { init };
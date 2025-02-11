// Estado global para el toggle
let isPanelCollapsed = false;
let isInitialized = false;
let originalWidth = null;
let originalMinWidth = null;

// Función para encontrar el panel objetivo
function findTargetPanel() {
    console.log('Buscando panel objetivo...');
    // Usando el selector específico proporcionado
    let panel = document.querySelector('div.UIFlex__StyledFlex-sc-123tvm-0.hrHyrW.private-flex.resizable-panes.application-pane > div.UIBox__Box-ya7skb-0.hCEmYI.private-flex__child.resizable-pane.application-container__main.is--vertical > div > div.editor-container > div > div.UIFlex__StyledFlex-sc-123tvm-0.hrHyrW.private-flex.resizable-panes > div.UIBox__Box-ya7skb-0.hCDAKA.private-flex__child.resizable-pane.is--vertical');
    if (panel) {
        console.log('Panel encontrado con selector principal');
        return panel;
    }

    // Selector alternativo por si cambian las clases dinámicas
    panel = document.querySelector('[class*="UIBox__Box"][class*="private-flex__child"][class*="resizable-pane"][class*="is--vertical"]');
    if (panel) {
        console.log('Panel encontrado con selector alternativo');
        return panel;
    }

    console.log('No se encontró ningún panel');
    return null;
}

// Función para encontrar el contenedor del botón
function findButtonContainer() {
    console.log('Buscando contenedor del botón...');

    // Buscar el div padre específico
    let container = document.querySelector("body > div.page > div > div.tour-container > div > div.UIFlex__StyledFlex-sc-123tvm-0.hrHyrW.private-flex.resizable-panes.application-pane > div.UIBox__Box-ya7skb-0.hCEmYI.private-flex__child.resizable-pane.application-container__main.is--vertical > div > div.editor-container > div > div.private-tool-bar.editor-toolbar > div > div:nth-child(3) > div");
    if (container) {
        console.log('Contenedor encontrado con selector principal');
        return container;
    }

    console.log('No se encontró ningún contenedor para el botón');
    return null;
}

// Función para crear el botón de toggle
function createToggleButton() {
    console.log('Creando botón de toggle');
    const button = document.createElement('button');
    button.className = 'toggle-button';
    button.innerHTML = `
        <span class="toggle-icon">⇄</span>
    `;
    return button;
}

// Función para manejar el toggle del panel
function togglePanel() {
    const panel = findTargetPanel();
    if (!panel) {
        console.log('Panel no encontrado');
        return;
    }

    isPanelCollapsed = !isPanelCollapsed;
    console.log('Toggle panel - nuevo estado:', isPanelCollapsed);

    if (isPanelCollapsed) {
        // Guardar dimensiones originales antes de colapsar
        originalWidth = panel.style.width || window.getComputedStyle(panel).width;
        originalMinWidth = panel.style.minWidth || window.getComputedStyle(panel).minWidth;
        console.log('Guardando dimensiones originales:', { originalWidth, originalMinWidth });

        panel.style.width = '0px';
        panel.style.minWidth = 'unset';
        panel.classList.add('collapsed');
    } else {
        // Restaurar dimensiones originales
        panel.style.width = originalWidth;
        panel.style.minWidth = originalMinWidth;
        panel.classList.remove('collapsed');
        console.log('Restaurando dimensiones originales:', { originalWidth, originalMinWidth });
    }

    // Guardar el estado en el almacenamiento local
    chrome.storage.local.set({ isPanelCollapsed });
}

// Función principal de inicialización
function init() {
    if (isInitialized) {
        console.log('Ya está inicializado');
        return;
    }

    console.log('Inicializando extensión HubSpot Layout Manager');

    // Recuperar el estado guardado
    chrome.storage.local.get(['isPanelCollapsed'], (result) => {
        isPanelCollapsed = result.isPanelCollapsed || false;
        console.log('Estado recuperado:', isPanelCollapsed);

        const buttonContainer = findButtonContainer();
        if (!buttonContainer) {
            console.log('Contenedor del botón no encontrado');
            return;
        }

        // Verificar si ya existe un botón
        if (buttonContainer.querySelector('.toggle-button')) {
            console.log('El botón ya existe');
            return;
        }

        const toggleButton = createToggleButton();
        buttonContainer.appendChild(toggleButton);
        toggleButton.addEventListener('click', togglePanel);

        // Aplicar el estado inicial si está colapsado
        if (isPanelCollapsed) {
            const panel = findTargetPanel();
            if (panel) {
                // Guardar dimensiones originales
                originalWidth = panel.style.width || window.getComputedStyle(panel).width;
                originalMinWidth = panel.style.minWidth || window.getComputedStyle(panel).minWidth;

                panel.style.width = '0px';
                panel.style.minWidth = 'unset';
                panel.classList.add('collapsed');
            }
        }

        isInitialized = true;
    });
}

// Observador de mutaciones para manejar cambios dinámicos en el DOM
const observer = new MutationObserver((mutations) => {
    const buttonExists = document.querySelector('.toggle-button');
    const containerExists = findButtonContainer();

    if (!buttonExists && containerExists && !isInitialized) {
        console.log('Toggle button no encontrado, reinicializando...');
        init();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Inicialización inicial
init();
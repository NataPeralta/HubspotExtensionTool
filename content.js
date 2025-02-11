// Estado global para el toggle
let isPanelCollapsed = false;

// Función para encontrar el panel objetivo
function findTargetPanel() {
    return document.querySelector('.UIBox__Box-ya7skb-0.hCDAKA.private-flex__child.resizable-pane.is--vertical');
}

// Función para encontrar el contenedor del botón
function findButtonContainer() {
    return document.querySelector("body > div.page > div > div.tour-container > div > div.UIFlex__StyledFlex-sc-123tvm-0.hrHyrW.private-flex.resizable-panes.application-pane > div.UIBox__Box-ya7skb-0.hCEmYI.private-flex__child.resizable-pane.application-container__main.is--vertical > div > div.editor-container > div > div.UIFlex__StyledFlex-sc-123tvm-0.hrHyrW.private-flex.resizable-panes > div.UIBox__Box-ya7skb-0.hCDAKA.private-flex__child.resizable-pane.is--vertical > div > div > div.UIBox__Box-ya7skb-0.hCDAKA.private-flex__child > div");
}

// Función para crear el botón de toggle
function createToggleButton() {
    const button = document.createElement('button');
    button.className = 'hubspot-layout-toggle uiButton private-button private-button--transparent private-button--default UIIconButton__Button-ivih4-0 kjgObt private-button--icon-only finder-toggle-button p-all-2 private-button--non-responsive private-button--non-link';
    button.setAttribute('data-button-use', 'transparent');
    button.innerHTML = `
        <span class="private-icon private-icon__low" data-icon-name="first">
            <span aria-hidden="true" class="UIIcon__IconContent-sc-1rupovw-0 gaeDOo">⇄</span>
        </span>
    `;
    return button;
}

// Función para manejar el toggle del panel
function togglePanel() {
    const panel = findTargetPanel();
    if (!panel) return;

    isPanelCollapsed = !isPanelCollapsed;
    
    if (isPanelCollapsed) {
        panel.style.width = '30px';
        panel.style.minWidth = '30px';
        panel.classList.add('collapsed');
    } else {
        panel.style.width = '';
        panel.style.minWidth = '';
        panel.classList.remove('collapsed');
    }

    // Guardar el estado en el almacenamiento local
    chrome.storage.local.set({ isPanelCollapsed });
}

// Función principal de inicialización
function init() {
    // Recuperar el estado guardado
    chrome.storage.local.get(['isPanelCollapsed'], (result) => {
        isPanelCollapsed = result.isPanelCollapsed || false;
        
        const buttonContainer = findButtonContainer();
        if (!buttonContainer) return;

        const toggleButton = createToggleButton();
        buttonContainer.appendChild(toggleButton);

        toggleButton.addEventListener('click', togglePanel);

        // Aplicar el estado inicial si está colapsado
        if (isPanelCollapsed) {
            const panel = findTargetPanel();
            if (panel) {
                panel.style.width = '30px';
                panel.style.minWidth = '30px';
                panel.classList.add('collapsed');
            }
        }
    });
}

// Observador de mutaciones para manejar cambios dinámicos en el DOM
const observer = new MutationObserver((mutations) => {
    if (!document.querySelector('.hubspot-layout-toggle')) {
        init();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Inicialización inicial
init();

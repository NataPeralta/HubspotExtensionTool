// Estado global para el toggle
let isPanelCollapsed = false;

// Función para encontrar el panel objetivo
function findTargetPanel() {
    // Primero intentamos con el selector específico de HubSpot
    let panel = document.querySelector('.custom-widget-editor-sidebar.main-sidebar');

    // Si no funciona, intentamos con los selectores alternativos
    if (!panel) {
        panel = document.querySelector('.resizable-pane.is--vertical');
    }
    if (!panel) {
        panel = document.querySelector('[class*="resizable-pane"][class*="is--vertical"]');
    }

    return panel;
}

// Función para encontrar el contenedor del botón
function findButtonContainer() {
    // Primero intentamos con el selector específico de HubSpot
    let container = document.querySelector('.dm-tool__breadcrumbs.field-edit-breadcrumbs');

    // Si no funciona, intentamos con el selector más específico
    if (!container) {
        container = document.querySelector('[class*="ToolBreadcrumbs__StyledFlexContainer"]');
    }

    // Último intento con el selector más genérico
    if (!container) {
        container = document.querySelector('[class*="dm-tool__breadcrumbs"]');
    }

    return container;
}

// Función para crear el botón de toggle
function createToggleButton() {
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
    if (!document.querySelector('.toggle-button')) {
        init();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Inicialización inicial
init();
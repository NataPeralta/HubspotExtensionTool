// Estado global para el toggle
let isPanelCollapsed = false;

// Función para encontrar el panel objetivo
function findTargetPanel() {
    console.log('Buscando panel objetivo...');
    // Primero intentamos con el selector específico de HubSpot
    let panel = document.querySelector('.custom-widget-editor-sidebar.main-sidebar');
    if (panel) {
        console.log('Panel encontrado con selector principal');
        return panel;
    }

    // Si no funciona, intentamos con los selectores alternativos
    panel = document.querySelector('.resizable-pane.is--vertical');
    if (panel) {
        console.log('Panel encontrado con selector alternativo 1');
        return panel;
    }

    panel = document.querySelector('[class*="resizable-pane"][class*="is--vertical"]');
    if (panel) {
        console.log('Panel encontrado con selector alternativo 2');
        return panel;
    }

    console.log('No se encontró ningún panel');
    return null;
}

// Función para encontrar el contenedor del botón
function findButtonContainer() {
    console.log('Buscando contenedor del botón...');

    // Primero intentamos con el selector específico de HubSpot
    let container = document.querySelector('.dm-tool__breadcrumbs.field-edit-breadcrumbs');
    if (container) {
        console.log('Contenedor encontrado con selector principal');
        return container;
    }

    // Si no funciona, intentamos con el selector más específico
    container = document.querySelector('[class*="ToolBreadcrumbs__StyledFlexContainer"]');
    if (container) {
        console.log('Contenedor encontrado con selector alternativo 1');
        return container;
    }

    // Último intento con el selector más genérico
    container = document.querySelector('[class*="dm-tool__breadcrumbs"]');
    if (container) {
        console.log('Contenedor encontrado con selector alternativo 2');
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
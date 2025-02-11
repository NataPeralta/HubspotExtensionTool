// Funciones comunes para todas las páginas
function createToggleButton() {
    console.log('Creando botón de toggle');
    const button = document.createElement('button');
    button.className = 'toggle-button';
    button.innerHTML = `
        <span class="toggle-icon">⇄</span>
    `;
    return button;
}

function initializeToggleState() {
    console.log('Inicializando estado del toggle');
    return new Promise((resolve) => {
        chrome.storage.local.get(['isPanelCollapsed'], (result) => {
            console.log('Estado recuperado:', result.isPanelCollapsed);
            resolve(result.isPanelCollapsed || false);
        });
    });
}

function saveToggleState(isPanelCollapsed) {
    console.log('Guardando estado del toggle:', isPanelCollapsed);
    chrome.storage.local.set({ isPanelCollapsed });
}

window.utils = {
    createToggleButton,
    initializeToggleState,
    saveToggleState
};
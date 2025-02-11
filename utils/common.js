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
    return new Promise((resolve) => {
        chrome.storage.local.get(['isPanelCollapsed'], (result) => {
            resolve(result.isPanelCollapsed || false);
        });
    });
}

function saveToggleState(isPanelCollapsed) {
    chrome.storage.local.set({ isPanelCollapsed });
}

export { createToggleButton, initializeToggleState, saveToggleState };

// Escuchar cuando se instala la extensión
chrome.runtime.onInstalled.addListener(() => {
    // Inicializar el estado
    chrome.storage.local.set({ isPanelCollapsed: false });
});

// Manejar mensajes de content script si es necesario
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getState') {
        chrome.storage.local.get(['isPanelCollapsed'], (result) => {
            sendResponse({ isPanelCollapsed: result.isPanelCollapsed });
        });
        return true;
    }
});

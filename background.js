// Escuchar cuando se instala la extensión
chrome.runtime.onInstalled.addListener(() => {
    // Inicializar el estado
    chrome.storage.local.set({ isPanelCollapsed: false });
    console.log('Extensión instalada y estado inicializado');
});

// Manejar mensajes de content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'checkCodeMirror') {
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            func: () => {
                return {
                    hasCodeMirror: typeof window.CodeMirror !== 'undefined',
                    hasShowHint: window.CodeMirror && typeof window.CodeMirror.showHint !== 'undefined'
                };
            }
        }).then(result => {
            sendResponse(result[0].result);
        }).catch(error => {
            sendResponse({ error: error.message });
        });
        return true;
    }
});
console.log('[Background] Service worker starting...');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[Background] Message received:', request);

    if (request.type === 'checkCodeMirror') {
        console.log('[Background] Checking CodeMirror availability for tab:', sender.tab.id);

        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            func: () => {
                console.log('[Background Script] Checking CodeMirror in page context');
                return {
                    hasCodeMirror: typeof window.CodeMirror !== 'undefined',
                    hasShowHint: window.CodeMirror && typeof window.CodeMirror.showHint !== 'undefined'
                };
            }
        }).then(result => {
            console.log('[Background] CodeMirror check result:', result[0].result);
            sendResponse(result[0].result);
        }).catch(error => {
            console.error('[Background] Error checking CodeMirror:', error);
            sendResponse({ error: error.message });
        });
        return true;
    }
});

console.log('[Background] Service worker ready');
function getCurrentPage() {
    const url = window.location.href;
    if (url.includes('design-manager')) {
        return 'design-manager';
    }
    return null;
}

async function checkCodeMirrorAvailability() {
    try {
        const editorWrapper = document.querySelector('.code-pane-editor.ide-codemirror-wrapper');
        const editorElement = editorWrapper?.querySelector('.CodeMirror.cm-s-hubspot-canvas-dark');

        const response = await chrome.runtime.sendMessage({ type: 'checkCodeMirror' });

        return response.hasCodeMirror && 
               response.hasShowHint && 
               editorElement?.CodeMirror;
    } catch (error) {
        return false;
    }
}

async function initializePage() {
    const currentPage = getCurrentPage();
    if (!currentPage) return;

    const isCodeMirrorAvailable = await checkCodeMirrorAvailability();
    if (!isCodeMirrorAvailable) {
        setTimeout(initializePage, 1000);
        return;
    }

    if (currentPage === 'design-manager') {
        window.designManager.init();
    }
}

const observer = new MutationObserver((mutations) => {
    const hasRelevantChanges = mutations.some(mutation => {
        const addedNodes = Array.from(mutation.addedNodes);
        return addedNodes.some(node => {
            if (node.classList) {
                return node.classList.contains('CodeMirror') || 
                       node.classList.contains('code-pane-editor');
            }
            return false;
        });
    });

    if (hasRelevantChanges) {
        initializePage();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

initializePage();
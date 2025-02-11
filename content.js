function getCurrentPage() {
    console.log('[Content Script] Checking current page...');
    const isDesignManager = window.location.href.includes('design-manager');
    console.log('[Content Script] Current page is design-manager:', isDesignManager);
    return isDesignManager ? 'design-manager' : null;
}

function waitForElement(selector, callback, maxAttempts = 20) {
    let attempts = 0;

    const checkElement = () => {
        attempts++;
        console.log(`[Content Script] Checking for element ${selector} (attempt ${attempts}/${maxAttempts})`);
        const element = document.querySelector(selector);

        if (element) {
            console.log(`[Content Script] Element ${selector} found, executing callback`);
            callback(element);
        } else if (attempts < maxAttempts) {
            console.log(`[Content Script] Element ${selector} not found, retrying...`);
            setTimeout(checkElement, 500);
        } else {
            console.log(`[Content Script] Max attempts reached for element ${selector}`);
        }
    };

    checkElement();
}

function initializePage() {
    console.log('[Content Script] Initializing page...');
    const currentPage = getCurrentPage();
    if (!currentPage) {
        console.log('[Content Script] Not a supported page, exiting initialization');
        return;
    }

    waitForElement('.code-pane-editor', () => {
        if (currentPage === 'design-manager') {
            try {
                console.log('[Content Script] Attempting to initialize design manager...');
                if (typeof window.designManager !== 'undefined') {
                    console.log('[Content Script] Design manager found, initializing...');
                    window.designManager.init();
                } else {
                    console.log('[Content Script] Design manager not found, retrying...');
                    setTimeout(initializePage, 500);
                }
            } catch (error) {
                console.error('[Content Script] Error initializing design manager:', error);
                setTimeout(initializePage, 500);
            }
        }
    });
}

const observer = new MutationObserver((mutations) => {
    console.log('[Content Script] DOM mutations detected, checking for relevant changes...');
    const hasRelevantChanges = mutations.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => {
            return node.classList && 
                   (node.classList.contains('CodeMirror') || 
                    node.classList.contains('code-pane-editor'));
        });
    });

    if (hasRelevantChanges) {
        console.log('[Content Script] Relevant changes found, reinitializing...');
        initializePage();
    }
});

console.log('[Content Script] Setting up mutation observer...');
observer.observe(document.body, {
    childList: true,
    subtree: true
});

if (document.readyState === 'loading') {
    console.log('[Content Script] Document still loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    console.log('[Content Script] Document already loaded, initializing immediately...');
    initializePage();
}
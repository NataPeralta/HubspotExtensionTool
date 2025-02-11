function getCurrentPage() {
    return window.location.href.includes('design-manager') ? 'design-manager' : null;
}

function waitForElement(selector, callback, maxAttempts = 20) {
    let attempts = 0;

    const checkElement = () => {
        attempts++;
        const element = document.querySelector(selector);

        if (element) {
            callback(element);
        } else if (attempts < maxAttempts) {
            setTimeout(checkElement, 500);
        }
    };

    checkElement();
}

function initializePage() {
    const currentPage = getCurrentPage();
    if (!currentPage) return;

    waitForElement('.code-pane-editor', () => {
        if (currentPage === 'design-manager') {
            try {
                if (typeof window.designManager !== 'undefined') {
                    window.designManager.init();
                } else {
                    setTimeout(initializePage, 500);
                }
            } catch (error) {
                setTimeout(initializePage, 500);
            }
        }
    });
}

const observer = new MutationObserver((mutations) => {
    const hasRelevantChanges = mutations.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => {
            return node.classList && 
                   (node.classList.contains('CodeMirror') || 
                    node.classList.contains('code-pane-editor'));
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

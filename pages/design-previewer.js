window.designPreviewer = (function() {
    let state = {
        isInitialized: false
    };

    function findTargetPanel() {
        return document.querySelector("body > div > div > div.previewer-app > div > div.UIFlex__StyledFlex-sc-165q45q-0.jpmCLU.private-flex.preview-module-container > div.UIFlex__StyledFlex-sc-165q45q-0.hOVOWK.private-flex.preview-module-sidebar");
    }

    function findButtonContainer() {
        return document.querySelector("body > div > div > div.previewer-app > div > div.preview-options-toolbar");
    }

    async function init() {
        if (state.isInitialized) {
            return;
        }

        const buttonContainer = findButtonContainer();
        if (!buttonContainer || buttonContainer.querySelector('.toggle-button')) {
            return;
        }

        state.isInitialized = true;
    }

    return { init };
})();
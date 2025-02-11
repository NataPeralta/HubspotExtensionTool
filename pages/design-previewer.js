import { createToggleButton, initializeToggleState, saveToggleState } from '../utils/common.js';

let isPanelCollapsed = false;
let isInitialized = false;
let originalWidth = null;
let originalMinWidth = null;

function findTargetPanel() {
    return document.querySelector("body > div > div > div.previewer-app > div > div.UIFlex__StyledFlex-sc-165q45q-0.jpmCLU.private-flex.preview-module-container > div.UIFlex__StyledFlex-sc-165q45q-0.hOVOWK.private-flex.preview-module-sidebar");
}

function findButtonContainer() {
    return document.querySelector("body > div > div > div.previewer-app > div > div.preview-options-toolbar");
}

function togglePanel() {
    const panel = findTargetPanel();
    if (!panel) return;

    isPanelCollapsed = !isPanelCollapsed;
    
    if (isPanelCollapsed) {
        originalWidth = panel.style.width || window.getComputedStyle(panel).width;
        originalMinWidth = panel.style.minWidth || window.getComputedStyle(panel).minWidth;
        panel.style.width = '0px';
        panel.style.minWidth = 'unset';
        panel.classList.add('collapsed');
    } else {
        panel.style.width = originalWidth;
        panel.style.minWidth = originalMinWidth;
        panel.classList.remove('collapsed');
    }
    
    saveToggleState(isPanelCollapsed);
}

async function init() {
    if (isInitialized) return;
    
    isPanelCollapsed = await initializeToggleState();
    const buttonContainer = findButtonContainer();
    if (!buttonContainer || buttonContainer.querySelector('.toggle-button')) return;

    const toggleButton = createToggleButton();
    buttonContainer.appendChild(toggleButton);
    toggleButton.addEventListener('click', togglePanel);

    if (isPanelCollapsed) {
        const panel = findTargetPanel();
        if (panel) {
            originalWidth = panel.style.width || window.getComputedStyle(panel).width;
            originalMinWidth = panel.style.minWidth || window.getComputedStyle(panel).minWidth;
            panel.style.width = '0px';
            panel.style.minWidth = 'unset';
            panel.classList.add('collapsed');
        }
    }

    isInitialized = true;
}

export { init };

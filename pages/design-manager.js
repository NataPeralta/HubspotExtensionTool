import { createToggleButton, initializeToggleState, saveToggleState } from '../utils/common.js';

let isPanelCollapsed = false;
let isInitialized = false;
let originalWidth = null;
let originalMinWidth = null;

function findTargetPanel() {
    console.log('Buscando panel objetivo...');
    return document.querySelector('div.UIFlex__StyledFlex-sc-123tvm-0.hrHyrW.private-flex.resizable-panes.application-pane > div.UIBox__Box-ya7skb-0.hCEmYI.private-flex__child.resizable-pane.application-container__main.is--vertical > div > div.editor-container > div > div.UIFlex__StyledFlex-sc-123tvm-0.hrHyrW.private-flex.resizable-panes > div.UIBox__Box-ya7skb-0.hCDAKA.private-flex__child.resizable-pane.is--vertical');
}

function findButtonContainer() {
    return document.querySelector("body > div.page > div > div.tour-container > div > div.UIFlex__StyledFlex-sc-123tvm-0.hrHyrW.private-flex.resizable-panes.application-pane > div.UIBox__Box-ya7skb-0.hCEmYI.private-flex__child.resizable-pane.application-container__main.is--vertical > div > div.editor-container > div > div.private-tool-bar.editor-toolbar > div > div:nth-child(3) > div");
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

// Encapsulate state in a closure
window.designManager = (function() {
    let state = {
        isPanelCollapsed: false,
        isInitialized: false,
        originalWidth: null,
        originalMinWidth: null,
        editor: null
    };

    function findTargetPanel() {
        console.log('Buscando panel objetivo en Design Manager...');
        const panel = document.querySelector("body > div.page > div > div.tour-container > div > div.UIFlex__StyledFlex-sc-123tvm-0.hrHyrW.private-flex.resizable-panes.application-pane > div.UIBox__Box-ya7skb-0.hCEmYI.private-flex__child.resizable-pane.application-container__main.is--vertical > div > div.editor-container > div > div.UIFlex__StyledFlex-sc-123tvm-0.hrHyrW.private-flex.resizable-panes > div.UIBox__Box-ya7skb-0.hCDAKA.private-flex__child.resizable-pane.is--vertical");
        console.log('Panel encontrado:', panel);
        return panel;
    }

    function findButtonContainer() {
        console.log('Buscando contenedor del botón en Design Manager...');
        const container = document.querySelector("body > div.page > div > div.tour-container > div > div.UIFlex__StyledFlex-sc-123tvm-0.hrHyrW.private-flex.resizable-panes.application-pane > div.UIBox__Box-ya7skb-0.hCEmYI.private-flex__child.resizable-pane.application-container__main.is--vertical > div > div.editor-container > div > div.private-tool-bar.editor-toolbar > div > div:nth-child(3) > div");
        console.log('Contenedor encontrado:', container);
        return container;
    }

    function togglePanel() {
        const panel = findTargetPanel();
        if (!panel) {
            console.log('No se pudo encontrar el panel para toggle');
            return;
        }

        state.isPanelCollapsed = !state.isPanelCollapsed;
        console.log('Cambiando estado del panel:', state.isPanelCollapsed);

        if (state.isPanelCollapsed) {
            state.originalWidth = panel.style.width || window.getComputedStyle(panel).width;
            state.originalMinWidth = panel.style.minWidth || window.getComputedStyle(panel).minWidth;
            console.log('Guardando dimensiones originales:', { originalWidth: state.originalWidth, originalMinWidth: state.originalMinWidth });

            panel.style.width = '0px';
            panel.style.minWidth = 'none';
            panel.classList.add('collapsed');
        } else {
            console.log('Restaurando dimensiones originales:', { originalWidth: state.originalWidth, originalMinWidth: state.originalMinWidth });
            panel.style.width = state.originalWidth;
            panel.style.minWidth = state.originalMinWidth;
            panel.classList.remove('collapsed');
        }

        window.utils.saveToggleState(state.isPanelCollapsed);
    }

    function setupHublAutocomplete(editor) {
        const hublDefinitions = {
            tags: [
                { text: "hubldoc", displayText: "hubldoc - HubL Documentation Tag", description: "Adds HubL documentation" },
                { text: "include", displayText: "include - Include Template", description: "Include another template" },
                { text: "extends", displayText: "extends - Extend Template", description: "Extend a parent template" },
                { text: "block", displayText: "block - Template Block", description: "Define a template block" },
                { text: "widget_block", displayText: "widget_block - Widget Block", description: "Define a widget block" },
                { text: "require_js", displayText: "require_js - Require JavaScript", description: "Include JavaScript dependencies" },
                { text: "require_css", displayText: "require_css - Require CSS", description: "Include CSS dependencies" },
                { text: "module", displayText: "module - HubL Module", description: "Import a HubL module" }
            ],
            variables: [
                { text: "content", displayText: "content - Current Content Object" },
                { text: "request", displayText: "request - Request Object" },
                { text: "template", displayText: "template - Template Info" }
            ],
            filters: [
                { text: "escape", displayText: "escape - Escape String" },
                { text: "safe", displayText: "safe - Mark as Safe" },
                { text: "truncate", displayText: "truncate - Truncate String" }
            ]
        };

        function getHublCompletions(cm, token) {
            const cur = cm.getCursor();
            const line = cm.getLine(cur.line);
            const start = token.start;
            const end = cur.ch;
            const currentWord = token.string.toLowerCase();

            let suggestions = [];
            const context = line.slice(0, start);

            // Detectar el tipo de completado basado en el contexto
            if (context.includes("{%")) {
                suggestions = hublDefinitions.tags;
            } else if (context.includes("{{")) {
                suggestions = hublDefinitions.variables;
            } else if (context.includes("|")) {
                suggestions = hublDefinitions.filters;
            }

            // Filtrar sugerencias basadas en el texto actual
            suggestions = suggestions.filter(item => 
                item.text.toLowerCase().startsWith(currentWord)
            );

            return {
                list: suggestions,
                from: CodeMirror.Pos(cur.line, start),
                to: CodeMirror.Pos(cur.line, end)
            };
        }

        // Configurar triggers para autocompletado
        editor.on("keyup", function(cm, event) {
            const triggers = ["{", "%", "|", ".", " "];
            const shouldTrigger = 
                triggers.includes(event.key) ||
                (event.ctrlKey && event.key === "Space");

            if (shouldTrigger) {
                const cur = cm.getCursor();
                const token = cm.getTokenAt(cur);

                CodeMirror.showHint(cm, function() {
                    return getHublCompletions(cm, token);
                }, {
                    completeSingle: false,
                    closeOnUnfocus: true,
                    alignWithWord: true
                });
            }
        });

        console.log('HubL autocompletado configurado');
    }

    function findAndSetupEditor() {
        const editorElement = document.querySelector('.CodeMirror');
        if (editorElement && editorElement.CodeMirror && !state.editor) {
            console.log('Editor CodeMirror encontrado');
            state.editor = editorElement.CodeMirror;
            setupHublAutocomplete(state.editor);
        }
    }

    async function init() {
        if (state.isInitialized) {
            console.log('Design Manager ya está inicializado');
            return;
        }

        console.log('Inicializando Design Manager...');
        state.isPanelCollapsed = await window.utils.initializeToggleState();

        const buttonContainer = findButtonContainer();
        if (!buttonContainer || buttonContainer.querySelector('.toggle-button')) {
            console.log('No se puede inicializar: contenedor no encontrado o botón ya existe');
            return;
        }

        const toggleButton = window.utils.createToggleButton();
        buttonContainer.appendChild(toggleButton);
        toggleButton.addEventListener('click', togglePanel);

        if (state.isPanelCollapsed) {
            const panel = findTargetPanel();
            if (panel) {
                state.originalWidth = panel.style.width || window.getComputedStyle(panel).width;
                state.originalMinWidth = panel.style.minWidth || window.getComputedStyle(panel).minWidth;
                console.log('Aplicando estado colapsado inicial:', { originalWidth: state.originalWidth, originalMinWidth: state.originalMinWidth });

                panel.style.width = '0px';
                panel.style.minWidth = 'none';
                panel.classList.add('collapsed');
            }
        }

        // Add editor initialization
        const editorObserver = new MutationObserver(() => {
            findAndSetupEditor();
        });

        editorObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        findAndSetupEditor();

        state.isInitialized = true;
        console.log('Design Manager inicializado completamente');
    }

    return { init };
})();
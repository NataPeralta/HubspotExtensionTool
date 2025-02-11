window.designManager = (function() {
    let state = {
        isInitialized: false,
        editor: null
    };

    function setupHublAutocomplete(editor) {
        console.log('[Design Manager] Setting up HubL autocomplete...');
        if (!window.CodeMirror?.showHint) {
            console.log('[Design Manager] CodeMirror showHint not available, skipping autocomplete setup');
            return;
        }

        const hublDefinitions = {
            tags: [
                { text: "hubldoc", displayText: "hubldoc - HubL Documentation Tag" },
                { text: "include", displayText: "include - Include Template" },
                { text: "extends", displayText: "extends - Extend Template" },
                { text: "block", displayText: "block - Template Block" },
                { text: "widget_block", displayText: "widget_block - Widget Block" },
                { text: "require_js", displayText: "require_js - Require JavaScript" },
                { text: "require_css", displayText: "require_css - Require CSS" },
                { text: "module", displayText: "module - HubL Module" }
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
            console.log('[Design Manager] Getting HubL completions...');
            const cur = cm.getCursor();
            const line = cm.getLine(cur.line);
            const start = token.start;
            const end = cur.ch;
            const currentWord = token.string.toLowerCase();

            let suggestions = [];
            const context = line.slice(0, start);
            console.log('[Design Manager] Context:', { line, currentWord, context });

            if (context.includes("{%")) {
                suggestions = hublDefinitions.tags;
            } else if (context.includes("{{")) {
                suggestions = hublDefinitions.variables;
            } else if (context.includes("|")) {
                suggestions = hublDefinitions.filters;
            }

            suggestions = suggestions.filter(item =>
                item.text.toLowerCase().startsWith(currentWord)
            );

            console.log('[Design Manager] Found suggestions:', suggestions.length);
            return {
                list: suggestions,
                from: CodeMirror.Pos(cur.line, start),
                to: CodeMirror.Pos(cur.line, end)
            };
        }

        const triggers = ["{", "%", "|", ".", " "];

        editor.on("keyup", (cm, event) => {
            if (triggers.includes(event.key) || (event.ctrlKey && event.key === "Space")) {
                console.log('[Design Manager] Autocomplete trigger detected:', event.key);
                try {
                    CodeMirror.showHint(cm, () => getHublCompletions(cm, cm.getTokenAt(cm.getCursor())), {
                        completeSingle: false,
                        closeOnUnfocus: true,
                        alignWithWord: true
                    });
                } catch (error) {
                    console.error('[Design Manager] Error showing hints:', error);
                }
            }
        });

        editor.setOption("extraKeys", {
            "Ctrl-Space": (cm) => {
                console.log('[Design Manager] Manual autocomplete triggered (Ctrl+Space)');
                try {
                    CodeMirror.showHint(cm, () => {
                        const token = cm.getTokenAt(cm.getCursor());
                        return getHublCompletions(cm, token);
                    }, {
                        completeSingle: false,
                        closeOnUnfocus: true,
                        alignWithWord: true
                    });
                } catch (error) {
                    console.error('[Design Manager] Error showing hints on manual trigger:', error);
                }
            }
        });

        console.log('[Design Manager] HubL autocomplete setup completed');
    }

    function findAndSetupEditor() {
        console.log('[Design Manager] Looking for editor...');
        const editorWrapper = document.querySelector('.code-pane-editor.ide-codemirror-wrapper');
        if (!editorWrapper) {
            console.log('[Design Manager] Editor wrapper not found');
            return;
        }

        const editorElement = editorWrapper.querySelector('.CodeMirror.cm-s-hubspot-canvas-dark');
        if (!editorElement?.CodeMirror) {
            console.log('[Design Manager] CodeMirror instance not found');
            return;
        }

        if (!state.editor) {
            console.log('[Design Manager] Setting up new editor instance');
            state.editor = editorElement.CodeMirror;
            setupHublAutocomplete(state.editor);
        }
    }

    function init() {
        console.log('[Design Manager] Initializing...');
        if (state.isInitialized) {
            console.log('[Design Manager] Already initialized');
            return;
        }

        findAndSetupEditor();

        const editorObserver = new MutationObserver(() => {
            console.log('[Design Manager] DOM changes detected, checking editor setup');
            findAndSetupEditor();
        });

        editorObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        state.isInitialized = true;
        console.log('[Design Manager] Initialization complete');
    }

    return { init };
})();
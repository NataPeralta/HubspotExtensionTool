window.designManager = (function() {
    let state = {
        isInitialized: false,
        editor: null
    };

    function setupHublAutocomplete(editor) {
        if (!window.CodeMirror?.showHint) return;

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
            const cur = cm.getCursor();
            const line = cm.getLine(cur.line);
            const start = token.start;
            const end = cur.ch;
            const currentWord = token.string.toLowerCase();

            let suggestions = [];
            const context = line.slice(0, start);

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

            return {
                list: suggestions,
                from: CodeMirror.Pos(cur.line, start),
                to: CodeMirror.Pos(cur.line, end)
            };
        }

        const triggers = ["{", "%", "|", ".", " "];

        editor.on("keyup", (cm, event) => {
            if (triggers.includes(event.key) || (event.ctrlKey && event.key === "Space")) {
                try {
                    CodeMirror.showHint(cm, () => getHublCompletions(cm, cm.getTokenAt(cm.getCursor())), {
                        completeSingle: false,
                        closeOnUnfocus: true,
                        alignWithWord: true
                    });
                } catch (error) {}
            }
        });

        editor.setOption("extraKeys", {
            "Ctrl-Space": (cm) => {
                try {
                    CodeMirror.showHint(cm, () => {
                        const token = cm.getTokenAt(cm.getCursor());
                        return getHublCompletions(cm, token);
                    }, {
                        completeSingle: false,
                        closeOnUnfocus: true,
                        alignWithWord: true
                    });
                } catch (error) {}
            }
        });
    }

    function findAndSetupEditor() {
        const editorWrapper = document.querySelector('.code-pane-editor.ide-codemirror-wrapper');
        if (!editorWrapper) return;

        const editorElement = editorWrapper.querySelector('.CodeMirror.cm-s-hubspot-canvas-dark');
        if (!editorElement?.CodeMirror) return;

        if (!state.editor) {
            state.editor = editorElement.CodeMirror;
            setupHublAutocomplete(state.editor);
        }
    }

    function init() {
        if (state.isInitialized) return;

        findAndSetupEditor();

        const editorObserver = new MutationObserver(() => {
            findAndSetupEditor();
        });

        editorObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        state.isInitialized = true;
    }

    return { init };
})();
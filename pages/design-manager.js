window.designManager = (function() {
    let state = {
        isInitialized: false,
        editor: null
    };

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

        editor.on("keyup", function(cm, event) {
            const triggers = ["{", "%", "|", ".", " "];
            const shouldTrigger =
                triggers.includes(event.key) ||
                (event.ctrlKey && event.key === "Space");

            if (shouldTrigger) {
                const cur = cm.getCursor();
                const token = cm.getTokenAt(cur);

                try {
                    CodeMirror.showHint(cm, function() {
                        return getHublCompletions(cm, token);
                    }, {
                        completeSingle: false,
                        closeOnUnfocus: true,
                        alignWithWord: true
                    });
                } catch (error) {}
            }
        });

        editor.setOption("extraKeys", {
            "Ctrl-Space": function(cm) {
                try {
                    CodeMirror.showHint(cm, function(cm) {
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
        if (!editorElement) return;

        if (editorElement.CodeMirror && !state.editor) {
            state.editor = editorElement.CodeMirror;
            setupHublAutocomplete(state.editor);
        }
    }

    async function init() {
        if (state.isInitialized) return;

        const editorObserver = new MutationObserver(() => {
            findAndSetupEditor();
        });

        editorObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        findAndSetupEditor();
        state.isInitialized = true;
    }

    return { init };
})();
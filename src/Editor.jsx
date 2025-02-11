import React, { useEffect, useState } from 'react';
import Editor from "@monaco-editor/react";

const MonacoEditor = () => {
  const [htmlValue, setHtmlValue] = useState('');
  const [cssValue, setCssValue] = useState('');
  const [jsValue, setJsValue] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const extractInitialContent = () => {
    console.log('Extracting initial content from HubSpot editor');
    try {
      const editorElements = document.querySelectorAll('.code-pane-editor textarea');
      editorElements.forEach(editor => {
        const content = editor.value || '';
        if (editor.closest('[data-test-id="code-pane-hubl-html"]')) {
          console.log('Found HTML content:', content.substring(0, 50) + '...');
          setHtmlValue(content);
        } else if (editor.closest('[data-test-id="code-pane-hubl-css"]')) {
          console.log('Found CSS content:', content.substring(0, 50) + '...');
          setCssValue(content);
        } else if (editor.closest('[data-test-id="code-pane-hubl-javascript"]')) {
          console.log('Found JS content:', content.substring(0, 50) + '...');
          setJsValue(content);
        }
      });
      setIsLoaded(true);
      console.log('Initial content extraction complete');
    } catch (error) {
      console.error('Error extracting content:', error);
    }
  };

  useEffect(() => {
    const findAndInjectEditor = () => {
      console.log('Looking for HubSpot editor container');
      const editorContainer = document.querySelector('.editor-container');
      if (editorContainer && !document.getElementById('monaco-editor-root')) {
        console.log('Found editor container, injecting Monaco');
        extractInitialContent();
        injectEditor(editorContainer);
        return true;
      }
      console.log('Editor container not found or Monaco already injected');
      return false;
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length && !isLoaded) {
          console.log('Mutation observer detected changes, checking for editor container');
          if (findAndInjectEditor()) {
            observer.disconnect();
            console.log('Editor injection complete, disconnecting observer');
            break;
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('Starting initial check for editor container');
    findAndInjectEditor();

    return () => {
      console.log('Cleaning up observer');
      observer.disconnect();
    };
  }, [isLoaded]);

  const injectEditor = (container) => {
    console.log('Injecting Monaco editor');
    try {
      container.innerHTML = '';
      const editorDiv = document.createElement('div');
      editorDiv.id = 'monaco-editor-root';
      editorDiv.style.cssText = 'display: flex; flex-direction: column; height: 100%; padding: 10px; background: #1e1e1e;';
      container.appendChild(editorDiv);
      console.log('Monaco editor container injected successfully');
    } catch (error) {
      console.error('Error injecting editor:', error);
    }
  };

  const handleEditorChange = (value, type) => {
    console.log(`Editor ${type} changed`);
    try {
      switch (type) {
        case 'html':
          setHtmlValue(value);
          const htmlTextarea = document.querySelector('[data-test-id="code-pane-hubl-html"] textarea');
          if (htmlTextarea) {
            htmlTextarea.value = value;
            console.log('HTML content synced back to HubSpot editor');
          }
          break;
        case 'css':
          setCssValue(value);
          const cssTextarea = document.querySelector('[data-test-id="code-pane-hubl-css"] textarea');
          if (cssTextarea) {
            cssTextarea.value = value;
            console.log('CSS content synced back to HubSpot editor');
          }
          break;
        case 'js':
          setJsValue(value);
          const jsTextarea = document.querySelector('[data-test-id="code-pane-hubl-javascript"] textarea');
          if (jsTextarea) {
            jsTextarea.value = value;
            console.log('JS content synced back to HubSpot editor');
          }
          break;
      }
    } catch (error) {
      console.error(`Error syncing ${type} content:`, error);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ flex: 1, border: '1px solid #363636' }}>
        <Editor
          height="100%"
          defaultLanguage="html"
          value={htmlValue}
          onChange={(value) => handleEditorChange(value, 'html')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on'
          }}
          onMount={() => console.log('HTML editor mounted')}
        />
      </div>
      <div style={{ flex: 1, border: '1px solid #363636' }}>
        <Editor
          height="100%"
          defaultLanguage="css"
          value={cssValue}
          onChange={(value) => handleEditorChange(value, 'css')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on'
          }}
          onMount={() => console.log('CSS editor mounted')}
        />
      </div>
      <div style={{ flex: 1, border: '1px solid #363636' }}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={jsValue}
          onChange={(value) => handleEditorChange(value, 'js')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on'
          }}
          onMount={() => console.log('JS editor mounted')}
        />
      </div>
    </div>
  );
};

export default MonacoEditor;
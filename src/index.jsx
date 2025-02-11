import React from 'react';
import { createRoot } from 'react-dom/client';
import MonacoEditor from './Editor';

const mountEditor = () => {
  const existingRoot = document.getElementById('monaco-editor-root');
  if (!existingRoot) return;

  try {
    const root = createRoot(existingRoot);
    root.render(
      <React.StrictMode>
        <MonacoEditor />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Error mounting Monaco Editor:', error);
  }
};

// Iniciar el observer para detectar cuando el editor de HubSpot está listo
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      const editorRoot = document.getElementById('monaco-editor-root');
      if (editorRoot && !editorRoot.hasChildNodes()) {
        mountEditor();
        break;
      }
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
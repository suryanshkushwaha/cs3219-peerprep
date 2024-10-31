// @ts-ignore
import CodeMirror from 'codemirror';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { CodemirrorBinding } from 'y-codemirror';
import 'codemirror/mode/javascript/javascript.js';

window.addEventListener('load', () => {
  const ydoc = new Y.Doc();

  // Define a valid document name; use a fallback if needed
  let documentName = 'default_document';

  const provider = new HocuspocusProvider({
    url: 'ws://localhost:3003',
    name: documentName, // Ensure this is non-empty and meaningful
    document: ydoc,
  });

  const ytext = ydoc.getText('codemirror');
  const editorContainer = document.createElement('div');
  editorContainer.setAttribute('id', 'editor');
  document.body.insertBefore(editorContainer, null);

  const editor = CodeMirror(editorContainer, {
    mode: 'javascript',
    lineNumbers: true,
  });

  const binding = new CodemirrorBinding(ytext, editor, provider.awareness);

  const connectBtn = /** @type {HTMLElement} */ (document.getElementById('y-connect-btn'));
  connectBtn.addEventListener('click', () => {
    if (provider.shouldConnect) {
      provider.disconnect();
      connectBtn.textContent = 'Connect';
    } else {
      provider.connect();
      connectBtn.textContent = 'Disconnect';
    }
  });

  // @ts-ignore
  window.example = { provider, ydoc, ytext, binding, Y };
});

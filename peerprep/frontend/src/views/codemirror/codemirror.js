import CodeMirror from 'codemirror';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { CodemirrorBinding } from 'y-codemirror';
import 'codemirror/mode/javascript/javascript.js';

window.addEventListener('load', () => {
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider( {
    serverUrl: "ws://localhost:8080/ws",
    roomName: 'collab-service-demo',
    doc: ydoc
  });

  // WebSocket Event Logging
  provider.on('status', event => {
    console.log("WebSocket connection status:", event.status); // logs "connected" or "disconnected"
  });
  provider.on('sync', isSynced => {
    console.log("Is document synced:", isSynced); // logs true or false
  });
  provider.on('error', error => {
    console.error("WebSocket error:", error); // logs any WebSocket errors
  });

  const ytext = ydoc.getText('codemirror');
  const editorContainer = document.getElementById('editor'); // Select the div directly

  if (editorContainer) {
    const editor = CodeMirror(editorContainer, {
      mode: 'javascript',
      lineNumbers: true,
    });

    const binding = new CodemirrorBinding(ytext, editor, provider.awareness);

    // Connection toggle button logic
    const connectBtn = document.getElementById('y-connect-btn');
    connectBtn.addEventListener('click', () => {
      if (provider.shouldConnect) {
        provider.disconnect();
        connectBtn.textContent = 'Connect';
      } else {
        provider.connect();
        connectBtn.textContent = 'Disconnect';
      }
    });

    // Save and load functions attached to window
    window.saveDocument = () => {
      const data = Array.from(editor.getValue());
      fetch('/api/saveDocument', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'myDocument', data })
      })
        .then(response => response.json())
        .then(data => console.log(data.message))
        .catch(error => console.error('Error:', error));
    };

    window.loadDocument = () => {
      fetch('/api/getDocument/myDocument')
        .then(response => response.json())
        .then(data => {
          const content = String.fromCharCode(...data.data);
          editor.setValue(content);
        })
        .catch(error => console.error('Error:', error));
    };

    window.example = { provider, ydoc, ytext, binding, Y };
  } else {
    console.error('Editor container not found.');
  }
});

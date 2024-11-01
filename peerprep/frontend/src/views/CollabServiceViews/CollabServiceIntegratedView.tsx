import React, { useState, useEffect, useRef } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { useParams, useNavigate } from 'react-router-dom';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { yCollab } from 'y-codemirror';

// Define the component as a functional component
const CollaborationServiceIntegratedView: React.FC = () => {
  const { topic, difficulty, sessionId } = useParams<{ topic: string; difficulty: string; sessionId: string }>();
  const [code, setCode] = useState('// Start coding here...\n');
  const [users, setUsers] = useState<string[]>([]);
  const editorRef = useRef<any>(null); // Reference for the CodeMirror editor
  const navigate = useNavigate();

  // Initialize Yjs document and WebSocket provider
  const ydoc = useRef(new Y.Doc()).current;
  const provider = useRef(new WebsocketProvider('wss://demos.yjs.dev', 'collaborative-doc', ydoc)).current;
  const yText = useRef(ydoc.getText('codemirror')).current;

  useEffect(() => {
    // Display session info in console for debugging
    console.log(`Session ID: ${sessionId}, Topic: ${topic}, Difficulty: ${difficulty}`);
  }, [sessionId, topic, difficulty]);

  useEffect(() => {
    // Lock scroll when this component mounts
    document.body.style.overflow = 'hidden';

    // Cleanup function to unlock scroll when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      // Apply y-codemirror to synchronize the editor's content
      yCollab(editorRef.current.editor, yText);
    }

    // Clean up WebSocket connection and Yjs document on unmount
    return () => {
      provider.disconnect();
      ydoc.destroy();
    };
  }, [provider, yText, ydoc]);

  const handleCodeChange = (editor: any, data: any, value: string) => {
    setCode(value); // Update local code state
  };

  const handleLeaveSession = () => {
    navigate('/matching');
  };

  return (
    <div className="editor-container-parent">
      <div className="editor-header">
        <h2>Collaboration Session</h2>
        <p>Topic: {topic} | Difficulty: {difficulty}</p>
        <p>Session ID: {sessionId}</p>
        <button onClick={handleLeaveSession} className="leave-btn">Leave Session</button>
      </div>

      <div className="editor-container">
        <CodeMirror
          ref={editorRef}
          value={code}
          options={{
            mode: 'javascript',
            theme: 'material',
            lineNumbers: true,
            tabSize: 2,
            indentWithTabs: true,
          }}
          onBeforeChange={handleCodeChange}
        />
      </div>
    </div>
  );
};

export default CollaborationServiceIntegratedView;
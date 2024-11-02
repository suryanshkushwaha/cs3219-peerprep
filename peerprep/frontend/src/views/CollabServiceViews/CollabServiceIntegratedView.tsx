import React, { useState, useEffect, useRef } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { useParams, useNavigate } from 'react-router-dom';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

// @ts-check
import { CodemirrorBinding } from 'y-codemirror';

const CollaborationServiceIntegratedView: React.FC = () => {
  const { topic, difficulty, questionId, sessionId } = useParams<{ topic: string; difficulty: string; questionId: string; sessionId: string; }>();
  const [code, setCode] = useState('// Start coding here...\n');
  const editorRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`Session ID: ${sessionId}, Topic: ${topic}, Difficulty: ${difficulty}`);
    console.log(`Question: ${questionId}`);
  }, [sessionId, topic, difficulty, questionId]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider('ws://localhost:1234/' + sessionId, 'collaborative-doc', ydoc);
    const yText = ydoc.getText('codemirror');

    if (editorRef.current) {
      const binding = new CodemirrorBinding(yText, editorRef.current.editor, provider.awareness);
      return () => {
        binding.destroy();
        provider.destroy();
        ydoc.destroy();
      };
    }
  }, []);

  const handleBeforeCodeChange = (editor: any, data: any, value: string) => {
    //setCode(value);
  };

  const handleLeaveSession = () => {
    navigate('/matching');
  };

  return (
    <div className="editor-container-parent">
      <div className="editor-header">
        <h2>Collaboration Session</h2>
        <p>Topic: {topic} | Difficulty: {difficulty} | Session: {sessionId}</p>
        <p>Question: {questionId}</p>
        <button onClick={handleLeaveSession} className="leave-btn">Leave Session</button>
      </div>

      <div className="editor-container">
        <CodeMirror
          ref={editorRef}
          value={code}
          options={{
            mode: 'javascript',
            lineNumbers: true,
            tabSize: 2,
            indentWithTabs: true
          }}
          onBeforeChange={handleBeforeCodeChange}
        />
      </div>
    </div>
  );
};

export default CollaborationServiceIntegratedView;
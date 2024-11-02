import React, { useState, useEffect, useRef } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { useParams, useNavigate } from 'react-router-dom';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import axios from 'axios';

import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { CodemirrorBinding } from 'y-codemirror';

const CollaborationServiceIntegratedView: React.FC = () => {
  const { topic, difficulty, questionId, sessionId } = useParams<{ topic: string; difficulty: string; questionId: string; sessionId: string; }>();
  const [code, setCode] = useState('// Start coding here...\n');
  const [output, setOutput] = useState<string | null>(null);
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
    // setCode(value);
  };

  const handleLeaveSession = () => {
    navigate('/matching');
  };

  const handleRunCode = async () => {
    try {
      const response = await axios.post('http://localhost:4000/run-code', { code });
      setOutput(response.data.output);
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput('Error executing code');
    }
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
          onChange={(editor, data, value) => {
            setCode(value); // Update code state here
          }}
        />
      </div>

      <button onClick={handleRunCode} className="run-btn" style={{ marginTop: '20px', marginBottom: '20px' }}>Run Code</button>
      
      <h3 style={{ textAlign: 'left', marginBottom: '5px' }}>Output</h3>
      <div className="output-container" style={{ width: '900px', textAlign: 'left', border: '1px solid #ddd', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{output}</pre>
      </div>
    </div>
  );
};

export default CollaborationServiceIntegratedView;

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
  const [output, setOutput] = useState<string | null>(null);
  const [language, setLanguage] = useState<number>(63); // Default to JavaScript (Node.js)
  const editorRef = useRef<any>(null);
  const navigate = useNavigate();
  const [yText, setYText] = useState<Y.Text | null>(null);

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
    const newYText = ydoc.getText('codemirror');
    setYText(newYText);

    if (editorRef.current) {
      const binding = new CodemirrorBinding(newYText, editorRef.current.editor, provider.awareness);

      return () => {
        binding.destroy();
        provider.destroy();
        ydoc.destroy();
      };
    }
  }, [sessionId]);

  const handleLeaveSession = () => {
    navigate('/matching');
  };

  const handleRunCode = async () => {
    try {
      if (!yText) {
        console.error('Error: Yjs text instance is not available');
        setOutput('Error: Yjs text instance is not available');
        return;
      }
  
      const currentCode = yText.toString();
      console.log('Submitting code for execution:', currentCode);
  
      // Base64 encode the source code if required by the API
      const base64EncodedCode = btoa(currentCode); // `btoa()` encodes a string to base64
  
      // Make a POST request to Judge0 API for code execution
      const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*', {
        language_id: language, // Ensure `language` is set correctly in your component
        source_code: base64EncodedCode,
        stdin: '', // Add input if necessary
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          'x-rapidapi-key': 'f5d59ce024msha6cd5fccde3d182p14459fjsn8a83590f92b4'
        }
      });
  
      console.log('Submission response:', response.data);
  
      // Polling for the result of the code execution
      const token = response.data.token;
      let result = null;
  
      while (!result || result.status.id <= 2) {
        console.log(`Polling result for token: ${token}`);
        const statusResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=*`, {
          headers: {
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'x-rapidapi-key': 'f5d59ce024msha6cd5fccde3d182p14459fjsn8a83590f92b4'
          }
        });
  
        result = statusResponse.data;
  
        // Decode the output if it's base64-encoded
        const decodedOutput = result.stdout ? atob(result.stdout) : (result.stderr ? atob(result.stderr) : 'No output');
        console.log('Polling response:', result);
  
        // Wait for a short duration before the next poll (e.g., 1 second)
        await new Promise(resolve => setTimeout(resolve, 1000));
  
        // Set the output only when status is finished
        if (result.status.id > 2) {
          setOutput(decodedOutput);
        }
      }
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
          options={{
            mode: 'javascript',
            lineNumbers: true,
            tabSize: 2,
            indentWithTabs: true
          }}
          onChange={() => {
            // Let Yjs handle all updates; do not use setCode here
          }}
        />
      </div>

      <label htmlFor="language-select" style={{ marginTop: '20px' }}>Select Language:</label>
      <select
        id="language-select"
        value={language}
        onChange={(e) => setLanguage(parseInt(e.target.value))}
        style={{ marginBottom: '20px' }}
      >
        <option value="63">JavaScript (Node.js)</option>
        <option value="54">C++ (GCC 9.2.0)</option>
        <option value="50">C (GCC 9.2.0)</option>
        <option value="71">Python (3.8.1)</option>
        <option value="62">Java (OpenJDK 13.0.1)</option>
      </select>

      <button onClick={handleRunCode} className="run-btn" style={{ marginBottom: '20px' }}>Run Code</button>
      
      <h3 style={{ textAlign: 'left', marginBottom: '5px' }}>Output</h3>
      <div className="output-container" style={{ width: '900px', textAlign: 'left', border: '1px solid #ddd', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{output}</pre>
      </div>
    </div>
  );
};

export default CollaborationServiceIntegratedView;

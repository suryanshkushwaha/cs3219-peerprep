import React, { useState, useEffect, useRef } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Y from 'yjs';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/javascript-hint'; // For JavaScript hints

import 'codemirror/mode/javascript/javascript'; // For JavaScript
import 'codemirror/mode/clike/clike'; // For C, C++, Java (these use the 'clike' mode)
import 'codemirror/mode/python/python'; // For Python
import 'codemirror/mode/swift/swift'; // For Swift

// @ts-check
import { CodemirrorBinding } from 'y-codemirror';
import { WebsocketProvider } from 'y-websocket';

import { deleteMatchedSession} from "../../api/matchingApi.ts";


const CollaborationServiceIntegratedView: React.FC = () => {
  const { topic, difficulty, questionId, sessionId } = useParams<{ topic: string; difficulty: string; questionId: string; sessionId: string; }>();
  const [output, setOutput] = useState<string | null>(null);
  const [language, setLanguage] = useState<number>(63); // Default to JavaScript (Node.js)
  const [syntaxLang, setSyntaxLang] = useState<string>('javascript');
  const editorRef = useRef<any>(null);
  const navigate = useNavigate();
  const [yText, setYText] = useState<Y.Text | null>(null);

  // Mapping for CodeMirror modes

  useEffect(() => {
    console.log(`Session ID: ${sessionId}, Topic: ${topic}, Difficulty: ${difficulty}`);
    console.log(`Question: ${questionId}`);
  }, [sessionId, topic, difficulty, questionId]);

  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(import.meta.env.VITE_WEBSOCKET_API_URL + sessionId, 'collaborative-doc', ydoc);
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
    // Call the API to delete the session
    try {
      if (sessionId) {
        deleteMatchedSession(sessionId);
        navigate('/matching');
      }
    } catch {
      console.error('Error deleting matched session');
    }
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(parseInt(e.target.value));
    setSyntaxLang(e.target.value === '63' ? 'javascript' 
        : e.target.value === '54' ? 'text/x-c++src' 
        : e.target.value === '50' ? 'text/x-csrc' 
        : e.target.value === '71' ? 'python' 
        : e.target.value === '62' ? 'text/x-java'
        : e.target.value === '83' ? 'swift'
        : 'javascript');
  }

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
        </div>
        
        <div className="editor-header2">
            <button
                onClick={handleLeaveSession}
                className="leave-btn"
                style={{ marginBottom: '0px' }}
            >
                Leave Session
            </button>

            <div className="matching-form2">
                <div>
                    <select
                        name="topic"
                        value={language}
                        onChange={
                            (e) => handleLangChange(e)
                        }
                        required
                    >
                        <option value="" disabled>Select Language</option> {/* Placeholder option */}
                        <option value="63">JavaScript</option>
                        <option value="54">C++</option>
                        <option value="50">C</option>
                        <option value="71">Python</option>
                        <option value="62">Java</option>
                        <option value="83">Swift</option>
                    </select>
                </div>
            </div>
            <button
                onClick={handleRunCode}
                className="run-btn"
                style={{ marginBottom: '0px' }}
            > Run Code
            </button>
        </div>

        <div className="editor-container">
            <CodeMirror
            ref={editorRef}
            options={{
                mode: syntaxLang,
                lineNumbers: true,
                tabSize: 2,
                indentWithTabs: true,
                showHint: true,
                extraKeys: {
                    'Ctrl-Space': 'autocomplete', // Trigger autocomplete with Ctrl-Space
                },
                hintOptions: { completeSingle: false },
            }}

            editorDidMount={(editor) => {
                editor.on('keyup', (cm: any, event: any) => {
                    // Only trigger autocomplete on specific characters
                    const triggerKeys = /^[a-zA-Z0-9_]$/; // Allow letters, numbers, and underscore
                    if (
                        triggerKeys.test(event.key) &&
                        !cm.state.completionActive // Ensure that completion is not already active
                    ) {
                        cm.showHint({ completeSingle: false });
                    }
                });
            }}
            onChange={() => {
                // Let Yjs handle all updates; do not use setCode here
            }}
            />
        </div>
      
      <h3 style={{ textAlign: 'left', marginBottom: '5px' }}>Output</h3>
      <div className="output-container" style={{ width: '900px', textAlign: 'left', border: '1px solid #ddd', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{output}</pre>
      </div>
    </div>
  );
};

export default CollaborationServiceIntegratedView;

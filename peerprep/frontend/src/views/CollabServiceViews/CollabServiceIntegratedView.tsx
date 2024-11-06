import React, { useState, useEffect, useRef } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Y from 'yjs';
import Chat from '../../components/Chat.tsx';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/javascript-hint'; // For JavaScript hints

import 'codemirror/mode/javascript/javascript'; // For JavaScript
import 'codemirror/mode/clike/clike'; // For C, C++, Java (these use the 'clike' mode)
import 'codemirror/mode/python/python'; // For Python
import 'codemirror/mode/swift/swift'; // For Swift

import { assesCode } from '../../api/assescodeApi.ts';

// @ts-check
import { CodemirrorBinding } from 'y-codemirror';
import { WebsocketProvider } from 'y-websocket';

import { listenToMatchStatus, deleteMatchedSession } from "../../api/matchingApi.ts";
import { getQuestionById } from '../../api/questionApi.ts';



const CollaborationServiceIntegratedView: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string; }>();
  const [output, setOutput] = useState<string | null>(null);
  const [language, setLanguage] = useState<number>(63); // Default to JavaScript (Node.js)
  const [syntaxLang, setSyntaxLang] = useState<string>('javascript');
  const [syntaxFullLang, setSyntaxFullLang] = useState<string>('javascript');
  const editorRef = useRef<any>(null);
  const navigate = useNavigate();
  const [yText, setYText] = useState<Y.Text | null>(null);
  const [commentoutput, setCommentOutput] = useState<string | null>(null);
  //let topic = 'topic';
  //let difficulty = 'difficulty';
  // Declare question object
  //extract questionID from session id (eg. 670d81daf90653ef4b9162b8-67094dcc6be97361a2e7cb1a-1730832550120-Q672890c43266d81a769bfaee)
  const [topics, setTopics] = useState<string>('N/A');
  const [difficulty, setDifficulty] = useState<string>('N/A');
  const [questionTitle, setQuestionTitle] = useState<string>('N/A');
  const [questionDescription, setQuestionDescription] = useState<string>('N/A');
  console.log(sessionId);
  const questionId = sessionId ? sessionId.split('-Q')[1] : "N/A";

  //set topic, difficulty, questionId by calling the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getQuestionById(questionId);
        console.log(response);
        if (response) {
          console.log(`Session ID: ${sessionId}, Topics: ${response.categories}, Difficulty: ${response.difficulty}`);
          console.log(`Question: ${response._id}`);
          //set topics, difficulty
          setTopics(response.categories.join(', ')); // Set topic from API response
          setDifficulty(response.difficulty); // Set difficulty from API response
          setQuestionTitle(response.title);
          setQuestionDescription(response.description);
        }
      } catch (error) {
        console.error('Error fetching matched session:', error);
      }
    };
    fetchData();
  }, [sessionId]);

  // Mapping for CodeMirror modes
  const languageModes = {
    javascript: 'javascript',
    cpp: 'text/x-c++src', // Mode for C++
    c: 'text/x-csrc', // Mode for C
    java: 'text/x-java', // Mode for Java
    python: 'python', // Mode for Python
  };

  useEffect(() => {
    console.log(`Session ID: ${sessionId}, Topics: ${topics}, Difficulty: ${difficulty}`);
    console.log(`Question: ${questionId}`);
  }, [sessionId, topics, difficulty, questionId]);

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

  const handleAssesCode = async () => {
    try {
      if (!yText) {
        console.error('Error: Yjs text instance is not available');
        setCommentOutput('Error: Yjs text instance is not available');
        return;
      }

      const currentCode = yText.toString();
      const inputString = "LANGUAGE SPECIFIED IS: " + syntaxFullLang + "\n" + currentCode;
      const responseContent = await assesCode(inputString);
      //setCommentOutput(responseContent);
      setOutput(responseContent)
    } catch (error) {
      console.error('Error executing OpenAI API call:', error);
      setCommentOutput('Error executing code');
    }
  };

  return (
    <div className="editor-container-parent">
      <div className="editor-header">
        <h3>Collaboration Session</h3>
        <p>Topics: {topics} | Difficulty: {difficulty}</p>
        <p>Question: {questionTitle}</p>
        <p>Description: {questionDescription}</p>
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
        <button
          onClick={handleAssesCode}
          className="run-btn"
          style={{ marginBottom: '0px' }}
        > Assess Code
        </button>
      </div>

      <div className="code-and-chat">
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
        {sessionId && <Chat sessionId={sessionId} />}
      </div>

      <h3 style={{ textAlign: 'left', marginBottom: '5px' }}>Output</h3>
      <div className="output-container" style={{ width: '100%', textAlign: 'left', border: '1px solid #ddd', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>

        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{output}</pre>
      </div>
      {/*<div className="comments-container"style={{ width: '900px', textAlign: 'left', border: '1px solid #ddd', padding: '10px', borderRadius: '5px', backgroundColor: '#f9f9f9', overflowY: 'scroll'}}>
        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{commentoutput}</pre>
      </div>*/}
    </div >
  );
};

export default CollaborationServiceIntegratedView;

import React, { useState, useEffect } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2'; // CodeMirror component
import { useNavigate } from 'react-router-dom'; // For routing and session handling
import 'codemirror/lib/codemirror.css'; // Default CodeMirror styles
import 'codemirror/theme/material.css'; // CodeMirror theme
import 'codemirror/mode/javascript/javascript'; // Support for JavaScript mode

interface CollaborationServiceViewProps {
  topic: string;
  difficulty: string;
  sessionId: string;
}

const CollaborationServiceView: React.FC<CollaborationServiceViewProps> = ({ topic, difficulty, sessionId }) => {
  const [code, setCode] = useState('// Start coding here...\n');
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Assume we later use WebSocket or Socket.io to sync code
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

  const handleCodeChange = (_editor: unknown, _data: unknown, value: string) => {
    setCode(value); // Update local code state
    // TODO: Later sync this code change with the backend using WebSocket/Socket.io
  };

  const handleLeaveSession = () => {
    navigate('/matching'); // Navigate back to home on session exit
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
          value={code}
          options={{
            mode: 'javascript', // CodeMirror mode for syntax highlighting
             // Optional theme
            lineNumbers: true, // Show line numbers
            tabSize: 2, // Set tab size
            indentWithTabs: true, // Allow indentation with tabs
          }}
          onBeforeChange={handleCodeChange}
        />
      </div>
    </div>
  );
};

export default CollaborationServiceView;

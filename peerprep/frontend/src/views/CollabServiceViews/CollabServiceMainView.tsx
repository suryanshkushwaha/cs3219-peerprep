import React, { useState, useEffect, useRef } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/swift/swift';

interface CollaborationServiceViewProps {
  topic: string;
  difficulty: string;
  sessionId: string;
}

const CollaborationServiceView: React.FC<CollaborationServiceViewProps> = ({ topic, difficulty, sessionId }) => {
  const [code, setCode] = useState('// Start coding here...\n');
  const [users, setUsers] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize the WebSocket connection
    socketRef.current = io(`http://localhost:3003`, {
      query: { sessionId },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to collaboration server');
      socketRef.current?.emit('join-session', { sessionId });
    });

    // Listen for code updates from other users
    socketRef.current.on('yjs-update', (updatedCode: string) => {
      setCode(updatedCode);
    });

    // Listen for user list updates
    socketRef.current.on('update-users', (connectedUsers: string[]) => {
      setUsers(connectedUsers);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from collaboration server');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [sessionId]);

  const handleCodeChange = (editor: any, data: any, value: string) => {
    setCode(value);
    socketRef.current?.emit('yjs-update', value);
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
        <p>Connected Users: {users.join(', ')}</p>
        <button onClick={handleLeaveSession} className="leave-btn">Leave Session</button>
      </div>

      <div className="editor-container">
        <CodeMirror
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

export default CollaborationServiceView;


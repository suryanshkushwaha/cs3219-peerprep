import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:1234', {
  reconnectionAttempts: 3, // attempt reconnection 3 times
  timeout: 5000,            // connection timeout
});

interface ChatProps {
  sessionId: string;
}

const Chat: React.FC<ChatProps> = ({ sessionId }) => {
  const [room, setRoom] = useState<string>(sessionId);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<{ text: string; sender: boolean }[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const joinRoom = () => {
    if (room !== '') {
      socket.emit('join_room', room);
    }
  };

  const sendMessage = () => {
    if (!message) return; // Checking if there's a message to send
  
    const messageData = { message, room, senderId: socket.id };
  
    setMessages((prevMessages) => [...prevMessages, { text: message, sender: true }]);
    setMessage('');
  
    socket.emit('send_message', messageData, (ackError: string | null) => {
      if (ackError) {
        setConnectionError("Failed to send message. Please try again.");
        console.error("Message not sent:", ackError);
      }
    });
  };
  

  useEffect(() => {
    joinRoom(); // Automatically join the room based on sessionId

    socket.on('connect_error', (err) => {
      setConnectionError('Connection error. Please try again.');
    });

    socket.on('connect_timeout', () => {
      setConnectionError('Connection timed out. Retrying...');
    });

    socket.on('reconnect_failed', () => {
      setConnectionError('Reconnection failed. Please check your network.');
    });

    socket.on('receive_message', (data) => {
      if (data.senderId !== socket.id) {
        setMessages((prevMessages) => [...prevMessages, { text: data.message, sender: false }]);
      }
    });

    return () => {
      socket.off('receive_message');
      socket.off('connect_error');
      socket.off('connect_timeout');
      socket.off('reconnect_failed');
    };
  }, [room]);

  return (
    <div className="chat-box">
      <h4 className='chat-heading'>Chat</h4>
      {connectionError && <div className="error-message">{connectionError}</div>}
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender ? 'sent' : 'received'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          placeholder="Message..."
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        />
        <button className="sendBtn" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;

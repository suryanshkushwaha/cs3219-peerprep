import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL);

interface ChatProps {
  sessionId: string;
}

const Chat: React.FC<ChatProps> = ({ sessionId }) => {
  // Room State
  const [room, setRoom] = useState<string>(sessionId);

  // Messages States
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<{ text: string; sender: boolean }[]>([]);

  const joinRoom = () => {
    if (room !== '') {
      socket.emit('join_room', room);
    }
  };

  const sendMessage = () => {
    const messageData = { message, room, senderId: socket.id };
    socket.emit('send_message', messageData);
    setMessages((prevMessages) => [...prevMessages, { text: message, sender: true }]);
    setMessage(''); // Clear the input field after sending the message
  };

  useEffect(() => {
    joinRoom(); // Automatically join the room based on sessionId

    socket.on('receive_message', (data) => {
      if (data.senderId !== socket.id) {
        setMessages((prevMessages) => [...prevMessages, { text: data.message, sender: false }]);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [room]);

  return (
    <div className="chat-box">
      <h4 className='chat-heading'>Chat</h4>
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
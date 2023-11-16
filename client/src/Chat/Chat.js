import React, { useState, useEffect } from 'react';
import { socket } from '../Context/socketContext';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const sender = "testUser"

  useEffect(() => {
    
    socket.on('chatmsg', (message) => {
      console.log(message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('chatmsg');
    };
  }, []); 

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    const timestamp = new Date().toLocaleString();
    const messageType = {
      sender, message, timestamp
    }
    console.log(messageType);
    socket.emit('chatmsg', messageType);
    setMessage('');
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message.sender} {message.message} {message.timestamp}</li>
          ))}
        </ul>
      </div>
      <input
        type="text"
        value={message}
        onChange={handleMessageChange}
      />
      <button onClick={handleSendMessage}>전송</button>
    </div>
  );
}

export default Chat;

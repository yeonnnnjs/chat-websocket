import React, { useState, useEffect } from 'react';
import { socket } from '../Context/socketContext';

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('chatmsg', (message) => {
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
    socket.emit('chatmsg', message);
    setMessage('');
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
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

export default App;

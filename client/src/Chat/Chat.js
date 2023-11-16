import React, { useState, useEffect } from 'react';
import { socket } from '../Context/socketContext';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const roomName = localStorage.getItem("roomName");

  useEffect(() => {
    socket.emit('initmsg', roomName, (data) => {
      setMessages(data);
    });

    socket.on('getmsg', (data) => {
      setMessages(data);
    });

    return () => {
      socket.off('getmsg');
    };
  }, []); 

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    socket.emit('sendmsg', roomName, message);
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

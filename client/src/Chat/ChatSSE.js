import React, { useState, useEffect } from "react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const roomName = localStorage.getItem("roomName");
  const userName = localStorage.getItem("userName");

  const subscribeSSE = async () => {
    const eventSource = new EventSource(
      `http://localhost:3001/messages?roomName=${roomName}`,
    );

    eventSource.addEventListener("messages", function (e) {
      const data = JSON.parse(e.data);
      setMessages(data);
    });

    eventSource.onerror = function () {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  };

  useEffect(() => {
    subscribeSSE();
  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    setMessage("");
    await fetch(`http://localhost:3001/message/send?roomName=${roomName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, sender: userName }),
    });
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              {message.sender} {message.message} {message.timestamp}
            </li>
          ))}
        </ul>
      </div>
      <input type="text" value={message} onChange={handleMessageChange} />
      <button onClick={handleSendMessage}>전송</button>
    </div>
  );
}

export default Chat;

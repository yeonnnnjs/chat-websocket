import React, { useState, useEffect } from "react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const roomName = localStorage.getItem("roomName");

  const subscribeSSE = async () => {
    const eventSource = new EventSource("http://localhost:3001/subscribe");

    eventSource.addEventListener("rooms", function (e) {
      const data = JSON.parse(e.data);
      setRooms(data);
    });

    eventSource.onerror = function () {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  };

  const getRooms = async () => {
    await fetch("http://localhost:3001/rooms")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setRooms(data);
      });
  };

  useEffect(() => {
    getRooms();
    subscribeSSE();
  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    // socket.emit("sendmsg", roomName, message);
    setMessage("");
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

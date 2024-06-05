import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Main() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();
  const method =
    process.env.REACT_APP_IS_WEBSOCKET === "true" ? "WebSocket" : "SSE";

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

  useEffect(() => {
    subscribeSSE();
  }, []);

  const handleCreateRoom = async () => {
    if (roomName) {
      await fetch("http://localhost:3001/room/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomName: roomName }),
      })
        .then((response) => response.json())
        .then((data) => {
          const isRoomExist = data.isRoomExist;
          if (isRoomExist) {
            alert("방 이미 있음 ㅇㅇ");
          } else {
            localStorage.setItem("roomName", roomName);
            navigate(`/chat/${roomName}`);
          }
        });
    }
  };

  const handleJoinRoom = async (roomName) => {
    if (roomName) {
      await fetch("http://localhost:3001/room/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomName: roomName }),
      })
        .then((response) => response.json())
        .then((data) => {
          const isRoomExist = data.isRoomExist;
          if (!isRoomExist) {
            alert("그런 방 없음 ㅇㅇ");
          } else {
            localStorage.setItem("roomName", roomName);
            navigate(`/chat/${roomName}`);
          }
        });
    }
  };

  const handleRoomName = (e) => {
    setRoomName(e.target.value);
  };

  return (
    <div>
      <h1>Chat with {method}</h1>
      <div className="form-container">
        <input
          value={roomName}
          onChange={handleRoomName}
          placeholder="Enter room name"
        />
        <button type="button" onClick={() => handleJoinRoom(roomName)}>
          방 입장
        </button>
        <button type="button" onClick={handleCreateRoom}>
          방 만들기
        </button>
      </div>
      <div className="list-container">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div key={room.roomName} className="list-item">
              {room.roomName}
              <button
                type="button"
                onClick={() => handleJoinRoom(room.roomName)}
              >
                입장
              </button>
            </div>
          ))
        ) : (
          <p>wait for fetch rooms data</p>
        )}
      </div>
    </div>
  );
}

export default Main;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Main() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("wait for fetch rooms data");
  const navigate = useNavigate();
  const method =
    process.env.REACT_APP_IS_WEBSOCKET === "true" ? "WebSocket" : "SSE";

  const subscribeSSE = async () => {
    const eventSource = new EventSource("http://localhost:3001/rooms");

    eventSource.addEventListener("rooms", function (e) {
      const data = JSON.parse(e.data);
      if (data.length === 0) {
        setError("no data");
      } else {
        setRooms(data);
        setError("");
      }
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
      await fetch(`http://localhost:3001/room/create?roomName=${roomName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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

  const handleJoinRoom = async (paramRoomName) => {
    const fixedRoomName = paramRoomName || roomName;
    if (fixedRoomName) {
      await fetch(`http://localhost:3001/room/join?roomName=${fixedRoomName}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const isRoomExist = data.isRoomExist;
          if (!isRoomExist) {
            alert("그런 방 없음 ㅇㅇ");
          } else {
            localStorage.setItem("roomName", fixedRoomName);
            navigate(`/chat/${fixedRoomName}`);
          }
        });
    }
  };

  const handleSetUsername = async () => {
    if (userName) {
      localStorage.setItem("userName", userName);
    }
  };

  const handleRoomName = (e) => {
    setRoomName(e.target.value);
  };

  const handleUserName = (e) => {
    setUserName(e.target.value);
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
        <button type="button" onClick={handleJoinRoom}>
          방 입장
        </button>
        <button type="button" onClick={handleCreateRoom}>
          방 만들기
        </button>
      </div>
      <div className="form-container">
        <input
          value={userName}
          onChange={handleUserName}
          placeholder="Enter user name"
        />
        <button type="button" onClick={handleSetUsername}>
          확정
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
          <p>{error}</p>
        )}
      </div>
    </div>
  );
}

export default Main;

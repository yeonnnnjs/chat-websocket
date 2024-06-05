import React, { useState, useEffect } from "react";
import { useSocket } from "../Context/socketContext";
import { useNavigate } from "react-router-dom";

function Main() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const method = process.env.REACT_APP_IS_WEBSOCKET ? "WebSocket" : "SSE";
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit("getRooms", (data) => {
        setRooms(data);
      });
    }
  }, [rooms, socket]);

  const handleCreateRoom = async () => {
    if (socket && roomName) {
      await socket.emit("createRoom", roomName, (data) => {
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
    if (socket && roomName) {
      await socket.emit("joinRoom", roomName, (data) => {
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

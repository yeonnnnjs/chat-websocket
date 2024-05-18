import React, { useState, useEffect } from "react";
import { socket } from "../Context/socketContext";
import { useNavigate } from "react-router-dom";

function Main() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("getRooms", (data) => {
      setRooms(data);
    });
    socket.on("getRoomsChange", (data) => {
      setRooms(data);
    });
  }, [rooms]);

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
        {rooms.map((room) => (
          <div key={room.roomName} className="list-item">
            {room.roomName}
            <button type="button" onClick={() => handleJoinRoom(room.roomName)}>
              입장
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;

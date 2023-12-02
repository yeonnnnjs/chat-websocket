import React, { useState, useEffect } from 'react';
import { socket } from '../Context/socketContext';
import { useNavigate } from 'react-router-dom';

function Main() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit('getRooms', (data) => {
      setRooms(data);
    });
    socket.on('getRoomsChange', (data) => {
      setRooms(data);
    });
  }, []);

  const joinRoom = (roomName) => {
    socket.emit("joinRoom", roomName);
    localStorage.setItem("roomName", roomName);
    navigate(`/chat/`+roomName);
  };

  const handleCreateRoom = async () => {
    if (socket && roomName) {
      let isRoomExist = false;
      await socket.emit('isRoomExist', roomName, (data) => {
        isRoomExist = data;
      });
      if (isRoomExist) {
        alert("방 이미 있음 ㅇㅇ");
      } 
      else {
        await socket.emit("createRoom", roomName);
        localStorage.setItem("roomName", roomName);
        navigate(`/chat/${roomName}`);
      }
    }
  };

  const handleJoinRoom = async () => {
    if (socket && roomName) {
      let isRoomExist = false;
      await socket.emit('isRoomExist', roomName, (data) => {
        isRoomExist = data;
      });
      if (!isRoomExist) {
        alert("그런 방 없음 ㅇㅇ");
      } 
      else {
        await socket.emit("joinRoom", roomName);
        localStorage.setItem("roomName", roomName);
        navigate(`/chat/${roomName}`);
      }
    }
  };

  return (
    <div>
      <div className="form-container">
        <input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
        />
        <button type="button" onClick={handleJoinRoom}>방 입장</button>
        <button type="button" onClick={handleCreateRoom}>방 만들기</button>
      </div>
      <div className="list-container">
        {rooms.map((room) => (
          <div key={room.roomName} className="list-item">
            {room.roomName}
            <button type="button" onClick={()=>joinRoom(room.roomName)}>입장</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;

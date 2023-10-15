import React, { useState, useEffect } from 'react';
import { socket } from './Context/socketContext';
import { useNavigate } from "react-router-dom";

function App() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(socket.id);
    socket.on('getRooms', (rooms) => {
      setRooms(rooms);
    });
  });

  const handleItemClick = (room) => {
    navigate("/chat");
  }

  return (
    <div>
      <h1>Rooms</h1>
      <div>
        <ul>
          {Object.values(rooms).map((room) => (
            <li key={room.id} onClick={() => handleItemClick(room)}>{room.user}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

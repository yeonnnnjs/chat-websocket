const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = [];

io.on('connection', (socket) => {
  console.log(`Connected. Socket ID: ${socket.id}`);

  socket.on('getRooms', (callback) => {
    callback(rooms);
  });

  socket.on('isRoomExist', (roomName, callback) => {
    const isRoomExist = rooms.find(room => room.roomName === roomName);
    callback(isRoomExist);
  });

  socket.on('createRoom', (roomName) => {
    rooms.push({ roomName });
    socket.emit('getRoomsChange', rooms);
  });

  socket.on('chatmsg', (message) => {
    console.log('Msg from ' + socket.id + ': ' + JSON.stringify(message));
    io.emit('chatmsg', message);
  });

  socket.on('disconnect', () => {
    delete rooms[socket.id];
    io.emit('getRooms', rooms);
    console.log(`Disconnected. Socket ID: ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log('running on port 3001');
});

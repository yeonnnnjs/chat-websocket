const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
      origin: "http://localhost:3000", 
      methods: ["GET", "POST"], 
    },
  });

const rooms = {};

io.on('connection', (socket) => {
  console.log(`Connected. Socket ID: ${socket.id}`);
  rooms[socket.id] = { user: socket.id };
  io.emit('getRooms', rooms);

  socket.on('chatmsg', (message) => {
    console.log('Msg from ' + socket.id + ': ' + message);
    io.emit('chatmsg', message); 
  });

  socket.on('disconnect', () => {
    delete rooms[socket.id];
    io.emit('getRooms', rooms);
    console.log(`Disconnected. Socket ID: ${socket.id}`);
  });
});

server.listen(8000, () => {
  console.log('running on port 8000');
});

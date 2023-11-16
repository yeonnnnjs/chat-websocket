const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const {initSocket} = require('./chat.js');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initSocket(io);

server.listen(3001, () => {
  console.log('running on port 3001');
});

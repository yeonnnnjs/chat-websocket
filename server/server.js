const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const {initSocket} = require('./chat.js');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = http.createServer(app);
const isWebSocket = process.env.IS_WEBSOCKET;

if(isWebSocket) {
  console.log("Chat server running with WebSocket");
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  
  initSocket(io);
} else {
  console.log("Chat server running with SSE");
  
}

server.listen(3001, () => {
  console.log('running on port 3001');
});

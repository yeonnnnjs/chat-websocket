const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { initSocket } = require("./chatWebSocket.js");
const chat = require("./chatSSE.js");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const server = http.createServer(app);
const isWebSocket = process.env.IS_WEBSOCKET === "true";
console.log(`Chat server running with ${isWebSocket ? "WebSocket" : "SSE"}`);

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

if (isWebSocket) {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  initSocket(io);
} else {
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use("/", chat);
}

server.listen(3001, () => {
  console.log("running on port 3001");
});

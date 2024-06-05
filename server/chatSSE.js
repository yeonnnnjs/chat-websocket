const express = require("express");
const router = express.Router();

let rooms = [];

class chat {
  constructor(roomName, message, sender, timestamp) {
    this.roomName = roomName;
    this.message = message;
    this.sender = sender;
    this.timestamp = timestamp;
  }
  message;
  sender;
  roomName;
  timestamp;
}

const sseHeaders = {
  "Content-Type": "text/event-stream",
  Connection: "keep-alive",
  "Cache-Control": "no-cache",
};

// rooms
router.get("/subscribe", (req, res) => {
  res.writeHead(200, sseHeaders);

  const sendEvent = (data) => {
    res.write("event: rooms\n");
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const intervalId = setInterval(() => {
    sendEvent(rooms);
  }, 3000);

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
});

router.get("/rooms", (req, res) => {
  res.send(rooms);
});

router.post("/room/create", (req, res) => {
  const { roomName } = req.body;
  const isRoomExist = rooms.find((room) => room.roomName === roomName);
  if (!isRoomExist) {
    console.log(`createRoom. room name: ${roomName}`);
    rooms.push({ roomName });
    res.send({ isRoomExist: false });
  } else {
    console.log(`createRoom. ${roomName} already exists`);
    res.send({ isRoomExist: true });
  }
});

router.post("/room/join", (req, res) => {
  const { roomName } = req.body;
  const roomIndex = rooms.findIndex((room) => room.roomName === roomName);
  if (roomIndex !== -1) {
    console.log(`joinRoom. room name: ${roomName}`);
    res.send({ isRoomExist: true });
  } else {
    console.log(`joinRoom. ${roomName} not exists`);
    res.send({ isRoomExist: false });
  }
});

// message
router.get("/subscribe", (req, res) => {
  res.writeHead(200, sseHeaders);

  const sendEvent = (data) => {
    res.write("event: rooms\n");
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const intervalId = setInterval(() => {
    sendEvent(rooms);
  }, 3000);

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
});

router.get("/messages", (req, res) => {
  const { roomName } = req.body;
  const roomIndex = rooms.findIndex((room) => room.roomName === roomName);
  if (rooms[roomIndex].chat) {
    res.send(rooms[roomIndex].chat);
  }
});

module.exports = router;

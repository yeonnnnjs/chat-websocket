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

function initSocket(io) {
  io.on("connection", (socket) => {
    console.log(`Connected. Socket ID: ${socket.id}`);

    // rooms
    socket.on("getRooms", (callback) => {
      callback(rooms);
    });

    socket.on("isRoomExist", (roomName, callback) => {
      const isRoomExist = rooms.find((room) => room.roomName === roomName);
      callback(isRoomExist);
    });

    socket.on("createRoom", (roomName, callback) => {
      const isRoomExist = rooms.find((room) => room.roomName === roomName);
      if (!isRoomExist) {
        console.log(`createRoom. room name: ${roomName}`);
        rooms.push({ roomName, users: [socket.id] });
        socket.join(roomName);
        socket.emit("getRoomsChange", rooms);
        callback({ isRoomExist: false });
      } else {
        console.log(`createRoom. ${roomName} already exists`);
        callback({ isRoomExist: true });
      }
    });

    socket.on("joinRoom", (roomName, callback) => {
      const roomIndex = rooms.findIndex((room) => room.roomName === roomName);
      if (roomIndex !== -1) {
        console.log(`joinRoom. room name: ${roomName}`);
        rooms[roomIndex].users.push(socket.id);
        socket.join(roomName);
        socket.emit("getRoomsChange", rooms);
        callback({ isRoomExist: true });
      } else {
        console.log(`joinRoom. ${roomName} not exists`);
        callback({ isRoomExist: false });
      }
    });

    // message
    socket.on("initmsg", (roomName, callback) => {
      const roomIndex = rooms.findIndex((room) => room.roomName === roomName);
      if (rooms[roomIndex].chat) {
        callback(rooms[roomIndex].chat);
      }
    });

    socket.on("sendmsg", (roomName, message) => {
      console.log("Msg from " + socket.id + ": " + JSON.stringify(message));

      if (message) {
        const timestamp = new Date().toLocaleString();
        let chatData = new chat(roomName, message, socket.id, timestamp);
        const roomIndex = rooms.findIndex((room) => room.roomName === roomName);

        rooms[roomIndex].chat = !rooms[roomIndex].chat
          ? [chatData]
          : [chatData, ...rooms[roomIndex].chat];
        io.to(roomName).emit("getmsg", rooms[roomIndex].chat);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Disconnected. Socket ID: ${socket.id}`);
    });
  });
}

module.exports = { initSocket };

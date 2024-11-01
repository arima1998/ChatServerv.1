const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // Set to your frontend's origin
    methods: ["GET", "POST"],
  },
});

// Track users in rooms
const rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a room
  socket.on("joinRoom", ({ username, room }) => {
    socket.join(room);

    // Initialize room if it doesn't exist
    if (!rooms[room]) {
      rooms[room] = [];
    }

    // Add user to the room's user list if not already present
    if (!rooms[room].includes(username)) {
      rooms[room].push(username);
    }

    // Emit updated user list to the room
    io.to(room).emit("userList", rooms[room]);

    // Welcome the user
    socket.emit("message", {
      user: "System",
      text: `Welcome to the room, ${username}!`,
    });

    // Notify others in the room
    socket.broadcast
      .to(room)
      .emit("message", {
        user: "System",
        text: `${username} has joined the room.`,
      });

    // Handle message event
    socket.on("chatMessage", ({ room, user, message }) => {
      io.to(room).emit("message", { user, text: message });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // Remove the user from the room's list
      if (rooms[room]) {
        rooms[room] = rooms[room].filter((user) => user !== username);
        io.to(room).emit("userList", rooms[room]); // Emit updated user list

        // Notify others in the room
        socket.broadcast
          .to(room)
          .emit("message", {
            user: "System",
            text: `${username} has left the room.`,
          });

        // Clean up empty room
        if (rooms[room].length === 0) {
          delete rooms[room];
        }
      }
    });
  });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);

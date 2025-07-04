const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  pingInterval: 10000,
  pingTimeout: 5000,
});

// Simple HTTP root route to confirm server is running
app.get('/', (req, res) => {
  res.send('Socket.IO Audio Broadcast Server is running.');
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-muazzin", (mosqueId) => {
    socket.join(mosqueId);
    socket.data.isMuazzin = true;
    socket.data.mosqueId = mosqueId;
    console.log(`Muazzin joined mosque ${mosqueId}:`, socket.id);
  });

  socket.on("join-listener", (mosqueId) => {
    socket.join(mosqueId);
    socket.data.isMuazzin = false;
    socket.data.mosqueId = mosqueId;
    console.log(`Listener joined mosque ${mosqueId}:`, socket.id);
  });

  socket.on("audio-chunk", (data) => {
    if (socket.data.isMuazzin && socket.data.mosqueId) {
      // Broadcast audio chunks to all listeners in the same mosque room except sender
      socket.to(socket.data.mosqueId).emit("audio-chunk", data);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});

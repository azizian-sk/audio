// server.js
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

let muazzin = null;

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-muazzin", () => {
    muazzin = socket;
    console.log("Muazzin joined:", socket.id);
  });

  socket.on("audio-chunk", (data) => {
    socket.broadcast.emit("audio-chunk", data);
  });

  socket.on("disconnect", () => {
    if (socket === muazzin) muazzin = null;
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});

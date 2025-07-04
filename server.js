// server.js
const WebSocket = require('ws');
const http = require('http');
const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('message', function incoming(data) {
    // broadcast to all clients
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data); // 🔁 send audio to all listeners
      }
    });
  });
});

server.listen(process.env.PORT || 443, () => {
  console.log(`Server running on port ${process.env.PORT || 443}`);
});

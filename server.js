const http = require('http');
const WebSocket = require('ws');
const { setupWSConnection } = require('y-websocket');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req);
});

server.listen(1234, () => {
  console.log('Yjs WebSocket server running on ws://localhost:1234');
});
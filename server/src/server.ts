import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { WebSocket, WebSocketServer } from "ws";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
 
// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new WebSocketServer({ server });


// Handle WebSocket connections
wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");

    ws.on("message", (data) => {
    console.log("Received message: " + data);
    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState == WebSocket.OPEN) {
        client.send(data);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

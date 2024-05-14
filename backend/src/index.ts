import express from "express";
import { Server, Socket } from "socket.io";
import http from "http";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("hello world");
});

io.on("connection", (socket: Socket) => {
  console.log("a user connected");
});
io.on("error", (socket: Socket) => {
  console.log("an error found");
});
server.listen(3000, () => {
  console.log("server is listening");
});

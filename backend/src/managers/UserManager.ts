import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";

export interface User {
  socket: Socket;
  name: string;
}

export class UserManager {
  private users: User[];
  private qeueu: string[];
  private roomManager: RoomManager;
  constructor() {
    this.users = [];
    this.qeueu = [];
    this.roomManager = new RoomManager();
  }

  addUser(name: string, socket: Socket) {
    this.users.push({
      name,
      socket,
    });
    this.qeueu.push(socket.id);
    socket.emit("lobby");
    this.clearQeueu();
    this.initHandlers(socket);
  }

  removeUser(socketId: string) {
    const user = this.users.find((x) => x.socket.id === socketId);
    this.users = this.users.filter((x) => x.socket.id !== socketId);
    this.qeueu = this.qeueu.filter((x) => x === socketId);
  }

  clearQeueu() {
    console.log("inside qeueu", this.qeueu.length);

    if (this.qeueu.length < 2) {
      return;
    }

    const id1 = this.qeueu.pop();
    const id2 = this.qeueu.pop();

    const user1 = this.users.find((x) => x.socket.id === id1);
    const user2 = this.users.find((x) => x.socket.id === id2);

    if (!user1 || !user2) {
      return;
    }

    console.log("creating room");

    const room = this.roomManager.createRoom(user1, user2);
    this.clearQeueu();
  }

  initHandlers(socket: Socket) {
    socket.on("offer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onOffer(roomId, sdp, socket.id);
    });

    socket.on("answer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onAnswer(roomId, sdp, socket.id);
    });

    socket.on(
      "add-ice-candidate",
      ({ sdp, roomId }: { sdp: String; roomId: string }) => {
        this.roomManager.onIceCandidates(roomId, socket.id, candidate, type);
      }
    );
  }
}

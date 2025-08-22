import { Server } from "socket.io";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    // client joins a specific event room to receive updates
    socket.on("event:join-room", (eventId: string) => {
      socket.join(`event:${eventId}`);
    });

    socket.on("event:leave-room", (eventId: string) => {
      socket.leave(`event:${eventId}`);
    });
  });
};

import { io, Socket } from "socket.io-client";
import { useEffect, useRef } from "react";
import Constants from "expo-constants";
import { useAuthStore } from "../store/auth";

const EXTRA = (Constants?.expoConfig?.extra ?? {}) as any;

const SOCKET_URL =
  EXTRA?.socketUrl || "http://192.168.x.x:4001"; 

let socket: Socket | null = null;

export function ensureSocket() {
  if (!socket) {
    const token = useAuthStore.getState().token;
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: token ? { token } : undefined,
    });
  }
  return socket!;
}

export function useSocket() {
  const sRef = useRef<Socket | null>(null);
  if (!sRef.current) {
    sRef.current = ensureSocket();
  }
  return sRef.current;
}

export function joinEventRoom(eventId: string) {
  ensureSocket().emit("joinEventRoom", { eventId });
}
export function leaveEventRoom(eventId: string) {
  ensureSocket().emit("leaveEventRoom", { eventId });
}

// app/_layout.tsx
import { Slot, useSegments, useRouter } from "expo-router";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../src/api/queryClient";
import { useAuthStore } from "../src/store/auth";
import { ensureSocket } from "../src/realtime/socket"; 

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    const socket = ensureSocket();

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {

    if (!segments?.length) return;

    const inAuth = segments[0] === "login" || segments[0] === "register";

    if (!token && !inAuth) {
      router.replace("/login");
    }
    if (token && inAuth) {
      router.replace("/events");
    }
  }, [segments, token]);

  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}

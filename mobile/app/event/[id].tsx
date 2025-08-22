import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gql } from "../../src/api/client";
import { EVENTS, JOIN_EVENT, LEAVE_EVENT } from "../../src/api/queries";
import type { Event } from "../../src/api/types";
import Avatar from "../../src/components/Avatar";
import { useAuthStore } from "../../src/store/auth";
import {
  useSocket,
  joinEventRoom,
  leaveEventRoom,
} from "../../src/realtime/socket";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user)!;
  const qc = useQueryClient();
  const socket = useSocket();

  const { data } = useQuery<{ events: Event[] }>({
    queryKey: ["events"],
    queryFn: () => gql(EVENTS),
  });

  const event = useMemo(
    () => data?.events.find((e) => e.id === id),
    [data, id]
  );
  const isAttendee = !!event?.attendees?.some((a) => a.id === user.id);

  const [attendees, setAttendees] = useState(event?.attendees ?? []);

  useEffect(() => {
    setAttendees(event?.attendees ?? []);
  }, [event?.attendees]);

  useEffect(() => {
    if (!id) return;
    joinEventRoom(id);
    socket.on(
      "event:attendees",
      (payload: { eventId: string; attendees: any[] }) => {
        if (payload.eventId === id) {
          setAttendees(payload.attendees);
        }
      }
    );
    return () => {
      leaveEventRoom(id);
      socket.off("event:attendees");
    };
  }, [id]);

  const join = useMutation({
    mutationFn: () => gql<{ joinEvent: Event }>(JOIN_EVENT, { eventId: id }),
    onSuccess: (res) => {
      qc.setQueryData(["events"], (old: any) => {
        if (!old) return old;
        const copy = { ...old };
        copy.events = old.events.map((ev: Event) =>
          ev.id === id ? { ...ev, attendees: res.joinEvent.attendees } : ev
        );
        return copy;
      });
      setAttendees(res.joinEvent.attendees);
    },
    onError: (e: any) => Alert.alert("Error", e.message || "Failed to join"),
  });

  const leave = useMutation({
    mutationFn: () => gql<{ leaveEvent: Event }>(LEAVE_EVENT, { eventId: id }),
    onSuccess: (res) => {
      qc.setQueryData(["events"], (old: any) => {
        if (!old) return old;
        const copy = { ...old };
        copy.events = old.events.map((ev: Event) =>
          ev.id === id ? { ...ev, attendees: res.leaveEvent.attendees } : ev
        );
        return copy;
      });
      setAttendees(res.leaveEvent.attendees);
    },
    onError: (e: any) => Alert.alert("Error", e.message || "Failed to leave"),
  });

  if (!event) {
    return (
      <View style={styles.center}>
        <Text>Event not found</Text>
        <TouchableOpacity
          onPress={() => router.replace("/events")}
          style={{ marginTop: 12 }}
        >
          <Text style={styles.link}>Back to events</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.subtitle}>{event.location}</Text>
      <Text style={styles.subtitle}>
        Starts: {new Date(event.startTime).toLocaleString()}
      </Text>

      <View style={styles.actions}>
        {!isAttendee ? (
          <TouchableOpacity onPress={() => join.mutate()} style={styles.joinBtn}>
            <Text style={styles.btnText}>Join Event</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => leave.mutate()}
            style={styles.leaveBtn}
          >
            <Text style={styles.btnText}>Leave Event</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.attendeesTitle}>
        Attendees ({attendees.length})
      </Text>
      <FlatList
        data={attendees}
        keyExtractor={(a) => a.id}
        renderItem={({ item }) => (
          <View style={styles.attendeeRow}>
            <Avatar name={item.name} uri={item.avatarUrl} size={36} />
            <View>
              <Text style={styles.attendeeName}>{item.name}</Text>
              <Text style={styles.attendeeEmail}>{item.email}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50 },
  center: { flex: 1, alignItems: "center" as const, justifyContent: "center" as const },
  link: { color: "#2563eb" },
  title: { fontSize: 22, fontWeight: "800" as const, marginTop: 8 },
  subtitle: { color: "#6b7280", marginBottom: 12 },
  actions: { flexDirection: "row", gap: 10, marginBottom: 16 },
  joinBtn: {
    backgroundColor: "#16a34a",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  leaveBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  btnText: { color: "white", fontWeight: "700" as const },
  attendeesTitle: { fontSize: 18, fontWeight: "800" as const, marginBottom: 8 },
  attendeeRow: {
    flexDirection: "row",
    alignItems: "center" as const,
    gap: 10,
    paddingVertical: 8,
  },
  attendeeName: { fontWeight: "600" as const },
  attendeeEmail: { color: "#6b7280", fontSize: 12 },
});

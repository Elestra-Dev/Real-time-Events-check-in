import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { Event } from "../api/types";

export default function EventCard({
  event,
  onPress,
}: {
  event: Event;
  onPress: () => void;
}) {
  const count = event.attendees?.length ?? 0;
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: "700" }}>{event.name}</Text>
      <Text style={{ color: "#6b7280", marginTop: 4 }}>{event.location}</Text>
      <Text style={{ color: "#6b7280", marginTop: 2 }}>
        Starts: {new Date(event.startTime).toLocaleString()}
      </Text>
      <Text style={{ marginTop: 6, fontWeight: "600" }}>
        Participants: {count}
      </Text>
    </TouchableOpacity>
  );
}

import { useEffect, useState } from "react";
import { Text, View, Image, FlatList } from "react-native";
import { useAuthStore } from "../src/store/auth";
import { ensureSocket, joinEventRoom, leaveEventRoom } from "../src/realtime/socket";

export default function EventDetailScreen({ route }: any) {
  const { eventId } = route.params;
  const [attendees, setAttendees] = useState<any[]>([]);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    const socket = ensureSocket();

    socket.auth = { token };
    if (!socket.connected) socket.connect();

    joinEventRoom(eventId);

    socket.on("event:attendees", (data) => {
      if (data.eventId === eventId) {
        setAttendees(data.attendees);
      }
    });

    return () => {
      leaveEventRoom(eventId);
      socket.off("event:attendees");
    };
  }, [eventId]);

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Event Attendees
      </Text>
      <FlatList
        data={attendees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 5,
            }}
          >
            <Image
              source={{ uri: item.avatarUrl }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 10,
                backgroundColor: "#ddd",
              }}
            />
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

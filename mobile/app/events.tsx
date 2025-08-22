import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import Avatar from "../src/components/Avatar";
import EventCard from "../src/components/EventCard";
import { useAuthStore } from "../src/store/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gql } from "../src/api/client";
import { EVENTS, DELETE_ACCOUNT } from "../src/api/queries";
import type { Event } from "../src/api/types";
import { router } from "expo-router";

export default function EventsScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const qc = useQueryClient();

  const { data, isLoading, refetch } = useQuery<{ events: Event[] }>({
    queryKey: ["events"],
    queryFn: () => gql(EVENTS),
  });

  const delAccount = useMutation({
    mutationFn: () => gql<{ deleteAccount: boolean }>(DELETE_ACCOUNT),
    onSuccess: () => {
      Alert.alert("Deleted", "Your account was deleted.");
      logout();
      router.replace("/register");
    },
    onError: (e: any) => Alert.alert("Error", e.message || "Failed"),
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          style={styles.userBtn}
        >
          <Avatar name={user?.name || "User"} uri={user?.avatarUrl} size={40} />
          <Text style={styles.userName}>{user?.name}</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => refetch()}
            style={styles.refreshPill}
          >
            <Text style={styles.pillText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => logout()} style={styles.logoutPill}>
            <Text style={styles.pillText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => delAccount.mutate()}
        style={styles.deleteBox}
      >
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>

      <Text style={styles.eventsTitle}>Events</Text>

      {isLoading ? (
        <Text>Loading…</Text>
      ) : (
        <FlatList
          data={data?.events ?? []}
          keyExtractor={(e) => e.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() =>
                router.push({
                  pathname: "/event/[id]",
                  params: { id: item.id },
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  userBtn: { flexDirection: "row", alignItems: "center" as const, gap: 10 },
  userName: { fontSize: 16, fontWeight: "700" as const },
  actions: { flexDirection: "row", gap: 10 },

  refreshPill: {
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  logoutPill: {
    backgroundColor: "#ef4444",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  pillText: { color: "white", fontWeight: "700" as const },

  deleteBox: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  deleteText: {
    color: "#b91c1c",
    fontWeight: "700" as const,
    textAlign: "center" as const,
  },
  eventsTitle: { fontSize: 20, fontWeight: "800" as const, marginBottom: 10 },
});

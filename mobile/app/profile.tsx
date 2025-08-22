import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAuthStore } from "../src/store/auth";
import Avatar from "../src/components/Avatar";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <View style={{ flex: 1, padding: 16, paddingTop: 50 }}>
      <TouchableOpacity onPress={() => router.back()}><Text style={{ color: "#2563eb" }}>← Back</Text></TouchableOpacity>
      <View style={{ alignItems: "center", marginTop: 20, gap: 10 }}>
        <Avatar name={user.name} uri={user.avatarUrl} size={72} />
        <Text style={{ fontSize: 20, fontWeight: "800" }}>{user.name}</Text>
        <Text style={{ color: "#6b7280" }}>{user.email}</Text>
      </View>
      <View style={{ marginTop: 30, alignItems: "center" }}>
        <TouchableOpacity onPress={logout} style={{ backgroundColor: "#ef4444", padding: 12, borderRadius: 10 }}>
          <Text style={{ color: "white", fontWeight: "700" }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

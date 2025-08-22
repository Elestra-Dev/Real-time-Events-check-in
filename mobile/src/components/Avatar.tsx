import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function Avatar({
  size = 40,
  name,
  uri,
}: {
  size?: number;
  name: string;
  uri?: string | null;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }

  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: { color: "white", fontWeight: "600" },
});

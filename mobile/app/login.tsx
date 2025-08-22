import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { gql } from "../src/api/client";
import { LOGIN } from "../src/api/queries";
import { useAuthStore } from "../src/store/auth";
import { Link, useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const onLogin = async () => {
    try {
      const data = await gql<{ login: { token: string; user: any } }>(LOGIN, {
        email,
        password: pw,
      });
      setAuth(data.login.token, data.login.user);
      router.replace("/events");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Login failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={pw}
        onChangeText={setPw}
        style={styles.input}
      />
      <TouchableOpacity onPress={onLogin} style={styles.btn}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
      <Text>
        New here? <Link href="/register">Register</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", gap: 12 },
  title: { fontSize: 24, fontWeight: "800" as const },
  input: { borderWidth: 1, borderColor: "#e5e7eb", padding: 12, borderRadius: 10 },
  btn: { backgroundColor: "#4F46E5", padding: 14, borderRadius: 10, alignItems: "center" as const },
  btnText: { color: "white", fontWeight: "700" as const },
});

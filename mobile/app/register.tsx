import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { gql } from "../src/api/client";
import { REGISTER } from "../src/api/queries";
import { Link, useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const onSubmit = async () => {
    try {
      await gql(REGISTER, { name, email, password: pw });
      Alert.alert("Success", "Account created. Please log in.");
      router.replace("/login");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to register");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input}/>
      <TextInput placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} style={styles.input}/>
      <TextInput placeholder="Password" secureTextEntry value={pw} onChangeText={setPw} style={styles.input}/>
      <TouchableOpacity onPress={onSubmit} style={styles.btn}>
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>
      <Text>
        Already have an account? <Link href="/login">Login</Link>
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

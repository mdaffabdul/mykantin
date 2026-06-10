import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { Ionicons } from "@expo/vector-icons";

const DEMO_ACCOUNTS = [
  {
    role: "Mahasiswa Premium",
    username: "mor_2314",
    password: "83r5^_",
  },
];

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useApp();
  const [username, setUsername] = useState("mor_2314");
  const [password, setPassword] = useState("83r5^_");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setErrorMessage("Username dan password tidak boleh kosong");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Username atau Password salah!");
      }

      await response.json();

      // Fetch user profile details
      try {
        const usersResponse = await fetch("https://fakestoreapi.com/users");
        if (usersResponse.ok) {
          const users = await usersResponse.json();
          const matchedUser = users.find((u) => u.username === username);
          if (matchedUser) {
            const demoAcc = DEMO_ACCOUNTS.find((a) => a.username === username);
            const roleName = demoAcc ? demoAcc.role : "Mahasiswa";
            const balance = username === "mor_2314" ? 500000 : 150000;
            const points = username === "mor_2314" ? 350 : 10;
            const fullName = `${matchedUser.name.firstname.charAt(0).toUpperCase() + matchedUser.name.firstname.slice(1)} ${matchedUser.name.lastname.charAt(0).toUpperCase() + matchedUser.name.lastname.slice(1)}`;

            login({
              username,
              name: fullName,
              email: matchedUser.email,
              role: roleName,
              balance,
              points,
            });
          } else {
            throw new Error("User profile not found");
          }
        } else {
          throw new Error("Failed to fetch users list");
        }
      } catch (userErr) {
        console.warn("Using fallback profile details", userErr);
        const demoAcc = DEMO_ACCOUNTS.find((a) => a.username === username);
        login({
          username,
          name: username === "mor_2314" ? "Morrison Smith" : "John Doe",
          email: username === "mor_2314" ? "morrison@gmail.com" : "john@gmail.com",
          role: demoAcc ? demoAcc.role : "Mahasiswa",
          balance: username === "mor_2314" ? 500000 : 150000,
          points: username === "mor_2314" ? 350 : 10,
        });
      }

      setLoading(false);
      router.replace("/(tabs)");
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message || "Koneksi ke API gagal. Coba lagi nanti.");
    }
  };

  const fillPreSeededAccount = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setErrorMessage("");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Ionicons name="restaurant" size={48} color="#ff6b00" style={{ marginBottom: 16 }} />
          <Text style={styles.title}>MyKantin</Text>
          <Text style={styles.subtitle}>Aplikasi Kantin Kampus</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan username"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
          </View>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.buttonText}>Memuat...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.demoSection}>
          <View style={styles.demoHeader}>
            <Text style={styles.demoTitle}>Akun Demo</Text>
          </View>
          <Text style={styles.demoDescription}>
            Pilih akun di bawah ini untuk mencoba login:
          </Text>

          <View style={styles.demoAccounts}>
            {DEMO_ACCOUNTS.map((account) => (
              <TouchableOpacity
                key={account.username}
                style={styles.demoAccount}
                onPress={() =>
                  fillPreSeededAccount(account.username, account.password)
                }
                disabled={loading}
              >
                <Text style={styles.demoRole}>{account.role}</Text>
                <Text style={styles.demoCredentials}>
                  User: <Text style={styles.demoBold}>{account.username}</Text>
                </Text>
                <Text style={styles.demoCredentials}>
                  Pass: <Text style={styles.demoBold}>{account.password}</Text>
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  form: {
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1f2937",
  },
  button: {
    backgroundColor: "#ff6b00",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#dc2626",
    fontWeight: "600",
    textAlign: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  demoSection: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  demoHeader: {
    marginBottom: 12,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  demoDescription: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 12,
    lineHeight: 18,
  },
  demoAccounts: {
    gap: 8,
  },
  demoAccount: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  demoRole: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ff6b00",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  demoCredentials: {
    fontSize: 11,
    color: "#666",
    marginBottom: 2,
    fontFamily: "monospace",
  },
  demoBold: {
    fontWeight: "700",
    color: "#1f2937",
  },
});

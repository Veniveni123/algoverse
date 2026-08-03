import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../config/firebase";
import AuthScreenShell from "../components/auth-screen-shell";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const signup = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password) {
      setError("Please fill in your name, email, and password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      await updateProfile(userCred.user, { displayName: trimmedName });
      await setDoc(doc(db, "users", userCred.user.uid), {
        name: trimmedName,
        email: trimmedEmail,
        xp: 0,
        streak: 0,
        badges: [],
        completedAlgos: [],
        createdAt: new Date().toISOString(),
      });
      router.replace("/home");
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use") {
        setError("That email already has an account. Please sign in instead.");
      } else if (e.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (e.code === "auth/weak-password") {
        setError("Choose a stronger password.");
      } else {
        setError("We could not create your account right now.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthScreenShell title="Create account" subtitle="Start your algorithm journey with premium guidance">
      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        placeholderTextColor="#555"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="you@email.com"
        placeholderTextColor="#555"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Min 6 characters"
        placeholderTextColor="#555"
        secureTextEntry
      />

      {error !== "" && (
        <View style={styles.errorBox}>
          <Text style={styles.error}>{error}</Text>
        </View>
      )}

      <TouchableOpacity style={[styles.btn, isLoading && styles.disabled]} onPress={signup} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Create account</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => router.push("/login")}>
        <Text style={styles.linkText}>
          Already have an account? <Text style={styles.linkHighlight}>Login</Text>
        </Text>
      </TouchableOpacity>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  label: { color: "#C7D2FE", fontSize: 13, fontWeight: "600", marginBottom: 4 },
  input: {
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderRadius: 14,
    padding: 16,
    color: "#FFF",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.25)",
  },
  errorBox: {
    backgroundColor: "rgba(248, 113, 113, 0.16)",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.45)",
  },
  error: { color: "#FCA5A5", fontSize: 13, textAlign: "center" },
  btn: {
    backgroundColor: "#6366F1",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  btnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  disabled: { opacity: 0.6 },
  link: { alignItems: "center", marginTop: 8 },
  linkText: { color: "#94A3B8", fontSize: 14 },
  linkHighlight: { color: "#8B5CF6", fontWeight: "700" },
});

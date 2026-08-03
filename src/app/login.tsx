import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, CheckCircle2, X } from "lucide-react-native";
import { auth } from "../config/firebase";
import AuthScreenShell from "../components/auth-screen-shell";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot password modal state
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const validateEmail = (val: string) => {
    return /\S+@\S+\.\S+/.test(val);
  };

  const login = async () => {
    if (!email.trim() || !password) {
      setError("Please enter both your email and password.");
      return;
    }

    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    const emailValue = email.trim().toLowerCase();
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, emailValue, password);
      router.replace("/home");
    } catch (e: any) {
      if (e.code === "auth/invalid-credential" || e.code === "auth/wrong-password") {
        setError("Your email or password is incorrect.");
      } else if (e.code === "auth/user-not-found") {
        setError("No account exists for that email address.");
      } else if (e.code === "auth/too-many-requests") {
        setError("Account temporarily locked due to multiple failed attempts. Please try again shortly.");
      } else {
        setError("Unable to sign in right now. Please check your network connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth — requires a Web OAuth Client ID from Firebase Console
  // (Authentication → Sign-in method → Google → enable it, then copy the
  // auto-generated Web client ID into EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in
  // your .env file). Falls back gracefully with a clear message if unset,
  // instead of silently faking a sign-in.
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      setIsLoading(true);
      signInWithCredential(auth, credential)
        .then(() => {
          router.replace("/home");
        })
        .catch((e: any) => {
          setError(`Google sign-in failed: ${e.message || "please try again."}`);
        })
        .finally(() => setIsLoading(false));
    } else if (response?.type === "error") {
      setError("Google sign-in was cancelled or failed. Please try again.");
    }
  }, [response]);

  const googleSignIn = async () => {
    setError("");

    if (Platform.OS === "web") {
      setIsLoading(true);
      try {
        const provider = new GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");
        await signInWithPopup(auth, provider);
        router.replace("/home");
        return;
      } catch (popupErr: any) {
        if (popupErr.code === "auth/popup-closed-by-user") {
          setError("Google sign-in popup was closed before completing.");
        } else if (
          popupErr.code === "auth/admin-restricted-operation" ||
          popupErr.code === "auth/operation-not-allowed"
        ) {
          setError(
            "Google Sign-In isn't enabled for this project yet. Enable it in Firebase Console → Authentication → Sign-in method → Google."
          );
        } else {
          setError(`Google sign-in failed: ${popupErr.message || "please try again."}`);
        }
        return;
      } finally {
        setIsLoading(false);
      }
    }

    // Native (iOS/Android)
    if (!request) {
      setError(
        "Google Sign-In isn't configured for this build yet — add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID (and iOS/Android client IDs) to your .env file. See README for setup steps."
      );
      return;
    }

    await promptAsync();
  };

  const handleSendPasswordReset = async () => {
    if (!resetEmail.trim() || !validateEmail(resetEmail.trim())) {
      setResetStatus({ type: "error", message: "Please enter a valid email address (e.g. user@domain.com)." });
      return;
    }

    setResetLoading(true);
    setResetStatus(null);

    try {
      await sendPasswordResetEmail(auth, resetEmail.trim().toLowerCase());
      setResetStatus({
        type: "success",
        message: `Password reset email sent to ${resetEmail.trim()}! Please check your inbox.`,
      });
    } catch (e: any) {
      if (e.code === "auth/user-not-found") {
        setResetStatus({ type: "error", message: "No registered account exists with this email address." });
      } else {
        setResetStatus({ type: "error", message: `Reset failed: ${e.message || "Please try again."}` });
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <AuthScreenShell title="Secure Member Portal" subtitle="Sign in to access your AlgoVerse learning dashboard">
      {/* Email Input */}
      <Text style={styles.label}>Email Address</Text>
      <View style={styles.inputContainer}>
        <Mail size={18} color="#94A3B8" style={styles.inputIcon} />
        <TextInput
          style={styles.inputWithIcon}
          value={email}
          onChangeText={setEmail}
          placeholder="name@domain.com"
          placeholderTextColor="#64748B"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Password Input with Visibility Toggle */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputContainer}>
        <Lock size={18} color="#94A3B8" style={styles.inputIcon} />
        <TextInput
          style={styles.inputWithIcon}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          placeholderTextColor="#64748B"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity style={styles.eyeIconBtn} onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff size={18} color="#94A3B8" /> : <Eye size={18} color="#94A3B8" />}
        </TouchableOpacity>
      </View>

      <View style={styles.rowBetween}>
        <TouchableOpacity style={styles.checkboxRow} onPress={() => setRememberMe((value) => !value)}>
          <View style={[styles.checkbox, rememberMe && styles.checkboxActive]} />
          <Text style={styles.checkboxLabel}>Remember my session</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setResetEmail(email); setResetStatus(null); setResetModalVisible(true); }}>
          <Text style={styles.linkHighlight}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : null}

      {/* Main Login Button */}
      <TouchableOpacity style={[styles.btn, isLoading && styles.disabled]} onPress={login} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Sign In Securely</Text>}
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Google OAuth Button */}
      <TouchableOpacity style={styles.googleBtn} onPress={googleSignIn} disabled={isLoading}>
        <View style={styles.googleLogoContainer}>
          <Text style={styles.googleLogoG}>G</Text>
        </View>
        <Text style={styles.googleBtnText}>Google Account</Text>
      </TouchableOpacity>

      {/* Security Trust Footer */}
      <View style={styles.securityBadgeRow}>
        <ShieldCheck size={16} color="#10B981" />
        <Text style={styles.securityBadgeText}>256-Bit SSL Encrypted • Firebase Auth</Text>
      </View>

      <TouchableOpacity style={styles.link} onPress={() => router.push("/signup")}>
        <Text style={styles.linkText}>
          Don't have an account? <Text style={styles.linkHighlight}>Create Account</Text>
        </Text>
      </TouchableOpacity>

      {/* FORGOT PASSWORD MODAL */}
      <Modal visible={resetModalVisible} transparent animationType="fade" onRequestClose={() => setResetModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reset Password</Text>
              <TouchableOpacity onPress={() => setResetModalVisible(false)}>
                <X size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Enter your registered email address and we'll send you a password reset link.
            </Text>

            <View style={styles.inputContainer}>
              <Mail size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.inputWithIcon}
                value={resetEmail}
                onChangeText={setResetEmail}
                placeholder="name@domain.com"
                placeholderTextColor="#64748B"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {resetStatus ? (
              <View style={[styles.resetStatusBox, resetStatus.type === "success" ? styles.resetSuccess : styles.resetError]}>
                {resetStatus.type === "success" ? (
                  <CheckCircle2 size={16} color="#10B981" />
                ) : (
                  <ShieldCheck size={16} color="#FCA5A5" />
                )}
                <Text style={resetStatus.type === "success" ? styles.resetSuccessText : styles.resetErrorText}>
                  {resetStatus.message}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity style={styles.resetBtn} onPress={handleSendPasswordReset} disabled={resetLoading}>
              {resetLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.resetBtnText}>Send Reset Link</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  label: { color: "#C7D2FE", fontSize: 12, fontWeight: "600", marginBottom: 4, marginTop: 4 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.25)",
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  inputWithIcon: {
    flex: 1,
    paddingVertical: 14,
    color: "#FFF",
    fontSize: 15,
  },
  eyeIconBtn: { padding: 6 },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#6366F1",
  },
  checkboxActive: { backgroundColor: "#6366F1" },
  checkboxLabel: { color: "#94A3B8", fontSize: 12 },

  errorBox: {
    backgroundColor: "rgba(248, 113, 113, 0.16)",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.45)",
    marginTop: 6,
  },
  error: { color: "#FCA5A5", fontSize: 13, textAlign: "center" },

  btn: {
    backgroundColor: "#6366F1",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  btnText: { color: "#FFF", fontSize: 15, fontWeight: "700" },

  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 14, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.12)" },
  dividerText: { color: "#64748B", fontSize: 10, fontWeight: "700", letterSpacing: 1 },

  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 14,
    paddingVertical: 12,
    gap: 10,
  },
  googleLogoContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#4285F4",
    alignItems: "center",
    justifyContent: "center",
  },
  googleLogoG: { color: "#FFF", fontWeight: "900", fontSize: 14 },
  googleBtnText: { color: "#0F172A", fontSize: 14, fontWeight: "700" },

  securityBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  securityBadgeText: { color: "#10B981", fontSize: 11, fontWeight: "600" },

  disabled: { opacity: 0.6 },
  link: { alignItems: "center", marginTop: 12 },
  linkText: { color: "#94A3B8", fontSize: 13 },
  linkHighlight: { color: "#8B5CF6", fontWeight: "700" },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#1E293B",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  modalTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  modalSub: { color: "#94A3B8", fontSize: 13, lineHeight: 18, marginBottom: 16 },

  resetStatusBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
  },
  resetSuccess: { backgroundColor: "rgba(16, 185, 129, 0.15)", borderColor: "rgba(16, 185, 129, 0.3)" },
  resetError: { backgroundColor: "rgba(248, 113, 113, 0.15)", borderColor: "rgba(248, 113, 113, 0.3)" },
  resetSuccessText: { color: "#34D399", fontSize: 12, flex: 1 },
  resetErrorText: { color: "#FCA5A5", fontSize: 12, flex: 1 },

  resetBtn: {
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 16,
  },
  resetBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
});

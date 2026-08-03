import type { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react-native";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useBreakpoint } from "@/constants/responsive";

type AuthScreenShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  showLogo?: boolean;
};

export default function AuthScreenShell({
  title,
  subtitle,
  children,
  showLogo = true,
}: AuthScreenShellProps) {
  const { isDesktop, isWide } = useBreakpoint();

  return (
    <LinearGradient colors={["#050816", "#0B1120"]} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollInner}
          keyboardShouldPersistTaps="handled"
        >
          <View style={isDesktop ? styles.desktopWrapper : styles.mobileWrapper}>
            {/* Split Screen Branding Banner for Wide Screens */}
            {isWide && (
              <View style={styles.brandingSection}>
                <View style={styles.brandingBadge}>
                  <Sparkles size={14} color="#A78BFA" />
                  <Text style={styles.brandingBadgeText}>ALGOVERSE SAAS PLATFORM</Text>
                </View>
                <Text style={styles.brandingHeading}>
                  Master Computer Science & AI Through Interactive Visuals
                </Text>
                <Text style={styles.brandingSubtext}>
                  Join thousands of developers mastering Trees, Graphs, Dynamic Programming, and Machine Learning with real-time algorithm visualization.
                </Text>
                <View style={styles.bulletList}>
                  <View style={styles.bulletItem}>
                    <CheckCircle2 size={18} color="#10B981" />
                    <Text style={styles.bulletText}>Interactive BST, Graph & DP Execution Engine</Text>
                  </View>
                  <View style={styles.bulletItem}>
                    <ShieldCheck size={18} color="#8B5CF6" />
                    <Text style={styles.bulletText}>Real-world ML Dataset Profiling & Battle Arena</Text>
                  </View>
                  <View style={styles.bulletItem}>
                    <Zap size={18} color="#F59E0B" />
                    <Text style={styles.bulletText}>Gamified Daily Streaks, XP & Certificates</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Auth Form Glass Card */}
            <View style={styles.cardContainer}>
              <View style={styles.card}>
                {showLogo ? (
                  <View style={styles.logoRow}>
                    <View style={styles.logoIcon}>
                      <Sparkles size={20} color="#8B5CF6" />
                    </View>
                    <Text style={styles.logoText}>AlgoVerse</Text>
                  </View>
                ) : null}
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
                <View style={styles.form}>{children}</View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollInner: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  mobileWrapper: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  desktopWrapper: {
    width: "100%",
    maxWidth: 1100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    gap: 48,
  },
  brandingSection: {
    flex: 1,
    maxWidth: 540,
    paddingRight: 24,
  },
  brandingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  brandingBadgeText: {
    color: "#A78BFA",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  brandingHeading: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FFF",
    lineHeight: 44,
    marginBottom: 16,
  },
  brandingSubtext: {
    fontSize: 15,
    color: "#94A3B8",
    lineHeight: 24,
    marginBottom: 24,
  },
  bulletList: {
    gap: 14,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bulletText: {
    color: "#E2E8F0",
    fontSize: 14,
    fontWeight: "600",
  },
  cardContainer: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  card: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    backgroundColor: "rgba(11, 17, 32, 0.9)",
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 16 },
    elevation: 12,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  logoText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 24,
  },
  form: { gap: 14 },
});

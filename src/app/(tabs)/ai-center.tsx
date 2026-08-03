import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { BrainCircuit, Database, MessageCircle, Sparkles, Swords, Zap } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ResponsiveShell } from "@/components/responsive-shell";
import { AppColors, Gradients } from "@/constants/theme";

type AiTool = {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  badge?: string;
  href: string;
};

const AI_TOOLS: AiTool[] = [
  {
    key: "upload",
    title: "Real Data Lab",
    subtitle: "Upload CSV files, profile datasets, and run ML model battles",
    icon: Database,
    color: "#10B981",
    badge: "CSV & ML",
    href: "/upload",
  },
  {
    key: "solver",
    title: "AI Problem Solver",
    subtitle: "Analyze time/space complexities and generate step-by-step algorithms",
    icon: Zap,
    color: "#F59E0B",
    badge: "Complexity",
    href: "/solver",
  },
  {
    key: "tutor",
    title: "AI Tutor",
    subtitle: "Ask questions and get guided explanations on any DSA topic",
    icon: BrainCircuit,
    color: "#8B5CF6",
    badge: "Interactive",
    href: "/tutor",
  },
  {
    key: "copilot",
    title: "AI Copilot",
    subtitle: "Get hints and code review while you practice",
    icon: MessageCircle,
    color: "#06B6D4",
    badge: "Code Review",
    href: "/copilot",
  },
  {
    key: "battle",
    title: "Battle Mode",
    subtitle: "Race the clock and test your skills head-to-head",
    icon: Swords,
    color: "#F43F5E",
    badge: "PvE Race",
    href: "/battle",
  },
];

import { AppShell } from "@/components/layout/AppShell";

export default function AiCenterScreen() {
  const router = useRouter();

  return (
    <AppShell>
      <LinearGradient colors={Gradients.hero} style={styles.hero}>
        <View style={styles.heroIcon}>
          <Sparkles size={24} color="#FFF" />
        </View>
        <Text style={styles.heroTitle}>AI & ML Intelligence Center</Text>
        <Text style={styles.heroSubtitle}>
          Supercharge your learning with AI complexity analysis, interactive tutoring, CSV dataset profiling, and PvE battle challenges.
        </Text>
      </LinearGradient>

      <View style={styles.list}>
        {AI_TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <TouchableOpacity
              key={tool.key}
              style={[styles.toolCard, { borderColor: tool.color + "33" }]}
              activeOpacity={0.88}
              onPress={() => router.push(tool.href as any)}
            >
              <View style={[styles.toolIcon, { backgroundColor: tool.color + "22", borderColor: tool.color + "44" }]}>
                <Icon size={22} color={tool.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.toolTitle}>{tool.title}</Text>
                  {tool.badge && (
                    <View style={[styles.badgePill, { backgroundColor: tool.color + "22", borderColor: tool.color + "44" }]}>
                      <Text style={[styles.badgeText, { color: tool.color }]}>{tool.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.toolSubtitle}>{tool.subtitle}</Text>
              </View>
              <Text style={[styles.arrow, { color: tool.color }]}>→</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={{ height: 32 }} />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050816" },
  hero: { padding: 22, borderRadius: 24, marginTop: 16 },
  heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  heroIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  liveBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(16,185,129,0.2)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: "#10B981" },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#10B981" },
  liveText: { color: "#10B981", fontSize: 11, fontWeight: "700" },
  heroTitle: { color: "#FFF", fontSize: 24, fontWeight: "800" },
  heroSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 6, lineHeight: 20 },
  list: { gap: 14, marginTop: 16 },
  toolCard: {
    backgroundColor: "#0B1120",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1,
  },
  toolIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  toolTitle: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  badgePill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, borderWidth: 1 },
  badgeText: { fontSize: 10, fontWeight: "700" },
  toolSubtitle: { color: "#94A3B8", fontSize: 12, marginTop: 4, lineHeight: 18 },
  arrow: { fontSize: 18, fontWeight: "700" },
});

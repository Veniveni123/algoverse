import { usePathname, useRouter } from "expo-router";
import {
  Award,
  BookOpen,
  Brain,
  Compass,
  FileSpreadsheet,
  Flame,
  Home,
  Settings,
  Sparkles,
  Swords,
  Trophy,
  User,
  Zap,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getRank } from "@/services/gamification.service";
import { loadProgressState, ProgressState } from "@/services/progress.service";

type NavItem = {
  label: string;
  route: string;
  icon: any;
  badge?: string;
  category?: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", route: "/home", icon: Home, category: "Core" },
  { label: "DSA Curriculum", route: "/learn", icon: BookOpen, category: "Core" },
  { label: "AI Intelligence", route: "/ai-center", icon: Brain, badge: "AI", category: "Core" },
  
  { label: "Real Data Lab", route: "/upload", icon: FileSpreadsheet, category: "Practice" },
  { label: "ML Model Battle", route: "/battle", icon: Swords, category: "Practice" },
  { label: "Benchmark Lab", route: "/benchmark", icon: Zap, category: "Practice" },

  { label: "Leaderboard", route: "/leaderboard", icon: Trophy, category: "Community" },
  { label: "Achievements", route: "/achievements", icon: Award, category: "Community" },
  { label: "My Profile", route: "/profile", icon: User, category: "Account" },
  { label: "Settings", route: "/settings", icon: Settings, category: "Account" },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [progressState, setProgressState] = useState<ProgressState | null>(null);

  useEffect(() => {
    loadProgressState().then(setProgressState);
  }, []);

  const streak = progressState?.streak || 0;
  const xp = (progressState?.completedTopics?.length || 0) * 100;
  const rank = getRank(xp);

  return (
    <View style={styles.sidebar}>
      {/* Brand Header */}
      <View style={styles.brandContainer}>
        <View style={styles.logoIcon}>
          <Sparkles size={20} color="#8B5CF6" />
        </View>
        <View>
          <Text style={styles.brandTitle}>AlgoVerse</Text>
          <Text style={styles.brandSubtitle}>SaaS Platform v2.0</Text>
        </View>
      </View>

      {/* Nav List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.navList}>
        {NAV_ITEMS.map((item, idx) => {
          const isActive = pathname === item.route || pathname.startsWith(item.route + "/");
          const Icon = item.icon;
          const showCategoryHeader = idx === 0 || NAV_ITEMS[idx - 1].category !== item.category;

          return (
            <View key={item.route}>
              {showCategoryHeader && (
                <Text style={styles.categoryTitle}>{item.category?.toUpperCase()}</Text>
              )}
              <TouchableOpacity
                style={[styles.navItem, isActive && styles.navItemActive]}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <Icon size={18} color={isActive ? "#8B5CF6" : "#94A3B8"} />
                <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
                {item.badge && (
                  <View style={styles.navBadge}>
                    <Text style={styles.navBadgeText}>{item.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom User Stats Widget */}
      <View style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Flame size={14} color="#F59E0B" />
            <Text style={styles.statText}>{streak}d</Text>
          </View>
          <View style={styles.statPill}>
            <Zap size={14} color="#8B5CF6" />
            <Text style={styles.statText}>{xp} XP</Text>
          </View>
        </View>
        <Text style={styles.rankText}>🏆 {rank}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 250,
    backgroundColor: "#0B1120",
    borderRightWidth: 1,
    borderRightColor: "rgba(255, 255, 255, 0.08)",
    paddingVertical: 20,
    paddingHorizontal: 16,
    height: "100%",
    justifyContent: "space-between",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  brandTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "600",
  },
  navList: {
    flex: 1,
    marginTop: 16,
  },
  categoryTitle: {
    color: "#64748B",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 14,
    marginBottom: 6,
    paddingLeft: 8,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 3,
  },
  navItemActive: {
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
  },
  navLabel: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  navLabelActive: {
    color: "#FFF",
    fontWeight: "700",
  },
  navBadge: {
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  navBadgeText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "800",
  },
  statsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 14,
    padding: 12,
    marginTop: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statText: {
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: "700",
  },
  rankText: {
    color: "#F59E0B",
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },
});

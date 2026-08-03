import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { BookOpen, Flame, Settings as SettingsIcon, Sparkles, Trophy } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "../../config/firebase";
import { ResponsiveShell } from "../../components/responsive-shell";
import XPBar from "../../components/xp-bar";
import { ACHIEVEMENT_ICONS } from "../../constants/achievement-icons";
import { getAllAchievementDefinitions, getLevelInfo, getRank } from "../../services/gamification.service";
import { loadProgressState, ProgressState } from "../../services/progress.service";

export default function ProfileScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [progressState, setProgressState] = useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        router.replace("/login");
        return;
      }
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setUserData(docSnap.data());

      const state = await loadProgressState();
      setProgressState(state);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  const xp = userData?.xp || 0;
  const levelInfo = getLevelInfo(xp);
  const { level, progressPercent } = levelInfo;
  const streak = progressState?.streak || 0;
  const topicsCompleted = progressState?.completedTopics?.length || 0;
  const unlockedBadgeIds: string[] = userData?.badges || [];
  const earnedAchievements = getAllAchievementDefinitions().filter((a) => unlockedBadgeIds.includes(a.id));

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <AppShell>
      <LinearGradient colors={["#7C3AED", "#4F46E5", "#06B6D4"]} style={styles.hero}>
          <View style={styles.heroTopRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Your profile</Text>
              <Text style={styles.heroSubtitle}>Track your momentum, achievements, and learning streak.</Text>
            </View>
            <TouchableOpacity style={styles.settingsButton} onPress={() => router.push("/settings")}>
              <SettingsIcon size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.card}>
          <View style={styles.avatar}>
            <Sparkles size={24} color="#A78BFA" />
          </View>
          <Text style={styles.name}>{userData?.name || "Learner"}</Text>
          <Text style={styles.email}>{userData?.email}</Text>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>🏆 {getRank(xp)}</Text>
          </View>
          <View style={styles.xpBarWrap}>
            <XPBar progressPercent={progressPercent} label={`Level ${level} progress`} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: "#F59E0B" }]}>{xp}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: "#8B5CF6" }]}>{level}</Text>
            <Text style={styles.statLabel}>Rank Level</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: "#10B981" }]}>{userData?.badges?.length || 0}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⚡ Mastery Pulse</Text>
          <View style={styles.highlightsRow}>
            <View style={styles.highlightBox}>
              <Flame size={20} color="#F59E0B" />
              <Text style={styles.highlightNumber}>{streak} Days</Text>
              <Text style={styles.highlightText}>Streak</Text>
            </View>
            <View style={styles.highlightBox}>
              <BookOpen size={20} color="#8B5CF6" />
              <Text style={styles.highlightNumber}>{topicsCompleted}/9</Text>
              <Text style={styles.highlightText}>Topics</Text>
            </View>
            <View style={styles.highlightBox}>
              <Trophy size={20} color="#34D399" />
              <Text style={styles.highlightNumber}>{earnedAchievements.length}</Text>
              <Text style={styles.highlightText}>Badges</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>🏆 Earned Badges</Text>
            <TouchableOpacity onPress={() => router.push("/achievements")}>
              <Text style={styles.viewAllLink}>View all →</Text>
            </TouchableOpacity>
          </View>
          {earnedAchievements.length > 0 ? (
            earnedAchievements.map((achievement) => {
              const Icon = ACHIEVEMENT_ICONS[achievement.icon];
              return (
                <View key={achievement.id} style={styles.badgeRow}>
                  <View style={styles.badgeIconWrap}>
                    <Icon size={18} color="#F59E0B" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.badgeLabel}>{achievement.label}</Text>
                    <Text style={styles.badgeDescription}>{achievement.description}</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.emptyText}>No badges earned yet. Complete daily challenges or finish lessons to unlock badges.</Text>
          )}
        </View>

      <View style={{ height: 24 }} />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050816" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#050816" },
  hero: { paddingHorizontal: 20, paddingVertical: 24, borderRadius: 24, marginTop: 16 },
  heroTopRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  settingsButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  heroTitle: { color: "#FFF", fontSize: 24, fontWeight: "800" },
  heroSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 8, lineHeight: 20 },
  card: { backgroundColor: "rgba(17,24,39,0.9)", padding: 24, borderRadius: 24, alignItems: "center", marginTop: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#6366F1", justifyContent: "center", alignItems: "center", marginBottom: 12 },
  name: { color: "#FFF", fontSize: 20, fontWeight: "700" },
  email: { color: "#94A3B8", marginTop: 6, fontSize: 14 },
  badgePill: { backgroundColor: "rgba(99,102,241,0.2)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, marginTop: 10 },
  xpBarWrap: { width: "100%", marginTop: 16 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16, gap: 8 },
  statBox: { flex: 1, backgroundColor: "rgba(17,24,39,0.9)", padding: 16, borderRadius: 18, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  statNumber: { color: "#FFF", fontSize: 18, fontWeight: "700" },
  statLabel: { color: "#94A3B8", marginTop: 4, fontSize: 12 },
  sectionCard: { backgroundColor: "rgba(17,24,39,0.9)", padding: 18, borderRadius: 22, marginTop: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  viewAllLink: { color: "#8B5CF6", fontSize: 12, fontWeight: "700" },
  highlightsRow: { flexDirection: "row", gap: 8 },
  highlightBox: { flex: 1, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 12, alignItems: "center" },
  highlightNumber: { color: "#FFF", fontSize: 16, fontWeight: "800", marginTop: 6 },
  highlightText: { color: "#E2E8F0", fontSize: 12, marginTop: 2 },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(255,255,255,0.04)", padding: 12, borderRadius: 12, marginBottom: 8 },
  badgeIconWrap: { width: 32, height: 32, borderRadius: 10, backgroundColor: "rgba(245,158,11,0.15)", alignItems: "center", justifyContent: "center" },
  badgeLabel: { color: "#F8FAFC", fontWeight: "700", fontSize: 13 },
  badgeText: { color: "#F8FAFC", fontWeight: "600" },
  badgeDescription: { color: "#94A3B8", fontSize: 11, marginTop: 2 },
  emptyText: { color: "#94A3B8", fontSize: 13 },
  logoutBtn: { backgroundColor: "#1F2937", padding: 16, borderRadius: 16, alignItems: "center", marginTop: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  logoutText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
});

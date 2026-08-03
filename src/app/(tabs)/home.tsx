import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Award, BrainCircuit, Compass, Database, Flame, Heart, PlayCircle, Sparkles, Target, Trophy } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../config/firebase";
import CelebrationModal from "../../components/celebration-modal";
import { ResponsiveShell } from "../../components/responsive-shell";
import ProgressCard from "../../components/progress-card";
import RecommendationCard from "../../components/recommendation-card";
import SectionHeader from "../../components/section-header";
import StreakFlame from "../../components/streak-flame";
import XPBar from "../../components/xp-bar";
import { ACHIEVEMENT_ICONS } from "../../constants/achievement-icons";
import {
  CelebrationEvent,
  drainCelebrationQueue,
  getAllAchievementDefinitions,
  getLevelInfo,
  getRank,
} from "../../services/gamification.service";
import { completeDailyChallenge, loadProgressState, recordStudySession, toggleFavoriteTopic } from "../../services/progress.service";

import { AppShell } from "@/components/layout/AppShell";
import { useBreakpoint } from "@/constants/responsive";

export default function HomeScreen() {
  const router = useRouter();
  const { isDesktop } = useBreakpoint();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [progressState, setProgressState] = useState<any>(null);
  const [challengeDone, setChallengeDone] = useState(false);
  const [celebrations, setCelebrations] = useState<CelebrationEvent[]>([]);
  const [recommendations, setRecommendations] = useState([
    {
      title: "Master graph traversal",
      subtitle: "Strengthen BFS and DFS with a guided review.",
      actionLabel: "Start",
      topic: "Graphs",
    },
    {
      title: "Review dynamic programming",
      subtitle: "A quick refresher will reinforce your confidence.",
      actionLabel: "Open",
      topic: "Dynamic Programming",
    },
  ]);

  useEffect(() => {
    fetchUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      drainCelebrationQueue().then((events) => {
        if (active && events.length > 0) setCelebrations(events);
      });
      return () => {
        active = false;
      };
    }, [])
  );

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
      await recordStudySession();
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
  const { level, xpIntoLevel: progress, progressPercent } = levelInfo;
  const streak = progressState?.streak || 0;
  const completedTopics = progressState?.completedTopics?.length || 0;
  const favorites = progressState?.favoriteTopics?.length || 0;
  const nextTopic = progressState?.lastCompletedTopic || "Arrays";
  const unlockedBadgeIds: string[] = userData?.badges || [];
  const unlockedAchievements = getAllAchievementDefinitions().filter((a) => unlockedBadgeIds.includes(a.id));

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  return (
    <AppShell>
      <LinearGradient
        colors={["#7C3AED", "#4F46E5", "#06B6D4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.logo}>⚡ AlgoVerse</Text>
            <Text style={styles.welcome}>Welcome back, {userData?.name || "Coder"} 👋</Text>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/profile")}>
            <Sparkles size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.heroSub}>Master DSA with premium guidance, daily challenges, and AI support.</Text>
        <View style={styles.heroBadgeRow}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Level {level}</Text>
          </View>
          <View style={styles.streakBadge}>
            <StreakFlame streak={streak} />
          </View>
        </View>
      </LinearGradient>

        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View>
              <Text style={styles.cardTitle}>Daily Momentum</Text>
              <Text style={styles.email}>{userData?.email || "user@gmail.com"}</Text>
            </View>
            <View style={styles.xpCircle}>
              <Text style={styles.xpNumber}>{xp}</Text>
              <Text style={styles.xpLabel}>XP</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{level}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{userData?.badges?.length || 0}</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{getRank(xp)}</Text>
              <Text style={styles.statLabel}>Rank</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Level progress</Text>
              <Text style={styles.progressValue}>{progress}/100 XP</Text>
            </View>
            <XPBar progressPercent={progressPercent} />
          </View>
        </View>

        <View style={styles.featureSection}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
          <TouchableOpacity style={styles.continueCard} activeOpacity={0.95} onPress={() => router.push({
  pathname: "/algorithms",
  params: {
    category: nextTopic,
  },
})}>
            <View style={styles.continueGlow}>
              <Target size={18} color="#FFF" />
            </View>
            <View style={styles.continueBody}>
              <Text style={styles.continueTitle}>Pick up where you left off</Text>
              <Text style={styles.continueSubtitle}>Last focus: {nextTopic}</Text>
            </View>
            <Text style={styles.continueArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Visualizers Hub */}
        <View style={styles.featureSection}>
          <SectionHeader title="⚡ Interactive Visualizers Hub" />
          <View style={styles.visGrid}>
            {[
              { title: "Trees & BST", route: "/topics/trees", icon: "🌳", desc: "Binary & AVL Trees", color: "#10B981" },
              { title: "Graphs", route: "/topics/graphs", icon: "🕸️", desc: "BFS, DFS & Dijkstra", color: "#6C63FF" },
              { title: "Dynamic Prog", route: "/topics/dp", icon: "🧩", desc: "Tabulation & Memo", color: "#FFB347" },
              { title: "Sorting", route: "/topics/sorting", icon: "⚡", desc: "Quick & Merge Sort", color: "#3B82F6" },
              { title: "Searching", route: "/topics/searching", icon: "🔍", desc: "Binary & Linear Search", color: "#EC4899" },
              { title: "Linked Lists", route: "/topics/linkedList", icon: "🔗", desc: "Singly & Doubly Linked", color: "#8B5CF6" },
            ].map((v) => (
              <TouchableOpacity
                key={v.title}
                style={[styles.visCard, { borderColor: v.color + "44" }]}
                activeOpacity={0.88}
                onPress={() => router.push(v.route as any)}
              >
                <View style={[styles.visIconBox, { backgroundColor: v.color + "22" }]}>
                  <Text style={styles.visIcon}>{v.icon}</Text>
                </View>
                <Text style={styles.visCardTitle}>{v.title}</Text>
                <Text style={styles.visCardDesc}>{v.desc}</Text>
                <View style={styles.visActionRow}>
                  <Text style={[styles.visActionText, { color: v.color }]}>Launch →</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.featureSection}>
          <Text style={styles.sectionTitle}>What's next</Text>
          <View style={styles.journeyRow}>
            <TouchableOpacity style={styles.journeyCard} activeOpacity={0.9} onPress={() => router.push("/learn")}>
              <View style={[styles.journeyIcon, { backgroundColor: "#8B5CF6" }]}>
                <Compass size={20} color="#FFF" />
              </View>
              <Text style={styles.journeyTitle}>Learning Path</Text>
              <Text style={styles.journeySubtitle}>{completedTopics}/9 topics visited</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.journeyCard} activeOpacity={0.9} onPress={() => router.push("/ai-center")}>
              <View style={[styles.journeyIcon, { backgroundColor: "#06B6D4" }]}>
                <BrainCircuit size={20} color="#FFF" />
              </View>
              <Text style={styles.journeyTitle}>AI Center</Text>
              <Text style={styles.journeySubtitle}>Tutor, Copilot & Battle Mode</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.benchmarkStrip, { backgroundColor: "rgba(16, 185, 129, 0.1)", borderColor: "rgba(16, 185, 129, 0.25)" }]} activeOpacity={0.9} onPress={() => router.push("/upload")}>
            <Database size={16} color="#10B981" />
            <Text style={styles.benchmarkStripText}>Open Real Data Lab (CSV Analyzer & ML Battle)</Text>
            <Text style={[styles.continueArrow, { color: "#10B981" }]}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.benchmarkStrip} activeOpacity={0.9} onPress={() => router.push("/benchmark")}>
            <Trophy size={16} color="#F59E0B" />
            <Text style={styles.benchmarkStripText}>Open Benchmark Lab</Text>
            <Text style={styles.continueArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Learning pulse</Text>
          <View style={styles.progressGrid}>
            <ProgressCard title="Streak" value={`${streak} day${streak === 1 ? "" : "s"}`} subtitle="Daily motivation" icon={<Flame size={18} color="#F59E0B" />} accent="#F59E0B" />
            <ProgressCard title="Completed" value={`${completedTopics} topics`} subtitle="Mastered so far" icon={<Award size={18} color="#34D399" />} accent="#34D399" />
            <ProgressCard title="Favorites" value={`${favorites} saved`} subtitle="Saved for later" icon={<Heart size={18} color="#FB7185" />} accent="#FB7185" />
            <ProgressCard title="Next up" value="Daily challenge" subtitle="Keep the streak alive" icon={<PlayCircle size={18} color="#6C63FF" />} accent="#6C63FF" />
          </View>
        </View>

        <View style={styles.featureSection}>
          <SectionHeader title="Daily challenge" />
          <TouchableOpacity style={styles.challengeCard} activeOpacity={0.9} onPress={async () => {
            const updated = await completeDailyChallenge();
            setProgressState(updated);
            setChallengeDone(true);
            const events = await drainCelebrationQueue();
            if (events.length > 0) setCelebrations(events);
          }}>
            <View>
              <Text style={styles.challengeTitle}>{challengeDone || progressState?.dailyChallengeCompleted ? "Challenge complete" : "Solve 1 quick pattern"}</Text>
              <Text style={styles.challengeSubtitle}>Practice a short problem and keep your streak alive.</Text>
            </View>
            <View style={styles.challengeBadge}>
              <Text style={styles.challengeBadgeText}>{challengeDone || progressState?.dailyChallengeCompleted ? "✓" : "15m"}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.featureSection}>
          <SectionHeader title="Adaptive recommendations" />
          {recommendations.map((item) => (
            <RecommendationCard key={item.title} title={item.title} subtitle={item.subtitle} actionLabel={item.actionLabel} onPress={async () => { const updated = await toggleFavoriteTopic(item.topic); setProgressState(updated); }} />
          ))}
        </View>

        <View style={styles.featureSection}>
          <SectionHeader title="Achievements" />
          {unlockedAchievements.length === 0 ? (
            <TouchableOpacity style={styles.emptyAchievements} onPress={() => router.push("/achievements")}>
              <Award size={18} color="#F59E0B" />
              <Text style={styles.emptyAchievementsText}>Visit a topic or finish today's challenge to unlock your first badge</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.pillsRow}>
              {unlockedAchievements.slice(0, 4).map((a) => {
                const Icon = ACHIEVEMENT_ICONS[a.icon];
                return (
                  <View key={a.id} style={styles.achievementPill}>
                    <Icon size={14} color="#F59E0B" />
                    <Text style={styles.achievementPillText}>{a.label}</Text>
                  </View>
                );
              })}
            </View>
          )}
          <TouchableOpacity onPress={() => router.push("/achievements")}>
            <Text style={styles.viewAllLink}>View all achievements →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featureSection}>
          <View style={styles.logoutCard}>
            <Text style={styles.logoutTitle}>Need a fresh start?</Text>
            <Text style={styles.logoutText}>You can always sign out and come back when you’re ready.</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 32 }} />
        <CelebrationModal
          events={celebrations}
          onDone={() => {
            setCelebrations([]);
            fetchUser();
          }}
        />
      </AppShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050816" },
  hero: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24, borderRadius: 28, marginTop: 16, marginHorizontal: 0 },
  heroTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  logo: { color: "#FFF", fontSize: 26, fontWeight: "800" },
  welcome: { color: "rgba(255,255,255,0.92)", fontSize: 18, fontWeight: "700", marginTop: 8 },
  heroSub: { color: "rgba(255,255,255,0.8)", fontSize: 14, marginTop: 10, lineHeight: 22 },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  heroBadgeRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 14 },
  levelBadge: { alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  streakBadge: { backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  levelText: { color: "#FFF", fontSize: 13, fontWeight: "700" },
  profileCard: { backgroundColor: "rgba(17,24,39,0.9)", borderRadius: 24, padding: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", marginTop: 16 },
  profileTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  email: { color: "#94A3B8", fontSize: 12, marginTop: 4 },
  xpCircle: { backgroundColor: "#1E293B", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 10, minWidth: 70, alignItems: "center" },
  xpNumber: { color: "#FFF", fontSize: 16, fontWeight: "800" },
  xpLabel: { color: "#94A3B8", fontSize: 11, marginTop: 2 },
  statsRow: { flexDirection: "row", gap: 8, marginTop: 16 },
  statBox: { flex: 1, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  statNumber: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  statLabel: { color: "#94A3B8", fontSize: 12, marginTop: 2 },
  progressSection: { marginTop: 16 },
  progressGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  progressTitle: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  progressValue: { color: "#94A3B8", fontSize: 12 },
  progressBar: { height: 10, borderRadius: 999, backgroundColor: "#1F2937", overflow: "hidden" },
  progressFill: { height: 10, borderRadius: 999 },
  featureSection: { marginTop: 16 },
  sectionTitle: { color: "#FFF", fontSize: 16, fontWeight: "700", marginBottom: 10 },
  continueCard: { backgroundColor: "rgba(17,24,39,0.9)", borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  continueGlow: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#6366F1", justifyContent: "center", alignItems: "center" },
  continueBody: { flex: 1, marginLeft: 12 },
  continueTitle: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  continueSubtitle: { color: "#94A3B8", fontSize: 12, marginTop: 4 },
  continueArrow: { color: "#8B5CF6", fontSize: 20, fontWeight: "700" },
  journeyRow: { flexDirection: "row", gap: 10 },
  journeyCard: { flex: 1, backgroundColor: "rgba(17,24,39,0.9)", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  journeyIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  journeyTitle: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  journeySubtitle: { color: "#94A3B8", fontSize: 11, marginTop: 4 },
  benchmarkStrip: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(245,158,11,0.1)", borderRadius: 16, padding: 14, marginTop: 10, borderWidth: 1, borderColor: "rgba(245,158,11,0.25)" },
  benchmarkStripText: { color: "#FFF", fontSize: 13, fontWeight: "600", flex: 1 },
  challengeCard: { backgroundColor: "rgba(17,24,39,0.9)", borderRadius: 20, padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  challengeTitle: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  challengeSubtitle: { color: "#94A3B8", fontSize: 12, marginTop: 4 },
  challengeBadge: { width: 48, height: 48, borderRadius: 14, backgroundColor: "#1D4ED8", justifyContent: "center", alignItems: "center" },
  challengeBadgeText: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  pillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  emptyAchievements: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "rgba(245,158,11,0.08)", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "rgba(245,158,11,0.2)" },
  emptyAchievementsText: { color: "#94A3B8", fontSize: 12, flex: 1, lineHeight: 18 },
  achievementPill: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(245,158,11,0.12)", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: "rgba(245,158,11,0.25)" },
  achievementPillText: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  viewAllLink: { color: "#8B5CF6", fontSize: 12, fontWeight: "700", marginTop: 10 },

  visGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 8 },
  visCard: {
    width: "48%",
    backgroundColor: "rgba(17,24,39,0.9)",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
  },
  visIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  visIcon: { fontSize: 18 },
  visCardTitle: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  visCardDesc: { color: "#94A3B8", fontSize: 11, marginTop: 2, height: 30 },
  visActionRow: { marginTop: 6 },
  visActionText: { fontSize: 11, fontWeight: "700" },

  logoutCard: { backgroundColor: "rgba(17,24,39,0.9)", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  logoutTitle: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  logoutText: { color: "#94A3B8", fontSize: 12, marginTop: 4, lineHeight: 20 },
  logoutButton: { marginTop: 12, backgroundColor: "#1F2937", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  logoutButtonText: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#050816" },
});

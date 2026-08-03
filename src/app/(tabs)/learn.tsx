import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import {
  BrainCircuit,
  Check,
  Compass,
  Lock,
  PlayCircle,
  Rows3,
  Search,
  Share2,
  Sigma,
  SquareStack,
  Trees as TreesIcon,
  Zap,
} from "lucide-react-native";
import { useCallback, useState } from "react";
import type { ComponentType } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppShell } from "@/components/layout/AppShell";
import { ResponsiveShell } from "@/components/responsive-shell";
import { useBreakpoint } from "@/constants/responsive";
import { AppColors, Gradients, Radii } from "@/constants/theme";
import { getAllMLLessons } from "@/content/ml-lessons";
import { loadProgressState, ProgressState } from "@/services/progress.service";

type PathNode = {
  key: string;
  title: string;
  subtitle: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  href: string;
};

const LEARNING_PATH: PathNode[] = [
  { key: "Programming Basics", title: "01. Programming Basics", subtitle: "RAM, variables, loops, functions, call stack", icon: BrainCircuit, href: "/lesson/programming-basics" },
  { key: "Big-O Notation", title: "02. Big-O Complexity", subtitle: "Time vs Space complexity, asymptotic growth curves", icon: Sigma, href: "/lesson/big-o" },
  { key: "Arrays", title: "Arrays", subtitle: "Traversal, insertion, deletion, searching", icon: Rows3, href: "/lesson/arrays" },
  { key: "Stack", title: "Stack", subtitle: "Push, pop, peek & applications", icon: SquareStack, href: "/lesson/stack" },
  { key: "Queue", title: "Queue", subtitle: "Enqueue, dequeue & priority queues", icon: Share2, href: "/lesson/queue" },
  { key: "Linked List", title: "Linked List", subtitle: "Singly, doubly & circular lists", icon: Share2, href: "/lesson/linked-list" },
  { key: "Searching", title: "Searching", subtitle: "Linear, binary, jump & interpolation search", icon: Search, href: "/lesson/searching" },
  { key: "Sorting", title: "Sorting", subtitle: "Bubble, merge, quick, heap sort", icon: Zap, href: "/lesson/sorting" },
  { key: "Trees", title: "Trees", subtitle: "Binary trees, BST & traversals", icon: TreesIcon, href: "/lesson/trees" },
  { key: "Graph", title: "Graphs", subtitle: "BFS, DFS & representations", icon: Compass, href: "/lesson/graph" },
  { key: "Dynamic Programming", title: "Dynamic Programming", subtitle: "Fibonacci, Knapsack, LCS", icon: Sigma, href: "/lesson/dynamic-programming" },
];

const ML_PATH = getAllMLLessons();

export default function LearnScreen() {
  const router = useRouter();
  const { isDesktop } = useBreakpoint();
  const [progressState, setProgressState] = useState<ProgressState | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadProgressState().then((state) => {
        if (active) setProgressState(state);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const completed = progressState?.completedTopics ?? [];
  const masteredCount = completed.length;
  const mlCompletedCount = ML_PATH.filter((lesson) => completed.includes(lesson.topicKey)).length;

  // First node is always unlocked; each subsequent node unlocks once the
  // previous one has been visited (recordStudySession is called from
  // inside every topic screen's mount effect).
  const nextTopic = LEARNING_PATH.find((node) => !completed.includes(node.key));

  return (
    <AppShell>
      <LinearGradient colors={Gradients.hero} style={styles.hero}>
        <Text style={styles.heroTitle}>Your learning path</Text>
        <Text style={styles.heroSubtitle}>
          {masteredCount === 0
            ? "Start with Arrays to begin your journey."
            : `${masteredCount} of ${LEARNING_PATH.length} topics visited. Keep going!`}
        </Text>
        <View style={styles.heroProgressTrack}>
          <View
            style={[
              styles.heroProgressFill,
              { width: `${Math.min((masteredCount / LEARNING_PATH.length) * 100, 100)}%` },
            ]}
          />
        </View>
      </LinearGradient>

        <View style={styles.path}>
          {LEARNING_PATH.map((node, index) => {
            const isDone = completed.includes(node.key);
            const isNext = nextTopic?.key === node.key;
            const isLocked = !isDone && !isNext && index > 0 && !completed.includes(LEARNING_PATH[index - 1].key);
            const Icon = node.icon;

            return (
              <View key={node.key} style={styles.nodeRow}>
                <View style={styles.railColumn}>
                  <View
                    style={[
                      styles.nodeCircle,
                      isDone && styles.nodeCircleDone,
                      isNext && !isDone && styles.nodeCircleNext,
                      isLocked && styles.nodeCircleLocked,
                    ]}
                  >
                    {isDone ? (
                      <Check size={18} color="#FFF" />
                    ) : isLocked ? (
                      <Lock size={16} color={AppColors.lockedText} />
                    ) : (
                      <Icon size={18} color="#FFF" />
                    )}
                  </View>
                  {index < LEARNING_PATH.length - 1 && (
                    <View style={[styles.railLine, isDone && styles.railLineDone]} />
                  )}
                </View>

                <TouchableOpacity
                  activeOpacity={isLocked ? 1 : 0.9}
                  disabled={isLocked}
                  style={[styles.nodeCard, isLocked && styles.nodeCardLocked]}
                  onPress={() => router.push(node.href as any)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.nodeTitle, isLocked && styles.nodeTitleLocked]}>{node.title}</Text>
                    <Text style={styles.nodeSubtitle}>{node.subtitle}</Text>
                  </View>
                  {isNext && !isDone && (
                    <View style={styles.startPill}>
                      <PlayCircle size={14} color="#FFF" />
                      <Text style={styles.startPillText}>Continue</Text>
                    </View>
                  )}
                  {isDone && <Text style={styles.doneLabel}>Visited</Text>}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.benchmarkCard} activeOpacity={0.9} onPress={() => router.push("/benchmark")}>
          <View style={styles.benchmarkIcon}>
            <BrainCircuit size={18} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.nodeTitle}>Benchmark Lab</Text>
            <Text style={styles.nodeSubtitle}>Compare algorithm runtimes side by side</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.mlSectionHeader}>
          <Text style={styles.mlSectionTitle}>Machine Learning</Text>
          <Text style={styles.mlSectionSubtitle}>
            {mlCompletedCount} of {ML_PATH.length} visited — a new path, separate from DSA
          </Text>
        </View>

        <View style={styles.mlList}>
          {ML_PATH.map((lesson) => {
            const isDone = completed.includes(lesson.topicKey);
            return (
              <TouchableOpacity
                key={lesson.slug}
                style={styles.mlCard}
                activeOpacity={0.9}
                onPress={() => router.push(`/ml/${lesson.slug}` as any)}
              >
                <View style={[styles.mlIcon, isDone && styles.mlIconDone]}>
                  {isDone ? <Check size={16} color="#FFF" /> : <Sigma size={16} color="#FFF" />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mlCardTitle}>{lesson.title}</Text>
                  <Text style={styles.mlCardCategory}>{lesson.category}</Text>
                </View>
                {isDone && <Text style={styles.doneLabel}>Visited</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ height: 32 }} />
      </AppShell>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.bg },
  hero: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24, borderRadius: Radii.xl, marginTop: 16 },
  heroTitle: { color: "#FFF", fontSize: 24, fontWeight: "800" },
  heroSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 8, lineHeight: 20 },
  heroProgressTrack: { height: 8, borderRadius: Radii.pill, backgroundColor: "rgba(255,255,255,0.25)", marginTop: 16, overflow: "hidden" },
  heroProgressFill: { height: 8, borderRadius: Radii.pill, backgroundColor: "#FFF" },

  path: { marginTop: 24 },
  nodeRow: { flexDirection: "row", alignItems: "flex-start" },
  railColumn: { alignItems: "center", width: 44 },
  nodeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.locked,
    justifyContent: "center",
    alignItems: "center",
  },
  nodeCircleDone: { backgroundColor: AppColors.success },
  nodeCircleNext: { backgroundColor: AppColors.primary },
  nodeCircleLocked: { backgroundColor: "rgba(255,255,255,0.06)" },
  railLine: { width: 2, flex: 1, minHeight: 36, backgroundColor: AppColors.locked, marginVertical: 2 },
  railLineDone: { backgroundColor: AppColors.success },

  nodeCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.surface,
    borderRadius: Radii.lg,
    padding: 16,
    marginLeft: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  nodeCardLocked: { opacity: 0.5, borderColor: AppColors.borderSubtle },
  nodeTitle: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  nodeTitleLocked: { color: AppColors.lockedText },
  nodeSubtitle: { color: AppColors.textSecondary, fontSize: 12, marginTop: 4 },
  startPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: AppColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radii.pill,
  },
  startPillText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  doneLabel: { color: AppColors.success, fontSize: 12, fontWeight: "700" },

  benchmarkCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: AppColors.surface,
    borderRadius: Radii.lg,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  benchmarkIcon: {
    width: 40,
    height: 40,
    borderRadius: Radii.sm,
    backgroundColor: "#F59E0B",
    justifyContent: "center",
    alignItems: "center",
  },

  mlSectionHeader: { marginTop: 28, marginBottom: 4 },
  mlSectionTitle: { color: "#FFF", fontSize: 18, fontWeight: "800" },
  mlSectionSubtitle: { color: AppColors.textSecondary, fontSize: 12, marginTop: 4 },
  mlList: { marginTop: 12, gap: 10 },
  mlCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: AppColors.surface,
    borderRadius: Radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  mlIcon: {
    width: 36,
    height: 36,
    borderRadius: Radii.sm,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
  mlIconDone: { backgroundColor: AppColors.success },
  mlCardTitle: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  mlCardCategory: { color: AppColors.textSecondary, fontSize: 11, marginTop: 2 },
});

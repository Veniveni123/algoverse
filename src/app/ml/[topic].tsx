import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  BookOpen,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Code,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  ListChecks,
  PlayCircle,
  ThumbsDown,
  ThumbsUp,
  Video,
} from "lucide-react-native";
import { useCallback, useState } from "react";
import { Platform, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Markdown from "react-native-markdown-display";
import { Sparkles } from "lucide-react-native";

import CodePracticeBlock from "@/components/code-practice-block";
import QuizBlock from "@/components/quiz-block";
import { ResponsiveShell } from "@/components/responsive-shell";
import CelebrationModal from "@/components/celebration-modal";
import { AppColors, Gradients, Radii } from "@/constants/theme";
import { getMLLessonBySlug } from "@/content/ml-lessons";
import { CelebrationEvent, drainCelebrationQueue } from "@/services/gamification.service";
import { loadProgressState, recordQuizCompletion, recordStudySession } from "@/services/progress.service";

type TabKey = "theory" | "visualizer" | "practice" | "youtube" | "quiz";

export default function MLLessonScreen() {
  const { topic } = useLocalSearchParams<{ topic: string }>();
  const lesson = getMLLessonBySlug(topic);
  const [activeTab, setActiveTab] = useState<TabKey>("theory");
  const [quizAlreadyPassed, setQuizAlreadyPassed] = useState(false);
  const [celebrations, setCelebrations] = useState<CelebrationEvent[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!lesson) return;
      let active = true;
      (async () => {
        await recordStudySession(lesson.topicKey);
        const state = await loadProgressState();
        if (active) setQuizAlreadyPassed(state.quizzesCompleted.includes(lesson.topicKey));
        const events = await drainCelebrationQueue();
        if (active && events.length > 0) setCelebrations(events);
      })();
      return () => {
        active = false;
      };
    }, [lesson?.topicKey])
  );

  if (!lesson) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Lesson not found.</Text>
      </View>
    );
  }

  const handleQuizComplete = async (scorePercent: number) => {
    await recordQuizCompletion(lesson.topicKey, scorePercent);
    if (scorePercent >= 60) setQuizAlreadyPassed(true);
    const events = await drainCelebrationQueue();
    if (events.length > 0) setCelebrations(events);
  };

  const Viz = lesson.VisualizationComponent;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ResponsiveShell>
        <LinearGradient colors={Gradients.hero} style={styles.hero}>
          <Text style={styles.categoryTag}>{lesson.category}</Text>
          <Text style={styles.heroTitle}>{lesson.title}</Text>
          <Text style={styles.heroSubtitle}>{lesson.introduction}</Text>
        </LinearGradient>

        {/* TOP TAB NAVIGATION STRIP (TAB-WISE UI) */}
        <View style={styles.tabNavContainer}>
          {[
            { key: "theory", label: "📖 Theory & Notes", icon: <BookOpen size={14} color="#FFF" /> },
            ...(Viz ? [{ key: "visualizer", label: "🎨 Visualizer", icon: <PlayCircle size={14} color="#FFF" /> }] : []),
            { key: "practice", label: "💻 Hands-on Practice", icon: <Code size={14} color="#FFF" /> },
            { key: "youtube", label: "📺 Video Tutorials", icon: <Video size={14} color="#FFF" /> },
            { key: "quiz", label: "❓ Revision Quiz", icon: <HelpCircle size={14} color="#FFF" /> },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabNavButton,
                activeTab === tab.key && styles.activeTabNavButton,
              ]}
              onPress={() => setActiveTab(tab.key as TabKey)}
            >
              <Text
                style={[
                  styles.tabNavText,
                  activeTab === tab.key && styles.activeTabNavText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* TAB 1: THEORY */}
        {activeTab === "theory" && (
          <View style={styles.tabSection}>
            {lesson.detailedNotesHtml ? (
              <View style={styles.sectionCard}>
                <View style={styles.cardHeader}>
                  <BookOpen size={16} color="#8B5CF6" />
                  <Text style={styles.sectionTitle}>Detailed Notes & Math Intuition</Text>
                </View>
                {Platform.OS === "web" ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: lesson.detailedNotesHtml }}
                    style={{ color: "#CBD5E1", fontSize: 14, lineHeight: 1.7 }}
                  />
                ) : (
                  <Markdown
                    style={{
                      body: { color: AppColors.textSecondary, fontSize: 14, lineHeight: 22 },
                      heading1: { color: "#FFF", fontSize: 20, fontWeight: "800", marginTop: 14, marginBottom: 8 },
                      heading2: { color: AppColors.tertiary, fontSize: 16, fontWeight: "700", marginTop: 12, marginBottom: 6 },
                      heading3: { color: "#F59E0B", fontSize: 14, fontWeight: "700", marginTop: 10 },
                      code_block: { backgroundColor: "#050816", color: "#34D399", padding: 12, borderRadius: 8 },
                    }}
                  >
                    {lesson.detailedNotesHtml.replace(/<[^>]*>?/gm, "")}
                  </Markdown>
                )}
              </View>
            ) : (
              <View style={styles.sectionCard}>
                <View style={styles.cardHeader}>
                  <Lightbulb size={16} color="#F59E0B" />
                  <Text style={styles.sectionTitle}>Real-World Analogy</Text>
                </View>
                <Text style={styles.bodyText}>{lesson.analogy}</Text>
              </View>
            )}

            {/* Common Mistakes */}
            {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
              <View style={[styles.sectionCard, { borderColor: "rgba(244,63,94,0.3)", backgroundColor: "rgba(244,63,94,0.04)" }]}>
                <View style={styles.cardHeader}>
                  <Lightbulb size={16} color={AppColors.danger} />
                  <Text style={[styles.sectionTitle, { color: "#F87171" }]}>⚠️ Common Machine Learning Pitfalls</Text>
                </View>
                {lesson.commonMistakes.map((mistake, idx) => (
                  <Text key={idx} style={[styles.bulletText, { color: "#FECDD3", marginVertical: 3 }]}>
                    • {mistake}
                  </Text>
                ))}
              </View>
            )}

            {/* Portfolio Project Ideas */}
            {lesson.projectIdeas && lesson.projectIdeas.length > 0 && (
              <View style={[styles.sectionCard, { borderColor: "rgba(6,182,212,0.3)", backgroundColor: "rgba(6,182,212,0.04)" }]}>
                <View style={styles.cardHeader}>
                  <Sparkles size={16} color={AppColors.tertiary} />
                  <Text style={[styles.sectionTitle, { color: "#22D3EE" }]}>🚀 Real-World Portfolio Projects</Text>
                </View>
                {lesson.projectIdeas.map((project, idx) => (
                  <Text key={idx} style={[styles.bulletText, { color: "#E0F2FE", marginVertical: 3 }]}>
                    {idx + 1}. {project}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <ListChecks size={16} color={AppColors.tertiary} />
                <Text style={styles.sectionTitle}>Key Core Principles</Text>
              </View>
              {lesson.keyIdeas.map((item) => (
                <Text key={item} style={styles.bulletText}>• {item}</Text>
              ))}
            </View>

            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <ListChecks size={16} color={AppColors.success} />
                <Text style={styles.sectionTitle}>Real-World Industry Applications</Text>
              </View>
              {lesson.realWorldUses.map((item) => (
                <Text key={item} style={styles.bulletText}>• {item}</Text>
              ))}
            </View>
          </View>
        )}

        {/* TAB 2: VISUALIZER */}
        {activeTab === "visualizer" && (
          <View style={styles.tabSection}>
            {Viz ? (
              <View style={styles.vizCard}>
                <Text style={styles.vizLabel}>Interactive ML Visualization</Text>
                <Viz />
              </View>
            ) : (
              <View style={styles.sectionCard}>
                <Text style={styles.bodyText}>Visualization component coming soon.</Text>
              </View>
            )}
          </View>
        )}

        {/* TAB 3: PRACTICE */}
        {activeTab === "practice" && (
          <View style={styles.tabSection}>
            {lesson.practiceProblems && lesson.practiceProblems.length > 0 ? (
              <CodePracticeBlock problems={lesson.practiceProblems} />
            ) : (
              <View style={styles.sectionCard}>
                <Text style={styles.bodyText}>Practice problems for this topic are loading...</Text>
              </View>
            )}
          </View>
        )}

        {/* TAB 4: YOUTUBE */}
        {activeTab === "youtube" && (
          <View style={styles.tabSection}>
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <Video size={16} color="#F59E0B" />
                <Text style={styles.sectionTitle}>Curated YouTube Videos</Text>
              </View>

              {lesson.youtubeVideos && lesson.youtubeVideos.length > 0 ? (
                <View style={styles.ytGrid}>
                  {lesson.youtubeVideos.map((vid) => (
                    <TouchableOpacity
                      key={vid.id}
                      style={styles.ytCard}
                      onPress={() => Linking.openURL(vid.url)}
                    >
                      <View style={styles.ytHeader}>
                        <Text style={styles.ytChannel}>{vid.channel}</Text>
                        <View style={styles.ytDurationBadge}>
                          <Text style={styles.ytDurationText}>{vid.duration}</Text>
                        </View>
                      </View>
                      <Text style={styles.ytTitle}>{vid.title}</Text>
                      {vid.description && <Text style={styles.ytDesc}>{vid.description}</Text>}
                      <View style={styles.ytWatchLink}>
                        <PlayCircle size={14} color={AppColors.primary} />
                        <Text style={styles.ytWatchText}>Watch Tutorial</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Text style={styles.bodyText}>No video tutorials attached yet.</Text>
              )}
            </View>
          </View>
        )}

        {/* TAB 5: QUIZ */}
        {activeTab === "quiz" && (
          <View style={styles.tabSection}>
            <View style={styles.quizSection}>
              <Text style={styles.quizTitle}>Test your understanding</Text>
              {quizAlreadyPassed && (
                <View style={styles.passedBanner}>
                  <Text style={styles.passedBannerText}>
                    ✓ You've already passed this quiz. Retake it anytime for practice.
                  </Text>
                </View>
              )}
              <QuizBlock questions={lesson.quiz} onComplete={handleQuizComplete} />
            </View>
          </View>
        )}
      </ResponsiveShell>
      <View style={{ height: 32 }} />
      <CelebrationModal events={celebrations} onDone={() => setCelebrations([])} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.bg },
  notFound: { flex: 1, backgroundColor: AppColors.bg, justifyContent: "center", alignItems: "center" },
  notFoundText: { color: "#FFF" },

  hero: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24, borderRadius: Radii.xl, marginTop: 16 },
  categoryTag: { color: "rgba(255,255,255,0.85)", fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 },
  heroTitle: { color: "#FFF", fontSize: 24, fontWeight: "800", marginTop: 6 },
  heroSubtitle: { color: "rgba(255,255,255,0.9)", fontSize: 13, marginTop: 10, lineHeight: 20 },

  tabNavContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 16,
    marginBottom: 8,
  },
  tabNavButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
  },
  activeTabNavButton: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  tabNavText: { color: AppColors.textMuted, fontSize: 12, fontWeight: "600" },
  activeTabNavText: { color: "#FFF", fontWeight: "700" },

  tabSection: { marginTop: 8 },

  vizCard: {
    backgroundColor: AppColors.surface,
    borderRadius: Radii.xl,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  vizLabel: { color: AppColors.textSecondary, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },

  sectionCard: {
    backgroundColor: AppColors.surface,
    borderRadius: Radii.lg,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  sectionTitle: { color: "#FFF", fontSize: 14, fontWeight: "700" },

  ytGrid: { gap: 10, marginTop: 4 },
  ytCard: {
    backgroundColor: "rgba(0,0,0,0.25)",
    padding: 12,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
  },
  ytHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  ytChannel: { color: AppColors.tertiary, fontSize: 11, fontWeight: "800" },
  ytDurationBadge: { backgroundColor: "rgba(245,158,11,0.2)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radii.pill },
  ytDurationText: { color: "#F59E0B", fontSize: 10, fontWeight: "800" },
  ytTitle: { color: "#FFF", fontSize: 13, fontWeight: "700", marginTop: 6 },
  ytDesc: { color: AppColors.textSecondary, fontSize: 12, marginTop: 4, lineHeight: 18 },
  ytWatchLink: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  ytWatchText: { color: AppColors.primary, fontSize: 12, fontWeight: "700" },

  bodyText: { color: AppColors.textSecondary, fontSize: 13, lineHeight: 20 },
  bulletText: { color: AppColors.textSecondary, fontSize: 13, lineHeight: 22 },

  quizSection: { marginTop: 14 },
  quizTitle: { color: "#FFF", fontSize: 18, fontWeight: "800", marginBottom: 12 },
  passedBanner: { backgroundColor: "rgba(34,197,94,0.1)", borderRadius: Radii.md, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: "rgba(34,197,94,0.25)" },
  passedBannerText: { color: AppColors.success, fontSize: 12 },
});

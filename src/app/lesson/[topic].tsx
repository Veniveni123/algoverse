import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import {
  BookOpen,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Code,
  Download,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  ListChecks,
  PlayCircle,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Video,
} from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";

import CodePracticeBlock from "@/components/code-practice-block";
import EditableSortingViz from "@/components/editable-sorting-viz";
import QuizBlock from "@/components/quiz-block";
import { ResponsiveShell } from "@/components/responsive-shell";
import CelebrationModal from "@/components/celebration-modal";
import { AppColors, Gradients, Radii } from "@/constants/theme";
import { getLessonBySlug } from "@/content/lessons";
import { CelebrationEvent, drainCelebrationQueue } from "@/services/gamification.service";
import { loadProgressState, recordQuizCompletion, recordStudySession } from "@/services/progress.service";

type TabKey = "theory" | "visualizer" | "practice" | "youtube" | "quiz";

export default function LessonScreen() {
  const router = useRouter();
  const { topic } = useLocalSearchParams<{ topic: string }>();
  const lesson = getLessonBySlug(topic);
  const [activeTab, setActiveTab] = useState<TabKey>("theory");
  const [quizAlreadyPassed, setQuizAlreadyPassed] = useState(false);
  const [celebrations, setCelebrations] = useState<CelebrationEvent[]>([]);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

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

  // Real PDF Export powered by expo-print & expo-sharing
  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8"/>
            <style>
              body { font-family: Helvetica, Arial, sans-serif; padding: 40px; color: #0F172A; line-height: 1.6; }
              h1 { color: #7C3AED; border-bottom: 2px solid #7C3AED; padding-bottom: 8px; }
              h2 { color: #4F46E5; margin-top: 24px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; }
              code { background-color: #F1F5F9; padding: 3px 6px; border-radius: 4px; font-family: monospace; color: #D97706; }
              pre { background-color: #0F172A; color: #34D399; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: monospace; }
              table { width: 100%; border-collapse: collapse; margin: 16px 0; }
              th, td { border: 1px solid #CBD5E1; padding: 10px; text-align: left; }
              th { background-color: #F8FAFC; color: #475569; }
            </style>
          </head>
          <body>
            <h1>${lesson.title} - Comprehensive Notes</h1>
            <p><strong>Topic:</strong> ${lesson.topicKey} | AlgoVerse EdTech ML Platform</p>
            <p><em>${lesson.introduction}</em></p>
            <hr/>
            ${lesson.detailedNotesHtml || `<p>${lesson.analogy}</p>`}
          </body>
        </html>
      `;

      if (Platform.OS === "web") {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
        }
      } else {
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        await Sharing.shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
      }
    } catch (err) {
      console.log("PDF Export error", err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleQuizComplete = async (scorePercent: number) => {
    await recordQuizCompletion(lesson.topicKey, scorePercent);
    if (scorePercent >= 60) setQuizAlreadyPassed(true);
    const events = await drainCelebrationQueue();
    if (events.length > 0) setCelebrations(events);
  };

  const isConceptOnly = lesson.slug === "programming-basics" || lesson.slug === "big-o" || !lesson.visualizerRoute;

  const tabs = [
    { key: "theory", label: "📖 Theory & Notes", icon: <BookOpen size={14} color="#FFF" /> },
    ...(!isConceptOnly ? [{ key: "visualizer", label: "🎨 Visualizer", icon: <PlayCircle size={14} color="#FFF" /> }] : []),
    { key: "practice", label: "💻 LeetCode Practice", icon: <Code size={14} color="#FFF" /> },
    { key: "youtube", label: "📺 Video Tutorials", icon: <Video size={14} color="#FFF" /> },
    { key: "quiz", label: "❓ Revision Quiz", icon: <HelpCircle size={14} color="#FFF" /> },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ResponsiveShell>
        {/* Header Hero */}
        <LinearGradient colors={Gradients.hero} style={styles.hero}>
          <Text style={styles.heroTitle}>{lesson.title}</Text>
          <Text style={styles.heroSubtitle}>{lesson.introduction}</Text>

          <View style={styles.heroButtonRow}>
            {!isConceptOnly && (
              <TouchableOpacity
                style={styles.visualizerButton}
                activeOpacity={0.9}
                onPress={() => router.push(lesson.visualizerRoute as any)}
              >
                <PlayCircle size={16} color={AppColors.primary} />
                <Text style={styles.visualizerButtonText}>{lesson.visualizerLabel}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.pdfExportButton}
              activeOpacity={0.9}
              onPress={handleExportPdf}
              disabled={isExportingPdf}
            >
              {isExportingPdf ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Download size={16} color="#FFF" />
                  <Text style={styles.pdfExportButtonText}>📄 Export PDF Notes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* TOP TAB NAVIGATION STRIP (TAB-WISE UI) */}
        <View style={styles.tabNavContainer}>
          {tabs.map((tab) => (
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

        {/* TAB 1: THEORY & NOTES */}
        {activeTab === "theory" && (
          <View style={styles.tabSection}>
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <BookOpen size={16} color="#8B5CF6" />
                <Text style={styles.sectionTitle}>Detailed Theory & Notes</Text>
              </View>

              {lesson.detailedNotesHtml ? (
                Platform.OS === "web" ? (
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
                )
              ) : (
                <Text style={styles.bodyText}>{lesson.analogy}</Text>
              )}

              <TouchableOpacity style={styles.inlinePdfBtn} onPress={handleExportPdf}>
                <Download size={14} color={AppColors.primary} />
                <Text style={styles.inlinePdfBtnText}>Export Notes to PDF</Text>
              </TouchableOpacity>
            </View>

            {/* Common Beginner Mistakes Section */}
            {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
              <View style={[styles.sectionCard, { borderColor: "rgba(244,63,94,0.3)", backgroundColor: "rgba(244,63,94,0.04)" }]}>
                <View style={styles.cardHeader}>
                  <Lightbulb size={16} color={AppColors.danger} />
                  <Text style={[styles.sectionTitle, { color: "#F87171" }]}>⚠️ Common Beginner Mistakes to Avoid</Text>
                </View>
                {lesson.commonMistakes.map((mistake, idx) => (
                  <Text key={idx} style={[styles.bulletText, { color: "#FECDD3", marginVertical: 3 }]}>
                    • {mistake}
                  </Text>
                ))}
              </View>
            )}

            {/* Real-World Project Ideas Section */}
            {lesson.projectIdeas && lesson.projectIdeas.length > 0 && (
              <View style={[styles.sectionCard, { borderColor: "rgba(6,182,212,0.3)", backgroundColor: "rgba(6,182,212,0.04)" }]}>
                <View style={styles.cardHeader}>
                  <Sparkles size={16} color={AppColors.tertiary} />
                  <Text style={[styles.sectionTitle, { color: "#22D3EE" }]}>🚀 Real-World Portfolio Project Ideas</Text>
                </View>
                {lesson.projectIdeas.map((project, idx) => (
                  <Text key={idx} style={[styles.bulletText, { color: "#E0F2FE", marginVertical: 3 }]}>
                    {idx + 1}. {project}
                  </Text>
                ))}
              </View>
            )}

            {/* Complexity & Analogy */}
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <ListChecks size={16} color={AppColors.tertiary} />
                <Text style={styles.sectionTitle}>Complexity & Real-World Use</Text>
              </View>
              {lesson.timeComplexity.map((row) => (
                <View key={row.operation} style={styles.complexityRow}>
                  <Text style={styles.complexityOp}>{row.operation}</Text>
                  <View style={styles.complexityBadge}>
                    <Text style={styles.complexityBadgeText}>{row.complexity}</Text>
                  </View>
                </View>
              ))}
              <View style={styles.divider} />
              <Text style={styles.bodyTextLabel}>Space complexity</Text>
              <Text style={styles.bodyText}>{lesson.spaceComplexity}</Text>
            </View>
          </View>
        )}

        {/* TAB 2: INTERACTIVE VISUALIZER */}
        {activeTab === "visualizer" && (
          <View style={styles.tabSection}>
            {lesson.slug === "sorting" ? (
              <EditableSortingViz />
            ) : (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Interactive Visualizer</Text>
                <Text style={[styles.bodyText, { marginTop: 8 }]}>
                  Launch the dedicated visualizer workspace for {lesson.title}.
                </Text>
                <TouchableOpacity
                  style={[styles.visualizerButton, { marginTop: 14 }]}
                  onPress={() => router.push(lesson.visualizerRoute as any)}
                >
                  <PlayCircle size={16} color={AppColors.primary} />
                  <Text style={styles.visualizerButtonText}>Open Visualizer Workspace</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* TAB 3: LEETCODE PRACTICE & HINTS */}
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

        {/* TAB 4: YOUTUBE VIDEOS */}
        {activeTab === "youtube" && (
          <View style={styles.tabSection}>
            <View style={styles.sectionCard}>
              <View style={styles.cardHeader}>
                <Video size={16} color="#F59E0B" />
                <Text style={styles.sectionTitle}>Curated YouTube Video Tutorials</Text>
              </View>

              {lesson.youtubeVideos && lesson.youtubeVideos.length > 0 ? (
                <View style={styles.resourcesGrid}>
                  {lesson.youtubeVideos.map((vid) => (
                    <TouchableOpacity
                      key={vid.id}
                      style={styles.resourceCard}
                      onPress={() => Linking.openURL(vid.url)}
                    >
                      <View style={styles.resourceHeader}>
                        <Text style={{ color: AppColors.tertiary, fontSize: 11, fontWeight: "800" }}>
                          {vid.channel}
                        </Text>
                        <View style={styles.resourceBadge}>
                          <Text style={styles.resourceBadgeText}>{vid.duration}</Text>
                        </View>
                      </View>
                      <Text style={styles.resourceTitle}>{vid.title}</Text>
                      {vid.description && <Text style={styles.resourceDesc}>{vid.description}</Text>}
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
                        <PlayCircle size={14} color={AppColors.primary} />
                        <Text style={{ color: AppColors.primary, fontSize: 12, fontWeight: "700" }}>
                          Watch Tutorial
                        </Text>
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

        {/* TAB 5: QUIZ & BADGES */}
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
  heroTitle: { color: "#FFF", fontSize: 24, fontWeight: "800" },
  heroSubtitle: { color: "rgba(255,255,255,0.9)", fontSize: 13, marginTop: 10, lineHeight: 20 },
  heroButtonRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 16 },
  visualizerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radii.pill,
  },
  visualizerButtonText: { color: AppColors.primary, fontWeight: "700", fontSize: 13 },
  pdfExportButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  pdfExportButtonText: { color: "#FFF", fontWeight: "700", fontSize: 13 },

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

  sectionCard: {
    backgroundColor: AppColors.surface,
    borderRadius: Radii.lg,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  sectionTitle: { color: "#FFF", fontSize: 15, fontWeight: "700" },

  bodyText: { color: AppColors.textSecondary, fontSize: 13, lineHeight: 20 },
  bodyTextLabel: { color: "#FFF", fontSize: 12, fontWeight: "700", marginBottom: 6, marginTop: 4 },
  divider: { height: 1, backgroundColor: AppColors.borderSubtle, marginVertical: 12 },

  inlinePdfBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(139,92,246,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    marginTop: 14,
  },
  inlinePdfBtnText: { color: AppColors.primary, fontSize: 12, fontWeight: "700" },

  resourcesGrid: { gap: 10, marginTop: 4 },
  resourceCard: {
    backgroundColor: "rgba(0,0,0,0.25)",
    padding: 12,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
  },
  resourceHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  resourceBadge: { backgroundColor: "rgba(245,158,11,0.2)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radii.pill },
  resourceBadgeText: { color: "#F59E0B", fontSize: 10, fontWeight: "800" },
  resourceTitle: { color: "#FFF", fontSize: 13, fontWeight: "700", marginTop: 6 },
  resourceDesc: { color: AppColors.textSecondary, fontSize: 12, marginTop: 4, lineHeight: 18 },

  complexityRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 },
  complexityOp: { color: AppColors.textSecondary, fontSize: 12, flex: 1, paddingRight: 8 },
  complexityBadge: { backgroundColor: "rgba(139,92,246,0.15)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.pill },
  complexityBadgeText: { color: AppColors.primary, fontSize: 12, fontWeight: "700" },

  quizSection: { marginTop: 14 },
  quizTitle: { color: "#FFF", fontSize: 18, fontWeight: "800", marginBottom: 12 },
  passedBanner: { backgroundColor: "rgba(34,197,94,0.1)", borderRadius: Radii.md, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: "rgba(34,197,94,0.25)" },
  passedBannerText: { color: AppColors.success, fontSize: 12 },
});

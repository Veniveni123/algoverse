import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Bot, CheckCircle2, Code, HelpCircle, Play, Sparkles, XCircle } from "lucide-react-native";
import Markdown from "react-native-markdown-display";

import { AppColors, Radii } from "../constants/theme";
import type { PracticeProblem } from "../types/lesson";
import { reviewUserCode } from "@/services/ai/ai-code-reviewer.service";
import { awardXP, enqueueCelebration } from "@/services/gamification.service";

type Props = {
  problems: PracticeProblem[];
};

export type TestResult = {
  testIndex: number;
  inputStr: string;
  expectedStr: string;
  actualStr: string;
  passed: boolean;
  error?: string;
};

/**
 * Sandboxed Client-Side Real JavaScript Code Execution Engine
 */
export function executeUserCode(
  userCode: string,
  problem: PracticeProblem
): TestResult[] {
  const results: TestResult[] = [];

  try {
    const runner = new Function(
      `
      try {
        ${userCode}
        if (typeof solution === 'function') return solution;
        if (typeof sortArray === 'function') return sortArray;
        if (typeof findKthLargest === 'function') return findKthLargest;
        if (typeof sortArrayByParity === 'function') return sortArrayByParity;
        if (typeof merge === 'function') return merge;
        if (typeof sortColors === 'function') return sortColors;
        throw new Error("Could not find a valid function definition.");
      } catch(err) {
        throw err;
      }
      `
    )();

    problem.testCases.forEach((tc, idx) => {
      const inputCopy = JSON.parse(JSON.stringify(tc.input));
      const expectedStr = JSON.stringify(tc.expected);

      try {
        const actual = runner(...inputCopy);
        const actualStr = JSON.stringify(actual);
        const passed = actualStr === expectedStr;

        results.push({
          testIndex: idx + 1,
          inputStr: JSON.stringify(tc.input),
          expectedStr,
          actualStr,
          passed,
        });
      } catch (err: any) {
        results.push({
          testIndex: idx + 1,
          inputStr: JSON.stringify(tc.input),
          expectedStr,
          actualStr: "Runtime Error",
          passed: false,
          error: err.message || String(err),
        });
      }
    });
  } catch (err: any) {
    problem.testCases.forEach((tc, idx) => {
      results.push({
        testIndex: idx + 1,
        inputStr: JSON.stringify(tc.input),
        expectedStr: JSON.stringify(tc.expected),
        actualStr: "Syntax Error",
        passed: false,
        error: err.message || String(err),
      });
    });
  }

  return results;
}

export default function CodePracticeBlock({ problems }: Props) {
  const [selectedProblemIdx, setSelectedProblemIdx] = useState(0);
  const currentProblem = problems[selectedProblemIdx] || problems[0];

  const [userCode, setUserCode] = useState(currentProblem?.starterCode || "");
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // AI Code Review States
  const [isReviewingAi, setIsReviewingAi] = useState(false);
  const [aiReviewMarkdown, setAiReviewMarkdown] = useState<string | null>(null);
  const [aiModelName, setAiModelName] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // LeetCode Hints State
  const [visibleHintIdx, setVisibleHintIdx] = useState<number | null>(null);

  // Switch active problem
  const handleSelectProblem = (idx: number) => {
    setSelectedProblemIdx(idx);
    setUserCode(problems[idx].starterCode);
    setTestResults(null);
    setShowSolution(false);
    setAiReviewMarkdown(null);
    setReviewError(null);
  };

  // Run Test Cases
  const handleRunCode = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const results = executeUserCode(userCode, currentProblem);
      setTestResults(results);
      setIsExecuting(false);
    }, 200);
  };

  // Request Live AI Code Review
  const handleRequestAiReview = async () => {
    setIsReviewingAi(true);
    setReviewError(null);

    try {
      // Execute test cases first if not already run
      const results = testResults || executeUserCode(userCode, currentProblem);
      if (!testResults) setTestResults(results);

      const review = await reviewUserCode({
        problemTitle: currentProblem.title,
        problemDescription: currentProblem.description,
        userCode,
        testResults: results,
      });

      setAiReviewMarkdown(review.reviewMarkdown);
      setAiModelName(review.model);

      // Award +20 XP for requesting AI Code Review
      const xpRes = await awardXP(20);
      if (xpRes) {
        await enqueueCelebration({ type: "xp", amount: 20, reason: "AI Code Review Completed" });
        if (xpRes.leveledUp) {
          await enqueueCelebration({ type: "level_up", level: xpRes.after.level });
        }
      }
    } catch (err: any) {
      setReviewError(err.message || "Failed to generate AI Code Review.");
    } finally {
      setIsReviewingAi(false);
    }
  };

  const passedCount = testResults?.filter((r) => r.passed).length || 0;
  const totalCount = testResults?.length || 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Code size={20} color={AppColors.tertiary} />
        <Text style={styles.title}>💻 Practice Mode (Real In-App Execution)</Text>
      </View>

      {/* Problem Selector Tabs */}
      <View style={styles.problemTabs}>
        {problems.map((p, idx) => (
          <TouchableOpacity
            key={p.id}
            style={[
              styles.problemTab,
              selectedProblemIdx === idx && styles.activeProblemTab,
            ]}
            onPress={() => handleSelectProblem(idx)}
          >
            <Text
              style={[
                styles.problemTabText,
                selectedProblemIdx === idx && styles.activeProblemTabText,
              ]}
            >
              Prob {idx + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Selected Problem Overview */}
      <View style={styles.problemCard}>
        <View style={styles.problemTitleRow}>
          <Text style={styles.problemTitle}>{currentProblem.title}</Text>
          <View
            style={[
              styles.difficultyBadge,
              currentProblem.difficulty === "Easy"
                ? styles.diffEasy
                : currentProblem.difficulty === "Medium"
                ? styles.diffMedium
                : styles.diffHard,
            ]}
          >
            <Text style={styles.difficultyText}>{currentProblem.difficulty}</Text>
          </View>
        </View>

        <Text style={styles.problemDesc}>{currentProblem.description}</Text>

        {/* LEETCODE HINTS */}
        {currentProblem.hints && currentProblem.hints.length > 0 && (
          <View style={styles.hintsSection}>
            <Text style={styles.hintsSectionTitle}>💡 LeetCode Problem Hints:</Text>
            <View style={styles.hintsRow}>
              {currentProblem.hints.map((hint, hIdx) => (
                <TouchableOpacity
                  key={hIdx}
                  style={[
                    styles.hintChip,
                    visibleHintIdx === hIdx && styles.activeHintChip,
                  ]}
                  onPress={() => setVisibleHintIdx(visibleHintIdx === hIdx ? null : hIdx)}
                >
                  <Text style={[styles.hintChipText, visibleHintIdx === hIdx && styles.activeHintChipText]}>
                    Hint {hIdx + 1} {visibleHintIdx === hIdx ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {visibleHintIdx !== null && currentProblem.hints[visibleHintIdx] && (
              <View style={styles.hintContentBox}>
                <Text style={styles.hintContentText}>
                  💡 <Text style={{ fontWeight: "700" }}>Hint {visibleHintIdx + 1}:</Text>{" "}
                  {currentProblem.hints[visibleHintIdx]}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Code Editor */}
        <Text style={styles.editorLabel}>Write JavaScript Solution:</Text>
        <TextInput
          style={styles.codeEditor}
          multiline
          value={userCode}
          onChangeText={setUserCode}
          placeholder="Write your JS function here..."
          placeholderTextColor="#6B7280"
        />

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.runBtn, isExecuting && styles.disabledBtn]}
            onPress={handleRunCode}
            disabled={isExecuting}
          >
            {isExecuting ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Play size={16} color="#FFF" />
                <Text style={styles.runBtnText}>▶ Run Test Cases</Text>
              </>
            )}
          </TouchableOpacity>

          {/* AI Code Review Button */}
          <TouchableOpacity
            style={[styles.aiReviewBtn, isReviewingAi && styles.disabledBtn]}
            onPress={handleRequestAiReview}
            disabled={isReviewingAi}
          >
            {isReviewingAi ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Bot size={16} color="#FFF" />
                <Text style={styles.aiReviewBtnText}>🤖 AI Code Review (+20 XP)</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.solutionBtn}
          onPress={() => setShowSolution(!showSolution)}
        >
          <HelpCircle size={14} color={AppColors.textSecondary} />
          <Text style={styles.solutionBtnText}>
            {showSolution ? "Hide Hint" : "Reveal Explanation"}
          </Text>
        </TouchableOpacity>

        {/* Solution Explanation */}
        {showSolution && (
          <View style={styles.solutionBox}>
            <Text style={styles.solutionTitle}>💡 Solution Explanation</Text>
            <Text style={styles.solutionText}>{currentProblem.solutionExplanation}</Text>
          </View>
        )}

        {/* AI CODE REVIEW OUTPUT CARD */}
        {reviewError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ AI Review Error: {reviewError}</Text>
          </View>
        )}

        {aiReviewMarkdown && (
          <View style={styles.aiReviewCard}>
            <View style={styles.aiReviewHeader}>
              <View style={styles.aiBadgeRow}>
                <Sparkles size={16} color={AppColors.tertiary} />
                <Text style={styles.aiReviewTitle}>AI Optimization & Code Review</Text>
              </View>
              {aiModelName && <Text style={styles.aiModelText}>Model: {aiModelName}</Text>}
            </View>

            {Platform.OS === "web" ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: aiReviewMarkdown
                    .replace(/### (.*?)\n/g, '<h4 style="color:#06B6D4;margin-top:12px;">$1</h4>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br/>'),
                }}
                style={{ color: "#E2E8F0", fontSize: 12, lineHeight: 1.6 }}
              />
            ) : (
              <Markdown
                style={{
                  body: { color: AppColors.textSecondary, fontSize: 12 },
                  heading3: { color: AppColors.tertiary, fontSize: 14, fontWeight: "800", marginTop: 8 },
                  code_block: { backgroundColor: "#050816", color: "#34D399", padding: 10 },
                }}
              >
                {aiReviewMarkdown}
              </Markdown>
            )}
          </View>
        )}

        {/* Test Case Execution Results */}
        {testResults && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                Test Results: {passedCount} / {totalCount} Passed
              </Text>
              {passedCount === totalCount ? (
                <View style={styles.passedPill}>
                  <CheckCircle2 size={14} color="#FFF" />
                  <Text style={styles.passedPillText}>ALL PASSED</Text>
                </View>
              ) : (
                <View style={styles.failedPill}>
                  <XCircle size={14} color="#FFF" />
                  <Text style={styles.failedPillText}>SOME FAILED</Text>
                </View>
              )}
            </View>

            {testResults.map((tr) => (
              <View
                key={tr.testIndex}
                style={[
                  styles.testRow,
                  tr.passed ? styles.testRowPassed : styles.testRowFailed,
                ]}
              >
                <View style={styles.testRowTop}>
                  <Text style={styles.testIndexText}>Test #{tr.testIndex}</Text>
                  <Text style={tr.passed ? styles.passStatus : styles.failStatus}>
                    {tr.passed ? "PASSED" : "FAILED"}
                  </Text>
                </View>

                <Text style={styles.testDetailText}>
                  Input: <Text style={styles.codeSpan}>{tr.inputStr}</Text>
                </Text>
                <Text style={styles.testDetailText}>
                  Expected: <Text style={styles.codeSpan}>{tr.expectedStr}</Text>
                </Text>
                <Text style={styles.testDetailText}>
                  Actual Output:{" "}
                  <Text
                    style={[
                      styles.codeSpan,
                      !tr.passed && { color: AppColors.danger },
                    ]}
                  >
                    {tr.actualStr}
                  </Text>
                </Text>
                {tr.error && <Text style={styles.errorText}>Error: {tr.error}</Text>}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  header: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  title: { color: "#FFF", fontSize: 16, fontWeight: "800" },

  problemTabs: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 },
  problemTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
  },
  activeProblemTab: { backgroundColor: AppColors.primary, borderColor: AppColors.primary },
  problemTabText: { color: AppColors.textMuted, fontSize: 12, fontWeight: "600" },
  activeProblemTabText: { color: "#FFF", fontWeight: "700" },

  problemCard: {
    backgroundColor: AppColors.surface,
    borderRadius: Radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  problemTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  problemTitle: { color: "#FFF", fontSize: 16, fontWeight: "700" },

  difficultyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.pill },
  diffEasy: { backgroundColor: "rgba(34, 197, 94, 0.2)" },
  diffMedium: { backgroundColor: "rgba(245, 158, 11, 0.2)" },
  diffHard: { backgroundColor: "rgba(244, 63, 94, 0.2)" },
  difficultyText: { color: "#FFF", fontSize: 11, fontWeight: "800" },

  problemDesc: { color: AppColors.textSecondary, fontSize: 13, marginTop: 8, lineHeight: 20 },

  editorLabel: { color: "#FFF", fontSize: 13, fontWeight: "700", marginTop: 14, marginBottom: 6 },
  codeEditor: {
    backgroundColor: "#050816",
    color: "#34D399",
    borderRadius: Radii.md,
    padding: 14,
    minHeight: 140,
    textAlignVertical: "top",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    fontSize: 12,
    lineHeight: 18,
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
  },

  actionRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 },
  runBtn: {
    backgroundColor: AppColors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Radii.md,
  },
  aiReviewBtn: {
    backgroundColor: "#7C3AED",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Radii.md,
  },
  disabledBtn: { opacity: 0.5 },
  runBtnText: { color: "#FFF", fontWeight: "700", fontSize: 13 },
  aiReviewBtnText: { color: "#FFF", fontWeight: "700", fontSize: 13 },

  solutionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  solutionBtnText: { color: AppColors.textMuted, fontSize: 12, fontWeight: "600" },

  solutionBox: {
    backgroundColor: "rgba(6, 182, 212, 0.1)",
    borderRadius: Radii.md,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: AppColors.tertiary,
  },
  solutionTitle: { color: AppColors.tertiary, fontSize: 13, fontWeight: "700" },
  solutionText: { color: "#FFF", fontSize: 12, marginTop: 4, lineHeight: 18 },

  aiReviewCard: {
    backgroundColor: "rgba(124, 58, 237, 0.12)",
    borderRadius: Radii.md,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: AppColors.primary,
  },
  aiReviewHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  aiBadgeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  aiReviewTitle: { color: "#FFF", fontSize: 14, fontWeight: "800" },
  aiModelText: { color: AppColors.textMuted, fontSize: 10 },

  resultsContainer: { marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: AppColors.borderSubtle },
  resultsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  resultsTitle: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  passedPill: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: AppColors.success, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.pill },
  passedPillText: { color: "#FFF", fontSize: 10, fontWeight: "800" },
  failedPill: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: AppColors.danger, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.pill },
  failedPillText: { color: "#FFF", fontSize: 10, fontWeight: "800" },

  testRow: { backgroundColor: "rgba(0,0,0,0.3)", borderRadius: Radii.md, padding: 10, marginBottom: 8, borderWidth: 1 },
  testRowPassed: { borderColor: "rgba(34, 197, 94, 0.3)" },
  testRowFailed: { borderColor: "rgba(244, 63, 94, 0.3)" },
  testRowTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  testIndexText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  passStatus: { color: AppColors.success, fontSize: 11, fontWeight: "800" },
  failStatus: { color: AppColors.danger, fontSize: 11, fontWeight: "800" },
  testDetailText: { color: AppColors.textMuted, fontSize: 11, marginTop: 2 },
  codeSpan: { color: AppColors.textSecondary, fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" },
  errorBox: { backgroundColor: "rgba(244,63,94,0.15)", padding: 10, borderRadius: Radii.md, marginTop: 10 },
  errorText: { color: AppColors.danger, fontSize: 11, marginTop: 4 },

  hintsSection: { marginTop: 10 },
  hintsSectionTitle: { color: AppColors.tertiary, fontSize: 12, fontWeight: "700", marginBottom: 6 },
  hintsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  hintChip: {
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
  },
  activeHintChip: { backgroundColor: AppColors.tertiary, borderColor: AppColors.tertiary },
  hintChipText: { color: AppColors.textMuted, fontSize: 11, fontWeight: "600" },
  activeHintChipText: { color: "#FFF", fontWeight: "700" },
  hintContentBox: {
    backgroundColor: "rgba(6, 182, 212, 0.1)",
    borderRadius: Radii.md,
    padding: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "rgba(6, 182, 212, 0.3)",
  },
  hintContentText: { color: "#FFF", fontSize: 12, lineHeight: 18 },
});

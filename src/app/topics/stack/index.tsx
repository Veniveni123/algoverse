import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { recordStudySession } from "@/services/progress.service";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Code as CodeIcon,
  Layers,
} from "lucide-react-native";

import { stackDescriptions } from "./description";
import { stackCodeSnippets } from "./code";
import {
  generatePushSteps,
  generatePopSteps,
  generatePeekSteps,
  generateBalancedParenthesesSteps,
  Step,
} from "./visualizer";

const { width } = Dimensions.get("window");
const DEFAULT_STACK = [15, 24, 8];

export default function StackScreen() {
  useEffect(() => {
    recordStudySession("Stack");
  }, []);

  const { algo } = useLocalSearchParams<{ algo?: string }>();
  const [selectedAlgo, setSelectedAlgo] = useState(algo || "Push Operation");
  const [stackData, setStackData] = useState<number[]>(DEFAULT_STACK);

  // Animation states
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800); // ms per step

  // Tabs: 'visualize' | 'learn' | 'code'
  const [activeTab, setActiveTab] = useState<"visualize" | "learn" | "code">(
    "visualize"
  );
  const [activeLang, setActiveLang] = useState<"python" | "java" | "cpp">(
    "python"
  );

  // Input states
  const [pushValue, setPushValue] = useState("42");
  const [bracketsExpr, setBracketsExpr] = useState("{[()]}");
  const [customStackInput, setCustomStackInput] = useState("10, 20, 30, 40");

  const buildCustomStack = () => {
    const parsed = customStackInput
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    if (parsed.length > 0) {
      setStackData(parsed);
      setIsPlaying(false);
      setCurrentStepIndex(0);
    }
  };

  const colors = {
    primary: "#F97316", // Stack Orange
    success: "#10B981",
    accent: "#FB923C",
    bg: "#0A0A0F",
    cardBg: "#12121A",
    border: "#1E1E2E",
  };

  const rebuildSteps = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);

    if (selectedAlgo === "Push Operation") {
      const val = parseInt(pushValue) || 42;
      setSteps(generatePushSteps(stackData, val));
    } else if (selectedAlgo === "Pop Operation") {
      setSteps(generatePopSteps(stackData));
    } else if (selectedAlgo === "Peek Operation") {
      setSteps(generatePeekSteps(stackData));
    } else if (selectedAlgo === "Stack Applications") {
      setSteps(generateBalancedParenthesesSteps(bracketsExpr));
    }
  };

  useEffect(() => {
    rebuildSteps();
  }, [selectedAlgo, stackData]);

  // Handle Play/Pause
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, speed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const handlePlayPause = () => {
    if (currentStepIndex === steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // Sync state if step ends with pushing/popping
  const applyFinalStackState = () => {
    const finalStep = steps[steps.length - 1];
    if (finalStep && finalStep.array) {
      setStackData(finalStep.array);
    }
  };

  const currentStep: Step = steps[currentStepIndex] || {
    array: stackData,
    activeIndices: [],
    pointers: {},
    message: "Initializing visualizer...",
  };

  const info = stackDescriptions[selectedAlgo] || stackDescriptions["Push Operation"];
  const codeSnippet = stackCodeSnippets[selectedAlgo] || stackCodeSnippets["Push Operation"];

  // Helper to map bracket number back to symbol
  const getBracketChar = (val: number) => {
    if (val === 1) return "(";
    if (val === 2) return "[";
    if (val === 3) return "{";
    return "";
  };

  const generateRandomStack = () => {
    const size = Math.floor(Math.random() * 3) + 2; // 2 to 4 elements
    const newStack = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setStackData(newStack);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>{selectedAlgo}</Text>
        <Text style={styles.subtitle}>Stack LIFO Visualizer</Text>
      </View>

      {/* Tabs Selector */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "visualize" && { backgroundColor: colors.primary }]}
          onPress={() => setActiveTab("visualize")}
        >
          <Layers size={16} color={activeTab === "visualize" ? "#FFF" : "#888"} />
          <Text style={[styles.tabText, activeTab === "visualize" && styles.tabTextActive]}>
            Visualize
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "learn" && { backgroundColor: colors.primary }]}
          onPress={() => setActiveTab("learn")}
        >
          <BookOpen size={16} color={activeTab === "learn" ? "#FFF" : "#888"} />
          <Text style={[styles.tabText, activeTab === "learn" && styles.tabTextActive]}>
            Learn
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "code" && { backgroundColor: colors.primary }]}
          onPress={() => setActiveTab("code")}
        >
          <CodeIcon size={16} color={activeTab === "code" ? "#FFF" : "#888"} />
          <Text style={[styles.tabText, activeTab === "code" && styles.tabTextActive]}>
            Code
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── VISUALIZE TAB ── */}
      {activeTab === "visualize" && (
        <View style={styles.contentSection}>
          {/* Operation selector pills */}
          <View style={styles.algoPills}>
            {Object.keys(stackDescriptions).map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.pill,
                  selectedAlgo === key && {
                    backgroundColor: colors.primary + "33",
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => {
                  setSelectedAlgo(key);
                }}
              >
                <Text style={[styles.pillText, selectedAlgo === key && { color: "#FFF" }]}>
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CUSTOM STACK BUILDER CARD */}
          <View style={styles.customInputCard}>
            <Text style={styles.customInputTitle}>User Custom Stack Builder</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Initial Stack Elements (bottom to top):</Text>
                <TextInput
                  style={styles.textInput}
                  value={customStackInput}
                  onChangeText={setCustomStackInput}
                  placeholder="e.g. 10, 20, 30, 40"
                  placeholderTextColor="#555"
                />
              </View>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={buildCustomStack}>
                <Text style={styles.actionBtnText}>Set Stack</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Inputs */}
          <View style={styles.inputContainer}>
            {selectedAlgo === "Push Operation" && (
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Value to Push:</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={pushValue}
                    onChangeText={setPushValue}
                    maxLength={3}
                  />
                </View>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={rebuildSteps}>
                  <Text style={styles.actionBtnText}>Push</Text>
                </TouchableOpacity>
              </View>
            )}

            {selectedAlgo === "Stack Applications" && (
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Brackets Expression:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={bracketsExpr}
                    onChangeText={setBracketsExpr}
                    autoCapitalize="none"
                    maxLength={15}
                  />
                </View>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={rebuildSteps}>
                  <Text style={styles.actionBtnText}>Validate</Text>
                </TouchableOpacity>
              </View>
            )}

            {selectedAlgo !== "Stack Applications" && (
              <View style={styles.actionRowRight}>
                {/* Pop and Peek just execute immediately. If Push has run, we can apply the final state to stackData */}
                {currentStepIndex === steps.length - 1 && steps.length > 1 && (
                  <TouchableOpacity style={[styles.applyBtn, { borderColor: colors.primary }]} onPress={applyFinalStackState}>
                    <Text style={[styles.applyBtnText, { color: colors.primary }]}>💾 Apply Changes</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.randomBtn} onPress={generateRandomStack}>
                  <Text style={styles.randomBtnText}>🎲 Reset Stack</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Balanced Parentheses Expression Tracker */}
          {selectedAlgo === "Stack Applications" && (
            <View style={styles.exprContainer}>
              <Text style={styles.exprLabel}>Scanning Expression:</Text>
              <View style={styles.exprRow}>
                {bracketsExpr.split("").map((ch, idx) => {
                  const isCurrent = currentStep.pointers?.charIndex === idx;
                  return (
                    <View
                      key={idx}
                      style={[
                        styles.charBox,
                        isCurrent && {
                          backgroundColor: colors.primary,
                          borderColor: colors.accent,
                        },
                      ]}
                    >
                      <Text style={[styles.charText, isCurrent && { color: "#FFF", fontWeight: "bold" }]}>
                        {ch}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Visualizing Area */}
          <View style={styles.visualizationContainer}>
            {selectedAlgo === "Stack Applications" ? (
              // Bracket Stack visualization (mapped values 1, 2, 3)
              <View style={styles.stackWrapper}>
                <View style={styles.stackGlass}>
                  {currentStep.array && currentStep.array.length > 0 ? (
                    [...currentStep.array].reverse().map((val, idx) => {
                      const absoluteIdx = currentStep.array!.length - 1 - idx;
                      const isActive = currentStep.activeIndices?.includes(absoluteIdx);
                      return (
                        <View
                          key={idx}
                          style={[
                            styles.stackElement,
                            { borderColor: colors.border },
                            isActive && { borderColor: colors.primary, backgroundColor: colors.primary + "22" },
                          ]}
                        >
                          <Text style={styles.stackElementText}>{getBracketChar(val)}</Text>
                        </View>
                      );
                    })
                  ) : (
                    <Text style={styles.emptyText}>Stack Empty</Text>
                  )}
                </View>
              </View>
            ) : (
              // Numerical Stack
              <View style={styles.stackWrapper}>
                <View style={styles.stackGlass}>
                  {currentStep.array && currentStep.array.length > 0 ? (
                    [...currentStep.array].reverse().map((val, idx) => {
                      const absoluteIdx = currentStep.array!.length - 1 - idx;
                      const isActive = currentStep.activeIndices?.includes(absoluteIdx);
                      const isSwapped = currentStep.swappedIndices?.includes(absoluteIdx);
                      const isTop = absoluteIdx === currentStep.pointers?.top;

                      return (
                        <View key={idx} style={styles.stackElementContainer}>
                          {isTop && (
                            <View style={[styles.topBadge, { backgroundColor: colors.primary }]}>
                              <Text style={styles.topBadgeText}>TOP</Text>
                            </View>
                          )}
                          <View
                            style={[
                              styles.stackElement,
                              { borderColor: colors.border },
                              isActive && { borderColor: colors.primary, backgroundColor: colors.primary + "22" },
                              isSwapped && { borderColor: colors.success, backgroundColor: colors.success + "22" },
                            ]}
                          >
                            <Text style={styles.stackElementText}>{val}</Text>
                          </View>
                        </View>
                      );
                    })
                  ) : (
                    <Text style={styles.emptyText}>Stack Empty</Text>
                  )}
                </View>
              </View>
            )}
          </View>

          {/* Message Panel */}
          <View style={[styles.msgPanel, { borderColor: colors.primary + "33" }]}>
            <Text style={styles.msgText}>{currentStep.message}</Text>
          </View>

          {/* Controls Bar */}
          <View style={styles.controlsContainer}>
            <View style={styles.controlBtns}>
              <TouchableOpacity style={styles.controlBtn} onPress={handlePrev}>
                <ChevronLeft size={22} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.controlBtn, styles.playBtn, { backgroundColor: colors.primary }]} onPress={handlePlayPause}>
                {isPlaying ? <Pause size={22} color="#FFF" fill="#FFF" /> : <Play size={22} color="#FFF" fill="#FFF" />}
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlBtn} onPress={handleNext}>
                <ChevronRight size={22} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlBtn} onPress={handleReset}>
                <RotateCcw size={18} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Speed Option */}
            <View style={styles.speedContainer}>
              <Text style={styles.speedLabel}>Speed:</Text>
              <View style={styles.speedOptions}>
                {[1200, 800, 400].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.speedBtn, speed === s && { backgroundColor: colors.primary }]}
                    onPress={() => setSpeed(s)}
                  >
                    <Text style={[styles.speedBtnText, speed === s && { color: "#FFF" }]}>
                      {s === 1200 ? "0.5x" : s === 800 ? "1x" : "2x"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Diagnostics */}
          <View style={styles.metricsBox}>
            <Text style={styles.metricTitle}>Stack Information</Text>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Top Pointer Index:</Text>
              <Text style={styles.metricVal}>
                {currentStep.pointers?.top !== undefined ? currentStep.pointers.top : "-1"}
              </Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Max Capacity:</Text>
              <Text style={styles.metricVal}>6 Items</Text>
            </View>
          </View>
        </View>
      )}

      {/* ── LEARN TAB ── */}
      {activeTab === "learn" && (
        <View style={styles.learnSection}>
          <Text style={styles.learnHeading}>Overview</Text>
          <Text style={styles.learnText}>{info.about}</Text>

          <View style={[styles.complexityGrid, { borderColor: colors.border }]}>
            <View style={styles.complexityCell}>
              <Text style={styles.complexityTitle}>Push</Text>
              <Text style={[styles.complexityVal, { color: colors.success }]}>{info.best}</Text>
            </View>
            <View style={styles.complexityCell}>
              <Text style={styles.complexityTitle}>Pop</Text>
              <Text style={[styles.complexityVal, { color: colors.success }]}>{info.average}</Text>
            </View>
            <View style={styles.complexityCell}>
              <Text style={styles.complexityTitle}>Peek</Text>
              <Text style={[styles.complexityVal, { color: colors.success }]}>{info.worst}</Text>
            </View>
            <View style={styles.complexityCell}>
              <Text style={styles.complexityTitle}>Space Complexity</Text>
              <Text style={styles.complexityVal}>{info.space}</Text>
            </View>
          </View>

          <Text style={styles.learnHeading}>Operational Highlights</Text>
          {info.keypoints.map((pt, index) => (
            <View key={index} style={styles.pointRow}>
              <Text style={[styles.pointMarker, { color: colors.primary }]}>•</Text>
              <Text style={styles.pointText}>{pt}</Text>
            </View>
          ))}
        </View>
      )}

      {/* ── CODE TAB ── */}
      {activeTab === "code" && (
        <View style={styles.codeSection}>
          <View style={styles.langSelector}>
            {(["python", "java", "cpp"] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.langTab,
                  activeLang === lang && {
                    borderBottomWidth: 2,
                    borderBottomColor: colors.primary,
                  },
                ]}
                onPress={() => setActiveLang(lang)}
              >
                <Text style={[styles.langText, activeLang === lang && { color: "#FFF" }]}>
                  {lang === "cpp" ? "C++" : lang.charAt(0).toUpperCase() + lang.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView style={styles.codeScroller} horizontal showsHorizontalScrollIndicator={true}>
            <View style={styles.codeBlock}>
              <Text style={styles.codeTextContent}>
                {codeSnippet[activeLang]}
              </Text>
            </View>
          </ScrollView>
        </View>
      )}
      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0F" },
  header: { padding: 24, paddingTop: 16 },
  title: { fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 13, color: "#666", marginTop: 4 },

  // Tabs
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: "#12121A",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabText: { color: "#888", fontWeight: "600", fontSize: 13 },
  tabTextActive: { color: "#FFF" },

  // Visualize Tab content
  contentSection: { padding: 20 },
  algoPills: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    backgroundColor: "#12121A",
  },
  pillText: { color: "#888", fontSize: 12, fontWeight: "600" },

  // Inputs
  inputContainer: {
    backgroundColor: "#12121A",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    marginBottom: 20,
  },
  inputRow: { flexDirection: "row", alignItems: "flex-end", gap: 12 },
  inputWrapper: { flex: 1 },
  inputLabel: { color: "#888", fontSize: 11, marginBottom: 6 },
  textInput: {
    backgroundColor: "#0A0A0F",
    color: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    fontSize: 14,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 13 },
  actionRowRight: { flexDirection: "row", marginTop: 12, justifyContent: "flex-end", gap: 10 },
  applyBtn: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyBtnText: { fontSize: 12, fontWeight: "bold" },
  randomBtn: {
    backgroundColor: "#1E1E2E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  randomBtnText: { color: "#AAA", fontSize: 12, fontWeight: "600" },

  // Bracket Match UI
  exprContainer: {
    backgroundColor: "#12121A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  exprLabel: { color: "#666", fontSize: 11, marginBottom: 10 },
  exprRow: { flexDirection: "row", gap: 8 },
  charBox: {
    width: 32,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    backgroundColor: "#0A0A0F",
    justifyContent: "center",
    alignItems: "center",
  },
  charText: { color: "#9CA3AF", fontSize: 14, fontWeight: "500" },

  // Stack Visualization Box
  visualizationContainer: {
    minHeight: 250,
    backgroundColor: "#12121A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 16,
  },
  stackWrapper: {
    width: 140,
    alignItems: "center",
  },
  stackGlass: {
    width: 120,
    minHeight: 180,
    borderWidth: 3,
    borderColor: "#1E1E2E",
    borderTopWidth: 0, // open at top
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 8,
    gap: 6,
    justifyContent: "flex-end",
    backgroundColor: "#0A0A0F55",
  },
  stackElementContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  topBadge: {
    position: "absolute",
    left: -48,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  topBadgeText: { color: "#FFF", fontSize: 9, fontWeight: "bold" },
  stackElement: {
    width: "100%",
    height: 32,
    borderRadius: 8,
    borderWidth: 1.5,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  stackElementText: { color: "#FFF", fontSize: 13, fontWeight: "bold" },
  emptyText: { color: "#444", fontSize: 12, textAlign: "center", fontStyle: "italic" },

  // Message Panel
  msgPanel: {
    backgroundColor: "#12121A",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 20,
  },
  msgText: { color: "#E0E7FF", fontSize: 14, lineHeight: 22 },

  // Controls Panel
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#12121A",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    marginBottom: 20,
  },
  controlBtns: { flexDirection: "row", alignItems: "center", gap: 10 },
  controlBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#1E1E2E",
    alignItems: "center",
    justifyContent: "center",
  },
  playBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
  },
  speedContainer: { alignItems: "flex-end" },
  speedLabel: { color: "#666", fontSize: 10, marginBottom: 6 },
  speedOptions: { flexDirection: "row", backgroundColor: "#0A0A0F", borderRadius: 8, padding: 3, gap: 4 },
  speedBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  speedBtnText: { color: "#666", fontSize: 10, fontWeight: "bold" },

  // Metrics
  metricsBox: {
    backgroundColor: "#12121A",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  metricTitle: { color: "#FFF", fontSize: 13, fontWeight: "bold", marginBottom: 12 },
  metricRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  metricLabel: { color: "#666", fontSize: 12 },
  metricVal: { color: "#AAA", fontSize: 12, fontWeight: "600" },

  // Learn Tab content
  learnSection: { padding: 20 },
  learnHeading: { fontSize: 18, fontWeight: "bold", color: "#FFF", marginTop: 20, marginBottom: 10 },
  learnText: { color: "#AAA", fontSize: 14, lineHeight: 22 },
  complexityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 20,
    overflow: "hidden",
  },
  complexityCell: {
    width: "50%",
    padding: 16,
    backgroundColor: "#12121A",
    borderWidth: 0.5,
    borderColor: "#1E1E2E",
    alignItems: "center",
  },
  complexityTitle: { color: "#555", fontSize: 11, fontWeight: "bold", marginBottom: 4 },
  complexityVal: { color: "#FFF", fontSize: 15, fontWeight: "bold" },
  pointRow: { flexDirection: "row", gap: 10, marginBottom: 8, paddingLeft: 6 },
  pointMarker: { fontSize: 16, fontWeight: "bold" },
  pointText: { color: "#9CA3AF", fontSize: 13, flex: 1, lineHeight: 18 },

  customInputCard: {
    backgroundColor: "rgba(249, 115, 22, 0.08)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(249, 115, 22, 0.3)",
    marginBottom: 16,
  },
  customInputTitle: { color: "#F97316", fontSize: 13, fontWeight: "bold", marginBottom: 8 },

  // Code Tab content
  codeSection: { padding: 20 },
  langSelector: { flexDirection: "row", gap: 16, borderBottomWidth: 1, borderBottomColor: "#1E1E2E", paddingBottom: 8, marginBottom: 16 },
  langTab: { paddingBottom: 6 },
  langText: { color: "#666", fontWeight: "600", fontSize: 14 },
  codeScroller: { backgroundColor: "#12121A", borderRadius: 12, borderWidth: 1, borderColor: "#1E1E2E", padding: 16 },
  codeBlock: { minWidth: 320 },
  codeTextContent: { color: "#F97316", fontFamily: "monospace", fontSize: 12, lineHeight: 20 },
});

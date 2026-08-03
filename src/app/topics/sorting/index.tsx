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

import { sortingDescriptions } from "./description";
import { sortingCodeSnippets } from "./code";
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateMergeSortSteps,
  generateQuickSortSteps,
  Step,
} from "./visualizer";

const { width } = Dimensions.get("window");
const DEFAULT_ARRAY = [64, 34, 25, 12, 22, 11, 90];

export default function SortingScreen() {
  useEffect(() => {
    recordStudySession("Sorting");
  }, []);

  const { algo } = useLocalSearchParams<{ algo?: string }>();
  const [selectedAlgo, setSelectedAlgo] = useState(algo || "Bubble Sort");
  const [array, setArray] = useState<number[]>(DEFAULT_ARRAY);
  const [customArrayText, setCustomArrayText] = useState("64, 34, 25, 12, 22, 11, 90");

  const applyCustomArray = () => {
    const parsed = customArrayText
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    if (parsed.length > 0) {
      setArray(parsed);
      setIsPlaying(false);
      setCurrentStepIndex(0);
    }
  };

  // Animation states
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);

  // Tabs: 'visualize' | 'learn' | 'code'
  const [activeTab, setActiveTab] = useState<"visualize" | "learn" | "code">(
    "visualize"
  );
  const [activeLang, setActiveLang] = useState<"python" | "java" | "cpp">(
    "python"
  );

  // Input states
  const [customInput, setCustomInput] = useState("64,34,25,12,22,11,90");

  const colors = {
    primary: "#6C63FF", // Sorting Purple
    success: "#10B981", // Green
    warning: "#FFB347", // Yellow
    error: "#FF6B6B", // Red
    bg: "#0A0A0F",
    cardBg: "#12121A",
    border: "#1E1E2E",
  };

  const rebuildSteps = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);

    if (selectedAlgo === "Bubble Sort") {
      setSteps(generateBubbleSortSteps(array));
    } else if (selectedAlgo === "Selection Sort") {
      setSteps(generateSelectionSortSteps(array));
    } else if (selectedAlgo === "Insertion Sort") {
      setSteps(generateInsertionSortSteps(array));
    } else if (selectedAlgo === "Merge Sort") {
      setSteps(generateMergeSortSteps(array));
    } else if (selectedAlgo === "Quick Sort") {
      setSteps(generateQuickSortSteps(array));
    }
  };

  useEffect(() => {
    rebuildSteps();
  }, [selectedAlgo, array]);

  // Handle timer
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

  const applyCustomValues = () => {
    if (customInput.trim()) {
      const vals = customInput
        .split(",")
        .map((v) => parseInt(v.trim()))
        .filter((v) => !isNaN(v) && v > 0 && v <= 100);
      if (vals.length >= 3 && vals.length <= 10) {
        setArray(vals);
      }
    }
  };

  const generateNewRandomArray = () => {
    const size = Math.floor(Math.random() * 4) + 6; // 6 to 9 elements
    const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 85) + 10);
    setArray(newArr);
    setCustomInput(newArr.join(","));
  };

  const currentStep: Step = steps[currentStepIndex] || {
    array: array,
    activeIndices: [],
    pointers: {},
    message: "Initializing visualizer...",
  };

  const info = sortingDescriptions[selectedAlgo] || sortingDescriptions["Bubble Sort"];
  const codeSnippet = sortingCodeSnippets[selectedAlgo] || sortingCodeSnippets["Bubble Sort"];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>{selectedAlgo}</Text>
        <Text style={styles.subtitle}>Array Sorting visualizer</Text>
      </View>

      {/* Tabs */}
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
          {/* Pills */}
          <View style={styles.algoPills}>
            {Object.keys(sortingDescriptions).map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.pill,
                  selectedAlgo === key && {
                    backgroundColor: colors.primary + "33",
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => setSelectedAlgo(key)}
              >
                <Text style={[styles.pillText, selectedAlgo === key && { color: "#FFF" }]}>
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CUSTOM ARRAY TO SORT CARD */}
          <View style={styles.customInputCard}>
            <Text style={styles.customInputTitle}>User Custom Array to Sort</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Unsorted Comma-separated Numbers:</Text>
                <TextInput
                  style={styles.textInput}
                  value={customArrayText}
                  onChangeText={setCustomArrayText}
                  placeholder="e.g. 64, 34, 25, 12, 22, 11, 90"
                  placeholderTextColor="#555"
                />
              </View>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={applyCustomArray}>
                <Text style={styles.actionBtnText}>Set Array</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Inputs */}
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Custom Array (comma-separated, max 10 values):</Text>
                <TextInput
                  style={styles.textInput}
                  value={customInput}
                  onChangeText={setCustomInput}
                  placeholder="e.g. 50,20,40,10,30"
                  placeholderTextColor="#444"
                />
              </View>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={applyCustomValues}>
                <Text style={styles.actionBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.actionRowRight}>
              <TouchableOpacity style={styles.randomBtn} onPress={generateNewRandomArray}>
                <Text style={styles.randomBtnText}>🎲 Randomize Values</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Visualizer chart */}
          <View style={styles.visualizationContainer}>
            <View style={styles.chartWrapper}>
              {currentStep.array?.map((val, idx) => {
                const isActive = currentStep.activeIndices?.includes(idx);
                const isSwapped = currentStep.swappedIndices?.includes(idx);
                const isPivot = idx === currentStep.pointers?.pivotIdx;
                
                let barColor = "#374151"; // Default gray

                if (isPivot) {
                  barColor = colors.warning; // Yellow for pivot
                } else if (isSwapped) {
                  barColor = colors.success; // Green for swapped
                } else if (isActive) {
                  barColor = colors.error; // Red for active compare
                }

                // Make height proportional to value (max 100 values -> max 180 height)
                const barHeight = Math.max(25, (val / 100) * 160);

                return (
                  <View key={idx} style={styles.barColumn}>
                    {/* Value text above bar */}
                    <Text style={[styles.barValText, isActive && { color: colors.error, fontWeight: "bold" }]}>
                      {val === 0 ? "" : val}
                    </Text>

                    {/* Bar element */}
                    <View
                      style={[
                        styles.bar,
                        {
                          height: barHeight,
                          backgroundColor: barColor,
                        },
                      ]}
                    />

                    {/* index badge at bottom */}
                    <Text style={styles.indexLabel}>[{idx}]</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Message Panel */}
          <View style={[styles.msgPanel, { borderColor: colors.primary + "33" }]}>
            <Text style={styles.msgText}>{currentStep.message}</Text>
          </View>

          {/* Controls Panel */}
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

          {/* Metrics */}
          <View style={styles.metricsBox}>
            <Text style={styles.metricTitle}>Algorithm Diagnostics</Text>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Total Steps Recorded:</Text>
              <Text style={styles.metricVal}>{steps.length}</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Current Step Progress:</Text>
              <Text style={styles.metricVal}>{currentStepIndex + 1}</Text>
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
              <Text style={styles.complexityTitle}>Best Time</Text>
              <Text style={[styles.complexityVal, { color: colors.success }]}>{info.best}</Text>
            </View>
            <View style={styles.complexityCell}>
              <Text style={styles.complexityTitle}>Average Time</Text>
              <Text style={[styles.complexityVal, { color: "#FFB347" }]}>{info.average}</Text>
            </View>
            <View style={styles.complexityCell}>
              <Text style={styles.complexityTitle}>Worst Time</Text>
              <Text style={[styles.complexityVal, { color: "#FF6B6B" }]}>{info.worst}</Text>
            </View>
            <View style={styles.complexityCell}>
              <Text style={styles.complexityTitle}>Aux Space</Text>
              <Text style={styles.complexityVal}>{info.space}</Text>
            </View>
          </View>

          <Text style={styles.learnHeading}>Operational Details</Text>
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
  actionRowRight: { marginTop: 12, alignItems: "flex-end" },
  randomBtn: {
    backgroundColor: "#1E1E2E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  randomBtnText: { color: "#AAA", fontSize: 12, fontWeight: "600" },

  // Visualizer Layout
  visualizationContainer: {
    height: 250,
    backgroundColor: "#12121A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    justifyContent: "flex-end",
    paddingBottom: 16,
    marginBottom: 16,
  },
  chartWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    gap: 8,
  },
  barColumn: {
    alignItems: "center",
    width: 32,
  },
  barValText: {
    color: "#888",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 6,
  },
  bar: {
    width: "100%",
    borderRadius: 4,
    backgroundColor: "#3B82F6",
  },
  indexLabel: { color: "#444", fontSize: 9, marginTop: 8, fontWeight: "bold" },

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
    backgroundColor: "rgba(139, 92, 246, 0.08)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    marginBottom: 16,
  },
  customInputTitle: { color: "#8B5CF6", fontSize: 13, fontWeight: "bold", marginBottom: 8 },

  // Code Tab content
  codeSection: { padding: 20 },
  langSelector: { flexDirection: "row", gap: 16, borderBottomWidth: 1, borderBottomColor: "#1E1E2E", paddingBottom: 8, marginBottom: 16 },
  langTab: { paddingBottom: 6 },
  langText: { color: "#666", fontWeight: "600", fontSize: 14 },
  codeScroller: { backgroundColor: "#12121A", borderRadius: 12, borderWidth: 1, borderColor: "#1E1E2E", padding: 16 },
  codeBlock: { minWidth: 320 },
  codeTextContent: { color: "#A78BFA", fontFamily: "monospace", fontSize: 12, lineHeight: 20 },
});

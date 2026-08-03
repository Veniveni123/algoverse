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
import Svg, { Line, Polygon } from "react-native-svg";
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

import { linkedListDescriptions } from "./description";
import { linkedListCodeSnippets } from "./code";
import {
  generateListTraversalSteps,
  generateListInsertionSteps,
  generateListDeletionSteps,
  Step,
} from "./visualizer";

const { width } = Dimensions.get("window");
const DEFAULT_LIST = [10, 20, 30, 40];

export default function LinkedListScreen() {
  useEffect(() => {
    recordStudySession("Linked List");
  }, []);

  const { algo } = useLocalSearchParams<{ algo?: string }>();
  const [selectedAlgo, setSelectedAlgo] = useState(algo || "Singly Linked List");
  const [listData, setListData] = useState<number[]>(DEFAULT_LIST);
  const [customListInput, setCustomListInput] = useState("10, 20, 30, 40, 50");

  const buildCustomList = () => {
    const parsed = customListInput
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    if (parsed.length > 0) {
      setListData(parsed);
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
  const [insertValue, setInsertValue] = useState("99");
  const [targetIndex, setTargetIndex] = useState("2");
  const [opType, setOpType] = useState<"traverse" | "insert" | "delete">("traverse");

  const colors = {
    primary: "#8B5CF6", // Linked List Purple
    success: "#10B981",
    accent: "#A78BFA",
    bg: "#0A0A0F",
    cardBg: "#12121A",
    border: "#1E1E2E",
  };

  const rebuildSteps = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);

    if (opType === "traverse") {
      setSteps(generateListTraversalSteps(listData));
    } else if (opType === "insert") {
      const val = parseInt(insertValue) || 99;
      const idx = parseInt(targetIndex) || 0;
      setSteps(generateListInsertionSteps(listData, val, idx));
    } else if (opType === "delete") {
      const idx = parseInt(targetIndex) || 0;
      setSteps(generateListDeletionSteps(listData, idx));
    }
  };

  useEffect(() => {
    rebuildSteps();
  }, [opType, listData]);

  // Handle Play/Pause timer
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

  const applyFinalState = () => {
    const finalStep = steps[steps.length - 1];
    if (finalStep && finalStep.array) {
      setListData(finalStep.array);
    }
  };

  const currentStep: Step = steps[currentStepIndex] || {
    array: listData,
    activeIndices: [],
    pointers: {},
    message: "Initializing visualizer...",
  };

  const info = linkedListDescriptions[selectedAlgo] || linkedListDescriptions["Singly Linked List"];
  const codeSnippet = linkedListCodeSnippets[selectedAlgo] || linkedListCodeSnippets["Singly Linked List"];

  const generateRandomList = () => {
    const size = Math.floor(Math.random() * 3) + 3; // 3 to 5 elements
    const newArr = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setListData(newArr);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>{selectedAlgo}</Text>
        <Text style={styles.subtitle}>Linked Node Visualizer</Text>
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
          {/* Pills for selection */}
          <View style={styles.algoPills}>
            {Object.keys(linkedListDescriptions).map((key) => (
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

          {/* CUSTOM LINKED LIST BUILDER CARD */}
          <View style={styles.customInputCard}>
            <Text style={styles.customInputTitle}>User Custom Linked List Builder</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Initial Node Values (comma-separated):</Text>
                <TextInput
                  style={styles.textInput}
                  value={customListInput}
                  onChangeText={setCustomListInput}
                  placeholder="e.g. 10, 20, 30, 40, 50"
                  placeholderTextColor="#555"
                />
              </View>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={buildCustomList}>
                <Text style={styles.actionBtnText}>Set List</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Operation selector and Inputs */}
          <View style={styles.inputContainer}>
            <View style={styles.opSelection}>
              <Text style={styles.inputLabel}>Select List Operation:</Text>
              <View style={styles.opBtnRow}>
                {(["traverse", "insert", "delete"] as const).map((op) => (
                  <TouchableOpacity
                    key={op}
                    style={[
                      styles.opBtn,
                      opType === op && {
                        backgroundColor: colors.primary + "22",
                        borderColor: colors.primary,
                      },
                    ]}
                    onPress={() => setOpType(op)}
                  >
                    <Text style={[styles.opBtnText, opType === op && { color: "#FFF" }]}>
                      {op.charAt(0).toUpperCase() + op.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {opType === "insert" && (
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Value:</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={insertValue}
                    onChangeText={setInsertValue}
                    maxLength={3}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Index (0-{currentStep.array?.length || 0}):</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={targetIndex}
                    onChangeText={setTargetIndex}
                    maxLength={1}
                  />
                </View>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={rebuildSteps}>
                  <Text style={styles.actionBtnText}>Insert</Text>
                </TouchableOpacity>
              </View>
            )}

            {opType === "delete" && (
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Index to Delete:</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={targetIndex}
                    onChangeText={setTargetIndex}
                    maxLength={1}
                  />
                </View>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={rebuildSteps}>
                  <Text style={styles.actionBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}

            {opType === "traverse" && (
              <View style={styles.inputRow}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={rebuildSteps}>
                  <Text style={styles.actionBtnText}>Run Traversal</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.actionRowRight}>
              {currentStepIndex === steps.length - 1 && steps.length > 1 && (
                <TouchableOpacity style={[styles.applyBtn, { borderColor: colors.primary }]} onPress={applyFinalState}>
                  <Text style={[styles.applyBtnText, { color: colors.primary }]}>💾 Apply Changes</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.randomBtn} onPress={generateRandomList}>
                <Text style={styles.randomBtnText}>🎲 Random List</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Visualizing Area */}
          <View style={styles.visualizationContainer}>
            <ScrollView horizontal contentContainerStyle={styles.listWrapper} showsHorizontalScrollIndicator={false}>
              {currentStep.array && currentStep.array.length > 0 ? (
                currentStep.array.map((val, idx) => {
                  const isActive = currentStep.activeIndices?.includes(idx);
                  const isSwapped = currentStep.swappedIndices?.includes(idx);
                  
                  // Collect pointers for this cell
                  const cellPointers = Object.entries(currentStep.pointers || {})
                    .filter(([_, pointerIdx]) => pointerIdx === idx)
                    .map(([name]) => name);

                  const isDoubly = selectedAlgo === "Doubly Linked List";

                  return (
                    <View key={idx} style={styles.listNodeGroup}>
                      {/* Node Box Column */}
                      <View style={styles.nodeColumn}>
                        {/* Pointers badge container */}
                        <View style={styles.pointerContainer}>
                          {cellPointers.map((name) => (
                            <View key={name} style={[styles.pointerBadge, { backgroundColor: colors.primary }]}>
                              <Text style={styles.pointerText}>{name}</Text>
                            </View>
                          ))}
                        </View>

                        {/* Node layout */}
                        <View
                          style={[
                            styles.nodeBox,
                            { borderColor: colors.border },
                            isActive && { borderColor: colors.primary, backgroundColor: colors.primary + "22" },
                            isSwapped && { borderColor: colors.success, backgroundColor: colors.success + "22" },
                          ]}
                        >
                          {/* DLL Prev pointer slot */}
                          {isDoubly && (
                            <View style={[styles.pointerSlot, { borderRightWidth: 1, borderRightColor: colors.border }]} />
                          )}
                          
                          {/* Node data */}
                          <View style={styles.dataSlot}>
                            <Text style={styles.nodeText}>{val}</Text>
                          </View>

                          {/* Next pointer slot */}
                          <View style={[styles.pointerSlot, { borderLeftWidth: 1, borderLeftColor: colors.border }]} />
                        </View>

                        <Text style={styles.indexLabel}>[{idx}]</Text>
                      </View>

                      {/* SVG Link Arrow to next node */}
                      {idx < currentStep.array!.length - 1 && (
                        <View style={styles.arrowContainer}>
                          <Svg width={40} height={20}>
                            {isDoubly ? (
                              // DLL Bidirectional Arrow
                              <>
                                <Line x1="4" y1="6" x2="36" y2="6" stroke={colors.primary} strokeWidth="2" />
                                <Polygon points="36,6 30,2 30,10" fill={colors.primary} />
                                <Line x1="4" y1="14" x2="36" y2="14" stroke={colors.accent} strokeWidth="2" />
                                <Polygon points="4,14 10,10 10,18" fill={colors.accent} />
                              </>
                            ) : (
                              // SLL Single Direction Arrow
                              <>
                                <Line x1="4" y1="10" x2="36" y2="10" stroke={colors.primary} strokeWidth="2" />
                                <Polygon points="36,10 30,6 30,14" fill={colors.primary} />
                              </>
                            )}
                          </Svg>
                        </View>
                      )}

                      {/* Tail Null indicator */}
                      {idx === currentStep.array!.length - 1 && (
                        <View style={styles.arrowContainer}>
                          <Text style={styles.nullText}>⏊ null</Text>
                        </View>
                      )}
                    </View>
                  );
                })
              ) : (
                <Text style={styles.emptyText}>List Empty</Text>
              )}
            </ScrollView>
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

            {/* Speed slider */}
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
            <Text style={styles.metricTitle}>Linked List Metrics</Text>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Total Nodes:</Text>
              <Text style={styles.metricVal}>
                {currentStep.array?.length || 0}
              </Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Nodes Pointer Structure:</Text>
              <Text style={styles.metricVal}>{selectedAlgo === "Doubly Linked List" ? "DLL (prev, next)" : "SLL (next)"}</Text>
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
              <Text style={styles.complexityTitle}>Access / Search</Text>
              <Text style={[styles.complexityVal, { color: "#FF6B6B" }]}>{info.worst}</Text>
            </View>
            <View style={styles.complexityCell}>
              <Text style={styles.complexityTitle}>Insert / Delete (Head)</Text>
              <Text style={[styles.complexityVal, { color: colors.success }]}>{info.best}</Text>
            </View>
            <View style={styles.complexityCell}>
              <Text style={styles.complexityTitle}>Insert / Delete (Mid)</Text>
              <Text style={[styles.complexityVal, { color: "#FF6B6B" }]}>{info.worst}</Text>
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

  // Inputs Panel
  inputContainer: {
    backgroundColor: "#12121A",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    marginBottom: 20,
  },
  opSelection: { marginBottom: 14 },
  opBtnRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  opBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#0A0A0F",
  },
  opBtnText: { color: "#888", fontSize: 12, fontWeight: "bold" },
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

  // Visualization Panel
  visualizationContainer: {
    minHeight: 150,
    backgroundColor: "#12121A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    justifyContent: "center",
    paddingVertical: 20,
    marginBottom: 16,
  },
  listWrapper: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  listNodeGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  nodeColumn: {
    alignItems: "center",
    width: 72,
  },
  pointerContainer: {
    height: 36,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 4,
  },
  pointerBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 2,
  },
  pointerText: { color: "#FFF", fontSize: 8, fontWeight: "bold" },
  nodeBox: {
    width: 68,
    height: 36,
    borderWidth: 2,
    borderRadius: 6,
    flexDirection: "row",
    backgroundColor: "#111",
    overflow: "hidden",
  },
  pointerSlot: {
    flex: 1,
    backgroundColor: "#1e1e2e22",
  },
  dataSlot: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  nodeText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
  indexLabel: { color: "#555", fontSize: 10, marginTop: 6, fontWeight: "600" },
  
  // Link Arrows
  arrowContainer: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  nullText: { color: "#444", fontSize: 10, fontWeight: "bold", fontStyle: "italic" },
  emptyText: { color: "#444", fontSize: 12, fontStyle: "italic", alignSelf: "center" },

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

  // Learn Tab
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
    backgroundColor: "rgba(167, 139, 250, 0.08)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.3)",
    marginBottom: 16,
  },
  customInputTitle: { color: "#A78BFA", fontSize: 13, fontWeight: "bold", marginBottom: 8 },

  // Code Tab
  codeSection: { padding: 20 },
  langSelector: { flexDirection: "row", gap: 16, borderBottomWidth: 1, borderBottomColor: "#1E1E2E", paddingBottom: 8, marginBottom: 16 },
  langTab: { paddingBottom: 6 },
  langText: { color: "#666", fontWeight: "600", fontSize: 14 },
  codeScroller: { backgroundColor: "#12121A", borderRadius: 12, borderWidth: 1, borderColor: "#1E1E2E", padding: 16 },
  codeBlock: { minWidth: 320 },
  codeTextContent: { color: "#A78BFA", fontFamily: "monospace", fontSize: 12, lineHeight: 20 },
});

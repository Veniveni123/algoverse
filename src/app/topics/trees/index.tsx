import { useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useMemo, useState } from "react";
import { recordStudySession } from "@/services/progress.service";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Svg, { Circle, Line, Text as SvgText } from "react-native-svg";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Code as CodeIcon,
  Layers,
  Sparkles,
} from "lucide-react-native";

import { treesDescriptions } from "./description";
import { treesCodeSnippets } from "./code";
import {
  generateBSTInsertSteps,
  generateBSTSearchSteps,
  generateTreeTraversalSteps,
  Step,
} from "./visualizer";

const SVG_HEIGHT = 280;
const NODE_R = 18;

// Colors are constant — defined once outside the component instead of
// recreated as a new object literal on every render.
const COLORS = {
  primary: "#10B981",
  success: "#10B981",
  accent: "#34D399",
  bg: "#0A0A0F",
  cardBg: "#12121A",
  border: "#1E1E2E",
};

// Default initial tree level-order representation (15 elements)
const DEFAULT_TREE = [45, 20, 70, 10, 30, 60, 90, 0, 0, 0, 0, 0, 0, 0, 0];

export default function TreesScreen() {
  // useWindowDimensions is reactive — it re-renders on browser resize and
  // device rotation, unlike Dimensions.get() which only reads the size once.
  const { width: windowWidth } = useWindowDimensions();
  const containerWidth = Math.min(windowWidth - 40, 700);
  const svgWidth = Math.max(340, containerWidth);
  const colors = COLORS;

  // 15 node coordinates across 4 levels (depth 4) — memoized so this isn't
  // recomputed on every render, only when the actual width changes.
  const nodeCoordinates = useMemo(
    () => [
      // Level 0 (1 node)
      { x: svgWidth / 2, y: 30 },

      // Level 1 (2 nodes)
      { x: svgWidth / 4, y: 90 },
      { x: (3 * svgWidth) / 4, y: 90 },

      // Level 2 (4 nodes)
      { x: svgWidth / 8, y: 160 },
      { x: (3 * svgWidth) / 8, y: 160 },
      { x: (5 * svgWidth) / 8, y: 160 },
      { x: (7 * svgWidth) / 8, y: 160 },

      // Level 3 (8 nodes)
      { x: svgWidth / 16, y: 235 },
      { x: (3 * svgWidth) / 16, y: 235 },
      { x: (5 * svgWidth) / 16, y: 235 },
      { x: (7 * svgWidth) / 16, y: 235 },
      { x: (9 * svgWidth) / 16, y: 235 },
      { x: (11 * svgWidth) / 16, y: 235 },
      { x: (13 * svgWidth) / 16, y: 235 },
      { x: (15 * svgWidth) / 16, y: 235 },
    ],
    [svgWidth]
  );

  useEffect(() => {
    recordStudySession("Trees");
  }, []);

  const { algo } = useLocalSearchParams<{ algo?: string }>();
  const [selectedAlgo, setSelectedAlgo] = useState(algo || "Binary Search Tree (BST)");
  const [treeData, setTreeData] = useState<number[]>(DEFAULT_TREE);

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
  const [insertValue, setInsertValue] = useState("25");
  const [searchTarget, setSearchTarget] = useState("60");
  const [customTreeInput, setCustomTreeInput] = useState("45, 20, 70, 10, 30, 60, 90");
  const [opType, setOpType] = useState<"insert" | "search" | "inorder" | "preorder" | "postorder">("insert");

  const rebuildSteps = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);

    if (opType === "insert") {
      const val = parseInt(insertValue) || 25;
      setSteps(generateBSTInsertSteps(treeData, val));
    } else if (opType === "search") {
      const target = parseInt(searchTarget) || 60;
      setSteps(generateBSTSearchSteps(treeData, target));
    } else if (opType === "inorder") {
      setSteps(generateTreeTraversalSteps(treeData, "inorder"));
    } else if (opType === "preorder") {
      setSteps(generateTreeTraversalSteps(treeData, "preorder"));
    } else if (opType === "postorder") {
      setSteps(generateTreeTraversalSteps(treeData, "postorder"));
    }
  };

  useEffect(() => {
    rebuildSteps();
  }, [opType, treeData]);

  // Handle timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        setIsPlaying(false);
        return prev;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length, speed]);

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
      setTreeData(finalStep.array);
    }
  };

  // Build custom tree from comma-separated numbers input
  const buildCustomTree = () => {
    const parsed = customTreeInput
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n) && n > 0);

    if (parsed.length === 0) return;

    // Construct BST level-order array of max size 15
    const newTree = new Array(15).fill(0);
    parsed.forEach((val) => {
      let curr = 0;
      while (curr < 15) {
        if (newTree[curr] === 0) {
          newTree[curr] = val;
          break;
        }
        if (val < newTree[curr]) {
          curr = 2 * curr + 1;
        } else if (val > newTree[curr]) {
          curr = 2 * curr + 2;
        } else {
          break; // duplicate
        }
      }
    });

    setTreeData(newTree);
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const currentStep: Step = steps[currentStepIndex] || {
    array: treeData,
    activeIndices: [],
    pointers: {},
    message: "Choose an operation or enter custom input to visualize...",
  };

  const getVisitedList = () => {
    if (currentStep.message?.includes("Traversed so far: [")) {
      const match = currentStep.message.match(/Traversed so far: \[(.*?)\]/);
      return match ? match[1] : "";
    }
    if (currentStep.message?.includes("Visited nodes sequence: [")) {
      const match = currentStep.message.match(/Visited nodes sequence: \[(.*?)\]/);
      return match ? match[1] : "";
    }
    return "";
  };

  const info = treesDescriptions[selectedAlgo] || treesDescriptions["Binary Search Tree (BST)"];
  const codeSnippet = treesCodeSnippets[selectedAlgo] || treesCodeSnippets["Binary Search Tree (BST)"];

  const resetToDefaultTree = () => {
    setTreeData(DEFAULT_TREE);
    setSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const clearTree = () => {
    setTreeData(new Array(15).fill(0));
    setSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>{selectedAlgo}</Text>
        <Text style={styles.subtitle}>Hierarchical Tree Structures Visualizer (Depth 4 / 15 Nodes Support)</Text>
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
          {/* Algorithm pills */}
          <View style={styles.algoPills}>
            {Object.keys(treesDescriptions).map((key) => (
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
                  if (key === "Inorder Traversal") setOpType("inorder");
                  else if (key === "Preorder Traversal") setOpType("preorder");
                  else if (key === "Postorder Traversal") setOpType("postorder");
                  else if (key === "Binary Search Tree (BST)") setOpType("insert");
                }}
              >
                <Text style={[styles.pillText, selectedAlgo === key && { color: "#FFF" }]}>
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* CUSTOM TREE INPUT PANEL */}
          <View style={styles.customInputCard}>
            <View style={styles.customInputHeader}>
              <Sparkles size={16} color={colors.primary} />
              <Text style={styles.customInputTitle}>User Custom Tree Builder</Text>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Enter comma-separated values:</Text>
                <TextInput
                  style={styles.textInput}
                  value={customTreeInput}
                  onChangeText={setCustomTreeInput}
                  placeholder="e.g. 45, 20, 70, 10, 30, 60, 90"
                  placeholderTextColor="#555"
                />
              </View>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={buildCustomTree}>
                <Text style={styles.actionBtnText}>Build Tree</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Operation Inputs */}
          <View style={styles.inputContainer}>
            {selectedAlgo === "Binary Search Tree (BST)" && (
              <View style={styles.opSelection}>
                <Text style={styles.inputLabel}>BST Operation Mode:</Text>
                <View style={styles.opBtnRow}>
                  <TouchableOpacity
                    style={[styles.opBtn, opType === "insert" && { borderColor: colors.primary, backgroundColor: colors.primary + "11" }]}
                    onPress={() => setOpType("insert")}
                  >
                    <Text style={[styles.opBtnText, opType === "insert" && { color: "#FFF" }]}>Insert Node</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.opBtn, opType === "search" && { borderColor: colors.primary, backgroundColor: colors.primary + "11" }]}
                    onPress={() => setOpType("search")}
                  >
                    <Text style={[styles.opBtnText, opType === "search" && { color: "#FFF" }]}>Search Node</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {opType === "insert" && (
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Value to Insert (BST):</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={insertValue}
                    onChangeText={setInsertValue}
                    maxLength={3}
                  />
                </View>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={rebuildSteps}>
                  <Text style={styles.actionBtnText}>Insert</Text>
                </TouchableOpacity>
              </View>
            )}

            {opType === "search" && (
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Value to Search:</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={searchTarget}
                    onChangeText={setSearchTarget}
                    maxLength={3}
                  />
                </View>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={rebuildSteps}>
                  <Text style={styles.actionBtnText}>Search</Text>
                </TouchableOpacity>
              </View>
            )}

            {["inorder", "preorder", "postorder"].includes(opType) && (
              <View style={styles.inputRow}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={rebuildSteps}>
                  <Text style={styles.actionBtnText}>Run Traversal</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.actionRowRight}>
              {currentStepIndex === steps.length - 1 && steps.length > 1 && opType === "insert" && (
                <TouchableOpacity style={[styles.applyBtn, { borderColor: colors.primary }]} onPress={applyFinalState}>
                  <Text style={[styles.applyBtnText, { color: colors.primary }]}>💾 Save Final Tree</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.randomBtn} onPress={resetToDefaultTree}>
                <Text style={styles.randomBtnText}>↺ Reset Default</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.randomBtn, { backgroundColor: "#DC262622" }]} onPress={clearTree}>
                <Text style={[styles.randomBtnText, { color: "#FFAAAA" }]}>✕ Clear</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Traversal list display */}
          {getVisitedList() !== "" && (
            <View style={styles.traversalListContainer}>
              <Text style={styles.traversalListLabel}>Traversal Path Nodes:</Text>
              <Text style={styles.traversalListText}>[ {getVisitedList()} ]</Text>
            </View>
          )}

          {/* SVG Tree View */}
          <View style={styles.visualizationContainer}>
            <Svg width={svgWidth} height={SVG_HEIGHT}>
              {/* Depth Level Guides */}
              {[
                { depth: 0, y: 35, label: "L0 (Root)" },
                { depth: 1, y: 100, label: "L1" },
                { depth: 2, y: 165, label: "L2" },
                { depth: 3, y: 230, label: "L3 (Leaves)" },
              ].map((lvl) => (
                <Fragment key={`lvl-${lvl.depth}`}>
                  <Line
                    x1={40}
                    y1={lvl.y}
                    x2={svgWidth - 10}
                    y2={lvl.y}
                    stroke="#ffffff12"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <SvgText
                    x={12}
                    y={lvl.y + 3}
                    fill="#4A5568"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {lvl.label}
                  </SvgText>
                </Fragment>
              ))}

              {/* Render lines first so they sit behind nodes */}
              {nodeCoordinates.map((coords, idx) => {
                const val = currentStep.array?.[idx] || 0;
                if (val === 0) return null;

                const leftIdx = 2 * idx + 1;
                const rightIdx = 2 * idx + 2;

                const leftVal = currentStep.array?.[leftIdx] || 0;
                const rightVal = currentStep.array?.[rightIdx] || 0;

                const lines = [];

                if (leftIdx < 15 && leftVal > 0) {
                  const leftCoords = nodeCoordinates[leftIdx];
                  lines.push(
                    <Line
                      key={`l-${idx}`}
                      x1={coords.x}
                      y1={coords.y}
                      x2={leftCoords.x}
                      y2={leftCoords.y}
                      stroke="#3B82F6"
                      strokeWidth="2.5"
                      opacity={0.7}
                    />
                  );
                }

                if (rightIdx < 15 && rightVal > 0) {
                  const rightCoords = nodeCoordinates[rightIdx];
                  lines.push(
                    <Line
                      key={`r-${idx}`}
                      x1={coords.x}
                      y1={coords.y}
                      x2={rightCoords.x}
                      y2={rightCoords.y}
                      stroke="#3B82F6"
                      strokeWidth="2.5"
                      opacity={0.7}
                    />
                  );
                }

                return lines;
              })}

              {/* Render Node Circles */}
              {nodeCoordinates.map((coords, idx) => {
                const val = currentStep.array?.[idx] || 0;
                if (val === 0) return null;

                const isActive = currentStep.activeIndices?.includes(idx);
                const isSwapped = currentStep.swappedIndices?.includes(idx);
                const isCheck = idx === currentStep.pointers?.check;

                let fillColor = "#12121A";
                let strokeColor = "#10B981";

                if (isSwapped) {
                  fillColor = "rgba(16, 185, 129, 0.4)";
                  strokeColor = "#34D399";
                } else if (isActive || isCheck) {
                  fillColor = "rgba(245, 158, 11, 0.4)";
                  strokeColor = "#F59E0B";
                }

                return (
                  <Fragment key={idx}>
                    {/* Concentric Glow Ring for Active/Checked Nodes */}
                    {(isActive || isCheck || isSwapped) && (
                      <Circle
                        cx={coords.x}
                        cy={coords.y}
                        r={NODE_R + 7}
                        fill="transparent"
                        stroke={strokeColor}
                        strokeWidth="1.5"
                        opacity={0.4}
                        strokeDasharray="3 3"
                      />
                    )}
                    <Circle
                      cx={coords.x}
                      cy={coords.y}
                      r={NODE_R}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth="2.5"
                    />
                    <SvgText
                      x={coords.x}
                      y={coords.y + 4}
                      fill="#FFF"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {val.toString()}
                    </SvgText>
                  </Fragment>
                );
              })}
            </Svg>
          </View>

          {/* Message Panel */}
          <View style={[styles.msgPanel, { borderColor: colors.primary + "44" }]}>
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

          {/* Live Tree Diagnostics */}
          <View style={styles.metricsBox}>
            <Text style={styles.metricTitle}>⚡ Live Tree Diagnostics</Text>
            {(() => {
              const activeVals = (currentStep.array || []).filter((v) => v > 0);
              const nodeCount = activeVals.length;
              const rootVal = currentStep.array?.[0] || "None";
              const minVal = activeVals.length ? Math.min(...activeVals) : "N/A";
              const maxVal = activeVals.length ? Math.max(...activeVals) : "N/A";
              return (
                <>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Total Nodes:</Text>
                    <Text style={[styles.metricVal, { color: colors.primary }]}>{nodeCount} Nodes</Text>
                  </View>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Root Node Value:</Text>
                    <Text style={styles.metricVal}>{rootVal}</Text>
                  </View>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Value Range (Min – Max):</Text>
                    <Text style={styles.metricVal}>{minVal} – {maxVal}</Text>
                  </View>
                  <View style={styles.metricRow}>
                    <Text style={styles.metricLabel}>Step Progress:</Text>
                    <Text style={styles.metricVal}>
                      {currentStepIndex + 1} / {steps.length}
                    </Text>
                  </View>
                </>
              );
            })()}
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
              <Text style={styles.complexityTitle}>Search (Balanced)</Text>
              <Text style={[styles.complexityVal, { color: colors.success }]}>{info.best}</Text>
            </View>
            <View style={styles.complexityCell}>
              <Text style={styles.complexityTitle}>Search (Average)</Text>
              <Text style={[styles.complexityVal, { color: colors.success }]}>{info.average}</Text>
            </View>
            <View style={styles.complexityCell}>
              <Text style={styles.complexityTitle}>Search (Skewed)</Text>
              <Text style={[styles.complexityVal, { color: "#FF6B6B" }]}>{info.worst}</Text>
            </View>
            <View style={styles.complexityCell}>
              <Text style={styles.complexityTitle}>Space Complexity</Text>
              <Text style={styles.complexityVal}>{info.space}</Text>
            </View>
          </View>

          <Text style={styles.learnHeading}>Operational Principles</Text>
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

  customInputCard: {
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    marginBottom: 16,
  },
  customInputHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  customInputTitle: { color: "#10B981", fontSize: 13, fontWeight: "bold" },

  inputContainer: {
    backgroundColor: "#12121A",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    marginBottom: 20,
  },
  opSelection: { marginBottom: 12 },
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

  traversalListContainer: {
    backgroundColor: "#12121A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  traversalListLabel: { color: "#666", fontSize: 11, marginBottom: 8 },
  traversalListText: { color: "#10B981", fontSize: 16, fontWeight: "bold" },

  visualizationContainer: {
    height: 280,
    backgroundColor: "#12121A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 16,
  },

  msgPanel: {
    backgroundColor: "#12121A",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 20,
  },
  msgText: { color: "#E0E7FF", fontSize: 14, lineHeight: 22 },

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

  codeSection: { padding: 20 },
  langSelector: { flexDirection: "row", gap: 16, borderBottomWidth: 1, borderBottomColor: "#1E1E2E", paddingBottom: 8, marginBottom: 16 },
  langTab: { paddingBottom: 6 },
  langText: { color: "#666", fontWeight: "600", fontSize: 14 },
  codeScroller: { backgroundColor: "#12121A", borderRadius: 12, borderWidth: 1, borderColor: "#1E1E2E", padding: 16 },
  codeBlock: { minWidth: 320 },
  codeTextContent: { color: "#34D399", fontFamily: "monospace", fontSize: 12, lineHeight: 20 },
});

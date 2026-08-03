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
import Svg, { Circle, Line, Text as SvgText, Path } from "react-native-svg";
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

import { queueDescriptions } from "./description";
import { queueCodeSnippets } from "./code";
import {
  generateEnqueueSteps,
  generateDequeueSteps,
  generateCircularQueueSteps,
  generateDequeSteps,
  Step,
} from "./visualizer";

const { width } = Dimensions.get("window");
const DEFAULT_QUEUE = [20, 50, 80];

// Circular Queue dimensions
const SVG_CENTER = 130;
const CIRCULAR_R = 75;
const NODE_R = 20;

export default function QueueScreen() {
  useEffect(() => {
    recordStudySession("Queue");
  }, []);

  const { algo } = useLocalSearchParams<{ algo?: string }>();
  const [selectedAlgo, setSelectedAlgo] = useState(algo || "Enqueue Operation");
  const [queueData, setQueueData] = useState<number[]>(DEFAULT_QUEUE);

  // Circular Queue states (maintained separately because circular has fixed size array of 6 slots)
  const [circArray, setCircArray] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [circFront, setCircFront] = useState(-1);
  const [circRear, setCircRear] = useState(-1);

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
  const [enqueueValue, setEnqueueValue] = useState("45");
  const [dequeOpType, setDequeOpType] = useState<"insertFront" | "insertRear" | "deleteFront" | "deleteRear">("insertRear");
  const [customQueueInput, setCustomQueueInput] = useState("5, 10, 15, 20, 25");

  const buildCustomQueue = () => {
    const parsed = customQueueInput
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n));
    if (parsed.length > 0) {
      setQueueData(parsed);
      setIsPlaying(false);
      setCurrentStepIndex(0);
    }
  };

  const colors = {
    primary: "#14B8A6", // Queue Teal
    success: "#10B981",
    accent: "#2DD4BF",
    bg: "#0A0A0F",
    cardBg: "#12121A",
    border: "#1E1E2E",
  };

  const rebuildSteps = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);

    if (selectedAlgo === "Enqueue Operation") {
      const val = parseInt(enqueueValue) || 45;
      setSteps(generateEnqueueSteps(queueData, val));
    } else if (selectedAlgo === "Dequeue Operation") {
      setSteps(generateDequeueSteps(queueData));
    } else if (selectedAlgo === "Circular Queue") {
      const val = parseInt(enqueueValue) || 45;
      // Circular queue steps are generated dynamically. We trigger it via buttons below.
    } else if (selectedAlgo === "Deque") {
      const val = parseInt(enqueueValue) || 45;
      setSteps(generateDequeSteps(queueData, dequeOpType, val));
    }
  };

  useEffect(() => {
    rebuildSteps();
  }, [selectedAlgo, queueData]);

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

  // Sync state if step ends
  const applyFinalState = () => {
    const finalStep = steps[steps.length - 1];
    if (finalStep && finalStep.array) {
      setQueueData(finalStep.array);
    }
  };

  // Trigger Circular Queue Operations Directly
  const runCircularOp = (op: "enqueue" | "dequeue") => {
    const val = parseInt(enqueueValue) || 45;
    const { steps: newSteps, newFront, newRear, newArray } = generateCircularQueueSteps(
      circArray,
      circFront,
      circRear,
      op,
      val
    );
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);

    // Save final state values to state immediately after steps run
    setTimeout(() => {
      setCircArray(newArray);
      setCircFront(newFront);
      setCircRear(newRear);
    }, newSteps.length * speed);
  };

  const currentStep: Step = steps[currentStepIndex] || {
    array: queueData,
    activeIndices: [],
    pointers: {},
    message: "Choose an operation or enter input to visualize...",
  };

  const info = queueDescriptions[selectedAlgo] || queueDescriptions["Enqueue Operation"];
  const codeSnippet = queueCodeSnippets[selectedAlgo] || queueCodeSnippets["Enqueue Operation"];

  // Helper to compute node circular coordinates
  const getCircCoordinates = (idx: number) => {
    // 6 cells -> 360 / 6 = 60 degrees each. Subtracting 90 degrees (Math.PI/2) to start at the top.
    const angle = idx * 60 * (Math.PI / 180) - Math.PI / 2;
    const x = SVG_CENTER + CIRCULAR_R * Math.cos(angle);
    const y = SVG_CENTER + CIRCULAR_R * Math.sin(angle);
    return { x, y };
  };

  const generateRandomQueue = () => {
    const size = Math.floor(Math.random() * 3) + 2; // 2 to 4 elements
    const newQueue = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
    setQueueData(newQueue);
  };

  const resetCircularQueue = () => {
    setCircArray([0, 0, 0, 0, 0, 0]);
    setCircFront(-1);
    setCircRear(-1);
    setSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primary }]}>{selectedAlgo}</Text>
        <Text style={styles.subtitle}>Queue FIFO Visualizer</Text>
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
          {/* pills */}
          <View style={styles.algoPills}>
            {Object.keys(queueDescriptions).map((key) => (
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

          {/* CUSTOM QUEUE BUILDER CARD */}
          <View style={styles.customInputCard}>
            <Text style={styles.customInputTitle}>User Custom Queue Builder</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Initial Queue Elements (front to rear):</Text>
                <TextInput
                  style={styles.textInput}
                  value={customQueueInput}
                  onChangeText={setCustomQueueInput}
                  placeholder="e.g. 5, 10, 15, 20, 25"
                  placeholderTextColor="#555"
                />
              </View>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={buildCustomQueue}>
                <Text style={styles.actionBtnText}>Set Queue</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Inputs */}
          <View style={styles.inputContainer}>
            {selectedAlgo !== "Dequeue Operation" && (
              <View style={styles.inputRow}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Value:</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={enqueueValue}
                    onChangeText={setEnqueueValue}
                    maxLength={3}
                  />
                </View>

                {selectedAlgo === "Circular Queue" ? (
                  <View style={styles.btnDoubleRow}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: colors.primary, marginRight: 8 }]}
                      onPress={() => runCircularOp("enqueue")}
                    >
                      <Text style={styles.actionBtnText}>Enqueue</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: "#EA580C" }]}
                      onPress={() => runCircularOp("dequeue")}
                    >
                      <Text style={styles.actionBtnText}>Dequeue</Text>
                    </TouchableOpacity>
                  </View>
                ) : selectedAlgo === "Deque" ? (
                  <View style={styles.dequeActions}>
                    <View style={styles.dequeBtnGroup}>
                      <TouchableOpacity
                        style={[styles.dequeSubBtn, { backgroundColor: colors.primary }]}
                        onPress={() => {
                          setDequeOpType("insertFront");
                          setTimeout(rebuildSteps, 50);
                        }}
                      >
                        <Text style={styles.dequeSubBtnText}>+ Front</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.dequeSubBtn, { backgroundColor: colors.primary }]}
                        onPress={() => {
                          setDequeOpType("insertRear");
                          setTimeout(rebuildSteps, 50);
                        }}
                      >
                        <Text style={styles.dequeSubBtnText}>+ Rear</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.dequeBtnGroup}>
                      <TouchableOpacity
                        style={[styles.dequeSubBtn, { backgroundColor: "#DC2626" }]}
                        onPress={() => {
                          setDequeOpType("deleteFront");
                          setTimeout(rebuildSteps, 50);
                        }}
                      >
                        <Text style={styles.dequeSubBtnText}>- Front</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.dequeSubBtn, { backgroundColor: "#DC2626" }]}
                        onPress={() => {
                          setDequeOpType("deleteRear");
                          setTimeout(rebuildSteps, 50);
                        }}
                      >
                        <Text style={styles.dequeSubBtnText}>- Rear</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                    onPress={rebuildSteps}
                  >
                    <Text style={styles.actionBtnText}>Enqueue</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {selectedAlgo === "Dequeue Operation" && (
              <View style={styles.inputRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                  onPress={rebuildSteps}
                >
                  <Text style={styles.actionBtnText}>Dequeue Front</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Apply / Reset actions */}
            <View style={styles.actionRowRight}>
              {selectedAlgo === "Circular Queue" ? (
                <TouchableOpacity style={styles.randomBtn} onPress={resetCircularQueue}>
                  <Text style={styles.randomBtnText}>↺ Reset Ring</Text>
                </TouchableOpacity>
              ) : (
                <>
                  {currentStepIndex === steps.length - 1 && steps.length > 1 && (
                    <TouchableOpacity style={[styles.applyBtn, { borderColor: colors.primary }]} onPress={applyFinalState}>
                      <Text style={[styles.applyBtnText, { color: colors.primary }]}>💾 Apply Changes</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.randomBtn} onPress={generateRandomQueue}>
                    <Text style={styles.randomBtnText}>🎲 Reset Queue</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* Visualizing Area */}
          <View style={styles.visualizationContainer}>
            {selectedAlgo === "Circular Queue" ? (
              // Circular ring rendering via SVG
              <View style={styles.svgWrapper}>
                <Svg width={260} height={260}>
                  {/* Connecting ring lines */}
                  {Array.from({ length: 6 }).map((_, idx) => {
                    const from = getCircCoordinates(idx);
                    const to = getCircCoordinates((idx + 1) % 6);
                    return (
                      <Line
                        key={idx}
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        stroke="#1E1E2E"
                        strokeWidth="3"
                      />
                    );
                  })}

                  {/* Circular slots */}
                  {Array.from({ length: 6 }).map((_, idx) => {
                    const { x, y } = getCircCoordinates(idx);
                    const val = currentStep.array?.[idx] || 0;
                    
                    const isFront = currentStep.pointers?.front === idx;
                    const isRear = currentStep.pointers?.rear === idx;
                    const isActive = currentStep.activeIndices?.includes(idx);
                    const isSwapped = currentStep.swappedIndices?.includes(idx);

                    let fillColor = "#111";
                    let strokeColor = "#1E1E2E";

                    if (isActive) {
                      fillColor = colors.primary + "33";
                      strokeColor = colors.primary;
                    } else if (isSwapped) {
                      fillColor = colors.success + "33";
                      strokeColor = colors.success;
                    } else if (val > 0) {
                      fillColor = "#1A1A2E";
                    }

                    return (
                      <View key={idx}>
                        <Circle
                          cx={x}
                          cy={y}
                          r={NODE_R}
                          fill={fillColor}
                          stroke={strokeColor}
                          strokeWidth="2.5"
                        />
                        <SvgText
                          x={x}
                          y={y + 5}
                          fill={val > 0 ? "#FFF" : "#444"}
                          fontSize="13"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {val > 0 ? val.toString() : "-"}
                        </SvgText>
                        
                        {/* Render indices at the outer boundary */}
                        <SvgText
                          x={x + (x > SVG_CENTER ? 24 : -24)}
                          y={y + 4}
                          fill="#555"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {idx}
                        </SvgText>

                        {/* Labels for Front / Rear */}
                        {isFront && (
                          <SvgText
                            x={x}
                            y={y - 25}
                            fill={colors.success}
                            fontSize="9"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            F
                          </SvgText>
                        )}
                        {isRear && (
                          <SvgText
                            x={x}
                            y={y + 32}
                            fill={colors.primary}
                            fontSize="9"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            R
                          </SvgText>
                        )}
                      </View>
                    );
                  })}
                </Svg>
              </View>
            ) : (
              // Conveyor Belt Queue (Linear / Deque)
              <View style={styles.linearWrapper}>
                <View style={styles.conveyorBelt}>
                  <ScrollView horizontal contentContainerStyle={styles.beltContent} showsHorizontalScrollIndicator={false}>
                    {currentStep.array && currentStep.array.length > 0 ? (
                      currentStep.array.map((val, idx) => {
                        const isFront = idx === currentStep.pointers?.front;
                        const isRear = idx === currentStep.pointers?.rear;
                        const isActive = currentStep.activeIndices?.includes(idx);
                        const isSwapped = currentStep.swappedIndices?.includes(idx);

                        return (
                          <View key={idx} style={styles.nodeColumn}>
                            {/* Top badge pointer */}
                            <View style={styles.pointerContainer}>
                              {isFront && (
                                <View style={[styles.pointerBadge, { backgroundColor: colors.success }]}>
                                  <Text style={styles.pointerText}>FRONT</Text>
                                </View>
                              )}
                              {isRear && (
                                <View style={[styles.pointerBadge, { backgroundColor: colors.primary }]}>
                                  <Text style={styles.pointerText}>REAR</Text>
                                </View>
                              )}
                            </View>

                            {/* Node box */}
                            <View
                              style={[
                                styles.node,
                                { borderColor: colors.border },
                                isActive && { borderColor: colors.primary, backgroundColor: colors.primary + "22" },
                                isSwapped && { borderColor: colors.success, backgroundColor: colors.success + "22" },
                              ]}
                            >
                              <Text style={styles.nodeVal}>{val}</Text>
                            </View>

                            <Text style={styles.indexLabel}>idx: {idx}</Text>
                          </View>
                        );
                      })
                    ) : (
                      <Text style={styles.emptyText}>Queue Empty</Text>
                    )}
                  </ScrollView>
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
            <Text style={styles.metricTitle}>Queue Diagnostics</Text>
            {selectedAlgo === "Circular Queue" ? (
              <>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Front Pointer:</Text>
                  <Text style={styles.metricVal}>{circFront}</Text>
                </View>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Rear Pointer:</Text>
                  <Text style={styles.metricVal}>{circRear}</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Front Pointer index:</Text>
                  <Text style={styles.metricVal}>
                    {currentStep.pointers?.front !== undefined ? currentStep.pointers.front : "-"}
                  </Text>
                </View>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Rear Pointer index:</Text>
                  <Text style={styles.metricVal}>
                    {currentStep.pointers?.rear !== undefined ? currentStep.pointers.rear : "-"}
                  </Text>
                </View>
              </>
            )}
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Limit capacity:</Text>
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
              <Text style={styles.complexityTitle}>Enqueue</Text>
              <Text style={[styles.complexityVal, { color: colors.success }]}>{info.best}</Text>
            </View>
            <View style={styles.complexityCell}>
              <Text style={styles.complexityTitle}>Dequeue</Text>
              <Text style={[styles.complexityVal, { color: colors.success }]}>{info.average}</Text>
            </View>
            <View style={styles.complexityCell}>
              <Text style={styles.complexityTitle}>Complexity (Worst)</Text>
              <Text style={[styles.complexityVal, { color: colors.success }]}>{info.worst}</Text>
            </View>
            <View style={styles.complexityCell}>
              <Text style={styles.complexityTitle}>Space Complexity</Text>
              <Text style={styles.complexityVal}>{info.space}</Text>
            </View>
          </View>

          <Text style={styles.learnHeading}>Key Operational Points</Text>
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

  // Visualize Tab
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
  btnDoubleRow: { flexDirection: "row", flex: 1, justifyContent: "flex-end" },
  
  // Deque specific actions
  dequeActions: { flex: 2, gap: 6 },
  dequeBtnGroup: { flexDirection: "row", gap: 6 },
  dequeSubBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  dequeSubBtnText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
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
    minHeight: 250,
    backgroundColor: "#12121A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 16,
    overflow: "hidden",
  },
  
  // Circular SVGs
  svgWrapper: {
    width: 260,
    height: 260,
    justifyContent: "center",
    alignItems: "center",
  },

  // Conveyor styling
  linearWrapper: {
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  conveyorBelt: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#1E1E2E",
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingVertical: 20,
    backgroundColor: "#0A0A0F44",
  },
  beltContent: {
    gap: 16,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  nodeColumn: {
    alignItems: "center",
    width: 60,
  },
  pointerContainer: {
    height: 24,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 4,
  },
  pointerBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pointerText: { color: "#FFF", fontSize: 7, fontWeight: "bold" },
  node: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 2.5,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  nodeVal: { color: "#FFF", fontSize: 15, fontWeight: "bold" },
  indexLabel: { color: "#555", fontSize: 9, marginTop: 6, fontWeight: "600" },
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
    backgroundColor: "rgba(20, 184, 166, 0.08)",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(20, 184, 166, 0.3)",
    marginBottom: 16,
  },
  customInputTitle: { color: "#14B8A6", fontSize: 13, fontWeight: "bold", marginBottom: 8 },

  // Code Tab
  codeSection: { padding: 20 },
  langSelector: { flexDirection: "row", gap: 16, borderBottomWidth: 1, borderBottomColor: "#1E1E2E", paddingBottom: 8, marginBottom: 16 },
  langTab: { paddingBottom: 6 },
  langText: { color: "#666", fontWeight: "600", fontSize: 14 },
  codeScroller: { backgroundColor: "#12121A", borderRadius: 12, borderWidth: 1, borderColor: "#1E1E2E", padding: 16 },
  codeBlock: { minWidth: 320 },
  codeTextContent: { color: "#14B8A6", fontFamily: "monospace", fontSize: 12, lineHeight: 20 },
});

import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { recordStudySession } from "@/services/progress.service";
import {
  ScrollView,
  StyleSheet,
  Text,
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
} from "lucide-react-native";

import { graphDescriptions } from "./description";
import { graphCodeSnippets } from "./code";
import {
  GraphStep,
  DEMO_GRAPH,
  NODE_POSITIONS,
  generateBFSSteps,
  generateDFSSteps,
  generateGraphRepresentationSteps,
} from "./visualizer";

const ALGOS = ["BFS", "DFS", "Graph Representation"];

const COLORS = {
  primary: "#F59E0B",     // Amber — graph color
  success: "#10B981",
  active: "#EF4444",
  visited: "#6C63FF",
  edge: "#374151",
  activeEdge: "#F59E0B",
  visitedEdge: "#6C63FF",
  nodeBg: "#1A2332",
  nodeText: "#FFF",
  bg: "#0A0A0F",
  cardBg: "#12121A",
  border: "#475569",
};

// ─── SVG Graph Renderer ───────────────────────────────────────
function GraphCanvas({ step }: { step: GraphStep }) {
  const { width } = useWindowDimensions();
  const containerWidth = Math.min(width - 40, 650);
  const svgWidth = Math.max(300, containerWidth);
  const svgHeight = 280;
  const nodeRadius = 22;

  // Scale positions to fit SVG bounded area perfectly on both mobile & desktop
  const paddingX = 45;
  const paddingY = 40;
  const scaleX = (svgWidth - paddingX * 2) / (240 - 30);
  const scaleY = (svgHeight - paddingY * 2) / (220 - 40);

  const scaledPos = Object.fromEntries(
    Object.entries(NODE_POSITIONS).map(([k, v]) => [
      k,
      {
        x: paddingX + (v.x - 30) * scaleX,
        y: paddingY + (v.y - 40) * scaleY,
      },
    ])
  );

  const allEdges: [number, number][] = [];
  for (const node of Object.keys(DEMO_GRAPH).map(Number)) {
    for (const nb of DEMO_GRAPH[node]) {
      if (node < nb) allEdges.push([node, nb]);
    }
  }

  const isActiveEdge = (u: number, v: number) =>
    step.activeEdges.some(
      ([a, b]) => (a === u && b === v) || (a === v && b === u)
    );

  const isVisitedEdge = (u: number, v: number) =>
    step.visitedEdges.some(
      ([a, b]) => (a === u && b === v) || (a === v && b === u)
    );

  return (
    <View style={styles.svgContainer}>
      <Svg width={svgWidth} height={svgHeight}>
        {/* Edges */}
        {allEdges.map(([u, v]) => {
          const pu = scaledPos[u];
          const pv = scaledPos[v];
          let strokeColor = COLORS.edge;
          let strokeWidth = 2;

          if (isActiveEdge(u, v)) {
            strokeColor = COLORS.activeEdge;
            strokeWidth = 3;
          } else if (isVisitedEdge(u, v)) {
            strokeColor = COLORS.visitedEdge;
            strokeWidth = 2.5;
          }

          return (
            <Line
              key={`edge-${u}-${v}`}
              x1={pu.x}
              y1={pu.y}
              x2={pv.x}
              y2={pv.y}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          );
        })}

        {/* Nodes */}
        {Object.keys(DEMO_GRAPH).map(Number).map((node) => {
          const pos = scaledPos[node];
          const isActive = step.activeNodes.includes(node);
          const isVisited = step.visitedNodes.includes(node);

          let fill = COLORS.nodeBg;
          let stroke = COLORS.border;
          let strokeWidth = 2;

          if (isActive) {
            fill = COLORS.active;
            stroke = COLORS.active;
            strokeWidth = 3;
          } else if (isVisited) {
            fill = COLORS.visited;
            stroke = COLORS.visited;
            strokeWidth = 2;
          }

          return (
            <React.Fragment key={`node-${node}`}>
              {isActive && (
                <Circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius + 7}
                  fill="transparent"
                  stroke={COLORS.active}
                  strokeWidth={2}
                  opacity={0.6}
                  strokeDasharray="3 3"
                />
              )}
              <Circle
                cx={pos.x}
                cy={pos.y}
                r={nodeRadius}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
              />
              <SvgText
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                fill={COLORS.nodeText}
                fontSize={14}
                fontWeight="bold"
              >
                {node}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

// ─── Queue / Stack Display ────────────────────────────────────
function QueueStackDisplay({
  items,
  label,
  color,
}: {
  items: number[];
  label: string;
  color: string;
}) {
  return (
    <View style={styles.qsContainer}>
      <Text style={styles.qsLabel}>{label}:</Text>
      <View style={styles.qsRow}>
        {items.length === 0 ? (
          <Text style={styles.qsEmpty}>[ empty ]</Text>
        ) : (
          items.map((item, idx) => (
            <View
              key={idx}
              style={[styles.qsItem, { borderColor: color, backgroundColor: color + "22" }]}
            >
              <Text style={[styles.qsItemText, { color }]}>{item}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

// ─── Legend ──────────────────────────────────────────────────
function Legend() {
  return (
    <View style={styles.legend}>
      {[
        { color: COLORS.active, label: "Current" },
        { color: COLORS.visited, label: "Visited" },
        { color: COLORS.edge, label: "Unvisited Edge" },
        { color: COLORS.activeEdge, label: "Active Edge" },
      ].map(({ color, label }) => (
        <View key={label} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: color }]} />
          <Text style={styles.legendText}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────
import React from "react";

export default function GraphsScreen() {
  useEffect(() => {
    recordStudySession("Graph");
  }, []);

  const { algo } = useLocalSearchParams<{ algo?: string }>();
  const [selectedAlgo, setSelectedAlgo] = useState(algo || "BFS");
  const [startNode, setStartNode] = useState<number>(0);

  const [steps, setSteps] = useState<GraphStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);

  const [activeTab, setActiveTab] = useState<"visualize" | "learn" | "code">(
    "visualize"
  );
  const [activeLang, setActiveLang] = useState<"python" | "java" | "cpp">(
    "python"
  );

  const rebuildSteps = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    if (selectedAlgo === "BFS") {
      setSteps(generateBFSSteps(DEMO_GRAPH, startNode));
    } else if (selectedAlgo === "DFS") {
      setSteps(generateDFSSteps(DEMO_GRAPH, startNode));
    } else {
      setSteps(generateGraphRepresentationSteps(DEMO_GRAPH));
    }
  };

  useEffect(() => {
    rebuildSteps();
  }, [selectedAlgo, startNode]);

  // Auto-play timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          setIsPlaying(false);
          return prev;
        });
      }, speed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
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
    if (currentStepIndex < steps.length - 1)
      setCurrentStepIndex(currentStepIndex + 1);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const currentStep: GraphStep = steps[currentStepIndex] || {
    activeNodes: [],
    visitedNodes: [],
    activeEdges: [],
    visitedEdges: [],
    queueOrStack: [],
    message: "Initializing...",
  };

  const info = graphDescriptions[selectedAlgo] || graphDescriptions["BFS"];
  const codeSnippet =
    graphCodeSnippets[selectedAlgo] || graphCodeSnippets["BFS"];
  const queueLabel = selectedAlgo === "BFS" ? "Queue" : selectedAlgo === "DFS" ? "Stack" : "Neighbors";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: COLORS.primary }]}>
          {selectedAlgo}
        </Text>
        <Text style={styles.subtitle}>Graph Algorithm Visualizer</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(["visualize", "learn", "code"] as const).map((tab) => {
          const icons = { visualize: Layers, learn: BookOpen, code: CodeIcon };
          const Icon = icons[tab];
          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && { backgroundColor: COLORS.primary },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Icon
                size={16}
                color={activeTab === tab ? "#FFF" : "#888"}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── VISUALIZE TAB ── */}
      {activeTab === "visualize" && (
        <View style={styles.contentSection}>
          {/* Algorithm Pills */}
          <View style={styles.algoPills}>
            {ALGOS.map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.pill,
                  selectedAlgo === key && {
                    backgroundColor: COLORS.primary + "33",
                    borderColor: COLORS.primary,
                  },
                ]}
                onPress={() => setSelectedAlgo(key)}
              >
                <Text
                  style={[
                    styles.pillText,
                    selectedAlgo === key && { color: "#FFF" },
                  ]}
                >
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Start Node Selector */}
          {selectedAlgo !== "Graph Representation" && (
            <View style={styles.startNodeCard}>
              <Text style={styles.startNodeLabel}>Select Start Node:</Text>
              <View style={styles.startNodeRow}>
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <TouchableOpacity
                    key={n}
                    style={[
                      styles.startNodeBtn,
                      startNode === n && {
                        backgroundColor: COLORS.primary + "33",
                        borderColor: COLORS.primary,
                      },
                    ]}
                    onPress={() => setStartNode(n)}
                  >
                    <Text
                      style={[
                        styles.startNodeText,
                        startNode === n && { color: "#FFF", fontWeight: "bold" },
                      ]}
                    >
                      Node {n}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Graph Canvas */}
          <View style={styles.canvasCard}>
            <GraphCanvas step={currentStep} />
          </View>

          {/* Legend */}
          <Legend />

          {/* Queue / Stack snapshot */}
          <QueueStackDisplay
            items={currentStep.queueOrStack}
            label={queueLabel}
            color={COLORS.primary}
          />

          {/* Message Panel */}
          <View style={[styles.msgPanel, { borderColor: COLORS.primary + "55" }]}>
            <Text style={styles.msgText}>{currentStep.message}</Text>
          </View>

          {/* Controls */}
          <View style={styles.controlsContainer}>
            <View style={styles.controlBtns}>
              <TouchableOpacity style={styles.controlBtn} onPress={handlePrev}>
                <ChevronLeft size={22} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.controlBtn,
                  styles.playBtn,
                  { backgroundColor: COLORS.primary },
                ]}
                onPress={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause size={22} color="#FFF" fill="#FFF" />
                ) : (
                  <Play size={22} color="#FFF" fill="#FFF" />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlBtn} onPress={handleNext}>
                <ChevronRight size={22} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlBtn} onPress={handleReset}>
                <RotateCcw size={18} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.speedContainer}>
              <Text style={styles.speedLabel}>Speed:</Text>
              <View style={styles.speedOptions}>
                {[1400, 900, 400].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.speedBtn,
                      speed === s && { backgroundColor: COLORS.primary },
                    ]}
                    onPress={() => setSpeed(s)}
                  >
                    <Text
                      style={[
                        styles.speedBtnText,
                        speed === s && { color: "#FFF" },
                      ]}
                    >
                      {s === 1400 ? "0.5x" : s === 900 ? "1x" : "2x"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Metrics */}
          <View style={styles.metricsBox}>
            <Text style={styles.metricTitle}>Graph Diagnostics</Text>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Vertices:</Text>
              <Text style={styles.metricVal}>{Object.keys(DEMO_GRAPH).length}</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Edges:</Text>
              <Text style={styles.metricVal}>5</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Total Steps:</Text>
              <Text style={styles.metricVal}>{steps.length}</Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Step Progress:</Text>
              <Text style={styles.metricVal}>
                {currentStepIndex + 1} / {steps.length}
              </Text>
            </View>
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Nodes Visited:</Text>
              <Text style={[styles.metricVal, { color: COLORS.visited }]}>
                {currentStep.visitedNodes.join(", ") || "—"}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* ── LEARN TAB ── */}
      {activeTab === "learn" && (
        <View style={styles.learnSection}>
          {/* Algorithm selector pills in Learn tab too */}
          <View style={styles.algoPills}>
            {ALGOS.map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.pill,
                  selectedAlgo === key && {
                    backgroundColor: COLORS.primary + "33",
                    borderColor: COLORS.primary,
                  },
                ]}
                onPress={() => setSelectedAlgo(key)}
              >
                <Text
                  style={[
                    styles.pillText,
                    selectedAlgo === key && { color: "#FFF" },
                  ]}
                >
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.learnHeading}>Overview</Text>
          <Text style={styles.learnText}>{info.about}</Text>

          <View style={styles.complexityGrid}>
            {[
              { label: "Best Time", val: info.best, color: COLORS.success },
              { label: "Avg Time", val: info.average, color: "#FFB347" },
              { label: "Worst Time", val: info.worst, color: "#FF6B6B" },
              { label: "Aux Space", val: info.space, color: "#FFF" },
            ].map(({ label, val, color }) => (
              <View key={label} style={styles.complexityCell}>
                <Text style={styles.complexityTitle}>{label}</Text>
                <Text style={[styles.complexityVal, { color }]}>{val}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.learnHeading}>Key Points</Text>
          {info.keypoints.map((pt, idx) => (
            <View key={idx} style={styles.pointRow}>
              <Text style={[styles.pointMarker, { color: COLORS.primary }]}>
                •
              </Text>
              <Text style={styles.pointText}>{pt}</Text>
            </View>
          ))}
        </View>
      )}

      {/* ── CODE TAB ── */}
      {activeTab === "code" && (
        <View style={styles.codeSection}>
          {/* Algorithm selector pills in Code tab too */}
          <View style={styles.algoPills}>
            {ALGOS.map((key) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.pill,
                  selectedAlgo === key && {
                    backgroundColor: COLORS.primary + "33",
                    borderColor: COLORS.primary,
                  },
                ]}
                onPress={() => setSelectedAlgo(key)}
              >
                <Text
                  style={[
                    styles.pillText,
                    selectedAlgo === key && { color: "#FFF" },
                  ]}
                >
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.langSelector}>
            {(["python", "java", "cpp"] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.langTab,
                  activeLang === lang && {
                    borderBottomWidth: 2,
                    borderBottomColor: COLORS.primary,
                  },
                ]}
                onPress={() => setActiveLang(lang)}
              >
                <Text
                  style={[
                    styles.langText,
                    activeLang === lang && { color: "#FFF" },
                  ]}
                >
                  {lang === "cpp"
                    ? "C++"
                    : lang.charAt(0).toUpperCase() + lang.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView
            style={styles.codeScroller}
            horizontal
            showsHorizontalScrollIndicator={true}
          >
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

  // Content
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

  startNodeCard: {
    backgroundColor: "#12121A",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    marginBottom: 14,
  },
  startNodeLabel: { color: "#888", fontSize: 11, fontWeight: "bold", marginBottom: 8 },
  startNodeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  startNodeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    backgroundColor: "#0A0A0F",
  },
  startNodeText: { color: "#888", fontSize: 11 },

  // SVG canvas card
  canvasCard: {
    backgroundColor: "#12121A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    overflow: "hidden",
    marginBottom: 14,
    alignItems: "center",
    paddingVertical: 12,
  },
  svgContainer: { alignItems: "center" },

  // Legend
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: "#888", fontSize: 11 },

  // Queue / Stack display
  qsContainer: {
    backgroundColor: "#12121A",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    marginBottom: 14,
  },
  qsLabel: { color: "#666", fontSize: 11, fontWeight: "bold", marginBottom: 8 },
  qsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  qsEmpty: { color: "#444", fontSize: 13, fontStyle: "italic" },
  qsItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  qsItemText: { fontSize: 14, fontWeight: "bold" },

  // Message panel
  msgPanel: {
    backgroundColor: "#12121A",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  msgText: { color: "#E0E7FF", fontSize: 14, lineHeight: 22 },

  // Controls
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
  playBtn: { width: 46, height: 46, borderRadius: 12 },
  speedContainer: { alignItems: "flex-end" },
  speedLabel: { color: "#666", fontSize: 10, marginBottom: 6 },
  speedOptions: {
    flexDirection: "row",
    backgroundColor: "#0A0A0F",
    borderRadius: 8,
    padding: 3,
    gap: 4,
  },
  speedBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
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

  // Learn tab
  learnSection: { padding: 20 },
  learnHeading: { fontSize: 18, fontWeight: "bold", color: "#FFF", marginTop: 20, marginBottom: 10 },
  learnText: { color: "#AAA", fontSize: 14, lineHeight: 22 },
  complexityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: "#1E1E2E",
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
  complexityVal: { fontSize: 15, fontWeight: "bold" },
  pointRow: { flexDirection: "row", gap: 10, marginBottom: 8, paddingLeft: 6 },
  pointMarker: { fontSize: 16, fontWeight: "bold" },
  pointText: { color: "#9CA3AF", fontSize: 13, flex: 1, lineHeight: 18 },

  // Code tab
  codeSection: { padding: 20 },
  langSelector: {
    flexDirection: "row",
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1E1E2E",
    paddingBottom: 8,
    marginBottom: 16,
  },
  langTab: { paddingBottom: 6 },
  langText: { color: "#666", fontWeight: "600", fontSize: 14 },
  codeScroller: {
    backgroundColor: "#12121A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    padding: 16,
  },
  codeBlock: { minWidth: 320 },
  codeTextContent: {
    color: "#A78BFA",
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 20,
  },
});

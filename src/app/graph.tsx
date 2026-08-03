import React, { Fragment, useState, useEffect } from "react";
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
} from "lucide-react-native";

type Node = { id: string; x: number; y: number; relX: number; relY: number; label: string };
type Edge = { from: string; to: string; weight: number };
type NodeState = "default" | "visiting" | "visited" | "path" | "start" | "end";

const DEFAULT_NODES: Node[] = [
  { id: "A", x: 60, y: 60, relX: 0.15, relY: 0.15, label: "A" },
  { id: "B", x: 200, y: 40, relX: 0.52, relY: 0.10, label: "B" },
  { id: "C", x: 320, y: 80, relX: 0.88, relY: 0.22, label: "C" },
  { id: "D", x: 80, y: 180, relX: 0.20, relY: 0.50, label: "D" },
  { id: "E", x: 220, y: 160, relX: 0.58, relY: 0.45, label: "E" },
  { id: "F", x: 330, y: 220, relX: 0.90, relY: 0.65, label: "F" },
  { id: "G", x: 120, y: 280, relX: 0.30, relY: 0.88, label: "G" },
  { id: "H", x: 260, y: 290, relX: 0.72, relY: 0.90, label: "H" },
];

const DEFAULT_EDGES: Edge[] = [
  { from: "A", to: "B", weight: 4 },
  { from: "A", to: "D", weight: 2 },
  { from: "B", to: "C", weight: 3 },
  { from: "B", to: "E", weight: 5 },
  { from: "C", to: "F", weight: 2 },
  { from: "D", to: "E", weight: 6 },
  { from: "D", to: "G", weight: 3 },
  { from: "E", to: "F", weight: 1 },
  { from: "E", to: "H", weight: 4 },
  { from: "F", to: "H", weight: 3 },
  { from: "G", to: "H", weight: 5 },
];

const algoInfo = {
  Dijkstra: {
    color: "#00D4AA",
    desc: "Finds shortest path from source to all nodes by always picking the unvisited node with smallest known distance. Guaranteed optimal for non-negative weights.",
  },
  BFS: {
    color: "#6C63FF",
    desc: "Explores neighbors level by level. Finds shortest path in terms of number of edges (unweighted). Uses a queue.",
  },
  DFS: {
    color: "#FF6B6B",
    desc: "Explores as deep as possible before backtracking. Uses a stack. Does not guarantee shortest path but useful for connectivity.",
  },
};

export default function GraphScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const [nodes, setNodes] = useState<Node[]>(DEFAULT_NODES);
  const [edges, setEdges] = useState<Edge[]>(DEFAULT_EDGES);
  const [nodeStates, setNodeStates] = useState<Record<string, NodeState>>({});
  const [edgeHighlight, setEdgeHighlight] = useState<string[]>([]);
  const [distances, setDistances] = useState<Record<string, number>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAlgo, setSelectedAlgo] = useState("Dijkstra");
  const [startNode, setStartNode] = useState("A");
  const [endNode, setEndNode] = useState("H");
  const [currentStep, setCurrentStep] = useState("");
  const [activeTab, setActiveTab] = useState<"visualize" | "edit" | "learn">(
    "visualize",
  );
  const [showAddEdge, setShowAddEdge] = useState(false);
  const [newEdgeFrom, setNewEdgeFrom] = useState("");
  const [newEdgeTo, setNewEdgeTo] = useState("");
  const [newEdgeWeight, setNewEdgeWeight] = useState("");
  const [pathNodes, setPathNodes] = useState<string[]>([]);
  const [totalCost, setTotalCost] = useState<number | null>(null);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const info = algoInfo[selectedAlgo as keyof typeof algoInfo];

  const reset = () => {
    setNodeStates({});
    setEdgeHighlight([]);
    setDistances({});
    setCurrentStep("");
    setPathNodes([]);
    setTotalCost(null);
    setIsRunning(false);
  };

  const resetToDefault = () => {
    setNodes(DEFAULT_NODES);
    setEdges(DEFAULT_EDGES);
    reset();
  };

  const getNeighbors = (nodeId: string) => {
    return edges
      .filter((e) => e.from === nodeId || e.to === nodeId)
      .map((e) => ({
        id: e.from === nodeId ? e.to : e.from,
        weight: e.weight,
        edgeKey: `${e.from}-${e.to}`,
      }));
  };

  const reconstructPath = (
    prev: Record<string, string | null>,
    end: string,
  ): string[] => {
    const path: string[] = [];
    let curr: string | null = end;
    while (curr) {
      path.unshift(curr);
      curr = prev[curr] ?? null;
    }
    return path;
  };

  const dijkstra = async () => {
    setIsRunning(true);
    reset();
    const dist: Record<string, number> = {};
    const prev: Record<string, string | null> = {};
    const visited = new Set<string>();
    nodes.forEach((n) => {
      dist[n.id] = Infinity;
      prev[n.id] = null;
    });
    dist[startNode] = 0;
    setDistances({ ...dist });

    const states: Record<string, NodeState> = {};
    nodes.forEach((n) => (states[n.id] = "default"));
    states[startNode] = "start";
    states[endNode] = "end";
    setNodeStates({ ...states });
    setCurrentStep(`Starting Dijkstra from node ${startNode}`);
    await sleep(700);

    while (true) {
      let u: string | null = null;
      let minDist = Infinity;
      for (const n of nodes) {
        if (!visited.has(n.id) && dist[n.id] < minDist) {
          minDist = dist[n.id];
          u = n.id;
        }
      }
      if (!u || u === endNode) break;
      visited.add(u);

      if (u !== startNode) {
        states[u] = "visiting";
        setNodeStates({ ...states });
      }
      setCurrentStep(`Visiting node ${u} — distance: ${dist[u]}`);
      setDistances({ ...dist });
      await sleep(700);

      for (const neighbor of getNeighbors(u)) {
        if (visited.has(neighbor.id)) continue;
        const alt = dist[u] + neighbor.weight;
        if (alt < dist[neighbor.id]) {
          dist[neighbor.id] = alt;
          prev[neighbor.id] = u;
          setDistances({ ...dist });
          setCurrentStep(
            `Updated ${neighbor.id}: ${dist[u]} + ${neighbor.weight} = ${alt}`,
          );
          await sleep(500);
        }
      }
      if (u !== startNode) {
        states[u] = "visited";
        setNodeStates({ ...states });
      }
    }

    const path = reconstructPath(prev, endNode);
    setPathNodes(path);
    const cost = dist[endNode];
    setTotalCost(cost === Infinity ? null : cost);

    for (const n of path) {
      if (n !== startNode && n !== endNode) {
        states[n] = "path";
        setNodeStates({ ...states });
        await sleep(300);
      }
    }

    const highlightEdges: string[] = [];
    for (let i = 0; i < path.length - 1; i++) {
      highlightEdges.push(`${path[i]}-${path[i + 1]}`);
      highlightEdges.push(`${path[i + 1]}-${path[i]}`);
    }
    setEdgeHighlight(highlightEdges);
    setCurrentStep(
      cost === Infinity
        ? `❌ No path from ${startNode} to ${endNode}`
        : `✅ Shortest path: ${path.join(" → ")} | Cost: ${cost}`,
    );
    setIsRunning(false);
  };

  const bfs = async () => {
    setIsRunning(true);
    reset();
    const visited = new Set<string>();
    const prev: Record<string, string | null> = {};
    nodes.forEach((n) => (prev[n.id] = null));
    const queue = [startNode];
    visited.add(startNode);

    const states: Record<string, NodeState> = {};
    nodes.forEach((n) => (states[n.id] = "default"));
    states[startNode] = "start";
    states[endNode] = "end";
    setNodeStates({ ...states });
    setCurrentStep(`BFS starting from ${startNode}`);
    await sleep(700);

    while (queue.length > 0) {
      const u = queue.shift()!;
      if (u !== startNode && u !== endNode) {
        states[u] = "visiting";
        setNodeStates({ ...states });
      }
      setCurrentStep(`BFS visiting node ${u} — Queue: [${queue.join(", ")}]`);
      await sleep(700);

      if (u === endNode) break;

      for (const neighbor of getNeighbors(u)) {
        if (!visited.has(neighbor.id)) {
          visited.add(neighbor.id);
          prev[neighbor.id] = u;
          queue.push(neighbor.id);
        }
      }
      if (u !== startNode && u !== endNode) {
        states[u] = "visited";
        setNodeStates({ ...states });
      }
    }

    const path = reconstructPath(prev, endNode);
    setPathNodes(path);
    for (const n of path) {
      if (n !== startNode && n !== endNode) {
        states[n] = "path";
        setNodeStates({ ...states });
        await sleep(300);
      }
    }
    const highlightEdges: string[] = [];
    for (let i = 0; i < path.length - 1; i++) {
      highlightEdges.push(`${path[i]}-${path[i + 1]}`);
      highlightEdges.push(`${path[i + 1]}-${path[i]}`);
    }
    setEdgeHighlight(highlightEdges);
    setCurrentStep(
      `✅ Path found: ${path.join(" → ")} | Hops: ${path.length - 1}`,
    );
    setIsRunning(false);
  };

  const dfs = async () => {
    setIsRunning(true);
    reset();
    const visited = new Set<string>();
    const prev: Record<string, string | null> = {};
    nodes.forEach((n) => (prev[n.id] = null));

    const states: Record<string, NodeState> = {};
    nodes.forEach((n) => (states[n.id] = "default"));
    states[startNode] = "start";
    states[endNode] = "end";
    setNodeStates({ ...states });
    setCurrentStep(`DFS starting from ${startNode}`);
    await sleep(700);

    let found = false;
    const dfsHelper = async (u: string): Promise<boolean> => {
      visited.add(u);
      if (u !== startNode && u !== endNode) {
        states[u] = "visiting";
        setNodeStates({ ...states });
      }
      setCurrentStep(`DFS visiting node ${u}`);
      await sleep(700);
      if (u === endNode) return true;
      for (const neighbor of getNeighbors(u)) {
        if (!visited.has(neighbor.id)) {
          prev[neighbor.id] = u;
          if (await dfsHelper(neighbor.id)) return true;
        }
      }
      if (u !== startNode && u !== endNode) {
        states[u] = "visited";
        setNodeStates({ ...states });
      }
      return false;
    };

    found = await dfsHelper(startNode);
    if (found) {
      const path = reconstructPath(prev, endNode);
      setPathNodes(path);
      for (const n of path) {
        if (n !== startNode && n !== endNode) {
          states[n] = "path";
          setNodeStates({ ...states });
          await sleep(300);
        }
      }
      const highlightEdges: string[] = [];
      for (let i = 0; i < path.length - 1; i++) {
        highlightEdges.push(`${path[i]}-${path[i + 1]}`);
        highlightEdges.push(`${path[i + 1]}-${path[i]}`);
      }
      setEdgeHighlight(highlightEdges);
      setCurrentStep(`✅ Path found: ${path.join(" → ")}`);
    } else {
      setCurrentStep(`❌ No path from ${startNode} to ${endNode}`);
    }
    setIsRunning(false);
  };

  const runAlgorithm = () => {
    if (selectedAlgo === "Dijkstra") dijkstra();
    else if (selectedAlgo === "BFS") bfs();
    else if (selectedAlgo === "DFS") dfs();
  };

  const addEdge = () => {
    if (!newEdgeFrom || !newEdgeTo || !newEdgeWeight) return;
    const w = parseInt(newEdgeWeight);
    if (isNaN(w) || w <= 0) return;
    const fromExists = nodes.find((n) => n.id === newEdgeFrom.toUpperCase());
    const toExists = nodes.find((n) => n.id === newEdgeTo.toUpperCase());
    if (!fromExists || !toExists) return;
    setEdges((prev) => [
      ...prev,
      {
        from: newEdgeFrom.toUpperCase(),
        to: newEdgeTo.toUpperCase(),
        weight: w,
      },
    ]);
    setNewEdgeFrom("");
    setNewEdgeTo("");
    setNewEdgeWeight("");
    setShowAddEdge(false);
  };

  const removeEdge = (from: string, to: string) => {
    setEdges((prev) =>
      prev.filter(
        (e) =>
          !(e.from === from && e.to === to) &&
          !(e.from === to && e.to === from),
      ),
    );
  };

  const getNodeColor = (id: string) => {
    const state = nodeStates[id] || "default";
    if (state === "start") return "#00D4AA";
    if (state === "end") return "#FF6B6B";
    if (state === "path") return "#FFD700";
    if (state === "visiting") return info.color;
    if (state === "visited") return info.color + "88";
    return "#1E1E2E";
  };

  const getEdgeColor = (from: string, to: string) => {
    const key1 = `${from}-${to}`;
    const key2 = `${to}-${from}`;
    if (edgeHighlight.includes(key1) || edgeHighlight.includes(key2))
      return "#FFD700";
    return "#333";
  };

  const algos = ["Dijkstra", "BFS", "DFS"];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: info.color }]}>
          Graph Visualizer
        </Text>
        <Text style={styles.subtitle}>
          Node-Edge DSA Graph — {selectedAlgo}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {["visualize", "edit", "learn"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.tab,
              activeTab === t && { backgroundColor: info.color },
            ]}
            onPress={() => setActiveTab(t as any)}
          >
            <Text
              style={[styles.tabText, activeTab === t && styles.tabTextActive]}
            >
              {t === "visualize"
                ? "▶ Run"
                : t === "edit"
                  ? "✏️ Edit"
                  : "📖 Learn"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── VISUALIZE TAB ── */}
      {activeTab === "visualize" && (
        <>
          {/* Algorithm selector */}
          <View style={styles.algoRow}>
            {algos.map((a) => {
              const ai = algoInfo[a as keyof typeof algoInfo];
              return (
                <TouchableOpacity
                  key={a}
                  style={[
                    styles.algoBtn,
                    selectedAlgo === a && {
                      backgroundColor: ai.color + "33",
                      borderColor: ai.color,
                    },
                  ]}
                  onPress={() => {
                    setSelectedAlgo(a);
                    reset();
                  }}
                >
                  <Text
                    style={[
                      styles.algoBtnText,
                      selectedAlgo === a && { color: ai.color },
                    ]}
                  >
                    {a}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Start / End selector */}
          <View style={styles.nodeSelectRow}>
            <View style={styles.nodeSelectBox}>
              <Text style={styles.nodeSelectLabel}>🟢 Start</Text>
              <View style={styles.nodeSelectBtns}>
                {nodes.map((n) => (
                  <TouchableOpacity
                    key={n.id}
                    style={[
                      styles.nodeSelectBtn,
                      startNode === n.id && {
                        backgroundColor: "#00D4AA44",
                        borderColor: "#00D4AA",
                      },
                    ]}
                    onPress={() => {
                      setStartNode(n.id);
                      reset();
                    }}
                  >
                    <Text
                      style={[
                        styles.nodeSelectBtnText,
                        startNode === n.id && { color: "#00D4AA" },
                      ]}
                    >
                      {n.id}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.nodeSelectBox}>
              <Text style={styles.nodeSelectLabel}>🔴 End</Text>
              <View style={styles.nodeSelectBtns}>
                {nodes.map((n) => (
                  <TouchableOpacity
                    key={n.id}
                    style={[
                      styles.nodeSelectBtn,
                      endNode === n.id && {
                        backgroundColor: "#FF6B6B44",
                        borderColor: "#FF6B6B",
                      },
                    ]}
                    onPress={() => {
                      setEndNode(n.id);
                      reset();
                    }}
                  >
                    <Text
                      style={[
                        styles.nodeSelectBtnText,
                        endNode === n.id && { color: "#FF6B6B" },
                      ]}
                    >
                      {n.id}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* SVG Graph */}
          <View style={styles.svgCard}>
            {(() => {
              const containerWidth = Math.min(windowWidth - 40, 650);
              const svgWidth = Math.max(300, containerWidth);
              const svgHeight = 320;
              const paddingX = 35;
              const paddingY = 35;

              const getNodePos = (node: Node) => {
                if (node.relX !== undefined && node.relY !== undefined) {
                  return {
                    x: paddingX + node.relX * (svgWidth - paddingX * 2),
                    y: paddingY + node.relY * (svgHeight - paddingY * 2),
                  };
                }
                const scaleX = (svgWidth - paddingX * 2) / 300;
                const scaleY = (svgHeight - paddingY * 2) / 260;
                return {
                  x: paddingX + (node.x - 40) * scaleX,
                  y: paddingY + (node.y - 30) * scaleY,
                };
              };

              return (
                <Svg width={svgWidth} height={svgHeight}>
                  {/* Edges */}
                  {edges.map((edge, i) => {
                    const fromNode = nodes.find((n) => n.id === edge.from);
                    const toNode = nodes.find((n) => n.id === edge.to);
                    if (!fromNode || !toNode) return null;
                    const from = getNodePos(fromNode);
                    const to = getNodePos(toNode);
                    const mx = (from.x + to.x) / 2;
                    const my = (from.y + to.y) / 2;
                    const isHighlighted =
                      edgeHighlight.includes(`${edge.from}-${edge.to}`) ||
                      edgeHighlight.includes(`${edge.to}-${edge.from}`);
                    return (
                      <Fragment key={`edge-${i}`}>
                        <Line
                          x1={from.x}
                          y1={from.y}
                          x2={to.x}
                          y2={to.y}
                          stroke={isHighlighted ? "#FFD700" : "#333"}
                          strokeWidth={isHighlighted ? 3 : 1.5}
                        />
                        <SvgText
                          x={mx}
                          y={my - 6}
                          fill={isHighlighted ? "#FFD700" : "#666"}
                          fontSize="11"
                          textAnchor="middle"
                          fontWeight={isHighlighted ? "bold" : "normal"}
                        >
                          {edge.weight}
                        </SvgText>
                      </Fragment>
                    );
                  })}

                  {/* Nodes */}
                  {nodes.map((node) => {
                    const pos = getNodePos(node);
                    const color = getNodeColor(node.id);
                    const isOnPath = pathNodes.includes(node.id);
                    const dist = distances[node.id];
                    return (
                      <Fragment key={`node-${node.id}`}>
                        <Circle
                          cx={pos.x}
                          cy={pos.y}
                          r={20}
                          fill={color}
                          stroke={isOnPath ? "#FFD700" : info.color + "66"}
                          strokeWidth={isOnPath ? 3 : 1.5}
                        />
                        <SvgText
                          x={pos.x}
                          y={pos.y + 5}
                          fill="#FFF"
                          fontSize="14"
                          textAnchor="middle"
                          fontWeight="bold"
                        >
                          {node.id}
                        </SvgText>
                        {dist !== undefined && dist !== Infinity && (
                          <SvgText
                            x={pos.x}
                            y={pos.y + 34}
                            fill="#FFD700"
                            fontSize="10"
                            textAnchor="middle"
                            fontWeight="bold"
                          >
                            d={dist}
                          </SvgText>
                        )}
                      </Fragment>
                    );
                  })}
                </Svg>
              );
            })()}
          </View>

          {/* Step info */}
          <View style={[styles.stepBox, { borderColor: info.color + "44" }]}>
            <Text style={styles.stepText}>
              {currentStep ||
                `Select start/end nodes then press Start ${selectedAlgo}!`}
            </Text>
          </View>

          {/* Path result */}
          {pathNodes.length > 0 && (
            <View style={styles.pathBox}>
              <Text style={styles.pathLabel}>🏆 Path Found</Text>
              <Text style={styles.pathNodes}>{pathNodes.join(" → ")}</Text>
              {totalCost !== null && (
                <Text style={styles.pathCost}>Total Cost: {totalCost}</Text>
              )}
            </View>
          )}

          {/* Distance table */}
          {Object.keys(distances).length > 0 && (
            <View style={styles.distTable}>
              <Text style={styles.distTitle}>Distance Table</Text>
              <View style={styles.distRow}>
                {nodes.map((n) => (
                  <View
                    key={n.id}
                    style={[
                      styles.distCell,
                      pathNodes.includes(n.id) && {
                        backgroundColor: "#FFD70022",
                        borderColor: "#FFD700",
                      },
                    ]}
                  >
                    <Text
                      style={[styles.distNode, { color: getNodeColor(n.id) }]}
                    >
                      {n.id}
                    </Text>
                    <Text style={styles.distVal}>
                      {distances[n.id] === Infinity ? "∞" : distances[n.id]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: "#00D4AA" }]} />
              <Text style={styles.legendText}>Start</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: "#FF6B6B" }]} />
              <Text style={styles.legendText}>End</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: info.color }]} />
              <Text style={styles.legendText}>Visiting</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.dot, { backgroundColor: "#FFD700" }]} />
              <Text style={styles.legendText}>Path</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[
                styles.btn,
                { backgroundColor: info.color },
                isRunning && styles.disabled,
              ]}
              onPress={runAlgorithm}
              disabled={isRunning}
            >
              <Text style={styles.btnText}>▶ Run {selectedAlgo}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.resetBtn]}
              onPress={reset}
            >
              <Text style={styles.btnText}>↺ Reset</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* ── EDIT TAB ── */}
      {activeTab === "edit" && (
        <View style={styles.editSection}>
          <Text style={styles.editTitle}>✏️ Edit Graph</Text>

          {/* Current edges */}
          <Text style={styles.editSubtitle}>Current Edges</Text>
          <View style={styles.edgeList}>
            {edges.map((e, i) => (
              <View key={i} style={styles.edgeItem}>
                <Text style={styles.edgeText}>
                  {e.from} ↔ {e.to}
                </Text>
                <View
                  style={[
                    styles.weightBadge,
                    { backgroundColor: info.color + "22" },
                  ]}
                >
                  <Text style={[styles.weightText, { color: info.color }]}>
                    w={e.weight}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeEdge(e.from, e.to)}
                >
                  <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Add edge */}
          <Text style={styles.editSubtitle}>Add New Edge</Text>
          <View style={styles.addEdgeRow}>
            <TextInput
              style={styles.edgeInput}
              value={newEdgeFrom}
              onChangeText={(t) => setNewEdgeFrom(t.toUpperCase())}
              placeholder="From"
              placeholderTextColor="#555"
              maxLength={1}
            />
            <Text style={styles.edgeArrow}>↔</Text>
            <TextInput
              style={styles.edgeInput}
              value={newEdgeTo}
              onChangeText={(t) => setNewEdgeTo(t.toUpperCase())}
              placeholder="To"
              placeholderTextColor="#555"
              maxLength={1}
            />
            <TextInput
              style={[styles.edgeInput, { flex: 1 }]}
              value={newEdgeWeight}
              onChangeText={setNewEdgeWeight}
              placeholder="Weight"
              placeholderTextColor="#555"
              keyboardType="number-pad"
            />
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: info.color }]}
              onPress={addEdge}
            >
              <Text style={styles.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.editNote}>
            Available nodes: {nodes.map((n) => n.id).join(", ")}
          </Text>

          <TouchableOpacity
            style={styles.resetDefaultBtn}
            onPress={resetToDefault}
          >
            <Text style={styles.resetDefaultText}>
              ↺ Reset to Default Graph
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── LEARN TAB ── */}
      {activeTab === "learn" && (
        <View style={styles.learnSection}>
          {algos.map((a) => {
            const ai = algoInfo[a as keyof typeof algoInfo];
            return (
              <View
                key={a}
                style={[styles.learnCard, { borderColor: ai.color + "44" }]}
              >
                <View style={styles.learnCardHeader}>
                  <View
                    style={[
                      styles.learnBadge,
                      { backgroundColor: ai.color + "22" },
                    ]}
                  >
                    <Text style={[styles.learnBadgeText, { color: ai.color }]}>
                      {a}
                    </Text>
                  </View>
                </View>
                <Text style={styles.learnText}>{ai.desc}</Text>
              </View>
            );
          })}

          <View style={styles.learnCard}>
            <Text style={styles.learnTitle}>
              📐 How Dijkstra Works Step by Step
            </Text>
            <Text style={styles.learnText}>
              {
                "1. Set distance of start node = 0, all others = ∞\n2. Pick unvisited node with smallest distance\n3. For each neighbor, calculate new distance\n4. If new distance < current distance, update it\n5. Mark current node as visited\n6. Repeat until destination is reached\n7. Trace back path using predecessor array"
              }
            </Text>
          </View>

          <View style={styles.learnCard}>
            <Text style={styles.learnTitle}>💡 Key Concepts</Text>
            <Text style={styles.learnText}>
              {
                "• Graph: Collection of nodes (vertices) connected by edges\n• Weighted Graph: Each edge has a cost/distance\n• Shortest Path: Path with minimum total weight\n• Adjacency: Two nodes connected by an edge are adjacent\n• Time Complexity of Dijkstra: O(V²) or O(E log V) with priority queue"
              }
            </Text>
          </View>

          <View style={styles.learnCard}>
            <Text style={styles.learnTitle}>🌍 Real World Uses</Text>
            <Text style={styles.learnText}>
              {
                "• GPS Navigation (Google Maps uses Dijkstra variant)\n• Network routing protocols (OSPF uses Dijkstra)\n• Game AI pathfinding (A* extends Dijkstra)\n• Social network shortest connection\n• Flight route optimization"
              }
            </Text>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0F" },
  header: { padding: 24, paddingTop: 20 },
  title: { fontSize: 26, fontWeight: "bold" },
  subtitle: { fontSize: 13, color: "#888", marginTop: 4 },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#12121A",
    borderRadius: 12,
    padding: 4,
  },
  tab: { flex: 1, padding: 10, borderRadius: 10, alignItems: "center" },
  tabText: { color: "#888", fontSize: 13, fontWeight: "600" },
  tabTextActive: { color: "#FFF" },
  algoRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  algoBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#12121A",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  algoBtnText: { color: "#888", fontSize: 12, fontWeight: "600" },
  nodeSelectRow: { paddingHorizontal: 20, gap: 10, marginBottom: 12 },
  nodeSelectBox: {
    backgroundColor: "#12121A",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  nodeSelectLabel: { color: "#888", fontSize: 12, marginBottom: 8 },
  nodeSelectBtns: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  nodeSelectBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1E1E2E",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  nodeSelectBtnText: { color: "#888", fontSize: 13, fontWeight: "bold" },
  svgContainer: {
    marginHorizontal: 20,
    backgroundColor: "#0D1117",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    overflow: "hidden",
    marginBottom: 12,
  },
  svgCard: {
    marginHorizontal: 20,
    backgroundColor: "#12121A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    overflow: "hidden",
    marginBottom: 14,
    alignItems: "center",
    paddingVertical: 10,
  },
  stepBox: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "#12121A",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    minHeight: 52,
    justifyContent: "center",
  },
  stepText: {
    color: "#FFF",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  pathBox: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "#FFD70011",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  pathLabel: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  pathNodes: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  pathCost: {
    color: "#FFD700",
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },
  distTable: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "#12121A",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  distTitle: {
    color: "#888",
    fontSize: 12,
    marginBottom: 8,
    fontWeight: "600",
  },
  distRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  distCell: {
    alignItems: "center",
    backgroundColor: "#1E1E2E",
    borderRadius: 8,
    padding: 8,
    minWidth: 44,
    borderWidth: 1,
    borderColor: "#333",
  },
  distNode: { fontSize: 14, fontWeight: "bold" },
  distVal: { color: "#888", fontSize: 11, marginTop: 2 },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: "#888", fontSize: 11 },
  buttons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  btn: { flex: 1, padding: 16, borderRadius: 12, alignItems: "center" },
  resetBtn: { backgroundColor: "#1E1E2E" },
  disabled: { opacity: 0.5 },
  btnText: { color: "#FFF", fontSize: 14, fontWeight: "bold" },
  editSection: { paddingHorizontal: 20, gap: 12 },
  editTitle: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
  editSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888",
    marginTop: 8,
  },
  edgeList: { gap: 8 },
  edgeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#12121A",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    gap: 8,
  },
  edgeText: { flex: 1, color: "#FFF", fontSize: 14 },
  weightBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  weightText: { fontSize: 12, fontWeight: "600" },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FF6B6B22",
    alignItems: "center",
    justifyContent: "center",
  },
  removeBtnText: { color: "#FF6B6B", fontSize: 13 },
  addEdgeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  edgeInput: {
    backgroundColor: "#12121A",
    borderRadius: 10,
    padding: 12,
    color: "#FFF",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    width: 52,
    textAlign: "center",
  },
  edgeArrow: { color: "#888", fontSize: 16 },
  addBtn: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: { color: "#FFF", fontSize: 13, fontWeight: "bold" },
  editNote: { color: "#666", fontSize: 12, textAlign: "center" },
  resetDefaultBtn: {
    backgroundColor: "#1E1E2E",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
    marginTop: 8,
  },
  resetDefaultText: { color: "#888", fontSize: 14 },
  learnSection: { paddingHorizontal: 20, gap: 14 },
  learnCard: {
    backgroundColor: "#12121A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  learnCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  learnBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  learnBadgeText: { fontSize: 13, fontWeight: "bold" },
  learnTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 12,
  },
  learnText: { color: "#AAA", fontSize: 13, lineHeight: 22 },
});

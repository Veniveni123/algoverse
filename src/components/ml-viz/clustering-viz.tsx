import { useState, useEffect } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle, Line as SvgLine } from "react-native-svg";
import { Play, Pause, RotateCcw, Sparkles } from "lucide-react-native";

import { AppColors, Radii } from "../../constants/theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CHART_SIZE = 220;
const PADDING = 20;
const RANGE = 10;

const CLUSTER_COLORS = ["#8B5CF6", "#06B6D4", "#F59E0B"];

const DATA_POINTS = [
  { x: 1.5, y: 1.5 }, { x: 2, y: 2.5 }, { x: 1, y: 2 }, { x: 2.5, y: 1 }, { x: 1.8, y: 1.2 },
  { x: 8, y: 1.5 }, { x: 8.5, y: 2 }, { x: 7.5, y: 1 }, { x: 9, y: 2.5 }, { x: 8.2, y: 1.8 },
  { x: 5, y: 8 }, { x: 5.5, y: 8.5 }, { x: 4.5, y: 7.5 }, { x: 5.2, y: 9 }, { x: 4.8, y: 8.2 },
];

const INITIAL_CENTROIDS = [
  { x: 1, y: 9 },
  { x: 5, y: 1 },
  { x: 9, y: 9 },
];

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export default function ClusteringViz() {
  const size = Math.min(Dimensions.get("window").width - 72, 380);
  const [centroids, setCentroids] = useState(INITIAL_CENTROIDS);
  const [assignments, setAssignments] = useState<number[]>(DATA_POINTS.map(() => -1));
  const [iteration, setIteration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inertia, setInertia] = useState<number>(0);

  const c0 = { x: useSharedValue(INITIAL_CENTROIDS[0].x), y: useSharedValue(INITIAL_CENTROIDS[0].y) };
  const c1 = { x: useSharedValue(INITIAL_CENTROIDS[1].x), y: useSharedValue(INITIAL_CENTROIDS[1].y) };
  const c2 = { x: useSharedValue(INITIAL_CENTROIDS[2].x), y: useSharedValue(INITIAL_CENTROIDS[2].y) };
  const centroidShared = [c0, c1, c2];

  const toPixel = (v: number) => PADDING + (v / RANGE) * (size - PADDING * 2);
  const toPixelYInverted = (v: number) => size - PADDING - (v / RANGE) * (size - PADDING * 2);

  const useCentroidProps = (shared: { x: any; y: any }) =>
    useAnimatedProps(() => {
      "worklet";
      return {
        cx: PADDING + (shared.x.value / RANGE) * (size - PADDING * 2),
        cy: size - PADDING - (shared.y.value / RANGE) * (size - PADDING * 2),
      };
    });

  const centroidProps = [useCentroidProps(c0), useCentroidProps(c1), useCentroidProps(c2)];

  const runIteration = () => {
    let currentInertia = 0;

    // Step 1: assign each point to its nearest centroid
    const newAssignments = DATA_POINTS.map((p) => {
      let best = 0;
      let bestDist = Infinity;
      centroids.forEach((c, i) => {
        const d = distance(p, c);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      currentInertia += bestDist * bestDist;
      return best;
    });

    // Step 2: recompute each centroid as the mean of its assigned points
    const newCentroids = centroids.map((old, i) => {
      const assigned = DATA_POINTS.filter((_, idx) => newAssignments[idx] === i);
      if (assigned.length === 0) return old;
      const meanX = assigned.reduce((sum, p) => sum + p.x, 0) / assigned.length;
      const meanY = assigned.reduce((sum, p) => sum + p.y, 0) / assigned.length;
      return { x: meanX, y: meanY };
    });

    setAssignments(newAssignments);
    setCentroids(newCentroids);
    setInertia(currentInertia);
    setIteration((it) => it + 1);

    newCentroids.forEach((c, i) => {
      centroidShared[i].x.value = withTiming(c.x, { duration: 400 });
      centroidShared[i].y.value = withTiming(c.y, { duration: 400 });
    });
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        runIteration();
      }, 500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, centroids]);

  const reset = () => {
    setIsPlaying(false);
    setCentroids(INITIAL_CENTROIDS);
    setAssignments(DATA_POINTS.map(() => -1));
    setIteration(0);
    setInertia(0);
    INITIAL_CENTROIDS.forEach((c, i) => {
      centroidShared[i].x.value = withTiming(c.x, { duration: 300 });
      centroidShared[i].y.value = withTiming(c.y, { duration: 300 });
    });
  };

  return (
    <View>
      <Svg width={size} height={size}>
        <SvgLine x1={PADDING} y1={size - PADDING} x2={size - PADDING} y2={size - PADDING} stroke={AppColors.borderSubtle} strokeWidth={1} />
        <SvgLine x1={PADDING} y1={PADDING} x2={PADDING} y2={size - PADDING} stroke={AppColors.borderSubtle} strokeWidth={1} />

        {DATA_POINTS.map((p, i) => (
          <Circle
            key={i}
            cx={toPixel(p.x)}
            cy={toPixelYInverted(p.y)}
            r={5}
            fill={assignments[i] === -1 ? AppColors.textMuted : CLUSTER_COLORS[assignments[i]]}
            opacity={0.85}
          />
        ))}

        {centroidShared.map((_, i) => (
          <AnimatedCircle key={i} animatedProps={centroidProps[i]} r={9} fill={CLUSTER_COLORS[i]} stroke="#FFF" strokeWidth={2} />
        ))}
      </Svg>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Iteration</Text>
          <Text style={styles.statValue}>{iteration}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Clusters (K)</Text>
          <Text style={styles.statValue}>3</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Inertia (SSE)</Text>
          <Text style={styles.statValue}>{inertia > 0 ? inertia.toFixed(2) : "N/A"}</Text>
        </View>
      </View>

      {/* STEP-BY-STEP MATHEMATICAL EXPLANATION BOX */}
      <View style={styles.explanationCard}>
        <View style={styles.explanationHeader}>
          <Sparkles size={16} color={AppColors.tertiary} />
          <Text style={styles.explanationTitle}>K-Means Convergence Step Explanation</Text>
        </View>
        <Text style={styles.explanationText}>
          {iteration === 0
            ? "• Iteration 0: Centroids starting at initial positions. Points are unassigned (gray). Click 'Run 1 Iteration' or 'Auto Play'."
            : `• Iteration ${iteration}: Step 1 assigned points to nearest centroid by Euclidean distance. Step 2 recalculated centroid positions to the mean center of each cluster, reducing Inertia to ${inertia.toFixed(2)}.`}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.primaryButton} onPress={runIteration}>
          <Text style={styles.primaryButtonText}>Run 1 Iteration</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playButton, isPlaying && { backgroundColor: AppColors.tertiary }]}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause size={16} color="#FFF" /> : <Play size={16} color="#FFF" />}
          <Text style={styles.playButtonText}>{isPlaying ? "Pause" : "Auto Play"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={reset}>
          <RotateCcw size={16} color={AppColors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  statBox: { flex: 1, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: Radii.sm, padding: 8, alignItems: "center" },
  statLabel: { color: AppColors.textMuted, fontSize: 10 },
  statValue: { color: "#FFF", fontSize: 14, fontWeight: "700", marginTop: 2 },

  explanationCard: {
    backgroundColor: "rgba(6, 182, 212, 0.1)",
    borderRadius: Radii.md,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(6, 182, 212, 0.3)",
  },
  explanationHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  explanationTitle: { color: AppColors.tertiary, fontSize: 12, fontWeight: "800" },
  explanationText: { color: "#FFF", fontSize: 12, lineHeight: 18 },

  buttonRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  primaryButton: { flex: 2, backgroundColor: AppColors.primary, borderRadius: Radii.md, paddingVertical: 12, alignItems: "center" },
  primaryButtonText: { color: "#FFF", fontWeight: "700", fontSize: 12 },
  playButton: { flex: 1.5, flexDirection: "row", gap: 6, backgroundColor: "#7C3AED", borderRadius: Radii.md, paddingVertical: 12, alignItems: "center", justifyContent: "center" },
  playButtonText: { color: "#FFF", fontWeight: "700", fontSize: 12 },
  secondaryButton: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: Radii.md, paddingVertical: 12, paddingHorizontal: 16, alignItems: "center", justifyContent: "center" },
});

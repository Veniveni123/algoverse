import { useState, useEffect } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle, Line as SvgLine } from "react-native-svg";
import { Play, Pause, RotateCcw, Sparkles } from "lucide-react-native";

import { AppColors, Radii } from "../../constants/theme";

const AnimatedLine = Animated.createAnimatedComponent(SvgLine);

const CHART_SIZE = 220;
const PADDING = 20;
const RANGE = 10;

type Point = { x: number; y: number; label: 1 | -1 };

const POINTS: Point[] = [
  { x: 2, y: 2, label: 1 },
  { x: 1, y: 3, label: 1 },
  { x: 3, y: 1, label: 1 },
  { x: 2, y: 4, label: 1 },
  { x: 1, y: 1.5, label: 1 },
  { x: 3.5, y: 2.5, label: 1 },
  { x: 7, y: 7, label: -1 },
  { x: 8, y: 6, label: -1 },
  { x: 6, y: 8, label: -1 },
  { x: 8, y: 8, label: -1 },
  { x: 7, y: 6, label: -1 },
  { x: 6.5, y: 7.5, label: -1 },
];

const LEARNING_RATE = 0.5;

function runEpoch(w1: number, w2: number, bias: number) {
  let nw1 = w1;
  let nw2 = w2;
  let nb = bias;
  let mistakes = 0;

  for (const p of POINTS) {
    const activation = nw1 * p.x + nw2 * p.y + nb;
    const predicted = activation >= 0 ? 1 : -1;
    if (predicted !== p.label) {
      mistakes += 1;
      nw1 += LEARNING_RATE * p.label * p.x;
      nw2 += LEARNING_RATE * p.label * p.y;
      nb += LEARNING_RATE * p.label;
    }
  }

  return { w1: nw1, w2: nw2, bias: nb, mistakes };
}

export default function ClassificationViz() {
  const size = Math.min(Dimensions.get("window").width - 72, 380);
  const [w1, setW1] = useState(0);
  const [w2, setW2] = useState(0);
  const [bias, setBias] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const [mistakes, setMistakes] = useState(POINTS.length);
  const [isPlaying, setIsPlaying] = useState(false);

  const w1Shared = useSharedValue(0);
  const w2Shared = useSharedValue(0);
  const biasShared = useSharedValue(0);

  const toPixel = (v: number) => PADDING + (v / RANGE) * (size - PADDING * 2);
  const toPixelYInverted = (v: number) => size - PADDING - (v / RANGE) * (size - PADDING * 2);

  const animatedProps = useAnimatedProps(() => {
    "worklet";
    const w1v = w1Shared.value;
    const w2v = w2Shared.value;
    const bv = biasShared.value;

    let x1 = 0;
    let x2 = RANGE;
    let y1: number;
    let y2: number;

    if (Math.abs(w2v) > 0.0001) {
      y1 = -(w1v * x1 + bv) / w2v;
      y2 = -(w1v * x2 + bv) / w2v;
    } else if (Math.abs(w1v) > 0.0001) {
      x1 = -bv / w1v;
      x2 = x1;
      y1 = 0;
      y2 = RANGE;
    } else {
      y1 = RANGE / 2;
      y2 = RANGE / 2;
    }

    const px1 = PADDING + (x1 / RANGE) * (size - PADDING * 2);
    const px2 = PADDING + (x2 / RANGE) * (size - PADDING * 2);
    const py1 = size - PADDING - (y1 / RANGE) * (size - PADDING * 2);
    const py2 = size - PADDING - (y2 / RANGE) * (size - PADDING * 2);

    return { x1: px1, y1: py1, x2: px2, y2: py2 };
  });

  const trainEpoch = () => {
    const result = runEpoch(w1, w2, bias);
    setW1(result.w1);
    setW2(result.w2);
    setBias(result.bias);
    setMistakes(result.mistakes);
    setEpoch((e) => e + 1);
    w1Shared.value = withTiming(result.w1, { duration: 350 });
    w2Shared.value = withTiming(result.w2, { duration: 350 });
    biasShared.value = withTiming(result.bias, { duration: 350 });
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        if (mistakes > 0) {
          trainEpoch();
        } else {
          setIsPlaying(false);
        }
      }, 500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, w1, w2, bias, mistakes]);

  const reset = () => {
    setIsPlaying(false);
    setW1(0);
    setW2(0);
    setBias(0);
    setEpoch(0);
    setMistakes(POINTS.length);
    w1Shared.value = withTiming(0, { duration: 300 });
    w2Shared.value = withTiming(0, { duration: 300 });
    biasShared.value = withTiming(0, { duration: 300 });
  };

  return (
    <View>
      <Svg width={size} height={size}>
        <SvgLine x1={PADDING} y1={size - PADDING} x2={size - PADDING} y2={size - PADDING} stroke={AppColors.borderSubtle} strokeWidth={1} />
        <SvgLine x1={PADDING} y1={PADDING} x2={PADDING} y2={size - PADDING} stroke={AppColors.borderSubtle} strokeWidth={1} />

        {POINTS.map((p, i) => (
          <Circle
            key={i}
            cx={toPixel(p.x)}
            cy={toPixelYInverted(p.y)}
            r={6}
            fill={p.label === 1 ? AppColors.tertiary : "#F43F5E"}
            opacity={0.9}
          />
        ))}

        <AnimatedLine animatedProps={animatedProps} stroke={AppColors.primary} strokeWidth={2.5} strokeDasharray="6,4" />
      </Svg>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: AppColors.tertiary }]} />
          <Text style={styles.legendText}>Class A (+1)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#F43F5E" }]} />
          <Text style={styles.legendText}>Class B (-1)</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Epoch</Text>
          <Text style={styles.statValue}>{epoch}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Misclassified</Text>
          <Text style={[styles.statValue, mistakes === 0 && { color: AppColors.success }]}>
            {mistakes} / {POINTS.length}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Weights (w1, w2)</Text>
          <Text style={styles.statValue}>{w1.toFixed(1)}, {w2.toFixed(1)}</Text>
        </View>
      </View>

      {/* STEP-BY-STEP MATHEMATICAL EXPLANATION BOX */}
      <View style={styles.explanationCard}>
        <View style={styles.explanationHeader}>
          <Sparkles size={16} color={AppColors.tertiary} />
          <Text style={styles.explanationTitle}>Perceptron Learning Step Explanation</Text>
        </View>
        <Text style={styles.explanationText}>
          {epoch === 0
            ? "• Epoch 0: Initial weights (0, 0) and bias 0. All points are unclassified. Click 'Train Epoch' to adjust decision boundary."
            : mistakes === 0
            ? `• Epoch ${epoch}: CONVERGED! 0 misclassified points remaining. Perceptron successfully found a linear decision boundary separating Class A and B.`
            : `• Epoch ${epoch}: Adjusted weights to w1 = ${w1.toFixed(2)}, w2 = ${w2.toFixed(2)}, bias = ${bias.toFixed(2)}. ${mistakes} misclassified points remaining.`}
        </Text>
        <Text style={styles.formulaText}>
          Boundary Equation: ({w1.toFixed(2)})x1 + ({w2.toFixed(2)})x2 + ({bias.toFixed(2)}) = 0
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.primaryButton} onPress={trainEpoch} disabled={mistakes === 0}>
          <Text style={styles.primaryButtonText}>Train 1 Epoch</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playButton, isPlaying && { backgroundColor: AppColors.tertiary }]}
          onPress={() => setIsPlaying(!isPlaying)}
          disabled={mistakes === 0 && !isPlaying}
        >
          {isPlaying ? <Pause size={16} color="#FFF" /> : <Play size={16} color="#FFF" />}
          <Text style={styles.playButtonText}>{isPlaying ? "Pause" : "Auto Train"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={reset}>
          <RotateCcw size={16} color={AppColors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legendRow: { flexDirection: "row", gap: 16, marginTop: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: AppColors.textSecondary, fontSize: 12 },
  statsRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  statBox: { flex: 1, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: Radii.sm, padding: 8, alignItems: "center" },
  statLabel: { color: AppColors.textMuted, fontSize: 10 },
  statValue: { color: "#FFF", fontSize: 13, fontWeight: "700", marginTop: 2 },

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
  formulaText: { color: AppColors.textMuted, fontSize: 11, marginTop: 6, fontFamily: "monospace" },

  buttonRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  primaryButton: { flex: 2, backgroundColor: AppColors.primary, borderRadius: Radii.md, paddingVertical: 12, alignItems: "center" },
  primaryButtonText: { color: "#FFF", fontWeight: "700", fontSize: 12 },
  playButton: { flex: 1.5, flexDirection: "row", gap: 6, backgroundColor: "#7C3AED", borderRadius: Radii.md, paddingVertical: 12, alignItems: "center", justifyContent: "center" },
  playButtonText: { color: "#FFF", fontWeight: "700", fontSize: 12 },
  secondaryButton: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: Radii.md, paddingVertical: 12, paddingHorizontal: 16, alignItems: "center", justifyContent: "center" },
});

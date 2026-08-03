import { useState, useEffect } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle, Line as SvgLine, Text as SvgText } from "react-native-svg";
import { Play, Pause, RotateCcw, Sparkles } from "lucide-react-native";

import { AppColors, Radii } from "../../constants/theme";

const AnimatedLine = Animated.createAnimatedComponent(SvgLine);

const CHART_HEIGHT = 220;
const PADDING = 28;

const NOISE = [0.6, -0.8, 0.3, -0.4, 0.9, -0.5, 0.2, -0.9, 0.4, -0.2];
const POINTS = NOISE.map((noise, i) => {
  const x = i / (NOISE.length - 1);
  const y = 8 * x + 2 + noise;
  return { x, y };
});

function gradientDescentStep(m: number, b: number, lr: number) {
  const n = POINTS.length;
  let dm = 0;
  let db = 0;
  let sse = 0;

  for (const p of POINTS) {
    const pred = m * p.x + b;
    const error = pred - p.y;
    dm += error * p.x;
    db += error;
    sse += error * error;
  }

  dm = (2 / n) * dm;
  db = (2 / n) * db;

  return {
    m: m - lr * dm,
    b: b - lr * db,
    dm,
    db,
    mse: sse / n,
  };
}

export default function LinearRegressionViz() {
  const width = Math.min(Dimensions.get("window").width - 72, 400);
  const [m, setM] = useState(0);
  const [b, setB] = useState(0);
  const [lr, setLr] = useState(0.3);
  const [lastDm, setLastDm] = useState(0);
  const [lastDb, setLastDb] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mse, setMse] = useState(() => {
    const n = POINTS.length;
    return POINTS.reduce((sum, p) => sum + (0 - p.y) ** 2, 0) / n;
  });
  const [steps, setSteps] = useState(0);

  const mShared = useSharedValue(0);
  const bShared = useSharedValue(0);

  const toPixelX = (x: number) => PADDING + x * (width - PADDING * 2);
  const toPixelY = (y: number) => CHART_HEIGHT - PADDING - (y / 12) * (CHART_HEIGHT - PADDING * 2);

  const animatedProps = useAnimatedProps(() => {
    const x1 = toPixelX(0);
    const y1 = CHART_HEIGHT - PADDING - (bShared.value / 12) * (CHART_HEIGHT - PADDING * 2);
    const x2 = toPixelX(1);
    const y2 = CHART_HEIGHT - PADDING - ((mShared.value + bShared.value) / 12) * (CHART_HEIGHT - PADDING * 2);
    return { x1, y1, x2, y2 };
  });

  const runStep = () => {
    const result = gradientDescentStep(m, b, lr);
    setM(result.m);
    setB(result.b);
    setLastDm(result.dm);
    setLastDb(result.db);
    setMse(result.mse);
    setSteps((s) => s + 1);
    mShared.value = withTiming(result.m, { duration: 300 });
    bShared.value = withTiming(result.b, { duration: 300 });
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        runStep();
      }, 500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, m, b, lr]);

  const reset = () => {
    setIsPlaying(false);
    setM(0);
    setB(0);
    setLastDm(0);
    setLastDb(0);
    setSteps(0);
    mShared.value = withTiming(0, { duration: 300 });
    bShared.value = withTiming(0, { duration: 300 });
    const n = POINTS.length;
    setMse(POINTS.reduce((sum, p) => sum + (0 - p.y) ** 2, 0) / n);
  };

  return (
    <View>
      <Svg width={width} height={CHART_HEIGHT}>
        <SvgLine x1={PADDING} y1={CHART_HEIGHT - PADDING} x2={width - PADDING} y2={CHART_HEIGHT - PADDING} stroke={AppColors.borderSubtle} strokeWidth={1} />
        <SvgLine x1={PADDING} y1={PADDING} x2={PADDING} y2={CHART_HEIGHT - PADDING} stroke={AppColors.borderSubtle} strokeWidth={1} />
        <SvgText x={PADDING} y={CHART_HEIGHT - 6} fontSize={10} fill={AppColors.textMuted}>Feature (x)</SvgText>
        <SvgText x={4} y={PADDING} fontSize={10} fill={AppColors.textMuted}>Target (y)</SvgText>

        {POINTS.map((p, i) => (
          <Circle key={i} cx={toPixelX(p.x)} cy={toPixelY(p.y)} r={5} fill={AppColors.tertiary} opacity={0.85} />
        ))}

        <AnimatedLine animatedProps={animatedProps} stroke={AppColors.primary} strokeWidth={2.5} />
      </Svg>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Step</Text>
          <Text style={styles.statValue}>{steps}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Slope (m)</Text>
          <Text style={styles.statValue}>{m.toFixed(2)}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Intercept (b)</Text>
          <Text style={styles.statValue}>{b.toFixed(2)}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>MSE Loss</Text>
          <Text style={styles.statValue}>{mse.toFixed(2)}</Text>
        </View>
      </View>

      {/* EDUCATIONAL STEP-BY-STEP MATHEMATICAL EXPLANATION BOX */}
      <View style={styles.explanationCard}>
        <View style={styles.explanationHeader}>
          <Sparkles size={16} color={AppColors.tertiary} />
          <Text style={styles.explanationTitle}>Step-by-Step Math Explanation</Text>
        </View>
        <Text style={styles.explanationText}>
          {steps === 0
            ? "• Initial state: Line is flat at ŷ = 0x + 0. Mean Squared Error (MSE) is high at " + mse.toFixed(2) + ". Click 'Run Gradient Step' or 'Auto Play'."
            : `• Step ${steps}: Computed partial derivatives ∂L/∂m = ${lastDm.toFixed(2)} and ∂L/∂b = ${lastDb.toFixed(2)}. Updated slope m → ${m.toFixed(2)} and intercept b → ${b.toFixed(2)}, reducing MSE to ${mse.toFixed(2)}.`}
        </Text>
        <Text style={styles.formulaText}>
          Model: ŷ = ({m.toFixed(2)})x + ({b.toFixed(2)}) | Learning Rate α = {lr}
        </Text>
      </View>

      {/* CONTROLS & LEARNING RATE SELECTOR */}
      <View style={styles.lrRow}>
        <Text style={styles.lrLabel}>Learning Rate (α):</Text>
        <View style={styles.lrOptions}>
          {[0.1, 0.3, 0.5].map((rate) => (
            <TouchableOpacity
              key={rate}
              style={[styles.lrBtn, lr === rate && styles.activeLrBtn]}
              onPress={() => setLr(rate)}
            >
              <Text style={[styles.lrBtnText, lr === rate && styles.activeLrBtnText]}>{rate}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.primaryButton} onPress={runStep}>
          <Text style={styles.primaryButtonText}>Run Gradient Step</Text>
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
  formulaText: { color: AppColors.textMuted, fontSize: 11, marginTop: 6, fontFamily: "monospace" },

  lrRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12 },
  lrLabel: { color: AppColors.textSecondary, fontSize: 12, fontWeight: "700" },
  lrOptions: { flexDirection: "row", gap: 6 },
  lrBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radii.pill, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: AppColors.borderSubtle },
  activeLrBtn: { backgroundColor: AppColors.primary, borderColor: AppColors.primary },
  lrBtnText: { color: AppColors.textMuted, fontSize: 11, fontWeight: "600" },
  activeLrBtnText: { color: "#FFF", fontWeight: "700" },

  buttonRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  primaryButton: { flex: 2, backgroundColor: AppColors.primary, borderRadius: Radii.md, paddingVertical: 12, alignItems: "center" },
  primaryButtonText: { color: "#FFF", fontWeight: "700", fontSize: 12 },
  playButton: { flex: 1.5, flexDirection: "row", gap: 6, backgroundColor: "#7C3AED", borderRadius: Radii.md, paddingVertical: 12, alignItems: "center", justifyContent: "center" },
  playButtonText: { color: "#FFF", fontWeight: "700", fontSize: 12 },
  secondaryButton: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: Radii.md, paddingVertical: 12, paddingHorizontal: 16, alignItems: "center", justifyContent: "center" },
});

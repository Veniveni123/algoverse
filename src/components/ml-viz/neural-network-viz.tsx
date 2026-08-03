import { useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedProps, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import Svg, { Circle, G, Line as SvgLine, Text as SvgText } from "react-native-svg";

import { AppColors, Radii } from "../../constants/theme";

const AnimatedG = Animated.createAnimatedComponent(G);

const CHART_HEIGHT = 240;

const INPUT_VALUES = [0.8, 0.3, 0.6];

// Fixed weight matrices so the demo is deterministic and reproducible.
const W1 = [
  [0.4, -0.2, 0.5],
  [0.1, 0.6, -0.3],
  [-0.5, 0.3, 0.2],
  [0.2, 0.2, 0.4],
];
const B1 = [0.1, -0.1, 0.05, 0.0];

const W2 = [
  [0.5, -0.4, 0.3, 0.2],
  [-0.3, 0.5, 0.1, -0.2],
];
const B2 = [0.1, -0.1];

function relu(x: number) {
  return Math.max(0, x);
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

function forwardPass() {
  const hidden = W1.map((weights, i) => {
    const sum = weights.reduce((acc, w, j) => acc + w * INPUT_VALUES[j], B1[i]);
    return relu(sum);
  });

  const output = W2.map((weights, i) => {
    const sum = weights.reduce((acc, w, j) => acc + w * hidden[j], B2[i]);
    return sigmoid(sum);
  });

  return { hidden, output };
}

export default function NeuralNetworkViz() {
  const width = Math.min(Dimensions.get("window").width - 72, 380);
  const [hiddenValues, setHiddenValues] = useState<number[]>([0, 0, 0, 0]);
  const [outputValues, setOutputValues] = useState<number[]>([0, 0]);
  const [hasRun, setHasRun] = useState(false);

  const hiddenGlow = useSharedValue(0.25);
  const outputGlow = useSharedValue(0.25);

  const hiddenAnimatedProps = useAnimatedProps(() => ({ opacity: hiddenGlow.value }));
  const outputAnimatedProps = useAnimatedProps(() => ({ opacity: outputGlow.value }));

  const inputX = 40;
  const hiddenX = width / 2;
  const outputX = width - 40;

  const inputY = [60, 120, 180];
  const hiddenY = [40, 100, 160, 220 > CHART_HEIGHT - 20 ? CHART_HEIGHT - 20 : 220].map((y) => Math.min(y, CHART_HEIGHT - 20));
  const outputY = [80, 160];

  const runForwardPass = () => {
    const result = forwardPass();
    setHiddenValues(result.hidden);
    setOutputValues(result.output);
    setHasRun(true);

    hiddenGlow.value = 0.25;
    outputGlow.value = 0.25;
    hiddenGlow.value = withTiming(1, { duration: 450 });
    outputGlow.value = withDelay(450, withTiming(1, { duration: 450 }));
  };

  const reset = () => {
    setHiddenValues([0, 0, 0, 0]);
    setOutputValues([0, 0]);
    setHasRun(false);
    hiddenGlow.value = withTiming(0.25, { duration: 250 });
    outputGlow.value = withTiming(0.25, { duration: 250 });
  };

  return (
    <View>
      <Svg width={width} height={CHART_HEIGHT}>
        {/* Edges: input -> hidden */}
        <G opacity={0.35}>
          {inputY.map((iy, i) =>
            hiddenY.map((hy, h) => (
              <SvgLine key={`ih-${i}-${h}`} x1={inputX} y1={iy} x2={hiddenX} y2={hy} stroke={AppColors.textMuted} strokeWidth={1} />
            ))
          )}
        </G>
        {/* Edges: hidden -> output */}
        <AnimatedG animatedProps={outputAnimatedProps}>
          {hiddenY.map((hy, h) =>
            outputY.map((oy, o) => (
              <SvgLine key={`ho-${h}-${o}`} x1={hiddenX} y1={hy} x2={outputX} y2={oy} stroke={AppColors.primary} strokeWidth={1} />
            ))
          )}
        </AnimatedG>

        {/* Input nodes */}
        {inputY.map((y, i) => (
          <G key={`input-${i}`}>
            <Circle cx={inputX} cy={y} r={14} fill={AppColors.tertiary} />
            <SvgText x={inputX} y={y + 4} fontSize={10} fill="#04141C" textAnchor="middle" fontWeight="bold">
              {INPUT_VALUES[i].toFixed(1)}
            </SvgText>
          </G>
        ))}

        {/* Hidden nodes */}
        <AnimatedG animatedProps={hiddenAnimatedProps}>
          {hiddenY.map((y, i) => (
            <G key={`hidden-${i}`}>
              <Circle cx={hiddenX} cy={y} r={14} fill={AppColors.primary} />
              <SvgText x={hiddenX} y={y + 4} fontSize={10} fill="#FFF" textAnchor="middle" fontWeight="bold">
                {hiddenValues[i].toFixed(2)}
              </SvgText>
            </G>
          ))}
        </AnimatedG>

        {/* Output nodes */}
        <AnimatedG animatedProps={outputAnimatedProps}>
          {outputY.map((y, i) => (
            <G key={`output-${i}`}>
              <Circle cx={outputX} cy={y} r={14} fill="#F59E0B" />
              <SvgText x={outputX} y={y + 4} fontSize={10} fill="#2A1400" textAnchor="middle" fontWeight="bold">
                {outputValues[i].toFixed(2)}
              </SvgText>
            </G>
          ))}
        </AnimatedG>
      </Svg>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: AppColors.tertiary }]} />
          <Text style={styles.legendText}>Input</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: AppColors.primary }]} />
          <Text style={styles.legendText}>Hidden (ReLU)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#F59E0B" }]} />
          <Text style={styles.legendText}>Output (Sigmoid)</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.primaryButton} onPress={runForwardPass}>
          <Text style={styles.primaryButtonText}>Run forward pass</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={reset}>
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.caption}>
        {hasRun
          ? "Each hidden node computed a weighted sum of the inputs, added its bias, then applied ReLU. Each output node did the same from the hidden layer's values, then applied sigmoid to squash the result into (0, 1)."
          : "Fixed input values and weights feed forward through one hidden layer (ReLU) to an output layer (sigmoid). Press \"Run forward pass\" to compute and watch the signal propagate."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  legendRow: { flexDirection: "row", gap: 14, marginTop: 10, flexWrap: "wrap" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: AppColors.textSecondary, fontSize: 11 },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  primaryButton: { flex: 1, backgroundColor: AppColors.primary, borderRadius: Radii.md, paddingVertical: 12, alignItems: "center" },
  primaryButtonText: { color: "#FFF", fontWeight: "700", fontSize: 12 },
  secondaryButton: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: Radii.md, paddingVertical: 12, paddingHorizontal: 16, alignItems: "center" },
  secondaryButtonText: { color: AppColors.textSecondary, fontWeight: "700", fontSize: 12 },
  caption: { color: AppColors.textMuted, fontSize: 11, lineHeight: 16, marginTop: 12 },
});

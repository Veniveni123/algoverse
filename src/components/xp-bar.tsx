import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { AppColors, Gradients, Radii } from "../constants/theme";

type Props = {
  progressPercent: number; // 0-100
  label?: string;
};

export default function XPBar({ progressPercent, label }: Props) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.max(0, Math.min(progressPercent, 100)), { duration: 700 });
  }, [progressPercent]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.track}>
        <Animated.View style={[styles.fill, animatedStyle]}>
          <LinearGradient colors={Gradients.progress} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: AppColors.textSecondary, fontSize: 12, marginBottom: 6 },
  track: {
    height: 10,
    borderRadius: Radii.pill,
    backgroundColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
  },
  fill: {
    height: 10,
    borderRadius: Radii.pill,
    overflow: "hidden",
  },
});

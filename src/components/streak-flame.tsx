import { Flame } from "lucide-react-native";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { AppColors } from "../constants/theme";

type Props = {
  streak: number;
};

export default function StreakFlame({ streak }: Props) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (streak <= 0) return;
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      true
    );
  }, [streak]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isActive = streak > 0;

  return (
    <View style={styles.row}>
      <Animated.View style={animatedStyle}>
        <Flame size={20} color={isActive ? "#F59E0B" : AppColors.textMuted} fill={isActive ? "#F59E0B" : "transparent"} />
      </Animated.View>
      <Text style={[styles.text, !isActive && styles.textInactive]}>{streak} day{streak === 1 ? "" : "s"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  text: { color: "#F59E0B", fontWeight: "800", fontSize: 15 },
  textInactive: { color: AppColors.textMuted },
});

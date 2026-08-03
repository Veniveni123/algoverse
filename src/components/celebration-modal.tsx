import { LinearGradient } from "expo-linear-gradient";
import { Award, Sparkles, TrendingUp } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { ACHIEVEMENT_ICONS } from "../constants/achievement-icons";
import { AppColors, Gradients, Radii } from "../constants/theme";
import { ACHIEVEMENTS, CelebrationEvent } from "../services/gamification.service";

type Props = {
  events: CelebrationEvent[];
  onDone: () => void;
};

const CONFETTI_COLORS = ["#8B5CF6", "#06B6D4", "#F59E0B", "#22C55E", "#F43F5E"];

function ConfettiBurst() {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 150,
        rotate: Math.random() * 360,
      })),
    []
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <ConfettiPiece key={p.id} left={p.left} color={p.color} delay={p.delay} rotate={p.rotate} />
      ))}
    </View>
  );
}

function ConfettiPiece({ left, color, delay, rotate }: { left: number; color: string; delay: number; rotate: number }) {
  const translateY = useSharedValue(-20);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(delay, withTiming(280, { duration: 1400, easing: Easing.out(Easing.cubic) }));
    opacity.value = withDelay(delay + 900, withTiming(0, { duration: 500 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { rotate: `${rotate}deg` }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: `${left}%`,
          width: 8,
          height: 8,
          borderRadius: 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

export default function CelebrationModal({ events, onDone }: Props) {
  const [index, setIndex] = useState(0);
  const scale = useSharedValue(0.85);

  const current = events[index];

  useEffect(() => {
    if (!current) return;
    scale.value = 0.85;
    scale.value = withSequence(withTiming(1.05, { duration: 260 }), withTiming(1, { duration: 140 }));
  }, [index]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!current) return null;

  const handleNext = () => {
    if (index < events.length - 1) {
      setIndex(index + 1);
    } else {
      onDone();
    }
  };

  let icon = <Sparkles size={40} color="#FFF" />;
  let title = "";
  let subtitle = "";
  let gradient: readonly [string, string, ...string[]] = Gradients.hero;

  if (current.type === "xp") {
    icon = <Sparkles size={40} color="#FFF" />;
    title = `+${current.amount} XP`;
    subtitle = current.reason;
    gradient = Gradients.hero;
  } else if (current.type === "level_up") {
    icon = <TrendingUp size={40} color="#FFF" />;
    title = `Level ${current.level}!`;
    subtitle = "You leveled up. Keep the momentum going.";
    gradient = Gradients.gold;
  } else if (current.type === "achievement") {
    const def = ACHIEVEMENTS.find((a) => a.id === current.achievementId);
    const Icon = def ? ACHIEVEMENT_ICONS[def.icon] : Award;
    icon = <Icon size={40} color="#FFF" />;
    title = def?.label ?? "Achievement unlocked";
    subtitle = def?.description ?? "";
    gradient = Gradients.success;
  }

  return (
    <Modal transparent animationType="fade" visible={events.length > 0}>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.card, cardStyle]}>
          <ConfettiBurst />
          <LinearGradient colors={gradient} style={styles.iconWrap}>
            {icon}
          </LinearGradient>
          <Text style={styles.eyebrow}>
            {current.type === "achievement" ? "Achievement unlocked" : current.type === "level_up" ? "Level up" : "Nice work"}
          </Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>{index < events.length - 1 ? "Next" : "Continue"}</Text>
          </TouchableOpacity>

          {events.length > 1 && (
            <View style={styles.dots}>
              {events.map((_, i) => (
                <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
              ))}
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: AppColors.bgElevated,
    borderRadius: Radii.xl,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppColors.border,
    overflow: "hidden",
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  eyebrow: { color: AppColors.textSecondary, fontSize: 12, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" },
  title: { color: "#FFF", fontSize: 24, fontWeight: "800", marginTop: 6, textAlign: "center" },
  subtitle: { color: AppColors.textSecondary, fontSize: 13, marginTop: 8, textAlign: "center", lineHeight: 20 },
  button: {
    marginTop: 22,
    backgroundColor: AppColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: Radii.pill,
  },
  buttonText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  dots: { flexDirection: "row", gap: 6, marginTop: 16 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: AppColors.locked },
  dotActive: { backgroundColor: AppColors.primary, width: 16 },
});

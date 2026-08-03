import { LinearGradient } from "expo-linear-gradient";
import { type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

type OnboardingCardProps = {
  title: string;
  subtitle: string;
  icon: ReactNode;
  accent: readonly [string, string];
};

export default function OnboardingCard({
  title,
  subtitle,
  icon,
  accent,
}: OnboardingCardProps) {
  return (
    <LinearGradient colors={accent} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    minHeight: 150,
    justifyContent: "flex-end",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  subtitle: {
    color: "rgba(255,255,255,0.84)",
    fontSize: 12,
    lineHeight: 18,
  },
});

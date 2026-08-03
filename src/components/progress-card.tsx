import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

type ProgressCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  accent?: string;
};

export default function ProgressCard({
  title,
  value,
  subtitle,
  icon,
  accent = "#6C63FF",
}: ProgressCardProps) {
  return (
    <View style={[styles.card, { borderColor: accent }]}> 
      <View style={styles.iconWrap}>{icon}</View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    minHeight: 110,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  content: { flex: 1 },
  title: { color: "#9CA3AF", fontSize: 12, marginBottom: 4 },
  value: { color: "#FFF", fontSize: 18, fontWeight: "700" },
  subtitle: { color: "#6B7280", fontSize: 11, marginTop: 4 },
});

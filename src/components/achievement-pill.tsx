import { StyleSheet, Text, View } from "react-native";

type AchievementPillProps = {
  label: string;
  active?: boolean;
};

export default function AchievementPill({ label, active = true }: AchievementPillProps) {
  return (
    <View style={[styles.pill, !active && styles.inactive]}>
      <Text style={[styles.text, !active && styles.inactiveText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: "#1E293B",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#334155",
  },
  inactive: { opacity: 0.5 },
  text: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  inactiveText: { color: "#94A3B8" },
});

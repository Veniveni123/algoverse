import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RecommendationCardProps = {
  title: string;
  subtitle: string;
  actionLabel: string;
  onPress?: () => void;
};

export default function RecommendationCard({ title, subtitle, actionLabel, onPress }: RecommendationCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.action}>{actionLabel}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  content: { flex: 1, marginRight: 10 },
  title: { color: "#FFF", fontSize: 14, fontWeight: "700" },
  subtitle: { color: "#9CA3AF", fontSize: 12, marginTop: 4 },
  action: { color: "#8B5CF6", fontSize: 12, fontWeight: "700" },
});

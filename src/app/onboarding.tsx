import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BookOpen, Sparkles, Target, Trophy } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import OnboardingCard from "../components/onboarding-card";
import { loadProgressState, saveProgressState } from "../services/progress.service";

const slides = [
  {
    title: "Learn with clarity",
    subtitle: "Visual explanations and guided practice make algorithms feel intuitive.",
    icon: <BookOpen size={22} color="#FFF" />,
    accent: ["#7C3AED", "#4F46E5"] as const,
  },
  {
    title: "Stay consistent",
    subtitle: "Daily streaks and progress checkpoints keep your momentum strong.",
    icon: <Target size={22} color="#FFF" />,
    accent: ["#0F766E", "#14B8A6"] as const,
  },
  {
    title: "Level up fast",
    subtitle: "Track achievements, favorites, and challenges in one elegant experience.",
    icon: <Trophy size={22} color="#FFF" />,
    accent: ["#F59E0B", "#EF4444"] as const,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const nextStep = async () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
      return;
    }

    const state = await loadProgressState();
    await saveProgressState({
      ...state,
      streak: state.streak || 1,
      lastActiveDate: new Date().toISOString().split("T")[0],
    });

    router.replace("/home");
  };

  const current = slides[step];

  return (
    <LinearGradient colors={["#050816", "#0F172A"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Sparkles size={16} color="#FFF" />
            <Text style={styles.badgeText}>AlgoVerse AI</Text>
          </View>
          <Text style={styles.title}>Your personalized learning journey starts here</Text>
          <Text style={styles.subtitle}>A smarter, more motivating experience for mastering algorithms.</Text>
        </View>

        <OnboardingCard title={current.title} subtitle={current.subtitle} icon={current.icon} accent={current.accent} />

        <View style={styles.footer}>
          <View style={styles.dots}>
            {slides.map((_, index) => (
              <View key={index} style={[styles.dot, index === step && styles.dotActive]} />
            ))}
          </View>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={nextStep}>
            <Text style={styles.primaryButtonText}>{step === slides.length - 1 ? "Start Learning" : "Continue"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, padding: 24, justifyContent: "space-between" },
  header: { marginTop: 24 },
  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 18,
  },
  badgeText: { color: "#FFF", fontSize: 13, fontWeight: "700" },
  title: { color: "#FFF", fontSize: 30, fontWeight: "800", lineHeight: 38 },
  subtitle: { color: "#94A3B8", fontSize: 15, marginTop: 10, lineHeight: 22 },
  footer: { marginTop: 24 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 8, marginBottom: 16 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#334155" },
  dotActive: { backgroundColor: "#6C63FF", width: 24 },
  primaryButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryButtonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});

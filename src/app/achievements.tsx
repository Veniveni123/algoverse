import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { Lock } from "lucide-react-native";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ResponsiveShell } from "@/components/responsive-shell";
import { ACHIEVEMENT_ICONS } from "@/constants/achievement-icons";
import { AppColors, Gradients, Radii } from "@/constants/theme";
import { auth, db } from "@/config/firebase";
import { getAllAchievementDefinitions } from "@/services/gamification.service";
import { loadProgressState } from "@/services/progress.service";

export default function AchievementsScreen() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        // Ensures streak-based achievements reflect the latest local state too,
        // in case Firestore badges haven't caught up yet (e.g. offline visit).
        await loadProgressState();
        const user = auth.currentUser;
        if (user) {
          const snap = await getDoc(doc(db, "users", user.uid));
          const badges: string[] = snap.exists() ? snap.data()?.badges || [] : [];
          if (active) setUnlockedIds(badges);
        }
        if (active) setLoaded(true);
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  const definitions = getAllAchievementDefinitions();
  const unlockedCount = definitions.filter((d) => unlockedIds.includes(d.id)).length;

  if (!loaded) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ResponsiveShell>
        <LinearGradient colors={Gradients.hero} style={styles.hero}>
          <Text style={styles.heroTitle}>Achievements</Text>
          <Text style={styles.heroSubtitle}>
            {unlockedCount} of {definitions.length} unlocked
          </Text>
        </LinearGradient>

        <View style={styles.grid}>
          {definitions.map((achievement) => {
            const isUnlocked = unlockedIds.includes(achievement.id);
            const Icon = ACHIEVEMENT_ICONS[achievement.icon];
            return (
              <View key={achievement.id} style={[styles.card, !isUnlocked && styles.cardLocked]}>
                <View style={[styles.iconWrap, isUnlocked ? styles.iconWrapUnlocked : styles.iconWrapLocked]}>
                  {isUnlocked ? <Icon size={22} color="#FFF" /> : <Lock size={18} color={AppColors.lockedText} />}
                </View>
                <Text style={[styles.cardTitle, !isUnlocked && styles.cardTitleLocked]}>{achievement.label}</Text>
                <Text style={styles.cardDescription}>{achievement.description}</Text>
              </View>
            );
          })}
        </View>
      </ResponsiveShell>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.bg },
  hero: { paddingHorizontal: 20, paddingVertical: 24, borderRadius: Radii.xl, marginTop: 16 },
  heroTitle: { color: "#FFF", fontSize: 24, fontWeight: "800" },
  heroSubtitle: { color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 8 },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 20 },
  card: {
    width: "47%",
    backgroundColor: AppColors.surface,
    borderRadius: Radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  cardLocked: { opacity: 0.55 },
  iconWrap: { width: 44, height: 44, borderRadius: Radii.sm, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  iconWrapUnlocked: { backgroundColor: AppColors.primary },
  iconWrapLocked: { backgroundColor: "rgba(255,255,255,0.06)" },
  cardTitle: { color: "#FFF", fontSize: 13, fontWeight: "700" },
  cardTitleLocked: { color: AppColors.lockedText },
  cardDescription: { color: AppColors.textSecondary, fontSize: 11, marginTop: 4, lineHeight: 16 },
});

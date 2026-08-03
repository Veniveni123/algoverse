import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import {
  Bell,
  ChevronRight,
  Info,
  LogOut,
  RotateCcw,
  Volume2,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { auth } from "../config/firebase";
import { ResponsiveShell } from "../components/responsive-shell";
import { AppColors, Gradients, Radii } from "../constants/theme";

const SETTINGS_KEY = "algoverse-settings-v1";

type SettingsState = {
  notifications: boolean;
  sound: boolean;
};

const DEFAULT_SETTINGS: SettingsState = {
  notifications: true,
  sound: true,
};

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(SETTINGS_KEY);
        if (stored) setSettings(JSON.parse(stored));
      } catch (error) {
        console.log("Settings load error", error);
      }
      setLoaded(true);
    })();
  }, []);

  const updateSetting = async (key: keyof SettingsState, value: boolean) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch (error) {
      console.log("Settings save error", error);
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      "Reset learning progress?",
      "This clears your local streak, completed topics, and daily challenge state. Your XP and account stay intact.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("algoverse-progress-v1");
            Alert.alert("Progress reset", "Your local learning progress has been cleared.");
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  if (!loaded) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ResponsiveShell>
        <LinearGradient colors={Gradients.auth} style={styles.hero}>
          <Text style={styles.heroTitle}>Settings</Text>
          <Text style={styles.heroSubtitle}>Manage notifications, sound, and your data.</Text>
        </LinearGradient>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconWrap}>
                <Bell size={16} color={AppColors.primary} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Daily reminders</Text>
                <Text style={styles.rowSubtitle}>Nudge me to keep my streak alive</Text>
              </View>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(v) => updateSetting("notifications", v)}
              trackColor={{ false: AppColors.locked, true: AppColors.primary }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconWrap}>
                <Volume2 size={16} color={AppColors.tertiary} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Sound effects</Text>
                <Text style={styles.rowSubtitle}>XP chimes and celebration sounds</Text>
              </View>
            </View>
            <Switch
              value={settings.sound}
              onValueChange={(v) => updateSetting("sound", v)}
              trackColor={{ false: AppColors.locked, true: AppColors.tertiary }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity style={styles.linkRow} onPress={handleResetProgress}>
            <View style={styles.rowLeft}>
              <View style={styles.iconWrap}>
                <RotateCcw size={16} color={AppColors.danger} />
              </View>
              <Text style={styles.rowTitle}>Reset learning progress</Text>
            </View>
            <ChevronRight size={18} color={AppColors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.linkRow}>
            <View style={styles.rowLeft}>
              <View style={styles.iconWrap}>
                <Info size={16} color={AppColors.textSecondary} />
              </View>
              <Text style={styles.rowTitle}>About AlgoVerse</Text>
            </View>
            <Text style={styles.versionText}>v1.0.0</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={16} color="#FFF" />
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </ResponsiveShell>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.bg },
  hero: { paddingHorizontal: 20, paddingVertical: 24, borderRadius: Radii.xl, marginTop: 16 },
  heroTitle: { color: "#FFF", fontSize: 24, fontWeight: "800" },
  heroSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 8, lineHeight: 20 },
  sectionCard: {
    backgroundColor: AppColors.surface,
    padding: 18,
    borderRadius: Radii.xl,
    marginTop: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  sectionTitle: { color: "#FFF", fontSize: 15, fontWeight: "700", marginBottom: 14 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  linkRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12, flexShrink: 1 },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: Radii.sm,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
  },
  rowTitle: { color: "#FFF", fontSize: 14, fontWeight: "600" },
  rowSubtitle: { color: AppColors.textSecondary, fontSize: 12, marginTop: 2 },
  divider: { height: 1, backgroundColor: AppColors.borderSubtle, marginVertical: 14 },
  versionText: { color: AppColors.textMuted, fontSize: 13 },
  logoutBtn: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#1F2937",
    padding: 16,
    borderRadius: Radii.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  logoutText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
});

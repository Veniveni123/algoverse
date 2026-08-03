import { useRouter } from "expo-router";
import { Bell, Search, Settings, Sparkles, User } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getLevelInfo } from "@/services/gamification.service";
import { loadProgressState, ProgressState } from "@/services/progress.service";

export function Header() {
  const router = useRouter();
  const [progressState, setProgressState] = useState<ProgressState | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProgressState().then(setProgressState);
  }, []);

  const xp = (progressState?.completedTopics?.length || 0) * 100;
  const { level } = getLevelInfo(xp);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push("/learn" as any);
    }
  };

  return (
    <View style={styles.header}>
      {/* Search Input Container */}
      <View style={styles.searchBar}>
        <Search size={16} color="#94A3B8" />
        <TextInput
          placeholder="Search algorithms, data structures, ML models (Press Enter)..."
          placeholderTextColor="#64748B"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Right Header Controls */}
      <View style={styles.rightControls}>
        <TouchableOpacity
          style={styles.aiButton}
          onPress={() => router.push("/ai-center" as any)}
        >
          <Sparkles size={15} color="#A78BFA" />
          <Text style={styles.aiButtonText}>AI Copilot</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.push("/settings" as any)}
        >
          <Settings size={18} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profilePill}
          onPress={() => router.push("/profile" as any)}
        >
          <View style={styles.avatar}>
            <User size={16} color="#FFF" />
          </View>
          <View style={styles.profileTextWrap}>
            <Text style={styles.profileName}>Learner</Text>
            <Text style={styles.profileLevel}>Lvl {level}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    backgroundColor: "#0B1120",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  searchBar: {
    flex: 1,
    maxWidth: 460,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: "#FFF",
    fontSize: 13,
    height: "100%",
  },
  rightControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  aiButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  aiButtonText: {
    color: "#A78BFA",
    fontSize: 12,
    fontWeight: "700",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
  profileTextWrap: {
    justifyContent: "center",
  },
  profileName: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  profileLevel: {
    color: "#94A3B8",
    fontSize: 10,
  },
});

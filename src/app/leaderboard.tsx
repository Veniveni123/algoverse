import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { db } from "../config/firebase";

export default function LeaderboardScreen() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const q = query(collection(db, "users"), orderBy("xp", "desc"));

      const snapshot = await getDocs(q);

      const leaderboardData: any[] = [];

      snapshot.forEach((doc) => {
        leaderboardData.push(doc.data());
      });

      setUsers(leaderboardData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🏆 Leaderboard</Text>

      <FlatList
        data={users}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.rank}>#{index + 1}</Text>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name || "User"}</Text>

              <Text style={styles.email}>{item.email}</Text>
            </View>

            <Text style={styles.xp}>⭐ {item.xp || 0}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0F",
    padding: 20,
  },

  title: {
    color: "#6C63FF",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
    marginTop: 20,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#12121A",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },

  rank: {
    color: "#FFD700",
    fontSize: 22,
    fontWeight: "bold",
    width: 50,
  },

  name: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },

  email: {
    color: "#888",
    marginTop: 4,
  },

  xp: {
    color: "#6C63FF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

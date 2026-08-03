import { Tabs } from "expo-router";
import { BrainCircuit, Compass, Home, User } from "lucide-react-native";
import { Platform, View, StyleSheet } from "react-native";

import { AppColors } from "@/constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#A78BFA", // Light violet neon
        tabBarInactiveTintColor: "#64748B",
        tabBarStyle: {
          backgroundColor: "#0B1120EE", // Glassmorphic elevated background
          borderTopColor: "rgba(139, 92, 246, 0.25)",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 84 : 68,
          paddingTop: 6,
          paddingBottom: Platform.OS === "ios" ? 28 : 10,
          shadowColor: "#8B5CF6",
          shadowOpacity: 0.2,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: -4 },
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconBg]}>
              <Home size={focused ? 22 : 20} color={focused ? "#A78BFA" : "#64748B"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconBg]}>
              <Compass size={focused ? 22 : 20} color={focused ? "#A78BFA" : "#64748B"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="ai-center"
        options={{
          title: "AI Center",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconBg]}>
              <BrainCircuit size={focused ? 22 : 20} color={focused ? "#06B6D4" : "#64748B"} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIconBg]}>
              <User size={focused ? 22 : 20} color={focused ? "#A78BFA" : "#64748B"} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    padding: 4,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  activeIconBg: {
    backgroundColor: "rgba(139, 92, 246, 0.15)",
  },
});

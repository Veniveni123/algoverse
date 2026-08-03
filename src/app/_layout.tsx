import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0B1120",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 18,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: "#050816",
          },
          animation: "slide_from_right",
        }}
      >
        {/* Authentication */}
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="onboarding"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="signup"
          options={{ headerShown: false }}
        />

        {/* Main app shell — persistent bottom tabs (Home / Learn / AI Center / Profile) */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="settings"
          options={{ title: "Settings" }}
        />

        <Stack.Screen
          name="achievements"
          options={{ title: "Achievements" }}
        />

        {/* DSA */}
        <Stack.Screen
          name="algorithms"
          options={{ title: "Algorithms" }}
        />

        <Stack.Screen
          name="visualizer"
          options={{ title: "Sorting Visualizer" }}
        />

        <Stack.Screen
          name="graph"
          options={{ title: "Graph Visualizer" }}
        />

        <Stack.Screen
          name="dp"
          options={{ title: "Dynamic Programming" }}
        />

        <Stack.Screen
          name="benchmark"
          options={{ title: "Benchmark Lab" }}
        />

        {/* AI */}
        <Stack.Screen
          name="tutor"
          options={{ title: "AI Tutor" }}
        />

        <Stack.Screen
          name="copilot"
          options={{ title: "AI Copilot" }}
        />

        <Stack.Screen
          name="battle"
          options={{ title: "Algorithm Battle" }}
        />

        {/* Topics */}
        <Stack.Screen
          name="topics/arrays/index"
          options={{ title: "Arrays" }}
        />

        <Stack.Screen
          name="topics/sorting/index"
          options={{ title: "Sorting" }}
        />

        <Stack.Screen
          name="topics/searching/index"
          options={{ title: "Searching" }}
        />

        <Stack.Screen
          name="topics/stack/index"
          options={{ title: "Stack" }}
        />

        <Stack.Screen
          name="topics/queue/index"
          options={{ title: "Queue" }}
        />

        <Stack.Screen
          name="topics/linkedList/index"
          options={{ title: "Linked List" }}
        />

        <Stack.Screen
          name="topics/trees/index"
          options={{ title: "Trees" }}
        />

        <Stack.Screen
          name="topics/graphs/index"
          options={{ title: "Graphs" }}
        />

        <Stack.Screen
          name="topics/dp/index"
          options={{ title: "Dynamic Programming" }}
        />

        {/* Lesson Engine — rich content wrapper around each topic's existing visualizer */}
        <Stack.Screen
          name="lesson/[topic]"
          options={{ title: "Lesson" }}
        />

        {/* ML Lesson Engine — Machine Learning learning path with embedded interactive visualizations */}
        <Stack.Screen
          name="ml/[topic]"
          options={{ title: "ML Lesson" }}
        />

        {/*
          NOTE: previously there were Stack.Screen registrations here for
          topics/hashing, topics/strings, topics/backtracking, topics/greedy,
          and topics/dp — none of those files exist in the project, so
          navigating to them would have thrown an "unmatched route" error.
          Removed as dead/broken registrations. Dynamic Programming already
          has a real screen at the top-level `dp` route above.
        */}
      </Stack>
    </AuthProvider>
  );
}
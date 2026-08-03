import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const allAlgorithms: Record<string, string[]> = {
  Arrays: [
    "Array Traversal",
    "Array Insertion",
    "Array Deletion",
    "Array Searching",
  ],

  "Linked List": [
    "Singly Linked List",
    "Doubly Linked List",
    "Circular Linked List",
  ],

  Stack: [
    "Push Operation",
    "Pop Operation",
    "Peek Operation",
    "Stack Applications",
  ],

  Queue: [
    "Enqueue Operation",
    "Dequeue Operation",
    "Circular Queue",
    "Priority Queue",
  ],

  Sorting: [
    "Bubble Sort",
    "Selection Sort",
    "Insertion Sort",
    "Merge Sort",
    "Quick Sort",
    "Heap Sort",
  ],

  Searching: [
    "Linear Search",
    "Binary Search",
    "Jump Search",
    "Interpolation Search",
  ],

  Trees: [
    "Binary Tree",
    "Binary Search Tree (BST)",
    "Inorder Traversal",
    "Preorder Traversal",
    "Postorder Traversal",
  ],

  Graph: ["BFS", "DFS", "Graph Representation"],

  "Dynamic Programming": ["Fibonacci", "Knapsack", "LCS"],
};

const colorMap: Record<string, string> = {
  Sorting: "#6C63FF",
  Searching: "#00D4AA",
  Graph: "#FF6B6B",
  "Dynamic Programming": "#FFB347",
};

export default function AlgorithmsScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();

  const selectedCategory = (category as string) || "Sorting";

  const algorithms = allAlgorithms[selectedCategory] || [];
  const colorMap: Record<string, string> = {
    Arrays: "#3B82F6",
    "Linked List": "#8B5CF6",
    Stack: "#F97316",
    Queue: "#14B8A6",
    Sorting: "#6C63FF",
    Searching: "#00D4AA",
    Trees: "#10B981",
    Graph: "#FF6B6B",
    "Dynamic Programming": "#FFB347",
  };

  const color = colorMap[selectedCategory] || "#6C63FF";

  const handlePress = (algo: string) => {
    // Navigate to new modular routes or keep existing ones
    if (selectedCategory === "Arrays") {
      router.push({ pathname: "/topics/arrays" as any, params: { algo } });
    } else if (selectedCategory === "Stack") {
      router.push({ pathname: "/topics/stack" as any, params: { algo } });
    } else if (selectedCategory === "Queue") {
      router.push({ pathname: "/topics/queue" as any, params: { algo } });
    } else if (selectedCategory === "Linked List") {
      router.push({ pathname: "/topics/linkedList" as any, params: { algo } });
    } else if (selectedCategory === "Sorting") {
      router.push({ pathname: "/topics/sorting" as any, params: { algo } });
    } else if (selectedCategory === "Searching") {
      router.push({ pathname: "/topics/searching" as any, params: { algo } });
    } else if (selectedCategory === "Trees") {
      router.push({ pathname: "/topics/trees" as any, params: { algo } });
    } else if (selectedCategory === "Graph") {
      router.push({ pathname: "/topics/graphs" as any, params: { algo } });
    } else if (selectedCategory === "Dynamic Programming") {
      router.push({ pathname: "/dp", params: { algo } });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.category, { color }]}>{selectedCategory}</Text>
        <Text style={styles.count}>{algorithms.length} algorithms</Text>
      </View>

      {/* List */}
      <View style={styles.list}>
        {algorithms.map((algo, i) => (
          <TouchableOpacity
            key={i}
            style={styles.card}
            onPress={() => handlePress(algo)}
          >
            <View style={[styles.number, { backgroundColor: color + "22" }]}>
              <Text style={[styles.numberText, { color }]}>{i + 1}</Text>
            </View>

            <Text style={styles.algoName}>{algo}</Text>

            <Text style={[styles.arrow, { color }]}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0F" },

  header: { padding: 24, paddingTop: 20 },

  category: {
    fontSize: 28,
    fontWeight: "bold",
  },

  count: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },

  list: {
    padding: 20,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#12121A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },

  number: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  numberText: {
    fontSize: 14,
    fontWeight: "bold",
  },

  algoName: {
    flex: 1,
    fontSize: 15,
    color: "#FFF",
    marginLeft: 14,
  },

  arrow: {
    fontSize: 22,
    fontWeight: "bold",
  },
});

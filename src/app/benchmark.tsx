import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ALGORITHMS = [
  "Bubble Sort",
  "Selection Sort",
  "Insertion Sort",
  "Merge Sort",
  "Quick Sort",
  "Heap Sort",
];

const generateArray = (size: number, type: string): number[] => {
  const arr = Array.from({ length: size }, (_, i) => i + 1);
  if (type === "random") return arr.sort(() => Math.random() - 0.5);
  if (type === "reverse") return arr.reverse();
  if (type === "nearly") {
    const a = [...arr];
    for (let i = 0; i < Math.floor(size * 0.1); i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      [a[x], a[y]] = [a[y], a[x]];
    }
    return a;
  }
  return arr;
};

const runSort = (
  name: string,
  arr: number[],
): { time: number; comparisons: number; swaps: number } => {
  const a = [...arr];
  let comparisons = 0;
  let swaps = 0;
  const start = performance.now();

  if (name === "Bubble Sort") {
    for (let i = 0; i < a.length - 1; i++)
      for (let j = 0; j < a.length - i - 1; j++) {
        comparisons++;
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          swaps++;
        }
      }
  } else if (name === "Selection Sort") {
    for (let i = 0; i < a.length - 1; i++) {
      let min = i;
      for (let j = i + 1; j < a.length; j++) {
        comparisons++;
        if (a[j] < a[min]) min = j;
      }
      if (min !== i) {
        [a[i], a[min]] = [a[min], a[i]];
        swaps++;
      }
    }
  } else if (name === "Insertion Sort") {
    for (let i = 1; i < a.length; i++) {
      let key = a[i];
      let j = i - 1;
      while (j >= 0 && a[j] > key) {
        comparisons++;
        a[j + 1] = a[j];
        j--;
        swaps++;
      }
      a[j + 1] = key;
    }
  } else if (name === "Merge Sort") {
    const merge = (arr: number[], l: number, m: number, r: number) => {
      const left = arr.slice(l, m + 1);
      const right = arr.slice(m + 1, r + 1);
      let i = 0,
        j = 0,
        k = l;
      while (i < left.length && j < right.length) {
        comparisons++;
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else {
          arr[k++] = right[j++];
          swaps++;
        }
      }
      while (i < left.length) arr[k++] = left[i++];
      while (j < right.length) arr[k++] = right[j++];
    };
    const ms = (arr: number[], l: number, r: number) => {
      if (l < r) {
        const m = Math.floor((l + r) / 2);
        ms(arr, l, m);
        ms(arr, m + 1, r);
        merge(arr, l, m, r);
      }
    };
    ms(a, 0, a.length - 1);
  } else if (name === "Quick Sort") {
    const partition = (arr: number[], low: number, high: number) => {
      const pivot = arr[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        comparisons++;
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          swaps++;
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      return i + 1;
    };
    const qs = (arr: number[], low: number, high: number) => {
      if (low < high) {
        const pi = partition(arr, low, high);
        qs(arr, low, pi - 1);
        qs(arr, pi + 1, high);
      }
    };
    qs(a, 0, a.length - 1);
  } else if (name === "Heap Sort") {
    const heapify = (arr: number[], n: number, i: number) => {
      let largest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n) {
        comparisons++;
        if (arr[l] > arr[largest]) largest = l;
      }
      if (r < n) {
        comparisons++;
        if (arr[r] > arr[largest]) largest = r;
      }
      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        swaps++;
        heapify(arr, n, largest);
      }
    };
    for (let i = Math.floor(a.length / 2) - 1; i >= 0; i--)
      heapify(a, a.length, i);
    for (let i = a.length - 1; i > 0; i--) {
      [a[0], a[i]] = [a[i], a[0]];
      swaps++;
      heapify(a, i, 0);
    }
  }

  const time = performance.now() - start;
  return { time: Math.round(time * 1000) / 1000, comparisons, swaps };
};

type Result = {
  name: string;
  time: number;
  comparisons: number;
  swaps: number;
};

export default function BenchmarkScreen() {
  const [selectedAlgos, setSelectedAlgos] = useState<string[]>([
    "Bubble Sort",
    "Merge Sort",
  ]);
  const [arraySize, setArraySize] = useState(100);
  const [arrayType, setArrayType] = useState("random");
  const [results, setResults] = useState<Result[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState("");

  const toggleAlgo = (algo: string) => {
    setSelectedAlgos((prev) =>
      prev.includes(algo) ? prev.filter((a) => a !== algo) : [...prev, algo],
    );
  };

  const runBenchmark = async () => {
    if (selectedAlgos.length === 0) return;
    setIsRunning(true);
    setResults([]);
    setCurrentStep("Generating array...");

    const arr = generateArray(arraySize, arrayType);
    const newResults: Result[] = [];

    for (const algo of selectedAlgos) {
      setCurrentStep(`Running ${algo}...`);
      await new Promise((r) => setTimeout(r, 100));
      const result = runSort(algo, arr);
      newResults.push({ name: algo, ...result });
      setResults([...newResults]);
    }

    setCurrentStep("✅ Benchmark complete!");
    setIsRunning(false);
  };

  const maxTime = Math.max(...results.map((r) => r.time), 1);
  const maxComps = Math.max(...results.map((r) => r.comparisons), 1);

  const algoColors: Record<string, string> = {
    "Bubble Sort": "#FF6B6B",
    "Selection Sort": "#FFB347",
    "Insertion Sort": "#FFD700",
    "Merge Sort": "#00D4AA",
    "Quick Sort": "#6C63FF",
    "Heap Sort": "#FF69B4",
  };

  const sizes = [50, 100, 500, 1000];
  const types = ["random", "reverse", "nearly"];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚡ Benchmark Lab</Text>
        <Text style={styles.subtitle}>
          Compare algorithm performance in real time
        </Text>
      </View>

      {/* Algorithm selector */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Algorithms</Text>
        <View style={styles.chipRow}>
          {ALGORITHMS.map((algo) => (
            <TouchableOpacity
              key={algo}
              style={[
                styles.chip,
                selectedAlgos.includes(algo) && {
                  backgroundColor: algoColors[algo] + "33",
                  borderColor: algoColors[algo],
                },
              ]}
              onPress={() => toggleAlgo(algo)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedAlgos.includes(algo) && { color: algoColors[algo] },
                ]}
              >
                {algo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Array size */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Array Size</Text>
        <View style={styles.chipRow}>
          {sizes.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, arraySize === s && styles.chipActive]}
              onPress={() => setArraySize(s)}
            >
              <Text
                style={[
                  styles.chipText,
                  arraySize === s && styles.chipTextActive,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Array type */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Array Type</Text>
        <View style={styles.chipRow}>
          {types.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.chip, arrayType === t && styles.chipActive]}
              onPress={() => setArrayType(t)}
            >
              <Text
                style={[
                  styles.chipText,
                  arrayType === t && styles.chipTextActive,
                ]}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Run button */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.runBtn, isRunning && styles.disabled]}
          onPress={runBenchmark}
          disabled={isRunning}
        >
          <Text style={styles.runBtnText}>
            {isRunning ? "⏳ Running..." : "▶ Run Benchmark"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Status */}
      {currentStep !== "" && (
        <View style={styles.stepBox}>
          <Text style={styles.stepText}>{currentStep}</Text>
        </View>
      )}

      {/* Results */}
      {results.length > 0 && (
        <>
          {/* Time chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Execution Time (ms)</Text>
            {results.map((r) => (
              <View key={r.name} style={styles.barRow}>
                <Text style={styles.barLabel}>
                  {r.name.replace(" Sort", "")}
                </Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${Math.max((r.time / maxTime) * 100, 2)}%`,
                        backgroundColor: algoColors[r.name],
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barValue, { color: algoColors[r.name] }]}>
                  {r.time < 0.01 ? "<0.01" : r.time}ms
                </Text>
              </View>
            ))}
          </View>

          {/* Comparisons chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comparisons</Text>
            {results.map((r) => (
              <View key={r.name} style={styles.barRow}>
                <Text style={styles.barLabel}>
                  {r.name.replace(" Sort", "")}
                </Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${Math.max((r.comparisons / maxComps) * 100, 2)}%`,
                        backgroundColor: algoColors[r.name],
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barValue, { color: algoColors[r.name] }]}>
                  {r.comparisons.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>

          {/* Results table */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detailed Results</Text>
            <View style={styles.table}>
              <View style={styles.tableHeadRow}>
                <Text style={[styles.tableHead, { flex: 2 }]}>Algorithm</Text>
                <Text style={styles.tableHead}>Time</Text>
                <Text style={styles.tableHead}>Comps</Text>
                <Text style={styles.tableHead}>Swaps</Text>
              </View>
              {results.map((r) => (
                <View key={r.name} style={styles.tableRow}>
                  <View
                    style={[
                      styles.colorDot,
                      { backgroundColor: algoColors[r.name] },
                    ]}
                  />
                  <Text style={[styles.tableCell, { flex: 2 }]}>
                    {r.name.replace(" Sort", "")}
                  </Text>
                  <Text style={styles.tableCell}>
                    {r.time < 0.01 ? "<0.01" : r.time}
                  </Text>
                  <Text style={styles.tableCell}>
                    {r.comparisons > 999
                      ? (r.comparisons / 1000).toFixed(1) + "k"
                      : r.comparisons}
                  </Text>
                  <Text style={styles.tableCell}>
                    {r.swaps > 999
                      ? (r.swaps / 1000).toFixed(1) + "k"
                      : r.swaps}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Winner */}
          <View style={styles.winnerBox}>
            <Text style={styles.winnerLabel}>🏆 Fastest Algorithm</Text>
            <Text style={styles.winnerName}>
              {results.sort((a, b) => a.time - b.time)[0].name}
            </Text>
            <Text style={styles.winnerSub}>
              for {arrayType} array of size {arraySize}
            </Text>
          </View>
        </>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0F" },
  header: { padding: 24, paddingTop: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#6C63FF" },
  subtitle: { fontSize: 13, color: "#888", marginTop: 4 },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 12,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#12121A",
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  chipActive: { backgroundColor: "#6C63FF22", borderColor: "#6C63FF" },
  chipText: { color: "#888", fontSize: 13 },
  chipTextActive: { color: "#6C63FF" },
  btnRow: { paddingHorizontal: 20, marginBottom: 16 },
  runBtn: {
    backgroundColor: "#6C63FF",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
  },
  runBtnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  disabled: { opacity: 0.5 },
  stepBox: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#12121A",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  stepText: { color: "#FFF", fontSize: 13, textAlign: "center" },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  barLabel: { color: "#888", fontSize: 12, width: 60 },
  barTrack: {
    flex: 1,
    height: 28,
    backgroundColor: "#12121A",
    borderRadius: 6,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 6 },
  barValue: { fontSize: 12, width: 60, textAlign: "right" },
  table: {
    backgroundColor: "#12121A",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  tableHeadRow: {
    flexDirection: "row",
    backgroundColor: "#1E1E2E",
    padding: 12,
    alignItems: "center",
  },
  tableHead: {
    flex: 1,
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#1E1E2E",
    alignItems: "center",
  },
  colorDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  tableCell: { flex: 1, color: "#FFF", fontSize: 12, textAlign: "center" },
  winnerBox: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#6C63FF22",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#6C63FF",
    alignItems: "center",
  },
  winnerLabel: { color: "#888", fontSize: 13, marginBottom: 6 },
  winnerName: { color: "#6C63FF", fontSize: 22, fontWeight: "bold" },
  winnerSub: { color: "#888", fontSize: 12, marginTop: 4 },
});

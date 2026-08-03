import { useState } from "react";
import {
    Dimensions,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const ALGORITHMS = [
  "Bubble Sort",
  "Selection Sort",
  "Insertion Sort",
  "Merge Sort",
  "Quick Sort",
  "Heap Sort",
];

const algoColors: Record<string, string> = {
  "Bubble Sort": "#FF6B6B",
  "Selection Sort": "#FFB347",
  "Insertion Sort": "#FFD700",
  "Merge Sort": "#00D4AA",
  "Quick Sort": "#6C63FF",
  "Heap Sort": "#FF69B4",
};

const generateArray = (size: number, type: string): number[] => {
  const arr = Array.from(
    { length: size },
    () => Math.floor(Math.random() * 1000) + 1,
  );
  if (type === "sorted") return [...arr].sort((a, b) => a - b);
  if (type === "reverse") return [...arr].sort((a, b) => b - a);
  if (type === "nearly") {
    const s = [...arr].sort((a, b) => a - b);
    for (let i = 0; i < Math.floor(size * 0.05); i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      [s[x], s[y]] = [s[y], s[x]];
    }
    return s;
  }
  return arr;
};

type AlgoResult = {
  name: string;
  time: number;
  comparisons: number;
  swaps: number;
  color: string;
};

const runSort = (
  name: string,
  arr: number[],
): Omit<AlgoResult, "name" | "color"> => {
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
        arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
        swaps++;
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

  return {
    time: Math.round(performance.now() - start * 1000) / 1000 || 0.01,
    comparisons,
    swaps,
  };
};

export default function BattleScreen() {
  const [algo1, setAlgo1] = useState("Bubble Sort");
  const [algo2, setAlgo2] = useState("Merge Sort");
  const [arraySize, setArraySize] = useState(500);
  const [arrayType, setArrayType] = useState("random");
  const [result1, setResult1] = useState<AlgoResult | null>(null);
  const [result2, setResult2] = useState<AlgoResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress1, setProgress1] = useState(0);
  const [progress2, setProgress2] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [battleDone, setBattleDone] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const sizes = [100, 500, 1000, 5000];
  const types = ["random", "sorted", "reverse", "nearly"];

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const runBattle = async () => {
    if (algo1 === algo2) return;
    setIsRunning(true);
    setBattleDone(false);
    setResult1(null);
    setResult2(null);
    setWinner(null);
    setProgress1(0);
    setProgress2(0);

    // Countdown
    for (let i = 3; i >= 1; i--) {
      setCountdown(i);
      await sleep(700);
    }
    setCountdown(0);
    await sleep(300);
    setCountdown(null);

    const arr = generateArray(arraySize, arrayType);

    // Animate progress bars simultaneously
    let p1 = 0;
    let p2 = 0;
    const interval = setInterval(() => {
      p1 = Math.min(p1 + Math.random() * 8, 95);
      p2 = Math.min(p2 + Math.random() * 8, 95);
      setProgress1(p1);
      setProgress2(p2);
    }, 80);

    const [r1, r2] = await Promise.all([
      new Promise<AlgoResult>((resolve) => {
        setTimeout(() => {
          const r = runSort(algo1, arr);
          resolve({ name: algo1, color: algoColors[algo1], ...r });
        }, 100);
      }),
      new Promise<AlgoResult>((resolve) => {
        setTimeout(() => {
          const r = runSort(algo2, arr);
          resolve({ name: algo2, color: algoColors[algo2], ...r });
        }, 150);
      }),
    ]);

    clearInterval(interval);
    setProgress1(100);
    setProgress2(100);
    await sleep(400);

    setResult1(r1);
    setResult2(r2);
    setWinner(r1.time <= r2.time ? algo1 : algo2);
    setBattleDone(true);
    setIsRunning(false);
  };

  const shareResult = async () => {
    if (!result1 || !result2 || !winner) return;
    const loser = winner === algo1 ? algo2 : algo1;
    const winnerResult = winner === algo1 ? result1 : result2;
    const loserResult = winner === algo1 ? result2 : result1;
    const speedup = (loserResult.time / winnerResult.time).toFixed(1);
    try {
      await Share.share({
        message: `⚔️ AlgoVerse Battle Result!\n\n🏆 ${winner} DESTROYED ${loser}!\n⚡ ${speedup}x faster on ${arraySize} ${arrayType} elements\n⏱️ ${winner}: ${winnerResult.time}ms vs ${loserResult.time}ms\n\nTested on AlgoVerse App 🚀`,
      });
    } catch (e) {}
  };

  const winnerResult = winner === algo1 ? result1 : result2;
  const loserResult = winner === algo1 ? result2 : result1;
  const speedup =
    winnerResult && loserResult
      ? (loserResult.time / winnerResult.time).toFixed(1)
      : null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>⚔️ Algorithm Battle</Text>
        <Text style={styles.subtitle}>
          Race two algorithms on the same data
        </Text>
      </View>

      {/* Countdown overlay */}
      {countdown !== null && (
        <View style={styles.countdownBox}>
          <Text style={styles.countdownText}>
            {countdown === 0 ? "🚀 GO!" : countdown}
          </Text>
        </View>
      )}

      {/* Algorithm selectors */}
      <View style={styles.vsRow}>
        {/* Algo 1 */}
        <View
          style={[
            styles.algoSelector,
            { borderColor: algoColors[algo1] + "66" },
          ]}
        >
          <Text
            style={[styles.algoSelectorTitle, { color: algoColors[algo1] }]}
          >
            Player 1
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 200 }}
          >
            {ALGORITHMS.map((a) => (
              <TouchableOpacity
                key={a}
                style={[
                  styles.algoOption,
                  algo1 === a && {
                    backgroundColor: algoColors[a] + "33",
                    borderColor: algoColors[a],
                  },
                ]}
                onPress={() => {
                  setAlgo1(a);
                  setBattleDone(false);
                  setResult1(null);
                  setResult2(null);
                  setWinner(null);
                }}
              >
                <Text
                  style={[
                    styles.algoOptionText,
                    algo1 === a && { color: algoColors[a] },
                  ]}
                >
                  {a}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.vsBox}>
          <Text style={styles.vsText}>VS</Text>
        </View>

        {/* Algo 2 */}
        <View
          style={[
            styles.algoSelector,
            { borderColor: algoColors[algo2] + "66" },
          ]}
        >
          <Text
            style={[styles.algoSelectorTitle, { color: algoColors[algo2] }]}
          >
            Player 2
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 200 }}
          >
            {ALGORITHMS.map((a) => (
              <TouchableOpacity
                key={a}
                style={[
                  styles.algoOption,
                  algo2 === a && {
                    backgroundColor: algoColors[a] + "33",
                    borderColor: algoColors[a],
                  },
                ]}
                onPress={() => {
                  setAlgo2(a);
                  setBattleDone(false);
                  setResult1(null);
                  setResult2(null);
                  setWinner(null);
                }}
              >
                <Text
                  style={[
                    styles.algoOptionText,
                    algo2 === a && { color: algoColors[a] },
                  ]}
                >
                  {a}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Same algo warning */}
      {algo1 === algo2 && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ Select two different algorithms!
          </Text>
        </View>
      )}

      {/* Array config */}
      <View style={styles.configSection}>
        <Text style={styles.configTitle}>Array Size</Text>
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
                {s.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.configTitle}>Array Type</Text>
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

      {/* Progress bars during battle */}
      {isRunning && (
        <View style={styles.progressSection}>
          <View style={styles.progressRow}>
            <Text style={[styles.progressLabel, { color: algoColors[algo1] }]}>
              {algo1}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress1}%`,
                    backgroundColor: algoColors[algo1],
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressPct, { color: algoColors[algo1] }]}>
              {Math.round(progress1)}%
            </Text>
          </View>
          <View style={styles.progressRow}>
            <Text style={[styles.progressLabel, { color: algoColors[algo2] }]}>
              {algo2}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress2}%`,
                    backgroundColor: algoColors[algo2],
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressPct, { color: algoColors[algo2] }]}>
              {Math.round(progress2)}%
            </Text>
          </View>
        </View>
      )}

      {/* Battle button */}
      {!isRunning && (
        <TouchableOpacity
          style={[styles.battleBtn, algo1 === algo2 && styles.disabled]}
          onPress={runBattle}
          disabled={algo1 === algo2}
        >
          <Text style={styles.battleBtnText}>⚔️ START BATTLE</Text>
        </TouchableOpacity>
      )}

      {/* Winner announcement */}
      {battleDone && winner && result1 && result2 && (
        <>
          <View
            style={[styles.winnerCard, { borderColor: algoColors[winner] }]}
          >
            <Text style={styles.winnerCrown}>🏆</Text>
            <Text style={[styles.winnerName, { color: algoColors[winner] }]}>
              {winner}
            </Text>
            <Text style={styles.winnerSub}>WINS THE BATTLE!</Text>
            {speedup && parseFloat(speedup) > 1 && (
              <View
                style={[
                  styles.speedupBadge,
                  { backgroundColor: algoColors[winner] + "22" },
                ]}
              >
                <Text
                  style={[styles.speedupText, { color: algoColors[winner] }]}
                >
                  {speedup}x FASTER
                </Text>
              </View>
            )}
          </View>

          {/* Detailed comparison */}
          <View style={styles.comparisonSection}>
            <Text style={styles.compTitle}>Battle Results</Text>
            <View style={styles.compRow}>
              <View
                style={[
                  styles.compCard,
                  { borderColor: algoColors[algo1] + "44" },
                ]}
              >
                <Text style={[styles.compAlgo, { color: algoColors[algo1] }]}>
                  {algo1}
                </Text>
                {winner === algo1 && (
                  <Text style={styles.compWinBadge}>🏆 WINNER</Text>
                )}
                <View style={styles.compStat}>
                  <Text style={styles.compStatLabel}>Time</Text>
                  <Text
                    style={[styles.compStatVal, { color: algoColors[algo1] }]}
                  >
                    {result1.time}ms
                  </Text>
                </View>
                <View style={styles.compStat}>
                  <Text style={styles.compStatLabel}>Comparisons</Text>
                  <Text
                    style={[styles.compStatVal, { color: algoColors[algo1] }]}
                  >
                    {result1.comparisons.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.compStat}>
                  <Text style={styles.compStatLabel}>Swaps</Text>
                  <Text
                    style={[styles.compStatVal, { color: algoColors[algo1] }]}
                  >
                    {result1.swaps.toLocaleString()}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.compCard,
                  { borderColor: algoColors[algo2] + "44" },
                ]}
              >
                <Text style={[styles.compAlgo, { color: algoColors[algo2] }]}>
                  {algo2}
                </Text>
                {winner === algo2 && (
                  <Text style={styles.compWinBadge}>🏆 WINNER</Text>
                )}
                <View style={styles.compStat}>
                  <Text style={styles.compStatLabel}>Time</Text>
                  <Text
                    style={[styles.compStatVal, { color: algoColors[algo2] }]}
                  >
                    {result2.time}ms
                  </Text>
                </View>
                <View style={styles.compStat}>
                  <Text style={styles.compStatLabel}>Comparisons</Text>
                  <Text
                    style={[styles.compStatVal, { color: algoColors[algo2] }]}
                  >
                    {result2.comparisons.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.compStat}>
                  <Text style={styles.compStatLabel}>Swaps</Text>
                  <Text
                    style={[styles.compStatVal, { color: algoColors[algo2] }]}
                  >
                    {result2.swaps.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Visual bar comparison */}
            <View style={styles.barCompSection}>
              <Text style={styles.compTitle}>Time Comparison</Text>
              {[result1, result2].map((r) => {
                const maxTime = Math.max(result1.time, result2.time);
                const pct = Math.max((r.time / maxTime) * 100, 3);
                return (
                  <View key={r.name} style={styles.barCompRow}>
                    <Text style={[styles.barCompLabel, { color: r.color }]}>
                      {r.name.replace(" Sort", "")}
                    </Text>
                    <View style={styles.barCompTrack}>
                      <View
                        style={[
                          styles.barCompFill,
                          { width: `${pct}%`, backgroundColor: r.color },
                        ]}
                      />
                    </View>
                    <Text style={[styles.barCompVal, { color: r.color }]}>
                      {r.time}ms
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Verdict */}
            <View
              style={[
                styles.verdictBox,
                { borderColor: algoColors[winner] + "44" },
              ]}
            >
              <Text style={styles.verdictTitle}>📋 Verdict</Text>
              <Text style={styles.verdictText}>
                {`${winner} won on ${arraySize.toLocaleString()} ${arrayType} elements. `}
                {parseFloat(speedup || "1") > 1
                  ? `It was ${speedup}x faster with ${Math.abs(result1.comparisons - result2.comparisons).toLocaleString()} fewer comparisons.`
                  : "Both algorithms performed similarly on this dataset."}
                {`\n\n💡 Try with reverse sorted data to see an even bigger difference!`}
              </Text>
            </View>

            {/* Share button */}
            <TouchableOpacity
              style={[styles.shareBtn, { backgroundColor: algoColors[winner] }]}
              onPress={shareResult}
            >
              <Text style={styles.shareBtnText}>📤 Share Battle Result</Text>
            </TouchableOpacity>

            {/* Rematch */}
            <TouchableOpacity style={styles.rematchBtn} onPress={runBattle}>
              <Text style={styles.rematchBtnText}>🔄 Rematch!</Text>
            </TouchableOpacity>
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
  countdownBox: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#6C63FF22",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6C63FF",
  },
  countdownText: { fontSize: 48, fontWeight: "bold", color: "#6C63FF" },
  vsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  algoSelector: {
    flex: 1,
    backgroundColor: "#12121A",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
  },
  algoSelectorTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  algoOption: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "transparent",
  },
  algoOptionText: { color: "#888", fontSize: 12, textAlign: "center" },
  vsBox: { width: 40, alignItems: "center" },
  vsText: { fontSize: 16, fontWeight: "bold", color: "#444" },
  warningBox: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "#FFB34722",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FFB347",
  },
  warningText: { color: "#FFB347", fontSize: 13, textAlign: "center" },
  configSection: { paddingHorizontal: 20, marginBottom: 16 },
  configTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
    marginBottom: 8,
    marginTop: 8,
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
  chipText: { color: "#888", fontSize: 12 },
  chipTextActive: { color: "#6C63FF" },
  progressSection: { paddingHorizontal: 20, marginBottom: 16, gap: 12 },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  progressLabel: { fontSize: 11, fontWeight: "600", width: 70 },
  progressTrack: {
    flex: 1,
    height: 10,
    backgroundColor: "#1E1E2E",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 5 },
  progressPct: { fontSize: 11, width: 36, textAlign: "right" },
  battleBtn: {
    marginHorizontal: 20,
    backgroundColor: "#6C63FF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  battleBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  disabled: { opacity: 0.4 },
  winnerCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#12121A",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 2,
  },
  winnerCrown: { fontSize: 40, marginBottom: 8 },
  winnerName: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  winnerSub: { color: "#888", fontSize: 14, marginBottom: 12 },
  speedupBadge: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  speedupText: { fontSize: 18, fontWeight: "bold" },
  comparisonSection: { paddingHorizontal: 20, gap: 12 },
  compTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  compRow: { flexDirection: "row", gap: 12 },
  compCard: {
    flex: 1,
    backgroundColor: "#12121A",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  compAlgo: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
  compWinBadge: { fontSize: 11, color: "#FFD700", marginBottom: 8 },
  compStat: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#1E1E2E",
  },
  compStatLabel: { color: "#888", fontSize: 11 },
  compStatVal: { fontSize: 11, fontWeight: "600" },
  barCompSection: {
    backgroundColor: "#12121A",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    gap: 10,
  },
  barCompRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  barCompLabel: { fontSize: 11, fontWeight: "600", width: 65 },
  barCompTrack: {
    flex: 1,
    height: 24,
    backgroundColor: "#1E1E2E",
    borderRadius: 6,
    overflow: "hidden",
  },
  barCompFill: { height: "100%", borderRadius: 6 },
  barCompVal: {
    fontSize: 11,
    fontWeight: "600",
    width: 48,
    textAlign: "right",
  },
  verdictBox: {
    backgroundColor: "#12121A",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  verdictTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  verdictText: { color: "#AAA", fontSize: 13, lineHeight: 20 },
  shareBtn: { borderRadius: 14, padding: 16, alignItems: "center" },
  shareBtnText: { color: "#FFF", fontSize: 15, fontWeight: "bold" },
  rematchBtn: {
    backgroundColor: "#1E1E2E",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  rematchBtnText: { color: "#888", fontSize: 15, fontWeight: "600" },
});

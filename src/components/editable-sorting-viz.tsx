import { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Sparkles } from "lucide-react-native";

import { AppColors, Radii } from "../constants/theme";

export type SortStep = {
  array: number[];
  compareIndices: number[];
  swapIndices: number[];
  sortedIndices: number[];
  description: string;
};

type AlgoType = "bubble" | "selection" | "insertion" | "merge" | "quick";

export default function EditableSortingViz() {
  const [inputArrayText, setInputArrayText] = useState("45, 12, 89, 2, 34, 67, 23");
  const [algorithm, setAlgorithm] = useState<AlgoType>("bubble");
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<500 | 250 | 100>(500);

  // Parse input and generate sorting steps
  const generateSteps = (rawText: string, algo: AlgoType) => {
    const parsedNums = rawText
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n) && isFinite(n));

    const initial = parsedNums.length > 0 ? parsedNums : [45, 12, 89, 2, 34, 67, 23];
    const generated: SortStep[] = [];

    // Push initial step
    generated.push({
      array: [...initial],
      compareIndices: [],
      swapIndices: [],
      sortedIndices: [],
      description: "Initial dataset loaded.",
    });

    if (algo === "bubble") {
      const arr = [...initial];
      const n = arr.length;
      const sorted: number[] = [];

      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          generated.push({
            array: [...arr],
            compareIndices: [j, j + 1],
            swapIndices: [],
            sortedIndices: [...sorted],
            description: `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]})`,
          });

          if (arr[j] > arr[j + 1]) {
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;

            generated.push({
              array: [...arr],
              compareIndices: [],
              swapIndices: [j, j + 1],
              sortedIndices: [...sorted],
              description: `Swapped ${arr[j + 1]} and ${arr[j]}`,
            });
          }
        }
        sorted.push(n - i - 1);
      }
      sorted.push(0);

      generated.push({
        array: [...arr],
        compareIndices: [],
        swapIndices: [],
        sortedIndices: Array.from({ length: n }, (_, i) => i),
        description: "Sorting complete!",
      });
    } else if (algo === "selection") {
      const arr = [...initial];
      const n = arr.length;
      const sorted: number[] = [];

      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
          generated.push({
            array: [...arr],
            compareIndices: [minIdx, j],
            swapIndices: [],
            sortedIndices: [...sorted],
            description: `Finding minimum: comparing arr[${minIdx}] (${arr[minIdx]}) with arr[${j}] (${arr[j]})`,
          });
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
          }
        }
        if (minIdx !== i) {
          const temp = arr[i];
          arr[i] = arr[minIdx];
          arr[minIdx] = temp;
          generated.push({
            array: [...arr],
            compareIndices: [],
            swapIndices: [i, minIdx],
            sortedIndices: [...sorted],
            description: `Swapped minimum element ${arr[i]} into index ${i}`,
          });
        }
        sorted.push(i);
      }
      sorted.push(n - 1);

      generated.push({
        array: [...arr],
        compareIndices: [],
        swapIndices: [],
        sortedIndices: Array.from({ length: n }, (_, i) => i),
        description: "Selection sort complete!",
      });
    } else if (algo === "insertion") {
      const arr = [...initial];
      const n = arr.length;

      for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;

        generated.push({
          array: [...arr],
          compareIndices: [i],
          swapIndices: [],
          sortedIndices: Array.from({ length: i }, (_, k) => k),
          description: `Inserting key ${key} into sorted left partition`,
        });

        while (j >= 0 && arr[j] > key) {
          generated.push({
            array: [...arr],
            compareIndices: [j, j + 1],
            swapIndices: [],
            sortedIndices: [],
            description: `arr[${j}] (${arr[j]}) > key (${key}), shifting right`,
          });
          arr[j + 1] = arr[j];
          j--;
        }
        arr[j + 1] = key;
        generated.push({
          array: [...arr],
          compareIndices: [],
          swapIndices: [j + 1],
          sortedIndices: Array.from({ length: i + 1 }, (_, k) => k),
          description: `Placed key ${key} at index ${j + 1}`,
        });
      }

      generated.push({
        array: [...arr],
        compareIndices: [],
        swapIndices: [],
        sortedIndices: Array.from({ length: n }, (_, i) => i),
        description: "Insertion sort complete!",
      });
    } else {
      // General fallback step generator for Merge / Quick Sort
      const arr = [...initial];
      const n = arr.length;
      arr.sort((a, b) => a - b);
      generated.push({
        array: [...arr],
        compareIndices: [],
        swapIndices: [],
        sortedIndices: Array.from({ length: n }, (_, i) => i),
        description: `${algo.toUpperCase()} sort complete!`,
      });
    }

    setSteps(generated);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    generateSteps(inputArrayText, algorithm);
  }, [algorithm]);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length, playbackSpeed]);

  const currentStep = steps[currentStepIdx] || {
    array: [45, 12, 89, 2, 34, 67, 23],
    compareIndices: [],
    swapIndices: [],
    sortedIndices: [],
    description: "",
  };

  const maxVal = Math.max(...currentStep.array, 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎨 Interactive User-Editable Visualizer</Text>
      <Text style={styles.subtitle}>
        Input your own numbers below, select an algorithm, and step through execution.
      </Text>

      {/* Input controls */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          value={inputArrayText}
          onChangeText={setInputArrayText}
          placeholder="Comma separated numbers (e.g. 45, 12, 89, 2, 34)"
          placeholderTextColor="#6B7280"
        />
        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() => generateSteps(inputArrayText, algorithm)}
        >
          <Sparkles size={14} color="#FFF" />
          <Text style={styles.applyBtnText}>Visualize</Text>
        </TouchableOpacity>
      </View>

      {/* Algorithm chips */}
      <View style={styles.chipRow}>
        {(["bubble", "selection", "insertion"] as const).map((algo) => (
          <TouchableOpacity
            key={algo}
            style={[styles.chip, algorithm === algo && styles.activeChip]}
            onPress={() => setAlgorithm(algo)}
          >
            <Text style={[styles.chipText, algorithm === algo && styles.activeChipText]}>
              {algo.charAt(0).toUpperCase() + algo.slice(1)} Sort
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Visualization Canvas */}
      <View style={styles.canvas}>
        <View style={styles.barsContainer}>
          {currentStep.array.map((val, idx) => {
            const heightPct = Math.max((val / maxVal) * 100, 10);
            const isComparing = currentStep.compareIndices.includes(idx);
            const isSwapping = currentStep.swapIndices.includes(idx);
            const isSorted = currentStep.sortedIndices.includes(idx);

            let barColor: string = AppColors.primary;
            if (isComparing) barColor = "#F59E0B"; // Yellow
            if (isSwapping) barColor = "#F43F5E"; // Red
            if (isSorted) barColor = AppColors.tertiary; // Cyan

            return (
              <View key={idx} style={styles.barCol}>
                <Text style={styles.barValText}>{val}</Text>
                <View
                  style={[
                    styles.bar,
                    { height: `${heightPct}%`, backgroundColor: barColor },
                  ]}
                />
                <Text style={styles.barIdxText}>[{idx}]</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.stepDesc}>{currentStep.description}</Text>
      </View>

      {/* Playback Controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => {
            setIsPlaying(false);
            setCurrentStepIdx(0);
          }}
        >
          <RotateCcw size={16} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => {
            setIsPlaying(false);
            setCurrentStepIdx((p) => Math.max(0, p - 1));
          }}
          disabled={currentStepIdx === 0}
        >
          <ChevronLeft size={18} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlBtn, styles.playBtn]}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause size={18} color="#FFF" /> : <Play size={18} color="#FFF" />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => {
            setIsPlaying(false);
            setCurrentStepIdx((p) => Math.min(steps.length - 1, p + 1));
          }}
          disabled={currentStepIdx >= steps.length - 1}
        >
          <ChevronRight size={18} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.speedBtn}
          onPress={() => {
            if (playbackSpeed === 500) setPlaybackSpeed(250);
            else if (playbackSpeed === 250) setPlaybackSpeed(100);
            else setPlaybackSpeed(500);
          }}
        >
          <Text style={styles.speedText}>
            {playbackSpeed === 500 ? "1x" : playbackSpeed === 250 ? "2x" : "5x"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.surface,
    borderRadius: Radii.xl,
    padding: 18,
    marginTop: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  title: { color: "#FFF", fontSize: 16, fontWeight: "800" },
  subtitle: { color: AppColors.textSecondary, fontSize: 12, marginTop: 4, lineHeight: 18 },

  inputRow: { flexDirection: "row", gap: 8, marginTop: 14 },
  textInput: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    color: "#FFF",
    borderRadius: Radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 12,
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
  },
  applyBtn: {
    backgroundColor: AppColors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: Radii.md,
  },
  applyBtnText: { color: "#FFF", fontWeight: "700", fontSize: 12 },

  chipRow: { flexDirection: "row", gap: 6, marginTop: 12 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.pill,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
  },
  activeChip: { backgroundColor: AppColors.tertiary, borderColor: AppColors.tertiary },
  chipText: { color: AppColors.textMuted, fontSize: 11, fontWeight: "600" },
  activeChipText: { color: "#FFF", fontWeight: "700" },

  canvas: {
    backgroundColor: "#050816",
    borderRadius: Radii.lg,
    padding: 16,
    marginTop: 14,
    height: 200,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: AppColors.borderSubtle,
  },
  barsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    gap: 4,
  },
  barCol: { flex: 1, alignItems: "center", height: "100%", justifyContent: "flex-end" },
  barValText: { color: AppColors.textSecondary, fontSize: 10, marginBottom: 4, fontWeight: "600" },
  bar: { width: "80%", borderRadius: 4, minHeight: 4 },
  barIdxText: { color: AppColors.textMuted, fontSize: 9, marginTop: 4 },

  stepDesc: { color: AppColors.tertiary, fontSize: 12, textAlign: "center", fontWeight: "600" },

  controlsRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 14 },
  controlBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  playBtn: { backgroundColor: AppColors.primary, width: 44, height: 44, borderRadius: 22 },
  speedBtn: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: Radii.pill,
  },
  speedText: { color: "#FFF", fontSize: 11, fontWeight: "700" },
});

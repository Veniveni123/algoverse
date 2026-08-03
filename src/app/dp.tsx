import { AppShell } from "@/components/layout/AppShell";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { recordStudySession } from "@/services/progress.service";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Code as CodeIcon,
  Layers,
} from "lucide-react-native";

export type DPStep = {
  fibTable?: number[];
  fibActive?: number;
  knapsackTable?: number[][];
  knapsackActive?: { r: number; c: number } | null;
  knapsackDecision?: string;
  lcsTable?: number[][];
  lcsActive?: { r: number; c: number } | null;
  lcsMatch?: boolean;
  message: string;
  result?: string;
};

export function generateFibonacciSteps(): DPStep[] {
  const steps: DPStep[] = [];
  const n = 10;
  const dp: number[] = Array(n + 1).fill(0);
  dp[0] = 0;
  dp[1] = 1;

  steps.push({
    fibTable: [...dp],
    fibActive: -1,
    message: "Initializing base cases: F(0) = 0, F(1) = 1.",
  });

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
    steps.push({
      fibTable: [...dp],
      fibActive: i,
      message: `Calculating F(${i}) = F(${i - 1}) + F(${i - 2}) = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
    });
  }

  steps.push({
    fibTable: [...dp],
    fibActive: -1,
    result: `F(10) = ${dp[n]}`,
    message: `✅ Fibonacci tabulation complete! F(10) = ${dp[n]}`,
  });

  return steps;
}

export function generateKnapsackSteps(): DPStep[] {
  const steps: DPStep[] = [];
  const weights = [2, 3, 4, 5];
  const values = [3, 4, 5, 6];
  const W = 5;
  const n = weights.length;
  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(W + 1).fill(0));

  steps.push({
    knapsackTable: dp.map((r) => [...r]),
    knapsackActive: null,
    knapsackDecision: "Initial DP Table (size 5×6)",
    message: "Initialized 2D DP table with zeroes (0 items or 0 capacity).",
  });

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= W; w++) {
      let dec = "";
      let msg = "";
      if (weights[i - 1] <= w) {
        const skip = dp[i - 1][w];
        const include = values[i - 1] + dp[i - 1][w - weights[i - 1]];
        dp[i][w] = Math.max(skip, include);
        dec = include > skip ? `Include Item ${i} (val +${values[i - 1]}) ✓` : `Skip Item ${i}`;
        msg = `Item ${i} (w=${weights[i - 1]}, v=${values[i - 1]}) | Cap=${w}: Skip=${skip}, Include=${include} → max=${dp[i][w]}`;
      } else {
        dp[i][w] = dp[i - 1][w];
        dec = `Item ${i} too heavy (${weights[i - 1]} > ${w})`;
        msg = `Item ${i} weight ${weights[i - 1]} exceeds capacity ${w} → carry forward ${dp[i][w]}`;
      }

      steps.push({
        knapsackTable: dp.map((r) => [...r]),
        knapsackActive: { r: i, c: w },
        knapsackDecision: dec,
        message: msg,
      });
    }
  }

  steps.push({
    knapsackTable: dp.map((r) => [...r]),
    knapsackActive: null,
    knapsackDecision: `Optimal Knapsack Value = ${dp[n][W]}`,
    result: `Max value = ${dp[n][W]}`,
    message: `✅ Knapsack DP complete! Maximum achievable value is ${dp[n][W]}`,
  });

  return steps;
}

export function generateLCSSteps(): DPStep[] {
  const steps: DPStep[] = [];
  const s1 = "ABCB";
  const s2 = "BDCAB";
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  steps.push({
    lcsTable: dp.map((r) => [...r]),
    lcsActive: null,
    lcsMatch: false,
    message: `Finding Longest Common Subsequence of "${s1}" and "${s2}". Initialized (5×6) table with 0s.`,
  });

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = s1[i - 1] === s2[j - 1];
      if (match) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }

      steps.push({
        lcsTable: dp.map((r) => [...r]),
        lcsActive: { r: i, c: j },
        lcsMatch: match,
        message: match
          ? `✓ Match! '${s1[i - 1]}' == '${s2[j - 1]}' → dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`
          : `✗ No match: '${s1[i - 1]}' ≠ '${s2[j - 1]}' → max(↑ ${dp[i - 1][j]}, ← ${dp[i][j - 1]}) = ${dp[i][j]}`,
      });
    }
  }

  steps.push({
    lcsTable: dp.map((r) => [...r]),
    lcsActive: null,
    lcsMatch: false,
    result: `LCS length = ${dp[m][n]} (subsequence: "BCB")`,
    message: `✅ LCS computation complete! Length = ${dp[m][n]} (Subsequence: "BCB")`,
  });

  return steps;
}

const dpInfo: Record<
  string,
  {
    color: string;
    desc: string;
    about: string;
    when: string;
    keypoints: string;
  }
> = {
  Fibonacci: {
    color: "#FFB347",
    desc: "Computes nth Fibonacci number by storing previously computed values in a table.",
    about:
      "Fibonacci using Dynamic Programming avoids the exponential time of naive recursion by storing results of subproblems. Instead of recomputing fib(n-1) and fib(n-2) repeatedly, it fills a table from bottom up starting from fib(0)=0 and fib(1)=1. This brings time complexity from O(2ⁿ) down to O(n). It is the classic example used to teach the concept of memoization and tabulation in DP.",
    when: "• When computing nth Fibonacci efficiently\n• Learning DP concepts\n• When recursive solution is too slow\n• Interview questions on DP basics",
    keypoints:
      "• Without DP: O(2ⁿ) time — extremely slow\n• With DP: O(n) time — extremely fast\n• Two approaches: Top-down (memoization) and Bottom-up (tabulation)\n• Space can be optimized to O(1) by keeping only last 2 values",
  },
  Knapsack: {
    color: "#00D4AA",
    desc: "Finds maximum value subset of items that fit within a weight capacity.",
    about:
      "The 0/1 Knapsack Problem is a classic optimization problem. Given items with weights and values, and a knapsack with limited capacity, find the maximum value you can carry. The DP approach builds a 2D table where dp[i][w] represents maximum value using first i items with capacity w. Each cell is filled by deciding whether to include or exclude the current item.",
    when: "• Resource allocation problems\n• Budget optimization\n• Project selection with constraints\n• Investment portfolio optimization",
    keypoints:
      "• 2D DP table of size (n+1) × (W+1)\n• For each item: either include it or skip it\n• Include: value[i] + dp[i-1][w-weight[i]]\n• Skip: dp[i-1][w]\n• Take maximum of both choices",
  },
  LCS: {
    color: "#6C63FF",
    desc: "Finds the longest subsequence common to two sequences.",
    about:
      "Longest Common Subsequence (LCS) finds the longest sequence that appears in the same order in both strings, but not necessarily contiguous. It is used in diff tools, DNA analysis, and version control. The DP table is built where dp[i][j] represents LCS length of first i chars of string1 and first j chars of string2. If characters match, diagonal value + 1. Otherwise max of left and top.",
    when: "• File diff and version control (git diff)\n• DNA sequence alignment in bioinformatics\n• Spell checkers and autocorrect\n• Plagiarism detection systems",
    keypoints:
      "• Different from Longest Common Substring (not contiguous)\n• 2D table of size (m+1) × (n+1)\n• Match: dp[i][j] = dp[i-1][j-1] + 1\n• No match: dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n• Trace back diagonally to find actual subsequence",
  },
};

const dpCode: Record<string, { python: string; java: string; cpp: string }> = {
  Fibonacci: {
    python: `def fibonacci_dp(n):
    # Create DP table
    dp = [0] * (n + 1)
    
    # Base cases
    dp[0] = 0
    dp[1] = 1
    
    # Fill table bottom-up
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]

# Example
print(fibonacci_dp(10))  # Output: 55`,
    java: `int fibonacciDP(int n) {
    int[] dp = new int[n + 1];
    
    // Base cases
    dp[0] = 0;
    dp[1] = 1;
    
    // Fill table bottom-up
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    
    return dp[n];
}`,
    cpp: `int fibonacciDP(int n) {
    vector<int> dp(n + 1);
    
    // Base cases
    dp[0] = 0;
    dp[1] = 1;
    
    // Fill table bottom-up
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    
    return dp[n];
}`,
  },
  Knapsack: {
    python: `def knapsack(weights, values, W):
    n = len(weights)
    # Create 2D DP table
    dp = [[0]*(W+1) for _ in range(n+1)]
    
    for i in range(1, n+1):
        for w in range(W+1):
            # Don't include item i
            dp[i][w] = dp[i-1][w]
            
            # Include item i if it fits
            if weights[i-1] <= w:
                include = values[i-1] + dp[i-1][w-weights[i-1]]
                dp[i][w] = max(dp[i][w], include)
    
    return dp[n][W]

weights = [2, 3, 4, 5]
values  = [3, 4, 5, 6]
print(knapsack(weights, values, 5))  # Output: 7`,
    java: `int knapsack(int[] weights, int[] values, int W) {
    int n = weights.length;
    int[][] dp = new int[n+1][W+1];
    
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            // Don't include item i
            dp[i][w] = dp[i-1][w];
            
            // Include item i if it fits
            if (weights[i-1] <= w) {
                int include = values[i-1] + dp[i-1][w-weights[i-1]];
                dp[i][w] = Math.max(dp[i][w], include);
            }
        }
    }
    return dp[n][W];
}`,
    cpp: `int knapsack(vector<int>& weights, vector<int>& values, int W) {
    int n = weights.size();
    vector<vector<int>> dp(n+1, vector<int>(W+1, 0));
    
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= W; w++) {
            dp[i][w] = dp[i-1][w];
            if (weights[i-1] <= w) {
                int include = values[i-1] + dp[i-1][w-weights[i-1]];
                dp[i][w] = max(dp[i][w], include);
            }
        }
    }
    return dp[n][W];
}`,
  },
  LCS: {
    python: `def lcs(s1, s2):
    m, n = len(s1), len(s2)
    # Create 2D DP table
    dp = [[0]*(n+1) for _ in range(m+1)]
    
    for i in range(1, m+1):
        for j in range(1, n+1):
            if s1[i-1] == s2[j-1]:
                # Characters match — extend LCS
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                # No match — take max of left or top
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]

print(lcs("ABCB", "BDCAB"))  # Output: 3`,
    java: `int lcs(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m+1][n+1];
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1.charAt(i-1) == s2.charAt(j-1)) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    return dp[m][n];
}`,
    cpp: `int lcs(string s1, string s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (s1[i-1] == s2[j-1])
                dp[i][j] = dp[i-1][j-1] + 1;
            else
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
        }
    }
    return dp[m][n];
}`,
  },
};

export default function DPScreen() {
  useEffect(() => {
    recordStudySession("Dynamic Programming");
  }, []);

  const { width: windowWidth } = useWindowDimensions();
  const { algo: paramAlgo } = useLocalSearchParams<{ algo?: string }>();
  const [selectedAlgo, setSelectedAlgo] = useState(paramAlgo || "Fibonacci");

  const info = dpInfo[selectedAlgo] || dpInfo["Fibonacci"];
  const code = dpCode[selectedAlgo] || dpCode["Fibonacci"];

  const [steps, setSteps] = useState<DPStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);

  const [activeTab, setActiveTab] = useState<"visualize" | "learn" | "code">(
    "visualize"
  );
  const [activeLang, setActiveLang] = useState<"python" | "java" | "cpp">(
    "python"
  );

  const rebuildSteps = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    if (selectedAlgo === "Fibonacci") setSteps(generateFibonacciSteps());
    else if (selectedAlgo === "Knapsack") setSteps(generateKnapsackSteps());
    else if (selectedAlgo === "LCS") setSteps(generateLCSSteps());
  };

  useEffect(() => {
    rebuildSteps();
  }, [selectedAlgo]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        setIsPlaying(false);
        return prev;
      });
    }, speed);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length, speed]);

  const handlePlayPause = () => {
    if (currentStepIndex === steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const currentStep: DPStep = steps[currentStepIndex] || {
    message: "Select an algorithm or press Start...",
  };

  const fibTable = currentStep.fibTable || [];
  const fibActive = currentStep.fibActive ?? -1;
  const knapsackTable = currentStep.knapsackTable || [];
  const knapsackActive = currentStep.knapsackActive || null;
  const knapsackDecision = currentStep.knapsackDecision || "";
  const lcsTable = currentStep.lcsTable || [];
  const lcsActive = currentStep.lcsActive || null;
  const lcsMatch = currentStep.lcsMatch || false;
  const result = currentStep.result || "";
  const langs = ["python", "java", "cpp"];

  return (
    <AppShell>
      <View style={{ alignItems: "center" }}>
        <View style={{ width: Math.min(windowWidth - 40, 750) }}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: info?.color || "#FFB347" }]}>
              {selectedAlgo}
            </Text>
            <Text style={styles.desc}>{info?.desc}</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabRow}>
            {(["visualize", "learn", "code"] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.tab,
                  activeTab === t && { backgroundColor: info?.color || "#FFB347" },
                ]}
                onPress={() => setActiveTab(t)}
              >
                <Text
                  style={[styles.tabText, activeTab === t && styles.tabTextActive]}
                >
                  {t === "visualize"
                    ? "▶ Visualize"
                    : t === "learn"
                      ? "📖 Learn"
                      : "💻 Code"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── VISUALIZE TAB ── */}
          {activeTab === "visualize" && (
            <View style={styles.contentSection}>
              {/* Algorithm selector pills */}
              <View style={styles.algoPills}>
                {["Fibonacci", "Knapsack", "LCS"].map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.pill,
                      selectedAlgo === key && {
                        backgroundColor: (dpInfo[key]?.color || "#FFB347") + "33",
                        borderColor: dpInfo[key]?.color || "#FFB347",
                      },
                    ]}
                    onPress={() => setSelectedAlgo(key)}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        selectedAlgo === key && { color: "#FFF" },
                      ]}
                    >
                      {key}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Problem statement */}
              <View
                style={[
                  styles.problemBox,
                  { borderColor: (info?.color || "#FFB347") + "44" },
                ]}
              >
                {selectedAlgo === "Fibonacci" && (
                  <>
                    <Text style={styles.problemTitle}>📋 Problem</Text>
                    <Text style={styles.problemText}>
                      Compute first 11 Fibonacci numbers (F(0) to F(10)) using
                      Dynamic Programming tabulation.
                    </Text>
                    <Text style={[styles.problemFormula, { color: info?.color }]}>
                      F(n) = F(n-1) + F(n-2)
                    </Text>
                  </>
                )}
                {selectedAlgo === "Knapsack" && (
                  <>
                    <Text style={styles.problemTitle}>📋 Problem</Text>
                    <Text style={styles.problemText}>
                      Items: weights=[2,3,4,5] values=[3,4,5,6] | Knapsack capacity
                      = 5
                    </Text>
                    <Text style={[styles.problemFormula, { color: info?.color }]}>
                      dp[i][w] = max(skip, include)
                    </Text>
                  </>
                )}
                {selectedAlgo === "LCS" && (
                  <>
                    <Text style={styles.problemTitle}>📋 Problem</Text>
                    <Text style={styles.problemText}>
                      Find the Longest Common Subsequence of "ABCB" and "BDCAB"
                    </Text>
                    <Text style={[styles.problemFormula, { color: info?.color }]}>
                      dp[i][j] = dp[i-1][j-1]+1 if match, else max(top,left)
                    </Text>
                  </>
                )}
              </View>

              {/* ── FIBONACCI TABLE ── */}
              {selectedAlgo === "Fibonacci" && fibTable.length > 0 && (
                <View style={styles.tableSection}>
                  <Text style={styles.tableTitle}>DP Table</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View>
                      {/* Header row */}
                      <View style={styles.tableRow}>
                        <View style={styles.tableHeaderCell}>
                          <Text style={styles.tableHeaderText}>n</Text>
                        </View>
                        {fibTable.map((_, i) => (
                          <View
                            key={i}
                            style={[
                              styles.tableHeaderCell,
                              fibActive === i && {
                                backgroundColor: (info?.color || "#FFB347") + "44",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.tableHeaderText,
                                fibActive === i && { color: info?.color },
                              ]}
                            >
                              {i}
                            </Text>
                          </View>
                        ))}
                      </View>
                      {/* Value row */}
                      <View style={styles.tableRow}>
                        <View style={styles.tableHeaderCell}>
                          <Text style={styles.tableHeaderText}>F(n)</Text>
                        </View>
                        {fibTable.map((val, i) => (
                          <View
                            key={i}
                            style={[
                              styles.tableCell,
                              fibActive === i && {
                                backgroundColor: (info?.color || "#FFB347") + "33",
                                borderColor: info?.color,
                                borderWidth: 2,
                              },
                              (i === fibActive - 1 || i === fibActive - 2) &&
                                fibActive > 1 && {
                                  borderColor: "#10B981",
                                  borderWidth: 1.5,
                                  backgroundColor: "#10B98122",
                                },
                              i < fibActive &&
                                fibActive > 0 &&
                                !(i === fibActive - 1 || i === fibActive - 2) && {
                                  backgroundColor: "#1E2E1E",
                                },
                            ]}
                          >
                            <Text
                              style={[
                                styles.tableCellText,
                                fibActive === i && {
                                  color: info?.color,
                                  fontWeight: "bold",
                                  fontSize: 16,
                                },
                                (i === fibActive - 1 || i === fibActive - 2) &&
                                  fibActive > 1 && {
                                    color: "#10B981",
                                    fontWeight: "bold",
                                  },
                                i < fibActive &&
                                  fibActive > 0 &&
                                  !(i === fibActive - 1 || i === fibActive - 2) && {
                                    color: "#00D4AA",
                                  },
                              ]}
                            >
                              {val}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </ScrollView>

                  {/* Arrow visualization */}
                  {fibActive > 1 && fibTable[fibActive] !== undefined && (
                    <View style={styles.arrowBox}>
                      <View style={styles.arrowItem}>
                        <View
                          style={[styles.arrowCell, { borderColor: "#10B981" }]}
                        >
                          <Text style={[styles.arrowVal, { color: "#10B981" }]}>
                            {fibTable[fibActive - 2]}
                          </Text>
                          <Text style={styles.arrowLabel}>F({fibActive - 2})</Text>
                        </View>
                        <Text style={styles.arrowOp}>+</Text>
                        <View
                          style={[styles.arrowCell, { borderColor: "#10B981" }]}
                        >
                          <Text style={[styles.arrowVal, { color: "#10B981" }]}>
                            {fibTable[fibActive - 1]}
                          </Text>
                          <Text style={styles.arrowLabel}>F({fibActive - 1})</Text>
                        </View>
                        <Text style={styles.arrowOp}>=</Text>
                        <View
                          style={[
                            styles.arrowCell,
                            {
                              borderColor: info?.color || "#FFB347",
                              backgroundColor: (info?.color || "#FFB347") + "22",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.arrowVal,
                              { color: info?.color || "#FFB347", fontSize: 18 },
                            ]}
                          >
                            {fibTable[fibActive]}
                          </Text>
                          <Text style={styles.arrowLabel}>F({fibActive})</Text>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* ── KNAPSACK TABLE ── */}
              {selectedAlgo === "Knapsack" && knapsackTable.length > 0 && (
                <View style={styles.tableSection}>
                  <Text style={styles.tableTitle}>DP Table — Items × Capacity</Text>
                  {knapsackDecision !== "" && (
                    <View
                      style={[
                        styles.decisionBox,
                        {
                          backgroundColor: (info?.color || "#00D4AA") + "11",
                          borderColor: info?.color || "#00D4AA",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.decisionText,
                          { color: info?.color || "#00D4AA" },
                        ]}
                      >
                        {knapsackDecision}
                      </Text>
                    </View>
                  )}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View>
                      {/* Column headers */}
                      <View style={styles.tableRow}>
                        <View style={[styles.tableHeaderCell, { width: 52 }]}>
                          <Text style={styles.tableHeaderText}>i\w</Text>
                        </View>
                        {knapsackTable[0]?.map((_, c) => (
                          <View
                            key={c}
                            style={[
                              styles.tableHeaderCell,
                              knapsackActive?.c === c && {
                                backgroundColor: (info?.color || "#00D4AA") + "22",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.tableHeaderText,
                                knapsackActive?.c === c && { color: info?.color },
                              ]}
                            >
                              W={c}
                            </Text>
                          </View>
                        ))}
                      </View>
                      {/* Data rows */}
                      {knapsackTable.map((row, r) => (
                        <View key={r} style={styles.tableRow}>
                          <View
                            style={[
                              styles.tableHeaderCell,
                              { width: 52 },
                              knapsackActive?.r === r && {
                                backgroundColor: (info?.color || "#00D4AA") + "22",
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.tableHeaderText,
                                knapsackActive?.r === r && { color: info?.color },
                              ]}
                            >
                              {r === 0 ? "∅" : `I${r}`}
                            </Text>
                          </View>
                          {row.map((val, c) => (
                            <View
                              key={c}
                              style={[
                                styles.tableCell,
                                knapsackActive?.r === r &&
                                  knapsackActive?.c === c && {
                                    backgroundColor:
                                      (info?.color || "#00D4AA") + "33",
                                    borderColor: info?.color,
                                    borderWidth: 2,
                                  },
                                val > 0 &&
                                  !(
                                    knapsackActive?.r === r &&
                                    knapsackActive?.c === c
                                  ) && { backgroundColor: "#0D2020" },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.tableCellText,
                                  knapsackActive?.r === r &&
                                    knapsackActive?.c === c && {
                                      color: info?.color,
                                      fontWeight: "bold",
                                      fontSize: 15,
                                    },
                                  val > 0 &&
                                    !(
                                      knapsackActive?.r === r &&
                                      knapsackActive?.c === c
                                    ) && { color: "#00D4AA" },
                                ]}
                              >
                                {val}
                              </Text>
                            </View>
                          ))}
                        </View>
                      ))}
                    </View>
                  </ScrollView>

                  {/* Item reference */}
                  <View style={styles.itemRef}>
                    {[
                      "I1(w=2,v=3)",
                      "I2(w=3,v=4)",
                      "I3(w=4,v=5)",
                      "I4(w=5,v=6)",
                    ].map((item, i) => (
                      <View
                        key={i}
                        style={[
                          styles.itemChip,
                          knapsackActive?.r === i + 1 && {
                            backgroundColor: (info?.color || "#00D4AA") + "22",
                            borderColor: info?.color,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.itemChipText,
                            knapsackActive?.r === i + 1 && { color: info?.color },
                          ]}
                        >
                          {item}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* ── LCS TABLE ── */}
              {selectedAlgo === "LCS" && lcsTable.length > 0 && (
                <View style={styles.tableSection}>
                  <Text style={styles.tableTitle}>
                    DP Table — "ABCB" vs "BDCAB"
                  </Text>
                  {lcsActive && (
                    <View
                      style={[
                        styles.decisionBox,
                        {
                          backgroundColor: lcsMatch ? "#00D4AA11" : "#FF6B6B11",
                          borderColor: lcsMatch ? "#00D4AA" : "#FF6B6B",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.decisionText,
                          { color: lcsMatch ? "#00D4AA" : "#FF6B6B" },
                        ]}
                      >
                        {lcsMatch
                          ? "✓ Characters match — diagonal + 1"
                          : "✗ No match — take max of ↑ left or ← top"}
                      </Text>
                    </View>
                  )}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View>
                      {/* Column headers */}
                      <View style={styles.tableRow}>
                        <View style={[styles.tableHeaderCell, { width: 40 }]}>
                          <Text style={styles.tableHeaderText}> </Text>
                        </View>
                        {["", "B", "D", "C", "A", "B"].map((ch, c) => (
                          <View
                            key={c}
                            style={[
                              styles.tableHeaderCell,
                              lcsActive?.c === c &&
                                c > 0 && {
                                  backgroundColor:
                                    (info?.color || "#6C63FF") + "22",
                                },
                            ]}
                          >
                            <Text
                              style={[
                                styles.tableHeaderText,
                                lcsActive?.c === c &&
                                  c > 0 && { color: info?.color },
                              ]}
                            >
                              {ch || "∅"}
                            </Text>
                          </View>
                        ))}
                      </View>
                      {/* Data rows */}
                      {lcsTable.map((row, r) => (
                        <View key={r} style={styles.tableRow}>
                          <View
                            style={[
                              styles.tableHeaderCell,
                              { width: 40 },
                              lcsActive?.r === r &&
                                r > 0 && {
                                  backgroundColor:
                                    (info?.color || "#6C63FF") + "22",
                                },
                            ]}
                          >
                            <Text
                              style={[
                                styles.tableHeaderText,
                                lcsActive?.r === r &&
                                  r > 0 && { color: info?.color },
                              ]}
                            >
                              {["∅", "A", "B", "C", "B"][r] || "∅"}
                            </Text>
                          </View>
                          {row.map((val, c) => (
                            <View
                              key={c}
                              style={[
                                styles.tableCell,
                                lcsActive?.r === r &&
                                  lcsActive?.c === c && {
                                    backgroundColor: lcsMatch
                                      ? "#00D4AA33"
                                      : "#FF6B6B22",
                                    borderColor: lcsMatch ? "#00D4AA" : "#FF6B6B",
                                    borderWidth: 2,
                                  },
                                val > 0 &&
                                  !(lcsActive?.r === r && lcsActive?.c === c) && {
                                    backgroundColor: "#1A1A2E",
                                  },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.tableCellText,
                                  lcsActive?.r === r &&
                                    lcsActive?.c === c && {
                                      color: lcsMatch ? "#00D4AA" : "#FF6B6B",
                                      fontWeight: "bold",
                                      fontSize: 15,
                                    },
                                  val > 0 &&
                                    !(lcsActive?.r === r && lcsActive?.c === c) && {
                                      color: info?.color,
                                    },
                                ]}
                              >
                                {val}
                              </Text>
                            </View>
                          ))}
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              )}

              {/* Step info */}
              <View
                style={[
                  styles.stepBox,
                  { borderColor: (info?.color || "#FFB347") + "44" },
                ]}
              >
                <Text style={styles.stepText}>{currentStep.message}</Text>
              </View>

              {/* Interactive Controls Bar */}
              <View style={styles.controlsContainer}>
                <View style={styles.controlBtns}>
                  <TouchableOpacity style={styles.controlBtn} onPress={handlePrev}>
                    <ChevronLeft size={22} color="#FFF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.controlBtn,
                      styles.playBtn,
                      { backgroundColor: info?.color || "#FFB347" },
                    ]}
                    onPress={handlePlayPause}
                  >
                    {isPlaying ? (
                      <Pause size={22} color="#FFF" fill="#FFF" />
                    ) : (
                      <Play size={22} color="#FFF" fill="#FFF" />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.controlBtn} onPress={handleNext}>
                    <ChevronRight size={22} color="#FFF" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.controlBtn} onPress={handleReset}>
                    <RotateCcw size={18} color="#FFF" />
                  </TouchableOpacity>
                </View>

                {/* Speed Option */}
                <View style={styles.speedContainer}>
                  <Text style={styles.speedLabel}>Speed:</Text>
                  <View style={styles.speedOptions}>
                    {[1200, 800, 400].map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[
                          styles.speedBtn,
                          speed === s && {
                            backgroundColor: info?.color || "#FFB347",
                          },
                        ]}
                        onPress={() => setSpeed(s)}
                      >
                        <Text
                          style={[
                            styles.speedBtnText,
                            speed === s && { color: "#FFF" },
                          ]}
                        >
                          {s === 1200 ? "0.5x" : s === 800 ? "1x" : "2x"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Result */}
              {result !== "" && (
                <View
                  style={[
                    styles.resultBox,
                    {
                      borderColor: info?.color || "#FFB347",
                      backgroundColor: (info?.color || "#FFB347") + "11",
                    },
                  ]}
                >
                  <Text style={styles.resultLabel}>🏆 Result</Text>
                  <Text
                    style={[styles.resultText, { color: info?.color || "#FFB347" }]}
                  >
                    {result}
                  </Text>
                </View>
              )}

              {/* Metrics / Diagnostics */}
              <View style={styles.metricsBox}>
                <Text style={styles.metricTitle}>⚡ Algorithm Diagnostics</Text>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Time Complexity:</Text>
                  <Text style={[styles.metricVal, { color: info?.color }]}>
                    {selectedAlgo === "Fibonacci"
                      ? "O(n)"
                      : selectedAlgo === "Knapsack"
                        ? "O(n×W)"
                        : "O(m×n)"}
                  </Text>
                </View>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Space Complexity:</Text>
                  <Text style={[styles.metricVal, { color: info?.color }]}>
                    {selectedAlgo === "Fibonacci"
                      ? "O(n)"
                      : selectedAlgo === "Knapsack"
                        ? "O(n×W)"
                        : "O(m×n)"}
                  </Text>
                </View>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>Step Progress:</Text>
                  <Text style={styles.metricVal}>
                    {currentStepIndex + 1} / {steps.length}
                  </Text>
                </View>
              </View>

              {/* Real-World Industry Applications Card */}
              <View
                style={[
                  styles.problemBox,
                  { borderColor: (info?.color || "#FFB347") + "44", marginTop: 4 },
                ]}
              >
                <Text style={styles.problemTitle}>🚀 Real-World Applications</Text>
                <Text style={styles.problemText}>
                  {selectedAlgo === "Fibonacci" &&
                    "• Financial Compound Growth & Interest Calculations\n• Population Growth Modeling & Fibonacci Retracement in Stock Analysis"}
                  {selectedAlgo === "Knapsack" &&
                    "• Supply Chain Cargo Packing & Truck Capacity Optimization\n• Financial Portfolio Asset Allocation under Budget Constraints"}
                  {selectedAlgo === "LCS" &&
                    "• Git Diff & Code Conflict Resolution Engines\n• Bioinformatics DNA/RNA Sequence Alignment & Text Plagiarism Detection"}
                </Text>
              </View>
            </View>
          )}

      {/* ── LEARN TAB ── */}
      {activeTab === "learn" && (
        <View style={styles.learnSection}>
          <View
            style={[
              styles.learnCard,
              { borderColor: (info?.color || "#FFB347") + "44" },
            ]}
          >
            <Text style={styles.learnTitle}>📖 About {selectedAlgo}</Text>
            <Text style={styles.learnText}>{info?.about}</Text>
          </View>

          <View
            style={[
              styles.learnCard,
              { borderColor: (info?.color || "#FFB347") + "44" },
            ]}
          >
            <Text style={styles.learnTitle}>⏱️ When to use {selectedAlgo}?</Text>
            <Text style={styles.learnText}>{info?.when}</Text>
          </View>

          <View
            style={[
              styles.learnCard,
              { borderColor: (info?.color || "#FFB347") + "44" },
            ]}
          >
            <Text style={styles.learnTitle}>💡 Key Points</Text>
            <Text style={styles.learnText}>{info?.keypoints}</Text>
          </View>

          <View
            style={[
              styles.learnCard,
              { borderColor: (info?.color || "#FFB347") + "44" },
            ]}
          >
            <Text style={styles.learnTitle}>
              🧩 What is Dynamic Programming?
            </Text>
            <Text style={styles.learnText}>
              {
                "Dynamic Programming (DP) is an algorithmic technique for solving problems by breaking them into overlapping subproblems and storing their solutions to avoid redundant computation.\n\nTwo key properties needed:\n• Optimal Substructure: Solution can be built from optimal solutions of subproblems\n• Overlapping Subproblems: Same subproblems are solved multiple times\n\nTwo approaches:\n• Top-down (Memoization): Recursion + cache results\n• Bottom-up (Tabulation): Fill table iteratively"
              }
            </Text>
          </View>
        </View>
      )}

      {/* ── CODE TAB ── */}
      {activeTab === "code" && (
        <View style={styles.codeSection}>
          <View style={styles.langRow}>
            {langs.map((l) => (
              <TouchableOpacity
                key={l}
                style={[
                  styles.langBtn,
                  activeLang === l && {
                    backgroundColor: (info?.color || "#FFB347") + "22",
                    borderColor: info?.color || "#FFB347",
                  },
                ]}
                onPress={() => setActiveLang(l as any)}
              >
                <Text
                  style={[
                    styles.langText,
                    activeLang === l && { color: info?.color || "#FFB347" },
                  ]}
                >
                  {l === "python"
                    ? "🐍 Python"
                    : l === "java"
                      ? "☕ Java"
                      : "⚙️ C++"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.codeBlock}>
            <View
              style={[
                styles.codeHeader,
                { backgroundColor: (info?.color || "#FFB347") + "22" },
              ]}
            >
              <Text
                style={[
                  styles.codeHeaderText,
                  { color: info?.color || "#FFB347" },
                ]}
              >
                {selectedAlgo} — {activeLang.toUpperCase()}
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={styles.codeText}>
                {code?.[activeLang] || "Code coming soon!"}
              </Text>
            </ScrollView>
          </View>

          <View style={styles.learnCard}>
            <Text style={styles.learnTitle}>🧠 How this code works</Text>
            {selectedAlgo === "Fibonacci" && (
              <Text style={styles.learnText}>
                {
                  "1. Create array dp of size n+1\n2. Set dp[0]=0 and dp[1]=1 as base cases\n3. Loop from i=2 to n\n4. Each dp[i] = dp[i-1] + dp[i-2]\n5. Return dp[n] as final answer"
                }
              </Text>
            )}
            {selectedAlgo === "Knapsack" && (
              <Text style={styles.learnText}>
                {
                  "1. Create 2D array dp[n+1][W+1] filled with 0\n2. For each item i from 1 to n:\n3.   For each capacity w from 0 to W:\n4.     If item fits: dp[i][w] = max(skip, include)\n5.     Else: dp[i][w] = dp[i-1][w] (skip)\n6. Answer is dp[n][W]"
                }
              </Text>
            )}
            {selectedAlgo === "LCS" && (
              <Text style={styles.learnText}>
                {
                  "1. Create 2D array dp[m+1][n+1] filled with 0\n2. For each char i of string1:\n3.   For each char j of string2:\n4.     If chars match: dp[i][j] = dp[i-1][j-1] + 1\n5.     Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n6. Answer is dp[m][n]"
                }
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  </View>
</AppShell>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0F" },
  header: { padding: 24, paddingTop: 20 },
  title: { fontSize: 26, fontWeight: "bold" },
  desc: { fontSize: 13, color: "#888", marginTop: 6, lineHeight: 20 },

  contentSection: { paddingHorizontal: 20 },
  algoPills: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    backgroundColor: "#12121A",
  },
  pillText: { color: "#888", fontSize: 12, fontWeight: "600" },

  tabRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#12121A",
    borderRadius: 12,
    padding: 4,
  },
  tab: { flex: 1, padding: 10, borderRadius: 10, alignItems: "center" },
  tabText: { color: "#888", fontSize: 13, fontWeight: "600" },
  tabTextActive: { color: "#FFF" },
  problemBox: {
    marginBottom: 16,
    backgroundColor: "#12121A",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  problemTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },
  problemText: { color: "#AAA", fontSize: 13, lineHeight: 20 },
  problemFormula: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 8,
    fontFamily: "monospace",
  },
  tableSection: {
    marginBottom: 16,
    backgroundColor: "#0D1117",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  tableTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  tableRow: { flexDirection: "row" },
  tableHeaderCell: {
    width: 52,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#161B22",
    borderWidth: 0.5,
    borderColor: "#333",
  },
  tableHeaderText: { color: "#888", fontSize: 11, fontWeight: "600" },
  tableCell: {
    width: 52,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0D1117",
    borderWidth: 0.5,
    borderColor: "#1E1E2E",
  },
  tableCellText: { color: "#555", fontSize: 14 },
  arrowBox: {
    marginTop: 14,
    padding: 12,
    backgroundColor: "#12121A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  arrowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  arrowCell: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    minWidth: 56,
  },
  arrowVal: { fontSize: 20, fontWeight: "bold" },
  arrowLabel: { color: "#888", fontSize: 10, marginTop: 2 },
  arrowOp: { color: "#888", fontSize: 22, fontWeight: "bold" },
  decisionBox: {
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
  },
  decisionText: { fontSize: 12, fontWeight: "600", textAlign: "center" },
  itemRef: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12 },
  itemChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#1E1E2E",
    borderWidth: 1,
    borderColor: "#333",
  },
  itemChipText: { color: "#888", fontSize: 10 },
  stepBox: {
    marginBottom: 16,
    backgroundColor: "#12121A",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    minHeight: 52,
    justifyContent: "center",
  },
  stepText: {
    color: "#FFF",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },

  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#12121A",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    marginBottom: 20,
  },
  controlBtns: { flexDirection: "row", alignItems: "center", gap: 10 },
  controlBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#1E1E2E",
    alignItems: "center",
    justifyContent: "center",
  },
  playBtn: { width: 46, height: 46, borderRadius: 12 },
  speedContainer: { alignItems: "flex-end" },
  speedLabel: { color: "#666", fontSize: 10, marginBottom: 6 },
  speedOptions: {
    flexDirection: "row",
    backgroundColor: "#0A0A0F",
    borderRadius: 8,
    padding: 3,
    gap: 4,
  },
  speedBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  speedBtnText: { color: "#666", fontSize: 10, fontWeight: "bold" },

  resultBox: {
    marginBottom: 16,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  resultLabel: { color: "#888", fontSize: 12, marginBottom: 4 },
  resultText: { fontSize: 20, fontWeight: "bold" },

  metricsBox: {
    backgroundColor: "#12121A",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    marginBottom: 20,
  },
  metricTitle: { color: "#FFF", fontSize: 13, fontWeight: "bold", marginBottom: 12 },
  metricRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  metricLabel: { color: "#666", fontSize: 12 },
  metricVal: { color: "#AAA", fontSize: 12, fontWeight: "600" },
  btn: { flex: 1, padding: 16, borderRadius: 12, alignItems: "center" },
  resetBtn: { backgroundColor: "#1E1E2E" },
  disabled: { opacity: 0.5 },
  btnText: { color: "#FFF", fontSize: 15, fontWeight: "bold" },
  learnSection: { paddingHorizontal: 20, gap: 14 },
  learnCard: {
    backgroundColor: "#12121A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  learnTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 12,
  },
  learnText: { color: "#AAA", fontSize: 13, lineHeight: 22 },
  codeSection: { paddingHorizontal: 20, gap: 14 },
  langRow: { flexDirection: "row", gap: 8 },
  langBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#12121A",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  langText: { color: "#888", fontSize: 12, fontWeight: "600" },
  codeBlock: {
    backgroundColor: "#0D1117",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  codeHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1E1E2E",
  },
  codeHeaderText: { fontSize: 12, fontWeight: "600" },
  codeText: {
    color: "#E6EDF3",
    fontSize: 12,
    padding: 16,
    fontFamily: "monospace",
    lineHeight: 20,
  },
});

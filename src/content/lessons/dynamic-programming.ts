import type { LessonContent } from "@/types/lesson";

export const dynamicProgrammingLesson: LessonContent = {
  slug: "dynamic-programming",
  topicKey: "Dynamic Programming",
  title: "Dynamic Programming (DP), Memoization & Tabulation",
  introduction:
    "Dynamic Programming is a powerful algorithmic paradigm that converts exponential-time recursive solutions into polynomial time by breaking problems down into overlapping subproblems, solving each subproblem once, and caching its result.",
  analogy:
    "Write '1 + 1 + 1 + 1 + 1' on a whiteboard and ask someone: 'What is that sum?' They count 5. Now add another '+ 1' at the end and ask: 'What is it now?' They immediately answer 6 without re-counting the first five 1s. That is Dynamic Programming — caching previous work so you never recalculate.",
  timeComplexity: [
    { operation: "Fibonacci (Naive Unoptimized Recursion)", complexity: "O(2^N) Exponential" },
    { operation: "Fibonacci (Memoized DP / Tabulation)", complexity: "O(N) Linear" },
    { operation: "0/1 Knapsack Problem", complexity: "O(N * W) Pseudo-polynomial" },
    { operation: "Longest Common Subsequence (LCS)", complexity: "O(M * N) Quadratic" },
    { operation: "Edit Distance (Levenshtein)", complexity: "O(M * N) Quadratic" },
  ],
  spaceComplexity: "O(N) or O(M * N) for DP lookup table; can often be space-optimized to O(1) or O(N) by rolling array rows.",
  applications: [
    "Text diff utilities (git diff, string Edit Distance, Longest Common Subsequence)",
    "DNA genomic sequence alignment algorithms (Needleman-Wunsch & Smith-Waterman)",
    "Shortest path network routing (Floyd-Warshall all-pairs & Bellman-Ford algorithms)",
    "Financial portfolio optimization and 0/1 Knapsack resource allocation",
  ],
  advantages: [
    "Transforms exponential time O(2^N) algorithms into polynomial time O(N), O(N²), or O(N*W)",
    "Guarantees mathematically optimal solutions when DP invariants are satisfied",
  ],
  disadvantages: [
    "Requires identifying optimal substructure and overlapping subproblems",
    "High space memory overhead for large 2D or 3D tabulation matrices",
  ],
  interviewQuestions: [
    {
      question: "What two essential properties must a problem possess to be solvable by Dynamic Programming?",
      answer:
        "1. Optimal Substructure: An optimal solution to the overall problem can be constructed from optimal solutions of its subproblems. 2. Overlapping Subproblems: The recursive problem tree evaluates the exact same smaller subproblems repeatedly.",
    },
    {
      question: "What is the difference between Top-Down Memoization and Bottom-Up Tabulation?",
      answer:
        "Top-Down Memoization starts at the original target problem, recurses downwards, and caches subproblem outputs in a Hash Map or array cache. Bottom-Up Tabulation starts from the smallest base cases, filling an iterative DP table from 0 up to N without recursion call stack overhead.",
    },
    {
      question: "How do you optimize 2D DP matrix space (e.g. 0/1 Knapsack, LCS) from O(M * N) down to O(N)?",
      answer:
        "Observe that calculating the current row `dp[i]` requires values from only the previous row `dp[i-1]`. By maintaining only two 1D array rows (`prevRow` and `currRow`) or iterating backwards in 1D array space, auxiliary memory drops from O(M * N) to O(N).",
    },
    {
      question: "What is the difference between 0/1 Knapsack and Unbounded Knapsack?",
      answer:
        "In 0/1 Knapsack, each item can be picked at most once (include or exclude). In Unbounded Knapsack, an unlimited quantity of each item can be selected (e.g. Coin Change problem).",
    },
  ],
  visualizerRoute: "/dp",
  visualizerLabel: "Launch Interactive DP Visualizer",

  commonMistakes: [
    "Attempting to apply DP to problems lacking optimal substructure or overlapping subproblems (e.g., Longest Simple Path)",
    "Forgetting recursion base cases in Top-Down memoization, triggering infinite stack depth",
    "Filling tabulation tables out-of-order before dependency subproblem cells are populated",
    "Not checking if DP matrix space can be rolled from 2D `O(M*N)` down to 1D `O(N)`",
  ],

  projectIdeas: [
    "Git Diff Text Comparison Visualizer: Build a web application highlighting line additions/deletions powered by the Longest Common Subsequence (LCS) DP algorithm",
    "Spelling Corrector & Auto-Suggest: Create a search input suggesting corrections based on Levenshtein Edit Distance DP matrix computation",
    "Financial Portfolio Asset Allocation: Build a 0/1 Knapsack optimization tool selecting maximum yield assets under capital constraints",
    "Interactive DP Table Animator: Build a visual tool displaying step-by-step matrix cell filling for Coin Change and LCS problems",
  ],

  youtubeVideos: [
    {
      id: "dp-yt-1",
      title: "Dynamic Programming for Beginners",
      channel: "FreeCodeCamp",
      duration: "30 mins",
      url: "https://youtube.com/results?search_query=Dynamic+Programming+Course+Memoization+Tabulation+Tutorial",
      description: "Comprehensive visual guide to DP, memoization, tabulation, and 2D DP matrices.",
    },
    {
      id: "dp-yt-2",
      title: "0/1 Knapsack & LCS DP Pattern",
      channel: "NeetCode",
      duration: "22 mins",
      url: "https://youtube.com/results?search_query=01+Knapsack+Longest+Common+Subsequence+DP+Pattern",
      description: "Step-by-step code walkthrough for top interview DP patterns.",
    },
  ],

  detailedNotesHtml: `
    <div style="font-family: system-ui, sans-serif; line-height: 1.7; color: #CBD5E1;">
      <h2 style="color: #8B5CF6; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">1. Exponential Recursion Tree vs O(N) DP Caching</h2>
      <p>Naive Fibonacci computes identical subproblems repeatedly. Caching trims the tree into a linear chain:</p>

      <!-- Visual Diagram 1: Recursive Tree vs Memoized Chain -->
      <div style="background: #0B1120; border: 1px solid #7C3AED; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #34D399; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 1: Exponential Tree O(2^N) vs Memoized DP Linear Chain O(N)</div>
        <svg viewBox="0 0 550 180" style="width: 100%; max-width: 520px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <!-- Unoptimized Tree -->
            <text x="130" y="25" fill="#F87171" font-weight="bold">Naive Tree: O(2^N)</text>
            <circle cx="130" cy="45" r="14" fill="#881337"/> <text x="130" y="49" fill="#FFF">F(5)</text>

            <line x1="130" y1="59" x2="80" y2="85" stroke="#F43F5E"/>
            <line x1="130" y1="59" x2="180" y2="85" stroke="#F43F5E"/>

            <circle cx="80" cy="95" r="14" fill="#881337"/> <text x="80" y="99" fill="#FFF">F(4)</text>
            <circle cx="180" cy="95" r="14" fill="#881337"/> <text x="180" y="99" fill="#FFF">F(3)</text>

            <!-- Duplicate Red Subtrees -->
            <text x="130" y="145" fill="#FCA5A5" font-size="10">Duplicate subproblems recalculated!</text>

            <!-- Memoized Chain -->
            <text x="390" y="25" fill="#34D399" font-weight="bold">Memoized DP: O(N)</text>
            <rect x="300" y="50" width="180" height="30" rx="4" fill="#065F46" stroke="#34D399"/>
            <text x="390" y="70" fill="#FFF">F(1) → F(2) → F(3) → F(4) → F(5)</text>
            <text x="390" y="115" fill="#A7F3D0">Each state calculated ONCE!</text>
          </g>
        </svg>
      </div>

      <h2 style="color: #06B6D4; margin-top: 24px;">2. 0/1 Knapsack Tabulation Step-by-Step Code Walkthrough</h2>
      <p>Given items with weights w and values v, maximize total value within capacity W:</p>

      <pre style="background: #050816; border: 1px solid #1E293B; border-radius: 8px; padding: 14px; color: #34D399; font-family: monospace; font-size: 13px;">
function knapsack(weights, values, W) {
  let n = weights.length;
  let dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    let w = weights[i - 1];
    let v = values[i - 1];
    for (let j = 0; j <= W; j++) {
      if (w <= j) {
        // Max of excluding item vs including item
        dp[i][j] = Math.max(dp[i - 1][j], v + dp[i - 1][j - w]);
      } else {
        dp[i][j] = dp[i - 1][j]; // Cannot fit item
      }
    }
  }
  return dp[n][W]; // Max value at full capacity
}
      </pre>

      <h3 style="color: #F59E0B;">Step-by-Step DP Matrix State Trace:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px;">
        <thead>
          <tr style="background: #1E293B; color: #38BDF8;">
            <th style="padding: 8px; border: 1px solid #334155;">Item (wt, val)</th>
            <th style="padding: 8px; border: 1px solid #334155;">Cap = 0</th>
            <th style="padding: 8px; border: 1px solid #334155;">Cap = 1</th>
            <th style="padding: 8px; border: 1px solid #334155;">Cap = 2</th>
            <th style="padding: 8px; border: 1px solid #334155;">Cap = 3</th>
            <th style="padding: 8px; border: 1px solid #334155;">Cap = 4</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155;"><code>None</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">0</td>
            <td style="padding: 8px; border: 1px solid #334155;">0</td>
            <td style="padding: 8px; border: 1px solid #334155;">0</td>
            <td style="padding: 8px; border: 1px solid #334155;">0</td>
            <td style="padding: 8px; border: 1px solid #334155;">0</td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155;"><code>Item 1 (w=2, v=3)</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">0</td>
            <td style="padding: 8px; border: 1px solid #334155;">0</td>
            <td style="padding: 8px; border: 1px solid #334155;">3</td>
            <td style="padding: 8px; border: 1px solid #334155;">3</td>
            <td style="padding: 8px; border: 1px solid #334155;">3</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155;"><code>Item 2 (w=3, v=4)</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">0</td>
            <td style="padding: 8px; border: 1px solid #334155;">0</td>
            <td style="padding: 8px; border: 1px solid #334155;">3</td>
            <td style="padding: 8px; border: 1px solid #334155;">4</td>
            <td style="padding: 8px; border: 1px solid #334155;">4</td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155;"><code>Item 3 (w=1, v=2)</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">0</td>
            <td style="padding: 8px; border: 1px solid #334155;">2</td>
            <td style="padding: 8px; border: 1px solid #334155;">3</td>
            <td style="padding: 8px; border: 1px solid #334155;">5</td>
            <td style="padding: 8px; border: 1px solid #334155; color: #34D399; font-weight: bold;">6 (Max)</td>
          </tr>
        </tbody>
      </table>

      <!-- Visual Diagram 2: Longest Common Subsequence (LCS) 2D Grid -->
      <div style="background: #0B1120; border: 1px solid #06B6D4; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #22D3EE; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 2: Longest Common Subsequence (LCS) DP Grid Dependencies</div>
        <svg viewBox="0 0 500 130" style="width: 100%; max-width: 460px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <rect x="80" y="20" width="100" height="30" rx="4" fill="#1E1B4B" stroke="#06B6D4"/> <text x="130" y="39" fill="#FFF">dp[i-1][j-1] (Match)</text>
            <rect x="220" y="20" width="100" height="30" rx="4" fill="#1E1B4B" stroke="#06B6D4"/> <text x="270" y="39" fill="#FFF">dp[i-1][j] (Skip Y)</text>

            <rect x="80" y="70" width="100" height="30" rx="4" fill="#1E1B4B" stroke="#06B6D4"/> <text x="130" y="89" fill="#FFF">dp[i][j-1] (Skip X)</text>
            <rect x="220" y="70" width="100" height="30" rx="4" fill="#065F46" stroke="#34D399"/> <text x="270" y="89" fill="#FFF" font-weight="bold">dp[i][j] (Target)</text>

            <text x="390" y="80" fill="#34D399" font-weight="bold">Match: 1 + Diagonal</text>
            <text x="390" y="100" fill="#FBBF24">Mismatch: Max(Up, Left)</text>
          </g>
        </svg>
      </div>

      <!-- Visual Diagram 3: 1D Space Optimization Rolling Array -->
      <div style="background: #0B1120; border: 1px solid #F59E0B; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #FBBF24; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 3: Rolling 1D Array Space Optimization O(M*N) -> O(N)</div>
        <svg viewBox="0 0 500 120" style="width: 100%; max-width: 460px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <text x="250" y="25" fill="#F43F5E">Full 2D Grid: M x N cells (Memory Heavy)</text>

            <rect x="120" y="45" width="260" height="30" rx="4" fill="#451A03" stroke="#F59E0B"/>
            <text x="250" y="65" fill="#FBBF24">Single 1D Array `dp[N]` (Iterate Backwards)</text>

            <text x="250" y="105" fill="#34D399" font-weight="bold">Auxiliary Space drops from O(M*N) down to O(N)!</text>
          </g>
        </svg>
      </div>
    </div>
  `,

  quiz: [
    {
      id: "dp-q1",
      question: "What two properties are required to solve a problem using Dynamic Programming?",
      options: [
        "Optimal Substructure and Overlapping Subproblems",
        "Greedy Choice and Binary Splitting",
        "Graph Cycles and Shortest Paths",
        "Linear Search and Sorting",
      ],
      correctIndex: 0,
      explanation: "Dynamic programming requires optimal substructure (constructing solutions from sub-solutions) and overlapping subproblems (re-using calculations).",
    },
    {
      id: "dp-q2",
      question: "What is the primary difference between Top-Down Memoization and Bottom-Up Tabulation?",
      options: [
        "Top-down uses recursive caching; bottom-up fills an iterative DP table from base cases up",
        "Top-down is always faster than bottom-up",
        "Bottom-up uses recursion",
        "Top-down requires O(1) space",
      ],
      correctIndex: 0,
      explanation: "Top-down memoizes recursive calls; bottom-up iteratively fills DP table entries starting from base cases.",
    },
    {
      id: "dp-q3",
      question: "What is the time complexity of computing the Nth Fibonacci number using DP memoization?",
      options: ["O(N)", "O(2^N)", "O(N²)", "O(log N)"],
      correctIndex: 0,
      explanation: "Memoization evaluates each subproblem state `Fib(i)` exactly once in O(N) linear time.",
    },
    {
      id: "dp-q4",
      question: "What is the time complexity of the 0/1 Knapsack problem with N items and capacity W?",
      options: ["O(N * W)", "O(2^N)", "O(N²)", "O(N + W)"],
      correctIndex: 0,
      explanation: "Filling an N x W DP table takes O(N * W) pseudo-polynomial time.",
    },
    {
      id: "dp-q5",
      question: "How can 2D DP space for 0/1 Knapsack be optimized from O(N * W) down to O(W)?",
      options: ["By using a single 1D array and iterating capacity W backwards from W down to weight", "By using a binary search tree", "By compressing integers", "By sorting items"],
      correctIndex: 0,
      explanation: "Iterating capacity backwards prevents using the same item multiple times in 1D array space.",
    },
    {
      id: "dp-q6",
      question: "What DP algorithm computes the minimum number of insertions, deletions, and substitutions to convert string A into string B?",
      options: ["Levenshtein Edit Distance", "Dijkstra Algorithm", "Kruskal Algorithm", "Kadane Algorithm"],
      correctIndex: 0,
      explanation: "Levenshtein Edit Distance fills an M x N DP grid computing string transformation operations.",
    },
    {
      id: "dp-q7",
      question: "What is the time complexity of Longest Common Subsequence (LCS) for two strings of length M and N?",
      options: ["O(M * N)", "O(M + N)", "O(2^(M+N))", "O(log(M*N))"],
      correctIndex: 0,
      explanation: "Evaluating character matches across string lengths M and N takes O(M * N) time.",
    },
    {
      id: "dp-q8",
      question: "In the Coin Change problem (minimum coins to make amount A), what type of knapsack pattern is it?",
      options: ["Unbounded Knapsack (items can be reused unlimited times)", "0/1 Knapsack", "Fractional Knapsack", "Greedy Choice"],
      correctIndex: 0,
      explanation: "Coin Change allows selecting identical coins multiple times (Unbounded Knapsack).",
    },
    {
      id: "dp-q9",
      question: "Why does Greedy algorithm fail for 0/1 Knapsack but work for Fractional Knapsack?",
      options: ["0/1 Knapsack requires taking items whole; highest value-to-weight ratio might leave unused capacity gap", "Greedy is slower", "0/1 Knapsack has no numbers", "Fractional knapsack uses stacks"],
      correctIndex: 0,
      explanation: "In 0/1 Knapsack, taking the highest ratio item can leave empty space that cannot be filled by smaller items.",
    },
    {
      id: "dp-q10",
      question: "What is the space complexity of bottom-up Tabulation for Fibonacci without state variable rolling?",
      options: ["O(N)", "O(1)", "O(2^N)", "O(N²)"],
      correctIndex: 0,
      explanation: "A standard 1D table of size N takes O(N) space (optimizable to O(1) using two variables).",
    },
  ],

  practiceProblems: [
    {
      id: "dp-p1",
      title: "1. Climbing Stairs",
      difficulty: "Easy",
      description: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      hints: ["Base cases: dp[1] = 1, dp[2] = 2. State transition: dp[i] = dp[i-1] + dp[i-2]."],
      starterCode: `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    let c = a + b;
    a = b;
    b = c;
  }
  return b;
}`,
      solutionExplanation: "Space-optimized Fibonacci DP executes in O(N) time and O(1) space.",
      testCases: [
        { input: [2], expected: 2 },
        { input: [3], expected: 3 },
      ],
    },
    {
      id: "dp-p2",
      title: "2. Coin Change (Minimum Coins)",
      difficulty: "Medium",
      description: "Given an integer array `coins` representing coins of different denominations and an integer `amount`, return the fewest number of coins needed to make up that amount.",
      hints: ["Initialize dp array size amount+1 with Infinity. Set dp[0] = 0. For each coin, dp[i] = Math.min(dp[i], 1 + dp[i - coin])."],
      starterCode: `function coinChange(coins, amount) {
  let dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      solutionExplanation: "Unbounded Knapsack DP computes minimum coins in O(N * Amount) time.",
      testCases: [
        { input: [[1, 2, 5], 11], expected: 3 },
        { input: [[2], 3], expected: -1 },
      ],
    },
  ],
};

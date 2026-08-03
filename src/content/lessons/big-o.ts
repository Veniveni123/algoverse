import type { LessonContent } from "@/types/lesson";

export const bigOLesson: LessonContent = {
  slug: "big-o",
  topicKey: "Big-O Notation",
  title: "Big-O Notation & Algorithmic Asymptotic Analysis",
  introduction:
    "Big-O notation is the formal mathematical framework used by computer scientists and software engineers to classify algorithm efficiency, measuring how runtime and memory requirements scale as input size N grows towards infinity.",
  analogy:
    "Delivering N physical letters across town: Driving to the post office takes 15 minutes regardless of sending 1 letter or 10,000 letters — that is O(1) Constant Time. Delivering each letter individually to N distinct houses takes O(N) Linear Time. Comparing every letter to every other letter for duplicate addresses takes O(N²) Quadratic Time.",
  timeComplexity: [
    { operation: "Constant Time", complexity: "O(1) — Direct array index lookup / Hash map access" },
    { operation: "Logarithmic Time", complexity: "O(log N) — Binary Search in sorted array" },
    { operation: "Linear Time", complexity: "O(N) — Single loop iteration over elements" },
    { operation: "Linearithmic Time", complexity: "O(N log N) — Optimal sorting (Merge Sort, Quick Sort)" },
    { operation: "Quadratic Time", complexity: "O(N²) — Nested loops over N elements" },
    { operation: "Exponential Time", complexity: "O(2^N) — Recursive subsets / Fibonacci tree" },
    { operation: "Factorial Time", complexity: "O(N!) — Traveling Salesperson brute force" },
  ],
  spaceComplexity: "Auxiliary RAM space used by variables, allocated objects, and recursion call stack depth.",
  applications: [
    "Predicting if an algorithm will run in 2 milliseconds vs 48 hours on a dataset of 10,000,000 users",
    "Preventing high-severity production database query timeouts under high traffic load",
    "Selecting optimal data structures (e.g. Hash Map O(1) lookup vs Unsorted Array O(N) scan)",
    "Passing technical coding interviews at top tech companies (FAANG/MAMAA)",
  ],
  advantages: [
    "Machine-independent evaluation metric focusing purely on algorithm design",
    "Predicts scaling behavior for massive real-world input growth (N -> ∞)",
    "Exposes hidden performance bottlenecks and unnecessary memory allocations early",
  ],
  disadvantages: [
    "Ignores constant factors (e.g. O(1000N) vs O(N²)) for small input sizes N < 50",
    "Does not capture hardware-level CPU L1/L2 cache misses or disk IO bottlenecks",
  ],
  interviewQuestions: [
    {
      question: "Why do we drop constants and non-dominant terms in Big-O analysis (e.g., O(3N² + 50N + 100) becomes O(N²))?",
      answer:
        "Big-O measures asymptotic upper-bound growth as N approaches infinity. When N reaches 1,000,000, N² equals 1,000,000,000,000, making 50N (50,000,000) and constant 100 completely negligible in shaping the curve slope.",
    },
    {
      question: "What is the distinction between Big-O (O), Big-Omega (Ω), and Big-Theta (Θ)?",
      answer:
        "Big-O (O) represents the upper bound (worst-case scenario). Big-Omega (Ω) represents the lower bound (best-case scenario). Big-Theta (Θ) represents tight bound (when worst-case and best-case match asymptotical growth).",
    },
    {
      question: "Why is Binary Search O(log N) while Linear Search is O(N)?",
      answer:
        "Binary Search halves the remaining search space with every single comparison step (N -> N/2 -> N/4 ... -> 1), taking log2(N) steps. Linear Search inspects elements sequentially one by one, taking up to N steps.",
    },
    {
      question: "What is Space Complexity vs Auxiliary Space?",
      answer:
        "Space Complexity measures total memory consumed by an algorithm including input storage. Auxiliary Space measures extra or temporary memory allocated during execution (stack frames, scratch arrays).",
    },
  ],
  visualizerRoute: "",
  visualizerLabel: "Concept-Only Foundation",

  commonMistakes: [
    "Assuming two consecutive loops represent O(N²) instead of O(2N) -> O(N)",
    "Ignoring recursive call stack depth when calculating space complexity",
    "Confusing loop variables when iterating over two different arrays: O(A * B) vs O(N²)",
    "Assuming built-in language operations like `.indexOf()` or `.slice()` are O(1) constant time",
  ],

  projectIdeas: [
    "Algorithm Benchmark Suite: Build a Web worker application plotting real execution execution timing curves for O(N), O(N log N), and O(N²) algorithms",
    "Big-O AST Analyzer: Create a Static Code Analysis tool that counts loop nesting depth in JavaScript code blocks to estimate runtime complexity",
    "Data Scale Simulator: Build a dashboard demonstrating memory footprint growth across 1K, 1M, and 1B records for various data structures",
    "Recursion Visualizer: Build an interactive tree rendering recursion depth and total call node counts for Fibonacci algorithms",
  ],

  youtubeVideos: [
    {
      id: "bigo-yt-1",
      title: "Big-O Notation in 15 Minutes",
      channel: "CS Simplified",
      duration: "15 mins",
      url: "https://youtube.com/results?search_query=Big+O+Notation+Comprehensive+Guide+CS",
      description: "Visual explanation of Big-O growth curves, rules, and mathematical bounds.",
    },
    {
      id: "bigo-yt-2",
      title: "Space & Time Complexity Analysis",
      channel: "Interview Prep HQ",
      duration: "18 mins",
      url: "https://youtube.com/results?search_query=Time+and+Space+Complexity+Interview+Guide",
      description: "Step-by-step code complexity calculation walkthrough for technical interviews.",
    },
  ],

  detailedNotesHtml: `
    <div style="font-family: system-ui, sans-serif; line-height: 1.7; color: #CBD5E1;">
      <h2 style="color: #8B5CF6; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">1. The Asymptotic Growth Curve Hierarchy</h2>
      <p>Algorithms are ranked by how their operation count scales relative to input size N:</p>

      <!-- Visual Diagram 1: Big-O Curves -->
      <div style="background: #0B1120; border: 1px solid #7C3AED; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #34D399; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 1: Asymptotic Growth Rate Curves</div>
        <svg viewBox="0 0 550 240" style="width: 100%; max-width: 520px; height: auto;">
          <!-- Axes -->
          <line x1="40" y1="210" x2="520" y2="210" stroke="#475569" stroke-width="2"/>
          <line x1="40" y1="210" x2="40" y2="20" stroke="#475569" stroke-width="2"/>
          <text x="280" y="235" fill="#94A3B8" font-size="11" text-anchor="middle">Input Size (N) →</text>
          <text x="15" y="115" fill="#94A3B8" font-size="11" transform="rotate(-90 15,115)" text-anchor="middle">Operations →</text>

          <!-- O(1) Line -->
          <line x1="40" y1="200" x2="500" y2="200" stroke="#10B981" stroke-width="3"/>
          <text x="510" y="204" fill="#10B981" font-size="11" font-weight="bold">O(1)</text>

          <!-- O(log N) Curve -->
          <path d="M 40 200 Q 200 170 500 150" fill="none" stroke="#06B6D4" stroke-width="3"/>
          <text x="510" y="154" fill="#06B6D4" font-size="11" font-weight="bold">O(log N)</text>

          <!-- O(N) Line -->
          <line x1="40" y1="200" x2="500" y2="90" stroke="#3B82F6" stroke-width="3"/>
          <text x="510" y="94" fill="#3B82F6" font-size="11" font-weight="bold">O(N)</text>

          <!-- O(N log N) Curve -->
          <path d="M 40 200 Q 250 120 420 30" fill="none" stroke="#F59E0B" stroke-width="3"/>
          <text x="430" y="30" fill="#F59E0B" font-size="11" font-weight="bold">O(N log N)</text>

          <!-- O(N^2) Curve -->
          <path d="M 40 200 Q 150 150 200 20" fill="none" stroke="#F43F5E" stroke-width="3"/>
          <text x="205" y="20" fill="#F43F5E" font-size="11" font-weight="bold">O(N²)</text>
        </svg>
      </div>

      <h2 style="color: #06B6D4; margin-top: 24px;">2. Step-by-Step Code Complexity Analysis Walkthrough</h2>
      <p>Analyze this double-loop function calculating pair sums:</p>

      <pre style="background: #050816; border: 1px solid #1E293B; border-radius: 8px; padding: 14px; color: #34D399; font-family: monospace; font-size: 13px;">
function countPairs(arr) {
  let count = 0;                  // 1 operation -> O(1)
  let n = arr.length;             // 1 operation -> O(1)
  
  for (let i = 0; i < n; i++) {   // Outer loop runs N times
    for (let j = i + 1; j < n; j++) { // Inner loop runs (N-1) + (N-2) ... + 1 times
      if (arr[i] + arr[j] === 10) {
        count++;                  // O(1) inside inner loop
      }
    }
  }
  return count;                   // 1 operation -> O(1)
}
      </pre>

      <h3 style="color: #F59E0B;">Mathematical Expansion & Simplification Steps:</h3>
      <ol style="line-height: 1.8;">
        <li><strong>Inner loop iterations:</strong> When <code>i=0</code>, inner loop executes <code>N-1</code> times. When <code>i=1</code>, inner loop executes <code>N-2</code> times... down to 1.</li>
        <li><strong>Summation Series:</strong> Total operations = <code>(N-1) + (N-2) + ... + 2 + 1 = N * (N - 1) / 2</code>.</li>
        <li><strong>Algebraic Expansion:</strong> Total operations = <code>N²/2 - N/2</code>.</li>
        <li><strong>Drop Constants & Low-Order Terms:</strong> <code>N²/2</code> becomes <code>N²</code>, and <code>- N/2</code> is dropped.</li>
        <li><strong>Final Asymptotic Bound:</strong> <code style="color: #F43F5E; font-weight: bold;">O(N²) Quadratic Time</code>.</li>
      </ol>

      <!-- Visual Diagram 2: Nested Loop Operations Matrix -->
      <div style="background: #0B1120; border: 1px solid #3B82F6; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #60A5FA; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 2: Nested Loop Triangular Matrix Iteration (N * (N-1) / 2)</div>
        <svg viewBox="0 0 450 160" style="width: 100%; max-width: 420px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <!-- Row headers -->
            <text x="30" y="30" fill="#94A3B8">i=0</text>
            <text x="30" y="60" fill="#94A3B8">i=1</text>
            <text x="30" y="90" fill="#94A3B8">i=2</text>
            <text x="30" y="120" fill="#94A3B8">i=3</text>

            <!-- Cells -->
            <rect x="70" y="15" width="40" height="22" rx="4" fill="#3B82F6"/> <text x="90" y="30" fill="#FFF">j=1</text>
            <rect x="120" y="15" width="40" height="22" rx="4" fill="#3B82F6"/> <text x="140" y="30" fill="#FFF">j=2</text>
            <rect x="170" y="15" width="40" height="22" rx="4" fill="#3B82F6"/> <text x="190" y="30" fill="#FFF">j=3</text>
            <rect x="220" y="15" width="40" height="22" rx="4" fill="#3B82F6"/> <text x="240" y="30" fill="#FFF">j=4</text>

            <rect x="120" y="45" width="40" height="22" rx="4" fill="#3B82F6"/> <text x="140" y="60" fill="#FFF">j=2</text>
            <rect x="170" y="45" width="40" height="22" rx="4" fill="#3B82F6"/> <text x="190" y="60" fill="#FFF">j=3</text>
            <rect x="220" y="45" width="40" height="22" rx="4" fill="#3B82F6"/> <text x="240" y="60" fill="#FFF">j=4</text>

            <rect x="170" y="75" width="40" height="22" rx="4" fill="#3B82F6"/> <text x="190" y="90" fill="#FFF">j=3</text>
            <rect x="220" y="75" width="40" height="22" rx="4" fill="#3B82F6"/> <text x="240" y="90" fill="#FFF">j=4</text>

            <rect x="220" y="105" width="40" height="22" rx="4" fill="#3B82F6"/> <text x="240" y="120" fill="#FFF">j=4</text>

            <!-- Total note -->
            <text x="350" y="75" fill="#34D399" font-weight="bold">Total = 10 cells</text>
            <text x="350" y="95" fill="#A7F3D0">O(N²) growth</text>
          </g>
        </svg>
      </div>

      <!-- Visual Diagram 3: Logarithmic Halving -->
      <div style="background: #0B1120; border: 1px solid #06B6D4; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #22D3EE; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 3: Logarithmic O(log N) Halving Reduction</div>
        <svg viewBox="0 0 500 130" style="width: 100%; max-width: 480px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <rect x="20" y="20" width="100" height="35" rx="4" fill="#1E293B" stroke="#06B6D4"/>
            <text x="70" y="42" fill="#FFF">N = 16</text>

            <text x="140" y="42" fill="#06B6D4">→ /2 →</text>

            <rect x="180" y="20" width="75" height="35" rx="4" fill="#1E293B" stroke="#06B6D4"/>
            <text x="217" y="42" fill="#FFF">N = 8</text>

            <text x="275" y="42" fill="#06B6D4">→ /2 →</text>

            <rect x="310" y="20" width="55" height="35" rx="4" fill="#1E293B" stroke="#06B6D4"/>
            <text x="337" y="42" fill="#FFF">N = 4</text>

            <text x="385" y="42" fill="#06B6D4">→ /2 →</text>

            <rect x="420" y="20" width="40" height="35" rx="4" fill="#065F46" stroke="#34D399"/>
            <text x="440" y="42" fill="#FFF">N = 1</text>

            <text x="250" y="95" fill="#34D399" font-weight="bold">Only 4 Steps! log2(16) = 4</text>
          </g>
        </svg>
      </div>
    </div>
  `,

  quiz: [
    {
      id: "bigo-q1",
      question: "What is the time complexity of two nested loops where both loops iterate from 0 to N?",
      options: ["O(N)", "O(2N)", "O(N²)", "O(log N)"],
      correctIndex: 2,
      explanation: "Executing N outer iterations with N inner iterations results in N * N = N² total operations.",
    },
    {
      id: "bigo-q2",
      question: "Which time complexity represents the fastest asymptotic runtime for large input N?",
      options: ["O(N log N)", "O(N²)", "O(1)", "O(N)"],
      correctIndex: 2,
      explanation: "O(1) constant time performs fixed operations regardless of how large N grows.",
    },
    {
      id: "bigo-q3",
      question: "How does binary search achieve O(log N) time complexity?",
      options: [
        "By inspecting elements in steps of 10",
        "By halving the search window space at every iteration step",
        "By executing on parallel GPU cores",
        "By pre-allocating a hash table",
      ],
      correctIndex: 1,
      explanation: "Cutting the search space in half each step reduces N down to 1 in log2(N) operations.",
    },
    {
      id: "bigo-q4",
      question: "What is the simplified Big-O notation for function runtime f(N) = 5N³ + 100N² + 5000?",
      options: ["O(5N³)", "O(N³ + N²)", "O(N³)", "O(5000)"],
      correctIndex: 2,
      explanation: "In asymptotic analysis, multiplier constants are dropped and only the highest-order term (N³) is retained.",
    },
    {
      id: "bigo-q5",
      question: "What is the time complexity of iterating through an N x M 2D matrix?",
      options: ["O(N²)", "O(N + M)", "O(N * M)", "O(log(N*M))"],
      correctIndex: 2,
      explanation: "Iterating every row (N) and every column (M) results in N * M element operations.",
    },
    {
      id: "bigo-q6",
      question: "What notation represents the tight bound (matching best and worst case asymptotic behavior)?",
      options: ["Big-O (O)", "Big-Omega (Ω)", "Big-Theta (Θ)", "Little-o"],
      correctIndex: 2,
      explanation: "Big-Theta (Θ) specifies exact tight bound asymptotic scaling.",
    },
    {
      id: "bigo-q7",
      question: "What is the space complexity of a recursive function with maximum recursion depth N?",
      options: ["O(1)", "O(log N)", "O(N)", "O(N²)"],
      correctIndex: 2,
      explanation: "Each recursive frame remains open on the call stack, consuming O(N) auxiliary stack memory.",
    },
    {
      id: "bigo-q8",
      question: "Which algorithm class exhibits logarithmic O(log N) time complexity?",
      options: ["Bubble Sort", "Balanced Binary Search Tree Lookup", "Matrix Multiplication", "Linear Unsorted Array Search"],
      correctIndex: 1,
      explanation: "Searching a balanced Binary Search Tree cuts candidate paths in half per level (log N).",
    },
    {
      id: "bigo-q9",
      question: "Why is Merge Sort O(N log N) time complexity?",
      options: [
        "It splits the array log N times and merges N elements at each level",
        "It uses a hash table internally",
        "It runs nested loops over N items",
        "It iterates backwards through the array",
      ],
      correctIndex: 0,
      explanation: "Recursively halving creates log N tree levels, and merging requires O(N) work per level = O(N log N).",
    },
    {
      id: "bigo-q10",
      question: "What is the time complexity of checking if a Hash Map contains a specific key?",
      options: ["O(N)", "O(N log N)", "O(1) Average", "O(N²)"],
      correctIndex: 2,
      explanation: "Hash computation and index mapping yield O(1) average constant time key lookups.",
    },
  ],

  practiceProblems: [
    {
      id: "bigo-p1",
      title: "1. Calculate Complexity: Midpoint Finding",
      difficulty: "Easy",
      description: "Calculate the time and space complexity of finding array midpoint `let mid = Math.floor(arr.length / 2)`.",
      hints: ["Length reading and arithmetic division take 1 CPU cycle."],
      starterCode: `function getMidpoint(arr) {
  return arr[Math.floor(arr.length / 2)];
}`,
      solutionExplanation: "Direct array access via index computation takes O(1) time and O(1) space.",
      testCases: [
        { input: [[1, 2, 3, 4, 5]], expected: 3 },
        { input: [["a", "b", "c", "d"]], expected: "c" },
      ],
    },
  ],
};

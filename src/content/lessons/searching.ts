import type { LessonContent } from "@/types/lesson";

export const searchingLesson: LessonContent = {
  slug: "searching",
  topicKey: "Searching",
  title: "Searching Algorithms, Binary Search & Monotonic Optimization",
  introduction:
    "Searching algorithms locate specific target values within data collections. Binary Search operates on sorted collections or monotonic decision spaces, halving the search window at each step to achieve logarithmic O(log N) performance.",
  analogy:
    "Think of looking up a name in a physical 1,000-page telephone directory. Instead of scanning page by page from page 1 (Linear Search O(N)), you open directly to page 500. If your target name starts with 'M' and page 500 is 'K', you throw away pages 1 to 499 and open to page 750. Repeating this halving reaches your target in just 10 page opens (log2(1000) ≈ 10).",
  timeComplexity: [
    { operation: "Linear Search (Unsorted)", complexity: "O(N) Linear" },
    { operation: "Binary Search (Sorted Array)", complexity: "O(log N) Logarithmic" },
    { operation: "Binary Search on Answer Space", complexity: "O(N log(Range))" },
    { operation: "Hash Table Key Lookup", complexity: "O(1) Average Constant" },
    { operation: "Trie Word Search", complexity: "O(L) where L is Word Length" },
  ],
  spaceComplexity: "O(1) auxiliary space for iterative Binary Search; O(log N) call stack space for recursive implementations.",
  applications: [
    "Database indexing and B-Tree range scans for instant query lookups",
    "Finding exact element boundaries (`lower_bound` / `upper_bound` variants)",
    "Rotated sorted array searches in distributed log stores",
    "Binary Search on Answer Space (e.g. minimum capacity required to ship packages within D days)",
  ],
  advantages: [
    "Logarithmic scale easily handles billions of elements (log2(1,000,000,000) ≈ 30 operations)",
    "Extends beyond arrays to solve optimization problems across continuous monotonic functions",
  ],
  disadvantages: [
    "Binary Search strictly requires pre-sorted input data or monotonic functions",
    "High maintenance cost to keep dynamic data sorted under frequent write operations",
  ],
  interviewQuestions: [
    {
      question: "How do you calculate mid in Binary Search to prevent integer overflow bug?",
      answer:
        "Use `mid = low + Math.floor((high - low) / 2)` instead of `(low + high) / 2`. When `low` and `high` are large integers near `2^31 - 1`, `(low + high)` overflows to negative values in 32-bit signed integers.",
    },
    {
      question: "How do you search for a target element in a Rotated Sorted Array in O(log N) time?",
      answer:
        "Calculate `mid`. One half of the array (left `[low...mid]` or right `[mid...high]`) is guaranteed to be strictly sorted. Check if `target` falls within the range of the sorted half; if yes, search that half, otherwise search the opposite half.",
    },
    {
      question: "What is 'Binary Search on Answer Space' and when is it applied?",
      answer:
        "When a problem asks for the 'minimum maximum' or 'maximum minimum' value and the feasibility function `canAchieve(X)` is monotonic (if X is possible, all Y > X are also possible), binary search over the numeric answer range `[min_possible, max_possible]` delivers O(Cost * log(Range)) optimal solutions.",
    },
    {
      question: "What is the difference between `lower_bound` and `upper_bound`?",
      answer:
        "`lower_bound` returns the index of the first element greater than or equal to target (`>= target`). `upper_bound` returns the index of the first element strictly greater than target (`> target`). The count of duplicates equals `upper_bound - lower_bound`.",
    },
  ],
  visualizerRoute: "/searching",
  visualizerLabel: "Launch Interactive Searching Visualizer",

  commonMistakes: [
    "Using `(low + high) / 2` causing 32-bit integer overflow bugs on large input ranges",
    "Infinite loops caused by incorrect pointer updating (`high = mid` vs `high = mid - 1`)",
    "Executing Binary Search on an unsorted array without sorting it first",
    "Off-by-one errors when setting loop exit conditions (`while (low <= high)` vs `while (low < high)`)",
  ],

  projectIdeas: [
    "High-Precision Square Root / Equation Solver: Build a scientific calculator using Binary Search to compute square roots and polynomial roots to 10 decimal places",
    "Log Search & Analytics Tool: Create a log server engine using Binary Search `lower_bound` to query log entries by timestamp across 10M records in 1ms",
    "Capacity & Transport Route Optimizer: Implement a logistics dashboard solving the 'Ship Packages within D Days' problem via Binary Search on Answer Space",
    "Interactive Search Visualizer: Build a visual workspace animating index window shrinkage for Linear, Binary, and Ternary Search algorithms",
  ],

  youtubeVideos: [
    {
      id: "sr-yt-1",
      title: "Binary Search Visualized & Explained",
      channel: "CS Dojo",
      duration: "15 mins",
      url: "https://youtube.com/results?search_query=Binary+Search+Algorithm+Visualized+Tutorial",
      description: "Visual breakdown of Binary Search window halving and off-by-one prevention.",
    },
    {
      id: "sr-yt-2",
      title: "Binary Search on Answer Space Masterclass",
      channel: "LeetCode Pro",
      duration: "22 mins",
      url: "https://youtube.com/results?search_query=Binary+Search+on+Answer+Space+Rotated+Array",
      description: "In-depth guide to rotated sorted array search and search-on-answer patterns.",
    },
  ],

  detailedNotesHtml: `
    <div style="font-family: system-ui, sans-serif; line-height: 1.7; color: #CBD5E1;">
      <h2 style="color: #8B5CF6; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">1. Binary Search Logarithmic Window Halving</h2>
      <p>Binary Search halves the remaining search range at each step until target is found or window collapses:</p>

      <!-- Visual Diagram 1: Search Window Shrinkage -->
      <div style="background: #0B1120; border: 1px solid #7C3AED; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #34D399; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 1: Binary Search Halving Range for Target = 23</div>
        <svg viewBox="0 0 550 180" style="width: 100%; max-width: 520px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <!-- Full Array -->
            <rect x="20" y="25" width="500" height="30" rx="4" fill="#1E1B4B" stroke="#8B5CF6"/>
            <text x="270" y="44" fill="#FFF">[2, 5, 8, 12, 16, 23, 38, 56, 72, 91] (N=10)</text>

            <text x="270" y="70" fill="#38BDF8">Mid = 16 -> 23 > 16 -> Eliminate Left Half</text>

            <!-- Step 2 -->
            <rect x="270" y="85" width="250" height="30" rx="4" fill="#065F46" stroke="#34D399"/>
            <text x="395" y="104" fill="#FFF">[23, 38, 56, 72, 91] (N=5)</text>

            <text x="395" y="130" fill="#FBBF24">Mid = 56 -> 23 < 56 -> Search Left Half</text>

            <!-- Step 3 Match -->
            <rect x="270" y="145" width="100" height="28" rx="4" fill="#7C3AED"/>
            <text x="320" y="163" fill="#FFF" font-weight="bold">FOUND 23!</text>
          </g>
        </svg>
      </div>

      <h2 style="color: #06B6D4; margin-top: 24px;">2. Rotated Sorted Array Search Step-by-Step Code Walkthrough</h2>
      <p>Searching in `[4, 5, 6, 7, 0, 1, 2]` for `target = 0` in O(log N) time:</p>

      <pre style="background: #050816; border: 1px solid #1E293B; border-radius: 8px; padding: 14px; color: #34D399; font-family: monospace; font-size: 13px;">
function searchRotated(nums, target) {
  let low = 0, high = nums.length - 1;
  
  while (low <= high) {
    let mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) return mid;
    
    // Check if Left Half is sorted
    if (nums[low] <= nums[mid]) {
      if (nums[low] <= target && target < nums[mid]) {
        high = mid - 1; // Target lies in sorted left half
      } else {
        low = mid + 1;  // Target in right half
      }
    } else { // Right Half is sorted
      if (nums[mid] < target && target <= nums[high]) {
        low = mid + 1;  // Target lies in sorted right half
      } else {
        high = mid - 1; // Target in left half
      }
    }
  }
  return -1; // Target not found
}
      </pre>

      <h3 style="color: #F59E0B;">Step-by-Step State Trace for `[4, 5, 6, 7, 0, 1, 2]`, Target = `0`:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px;">
        <thead>
          <tr style="background: #1E293B; color: #38BDF8;">
            <th style="padding: 8px; border: 1px solid #334155;">Step</th>
            <th style="padding: 8px; border: 1px solid #334155;">Window [low...high]</th>
            <th style="padding: 8px; border: 1px solid #334155;">`mid` Value</th>
            <th style="padding: 8px; border: 1px solid #334155;">Sorted Half Decision</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">1</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>low=0, high=6</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>mid=3 (val=7)</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">Left `[4..7]` sorted. Target `0` not in `[4..7]`. Set `low = 4`.</td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">2</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>low=4, high=6</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>mid=5 (val=1)</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">Right `[1..2]` sorted. Target `0 < 1`. Set `high = 4`.</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">3</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>low=4, high=4</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>mid=4 (val=0)</code></td>
            <td style="padding: 8px; border: 1px solid #334155; color: #34D399; font-weight: bold;">Match Found at Index 4!</td>
          </tr>
        </tbody>
      </table>

      <!-- Visual Diagram 2: Binary Search on Answer Monotonic Function -->
      <div style="background: #0B1120; border: 1px solid #06B6D4; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #22D3EE; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 2: Monotonic Decision Boundary (False -> True)</div>
        <svg viewBox="0 0 500 120" style="width: 100%; max-width: 460px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <rect x="30" y="45" width="45" height="30" rx="3" fill="#881337"/> <text x="52" y="64" fill="#FFF">F</text>
            <rect x="80" y="45" width="45" height="30" rx="3" fill="#881337"/> <text x="102" y="64" fill="#FFF">F</text>
            <rect x="130" y="45" width="45" height="30" rx="3" fill="#881337"/> <text x="152" y="64" fill="#FFF">F</text>

            <rect x="200" y="45" width="55" height="30" rx="3" fill="#065F46" stroke="#34D399"/> <text x="227" y="64" fill="#FFF" font-weight="bold">T (Min)</text>
            <rect x="260" y="45" width="45" height="30" rx="3" fill="#065F46"/> <text x="282" y="64" fill="#FFF">T</text>
            <rect x="310" y="45" width="45" height="30" rx="3" fill="#065F46"/> <text x="332" y="64" fill="#FFF">T</text>

            <text x="227" y="100" fill="#34D399" font-weight="bold">First True = Target Answer</text>
          </g>
        </svg>
      </div>

      <!-- Visual Diagram 3: Lower vs Upper Bound Indexing -->
      <div style="background: #0B1120; border: 1px solid #F59E0B; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #FBBF24; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 3: `lower_bound` (>= Target) vs `upper_bound` (> Target)</div>
        <svg viewBox="0 0 500 130" style="width: 100%; max-width: 460px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <text x="250" y="25" fill="#FFF">Sorted Array: [10, 20, 20, 20, 30, 40], Target = 20</text>

            <rect x="150" y="45" width="50" height="30" rx="3" fill="#312E81" stroke="#38BDF8"/> <text x="175" y="64" fill="#FFF">20</text>
            <rect x="205" y="45" width="50" height="30" rx="3" fill="#312E81"/> <text x="230" y="64" fill="#FFF">20</text>
            <rect x="260" y="45" width="50" height="30" rx="3" fill="#312E81"/> <text x="285" y="64" fill="#FFF">20</text>
            <rect x="315" y="45" width="50" height="30" rx="3" fill="#451A03" stroke="#F59E0B"/> <text x="340" y="64" fill="#FFF">30</text>

            <text x="175" y="105" fill="#38BDF8" font-weight="bold">lower_bound = Idx 1 (>=20)</text>
            <text x="340" y="105" fill="#F59E0B" font-weight="bold">upper_bound = Idx 4 (>20)</text>
          </g>
        </svg>
      </div>
    </div>
  `,

  quiz: [
    {
      id: "sr-q1",
      question: "What is the worst-case time complexity of Binary Search on a sorted array of size N?",
      options: ["O(log N)", "O(N)", "O(1)", "O(N log N)"],
      correctIndex: 0,
      explanation: "Binary search eliminates half the remaining candidate elements per step, executing in O(log N) time.",
    },
    {
      id: "sr-q2",
      question: "Why should you use `mid = low + Math.floor((high - low) / 2)` instead of `(low + high) / 2`?",
      options: ["Prevents 32-bit signed integer overflow when low + high exceeds 2^31 - 1", "Runs faster on GPUs", "Converts floats into strings", "Guarantees array sorting"],
      correctIndex: 0,
      explanation: "Subtracting low from high avoids large intermediate additions that trigger 32-bit integer overflow.",
    },
    {
      id: "sr-q3",
      question: "What essential precondition is required before running Binary Search on an array?",
      options: ["The array elements must be pre-sorted or form a monotonic function", "The array size must be an even number", "The array must contain positive integers only", "The array must be stored on disk"],
      correctIndex: 0,
      explanation: "Binary Search relies on directional elimination, which is only valid if data is sorted or monotonic.",
    },
    {
      id: "sr-q4",
      question: "How does searching in a Rotated Sorted Array maintain O(log N) runtime?",
      options: ["At least one half (left or right) is guaranteed to be sorted at any step", "By sorting the array first", "By converting the array into a matrix", "By using a Hash Map"],
      correctIndex: 0,
      explanation: "Identifying the sorted half allows checking if the target lies within its bounds in O(1) time per step.",
    },
    {
      id: "sr-q5",
      question: "What does `lower_bound` return when searching for target T in a sorted array?",
      options: ["Index of first element greater than or equal to T (>= T)", "Index of last element smaller than T", "Exact index of T or -1", "Index of middle element"],
      correctIndex: 0,
      explanation: "`lower_bound` locates the first position where the element is at least T (>= T).",
    },
    {
      id: "sr-q6",
      question: "What is the time complexity of searching for a key in a balanced Hash Map?",
      options: ["O(1) Average Constant", "O(log N)", "O(N)", "O(N log N)"],
      correctIndex: 0,
      explanation: "Hash table bucket computation enables O(1) average time key lookups.",
    },
    {
      id: "sr-q7",
      question: "In Binary Search on Answer Space, what property must the feasibility function `canAchieve(X)` satisfy?",
      options: ["Monotonicity (if true for X, true for all values beyond X)", "Differentiability", "Symmetry", "Linearity"],
      correctIndex: 0,
      explanation: "Monotonicity guarantees that a clear decision boundary divides impossible candidate answers from possible ones.",
    },
    {
      id: "sr-q8",
      question: "How many comparison steps does Binary Search require to search 1,000,000 sorted elements?",
      options: ["At most 20 steps (log2(1,000,000) ≈ 19.9)", "100,000 steps", "1,000,000 steps", "500,000 steps"],
      correctIndex: 0,
      explanation: "2^20 = 1,048,576, meaning Binary Search takes at most 20 steps to search 1M items.",
    },
    {
      id: "sr-q9",
      question: "What is Ternary Search used for?",
      options: ["Finding local extrema (maximum/minimum) of a unimodal function", "Sorting strings", "Searching binary trees", "Graph pathfinding"],
      correctIndex: 0,
      explanation: "Ternary search splits the search range into 3 parts to find local peak extrema on unimodal functions.",
    },
    {
      id: "sr-q10",
      question: "What is the auxiliary space complexity of iterative Binary Search?",
      options: ["O(1) Auxiliary Space", "O(log N)", "O(N)", "O(N²)"],
      correctIndex: 0,
      explanation: "Iterative Binary Search uses 3 integer index variables (`low`, `high`, `mid`), consuming O(1) space.",
    },
  ],

  practiceProblems: [
    {
      id: "sr-p1",
      title: "1. Binary Search",
      difficulty: "Easy",
      description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, return its index; otherwise, return `-1`.",
      hints: ["Initialize low=0, high=nums.length-1. In loop while low <= high: mid = low + Math.floor((high - low)/2)."],
      starterCode: `function search(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
      solutionExplanation: "Standard iterative Binary Search achieves O(log N) time and O(1) space.",
      testCases: [
        { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
        { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      ],
    },
    {
      id: "sr-p2",
      title: "2. Search in Rotated Sorted Array",
      difficulty: "Medium",
      description: "Given the array `nums` after possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums` in O(log N) time.",
      hints: ["Find mid. Determine if left half or right half is sorted. Check if target lies within sorted bounds."],
      starterCode: `function searchRotated(nums, target) {
  let low = 0, high = nums.length - 1;
  while (low <= high) {
    let mid = low + Math.floor((high - low) / 2);
    if (nums[mid] === target) return mid;
    if (nums[low] <= nums[mid]) {
      if (nums[low] <= target && target < nums[mid]) high = mid - 1;
      else low = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[high]) low = mid + 1;
      else high = mid - 1;
    }
  }
  return -1;
}`,
      solutionExplanation: "Rotated search maintains O(log N) time complexity.",
      testCases: [
        { input: [[4,5,6,7,0,1,2], 0], expected: 4 },
        { input: [[4,5,6,7,0,1,2], 3], expected: -1 },
      ],
    },
  ],
};

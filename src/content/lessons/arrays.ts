import type { LessonContent } from "@/types/lesson";

export const arraysLesson: LessonContent = {
  slug: "arrays",
  topicKey: "Arrays",
  title: "Arrays & Contiguous Memory Architecture",
  introduction:
    "An array is a foundational linear data structure storing elements in contiguous memory locations. Direct O(1) index computation via address arithmetic makes arrays the fundamental building block of high-performance software systems.",
  analogy:
    "Think of an array like a numbered row of adjacent lockers in a gym. If locker #0 starts at address 100 and every locker is 4 bytes wide, you can instantly step directly to locker #50 at address 100 + (50 * 4) = 300 without checking lockers 0 to 49.",
  timeComplexity: [
    { operation: "Access by Index", complexity: "O(1) Constant" },
    { operation: "Search (Unsorted)", complexity: "O(N) Linear" },
    { operation: "Search (Sorted - Binary Search)", complexity: "O(log N) Logarithmic" },
    { operation: "Insert / Delete at End", complexity: "O(1) Amortized" },
    { operation: "Insert / Delete at Beginning / Middle", complexity: "O(N) Linear (Element Shifting)" },
  ],
  spaceComplexity: "O(N) — contiguous block of RAM allocated for N elements.",
  applications: [
    "Lookup tables, 2D/3D matrix graphics pipelines, and pixel image buffers",
    "Underlying store for Stacks, Queues, Binary Heaps, Hash Tables, and Dynamic Vectors",
    "Ring buffers for low-latency audio streaming and high-frequency order books",
    "Prefix Sum & Sliding Window algorithmic optimization patterns",
  ],
  advantages: [
    "O(1) element access via formula: Base_Address + Index * Element_Size",
    "Maximum CPU L1/L2 cache line prefetching hit rate due to spatial memory locality",
    "Zero pointer memory overhead per element compared to node-based structures",
  ],
  disadvantages: [
    "Fixed memory capacity in static arrays requiring up-front size declarations",
    "Costly O(N) element shifting required when inserting or deleting at arbitrary indices",
    "Requires large contiguous free RAM chunks, triggering allocation failures when memory is fragmented",
  ],
  interviewQuestions: [
    {
      question: "Why is array access O(1) while Linked List access is O(N)?",
      answer:
        "Array memory is strictly contiguous. The CPU calculates exact target addresses instantly via formula `Base + (Index * ItemSize)`. Linked list nodes are scattered randomly across the heap, requiring sequential pointer traversals from head.",
    },
    {
      question: "How do dynamic arrays (e.g. JS Array, C++ std::vector) achieve amortized O(1) append time?",
      answer:
        "When capacity is exhausted, dynamic arrays allocate double capacity (2x) and copy existing items over. Doubling happens only log2(N) times across N appends. Summing total copy operations (1 + 2 + 4 + ... + N = 2N) yields O(2N)/N = O(1) amortized per append.",
    },
    {
      question: "What is the Two Pointer technique and when should you use it?",
      answer:
        "Two Pointers involves using two integer index variables (e.g., left and right) moving towards each other or at varying speeds. Common applications include in-place array reversal, Two Sum on sorted arrays, container with most water, and sliding window subsegments.",
    },
    {
      question: "What is the Prefix Sum array technique and why is it useful?",
      answer:
        "Prefix Sum precomputes running cumulative totals `P[i] = P[i-1] + arr[i]`. This enables querying any contiguous range sum `arr[L...R]` in O(1) constant time via formula `P[R] - P[L-1]` instead of re-looping in O(N).",
    },
  ],
  visualizerRoute: "/visualizer",
  visualizerLabel: "Launch Interactive Array Visualizer",

  commonMistakes: [
    "Off-by-one errors when accessing `arr[arr.length]` (index out of bounds)",
    "Forgetting that inserting at index 0 requires shifting all N elements to the right (O(N))",
    "Creating an uninitialized array clone via shallow assignment `let b = a` instead of `a.slice()`",
    "Mutating array length while iterating over it in a forward loop",
  ],

  projectIdeas: [
    "High-Performance Image Matrix Processor: Build a WebGL pixel manipulation engine operating directly on Uint8ClampedArray pixel buffers",
    "Stock Market Prefix Sum Analytics: Create a financial engine computing sliding window volatility and range query returns across 1M stock ticks in O(1) time",
    "Audio Waveform Ring Buffer: Implement a fixed-size circular array audio queue for real-time WebAudio processing",
    "In-Memory Database Column Store: Build an array-backed columnar table index supporting binary search range filters",
  ],

  youtubeVideos: [
    {
      id: "arr-yt-1",
      title: "Arrays & Memory Allocation Visualized",
      channel: "Data Structure Deep Dives",
      duration: "14 mins",
      url: "https://youtube.com/results?search_query=Array+Data+Structure+Memory+Layout+Tutorial",
      description: "Visual guide to contiguous RAM allocation, index offset math, and CPU cache lines.",
    },
    {
      id: "arr-yt-2",
      title: "Sliding Window & Two Pointer Patterns",
      channel: "LeetCode Interview Masterclass",
      duration: "22 mins",
      url: "https://youtube.com/results?search_query=Two+Pointer+and+Sliding+Window+Array+Patterns",
      description: "Step-by-step problem walkthroughs for array technical interview questions.",
    },
  ],

  detailedNotesHtml: `
    <div style="font-family: system-ui, sans-serif; line-height: 1.7; color: #CBD5E1;">
      <h2 style="color: #8B5CF6; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">1. Contiguous RAM Architecture & Address Math</h2>
      <p>An array reserves a sequential block of memory cells. Element address calculation follows strict offset arithmetic:</p>

      <!-- Visual Diagram 1: Contiguous Memory Address Calculation -->
      <div style="background: #0B1120; border: 1px solid #7C3AED; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #34D399; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 1: Array Indexing Offset Formula: Address = 0x1000 + (Index * 4 Bytes)</div>
        <svg viewBox="0 0 580 180" style="width: 100%; max-width: 550px; height: auto;">
          <!-- Index headers -->
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <text x="75" y="30" fill="#94A3B8">Index [0]</text>
            <text x="185" y="30" fill="#94A3B8">Index [1]</text>
            <text x="295" y="30" fill="#94A3B8">Index [2]</text>
            <text x="405" y="30" fill="#94A3B8">Index [3]</text>

            <!-- Memory Blocks -->
            <rect x="25" y="45" width="100" height="60" rx="6" fill="#1E1B4B" stroke="#8B5CF6" stroke-width="2"/>
            <text x="75" y="70" fill="#FFF" font-size="14" font-weight="bold">Val: 45</text>
            <text x="75" y="92" fill="#A78BFA" font-size="10">0x1000</text>

            <rect x="135" y="45" width="100" height="60" rx="6" fill="#1E1B4B" stroke="#8B5CF6" stroke-width="2"/>
            <text x="185" y="70" fill="#FFF" font-size="14" font-weight="bold">Val: 82</text>
            <text x="185" y="92" fill="#A78BFA" font-size="10">0x1004</text>

            <rect x="245" y="45" width="100" height="60" rx="6" fill="#1E1B4B" stroke="#8B5CF6" stroke-width="2"/>
            <text x="295" y="70" fill="#FFF" font-size="14" font-weight="bold">Val: 19</text>
            <text x="295" y="92" fill="#A78BFA" font-size="10">0x1008</text>

            <rect x="355" y="45" width="100" height="60" rx="6" fill="#1E1B4B" stroke="#8B5CF6" stroke-width="2"/>
            <text x="405" y="70" fill="#FFF" font-size="14" font-weight="bold">Val: 93</text>
            <text x="405" y="92" fill="#A78BFA" font-size="10">0x100C</text>

            <!-- CPU Calculation Formula Callout -->
            <rect x="25" y="125" width="430" height="35" rx="6" fill="#022C22" stroke="#10B981"/>
            <text x="240" y="147" fill="#34D399" font-size="12" font-weight="bold">Target arr[2] Address = 0x1000 + (2 * 4) = 0x1008 -> O(1) Instant Access</text>
          </g>
        </svg>
      </div>

      <h2 style="color: #06B6D4; margin-top: 24px;">2. Two-Pointer Technique: In-Place Reverse Walkthrough</h2>
      <p>Observe how two index pointers move inwards to reverse an array without auxiliary memory allocation:</p>

      <pre style="background: #050816; border: 1px solid #1E293B; border-radius: 8px; padding: 14px; color: #34D399; font-family: monospace; font-size: 13px;">
function reverseInPlace(arr) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    // Swap elements at left and right pointers
    let temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;
    
    left++;   // Advance left pointer rightward
    right--;  // Advance right pointer leftward
  }
  return arr;
}
      </pre>

      <h3 style="color: #F59E0B;">Step-by-Step State Trace for Input [10, 20, 30, 40, 50]:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px;">
        <thead>
          <tr style="background: #1E293B; color: #38BDF8;">
            <th style="padding: 8px; border: 1px solid #334155;">Step</th>
            <th style="padding: 8px; border: 1px solid #334155;">Pointers State</th>
            <th style="padding: 8px; border: 1px solid #334155;">Action Taken</th>
            <th style="padding: 8px; border: 1px solid #334155;">Array Contents</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">Initial</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>left=0, right=4</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">Swap <code>arr[0] (10)</code> & <code>arr[4] (50)</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[50, 20, 30, 40, 10]</code></td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">Iter 1</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>left=1, right=3</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">Swap <code>arr[1] (20)</code> & <code>arr[3] (40)</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[50, 40, 30, 20, 10]</code></td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">Iter 2</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>left=2, right=2</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>left === right</code> -> Exit Loop</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[50, 40, 30, 20, 10]</code> (Reversed!)</td>
          </tr>
        </tbody>
      </table>

      <!-- Visual Diagram 2: Two Pointer Movement -->
      <div style="background: #0B1120; border: 1px solid #06B6D4; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #22D3EE; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 2: Two-Pointer Convergence Pattern</div>
        <svg viewBox="0 0 500 130" style="width: 100%; max-width: 480px; height: auto;">
          <g font-family="monospace" font-size="12" text-anchor="middle">
            <rect x="40" y="50" width="60" height="40" rx="4" fill="#1E293B" stroke="#06B6D4"/> <text x="70" y="75" fill="#FFF">50</text>
            <rect x="120" y="50" width="60" height="40" rx="4" fill="#1E293B" stroke="#06B6D4"/> <text x="150" y="75" fill="#FFF">40</text>
            <rect x="200" y="50" width="60" height="40" rx="4" fill="#065F46" stroke="#34D399"/> <text x="230" y="75" fill="#FFF">30</text>
            <rect x="280" y="50" width="60" height="40" rx="4" fill="#1E293B" stroke="#06B6D4"/> <text x="310" y="75" fill="#FFF">20</text>
            <rect x="360" y="50" width="60" height="40" rx="4" fill="#1E293B" stroke="#06B6D4"/> <text x="390" y="75" fill="#FFF">10</text>

            <!-- Left pointer -->
            <text x="150" y="30" fill="#38BDF8" font-weight="bold">left →</text>
            <!-- Right pointer -->
            <text x="310" y="30" fill="#F43F5E" font-weight="bold">← right</text>
          </g>
        </svg>
      </div>

      <!-- Visual Diagram 3: Prefix Sum Array Transformation -->
      <div style="background: #0B1120; border: 1px solid #F59E0B; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #FBBF24; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 3: Prefix Sum Array O(1) Range Query Transformation</div>
        <svg viewBox="0 0 520 140" style="width: 100%; max-width: 500px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <text x="70" y="30" fill="#94A3B8">Original Arr:</text>
            <rect x="130" y="15" width="45" height="25" rx="3" fill="#1E293B"/> <text x="152" y="32" fill="#FFF">3</text>
            <rect x="185" y="15" width="45" height="25" rx="3" fill="#1E293B"/> <text x="207" y="32" fill="#FFF">1</text>
            <rect x="240" y="15" width="45" height="25" rx="3" fill="#1E293B"/> <text x="262" y="32" fill="#FFF">4</text>
            <rect x="295" y="15" width="45" height="25" rx="3" fill="#1E293B"/> <text x="317" y="32" fill="#FFF">2</text>
            <rect x="350" y="15" width="45" height="25" rx="3" fill="#1E293B"/> <text x="372" y="32" fill="#FFF">5</text>

            <text x="70" y="80" fill="#F59E0B">Prefix Sum P:</text>
            <rect x="130" y="65" width="45" height="25" rx="3" fill="#451A03" stroke="#F59E0B"/> <text x="152" y="82" fill="#FBBF24">3</text>
            <rect x="185" y="65" width="45" height="25" rx="3" fill="#451A03" stroke="#F59E0B"/> <text x="207" y="82" fill="#FBBF24">4</text>
            <rect x="240" y="65" width="45" height="25" rx="3" fill="#451A03" stroke="#F59E0B"/> <text x="262" y="82" fill="#FBBF24">8</text>
            <rect x="295" y="65" width="45" height="25" rx="3" fill="#451A03" stroke="#F59E0B"/> <text x="317" y="82" fill="#FBBF24">10</text>
            <rect x="350" y="65" width="45" height="25" rx="3" fill="#451A03" stroke="#F59E0B"/> <text x="372" y="82" fill="#FBBF24">15</text>

            <text x="260" y="122" fill="#34D399" font-weight="bold">Range Sum(1 to 3) = P[3] - P[0] = 10 - 3 = 7 -> O(1) Time!</text>
          </g>
        </svg>
      </div>
    </div>
  `,

  quiz: [
    {
      id: "arr-q1",
      question: "What is the time complexity of looking up an element by index in a contiguous array?",
      options: ["O(N)", "O(log N)", "O(1)", "O(N²)"],
      correctIndex: 2,
      explanation: "Offset pointer arithmetic `Base + Index * Size` computes element location in O(1) constant time.",
    },
    {
      id: "arr-q2",
      question: "What is the worst-case time complexity of inserting an element at index 0 of an array of size N?",
      options: ["O(1)", "O(log N)", "O(N)", "O(N²)"],
      correctIndex: 2,
      explanation: "Inserting at index 0 requires shifting all existing N elements 1 position to the right.",
    },
    {
      id: "arr-q3",
      question: "How do dynamic arrays (e.g., C++ `std::vector`) handle capacity expansion when full?",
      options: ["Increase capacity by 1 item", "Double capacity (2x) and copy existing elements", "Convert array into a linked list", "Throw a StackOverflow error"],
      correctIndex: 1,
      explanation: "Doubling capacity amortizes the cost of array resizing down to O(1) per append.",
    },
    {
      id: "arr-q4",
      question: "Why do arrays yield significantly higher CPU cache hit rates than linked lists?",
      options: ["Arrays compress data into zip files", "Array elements reside in contiguous RAM, allowing hardware prefetchers to load entire cache lines", "Linked lists use 64-bit encryption", "Array memory is stored inside CPU registers"],
      correctIndex: 1,
      explanation: "Spatial locality of contiguous array memory allows CPU L1/L2 caches to prefetch adjacent elements.",
    },
    {
      id: "arr-q5",
      question: "What is the range sum of subarray from index L to R using a Prefix Sum array P?",
      options: ["P[R] + P[L]", "P[R] - P[L - 1]", "P[R] * P[L]", "P[R - L]"],
      correctIndex: 1,
      explanation: "Subtracting cumulative sum up to L-1 from cumulative sum up to R isolates subarray sum L...R in O(1).",
    },
    {
      id: "arr-q6",
      question: "What space complexity is required to reverse an array in-place using two pointers?",
      options: ["O(N)", "O(log N)", "O(1)", "O(N²)"],
      correctIndex: 2,
      explanation: "Two pointers swap elements using a single temporary variable, consuming O(1) auxiliary space.",
    },
    {
      id: "arr-q7",
      question: "What is the time complexity of searching for a target value in an unsorted array of size N?",
      options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
      correctIndex: 2,
      explanation: "In an unsorted array, linear search must inspect up to N items in the worst case.",
    },
    {
      id: "arr-q8",
      question: "Which pattern is optimal for finding a contiguous subarray of fixed length K with maximum sum?",
      options: ["Binary Search", "Sliding Window", "Depth First Search", "Dynamic Programming Matrix"],
      correctIndex: 1,
      explanation: "Sliding Window adds the incoming element and subtracts the outgoing element in O(1) per step.",
    },
    {
      id: "arr-q9",
      question: "What occurs when accessing index `arr[arr.length]` in zero-indexed languages like JS or C++?",
      options: ["Returns the middle element", "Triggers Out-of-Bounds Error / Undefined result", "Accesses element 0", "Resizes array automatically"],
      correctIndex: 1,
      explanation: "Zero-indexed arrays of length N have valid indices 0 to N-1; index N is out of bounds.",
    },
    {
      id: "arr-q10",
      question: "What is the time complexity of Kadane's Algorithm for Maximum Subarray Sum?",
      options: ["O(N²)", "O(N log N)", "O(N)", "O(2^N)"],
      correctIndex: 2,
      explanation: "Kadane's algorithm scans the array in a single linear pass updating local and global maximums in O(N).",
    },
  ],

  practiceProblems: [
    {
      id: "arr-p1",
      title: "1. Two Sum (Sorted Array)",
      difficulty: "Easy",
      description: "Given a 1-indexed sorted array `numbers` and a target integer `target`, return the 1-based indices of two numbers that add up to `target` using two pointers.",
      hints: ["Initialize left=0 and right=len-1. If sum > target, right--. If sum < target, left++."],
      starterCode: `function twoSum(numbers, target) {
  let l = 0, r = numbers.length - 1;
  while (l < r) {
    let sum = numbers[l] + numbers[r];
    if (sum === target) return [l + 1, r + 1];
    if (sum < target) l++;
    else r--;
  }
  return [];
}`,
      solutionExplanation: "Two pointer convergence takes O(N) time and O(1) space.",
      testCases: [
        { input: [[2, 7, 11, 15], 9], expected: [1, 2] },
        { input: [[2, 3, 4], 6], expected: [1, 3] },
      ],
    },
    {
      id: "arr-p2",
      title: "2. Maximum Subarray Sum (Kadane's Algorithm)",
      difficulty: "Medium",
      description: "Given an integer array `nums`, find the contiguous subarray with the largest sum and return its sum.",
      hints: ["Maintain current_sum = max(num, current_sum + num) and global_max."],
      starterCode: `function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let currMax = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currMax = Math.max(nums[i], currMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currMax);
  }
  return maxSoFar;
}`,
      solutionExplanation: "Kadane's Algorithm achieves O(N) time complexity and O(1) auxiliary space.",
      testCases: [
        { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
        { input: [[1]], expected: 1 },
      ],
    },
  ],
};

import type { LessonContent } from "@/types/lesson";

export const sortingLesson: LessonContent = {
  slug: "sorting",
  topicKey: "Sorting",
  title: "Sorting Algorithms, Stability & Asymptotic Lower Bounds",
  introduction:
    "Sorting algorithms arrange elements of a collection into a defined numerical or lexicographical order. Information theory proves comparison-based sorting has a mathematical lower bound of Ω(N log N).",
  analogy:
    "Think of sorting playing cards in your hand. Bubble Sort continuously swaps adjacent out-of-order cards until sorted. Insertion Sort picks cards one by one and inserts them into their correct position. Merge Sort splits the deck in half, sorts both halves separately, and zips them back together.",
  timeComplexity: [
    { operation: "Bubble / Selection / Insertion Sort", complexity: "O(N²) Quadratic" },
    { operation: "Merge Sort (Guaranteed All Cases)", complexity: "O(N log N) Linearithmic" },
    { operation: "Quick Sort (Average Case)", complexity: "O(N log N) Linearithmic" },
    { operation: "Quick Sort (Worst Case - Bad Pivot)", complexity: "O(N²) Quadratic" },
    { operation: "Heap Sort (In-Place Guaranteed)", complexity: "O(N log N) Linearithmic" },
    { operation: "Counting / Radix Sort (Non-Comparison)", complexity: "O(N + K) Linear" },
  ],
  spaceComplexity: "O(1) for in-place sorts (Quick, Heap, Selection, Insertion); O(N) auxiliary space buffer for Merge Sort.",
  applications: [
    "Preprocessing data to enable logarithmic O(log N) binary search lookups",
    "Database `ORDER BY` queries, e-commerce product price filtering, and pagination",
    "Graphics rendering engines (Z-buffer depth sorting of transparent polygons)",
    "Kth Largest element algorithms (QuickSelect O(N) average time)",
  ],
  advantages: [
    "Guaranteed O(N log N) algorithms scale to millions of records in production",
    "Stable sorting algorithms preserve the original relative ordering of equal key elements",
    "Adaptive algorithms (Insertion Sort) run in O(N) linear time on nearly-sorted data",
  ],
  disadvantages: [
    "O(N²) quadratic algorithms become unusable when input size N > 10,000",
    "Merge Sort requires O(N) auxiliary memory buffer allocation",
  ],
  interviewQuestions: [
    {
      question: "Why is Quick Sort O(N log N) on average but O(N²) in the worst case?",
      answer:
        "Balanced pivot selection splits the array into two equal halves, creating log2(N) recursion tree levels with O(N) partitioning work per level (O(N log N)). Bad pivot selection (always picking smallest/largest item) creates N recursive levels of O(N) work (O(N²)). Randomized pivot picking prevents worst-case scenarios.",
    },
    {
      question: "What is a 'Stable' sorting algorithm and why is stability important?",
      answer:
        "A sorting algorithm is stable if items with equal keys maintain their original relative input order. Stability is essential when performing multi-criteria sorting (e.g. first sorting transactions by Timestamp, then stably sorting by Customer ID). Merge Sort and Insertion Sort are stable; Quick Sort and Heap Sort are unstable.",
    },
    {
      question: "How does Non-Comparison Counting Sort beat the Ω(N log N) lower bound?",
      answer:
        "Counting Sort avoids pair-wise key comparisons (`a < b`). Instead, it uses integer values as direct array indices to count frequency occurrences in an auxiliary array, operating in O(N + K) linear time (where K is the range of values).",
    },
    {
      question: "What is TimSort and why is it used as default in Python and Java?",
      answer:
        "TimSort is a hybrid stable algorithm combining Merge Sort and Insertion Sort. It identifies pre-existing ascending/descending runs in real data and uses Insertion Sort on small chunks (size 32/64), achieving O(N) best case on partially sorted data and O(N log N) worst case.",
    },
  ],
  visualizerRoute: "/sorting",
  visualizerLabel: "Launch Interactive Sorting Visualizer",

  commonMistakes: [
    "Using Bubble Sort or Selection Sort on large production datasets (O(N²) performance bottleneck)",
    "Choosing a naive fixed pivot (e.g. `arr[0]`) in Quick Sort, triggering O(N²) degradation on pre-sorted arrays",
    "Forgetting that Merge Sort requires O(N) auxiliary memory array allocation",
    "Assuming language built-in `.sort()` is always stable across all JavaScript engines",
  ],

  projectIdeas: [
    "Sorting Algorithm Visualizer Engine: Build an interactive canvas animator rendering real-time bar height swaps for Quick, Merge, Heap, and Insertion Sort",
    "High-Throughput Log Sorter: Create a Node.js stream processor sorting 1GB log files using External Merge Sort chunking",
    "Multi-Column Table Sorter: Implement a React data table component supporting stable multi-column sorting (e.g. Name, then Age)",
    "Radix Sort Numerical Indexer: Build an integer sorting engine comparing Radix Sort vs Quick Sort benchmarks across 10 million items",
  ],

  youtubeVideos: [
    {
      id: "sort-yt-1",
      title: "Sorting Algorithms Comparison Visualized",
      channel: "Fireship",
      duration: "12 mins",
      url: "https://youtube.com/results?search_query=Sorting+Algorithms+Visualized+Quick+Merge+Heap+Sort",
      description: "Fast-paced visual comparison of sorting algorithms, time complexities, and stability.",
    },
    {
      id: "sort-yt-2",
      title: "Quick Sort vs Merge Sort Deep Dive",
      channel: "CS Masterclass",
      duration: "20 mins",
      url: "https://youtube.com/results?search_query=QuickSort+vs+MergeSort+Implementation+Tutorial",
      description: "In-depth code walkthrough of Quick Sort partitioning and Merge Sort divide-and-conquer.",
    },
  ],

  detailedNotesHtml: `
    <div style="font-family: system-ui, sans-serif; line-height: 1.7; color: #CBD5E1;">
      <h2 style="color: #8B5CF6; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">1. Comparison vs Non-Comparison Complexity Matrix</h2>
      <p>Performance profiles across all major sorting algorithms:</p>

      <!-- Visual Diagram 1: Complexity Comparison Matrix Table -->
      <div style="background: #0B1120; border: 1px solid #7C3AED; border-radius: 12px; padding: 16px; margin: 20px 0; overflow-x: auto;">
        <div style="color: #34D399; font-weight: bold; font-family: monospace; margin-bottom: 12px; text-align: center;">FIGURE 1: Sorting Algorithm Performance Matrix</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; font-family: monospace; text-align: left;">
          <thead>
            <tr style="background: #1E293B; color: #38BDF8;">
              <th style="padding: 8px; border: 1px solid #334155;">Algorithm</th>
              <th style="padding: 8px; border: 1px solid #334155;">Best</th>
              <th style="padding: 8px; border: 1px solid #334155;">Average</th>
              <th style="padding: 8px; border: 1px solid #334155;">Worst</th>
              <th style="padding: 8px; border: 1px solid #334155;">Space</th>
              <th style="padding: 8px; border: 1px solid #334155;">Stable?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 8px; border: 1px solid #334155; font-weight: bold; color: #FFF;">Insertion Sort</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #34D399;">O(N)</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #F43F5E;">O(N²)</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #F43F5E;">O(N²)</td>
              <td style="padding: 8px; border: 1px solid #334155;">O(1)</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #34D399;">Yes</td>
            </tr>
            <tr style="background: rgba(255,255,255,0.02);">
              <td style="padding: 8px; border: 1px solid #334155; font-weight: bold; color: #FFF;">Merge Sort</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #38BDF8;">O(N log N)</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #38BDF8;">O(N log N)</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #38BDF8;">O(N log N)</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #F59E0B;">O(N)</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #34D399;">Yes</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #334155; font-weight: bold; color: #FFF;">Quick Sort</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #38BDF8;">O(N log N)</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #38BDF8;">O(N log N)</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #F43F5E;">O(N²)</td>
              <td style="padding: 8px; border: 1px solid #334155;">O(log N)</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #F43F5E;">No</td>
            </tr>
            <tr style="background: rgba(255,255,255,0.02);">
              <td style="padding: 8px; border: 1px solid #334155; font-weight: bold; color: #FFF;">Heap Sort</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #38BDF8;">O(N log N)</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #38BDF8;">O(N log N)</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #38BDF8;">O(N log N)</td>
              <td style="padding: 8px; border: 1px solid #334155;">O(1)</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #F43F5E;">No</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #334155; font-weight: bold; color: #FFF;">Counting Sort</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #34D399;">O(N + K)</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #34D399;">O(N + K)</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #34D399;">O(N + K)</td>
              <td style="padding: 8px; border: 1px solid #334155;">O(K)</td>
              <td style="padding: 8px; border: 1px solid #334155; color: #34D399;">Yes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 style="color: #06B6D4; margin-top: 24px;">2. Quick Sort Partitioning Step-by-Step Code Walkthrough</h2>
      <p>Lomuto Partitioning rearranges array elements relative to a chosen pivot element:</p>

      <pre style="background: #050816; border: 1px solid #1E293B; border-radius: 8px; padding: 14px; color: #34D399; font-family: monospace; font-size: 13px;">
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    let pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);  // Recurse left partition
    quickSort(arr, pivotIndex + 1, high); // Recurse right partition
  }
  return arr;
}

function partition(arr, low, high) {
  let pivot = arr[high]; // Choose rightmost item as pivot
  let i = low - 1;       // Index of smaller element
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap smaller item
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; // Place pivot in correct position
  return i + 1;
}
      </pre>

      <h3 style="color: #F59E0B;">Step-by-Step Execution Trace for `[10, 80, 30, 90, 40, 50, 70]` (Pivot = 70):</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px;">
        <thead>
          <tr style="background: #1E293B; color: #38BDF8;">
            <th style="padding: 8px; border: 1px solid #334155;">Step</th>
            <th style="padding: 8px; border: 1px solid #334155;">`j` Item vs Pivot 70</th>
            <th style="padding: 8px; border: 1px solid #334155;">Action Taken</th>
            <th style="padding: 8px; border: 1px solid #334155;">Array Partition State</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">j = 0</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>10 < 70</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">i=0, Swap <code>arr[0]</code> with <code>arr[0]</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[10, 80, 30, 90, 40, 50, 70]</code></td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">j = 2</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>30 < 70</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">i=1, Swap <code>arr[1] (80)</code> with <code>arr[2] (30)</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[10, 30, 80, 90, 40, 50, 70]</code></td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">j = 4</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>40 < 70</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">i=2, Swap <code>arr[2] (80)</code> with <code>arr[4] (40)</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[10, 30, 40, 90, 80, 50, 70]</code></td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">Final</td>
            <td style="padding: 8px; border: 1px solid #334155;">Loop ends</td>
            <td style="padding: 8px; border: 1px solid #334155;">Swap pivot 70 into index <code>i+1 (4)</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[10, 30, 40, 50, 70, 90, 80]</code> (Pivot Settled!)</td>
          </tr>
        </tbody>
      </table>

      <!-- Visual Diagram 2: Merge Sort Divide and Conquer Tree -->
      <div style="background: #0B1120; border: 1px solid #06B6D4; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #22D3EE; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 2: Merge Sort Divide & Conquer Tree (log N levels)</div>
        <svg viewBox="0 0 500 140" style="width: 100%; max-width: 460px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <rect x="180" y="15" width="140" height="25" rx="4" fill="#1E1B4B" stroke="#06B6D4"/> <text x="250" y="32" fill="#FFF">[38, 27, 43, 3, 9, 82]</text>

            <line x1="210" y1="40" x2="140" y2="60" stroke="#06B6D4" stroke-width="2"/>
            <line x1="290" y1="40" x2="360" y2="60" stroke="#06B6D4" stroke-width="2"/>

            <rect x="80" y="60" width="110" height="25" rx="4" fill="#1E1B4B"/> <text x="135" y="77" fill="#FFF">[38, 27, 43]</text>
            <rect x="305" y="60" width="110" height="25" rx="4" fill="#1E1B4B"/> <text x="360" y="77" fill="#FFF">[3, 9, 82]</text>

            <line x1="135" y1="85" x2="135" y2="105" stroke="#34D399" stroke-width="2"/>
            <line x1="360" y1="85" x2="360" y2="105" stroke="#34D399" stroke-width="2"/>

            <rect x="80" y="105" width="110" height="25" rx="4" fill="#065F46" stroke="#34D399"/> <text x="135" y="122" fill="#FFF">[27, 38, 43]</text>
            <rect x="305" y="105" width="110" height="25" rx="4" fill="#065F46" stroke="#34D399"/> <text x="360" y="122" fill="#FFF">[3, 9, 82]</text>
          </g>
        </svg>
      </div>

      <!-- Visual Diagram 3: Counting Sort Frequency Buckets -->
      <div style="background: #0B1120; border: 1px solid #F59E0B; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #FBBF24; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 3: Counting Sort Non-Comparison Linear Bucket Mapping</div>
        <svg viewBox="0 0 500 130" style="width: 100%; max-width: 460px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <text x="70" y="30" fill="#94A3B8">Input Values:</text>
            <rect x="140" y="15" width="300" height="25" rx="4" fill="#1E293B"/> <text x="290" y="32" fill="#FFF">[4, 2, 2, 8, 3, 3, 1]</text>

            <text x="70" y="80" fill="#F59E0B">Frequency Count Array:</text>
            <rect x="140" y="65" width="300" height="35" rx="4" fill="#451A03" stroke="#F59E0B"/>
            <text x="290" y="87" fill="#FBBF24">Idx: 0  1  2  3  4 ... 8</text>
            <text x="290" y="97" fill="#FFF">Cnt: 0  1  2  2  1 ... 1</text>

            <text x="250" y="120" fill="#34D399" font-weight="bold">No comparisons needed! O(N + K) Time</text>
          </g>
        </svg>
      </div>
    </div>
  `,

  quiz: [
    {
      id: "srt-q1",
      question: "What is the lower bound runtime complexity for any comparison-based sorting algorithm?",
      options: ["Ω(N log N)", "Ω(N)", "Ω(1)", "Ω(N²)"],
      correctIndex: 0,
      explanation: "Information theory decision trees prove comparison-based sorts require at least Ω(N log N) comparisons.",
    },
    {
      id: "srt-q2",
      question: "Which sorting algorithm maintains guaranteed O(N log N) time complexity across ALL cases (Best, Average, Worst)?",
      options: ["Merge Sort", "Quick Sort", "Bubble Sort", "Insertion Sort"],
      correctIndex: 0,
      explanation: "Merge Sort splits and merges arrays recursively, guaranteeing O(N log N) performance regardless of initial order.",
    },
    {
      id: "srt-q3",
      question: "Why can Quick Sort degrade to O(N²) worst-case time complexity?",
      options: ["When poor pivot choices (min or max) create highly unbalanced partitions", "When array contains floating point numbers", "When memory is full", "When recursion depth reaches 5"],
      correctIndex: 0,
      explanation: "Unbalanced pivots produce N recursion levels of O(N) partitioning work = O(N²).",
    },
    {
      id: "srt-q4",
      question: "What is the space complexity of Merge Sort?",
      options: ["O(N) auxiliary space buffer", "O(1) in-place", "O(log N)", "O(N²)"],
      correctIndex: 0,
      explanation: "Merge Sort allocates a temporary auxiliary array buffer of size N to merge sorted halves.",
    },
    {
      id: "srt-q5",
      question: "Which sorting algorithm is adaptive and executes in O(N) time on nearly-sorted arrays?",
      options: ["Insertion Sort", "Selection Sort", "Quick Sort", "Heap Sort"],
      correctIndex: 0,
      explanation: "Insertion Sort skips inner comparisons when elements are already in sorted order, yielding O(N) time.",
    },
    {
      id: "srt-q6",
      question: "What defines a STABLE sorting algorithm?",
      options: ["Preserves relative order of elements with equal keys", "Never crashes on null inputs", "Runs in O(1) space", "Uses parallel CPU threads"],
      correctIndex: 0,
      explanation: "Stability ensures identical keys maintain their original relative position after sorting.",
    },
    {
      id: "srt-q7",
      question: "How does Counting Sort bypass the Ω(N log N) comparison lower bound?",
      options: ["Uses array element values directly as frequency array indices without key comparisons", "Uses GPU threads", "Uses binary search trees", "Sorts items in reverse"],
      correctIndex: 0,
      explanation: "Counting sort indexes values into a frequency bucket array, operating in O(N + K) non-comparison time.",
    },
    {
      id: "srt-q8",
      question: "What is Heap Sort's primary advantage over Merge Sort?",
      options: ["Heap Sort operates in-place with O(1) auxiliary space", "Heap Sort is stable", "Heap Sort runs in O(N) time", "Heap Sort avoids comparisons"],
      correctIndex: 0,
      explanation: "Heap Sort sorts within the existing array using a Max Binary Heap, consuming O(1) auxiliary space.",
    },
    {
      id: "srt-q9",
      question: "Which algorithm forms the basis of QuickSelect (finding Kth smallest item in O(N) average time)?",
      options: ["Quick Sort partitioning", "Merge Sort recursion", "Bubble Sort swaps", "Binary Search"],
      correctIndex: 0,
      explanation: "QuickSelect partitions the array like Quick Sort but recurses into only the single sub-array containing target K.",
    },
    {
      id: "srt-q10",
      question: "What hybrid sorting algorithm is used as default in Python (`list.sort()`) and Java (`Arrays.sort()`)?",
      options: ["TimSort (Hybrid Merge/Insertion Sort)", "Quick Sort", "Heap Sort", "Bubble Sort"],
      correctIndex: 0,
      explanation: "TimSort leverages natural ordered runs with Insertion and Merge Sort for optimal real-world performance.",
    },
  ],

  practiceProblems: [
    {
      id: "srt-p1",
      title: "1. Merge Sorted Array (In-Place)",
      difficulty: "Easy",
      description: "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`. Merge `nums2` into `nums1` as one sorted array.",
      hints: ["Use 3 pointers starting from the back: p1 = m-1, p2 = n-1, p = m+n-1. Place largest element at p."],
      starterCode: `function merge(nums1, m, nums2, n) {
  let p1 = m - 1, p2 = n - 1, p = m + n - 1;
  while (p1 >= 0 && p2 >= 0) {
    if (nums1[p1] > nums2[p2]) {
      nums1[p] = nums1[p1];
      p1--;
    } else {
      nums1[p] = nums2[p2];
      p2--;
    }
    p--;
  }
  while (p2 >= 0) {
    nums1[p] = nums2[p2];
    p2--;
    p--;
  }
  return nums1;
}`,
      solutionExplanation: "Backwards 3-pointer merge executes in O(M + N) time and O(1) auxiliary space.",
      testCases: [
        { input: [[1,2,3,0,0,0], 3, [2,5,6], 3], expected: [1,2,2,3,5,6] },
      ],
    },
    {
      id: "srt-p2",
      title: "2. Kth Largest Element in an Array (QuickSelect)",
      difficulty: "Medium",
      description: "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array using QuickSelect.",
      hints: ["Partition array using QuickSort pivot. If pivot index === target, return value. Recurse left or right half."],
      starterCode: `function findKthLargest(nums, k) {
  let target = nums.length - k;
  function quickSelect(low, high) {
    let pivot = nums[high], i = low;
    for (let j = low; j < high; j++) {
      if (nums[j] <= pivot) {
        [nums[i], nums[j]] = [nums[j], nums[i]];
        i++;
      }
    }
    [nums[i], nums[high]] = [nums[high], nums[i]];
    if (i === target) return nums[i];
    if (i < target) return quickSelect(i + 1, high);
    return quickSelect(low, i - 1);
  }
  return quickSelect(0, nums.length - 1);
}`,
      solutionExplanation: "QuickSelect delivers O(N) average time complexity.",
      testCases: [
        { input: [[3,2,1,5,6,4], 2], expected: 5 },
      ],
    },
  ],
};

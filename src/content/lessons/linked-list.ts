import type { LessonContent } from "@/types/lesson";

export const linkedListLesson: LessonContent = {
  slug: "linked-list",
  topicKey: "Linked Lists",
  title: "Linked Lists & Dynamic Pointer Architecture",
  introduction:
    "A linked list is a foundational linear data structure where elements (nodes) are allocated dynamically in memory and linked together sequentially using pointer references rather than contiguous RAM blocks.",
  analogy:
    "Think of a linked list like a scavenger hunt. Each location has a clues box containing a message (Data Payload) and a map with coordinates pointing to the next location (Next Pointer Address). To reach location #5, you must visit location #1, #2, #3, and #4 in order.",
  timeComplexity: [
    { operation: "Access by Index", complexity: "O(N) Linear (Traversals)" },
    { operation: "Search Value", complexity: "O(N) Linear" },
    { operation: "Insert / Delete at Head", complexity: "O(1) Constant" },
    { operation: "Insert / Delete at Tail (with tail ptr)", complexity: "O(1) Constant" },
    { operation: "Insert / Delete at Middle (with node ptr)", complexity: "O(1) Constant" },
  ],
  spaceComplexity: "O(N) — allocated heap memory per node plus 8-byte pointer overhead on 64-bit platforms.",
  applications: [
    "Underlying foundation for LRU Caches, Stacks, Queues, and Graph Adjacency Lists",
    "Undo / Redo event history buffers in text editors and graphic manipulation suites",
    "Browser Forward / Back history navigation (Doubly Linked List)",
    "Operating system kernel memory free-lists (malloc / page allocation)",
  ],
  advantages: [
    "Dynamic memory capacity with zero pre-allocation or array copying overhead during growth",
    "Constant O(1) time insertions and deletions at any position once node pointer is obtained",
    "Efficient memory allocation in fragmented heap spaces where contiguous blocks are unavailable",
  ],
  disadvantages: [
    "No O(1) direct random indexing — accessing item i requires traversal from head",
    "Pointer memory overhead per node (8 bytes per pointer on 64-bit systems)",
    "Poor CPU L1/L2 cache line locality due to heap memory node fragmentation",
  ],
  interviewQuestions: [
    {
      question: "How does Floyd's Cycle Detection (Tortoise and Hare) algorithm detect loops in a linked list?",
      answer:
        "Initialize two pointers: slow moving 1 node per step, and fast moving 2 nodes per step. If a loop exists, the fast pointer will eventually enter the loop, decrease distance by 1 node per iteration relative to slow, and meet slow pointer. Time O(N), Space O(1).",
    },
    {
      question: "How do you reverse a singly linked list in-place in O(N) time and O(1) space?",
      answer:
        "Maintain three pointers: `prev = null`, `curr = head`, and `next = null`. Loop while `curr !== null`: store `next = curr.next`, redirect `curr.next = prev`, shift `prev = curr`, and advance `curr = next`. Return `prev` as new head.",
    },
    {
      question: "What is the advantage of a Dummy (Sentinel) Node in linked list algorithms?",
      answer:
        "A dummy head node simplifies edge cases when inserting or deleting at the list head by providing a guaranteed non-null `prev` node. This removes special conditional branches for `head === null` or operations modifying `head`.",
    },
    {
      question: "How do you find the Kth node from the end of a linked list in a single pass?",
      answer:
        "Use two pointers: advance the `fast` pointer K steps ahead. Then move both `fast` and `slow` pointers 1 step at a time until `fast` reaches `null`. `slow` will now point exactly to the Kth node from the end.",
    },
  ],
  visualizerRoute: "/visualizer",
  visualizerLabel: "Launch Interactive Linked List Visualizer",

  commonMistakes: [
    "Losing node reference addresses when reassigning `curr.next` before caching `next` in a temporary variable",
    "Dereferencing null pointers (e.g. `curr.next.next` when `curr.next` is null)",
    "Forgetting to update the `tail` pointer when deleting the last node of a list",
    "Creating infinite loops by creating unintended cycle pointers during node insertion",
  ],

  projectIdeas: [
    "LRU Cache System: Build a high-speed key-value cache combining a Hash Map with a Doubly Linked List for O(1) access and eviction",
    "Music Playlist Engine: Create a playback manager supporting previous/next track traversal using a Circular Doubly Linked List",
    "Text Editor Undo/Redo Engine: Implement an action history stack backed by linked list nodes holding document diff states",
    "Custom Heap Memory Allocator: Build a C++ or JS memory manager using a free-list of linked nodes to track allocated vs free RAM blocks",
  ],

  youtubeVideos: [
    {
      id: "ll-yt-1",
      title: "Linked Lists Memory Pointers Visualized",
      channel: "CS Data Structures",
      duration: "16 mins",
      url: "https://youtube.com/results?search_query=Linked+List+Data+Structure+Pointer+Memory+Tutorial",
      description: "Visual breakdown of heap node memory allocation and next/prev pointer mechanics.",
    },
    {
      id: "ll-yt-2",
      title: "Linked List Interview Masterclass",
      channel: "Tech Interview Pro",
      duration: "25 mins",
      url: "https://youtube.com/results?search_query=Linked+List+Interview+Questions+Reverse+Cycle+Detection",
      description: "Step-by-step problem walkthroughs for cycle detection, reversal, and merge operations.",
    },
  ],

  detailedNotesHtml: `
    <div style="font-family: system-ui, sans-serif; line-height: 1.7; color: #CBD5E1;">
      <h2 style="color: #8B5CF6; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">1. Singly vs Doubly Linked Memory Architecture</h2>
      <p>Nodes are allocated on the Heap. Each node stores data plus reference memory addresses pointing to neighbors:</p>

      <!-- Visual Diagram 1: Node Memory Structure -->
      <div style="background: #0B1120; border: 1px solid #7C3AED; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #34D399; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 1: Singly Linked List Pointer Memory Layout</div>
        <svg viewBox="0 0 580 160" style="width: 100%; max-width: 550px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <!-- Node 1 -->
            <rect x="20" y="30" width="130" height="65" rx="6" fill="#1E1B4B" stroke="#8B5CF6" stroke-width="2"/>
            <text x="85" y="52" fill="#FFF" font-size="13" font-weight="bold">Data: 10</text>
            <text x="85" y="72" fill="#A78BFA">Next: 0x4080</text>
            <text x="85" y="115" fill="#38BDF8">Addr: 0x1020 [HEAD]</text>

            <!-- Arrow 1 -->
            <path d="M 150 62 L 205 62" stroke="#06B6D4" stroke-width="3" marker-end="url(#arrow)"/>

            <!-- Node 2 -->
            <rect x="210" y="30" width="130" height="65" rx="6" fill="#1E1B4B" stroke="#8B5CF6" stroke-width="2"/>
            <text x="275" y="52" fill="#FFF" font-size="13" font-weight="bold">Data: 20</text>
            <text x="275" y="72" fill="#A78BFA">Next: 0x8900</text>
            <text x="275" y="115" fill="#38BDF8">Addr: 0x4080</text>

            <!-- Arrow 2 -->
            <path d="M 340 62 L 395 62" stroke="#06B6D4" stroke-width="3" marker-end="url(#arrow)"/>

            <!-- Node 3 -->
            <rect x="400" y="30" width="130" height="65" rx="6" fill="#1E1B4B" stroke="#8B5CF6" stroke-width="2"/>
            <text x="465" y="52" fill="#FFF" font-size="13" font-weight="bold">Data: 30</text>
            <text x="465" y="72" fill="#F43F5E" font-weight="bold">Next: NULL</text>
            <text x="465" y="115" fill="#38BDF8">Addr: 0x8900 [TAIL]</text>
          </g>
        </svg>
      </div>

      <h2 style="color: #06B6D4; margin-top: 24px;">2. In-Place List Reversal Step-by-Step Code Walkthrough</h2>
      <p>Observe pointer modifications during in-place reversal:</p>

      <pre style="background: #050816; border: 1px solid #1E293B; border-radius: 8px; padding: 14px; color: #34D399; font-family: monospace; font-size: 13px;">
function reverseLinkedList(head) {
  let prev = null;
  let curr = head;
  
  while (curr !== null) {
    let nextTemp = curr.next; // 1. Save next reference
    curr.next = prev;         // 2. Reverse current node pointer
    prev = curr;              // 3. Move prev forward
    curr = nextTemp;          // 4. Move curr forward
  }
  return prev; // New head of reversed list
}
      </pre>

      <h3 style="color: #F59E0B;">Step-by-Step State Trace for `10 -> 20 -> 30 -> NULL`:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px;">
        <thead>
          <tr style="background: #1E293B; color: #38BDF8;">
            <th style="padding: 8px; border: 1px solid #334155;">Step</th>
            <th style="padding: 8px; border: 1px solid #334155;">Pointer Pointers</th>
            <th style="padding: 8px; border: 1px solid #334155;">Pointer Reassignment</th>
            <th style="padding: 8px; border: 1px solid #334155;">Linked Structure Result</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">Iter 1</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>curr=10, prev=null</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>10.next = null</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>null <- 10    20 -> 30</code></td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">Iter 2</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>curr=20, prev=10</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>20.next = 10</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>null <- 10 <- 20    30</code></td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">Iter 3</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>curr=30, prev=20</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>30.next = 20</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>null <- 10 <- 20 <- 30</code></td>
          </tr>
        </tbody>
      </table>

      <!-- Visual Diagram 2: In-Place Pointer Redirection -->
      <div style="background: #0B1120; border: 1px solid #06B6D4; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #22D3EE; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 2: In-Place Pointer Redirection Mechanics</div>
        <svg viewBox="0 0 480 120" style="width: 100%; max-width: 450px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <rect x="20" y="40" width="70" height="40" rx="4" fill="#1E293B" stroke="#94A3B8"/> <text x="55" y="65" fill="#FFF">NULL</text>
            <path d="M 120 60 L 95 60" stroke="#F43F5E" stroke-width="3"/>

            <rect x="125" y="40" width="70" height="40" rx="4" fill="#312E81" stroke="#8B5CF6"/> <text x="160" y="65" fill="#FFF">10</text>
            <path d="M 225 60 L 200 60" stroke="#F43F5E" stroke-width="3"/>

            <rect x="230" y="40" width="70" height="40" rx="4" fill="#312E81" stroke="#8B5CF6"/> <text x="265" y="65" fill="#FFF">20</text>
            <path d="M 330 60 L 305 60" stroke="#F43F5E" stroke-width="3"/>

            <rect x="335" y="40" width="70" height="40" rx="4" fill="#065F46" stroke="#34D399"/> <text x="370" y="65" fill="#FFF">30 [HEAD]</text>
          </g>
        </svg>
      </div>

      <!-- Visual Diagram 3: Floyd's Cycle Detection -->
      <div style="background: #0B1120; border: 1px solid #F59E0B; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #FBBF24; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 3: Floyd's Cycle Detection (Slow & Fast Pointers Meeting)</div>
        <svg viewBox="0 0 500 150" style="width: 100%; max-width: 480px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <rect x="30" y="55" width="55" height="35" rx="4" fill="#1E293B"/> <text x="57" y="77" fill="#FFF">Node 1</text>
            <path d="M 85 72 L 125 72" stroke="#64748B" stroke-width="2"/>

            <rect x="130" y="55" width="55" height="35" rx="4" fill="#1E293B"/> <text x="157" y="77" fill="#FFF">Node 2</text>
            <path d="M 185 72 L 225 72" stroke="#64748B" stroke-width="2"/>

            <!-- Loop Circle -->
            <rect x="230" y="20" width="55" height="35" rx="4" fill="#451A03" stroke="#F59E0B"/> <text x="257" y="42" fill="#FBBF24">Node 3</text>
            <rect x="330" y="55" width="75" height="35" rx="4" fill="#831843" stroke="#F43F5E"/> <text x="367" y="77" fill="#FFF">MEET HERE!</text>
            <rect x="230" y="95" width="55" height="35" rx="4" fill="#451A03" stroke="#F59E0B"/> <text x="257" y="117" fill="#FBBF24">Node 4</text>

            <!-- Loop Arrows -->
            <path d="M 285 37 L 330 65" stroke="#F59E0B" stroke-width="2"/>
            <path d="M 345 92 L 285 110" stroke="#F59E0B" stroke-width="2"/>
            <path d="M 230 110 L 200 80" stroke="#F59E0B" stroke-width="2"/>
            <path d="M 200 70 L 230 37" stroke="#F59E0B" stroke-width="2"/>

            <text x="367" y="115" fill="#F43F5E" font-weight="bold">Slow & Fast Meet!</text>
          </g>
        </svg>
      </div>
    </div>
  `,

  quiz: [
    {
      id: "ll-q1",
      question: "What is the time complexity to insert a node at the head of a singly linked list?",
      options: ["O(1)", "O(log N)", "O(N)", "O(N²)"],
      correctIndex: 0,
      explanation: "Redirecting head pointer to the new node runs in constant O(1) time.",
    },
    {
      id: "ll-q2",
      question: "What is the primary drawback of linked lists compared to arrays?",
      options: [
        "No O(1) direct random indexing",
        "Cannot store numbers",
        "Fixed maximum size",
        "Cannot be reversed",
      ],
      correctIndex: 0,
      explanation: "Accessing index i requires traversing node-by-node from head in O(N) time.",
    },
    {
      id: "ll-q3",
      question: "Floyd's Cycle Detection algorithm uses how many pointers?",
      options: ["2 pointers (Slow moving 1 step, Fast moving 2 steps)", "1 pointer", "3 pointers", "N pointers"],
      correctIndex: 0,
      explanation: "Floyd's algorithm uses slow and fast pointers to catch loops in O(N) time and O(1) space.",
    },
    {
      id: "ll-q4",
      question: "In a Doubly Linked List, each node contains:",
      options: [
        "Data, Next Pointer, and Prev Pointer",
        "Data and Next Pointer only",
        "Data and Key Index",
        "Two data values",
      ],
      correctIndex: 0,
      explanation: "Doubly linked list nodes maintain references to both next and previous nodes.",
    },
    {
      id: "ll-q5",
      question: "What is the time complexity to find the middle element of a list using slow and fast pointers?",
      options: ["O(N)", "O(N²)", "O(1)", "O(log N)"],
      correctIndex: 0,
      explanation: "Fast pointer reaches the end in N/2 steps, giving single pass O(N) time.",
    },
    {
      id: "ll-q6",
      question: "Which data structure combines Hash Maps with Doubly Linked Lists for O(1) cache access & eviction?",
      options: ["LRU Cache", "Binary Search Tree", "Min Heap", "Stack"],
      correctIndex: 0,
      explanation: "LRU Caches use Doubly Linked Lists to re-order item access recency in O(1) time.",
    },
    {
      id: "ll-q7",
      question: "Inserting a new node after a given node pointer in a singly linked list takes:",
      options: ["O(1)", "O(N)", "O(log N)", "O(N²)"],
      correctIndex: 0,
      explanation: "Re-linking two pointer addresses given the target node takes O(1) constant operations.",
    },
    {
      id: "ll-q8",
      question: "Why do linked lists exhibit poorer CPU cache performance than contiguous arrays?",
      options: ["Node heap memory is non-contiguous, causing frequent CPU L1/L2 cache misses", "Nodes are encrypted", "Pointers require GPU access", "Node size exceeds cache line capacity"],
      correctIndex: 0,
      explanation: "Random heap allocation prevents hardware CPU prefetchers from preloading adjacent nodes.",
    },
    {
      id: "ll-q9",
      question: "What is the role of a Dummy (Sentinel) Head Node in linked list algorithms?",
      options: ["Stores the total node count", "Eliminates special edge cases when modifying or removing the real head node", "Reverses the list automatically", "Encrypts node payloads"],
      correctIndex: 1,
      explanation: "A dummy head node provides a guaranteed non-null predecessor node, simplifying pointer edge cases.",
    },
    {
      id: "ll-q10",
      question: "What is the auxiliary space complexity of reversing a linked list iteratively in-place?",
      options: ["O(N)", "O(log N)", "O(1)", "O(N²)"],
      correctIndex: 2,
      explanation: "Iterative reversal modifies pointer references using 3 temporary variables, requiring O(1) space.",
    },
  ],

  practiceProblems: [
    {
      id: "ll-p1",
      title: "1. Reverse Linked List",
      difficulty: "Easy",
      description: "Given the head of a singly linked list, reverse the list in-place and return the new head node.",
      hints: ["Maintain prev=null, curr=head. In loop: next = curr.next; curr.next = prev; prev = curr; curr = next."],
      starterCode: `function reverseList(head) {
  let prev = null, curr = head;
  while (curr !== null) {
    let nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
      solutionExplanation: "Iterative reversal achieves O(N) time and O(1) auxiliary space.",
      testCases: [
        { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
        { input: [[1, 2]], expected: [2, 1] },
      ],
    },
    {
      id: "ll-p2",
      title: "2. Linked List Cycle Detection (Floyd's)",
      difficulty: "Easy",
      description: "Given head of a linked list, determine if the linked list has a cycle in it using O(1) memory.",
      hints: ["Initialize slow = head, fast = head. Advance slow by 1 step, fast by 2 steps. If slow === fast, return true."],
      starterCode: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
      solutionExplanation: "Floyd's algorithm detects cycles in O(N) time and O(1) space.",
      testCases: [
        { input: [[3, 2, 0, -4]], expected: true },
        { input: [[1, 2]], expected: false },
      ],
    },
  ],
};

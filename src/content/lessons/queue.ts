import type { LessonContent } from "@/types/lesson";

export const queueLesson: LessonContent = {
  slug: "queue",
  topicKey: "Queues",
  title: "Queue Architecture, Circular Buffers & Priority Queues",
  introduction:
    "A Queue is a fundamental linear data structure operating under the First-In, First-Out (FIFO) access policy. Items enter at the Rear (Enqueue) and exit at the Front (Dequeue).",
  analogy:
    "Think of a line of customers waiting at a grocery store checkout register. The customer who joins the back of the line first is served and exits first. Cutting into the middle of the line is strictly prohibited.",
  timeComplexity: [
    { operation: "Enqueue (Insert at Rear)", complexity: "O(1) Constant" },
    { operation: "Dequeue (Remove from Front)", complexity: "O(1) Constant" },
    { operation: "Peek / Front (View Head)", complexity: "O(1) Constant" },
    { operation: "Search Element", complexity: "O(N) Linear" },
  ],
  spaceComplexity: "O(N) — allocated memory buffer for N queued items.",
  applications: [
    "Breadth-First Search (BFS) graph and tree level-order traversals",
    "Operating system CPU task scheduling queues and asynchronous I/O event loops",
    "Circular Ring Buffers for real-time video/audio streaming and print spoolers",
    "Priority Queues (Binary Heaps) for Dijkstra's Shortest Path & Prim's MST algorithms",
  ],
  advantages: [
    "Strict FIFO order guarantees fair sequential processing without starvation",
    "Constant O(1) time enqueue and dequeue operations when implemented with pointers or circular buffers",
    "Decouples producer and consumer task rates in distributed message brokers (Kafka/RabbitMQ)",
  ],
  disadvantages: [
    "No random index access — inspecting element i requires dequeuing all preceding items",
    "Naive array implementations suffer from O(N) element shifting on dequeue operations",
  ],
  interviewQuestions: [
    {
      question: "Why is a naive array implementation of a Queue inefficient for `dequeue()`?",
      answer:
        "Removing an element from index 0 of a standard array requires shifting all remaining N-1 elements to the left, taking O(N) linear time. Implementing a Queue using a Circular Array or Doubly Linked List preserves O(1) dequeues.",
    },
    {
      question: "How does a Circular Queue (Ring Buffer) prevent memory waste in fixed arrays?",
      answer:
        "A Circular Queue wraps the `head` and `tail` pointers back to index 0 using modular arithmetic `(index + 1) % capacity`. This reuses freed slot space at the beginning of the array without shifting elements.",
    },
    {
      question: "What is a Double-Ended Queue (Deque) and what algorithms use it?",
      answer:
        "A Deque permits insertion and removal at both Front and Rear in O(1) time. It is used in Sliding Window Maximum algorithms, Palindrome checking, and Work-Stealing task schedulers.",
    },
    {
      question: "What is a Priority Queue and how does it differ from a standard FIFO Queue?",
      answer:
        "In a Priority Queue, elements are served based on priority values rather than insertion arrival order. Min/Max Binary Heaps back Priority Queues, delivering O(log N) insertions and O(log N) highest-priority extractions.",
    },
  ],
  visualizerRoute: "/visualizer",
  visualizerLabel: "Launch Interactive Queue Visualizer",

  commonMistakes: [
    "Using JS Array `.shift()` for queue dequeues in production loops without realizing it is O(N)",
    "Forgetting to wrap pointers using `% capacity` in Circular Queue implementations",
    "Calling `dequeue()` on an empty queue without checking `isEmpty()`, causing underflow crashes",
    "Confusing BFS queue level-order traversal with DFS stack depth-first traversal",
  ],

  projectIdeas: [
    "Distributed Message Broker Simulator: Build an in-memory Pub/Sub message queue system (mini RabbitMQ) managing consumer task distribution",
    "Real-Time Video Audio Ring Buffer: Implement a web-based circular audio buffer managing smooth audio playback stream frames",
    "Task Scheduler & Rate Limiter: Build a token bucket rate limiter using a queue to manage incoming API request spikes",
    "Dijkstra Route Planner: Create an interactive map routing engine powered by a Priority Queue (Min Heap)",
  ],

  youtubeVideos: [
    {
      id: "q-yt-1",
      title: "Queue Data Structure & FIFO Mechanics",
      channel: "CS Academy",
      duration: "12 mins",
      url: "https://youtube.com/results?search_query=Queue+Data+Structure+FIFO+Circular+Buffer+Tutorial",
      description: "Visual explanation of FIFO queues, ring buffers, and dequeues.",
    },
    {
      id: "q-yt-2",
      title: "Priority Queue & Binary Heap Guide",
      channel: "Algorithms Unlocked",
      duration: "18 mins",
      url: "https://youtube.com/results?search_query=Priority+Queue+Binary+Heap+Tutorial+Dijkstra",
      description: "Comprehensive guide to Priority Queues and Heap implementation.",
    },
  ],

  detailedNotesHtml: `
    <div style="font-family: system-ui, sans-serif; line-height: 1.7; color: #CBD5E1;">
      <h2 style="color: #8B5CF6; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">1. FIFO Architecture & Operations</h2>
      <p>Items enter at the Rear pointer and exit from the Front pointer:</p>

      <!-- Visual Diagram 1: FIFO Queue Architecture -->
      <div style="background: #0B1120; border: 1px solid #7C3AED; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #34D399; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 1: Queue First-In, First-Out (FIFO) Architecture</div>
        <svg viewBox="0 0 550 160" style="width: 100%; max-width: 520px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <!-- Queue Container -->
            <rect x="130" y="45" width="280" height="55" rx="6" fill="#1E1B4B" stroke="#8B5CF6" stroke-width="2"/>

            <!-- Items -->
            <rect x="145" y="55" width="55" height="35" rx="4" fill="#065F46" stroke="#34D399"/> <text x="172" y="77" fill="#FFF" font-weight="bold">Item 1</text>
            <rect x="210" y="55" width="55" height="35" rx="4" fill="#312E81"/> <text x="237" y="77" fill="#CBD5E1">Item 2</text>
            <rect x="275" y="55" width="55" height="35" rx="4" fill="#312E81"/> <text x="302" y="77" fill="#CBD5E1">Item 3</text>
            <rect x="340" y="55" width="55" height="35" rx="4" fill="#312E81"/> <text x="367" y="77" fill="#CBD5E1">Item 4</text>

            <!-- Dequeue Arrow (Front) -->
            <path d="M 130 72 L 50 72" stroke="#F43F5E" stroke-width="3" marker-end="url(#arrow)"/>
            <text x="90" y="60" fill="#F87171" font-weight="bold">DEQUEUE() [FRONT]</text>

            <!-- Enqueue Arrow (Rear) -->
            <path d="M 490 72 L 415 72" stroke="#10B981" stroke-width="3" marker-end="url(#arrow)"/>
            <text x="450" y="60" fill="#34D399" font-weight="bold">ENQUEUE(X) [REAR]</text>
          </g>
        </svg>
      </div>

      <h2 style="color: #06B6D4; margin-top: 24px;">2. Breadth-First Search (BFS) Queue Walkthrough</h2>
      <p>Queue drives level-order graph and tree traversals:</p>

      <pre style="background: #050816; border: 1px solid #1E293B; border-radius: 8px; padding: 14px; color: #34D399; font-family: monospace; font-size: 13px;">
function bfsTreeTraversal(root) {
  if (!root) return [];
  let result = [];
  let queue = [root]; // Initialize queue with root
  
  while (queue.length > 0) {
    let currentNode = queue.shift(); // Dequeue front node
    result.push(currentNode.val);
    
    // Enqueue left and right children
    if (currentNode.left) queue.push(currentNode.left);
    if (currentNode.right) queue.push(currentNode.right);
  }
  return result;
}
      </pre>

      <h3 style="color: #F59E0B;">Step-by-Step State Trace for Binary Tree `[1 -> (2, 3)]`:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px;">
        <thead>
          <tr style="background: #1E293B; color: #38BDF8;">
            <th style="padding: 8px; border: 1px solid #334155;">Step</th>
            <th style="padding: 8px; border: 1px solid #334155;">Dequeued Node</th>
            <th style="padding: 8px; border: 1px solid #334155;">Enqueued Children</th>
            <th style="padding: 8px; border: 1px solid #334155;">Queue State (Front -> Rear)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">Start</td>
            <td style="padding: 8px; border: 1px solid #334155;">None</td>
            <td style="padding: 8px; border: 1px solid #334155;">Root Node <code>1</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[1]</code></td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">Iter 1</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>1</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">Left <code>2</code>, Right <code>3</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[2, 3]</code></td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">Iter 2</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>2</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">None</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[3]</code></td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">Iter 3</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>3</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">None</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[]</code> (Done!)</td>
          </tr>
        </tbody>
      </table>

      <!-- Visual Diagram 2: Circular Ring Buffer -->
      <div style="background: #0B1120; border: 1px solid #06B6D4; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #22D3EE; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 2: Circular Buffer (Ring Array `% Capacity` Wrapping)</div>
        <svg viewBox="0 0 480 150" style="width: 100%; max-width: 450px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <circle cx="240" cy="75" r="55" fill="none" stroke="#06B6D4" stroke-width="4"/>

            <rect x="220" y="8" width="40" height="25" rx="3" fill="#065F46" stroke="#34D399"/> <text x="240" y="24" fill="#FFF">Idx 0</text>
            <rect x="285" y="60" width="40" height="25" rx="3" fill="#1E1B4B" stroke="#8B5CF6"/> <text x="305" y="76" fill="#FFF">Idx 1</text>
            <rect x="220" y="115" width="40" height="25" rx="3" fill="#1E1B4B" stroke="#8B5CF6"/> <text x="240" y="131" fill="#FFF">Idx 2</text>
            <rect x="155" y="60" width="40" height="25" rx="3" fill="#451A03" stroke="#F59E0B"/> <text x="175" y="76" fill="#FFF">Idx 3</text>

            <text x="240" y="78" fill="#22D3EE" font-weight="bold">Wrap = (i+1)%4</text>
          </g>
        </svg>
      </div>

      <!-- Visual Diagram 3: Priority Queue Min Heap -->
      <div style="background: #0B1120; border: 1px solid #F59E0B; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #FBBF24; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 3: Priority Queue Min-Heap Tree Structure</div>
        <svg viewBox="0 0 450 140" style="width: 100%; max-width: 420px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <!-- Root -->
            <circle cx="225" cy="25" r="18" fill="#065F46" stroke="#34D399"/> <text x="225" y="30" fill="#FFF" font-weight="bold">4 (Min)</text>

            <!-- Level 1 -->
            <line x1="225" y1="43" x2="140" y2="70" stroke="#64748B" stroke-width="2"/>
            <line x1="225" y1="43" x2="310" y2="70" stroke="#64748B" stroke-width="2"/>
            <circle cx="140" cy="75" r="16" fill="#1E1B4B" stroke="#8B5CF6"/> <text x="140" y="80" fill="#FFF">10</text>
            <circle cx="310" cy="75" r="16" fill="#1E1B4B" stroke="#8B5CF6"/> <text x="310" y="80" fill="#FFF">15</text>

            <!-- Level 2 -->
            <line x1="140" y1="91" x2="90" y2="115" stroke="#64748B" stroke-width="2"/>
            <line x1="140" y1="91" x2="190" y2="115" stroke="#64748B" stroke-width="2"/>
            <circle cx="90" cy="120" r="14" fill="#312E81"/> <text x="90" y="124" fill="#FFF">20</text>
            <circle cx="190" cy="120" r="14" fill="#312E81"/> <text x="190" y="124" fill="#FFF">30</text>

            <text x="360" y="120" fill="#34D399" font-weight="bold">Extract Min = O(log N)</text>
          </g>
        </svg>
      </div>
    </div>
  `,

  quiz: [
    {
      id: "q-q1",
      question: "What is the primary access protocol governing a Queue?",
      options: ["FIFO (First-In, First-Out)", "LIFO (Last-In, First-Out)", "LILO", "Random Indexing"],
      correctIndex: 0,
      explanation: "Queues strictly operate under First-In, First-Out (FIFO) ordering.",
    },
    {
      id: "q-q2",
      question: "What is the time complexity of Enqueue and Dequeue operations in an optimized Queue?",
      options: ["O(1)", "O(log N)", "O(N)", "O(N²)"],
      correctIndex: 0,
      explanation: "Optimized pointer or circular buffer queues perform enqueue and dequeue in O(1) constant time.",
    },
    {
      id: "q-q3",
      question: "Why is `arr.shift()` inefficient for implementing queues in JavaScript?",
      options: ["Re-indexes remaining N-1 array elements in O(N) linear time", "Throws memory leak errors", "Deletes array capacity", "Exceeds stack limit"],
      correctIndex: 0,
      explanation: "Removing element 0 requires shifting all remaining elements to the left, taking O(N) time.",
    },
    {
      id: "q-q4",
      question: "How does a Circular Queue avoid array memory waste?",
      options: ["Uses modular arithmetic `(index + 1) % capacity` to wrap pointers", "Compresses data into zip files", "Doubles memory capacity on every enqueue", "Converts into a stack"],
      correctIndex: 0,
      explanation: "Modular arithmetic wraps indices around, reusing freed space at the start of the array.",
    },
    {
      id: "q-q5",
      question: "Which graph traversal algorithm fundamentally relies on a Queue?",
      options: ["Breadth-First Search (BFS)", "Depth-First Search (DFS)", "Preorder Traversal", "Inorder Traversal"],
      correctIndex: 0,
      explanation: "BFS explores nodes level-by-level using a FIFO Queue.",
    },
    {
      id: "q-q6",
      question: "What underlying data structure powers a Priority Queue?",
      options: ["Binary Heap (Min/Max Heap)", "Singly Linked List", "Stack", "Hash Table"],
      correctIndex: 0,
      explanation: "Binary Heaps allow Priority Queues to insert and extract highest-priority elements in O(log N) time.",
    },
    {
      id: "q-q7",
      question: "What is a Double-Ended Queue (Deque)?",
      options: ["A queue allowing insertion and deletion at both Front and Rear endpoints in O(1) time", "A queue with two heads", "A queue holding max 2 items", "A stack wrapper"],
      correctIndex: 0,
      explanation: "Deques permit O(1) push/pop at both front and rear ends.",
    },
    {
      id: "q-q8",
      question: "What is the time complexity of extracting the highest-priority element from a Min Binary Heap Priority Queue?",
      options: ["O(log N)", "O(1)", "O(N)", "O(N log N)"],
      correctIndex: 0,
      explanation: "Replacing root and bubbling down takes O(log N) time.",
    },
    {
      id: "q-q9",
      question: "What real-world OS component uses queues to process incoming user tasks?",
      options: ["CPU Task & I/O Event Loop Scheduler", "Video Card Display Driver", "RAM BIOS", "Compiler Lexer"],
      correctIndex: 0,
      explanation: "OS schedulers use FIFO queues to assign CPU time slices fairly to waiting processes.",
    },
    {
      id: "q-q10",
      question: "What is the auxiliary space complexity of BFS traversal on a tree with maximum width W?",
      options: ["O(W)", "O(1)", "O(N²)", "O(log W)"],
      correctIndex: 0,
      explanation: "At peak level width, the queue holds up to W nodes, taking O(W) auxiliary memory.",
    },
  ],

  practiceProblems: [
    {
      id: "q-p1",
      title: "1. Binary Tree Level Order Traversal (BFS)",
      difficulty: "Medium",
      description: "Given the root of a binary tree, return the level order traversal of its nodes' values using a Queue.",
      hints: ["Initialize queue = [root]. Loop while queue not empty: measure level size = queue.length, pop size elements."],
      starterCode: `function levelOrder(root) {
  if (!root) return [];
  let result = [];
  let queue = [root];
  while (queue.length > 0) {
    let levelSize = queue.length;
    let currentLevel = [];
    for (let i = 0; i < levelSize; i++) {
      let node = queue.shift();
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}`,
      solutionExplanation: "BFS level-order traversal visits every node once in O(N) time.",
      testCases: [
        { input: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] },
      ],
    },
  ],
};

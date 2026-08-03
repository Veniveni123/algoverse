import type { LessonContent } from "@/types/lesson";

export const programmingBasicsLesson: LessonContent = {
  slug: "programming-basics",
  topicKey: "Programming Basics",
  title: "Programming Foundations: Memory, Execution & Control Flow",
  introduction:
    "Master the fundamental mechanics of computer memory, variable allocation, stack vs heap, pointers/references, and call stack execution required to construct efficient algorithms.",
  analogy:
    "Think of computer memory like a giant hotel with billions of numbered rooms (addresses). Primitive data types store their value right inside the room key envelope (Stack), whereas complex objects store a location map to a penthouse suite located across town (Heap).",
  timeComplexity: [
    { operation: "Primitive Assignment", complexity: "O(1) Constant" },
    { operation: "Stack Frame Push/Pop", complexity: "O(1) Constant" },
    { operation: "Heap Allocation (malloc/new)", complexity: "O(1) Amortized" },
    { operation: "Deep Copy / Cloning", complexity: "O(N) Linear" },
  ],
  spaceComplexity: "Stack RAM space depends on max call recursion depth O(D); Heap space grows with dynamically allocated objects O(N).",
  applications: [
    "Preventing memory leaks and stack overflow crashes in production services",
    "Optimizing cache locality and spatial memory access patterns in high-throughput engines",
    "Understanding call-by-value vs call-by-reference side effects in complex algorithms",
    "Passing technical coding interview questions on memory management and recursion bounds",
  ],
  advantages: [
    "Establishes precise hardware-level understanding of program execution",
    "Empowers engineers to write memory-safe, crash-resistant code",
    "Lays essential foundation for all advanced Data Structures & Algorithms",
  ],
  disadvantages: [
    "Requires low-level mental model of RAM addresses, stack pointers, and heap allocations",
  ],
  interviewQuestions: [
    {
      question: "What is the primary difference between Stack memory and Heap memory?",
      answer:
        "Stack memory stores contiguous local variable stack frames managed automatically by the CPU via Last-In First-Out execution (fast, fixed size). Heap memory holds dynamically allocated objects/arrays accessible globally, managed manually or via Garbage Collection (flexible size, slower fragmentation).",
    },
    {
      question: "What happens when a function calls itself recursively without a base case?",
      answer:
        "Each recursive call pushes a new stack frame containing local variables and return address onto the call stack. Unbounded recursion fills the allocated Stack memory limit, throwing a StackOverflow Exception.",
    },
    {
      question: "Explain Pass-by-Value vs Pass-by-Reference in object parameter passing.",
      answer:
        "In pass-by-value, a copy of the primitive data is passed; modifications inside the function do not affect the caller. In pass-by-reference (or passing reference values), the memory reference address is copied, meaning mutations to object properties affect the underlying object in caller space.",
    },
    {
      question: "How does Garbage Collection (GC) identify unused memory on the Heap?",
      answer:
        "Garbage collectors use Mark-and-Sweep or reference counting starting from 'GC Roots' (stack references, global variables). Any object on the heap unreachable from active roots is marked and reclaimed.",
    },
  ],
  visualizerRoute: "",
  visualizerLabel: "Concept-Only Foundation",

  commonMistakes: [
    "Confusing reference reassignment with object property mutation",
    "Forgetting recursion base cases leading to StackOverflowError",
    "Assuming primitives and objects reside in the same memory region",
    "Creating silent memory leaks by maintaining unused references in static arrays",
  ],

  projectIdeas: [
    "Call-Stack Visualizer: Build a CLI or web tool that steps through nested function execution and renders active stack frames",
    "Custom Garbage Collector Simulation: Implement a C++ or JS Mark-and-Sweep memory allocator simulation",
    "RAM Usage Analyzer: Build a NodeJS module monitoring RSS vs Heap Total vs Heap Used during heavy data transformations",
    "Recursion-to-Iteration Converter: Build a tool converting recursive Fibonacci/Factorial trees into explicit Stack loops",
  ],

  youtubeVideos: [
    {
      id: "basics-yt-1",
      title: "Memory Stack vs Heap Explained",
      channel: "CS Essentials",
      duration: "12 mins",
      url: "https://youtube.com/results?search_query=Stack+vs+Heap+Memory+Programming+Basics+Tutorial",
      description: "Comprehensive visual guide to computer memory layout, stack frames, and heap allocation.",
    },
    {
      id: "basics-yt-2",
      title: "Pass by Value vs Pass by Reference",
      channel: "Code Mastery",
      duration: "10 mins",
      url: "https://youtube.com/results?search_query=Pass+by+value+vs+pass+by+reference+visualized",
      description: "Deep dive into variable references, pointers, and memory mutation behavior.",
    },
  ],

  detailedNotesHtml: `
    <div style="font-family: system-ui, sans-serif; line-height: 1.7; color: #CBD5E1;">
      <h2 style="color: #8B5CF6; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">1. Computer Memory Architecture (Stack vs Heap)</h2>
      <p>When a program executes, the operating system assigns a block of RAM split into distinct memory regions:</p>
      
      <!-- Visual Diagram 1: Memory Layout -->
      <div style="background: #0B1120; border: 1px solid #7C3AED; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #34D399; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 1: Process RAM Architecture</div>
        <svg viewBox="0 0 600 200" style="width: 100%; max-width: 550px; height: auto;">
          <!-- Stack Container -->
          <rect x="20" y="20" width="250" height="160" rx="8" fill="#1E1B4B" stroke="#8B5CF6" stroke-width="2"/>
          <text x="145" y="45" fill="#A78BFA" font-size="14" font-weight="bold" text-anchor="middle">STACK MEMORY (LIFO)</text>
          <rect x="40" y="60" width="210" height="30" rx="4" fill="#312E81" stroke="#A78BFA"/>
          <text x="145" y="80" fill="#FFF" font-size="11" font-family="monospace" text-anchor="middle">Frame: calculateSum(a=5, b=10)</text>
          <rect x="40" y="100" width="210" height="30" rx="4" fill="#312E81" stroke="#A78BFA"/>
          <text x="145" y="120" fill="#FFF" font-size="11" font-family="monospace" text-anchor="middle">Frame: main() -> userPtr: 0x7FFF</text>
          <rect x="40" y="140" width="210" height="30" rx="4" fill="#4C1D95" stroke="#A78BFA"/>
          <text x="145" y="160" fill="#E9D5FF" font-size="10" font-family="monospace" text-anchor="middle">Fast, Automatic, Small (~8MB)</text>

          <!-- Pointer Arrow -->
          <path d="M 250 115 L 340 115" stroke="#F59E0B" stroke-width="3" marker-end="url(#arrow)" stroke-dasharray="4"/>

          <!-- Heap Container -->
          <rect x="330" y="20" width="250" height="160" rx="8" fill="#064E3B" stroke="#10B981" stroke-width="2"/>
          <text x="455" y="45" fill="#6EE7B7" font-size="14" font-weight="bold" text-anchor="middle">HEAP MEMORY (Dynamic)</text>
          <rect x="350" y="65" width="210" height="95" rx="6" fill="#022C22" stroke="#34D399"/>
          <text x="455" y="90" fill="#6EE7B7" font-size="11" font-family="monospace" text-anchor="middle">Address: 0x7FFF</text>
          <text x="455" y="115" fill="#FFF" font-size="11" font-family="monospace" text-anchor="middle">{ id: 101, name: "Alice" }</text>
          <text x="455" y="140" fill="#A7F3D0" font-size="10" font-family="monospace" text-anchor="middle">Managed by GC / malloc</text>
        </svg>
      </div>

      <h2 style="color: #06B6D4; margin-top: 24px;">2. Execution Tracing: Step-by-Step Code Walkthrough</h2>
      <p>Let's step through code execution and observe stack and heap states at each step:</p>

      <pre style="background: #050816; border: 1px solid #1E293B; border-radius: 8px; padding: 14px; color: #34D399; font-family: monospace; font-size: 13px;">
function processData(val) {
  let score = val * 2;          // Line 2
  let user = { name: "Bob" };   // Line 3
  return score;                 // Line 4
}

let input = 50;                 // Line 7
let result = processData(input);// Line 8
      </pre>

      <h3 style="color: #F59E0B;">Step-by-Step State Trace:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px;">
        <thead>
          <tr style="background: #1E293B; color: #38BDF8;">
            <th style="padding: 8px; border: 1px solid #334155; text-align: left;">Step</th>
            <th style="padding: 8px; border: 1px solid #334155; text-align: left;">Instruction</th>
            <th style="padding: 8px; border: 1px solid #334155; text-align: left;">Stack State</th>
            <th style="padding: 8px; border: 1px solid #334155; text-align: left;">Heap State</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155;">1</td>
            <td style="padding: 8px; border: 1px solid #334155;">Line 7</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>global: input=50</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">(Empty)</td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155;">2</td>
            <td style="padding: 8px; border: 1px solid #334155;">Line 8 (Call)</td>
            <td style="padding: 8px; border: 1px solid #334155;">Push <code>processData(val=50)</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">(Empty)</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155;">3</td>
            <td style="padding: 8px; border: 1px solid #334155;">Line 3</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>user -> 0x88AF</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>0x88AF: { name: "Bob" }</code></td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155;">4</td>
            <td style="padding: 8px; border: 1px solid #334155;">Line 4 (Return)</td>
            <td style="padding: 8px; border: 1px solid #334155;">Pop <code>processData</code> frame; <code>result=100</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">Unreachable <code>0x88AF</code> marked for GC</td>
          </tr>
        </tbody>
      </table>

      <!-- Visual Diagram 2: Pass by Value vs Reference -->
      <div style="background: #0B1120; border: 1px solid #06B6D4; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #38BDF8; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 2: Pass-by-Value vs Reference Mutation</div>
        <svg viewBox="0 0 600 160" style="width: 100%; max-width: 550px; height: auto;">
          <rect x="30" y="20" width="240" height="120" rx="8" fill="#111827" stroke="#3B82F6"/>
          <text x="150" y="45" fill="#60A5FA" font-size="13" font-weight="bold" text-anchor="middle">Pass by Primitive Value</text>
          <text x="150" y="75" fill="#FFF" font-size="11" font-family="monospace" text-anchor="middle">orig = 42</text>
          <text x="150" y="95" fill="#94A3B8" font-size="11" font-family="monospace" text-anchor="middle">func(copy = 42)</text>
          <text x="150" y="115" fill="#34D399" font-size="10" text-anchor="middle">Original value protected</text>

          <rect x="330" y="20" width="240" height="120" rx="8" fill="#111827" stroke="#F43F5E"/>
          <text x="450" y="45" fill="#F87171" font-size="13" font-weight="bold" text-anchor="middle">Pass by Object Reference</text>
          <text x="450" y="75" fill="#FFF" font-size="11" font-family="monospace" text-anchor="middle">arr = [1, 2, 3] @ 0x100</text>
          <text x="450" y="95" fill="#FCA5A5" font-size="11" font-family="monospace" text-anchor="middle">func(ptr = 0x100) -> ptr.push(4)</text>
          <text x="450" y="115" fill="#F87171" font-size="10" text-anchor="middle">Mutates caller memory!</text>
        </svg>
      </div>

      <!-- Visual Diagram 3: Call Stack Overflow -->
      <div style="background: #0B1120; border: 1px solid #F43F5E; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #F87171; font-weight: bold; font-family: monospace; margin-bottom: 8px;">FIGURE 3: Recursion Call Stack Overflow Mechanism</div>
        <svg viewBox="0 0 500 120" style="width: 100%; max-width: 480px; height: auto;">
          <rect x="20" y="15" width="90" height="90" rx="4" fill="#312E81" stroke="#8B5CF6"/>
          <text x="65" y="65" fill="#FFF" font-size="10" font-family="monospace" text-anchor="middle">recurse(3)</text>

          <rect x="130" y="15" width="90" height="90" rx="4" fill="#312E81" stroke="#8B5CF6"/>
          <text x="175" y="65" fill="#FFF" font-size="10" font-family="monospace" text-anchor="middle">recurse(2)</text>

          <rect x="240" y="15" width="90" height="90" rx="4" fill="#312E81" stroke="#8B5CF6"/>
          <text x="285" y="65" fill="#FFF" font-size="10" font-family="monospace" text-anchor="middle">recurse(1)</text>

          <rect x="350" y="15" width="130" height="90" rx="4" fill="#881337" stroke="#F43F5E"/>
          <text x="415" y="55" fill="#FECDD3" font-size="11" font-weight="bold" text-anchor="middle">STACK</text>
          <text x="415" y="75" fill="#FECDD3" font-size="11" font-weight="bold" text-anchor="middle">OVERFLOW!</text>
        </svg>
      </div>
    </div>
  `,

  quiz: [
    {
      id: "prog-q1",
      question: "Which memory area stores local variables inside function execution frames?",
      options: ["Heap Memory", "Stack Memory", "Global Registry", "Cache L1"],
      correctIndex: 1,
      explanation: "Stack memory manages Last-In-First-Out function call stack frames and their local primitive variables.",
    },
    {
      id: "prog-q2",
      question: "What happens when passing an object array to a function in JavaScript/Python?",
      options: [
        "A deep clone of the entire array is created",
        "The memory reference address to the array is passed by value",
        "The operation fails unless explicitly cast to a pointer",
        "The array is moved into Stack memory",
      ],
      correctIndex: 1,
      explanation: "The reference value (memory address) is passed by value, allowing function mutations to affect the heap object.",
    },
    {
      id: "prog-q3",
      question: "What error occurs when recursive function calls exceed maximum stack depth limit?",
      options: ["Out of Memory Exception", "StackOverflowError", "NullPointerException", "Segmentation Fault"],
      correctIndex: 1,
      explanation: "Exceeding the fixed Stack space limit produces a StackOverflow error.",
    },
    {
      id: "prog-q4",
      question: "Why is stack allocation significantly faster than heap allocation?",
      options: ["Stack memory uses specialized optical RAM chips", "Stack pointer simply increments/decrements a contiguous CPU register", "Heap memory requires encryption", "Stack memory bypasses the CPU cache"],
      correctIndex: 1,
      explanation: "Stack allocation is a simple stack-pointer register increment, whereas heap allocation requires searching free-lists and concurrency locks.",
    },
    {
      id: "prog-q5",
      question: "What algorithm do modern language garbage collectors use to find unreachable objects?",
      options: ["Binary Search", "Mark-and-Sweep", "Bubble Sort", "Dijkstra's Algorithm"],
      correctIndex: 1,
      explanation: "Mark-and-Sweep traverses object graph roots (Mark) and reclaims unreachable memory blocks (Sweep).",
    },
    {
      id: "prog-q6",
      question: "What is the result of executing `let a = [10]; let b = a; b.push(20);`?",
      options: ["`a` is `[10]`, `b` is `[10, 20]`", "Both `a` and `b` point to `[10, 20]`", "Syntax error", "`a` becomes `null`"],
      correctIndex: 1,
      explanation: "`b` copies the reference pointing to the same heap array object as `a`.",
    },
    {
      id: "prog-q7",
      question: "Which data structure models computer function call execution memory?",
      options: ["Queue (FIFO)", "Stack (LIFO)", "Binary Search Tree", "Graph"],
      correctIndex: 1,
      explanation: "The function call stack is a strict Last-In First-Out structure.",
    },
    {
      id: "prog-q8",
      question: "What is a memory leak in garbage-collected environments?",
      options: ["Physical RAM failure", "Unused heap objects remaining reachable via unintended active references", "Stack frame size exceeding 1MB", "Reading uninitialized variables"],
      correctIndex: 1,
      explanation: "Retaining unused references (e.g. in global sets) prevents garbage collection from freeing heap memory.",
    },
    {
      id: "prog-q9",
      question: "What is auxiliary space complexity?",
      options: ["Total size of input data", "Extra space allocated by the algorithm excluding input space", "Disk swap size", "GPU RAM allocation"],
      correctIndex: 1,
      explanation: "Auxiliary space measures additional memory created during execution beyond original inputs.",
    },
    {
      id: "prog-q10",
      question: "Which primitive variable is stored directly on the stack in compiled languages?",
      options: ["32-bit Integer variable", "10,000-element array object", "JSON API response", "Class instance object"],
      correctIndex: 0,
      explanation: "Fixed-size primitive values like integers live directly inside the active stack frame.",
    },
  ],

  practiceProblems: [
    {
      id: "prog-p1",
      title: "1. Reverse Stack Frame Operations",
      difficulty: "Easy",
      description: "Implement a function `simulateCallStack(calls)` that takes an array of function names and returns their pop order in LIFO sequence.",
      hints: ["Pop from end of array to mimic Last-In First-Out execution."],
      starterCode: `function simulateCallStack(calls) {
  // Your code here
  return calls.reverse();
}`,
      solutionExplanation: "LIFO execution processes items from last pushed to first.",
      testCases: [
        { input: [["main", "foo", "bar"]], expected: ["bar", "foo", "main"] },
        { input: [["init", "render"]], expected: ["render", "init"] },
      ],
    },
  ],
};

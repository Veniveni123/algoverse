import type { LessonContent } from "@/types/lesson";

export const stackLesson: LessonContent = {
  slug: "stack",
  topicKey: "Stacks",
  title: "Stack Data Structure & Monotonic Evaluation",
  introduction:
    "A Stack is a linear data structure following the strict Last-In, First-Out (LIFO) protocol. Elements are inserted (Pushed) and removed (Popped) exclusively from a single endpoint called the Top.",
  analogy:
    "Think of a cafeteria stack of clean dinner plates. The last plate washed and placed on top of the stack is always the first plate retrieved by the next customer. You cannot pull out the bottom plate without removing all plates above it.",
  timeComplexity: [
    { operation: "Push (Insert at Top)", complexity: "O(1) Constant" },
    { operation: "Pop (Remove from Top)", complexity: "O(1) Constant" },
    { operation: "Peek / Top (View Top Item)", complexity: "O(1) Constant" },
    { operation: "Search Element", complexity: "O(N) Linear" },
  ],
  spaceComplexity: "O(N) — contiguous array memory or linked list nodes holding N pushed items.",
  applications: [
    "CPU call stack execution tracking local variables and return jump memory addresses",
    "Syntax parsing, parenthesis matching, and infix-to-postfix expression evaluation",
    "Monotonic Stack pattern for Next Greater Element and daily temperatures algorithms",
    "Backtracking algorithms (DFS traversal, maze solving, browser back history)",
  ],
  advantages: [
    "Guaranteed O(1) constant time push, pop, and peek operations",
    "Simple state enforcement eliminating out-of-order element corruption",
    "Minimal memory allocation overhead when backed by a dynamic array or linked list",
  ],
  disadvantages: [
    "No random index access — accessing the Nth element requires popping all items above it",
    "Fixed capacity limits in array-backed stacks risk Stack Overflow errors",
  ],
  interviewQuestions: [
    {
      question: "How do you implement a Min Stack that retrieves the minimum element in O(1) time?",
      answer:
        "Maintain a secondary auxiliary stack (`minStack`). On `push(x)`, push `x` onto main stack and `Math.min(x, minStack.top())` onto `minStack`. On `pop()`, pop from both stacks. `getMin()` returns `minStack.top()` in O(1) time.",
    },
    {
      question: "What is a Monotonic Stack and what class of problems does it solve?",
      answer:
        "A Monotonic Stack maintains its elements in strictly increasing or decreasing order. As new elements arrive, older smaller (or larger) items are popped. It solves 'Next Greater Element', 'Largest Rectangle in Histogram', and 'Daily Temperatures' in O(N) linear time.",
    },
    {
      question: "How does a compiler evaluate mathematical expressions like `(3 + 4) * 5` using stacks?",
      answer:
        "Compilers use Dijkstra's Shunting-Yard Algorithm to convert infix expressions `(3 + 4) * 5` into Postfix (Reverse Polish Notation) `3 4 + 5 *` using an operator stack, then evaluate the postfix expression using an operand stack.",
    },
    {
      question: "How can you implement a Queue using two Stacks?",
      answer:
        "Use `inStack` for enqueuing and `outStack` for dequeuing. When dequeuing, if `outStack` is empty, pop all elements from `inStack` and push them onto `outStack` (reversing their order to FIFO). Amortized time per operation is O(1).",
    },
  ],
  visualizerRoute: "/visualizer",
  visualizerLabel: "Launch Interactive Stack Visualizer",

  commonMistakes: [
    "Popping from an empty stack without checking `isEmpty()`, triggering StackUnderflow exceptions",
    "Using an inefficient array `shift()` (O(N)) instead of `pop()` (O(1)) when backing stacks with arrays",
    "Forgetting to update the auxiliary min stack on duplicate minimum element pushes",
    "Confusing LIFO (Stack) behavior with FIFO (Queue) behavior in traversal logic",
  ],

  projectIdeas: [
    "Syntax Highlighting & Validator Engine: Build a code editor plugin validating nested brackets `()[]{}` and HTML tag closing pairs in real time",
    "Reverse Polish Notation Calculator: Create an interactive CLI calculator evaluating complex infix/postfix math equations using stack state",
    "Browser Navigation Engine: Build a dual-stack (Back Stack & Forward Stack) history manager simulating web page navigation",
    "Stock Span & Chart Analysis Tool: Implement a financial charting library calculating stock price span indicators using a Monotonic Stack",
  ],

  youtubeVideos: [
    {
      id: "stack-yt-1",
      title: "Stack Data Structure & LIFO Mechanics",
      channel: "CS Corner",
      duration: "13 mins",
      url: "https://youtube.com/results?search_query=Stack+Data+Structure+LIFO+Push+Pop+Tutorial",
      description: "Visual breakdown of stack memory, push/pop ops, and call stack execution.",
    },
    {
      id: "stack-yt-2",
      title: "Monotonic Stack Pattern Guide",
      channel: "LeetCode Master",
      duration: "20 mins",
      url: "https://youtube.com/results?search_query=Monotonic+Stack+Next+Greater+Element+Pattern",
      description: "Deep dive into Monotonic Stack algorithms for technical coding interviews.",
    },
  ],

  detailedNotesHtml: `
    <div style="font-family: system-ui, sans-serif; line-height: 1.7; color: #CBD5E1;">
      <h2 style="color: #8B5CF6; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">1. LIFO Architecture & Push/Pop Operations</h2>
      <p>Items enter and exit from the Top pointer index exclusively:</p>

      <!-- Visual Diagram 1: Stack LIFO Push and Pop -->
      <div style="background: #0B1120; border: 1px solid #7C3AED; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #34D399; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 1: Stack LIFO Push & Pop Mechanics</div>
        <svg viewBox="0 0 520 180" style="width: 100%; max-width: 490px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <!-- Stack Container -->
            <rect x="180" y="30" width="160" height="135" rx="8" fill="#1E1B4B" stroke="#8B5CF6" stroke-width="2"/>
            <line x1="180" y1="30" x2="340" y2="30" stroke="#050816" stroke-width="4"/> <!-- Open Top -->

            <!-- Element 3 (TOP) -->
            <rect x="195" y="42" width="130" height="28" rx="4" fill="#8B5CF6"/> <text x="260" y="60" fill="#FFF" font-weight="bold">Item C (TOP)</text>

            <!-- Element 2 -->
            <rect x="195" y="76" width="130" height="28" rx="4" fill="#312E81"/> <text x="260" y="94" fill="#CBD5E1">Item B</text>

            <!-- Element 1 -->
            <rect x="195" y="110" width="130" height="28" rx="4" fill="#312E81"/> <text x="260" y="128" fill="#CBD5E1">Item A (BOTTOM)</text>

            <!-- Push Arrow -->
            <path d="M 80 45 L 170 45" stroke="#10B981" stroke-width="3" marker-end="url(#arrow)"/>
            <text x="125" y="35" fill="#34D399" font-weight="bold">PUSH(X)</text>

            <!-- Pop Arrow -->
            <path d="M 350 45 L 440 45" stroke="#F43F5E" stroke-width="3" marker-end="url(#arrow)"/>
            <text x="395" y="35" fill="#F87171" font-weight="bold">POP()</text>
          </g>
        </svg>
      </div>

      <h2 style="color: #06B6D4; margin-top: 24px;">2. Valid Parentheses Matching Code Walkthrough</h2>
      <p>Validate if string bracket pairs ()[]{} are correctly closed using a Stack:</p>
 
      <pre style="background: #050816; border: 1px solid #1E293B; border-radius: 8px; padding: 14px; color: #34D399; font-family: monospace; font-size: 13px;">
function isValidParentheses(s) {
  const stack = [];
  const map = { ')': '(', ']': '[', '}': '{' };
  
  for (let char of s) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    } else if (stack.length === 0 || stack.pop() !== map[char]) {
      return false;
    }
  }
  return stack.length === 0;
}
      </pre>

      <h3 style="color: #F59E0B;">Step-by-Step State Trace for Input "{ [ ( ) ] }":</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px;">
        <thead>
          <tr style="background: #1E293B; color: #38BDF8;">
            <th style="padding: 8px; border: 1px solid #334155;">Step</th>
            <th style="padding: 8px; border: 1px solid #334155;">Character</th>
            <th style="padding: 8px; border: 1px solid #334155;">Action Taken</th>
            <th style="padding: 8px; border: 1px solid #334155;">Stack State (Bottom -> Top)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">1</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>'{'</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">Push <code>'{'</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>['{']</code></td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">2</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>'['</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">Push <code>'['</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>['{', '[']</code></td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">3</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>'('</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">Push <code>'('</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>['{', '[', '(']</code></td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">4</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>')'</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">Pop <code>'('</code> -> Matches <code>')'</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>['{', '[']</code></td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">5</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>']'</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">Pop <code>'['</code> -> Matches <code>']'</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>['{']</code></td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">6</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>'}'</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">Pop <code>'{'</code> -> Matches <code>'}'</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[]</code> (Empty -> Valid!)</td>
          </tr>
        </tbody>
      </table>

      <!-- Visual Diagram 2: Min Stack Architecture -->
      <div style="background: #0B1120; border: 1px solid #06B6D4; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #22D3EE; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 2: O(1) Min Stack Dual-Array Tracking</div>
        <svg viewBox="0 0 500 140" style="width: 100%; max-width: 460px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <rect x="50" y="20" width="170" height="100" rx="6" fill="#1E1B4B" stroke="#3B82F6"/>
            <text x="135" y="42" fill="#60A5FA" font-size="12" font-weight="bold">Main Stack</text>
            <text x="135" y="65" fill="#FFF">Top -> [ 3 ]</text>
            <text x="135" y="85" fill="#FFF">[ 5 ]</text>
            <text x="135" y="105" fill="#FFF">[ 8 ]</text>

            <rect x="280" y="20" width="170" height="100" rx="6" fill="#064E3B" stroke="#10B981"/>
            <text x="365" y="42" fill="#34D399" font-size="12" font-weight="bold">Min Stack</text>
            <text x="365" y="65" fill="#A7F3D0" font-weight="bold">Top -> [ 3 ] (Min)</text>
            <text x="365" y="85" fill="#A7F3D0">[ 5 ]</text>
            <text x="365" y="105" fill="#A7F3D0">[ 8 ]</text>
          </g>
        </svg>
      </div>

      <!-- Visual Diagram 3: Monotonic Decreasing Stack -->
      <div style="background: #0B1120; border: 1px solid #F59E0B; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #FBBF24; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 3: Monotonic Decreasing Stack Element Eviction</div>
        <svg viewBox="0 0 500 130" style="width: 100%; max-width: 460px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <text x="250" y="25" fill="#FBBF24" font-weight="bold">Incoming Num: 73 (Larger than Top 71)</text>

            <rect x="120" y="45" width="80" height="30" rx="4" fill="#881337" stroke="#F43F5E"/>
            <text x="160" y="65" fill="#FFF">POP 71</text>

            <rect x="210" y="45" width="80" height="30" rx="4" fill="#881337" stroke="#F43F5E"/>
            <text x="250" y="65" fill="#FFF">POP 69</text>

            <rect x="300" y="45" width="80" height="30" rx="4" fill="#065F46" stroke="#34D399"/>
            <text x="340" y="65" fill="#FFF">PUSH 73</text>

            <text x="250" y="110" fill="#94A3B8">Maintains strictly decreasing order for Next Greater Element</text>
          </g>
        </svg>
      </div>
    </div>
  `,

  quiz: [
    {
      id: "stk-q1",
      question: "What is the access ordering protocol of a Stack data structure?",
      options: ["LIFO (Last-In, First-Out)", "FIFO (First-In, First-Out)", "Priority Ordering", "Random Access"],
      correctIndex: 0,
      explanation: "Stacks strictly follow Last-In, First-Out (LIFO) order.",
    },
    {
      id: "stk-q2",
      question: "What is the time complexity of pushing or popping an element from a stack?",
      options: ["O(1)", "O(log N)", "O(N)", "O(N²)"],
      correctIndex: 0,
      explanation: "Pushing and popping at the top index takes O(1) constant time.",
    },
    {
      id: "stk-q3",
      question: "What error occurs when calling `pop()` on an empty stack?",
      options: ["Stack Underflow", "Stack Overflow", "NullPointerException", "Segmentation Fault"],
      correctIndex: 0,
      explanation: "Attempting to remove elements from an empty stack triggers a Stack Underflow error.",
    },
    {
      id: "stk-q4",
      question: "How does a Min Stack achieve O(1) time complexity for `getMin()`?",
      options: ["By sorting the stack on every push", "By maintaining a secondary auxiliary stack tracking local minimums", "By scanning elements using binary search", "By using a GPU accelerator"],
      correctIndex: 1,
      explanation: "A secondary minStack pushes the current minimum alongside each element, allowing O(1) top reads.",
    },
    {
      id: "stk-q5",
      question: "Which algorithm evaluates parenthesis matching `()[]{}`?",
      options: ["Push open brackets to Stack; on close bracket pop and verify matching pair", "Binary Search", "Queue FIFO Scan", "Dijkstra Shortest Path"],
      correctIndex: 0,
      explanation: "Stacks push open brackets and pop matching pairs when encountering closing brackets.",
    },
    {
      id: "stk-q6",
      question: "What problem is naturally solved using a Monotonic Stack in O(N) time?",
      options: ["Next Greater Element", "Shortest Path in Graph", "Minimum Spanning Tree", "Matrix Multiplication"],
      correctIndex: 0,
      explanation: "Monotonic stacks track candidate bounds to find the Next Greater Element in linear time.",
    },
    {
      id: "stk-q7",
      question: "In expression parsing, Reverse Polish Notation (RPN) is also known as:",
      options: ["Infix notation", "Postfix notation", "Prefix notation", "Binary notation"],
      correctIndex: 1,
      explanation: "Reverse Polish Notation places operators after operands (Postfix), easily evaluated using a Stack.",
    },
    {
      id: "stk-q8",
      question: "How can a Queue be implemented using two Stacks (`inStack` and `outStack`)?",
      options: ["Enqueue pushes to `inStack`; Dequeue pops from `outStack` (transferring `inStack` items if `outStack` empty)", "Push to both stacks simultaneously", "Sort items between stacks", "Not possible"],
      correctIndex: 0,
      explanation: "Transferring elements from `inStack` to `outStack` reverses LIFO into FIFO order in O(1) amortized time.",
    },
    {
      id: "stk-q9",
      question: "What is the space complexity of pushing N elements onto a stack?",
      options: ["O(1)", "O(log N)", "O(N)", "O(N²)"],
      correctIndex: 2,
      explanation: "Storing N items in contiguous array RAM or linked nodes requires O(N) memory space.",
    },
    {
      id: "stk-q10",
      question: "Which memory region relies on stack mechanics to manage nested function calls?",
      options: ["Heap RAM", "CPU Call Stack", "Disk Storage", "Network Socket Buffer"],
      correctIndex: 1,
      explanation: "The CPU Call Stack uses LIFO frames to track function returns and local variable scopes.",
    },
  ],

  practiceProblems: [
    {
      id: "stk-p1",
      title: "1. Valid Parentheses",
      difficulty: "Easy",
      description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      hints: ["Push open brackets onto stack. For close brackets, pop top item and check if it matches."],
      starterCode: `function isValid(s) {
  let stack = [];
  let map = { ')': '(', ']': '[', '}': '{' };
  for (let char of s) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
      solutionExplanation: "Stack bracket matching executes in O(N) time and O(N) auxiliary space.",
      testCases: [
        { input: ["()[]{}"], expected: true },
        { input: ["(]"], expected: false },
      ],
    },
    {
      id: "stk-p2",
      title: "2. Min Stack Implementation",
      difficulty: "Medium",
      description: "Design a stack that supports push, pop, top, and retrieving the minimum element in O(1) constant time.",
      hints: ["Maintain a secondary minStack array tracking Math.min(val, minStack.top())."],
      starterCode: `class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  push(val) {
    this.stack.push(val);
    let currentMin = this.minStack.length === 0 ? val : Math.min(val, this.minStack[this.minStack.length - 1]);
    this.minStack.push(currentMin);
  }
  pop() {
    this.stack.pop();
    this.minStack.pop();
  }
  top() {
    return this.stack[this.stack.length - 1];
  }
  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}`,
      solutionExplanation: "Dual-stack maintenance delivers O(1) time across all operations.",
      testCases: [
        { input: [["push(-2)", "push(0)", "push(-3)", "getMin()"]], expected: [-3] },
      ],
    },
  ],
};

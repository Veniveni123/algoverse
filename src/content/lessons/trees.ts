import type { LessonContent } from "@/types/lesson";

export const treesLesson: LessonContent = {
  slug: "trees",
  topicKey: "Trees",
  title: "Tree Structures, Binary Search Trees & Trie Architectures",
  introduction:
    "A Tree is a hierarchical non-linear data structure consisting of nodes connected by parent-child edges starting from a single Root node. Trees model hierarchical relationships, sorted sets, spatial indices, and prefix lookups.",
  analogy:
    "Think of a company organizational hierarchy. The CEO sits at the top (Root Node). Department VPs branch out underneath (Internal Child Nodes), managing Directors, down to individual team contributors at the bottom who manage no one (Leaf Nodes).",
  timeComplexity: [
    { operation: "BST Search (Balanced)", complexity: "O(log N) Logarithmic" },
    { operation: "BST Search (Unbalanced Degenerate)", complexity: "O(N) Linear" },
    { operation: "BST Insert / Delete", complexity: "O(log N) Logarithmic" },
    { operation: "Tree Traversals (Inorder/Pre/Post/Level)", complexity: "O(N) Linear" },
    { operation: "Trie Word Search", complexity: "O(L) where L is Word Length" },
  ],
  spaceComplexity: "O(H) recursive call stack space where H is tree height (O(log N) for balanced trees, O(N) for degenerate skew trees).",
  applications: [
    "HTML Document Object Model (DOM) tree rendering in browser layout engines",
    "Operating system file directory folder trees (e.g. `/usr/local/bin`)",
    "Abstract Syntax Trees (AST) built by programming language parsers and compilers",
    "Autocompletion prefix lookup engines (Trie) and database range indices (B-Trees / Segment Trees)",
  ],
  advantages: [
    "Efficient hierarchical modeling of structured relational data",
    "Logarithmic O(log N) search, insertion, and deletion times when balanced",
    "Inorder traversal of a Binary Search Tree produces sorted key outputs in O(N) time",
  ],
  disadvantages: [
    "Unbalanced naive BSTs degrade into O(N) linear linked lists under sequential inputs",
    "Overhead of managing left/right/parent node pointers in memory",
  ],
  interviewQuestions: [
    {
      question: "What is the difference between Inorder, Preorder, and Postorder DFS tree traversals?",
      answer:
        "Inorder: Left -> Root -> Right (produces sorted keys in a BST). Preorder: Root -> Left -> Right (used for cloning/serializing trees). Postorder: Left -> Right -> Root (used for deleting or bottom-up subtree evaluations).",
    },
    {
      question: "How do self-balancing BSTs (AVL / Red-Black Trees) maintain O(log N) height guarantees?",
      answer:
        "They enforce strict height invariants. When an insertion or deletion breaks balance (e.g., balance factor `|h_left - h_right| > 1` in AVL), the tree executes O(1) single or double rotations (Left/Right rotations) to restore balance.",
    },
    {
      question: "What is a Trie (Prefix Tree) and why is it superior to a Hash Map for autocomplete?",
      answer:
        "A Trie stores characters as edges along node paths. Words sharing common prefixes share node ancestors. It searches prefixes in O(L) time (where L is query length) independent of total stored dictionary size N, whereas Hash Maps must evaluate full keys.",
    },
    {
      question: "How do you validate if a Binary Tree is a valid Binary Search Tree (BST)?",
      answer:
        "Perform DFS passing valid range bounds `[min, max]`. For every node: check `min < node.val < max`, then recurse `isValid(node.left, min, node.val)` and `isValid(node.right, node.val, max)`. Alternatively, verify if Inorder traversal is strictly increasing.",
    },
  ],
  visualizerRoute: "/tree",
  visualizerLabel: "Launch Interactive Tree Visualizer",

  commonMistakes: [
    "Assuming a Binary Tree is automatically a Binary Search Tree without verifying BST invariant Ordering (`Left < Node < Right`)",
    "Checking only immediate child nodes instead of enforcing subtree boundary limits when validating BSTs",
    "Creating unbalanced degenerate skew trees by inserting pre-sorted inputs into a naive BST",
    "Forgetting base cases `node === null` in recursive DFS traversal functions",
  ],

  projectIdeas: [
    "Fast Autocomplete Search Bar: Build a Trie-backed search engine suggesting matching dictionary words in sub-millisecond time",
    "Abstract Syntax Tree (AST) Evaluator: Create a math parser building an AST from string expressions and evaluating node operations bottom-up",
    "File Directory Visualizer: Build an interactive folder tree component rendering nested directory file sizes using Postorder recursion",
    "AVL Self-Balancing Visualizer: Implement a web simulator demonstrating single and double tree rotations as items are added",
  ],

  youtubeVideos: [
    {
      id: "tr-yt-1",
      title: "Binary Trees & BST Mechanics",
      channel: "Algorithms Deep Dive",
      duration: "18 mins",
      url: "https://youtube.com/results?search_query=Binary+Search+Tree+BST+Traversals+Tutorial",
      description: "Visual guide to Binary Search Trees, traversals, and node deletion.",
    },
    {
      id: "tr-yt-2",
      title: "Trie Data Structure & Autocomplete",
      channel: "ByteByteGo",
      duration: "15 mins",
      url: "https://youtube.com/results?search_query=Trie+Prefix+Tree+Autocomplete+Data+Structure",
      description: "Complete walkthrough of Trie node design and prefix search algorithms.",
    },
  ],

  detailedNotesHtml: `
    <div style="font-family: system-ui, sans-serif; line-height: 1.7; color: #CBD5E1;">
      <h2 style="color: #8B5CF6; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">1. Binary Search Tree (BST) Ordering Invariant</h2>
      <p>For every node <code>N</code>, all left subtree values are strictly smaller (<code>&lt; N.val</code>) and all right subtree values are strictly larger (<code>&gt; N.val</code>):</p>

      <!-- Visual Diagram 1: BST Invariant Structure -->
      <div style="background: #0B1120; border: 1px solid #7C3AED; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #34D399; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 1: Binary Search Tree (BST) Node Layout</div>
        <svg viewBox="0 0 500 180" style="width: 100%; max-width: 480px; height: auto;">
          <g font-family="monospace" font-size="12" text-anchor="middle">
            <!-- Root -->
            <circle cx="250" cy="30" r="20" fill="#7C3AED" stroke="#A78BFA" stroke-width="2"/> <text x="250" y="35" fill="#FFF" font-weight="bold">50</text>

            <!-- Edges Level 1 -->
            <line x1="235" y1="45" x2="140" y2="80" stroke="#06B6D4" stroke-width="2"/>
            <line x1="265" y1="45" x2="360" y2="80" stroke="#06B6D4" stroke-width="2"/>

            <!-- Level 1 Left -->
            <circle cx="140" cy="90" r="18" fill="#1E1B4B" stroke="#8B5CF6"/> <text x="140" y="95" fill="#FFF">30</text>
            <!-- Level 1 Right -->
            <circle cx="360" cy="90" r="18" fill="#1E1B4B" stroke="#8B5CF6"/> <text x="360" y="95" fill="#FFF">70</text>

            <!-- Edges Level 2 -->
            <line x1="128" y1="104" x2="80" y2="135" stroke="#64748B" stroke-width="2"/>
            <line x1="152" y1="104" x2="200" y2="135" stroke="#64748B" stroke-width="2"/>
            <line x1="348" y1="104" x2="300" y2="135" stroke="#64748B" stroke-width="2"/>
            <line x1="372" y1="104" x2="420" y2="135" stroke="#64748B" stroke-width="2"/>

            <!-- Leaves -->
            <circle cx="80" cy="145" r="16" fill="#312E81"/> <text x="80" y="149" fill="#FFF">20</text>
            <circle cx="200" cy="145" r="16" fill="#312E81"/> <text x="200" y="149" fill="#FFF">40</text>
            <circle cx="300" cy="145" r="16" fill="#312E81"/> <text x="300" y="149" fill="#FFF">60</text>
            <circle cx="420" cy="145" r="16" fill="#312E81"/> <text x="420" y="149" fill="#FFF">80</text>
          </g>
        </svg>
      </div>

      <h2 style="color: #06B6D4; margin-top: 24px;">2. BST Inorder Traversal & Validation Walkthrough</h2>
      <p>Inorder traversal produces sorted key outputs <code>[20, 30, 40, 50, 60, 70, 80]</code>:</p>

      <pre style="background: #050816; border: 1px solid #1E293B; border-radius: 8px; padding: 14px; color: #34D399; font-family: monospace; font-size: 13px;">
function isValidBST(root, min = null, max = null) {
  if (root === null) return true; // Base case: empty node is valid BST
  
  // Enforce range bounds
  if ((min !== null && root.val <= min) || (max !== null && root.val >= max)) {
    return false;
  }
  
  // Recurse left subtree with updated max, and right subtree with updated min
  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);
}
      </pre>

      <h3 style="color: #F59E0B;">Step-by-Step State Trace:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px;">
        <thead>
          <tr style="background: #1E293B; color: #38BDF8;">
            <th style="padding: 8px; border: 1px solid #334155;">Node Value</th>
            <th style="padding: 8px; border: 1px solid #334155;">Allowed Range [min, max]</th>
            <th style="padding: 8px; border: 1px solid #334155;">Condition Check</th>
            <th style="padding: 8px; border: 1px solid #334155;">Result</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155;"><code>50 (Root)</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[-∞, +∞]</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>-∞ < 50 < +∞</code></td>
            <td style="padding: 8px; border: 1px solid #334155; color: #34D399;">Valid</td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155;"><code>30 (Left)</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[-∞, 50]</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>-∞ < 30 < 50</code></td>
            <td style="padding: 8px; border: 1px solid #334155; color: #34D399;">Valid</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155;"><code>70 (Right)</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[50, +∞]</code></td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>50 < 70 < +∞</code></td>
            <td style="padding: 8px; border: 1px solid #334155; color: #34D399;">Valid</td>
          </tr>
        </tbody>
      </table>

      <!-- Visual Diagram 2: AVL Tree Rotation -->
      <div style="background: #0B1120; border: 1px solid #06B6D4; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #22D3EE; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 2: AVL Self-Balancing Right Rotation (LL Imbalance)</div>
        <svg viewBox="0 0 500 130" style="width: 100%; max-width: 460px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <text x="120" y="25" fill="#F87171">Unbalanced Skew</text>
            <circle cx="120" cy="45" r="14" fill="#881337"/> <text x="120" y="49" fill="#FFF">30</text>
            <circle cx="90" cy="80" r="14" fill="#881337"/> <text x="90" y="84" fill="#FFF">20</text>
            <circle cx="60" cy="115" r="14" fill="#881337"/> <text x="60" y="119" fill="#FFF">10</text>

            <text x="250" y="70" fill="#34D399" font-weight="bold">→ Rotate Right →</text>

            <text x="380" y="25" fill="#34D399">Balanced AVL</text>
            <circle cx="380" cy="55" r="14" fill="#065F46"/> <text x="380" y="59" fill="#FFF">20</text>
            <circle cx="340" cy="95" r="14" fill="#1E1B4B"/> <text x="340" y="99" fill="#FFF">10</text>
            <circle cx="420" cy="95" r="14" fill="#1E1B4B"/> <text x="420" y="99" fill="#FFF">30</text>
          </g>
        </svg>
      </div>

      <!-- Visual Diagram 3: Trie Prefix Tree Structure -->
      <div style="background: #0B1120; border: 1px solid #F59E0B; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #FBBF24; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 3: Trie Prefix Tree for "cat", "car", "card"</div>
        <svg viewBox="0 0 450 140" style="width: 100%; max-width: 420px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <circle cx="225" cy="20" r="12" fill="#1E293B"/> <text x="225" y="24" fill="#FFF">root</text>

            <line x1="225" y1="32" x2="225" y2="55" stroke="#F59E0B" stroke-width="2"/>
            <circle cx="225" cy="65" r="14" fill="#451A03" stroke="#F59E0B"/> <text x="225" y="69" fill="#FBBF24">c</text>

            <line x1="225" y1="79" x2="225" y2="100" stroke="#F59E0B" stroke-width="2"/>
            <circle cx="225" cy="110" r="14" fill="#451A03" stroke="#F59E0B"/> <text x="225" y="114" fill="#FBBF24">a</text>

            <line x1="215" y1="120" x2="160" y2="135" stroke="#F59E0B" stroke-width="2"/>
            <line x1="235" y1="120" x2="290" y2="135" stroke="#F59E0B" stroke-width="2"/>
            <circle cx="150" cy="138" r="12" fill="#065F46"/> <text x="150" y="142" fill="#FFF">t*</text>
            <circle cx="300" cy="138" r="12" fill="#065F46"/> <text x="300" y="142" fill="#FFF">r*</text>
          </g>
        </svg>
      </div>
    </div>
  `,

  quiz: [
    {
      id: "tr-q1",
      question: "In a Binary Search Tree (BST), elements in the left subtree of node N are:",
      options: ["Strictly smaller than N.val", "Strictly larger than N.val", "Equal to N.val", "Randomly arranged"],
      correctIndex: 0,
      explanation: "By BST definition, every left descendant is smaller than the parent node value.",
    },
    {
      id: "tr-q2",
      question: "Which tree traversal order yields sorted keys when executed on a Binary Search Tree?",
      options: ["Inorder Traversal (Left -> Root -> Right)", "Preorder Traversal", "Postorder Traversal", "Level-order Traversal"],
      correctIndex: 0,
      explanation: "Inorder traversal visits left subtree, root node, then right subtree, producing strictly increasing keys.",
    },
    {
      id: "tr-q3",
      question: "What is the worst-case time complexity of searching a naive BST constructed from pre-sorted inputs?",
      options: ["O(N) Linear (Degenerates into Linked List)", "O(log N)", "O(1)", "O(N²)"],
      correctIndex: 0,
      explanation: "Inserting sorted items creates a single skew path of height N, degrading search time to O(N).",
    },
    {
      id: "tr-q4",
      question: "What operations do self-balancing trees (AVL / Red-Black) execute to maintain O(log N) height?",
      options: ["Tree Rotations (Left and Right rotations)", "Array Re-allocation", "Hash table rehashing", "Matrix transposition"],
      correctIndex: 0,
      explanation: "Tree rotations rebalance subtrees in O(1) time whenever height balance factors exceed limits.",
    },
    {
      id: "tr-q5",
      question: "What is the time complexity of searching for a word of length L in a Trie (Prefix Tree)?",
      options: ["O(L)", "O(N) where N is total words", "O(N log N)", "O(L²)"],
      correctIndex: 0,
      explanation: "Tries traverse character-by-character along node paths in O(L) time regardless of total dictionary size N.",
    },
    {
      id: "tr-q6",
      question: "Which tree traversal order is used to delete nodes bottom-up safely?",
      options: ["Postorder Traversal (Left -> Right -> Root)", "Preorder Traversal", "Inorder Traversal", "Zigzag Traversal"],
      correctIndex: 0,
      explanation: "Postorder visits child nodes before the parent node, allowing bottom-up deletion without losing pointers.",
    },
    {
      id: "tr-q7",
      question: "What is the maximum number of nodes in a full binary tree of height H (1-indexed)?",
      options: ["2^H - 1", "2*H", "H²", "2^(H-1)"],
      correctIndex: 0,
      explanation: "A full binary tree of height H has sum of powers of 2 nodes: 1 + 2 + 4 + ... + 2^(H-1) = 2^H - 1.",
    },
    {
      id: "tr-q8",
      question: "Which tree structure efficient handles range sum queries and point updates in O(log N)?",
      options: ["Segment Tree / Fenwick Tree", "Trie", "Binary Search Tree", "Linked List"],
      correctIndex: 0,
      explanation: "Segment trees store interval aggregations in internal nodes for O(log N) range queries.",
    },
    {
      id: "tr-q9",
      question: "What is the auxiliary space complexity of recursive DFS on a balanced tree of N nodes?",
      options: ["O(log N) stack space", "O(N²)", "O(1)", "O(N log N)"],
      correctIndex: 0,
      explanation: "Recursion depth on a balanced tree equals tree height H = log2(N), taking O(log N) stack space.",
    },
    {
      id: "tr-q10",
      question: "In a min-heap binary tree, where is the minimum value located?",
      options: ["Root node at index 0", "Rightmost leaf node", "Leftmost leaf node", "Middle node"],
      correctIndex: 0,
      explanation: "The min-heap property guarantees the smallest value resides at the root node.",
    },
  ],

  practiceProblems: [
    {
      id: "tr-p1",
      title: "1. Validate Binary Search Tree",
      difficulty: "Medium",
      description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
      hints: ["Use recursive helper function passing valid bounds `[min, max]`. Enforce min < node.val < max."],
      starterCode: `function isValidBST(root, min = null, max = null) {
  if (!root) return true;
  if ((min !== null && root.val <= min) || (max !== null && root.val >= max)) return false;
  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);
}`,
      solutionExplanation: "DFS validation checks every node once in O(N) time and O(H) auxiliary space.",
      testCases: [
        { input: [[2, 1, 3]], expected: true },
        { input: [[5, 1, 4, null, null, 3, 6]], expected: false },
      ],
    },
    {
      id: "tr-p2",
      title: "2. Maximum Depth of Binary Tree",
      difficulty: "Easy",
      description: "Given the root of a binary tree, return its maximum depth (number of nodes along longest root-to-leaf path).",
      hints: ["Return 1 + Math.max(maxDepth(root.left), maxDepth(root.right)). Base case root===null returns 0."],
      starterCode: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
      solutionExplanation: "Bottom-up recursion calculates tree height in O(N) time.",
      testCases: [
        { input: [[3, 9, 20, null, null, 15, 7]], expected: 3 },
      ],
    },
  ],
};

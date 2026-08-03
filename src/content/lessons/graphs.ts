import type { LessonContent } from "@/types/lesson";

export const graphsLesson: LessonContent = {
  slug: "graphs",
  topicKey: "Graphs",
  title: "Graph Theory, Network Traversal & Pathfinding",
  introduction:
    "A Graph is a non-linear data structure consisting of a set of Vertices (V) connected by Edges (E). Graphs model arbitrary network topologies including road networks, social connections, computer networks, and task dependencies.",
  analogy:
    "Think of an airline flight network. Airports are Vertices, direct flights between airports are Edges, and ticket flight prices or mileage distances are Edge Weights. Finding the cheapest multi-city itinerary is a shortest-path graph algorithm problem.",
  timeComplexity: [
    { operation: "BFS / DFS Traversal (Adjacency List)", complexity: "O(V + E) Linear" },
    { operation: "BFS / DFS Traversal (Adjacency Matrix)", complexity: "O(V²) Quadratic" },
    { operation: "Dijkstra Shortest Path (Min Heap)", complexity: "O((V + E) log V)" },
    { operation: "Topological Sort (Kahn's / DFS)", complexity: "O(V + E)" },
    { operation: "Union-Find (DSU with Path Compression)", complexity: "O(α(N)) Amortized Constant" },
  ],
  spaceComplexity: "O(V + E) for storing adjacency lists and visited sets; O(V²) for dense adjacency matrices.",
  applications: [
    "GPS navigation mapping systems (Google Maps shortest driving routes)",
    "Social network connection recommendations ('People You May Know')",
    "Web crawlers indexing hyperlinked internet web pages",
    "Build system dependency resolution (npm, Gradle, Make compile order via Topological Sort)",
  ],
  advantages: [
    "Flexible non-linear structure capable of modeling any relational network topology",
    "Rich set of foundational algorithms solving shortest path, flow, and connectivity problems",
  ],
  disadvantages: [
    "High space memory overhead O(V²) for dense adjacency matrix representations",
    "Cycle detection and path optimization are NP-hard for certain variants (Traveling Salesperson)",
  ],
  interviewQuestions: [
    {
      question: "When should you use BFS vs DFS in graph traversal?",
      answer:
        "Use BFS when finding the shortest path on unweighted graphs or exploring level-by-level (finds shortest hop path first). Use DFS when searching deep paths, detecting cycles in directed graphs, generating mazes, or computing topological sorts.",
    },
    {
      question: "How does Dijkstra's Algorithm compute single-source shortest paths on weighted graphs?",
      answer:
        "Initialize distances to infinity (source = 0) and use a Min Priority Queue. Extract node `u` with smallest distance, inspect neighbors `v`, and if `dist[u] + weight(u, v) < dist[v]`, update `dist[v]` and push `v` into the Min Heap. Repeat until heap is empty. Requires non-negative edge weights.",
    },
    {
      question: "What is Topological Sorting and what graph property is strictly required?",
      answer:
        "Topological Sort orders vertices in a Directed Acyclic Graph (DAG) such that for every directed edge `u -> v`, vertex `u` comes before `v`. It strictly requires a Directed Acyclic Graph (DAG); if a cycle exists, topological ordering is impossible.",
    },
    {
      question: "What is Disjoint Set Union (Union-Find) and how do path compression and rank optimization help?",
      answer:
        "Union-Find manages partitioned disjoint sets supporting `find(i)` and `union(i, j)`. Path compression flattens tree height during `find` lookups, and union-by-rank connects smaller trees under larger roots, achieving near O(1) amortized inverse Ackermann `O(α(N))` time.",
    },
  ],
  visualizerRoute: "/graph",
  visualizerLabel: "Launch Interactive Graph Visualizer",

  commonMistakes: [
    "Forgetting to mark nodes as `visited` when enqueuing in BFS, causing infinite loops on cyclic graphs",
    "Attempting to run Dijkstra's Algorithm on graphs containing negative edge weights (requires Bellman-Ford)",
    "Confusing directed graph cycle detection (requires 3-state coloring: unvisited, visiting, visited) with undirected graph cycle detection",
    "Executing topological sort on a graph containing directed cycles without detecting the deadlock cycle",
  ],

  projectIdeas: [
    "Interactive City Map Routing Engine: Build a WebGL navigation map running Dijkstra's and A* pathfinding algorithms across real road networks",
    "Package Dependency Resolver Engine: Create a build tool (mini npm) resolving dependency package graphs using Topological Sort",
    "Social Network Mutual Connection Finder: Build a LinkedIn-style degree of separation analyzer computing 1st, 2nd, and 3rd degree connections via BFS",
    "Maze Generation & Solver Visualizer: Implement Kruskal's algorithm (Union-Find) for maze generation and BFS/DFS for solving paths",
  ],

  youtubeVideos: [
    {
      id: "graph-yt-1",
      title: "Graph Algorithms BFS & DFS Explained",
      channel: "FreeCodeCamp",
      duration: "25 mins",
      url: "https://youtube.com/results?search_query=Graph+Algorithms+BFS+DFS+Tutorial+Visualized",
      description: "Visual guide to graph representations, BFS, DFS, and adjacency lists.",
    },
    {
      id: "graph-yt-2",
      title: "Dijkstra's Algorithm & Pathfinding",
      channel: "Computer Science Mastery",
      duration: "20 mins",
      url: "https://youtube.com/results?search_query=Dijkstra+Shortest+Path+Algorithm+Tutorial",
      description: "Step-by-step walkthrough of Dijkstra's algorithm with priority queues.",
    },
  ],

  detailedNotesHtml: `
    <div style="font-family: system-ui, sans-serif; line-height: 1.7; color: #CBD5E1;">
      <h2 style="color: #8B5CF6; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">1. Graph Representations: Adjacency List vs Matrix</h2>
      <p>Graphs are represented as Adjacency Lists (sparse networks) or Adjacency Matrices (dense networks):</p>

      <!-- Visual Diagram 1: Graph Representation Comparison -->
      <div style="background: #0B1120; border: 1px solid #7C3AED; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #34D399; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 1: Adjacency List (O(V+E) Space) vs Matrix (O(V²) Space)</div>
        <svg viewBox="0 0 540 180" style="width: 100%; max-width: 510px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <!-- Adjacency List -->
            <rect x="20" y="20" width="230" height="140" rx="6" fill="#1E1B4B" stroke="#8B5CF6"/>
            <text x="135" y="42" fill="#A78BFA" font-weight="bold">Adjacency List</text>
            <text x="135" y="68" fill="#FFF">0 → [ 1, 2 ]</text>
            <text x="135" y="92" fill="#FFF">1 → [ 0, 3 ]</text>
            <text x="135" y="116" fill="#FFF">2 → [ 0, 3 ]</text>
            <text x="135" y="140" fill="#FFF">3 → [ 1, 2 ]</text>

            <!-- Adjacency Matrix -->
            <rect x="290" y="20" width="230" height="140" rx="6" fill="#022C22" stroke="#10B981"/>
            <text x="405" y="42" fill="#34D399" font-weight="bold">Adjacency Matrix</text>
            <text x="405" y="68" fill="#A7F3D0">0 1 2 3</text>
            <text x="405" y="92" fill="#FFF">0 [0, 1, 1, 0]</text>
            <text x="405" y="116" fill="#FFF">1 [1, 0, 0, 1]</text>
            <text x="405" y="140" fill="#FFF">2 [1, 0, 0, 0]</text>
          </g>
        </svg>
      </div>

      <h2 style="color: #06B6D4; margin-top: 24px;">2. Dijkstra Shortest Path Step-by-Step Code Walkthrough</h2>
      <p>Dijkstra uses a Min Priority Queue to find shortest paths from a source node:</p>

      <pre style="background: #050816; border: 1px solid #1E293B; border-radius: 8px; padding: 14px; color: #34D399; font-family: monospace; font-size: 13px;">
function dijkstra(graph, source, numNodes) {
  let dist = new Array(numNodes).fill(Infinity);
  dist[source] = 0;
  
  let minHeap = new PriorityQueue((a, b) => a.dist - b.dist);
  minHeap.push({ node: source, dist: 0 });
  
  while (!minHeap.isEmpty()) {
    let { node, dist: d } = minHeap.pop();
    if (d > dist[node]) continue; // Skip stale entries
    
    for (let neighbor of graph[node]) {
      let newDist = dist[node] + neighbor.weight;
      if (newDist < dist[neighbor.node]) {
        dist[neighbor.node] = newDist;
        minHeap.push({ node: neighbor.node, dist: newDist });
      }
    }
  }
  return dist; // Array of shortest distances from source
}
      </pre>

      <h3 style="color: #F59E0B;">Step-by-Step Distance Array Updates:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px;">
        <thead>
          <tr style="background: #1E293B; color: #38BDF8;">
            <th style="padding: 8px; border: 1px solid #334155;">Step</th>
            <th style="padding: 8px; border: 1px solid #334155;">Extracted Node</th>
            <th style="padding: 8px; border: 1px solid #334155;">Edge Relaxations</th>
            <th style="padding: 8px; border: 1px solid #334155;">Distance Array dist[]</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">Initial</td>
            <td style="padding: 8px; border: 1px solid #334155;">None</td>
            <td style="padding: 8px; border: 1px solid #334155;">Source Node 0</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[0, ∞, ∞, ∞]</code></td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">1</td>
            <td style="padding: 8px; border: 1px solid #334155;">Node 0 (d=0)</td>
            <td style="padding: 8px; border: 1px solid #334155;">Relax (0->1, w=4), (0->2, w=2)</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[0, 4, 2, ∞]</code></td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">2</td>
            <td style="padding: 8px; border: 1px solid #334155;">Node 2 (d=2)</td>
            <td style="padding: 8px; border: 1px solid #334155;">Relax (2->1, w=1 -> dist=3), (2->3, w=7)</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[0, 3, 2, 9]</code></td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">3</td>
            <td style="padding: 8px; border: 1px solid #334155;">Node 1 (d=3)</td>
            <td style="padding: 8px; border: 1px solid #334155;">Relax (1->3, w=2 -> dist=5)</td>
            <td style="padding: 8px; border: 1px solid #334155;"><code>[0, 3, 2, 5]</code> (Shortest!)</td>
          </tr>
        </tbody>
      </table>

      <!-- Visual Diagram 2: Topological Sorting DAG -->
      <div style="background: #0B1120; border: 1px solid #06B6D4; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #22D3EE; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 2: Topological Ordering in Directed Acyclic Graph (DAG)</div>
        <svg viewBox="0 0 500 130" style="width: 100%; max-width: 460px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <circle cx="50" cy="65" r="16" fill="#1E1B4B" stroke="#06B6D4"/> <text x="50" y="69" fill="#FFF">CS101</text>
            <path d="M 66 65 L 140 65" stroke="#06B6D4" stroke-width="2" marker-end="url(#arrow)"/>

            <circle cx="160" cy="65" r="16" fill="#1E1B4B" stroke="#06B6D4"/> <text x="160" y="69" fill="#FFF">CS201</text>
            <path d="M 176 65 L 250 65" stroke="#06B6D4" stroke-width="2" marker-end="url(#arrow)"/>

            <circle cx="270" cy="65" r="16" fill="#1E1B4B" stroke="#06B6D4"/> <text x="270" y="69" fill="#FFF">CS301</text>
            <path d="M 286 65 L 360 65" stroke="#06B6D4" stroke-width="2" marker-end="url(#arrow)"/>

            <circle cx="380" cy="65" r="16" fill="#065F46" stroke="#34D399"/> <text x="380" y="69" fill="#FFF">GRAD</text>

            <text x="220" y="115" fill="#34D399" font-weight="bold">Valid Linear Prerequisite Order</text>
          </g>
        </svg>
      </div>

      <!-- Visual Diagram 3: Union Find Path Compression -->
      <div style="background: #0B1120; border: 1px solid #F59E0B; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #FBBF24; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 3: Disjoint Set Union (DSU) Path Compression</div>
        <svg viewBox="0 0 500 130" style="width: 100%; max-width: 460px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <text x="110" y="25" fill="#F43F5E">Tall Chain (O(N))</text>
            <circle cx="110" cy="45" r="12" fill="#312E81"/> <text x="110" y="49" fill="#FFF">0</text>
            <line x1="110" y1="57" x2="110" y2="73" stroke="#94A3B8"/>
            <circle cx="110" cy="85" r="12" fill="#312E81"/> <text x="110" y="89" fill="#FFF">1</text>
            <line x1="110" y1="97" x2="110" y2="113" stroke="#94A3B8"/>
            <circle cx="110" cy="122" r="12" fill="#312E81"/> <text x="110" y="126" fill="#FFF">2</text>

            <text x="250" y="70" fill="#34D399" font-weight="bold">→ Compress →</text>

            <text x="380" y="25" fill="#34D399">Flattened Tree (O(α(N)))</text>
            <circle cx="380" cy="50" r="12" fill="#065F46"/> <text x="380" y="54" fill="#FFF">0</text>
            <line x1="370" y1="60" x2="340" y2="95" stroke="#34D399"/>
            <line x1="390" y1="60" x2="420" y2="95" stroke="#34D399"/>
            <circle cx="340" cy="105" r="12" fill="#1E1B4B"/> <text x="340" y="109" fill="#FFF">1</text>
            <circle cx="420" cy="105" r="12" fill="#1E1B4B"/> <text x="420" y="109" fill="#FFF">2</text>
          </g>
        </svg>
      </div>
    </div>
  `,

  quiz: [
    {
      id: "grp-q1",
      question: "What is the time complexity of BFS or DFS graph traversal when using an Adjacency List?",
      options: ["O(V + E)", "O(V²)", "O(V * E)", "O(E log V)"],
      correctIndex: 0,
      explanation: "Adjacency lists visit every vertex (V) and every edge (E) once, taking O(V + E) time.",
    },
    {
      id: "grp-q2",
      question: "Which shortest path algorithm requires all edge weights to be non-negative?",
      options: ["Dijkstra's Algorithm", "Bellman-Ford Algorithm", "Floyd-Warshall Algorithm", "Breadth-First Search"],
      correctIndex: 0,
      explanation: "Dijkstra assumes adding edges strictly increases path weight; negative edges violate greedy choices.",
    },
    {
      id: "grp-q3",
      question: "What condition must a graph satisfy to permit a valid Topological Sort?",
      options: ["Must be a Directed Acyclic Graph (DAG)", "Must be undirected", "Must be complete", "Must be bipartite"],
      correctIndex: 0,
      explanation: "Topological sorting orders dependencies, which is impossible if directed cycles exist.",
    },
    {
      id: "grp-q4",
      question: "What does the Disjoint Set Union (Union-Find) algorithm achieve in near O(1) time?",
      options: ["Determining if two elements belong to the same connected component", "Finding shortest paths", "Sorting edge weights", "Computing matrix determinant"],
      correctIndex: 0,
      explanation: "Union-Find with path compression tests and merges connected component sets in O(α(N)) time.",
    },
    {
      id: "grp-q5",
      question: "What graph algorithm finds the minimum spanning tree of an undirected weighted graph using edges?",
      options: ["Kruskal's Algorithm", "Dijkstra's Algorithm", "Kahn's Algorithm", "Tarjan's Algorithm"],
      correctIndex: 0,
      explanation: "Kruskal's algorithm sorts edges by weight and adds them using Union-Find to build a Minimum Spanning Tree.",
    },
    {
      id: "grp-q6",
      question: "What is the space complexity of an Adjacency Matrix for a graph with V vertices?",
      options: ["O(V²)", "O(V + E)", "O(E)", "O(V log V)"],
      correctIndex: 0,
      explanation: "An Adjacency Matrix stores a V x V grid consuming O(V²) memory space regardless of edge counts.",
    },
    {
      id: "grp-q7",
      question: "How does BFS guarantee finding the shortest path in an UNWEIGHTED graph?",
      options: ["It explores nodes in increasing order of hop distance level-by-level", "It uses a priority queue", "It sorts edge weights", "It reverses paths"],
      correctIndex: 0,
      explanation: "Level-order FIFO traversal guarantees the first time a node is reached, it is via the fewest hops.",
    },
    {
      id: "grp-q8",
      question: "What graph representation is optimal for sparse graphs (where E << V²)?",
      options: ["Adjacency List", "Adjacency Matrix", "Incidence Matrix", "Flat Array"],
      correctIndex: 0,
      explanation: "Adjacency lists consume O(V + E) space, avoiding the O(V²) waste of sparse matrices.",
    },
    {
      id: "grp-q9",
      question: "What algorithm detects strongly connected components (SCC) in a directed graph?",
      options: ["Tarjan's / Kosaraju's Algorithm", "Dijkstra's Algorithm", "Prim's Algorithm", "Kruskal's Algorithm"],
      correctIndex: 0,
      explanation: "Tarjan's and Kosaraju's algorithms discover strongly connected components in O(V + E) time.",
    },
    {
      id: "grp-q10",
      question: "What is the time complexity of Bellman-Ford shortest path algorithm?",
      options: ["O(V * E)", "O(V + E)", "O(V log V)", "O(V³)"],
      correctIndex: 0,
      explanation: "Bellman-Ford relaxes all E edges V-1 times, resulting in O(V * E) runtime while supporting negative edge weights.",
    },
  ],

  practiceProblems: [
    {
      id: "grp-p1",
      title: "1. Number of Islands (BFS / DFS)",
      difficulty: "Medium",
      description: "Given an `m x n` 2D binary grid `grid` representing a map of '1's (land) and '0's (water), return the number of islands.",
      hints: ["Iterate through grid cells. When finding '1', increment island count and trigger BFS/DFS to mark connected land as '0'."],
      starterCode: `function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  let count = 0;
  let rows = grid.length, cols = grid[0].length;
  
  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') return;
    grid[r][c] = '0'; // Mark visited
    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
  }
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
      solutionExplanation: "DFS graph grid traversal visits every cell once in O(M * N) time.",
      testCases: [
        { input: [[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]], expected: 1 },
        { input: [[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]], expected: 3 },
      ],
    },
  ],
};

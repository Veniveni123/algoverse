export interface GraphDescription {
  about: string;
  best: string;
  average: string;
  worst: string;
  space: string;
  keypoints: string[];
}

export const graphDescriptions: Record<string, GraphDescription> = {
  BFS: {
    about:
      "Breadth-First Search (BFS) is a graph traversal algorithm that explores all neighbors at the current depth before moving to nodes at the next depth level. It uses a Queue (FIFO) internally. BFS is optimal for finding the shortest path in an unweighted graph.",
    best: "O(V+E)",
    average: "O(V+E)",
    worst: "O(V+E)",
    space: "O(V)",
    keypoints: [
      "Uses a Queue (FIFO) to track which nodes to visit next.",
      "Visits all neighbors at the current depth before going deeper.",
      "Guarantees shortest path in an unweighted graph.",
      "Time complexity is O(V + E) where V = vertices and E = edges.",
      "Space complexity is O(V) for the queue and visited set.",
      "Commonly used in social network friend suggestions and level-order tree traversals.",
      "Not suitable for weighted graphs — use Dijkstra's for weighted shortest path.",
    ],
  },
  DFS: {
    about:
      "Depth-First Search (DFS) is a graph traversal algorithm that explores as far as possible along each branch before backtracking. It uses a Stack (or recursion) internally. DFS is widely used for topological sorting, cycle detection, and connected component analysis.",
    best: "O(V+E)",
    average: "O(V+E)",
    worst: "O(V+E)",
    space: "O(V)",
    keypoints: [
      "Uses a Stack (or function call stack via recursion) to track traversal.",
      "Explores one path as deeply as possible before backtracking.",
      "Does NOT guarantee shortest path like BFS.",
      "Useful for cycle detection in directed and undirected graphs.",
      "Used in topological sorting of DAGs (Directed Acyclic Graphs).",
      "Can detect connected components in undirected graphs.",
      "Recursive DFS may hit stack overflow for very deep graphs; iterative DFS is safer.",
    ],
  },
  "Graph Representation": {
    about:
      "Graphs can be represented in two main ways: Adjacency List and Adjacency Matrix. An Adjacency List stores a list of neighbors per vertex — efficient for sparse graphs. An Adjacency Matrix stores a V×V boolean matrix — efficient for dense graphs and O(1) edge lookup.",
    best: "O(1)",
    average: "O(V+E)",
    worst: "O(V²)",
    space: "O(V+E)",
    keypoints: [
      "Adjacency List: Space O(V + E), best for sparse graphs.",
      "Adjacency Matrix: Space O(V²), best for dense graphs.",
      "Adjacency List — checking if an edge exists takes O(degree) time.",
      "Adjacency Matrix — checking if an edge exists takes O(1) time.",
      "Most real-world graphs (social networks, maps) are sparse — adjacency list preferred.",
      "Directed graphs distinguish between in-edges and out-edges for each vertex.",
      "Weighted graphs store edge weights alongside the neighbor reference.",
    ],
  },
};

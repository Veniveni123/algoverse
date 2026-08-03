// ─────────────────────────────────────────────
//  Shared Step type for the graph visualizer
// ─────────────────────────────────────────────
export interface GraphStep {
  // Which nodes are "current" / being processed
  activeNodes: number[];
  // Which nodes have been fully visited
  visitedNodes: number[];
  // Which edges are "active" right now (being traversed)
  activeEdges: [number, number][];
  // Which edges have been explored
  visitedEdges: [number, number][];
  // Optional queue or stack snapshot
  queueOrStack: number[];
  // Human-readable message
  message: string;
}

// ─────────────────────────────────────────────
//  Fixed demo graph (6 nodes, 0-indexed)
//  Edges: 0-1, 0-2, 1-3, 1-4, 2-5
// ─────────────────────────────────────────────
export const DEMO_GRAPH: Record<number, number[]> = {
  0: [1, 2],
  1: [0, 3, 4],
  2: [0, 5],
  3: [1],
  4: [1],
  5: [2],
};

// Fixed layout coordinates for 6 nodes (for SVG rendering)
export const NODE_POSITIONS: Record<number, { x: number; y: number }> = {
  0: { x: 160, y: 40 },
  1: { x: 80, y: 130 },
  2: { x: 240, y: 130 },
  3: { x: 30, y: 220 },
  4: { x: 130, y: 220 },
  5: { x: 240, y: 220 },
};

// ─────────────────────────────────────────────
//  BFS  (generates step-by-step animation)
// ─────────────────────────────────────────────
export function generateBFSSteps(
  graph: Record<number, number[]>,
  start: number
): GraphStep[] {
  const steps: GraphStep[] = [];
  const visited = new Set<number>();
  const queue: number[] = [start];
  visited.add(start);
  const visitedNodes: number[] = [];
  const visitedEdges: [number, number][] = [];

  steps.push({
    activeNodes: [start],
    visitedNodes: [],
    activeEdges: [],
    visitedEdges: [],
    queueOrStack: [...queue],
    message: `BFS starts at node ${start}. Adding it to the queue.`,
  });

  while (queue.length > 0) {
    const node = queue.shift()!;
    visitedNodes.push(node);

    steps.push({
      activeNodes: [node],
      visitedNodes: [...visitedNodes],
      activeEdges: [],
      visitedEdges: [...visitedEdges],
      queueOrStack: [...queue],
      message: `Dequeued node ${node}. Marking it as visited.`,
    });

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        visitedEdges.push([node, neighbor]);

        steps.push({
          activeNodes: [node, neighbor],
          visitedNodes: [...visitedNodes],
          activeEdges: [[node, neighbor]],
          visitedEdges: [...visitedEdges],
          queueOrStack: [...queue],
          message: `Exploring edge ${node} → ${neighbor}. Node ${neighbor} is unvisited — enqueueing it.`,
        });
      } else {
        steps.push({
          activeNodes: [node, neighbor],
          visitedNodes: [...visitedNodes],
          activeEdges: [[node, neighbor]],
          visitedEdges: [...visitedEdges],
          queueOrStack: [...queue],
          message: `Edge ${node} → ${neighbor}: Node ${neighbor} already visited. Skipping.`,
        });
      }
    }
  }

  steps.push({
    activeNodes: [],
    visitedNodes: [...visitedNodes],
    activeEdges: [],
    visitedEdges: [...visitedEdges],
    queueOrStack: [],
    message: `BFS complete! Traversal order: ${visitedNodes.join(" → ")}`,
  });

  return steps;
}

// ─────────────────────────────────────────────
//  DFS  (generates step-by-step animation)
// ─────────────────────────────────────────────
export function generateDFSSteps(
  graph: Record<number, number[]>,
  start: number
): GraphStep[] {
  const steps: GraphStep[] = [];
  const visited = new Set<number>();
  const stack: number[] = [start];
  const visitedNodes: number[] = [];
  const visitedEdges: [number, number][] = [];

  steps.push({
    activeNodes: [start],
    visitedNodes: [],
    activeEdges: [],
    visitedEdges: [],
    queueOrStack: [...stack],
    message: `DFS starts at node ${start}. Pushing it onto the stack.`,
  });

  while (stack.length > 0) {
    const node = stack.pop()!;

    if (visited.has(node)) {
      steps.push({
        activeNodes: [node],
        visitedNodes: [...visitedNodes],
        activeEdges: [],
        visitedEdges: [...visitedEdges],
        queueOrStack: [...stack],
        message: `Popped node ${node} — already visited. Skipping.`,
      });
      continue;
    }

    visited.add(node);
    visitedNodes.push(node);

    steps.push({
      activeNodes: [node],
      visitedNodes: [...visitedNodes],
      activeEdges: [],
      visitedEdges: [...visitedEdges],
      queueOrStack: [...stack],
      message: `Popped node ${node}. Marking it as visited.`,
    });

    // Push neighbors in reverse order so left-first is processed
    const neighbors = [...graph[node]].reverse();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        visitedEdges.push([node, neighbor]);

        steps.push({
          activeNodes: [node, neighbor],
          visitedNodes: [...visitedNodes],
          activeEdges: [[node, neighbor]],
          visitedEdges: [...visitedEdges],
          queueOrStack: [...stack],
          message: `Node ${node}: Pushing unvisited neighbor ${neighbor} onto the stack.`,
        });
      }
    }
  }

  steps.push({
    activeNodes: [],
    visitedNodes: [...visitedNodes],
    activeEdges: [],
    visitedEdges: [...visitedEdges],
    queueOrStack: [],
    message: `DFS complete! Traversal order: ${visitedNodes.join(" → ")}`,
  });

  return steps;
}

// ─────────────────────────────────────────────
//  Graph Representation steps (static walkthrough)
// ─────────────────────────────────────────────
export function generateGraphRepresentationSteps(
  graph: Record<number, number[]>
): GraphStep[] {
  const nodes = Object.keys(graph).map(Number);
  const steps: GraphStep[] = [];

  steps.push({
    activeNodes: [],
    visitedNodes: [],
    activeEdges: [],
    visitedEdges: [],
    queueOrStack: [],
    message: "Graph Representation: This is an undirected graph with 6 nodes and 5 edges.",
  });

  // Show adjacency list one node at a time
  for (const node of nodes) {
    const nbrs = graph[node];
    steps.push({
      activeNodes: [node],
      visitedNodes: [],
      activeEdges: nbrs.map((nb) => [node, nb] as [number, number]),
      visitedEdges: [],
      queueOrStack: nbrs,
      message: `Adjacency List — Node ${node}: neighbors are [${nbrs.join(", ")}]`,
    });
  }

  // Highlight all edges for matrix view
  const allEdges: [number, number][] = [];
  for (const node of nodes) {
    for (const nb of graph[node]) {
      if (node < nb) allEdges.push([node, nb]);
    }
  }
  steps.push({
    activeNodes: nodes,
    visitedNodes: [],
    activeEdges: [],
    visitedEdges: allEdges,
    queueOrStack: [],
    message: `Adjacency Matrix: A ${nodes.length}×${nodes.length} matrix where matrix[u][v]=1 if an edge exists between u and v.`,
  });

  steps.push({
    activeNodes: [],
    visitedNodes: nodes,
    activeEdges: [],
    visitedEdges: allEdges,
    queueOrStack: [],
    message: "Graph walkthrough complete! Adjacency List is space-efficient (O(V+E)), while Adjacency Matrix enables O(1) edge lookup.",
  });

  return steps;
}

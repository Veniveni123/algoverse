export const graphCodeSnippets: Record<
  string,
  { python: string; java: string; cpp: string }
> = {
  BFS: {
    python: `from collections import deque

def bfs(graph: dict, start: int) -> list:
    """
    Breadth-First Search
    graph: adjacency list {node: [neighbors]}
    Returns traversal order
    """
    visited = set()
    queue = deque([start])
    visited.add(start)
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order

# Example usage
graph = {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 5],
    3: [1],
    4: [1],
    5: [2]
}
print(bfs(graph, 0))  # [0, 1, 2, 3, 4, 5]`,

    java: `import java.util.*;

public class BFS {
    public static List<Integer> bfs(
        Map<Integer, List<Integer>> graph,
        int start
    ) {
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new LinkedList<>();
        List<Integer> order = new ArrayList<>();

        queue.offer(start);
        visited.add(start);

        while (!queue.isEmpty()) {
            int node = queue.poll();
            order.add(node);

            for (int neighbor : graph.getOrDefault(node, List.of())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(neighbor);
                }
            }
        }
        return order;
    }

    public static void main(String[] args) {
        Map<Integer, List<Integer>> graph = new HashMap<>();
        graph.put(0, Arrays.asList(1, 2));
        graph.put(1, Arrays.asList(0, 3, 4));
        graph.put(2, Arrays.asList(0, 5));
        graph.put(3, List.of(1));
        graph.put(4, List.of(1));
        graph.put(5, List.of(2));
        System.out.println(bfs(graph, 0));
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <unordered_set>
using namespace std;

vector<int> bfs(
    const vector<vector<int>>& graph,
    int start
) {
    unordered_set<int> visited;
    queue<int> q;
    vector<int> order;

    q.push(start);
    visited.insert(start);

    while (!q.empty()) {
        int node = q.front();
        q.pop();
        order.push_back(node);

        for (int neighbor : graph[node]) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
    return order;
}

int main() {
    vector<vector<int>> graph = {
        {1, 2},    // 0
        {0, 3, 4}, // 1
        {0, 5},    // 2
        {1},       // 3
        {1},       // 4
        {2}        // 5
    };
    auto result = bfs(graph, 0);
    for (int v : result) cout << v << " ";
}`,
  },

  DFS: {
    python: `def dfs(graph: dict, start: int) -> list:
    """
    Depth-First Search (iterative)
    graph: adjacency list {node: [neighbors]}
    Returns traversal order
    """
    visited = set()
    stack = [start]
    order = []

    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            order.append(node)
            # Add neighbors in reverse so left is visited first
            for neighbor in reversed(graph[node]):
                if neighbor not in visited:
                    stack.append(neighbor)

    return order

# Recursive version
def dfs_recursive(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    result = [node]
    for neighbor in graph[node]:
        if neighbor not in visited:
            result += dfs_recursive(graph, neighbor, visited)
    return result

# Example
graph = {0: [1,2], 1: [0,3,4], 2: [0,5], 3:[1], 4:[1], 5:[2]}
print(dfs(graph, 0))  # [0, 1, 3, 4, 2, 5]`,

    java: `import java.util.*;

public class DFS {
    public static List<Integer> dfs(
        Map<Integer, List<Integer>> graph,
        int start
    ) {
        Set<Integer> visited = new HashSet<>();
        Deque<Integer> stack = new ArrayDeque<>();
        List<Integer> order = new ArrayList<>();

        stack.push(start);

        while (!stack.isEmpty()) {
            int node = stack.pop();
            if (!visited.contains(node)) {
                visited.add(node);
                order.add(node);
                List<Integer> neighbors =
                    graph.getOrDefault(node, List.of());
                // Reverse to maintain left-first order
                for (int i = neighbors.size() - 1; i >= 0; i--) {
                    if (!visited.contains(neighbors.get(i)))
                        stack.push(neighbors.get(i));
                }
            }
        }
        return order;
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <stack>
#include <unordered_set>
using namespace std;

vector<int> dfs(
    const vector<vector<int>>& graph,
    int start
) {
    unordered_set<int> visited;
    stack<int> stk;
    vector<int> order;

    stk.push(start);

    while (!stk.empty()) {
        int node = stk.top();
        stk.pop();
        if (visited.count(node)) continue;

        visited.insert(node);
        order.push_back(node);

        // Reverse to visit left-first
        for (int i = graph[node].size()-1; i >= 0; i--) {
            int nb = graph[node][i];
            if (!visited.count(nb))
                stk.push(nb);
        }
    }
    return order;
}

int main() {
    vector<vector<int>> graph = {
        {1,2},{0,3,4},{0,5},{1},{1},{2}
    };
    for (int v : dfs(graph, 0)) cout << v << " ";
}`,
  },

  "Graph Representation": {
    python: `# ── Adjacency List ──
class GraphAdjList:
    def __init__(self):
        self.adj = {}

    def add_vertex(self, v):
        if v not in self.adj:
            self.adj[v] = []

    def add_edge(self, u, v):
        self.adj[u].append(v)
        self.adj[v].append(u)  # undirected

    def print_graph(self):
        for v, neighbors in self.adj.items():
            print(f"{v} -> {neighbors}")

# ── Adjacency Matrix ──
class GraphAdjMatrix:
    def __init__(self, num_vertices):
        self.V = num_vertices
        self.matrix = [[0]*num_vertices
                       for _ in range(num_vertices)]

    def add_edge(self, u, v):
        self.matrix[u][v] = 1
        self.matrix[v][u] = 1  # undirected

    def has_edge(self, u, v) -> bool:
        return self.matrix[u][v] == 1

# Demo
g = GraphAdjList()
for v in range(6): g.add_vertex(v)
for u, v in [(0,1),(0,2),(1,3),(1,4),(2,5)]:
    g.add_edge(u, v)
g.print_graph()`,

    java: `import java.util.*;

// ── Adjacency List ──
class GraphAdjList {
    private Map<Integer, List<Integer>> adj = new HashMap<>();

    public void addVertex(int v) {
        adj.putIfAbsent(v, new ArrayList<>());
    }

    public void addEdge(int u, int v) {
        adj.get(u).add(v);
        adj.get(v).add(u); // undirected
    }

    public List<Integer> neighbors(int v) {
        return adj.getOrDefault(v, List.of());
    }
}

// ── Adjacency Matrix ──
class GraphAdjMatrix {
    private int[][] matrix;
    private int V;

    GraphAdjMatrix(int v) {
        V = v;
        matrix = new int[v][v];
    }

    void addEdge(int u, int v) {
        matrix[u][v] = 1;
        matrix[v][u] = 1; // undirected
    }

    boolean hasEdge(int u, int v) {
        return matrix[u][v] == 1;
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

// ── Adjacency List ──
class GraphAdjList {
public:
    unordered_map<int, vector<int>> adj;

    void addEdge(int u, int v) {
        adj[u].push_back(v);
        adj[v].push_back(u); // undirected
    }

    void printGraph() {
        for (auto& [v, neighbors] : adj) {
            cout << v << " -> ";
            for (int nb : neighbors)
                cout << nb << " ";
            cout << "\\n";
        }
    }
};

// ── Adjacency Matrix ──
class GraphAdjMatrix {
    int V;
    vector<vector<int>> mat;
public:
    GraphAdjMatrix(int v) : V(v), mat(v, vector<int>(v, 0)) {}

    void addEdge(int u, int v) {
        mat[u][v] = mat[v][u] = 1;
    }

    bool hasEdge(int u, int v) {
        return mat[u][v] == 1;
    }
};

int main() {
    GraphAdjList g;
    g.addEdge(0,1); g.addEdge(0,2);
    g.addEdge(1,3); g.addEdge(1,4);
    g.addEdge(2,5);
    g.printGraph();
}`,
  },
};

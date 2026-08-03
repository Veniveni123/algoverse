// ─────────────────────────────────────────────────────────────
//  Dynamic Output Computer — runs real JS algorithms on user
//  input and returns terminal-style formatted output strings.
// ─────────────────────────────────────────────────────────────

export function computeSortingOutput(algo: string, arr: number[]): string {
  const input = `[${arr.join(", ")}]`;
  const a = [...arr];

  if (algo === "Bubble Sort") {
    let comps = 0, swaps = 0;
    for (let i = 0; i < a.length - 1; i++)
      for (let j = 0; j < a.length - i - 1; j++) {
        comps++;
        if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swaps++; }
      }
    return `Input:   ${input}\nSorted:  [${a.join(", ")}]\nStats:   ${comps} comparisons, ${swaps} swaps`;
  }
  if (algo === "Selection Sort") {
    let swaps = 0;
    for (let i = 0; i < a.length - 1; i++) {
      let min = i;
      for (let j = i + 1; j < a.length; j++) if (a[j] < a[min]) min = j;
      if (min !== i) { [a[i], a[min]] = [a[min], a[i]]; swaps++; }
    }
    return `Input:   ${input}\nSorted:  [${a.join(", ")}]\nStats:   ${swaps} swaps (always n-1 passes)`;
  }
  if (algo === "Insertion Sort") {
    let shifts = 0;
    for (let i = 1; i < a.length; i++) {
      const key = a[i]; let j = i - 1;
      while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; shifts++; }
      a[j + 1] = key;
    }
    return `Input:   ${input}\nSorted:  [${a.join(", ")}]\nStats:   ${shifts} element shifts`;
  }
  // Merge Sort & Quick Sort — just show sorted output
  a.sort((x, y) => x - y);
  return `Input:   ${input}\nSorted:  [${a.join(", ")}]\nMethod:  Divide & Conquer (O(n log n))`;
}

export function computeSearchingOutput(
  algo: string, arr: number[], target: number
): string {
  if (algo === "Binary Search") {
    const sorted = [...arr].sort((a, b) => a - b);
    let lo = 0, hi = sorted.length - 1, steps = 0;
    while (lo <= hi) {
      steps++;
      const mid = Math.floor((lo + hi) / 2);
      if (sorted[mid] === target)
        return `Input:   arr=[${sorted.join(", ")}], target=${target}\nResult:  ✅ Found ${target} at index ${mid}\nSteps:   ${steps} comparisons (Binary Search)`;
      else if (sorted[mid] < target) lo = mid + 1;
      else hi = mid - 1;
    }
    return `Input:   arr=[${sorted.join(", ")}], target=${target}\nResult:  ❌ ${target} not found in array\nSteps:   ${steps} comparisons`;
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target)
      return `Input:   arr=[${arr.join(", ")}], target=${target}\nResult:  ✅ Found ${target} at index ${i}\nSteps:   ${i + 1} comparisons (Linear Search)`;
  }
  return `Input:   arr=[${arr.join(", ")}], target=${target}\nResult:  ❌ ${target} not found in array\nSteps:   ${arr.length} comparisons`;
}

export function computeArrayOutput(algo: string, arr: number[]): string {
  if (algo === "Array Traversal") {
    const lines = arr.map((v, i) => `  index[${i}] = ${v}`).join("\n");
    return `Input:   [${arr.join(", ")}]\nTraversal:\n${lines}\nLength:  ${arr.length} elements`;
  }
  if (algo === "Array Insertion") {
    const newArr = [...arr];
    const val = Math.floor(Math.random() * 50) + 10;
    const pos = Math.floor(arr.length / 2);
    newArr.splice(pos, 0, val);
    return `Input:   [${arr.join(", ")}]\nInsert:  value=${val} at index=${pos}\nResult:  [${newArr.join(", ")}]\nSize:    ${arr.length} → ${newArr.length}`;
  }
  if (algo === "Array Deletion") {
    const newArr = [...arr];
    const pos = Math.floor(arr.length / 2);
    const removed = newArr.splice(pos, 1)[0];
    return `Input:   [${arr.join(", ")}]\nDelete:  index=${pos} (value=${removed})\nResult:  [${newArr.join(", ")}]\nSize:    ${arr.length} → ${newArr.length}`;
  }
  // Array Searching
  const target = arr[Math.floor(arr.length / 2)];
  const idx = arr.indexOf(target);
  return `Input:   [${arr.join(", ")}], target=${target}\nResult:  Found ${target} at index ${idx}\nMethod:  Linear scan, ${idx + 1} comparisons`;
}

export function computeStackOutput(algo: string, stack: number[]): string {
  const s = [...stack];
  if (algo === "Push Operation") {
    const val = 42;
    s.push(val);
    return `Initial: [${stack.join(", ")}] (top→right)\nPush:    ${val}\nResult:  [${s.join(", ")}]\nTop:     ${s[s.length - 1]}`;
  }
  if (algo === "Pop Operation") {
    if (s.length === 0) return `Stack is empty!\nResult:  Stack Underflow ❌`;
    const popped = s.pop();
    return `Initial: [${stack.join(", ")}] (top→right)\nPop:     ${popped} removed\nResult:  [${s.join(", ")}]\nTop:     ${s.length > 0 ? s[s.length - 1] : "null (empty)"}`;
  }
  if (algo === "Peek Operation") {
    if (s.length === 0) return `Stack is empty!\nPeek:    returns null`;
    return `Initial: [${stack.join(", ")}] (top→right)\nPeek:    ${s[s.length - 1]} (no removal)\nStack:   unchanged [${s.join(", ")}]`;
  }
  // Stack Applications
  const expr = "({[]})";
  const res = (() => {
    const stk: string[] = [];
    const map: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
    for (const c of expr) {
      if ("([{".includes(c)) stk.push(c);
      else if (stk.pop() !== map[c]) return false;
    }
    return stk.length === 0;
  })();
  return `Expression: "${expr}"\nStack Trace: push (, push {, push [, match ], match }, match )\nResult:  ${res ? "✅ Balanced!" : "❌ Unbalanced!"}\nStack:   empty at end`;
}

export function computeQueueOutput(algo: string, queue: number[]): string {
  const q = [...queue];
  if (algo === "Enqueue Operation") {
    const val = 55;
    q.push(val);
    return `Initial: [${queue.join(", ")}] (front→left)\nEnqueue: ${val} added at Rear\nResult:  [${q.join(", ")}]\nFront:   ${q[0]}, Rear: ${q[q.length - 1]}`;
  }
  if (algo === "Dequeue Operation") {
    if (q.length === 0) return `Queue is empty!\nResult:  Queue Underflow ❌`;
    const deq = q.shift();
    return `Initial: [${queue.join(", ")}] (front→left)\nDequeue: ${deq} removed from Front\nResult:  [${q.join(", ")}]\nNew Front: ${q.length > 0 ? q[0] : "null (empty)"}`;
  }
  if (algo === "Circular Queue") {
    return `Capacity: 6 slots\nInitial:  [${queue.slice(0, 4).join(", ")}, _, _]\nEnqueue:  77 → Rear moves circularly\nDequeue:  Front advances\nWrap:     Rear = (Rear+1) % 6\nResult:   Circular wrap prevents wasted space`;
  }
  return `Initial: [${queue.join(", ")}]\nDeque allows:\n  Insert Front: O(1)\n  Insert Rear:  O(1)\n  Delete Front: O(1)\n  Delete Rear:  O(1)\nResult:  Double-ended flexibility`;
}

export function computeLinkedListOutput(algo: string, values: number[]): string {
  const arrow = values.join(" → ");
  if (algo === "Singly Linked List") {
    return `Nodes:   ${values.length}\nList:    ${arrow} → null\nInsert Head: new_node.next = head\nInsert Tail: traverse to end, tail.next = new_node\nDelete:  prev.next = target.next`;
  }
  if (algo === "Doubly Linked List") {
    return `Nodes:   ${values.length}\nForward:  null ← ${arrow} → null\nBackward: null ← ${[...values].reverse().join(" ← ")} → null\nInsert:  O(1) with prev & next pointers\nDelete:  No traversal needed for known node`;
  }
  return `Circular: ${arrow} → (back to ${values[0]})\nTraversal stops when we return to head\nUse case: Round-robin scheduling, playlists`;
}

export function computeTreeOutput(algo: string, tree: number[]): string {
  const nodes = tree.filter(v => v !== 0);
  const inorder: number[] = [];
  const traverse = (i: number) => {
    if (i >= 7 || tree[i] === 0) return;
    traverse(2 * i + 1);
    inorder.push(tree[i]);
    traverse(2 * i + 2);
  };
  traverse(0);

  const preorder: number[] = [];
  const pre = (i: number) => {
    if (i >= 7 || tree[i] === 0) return;
    preorder.push(tree[i]);
    pre(2 * i + 1);
    pre(2 * i + 2);
  };
  pre(0);

  if (algo === "Binary Search Tree (BST)") {
    return `Nodes:    [${nodes.join(", ")}]\nRoot:     ${tree[0] || "empty"}\nInorder:  [${inorder.join(", ")}]  ← always sorted!\nPreorder: [${preorder.join(", ")}]\nBST Rule: left < root < right`;
  }
  if (algo === "Inorder Traversal")
    return `Tree:     [${nodes.join(", ")}]\nInorder:  [${inorder.join(" → ")}]\nProperty: Inorder of BST = Sorted array`;
  if (algo === "Preorder Traversal")
    return `Tree:     [${nodes.join(", ")}]\nPreorder: [${preorder.join(" → ")}]\nProperty: Root is always visited first`;

  const postorder: number[] = [];
  const post = (i: number) => {
    if (i >= 7 || tree[i] === 0) return;
    post(2 * i + 1); post(2 * i + 2);
    postorder.push(tree[i]);
  };
  post(0);
  return `Tree:      [${nodes.join(", ")}]\nPostorder: [${postorder.join(" → ")}]\nProperty:  Root is always visited last`;
}

export function computeGraphOutput(algo: string, startNode: number): string {
  const graph: Record<number, number[]> = {
    0: [1, 2], 1: [0, 3, 4], 2: [0, 5], 3: [1], 4: [1], 5: [2]
  };
  if (algo === "BFS") {
    const visited: number[] = [];
    const queue = [startNode];
    const seen = new Set([startNode]);
    while (queue.length) {
      const n = queue.shift()!;
      visited.push(n);
      for (const nb of graph[n]) {
        if (!seen.has(nb)) { seen.add(nb); queue.push(nb); }
      }
    }
    return `Start:   Node ${startNode}\nQueue:   FIFO — explores level by level\nOrder:   ${visited.join(" → ")}\nVisited: ${visited.length} / ${Object.keys(graph).length} nodes\nShortest path guaranteed ✅`;
  }
  if (algo === "DFS") {
    const visited: number[] = [];
    const seen = new Set<number>();
    const stack = [startNode];
    while (stack.length) {
      const n = stack.pop()!;
      if (seen.has(n)) continue;
      seen.add(n); visited.push(n);
      for (const nb of [...graph[n]].reverse())
        if (!seen.has(nb)) stack.push(nb);
    }
    return `Start:   Node ${startNode}\nStack:   LIFO — explores depth first\nOrder:   ${visited.join(" → ")}\nVisited: ${visited.length} / ${Object.keys(graph).length} nodes\nUseful for: cycle detection, topological sort`;
  }
  return `Graph has 6 nodes, 5 edges\nAdjacency List:\n  0: [1, 2]\n  1: [0, 3, 4]\n  2: [0, 5]\n  3: [1]\n  4: [1]\n  5: [2]\nMatrix: 6×6 grid, 10 cells = 1 (symmetric)`;
}

export type Step = {
  array?: number[];
  activeIndices?: number[];
  swappedIndices?: number[];
  pointers?: Record<string, number>;
  message?: string;
};

// Tree is represented as a level-order array of size 15 (depth 4):
// Index 0: Root
// Level 1: Index 1, 2
// Level 2: Index 3, 4, 5, 6
// Level 3: Index 7, 8, 9, 10, 11, 12, 13, 14
// Value 0 indicates an empty slot.

export const generateBSTInsertSteps = (initialTree: number[], value: number): Step[] => {
  const steps: Step[] = [];
  const tree = [...initialTree];
  while (tree.length < 15) {
    tree.push(0);
  }

  steps.push({
    array: [...tree],
    activeIndices: [],
    pointers: {},
    message: `BST Insert: Preparing to insert value ${value} into the Binary Search Tree.`
  });

  let curr = 0;
  
  while (curr < 15) {
    if (tree[curr] === 0) {
      // Empty slot found, insert
      tree[curr] = value;
      
      steps.push({
        array: [...tree],
        activeIndices: [curr],
        swappedIndices: [curr],
        pointers: { insert: curr },
        message: `✅ Found empty slot at index ${curr}. Inserted value ${value}.`
      });
      break;
    }

    steps.push({
      array: [...tree],
      activeIndices: [curr],
      pointers: { check: curr },
      message: `Comparing ${value} with node ${tree[curr]} at index ${curr}.`
    });

    if (value < tree[curr]) {
      const next = 2 * curr + 1;
      steps.push({
        array: [...tree],
        activeIndices: [curr],
        pointers: { check: curr },
        message: `${value} < ${tree[curr]}. Going to Left child: index ${next}.`
      });
      curr = next;
    } else if (value > tree[curr]) {
      const next = 2 * curr + 2;
      steps.push({
        array: [...tree],
        activeIndices: [curr],
        pointers: { check: curr },
        message: `${value} > ${tree[curr]}. Going to Right child: index ${next}.`
      });
      curr = next;
    } else {
      // Duplicate
      steps.push({
        array: [...tree],
        activeIndices: [curr],
        pointers: { check: curr },
        message: `Value ${value} already exists in the tree. Duplicates are not allowed in this BST.`
      });
      break;
    }
  }

  if (curr >= 15) {
    steps.push({
      array: [...initialTree],
      activeIndices: [],
      pointers: {},
      message: "❌ Tree Capacity Limit! Tree max depth of 4 levels (15 nodes) reached."
    });
  }

  return steps;
};

export const generateBSTSearchSteps = (initialTree: number[], target: number): Step[] => {
  const steps: Step[] = [];
  const tree = [...initialTree];
  while (tree.length < 15) {
    tree.push(0);
  }

  steps.push({
    array: [...tree],
    activeIndices: [],
    pointers: {},
    message: `BST Search: Searching for target value ${target} in the BST.`
  });

  let curr = 0;
  let found = false;

  while (curr < 15 && tree[curr] !== 0) {
    steps.push({
      array: [...tree],
      activeIndices: [curr],
      pointers: { check: curr },
      message: `Comparing target ${target} with node ${tree[curr]} at index ${curr}.`
    });

    if (tree[curr] === target) {
      found = true;
      steps.push({
        array: [...tree],
        activeIndices: [curr],
        swappedIndices: [curr], // Highlight green
        pointers: { found: curr },
        message: `🎯 Target ${target} found at index ${curr}!`
      });
      break;
    } else if (target < tree[curr]) {
      const next = 2 * curr + 1;
      steps.push({
        array: [...tree],
        activeIndices: [curr],
        pointers: { check: curr },
        message: `${target} < ${tree[curr]}. Searching in left subtree: index ${next}.`
      });
      curr = next;
    } else {
      const next = 2 * curr + 2;
      steps.push({
        array: [...tree],
        activeIndices: [curr],
        pointers: { check: curr },
        message: `${target} > ${tree[curr]}. Searching in right subtree: index ${next}.`
      });
      curr = next;
    }
  }

  if (!found) {
    steps.push({
      array: [...tree],
      activeIndices: [],
      pointers: {},
      message: `❌ Target ${target} was not found in the BST.`
    });
  }

  return steps;
};

export const generateTreeTraversalSteps = (
  initialTree: number[],
  traversalType: "inorder" | "preorder" | "postorder"
): Step[] => {
  const steps: Step[] = [];
  const tree = [...initialTree];
  while (tree.length < 15) {
    tree.push(0);
  }

  steps.push({
    array: [...tree],
    activeIndices: [],
    pointers: {},
    message: `Starting ${traversalType.toUpperCase()} traversal (depth-first).`
  });

  const visitedValues: number[] = [];

  const traverse = (idx: number) => {
    if (idx >= 15 || tree[idx] === 0) return;

    if (traversalType === "preorder") {
      visitedValues.push(tree[idx]);
      steps.push({
        array: [...tree],
        activeIndices: [idx],
        pointers: { curr: idx },
        message: `[Preorder] Visit Root node: ${tree[idx]}. Traversed so far: [${visitedValues.join(", ")}].`
      });
      traverse(2 * idx + 1); // Left
      traverse(2 * idx + 2); // Right
    } else if (traversalType === "inorder") {
      steps.push({
        array: [...tree],
        activeIndices: [idx],
        pointers: { curr: idx },
        message: `[Inorder] Trailing to left subtree of ${tree[idx]}.`
      });
      traverse(2 * idx + 1); // Left
      
      visitedValues.push(tree[idx]);
      steps.push({
        array: [...tree],
        activeIndices: [idx],
        pointers: { curr: idx },
        message: `[Inorder] Visit Root node: ${tree[idx]}. Traversed so far: [${visitedValues.join(", ")}].`
      });
      
      traverse(2 * idx + 2); // Right
    } else if (traversalType === "postorder") {
      steps.push({
        array: [...tree],
        activeIndices: [idx],
        pointers: { curr: idx },
        message: `[Postorder] Trailing to subtrees of ${tree[idx]}.`
      });
      traverse(2 * idx + 1); // Left
      traverse(2 * idx + 2); // Right
      
      visitedValues.push(tree[idx]);
      steps.push({
        array: [...tree],
        activeIndices: [idx],
        pointers: { curr: idx },
        message: `[Postorder] Visit Root node: ${tree[idx]}. Traversed so far: [${visitedValues.join(", ")}].`
      });
    }
  };

  traverse(0);

  steps.push({
    array: [...tree],
    activeIndices: [],
    pointers: {},
    message: `✅ Traversal complete! Visited nodes sequence: [${visitedValues.join(" → ")}].`
  });

  return steps;
};

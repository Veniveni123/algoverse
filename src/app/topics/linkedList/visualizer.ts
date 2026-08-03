export type Step = {
  array?: number[];
  activeIndices?: number[];
  swappedIndices?: number[];
  pointers?: Record<string, number>;
  message?: string;
};

export const generateListTraversalSteps = (initialList: number[]): Step[] => {
  const steps: Step[] = [];
  const list = [...initialList];

  steps.push({
    array: [...list],
    activeIndices: [],
    pointers: list.length > 0 ? { head: 0, tail: list.length - 1 } : {},
    message: "Linked List: Preparing to traverse from Head."
  });

  if (list.length === 0) {
    steps.push({
      array: [],
      activeIndices: [],
      pointers: {},
      message: "The list is empty. Traversal complete."
    });
    return steps;
  }

  for (let i = 0; i < list.length; i++) {
    steps.push({
      array: [...list],
      activeIndices: [i],
      pointers: { head: 0, tail: list.length - 1, curr: i },
      message: `Visiting node at index ${i} with value ${list[i]}.`
    });
  }

  steps.push({
    array: [...list],
    activeIndices: [],
    pointers: { head: 0, tail: list.length - 1 },
    message: "✅ Traversal complete! Reached end of list (null pointer)."
  });

  return steps;
};

export const generateListInsertionSteps = (
  initialList: number[],
  value: number,
  insertIndex: number
): Step[] => {
  const steps: Step[] = [];
  const list = [...initialList];
  const capacity = 7;

  const getPointers = (curr: number, prev?: number) => {
    const p: Record<string, number> = { head: 0, tail: list.length - 1 };
    if (curr !== -1) p.curr = curr;
    if (prev !== undefined && prev !== -1) p.prev = prev;
    return p;
  };

  steps.push({
    array: [...list],
    activeIndices: [],
    pointers: list.length > 0 ? getPointers(-1) : {},
    message: `Preparing to insert value ${value} at index ${insertIndex}.`
  });

  if (list.length >= capacity) {
    steps.push({
      array: [...list],
      activeIndices: [],
      pointers: getPointers(-1),
      message: "❌ Linked List Overflow! Limit size of 7 nodes reached."
    });
    return steps;
  }

  if (insertIndex < 0 || insertIndex > list.length) {
    steps.push({
      array: [...list],
      activeIndices: [],
      pointers: getPointers(-1),
      message: "❌ Insertion index out of bounds!"
    });
    return steps;
  }

  // Case 1: Insert at Head
  if (insertIndex === 0) {
    steps.push({
      array: [...list],
      activeIndices: [],
      pointers: list.length > 0 ? getPointers(0) : {},
      message: `Inserting at Head. New node ${value} will point to old head ${list.length > 0 ? list[0] : "null"}.`
    });

    list.unshift(value);

    steps.push({
      array: [...list],
      activeIndices: [0],
      swappedIndices: [0], // success highlight
      pointers: getPointers(0),
      message: `✅ Inserted new Head node ${value}. Head pointer updated.`
    });
    return steps;
  }

  // Case 2: Insert at Tail or Middle
  // Traverse to find the insertion point (index - 1)
  let prevIdx = -1;
  let currIdx = 0;

  for (let i = 0; i < insertIndex; i++) {
    prevIdx = currIdx;
    currIdx = i;

    steps.push({
      array: [...list],
      activeIndices: [currIdx],
      pointers: getPointers(currIdx, prevIdx),
      message: `Traversing: searching insertion position (currently at node ${list[currIdx]}, index ${currIdx}).`
    });
  }

  steps.push({
    array: [...list],
    activeIndices: [prevIdx],
    pointers: getPointers(currIdx, prevIdx),
    message: `Reached insertion position. The new node will be inserted between index ${prevIdx} (${list[prevIdx]}) and index ${currIdx} (${list[currIdx] !== undefined ? list[currIdx] : "null"}).`
  });

  // Perform insertion
  list.splice(insertIndex, 0, value);

  steps.push({
    array: [...list],
    activeIndices: [insertIndex],
    swappedIndices: [insertIndex],
    pointers: getPointers(insertIndex, prevIdx),
    message: `✅ Link updated. Inserted node ${value} at index ${insertIndex}.`
  });

  return steps;
};

export const generateListDeletionSteps = (
  initialList: number[],
  deleteIndex: number
): Step[] => {
  const steps: Step[] = [];
  const list = [...initialList];

  const getPointers = (curr: number, prev?: number) => {
    const p: Record<string, number> = { head: 0, tail: list.length - 1 };
    if (curr !== -1) p.curr = curr;
    if (prev !== undefined && prev !== -1) p.prev = prev;
    return p;
  };

  steps.push({
    array: [...list],
    activeIndices: [],
    pointers: list.length > 0 ? getPointers(-1) : {},
    message: `Preparing to delete node at index ${deleteIndex}.`
  });

  if (list.length === 0) {
    steps.push({
      array: [],
      activeIndices: [],
      pointers: {},
      message: "❌ Underflow! List is empty."
    });
    return steps;
  }

  if (deleteIndex < 0 || deleteIndex >= list.length) {
    steps.push({
      array: [...list],
      activeIndices: [],
      pointers: getPointers(-1),
      message: "❌ Deletion index out of bounds!"
    });
    return steps;
  }

  // Case 1: Delete Head
  if (deleteIndex === 0) {
    steps.push({
      array: [...list],
      activeIndices: [0],
      pointers: getPointers(0),
      message: `Deleting Head node ${list[0]}. Head pointer will advance to next node.`
    });

    list.shift();

    steps.push({
      array: [...list],
      activeIndices: [],
      pointers: list.length > 0 ? getPointers(-1) : {},
      message: "✅ Deletion complete. Head node removed."
    });
    return steps;
  }

  // Case 2: Delete Middle/Tail
  // Traverse to find the node and its predecessor
  let prevIdx = -1;
  let currIdx = 0;

  for (let i = 0; i <= deleteIndex; i++) {
    if (i > 0) {
      prevIdx = currIdx;
    }
    currIdx = i;

    steps.push({
      array: [...list],
      activeIndices: [currIdx],
      pointers: getPointers(currIdx, prevIdx),
      message: `Traversing: currently at node ${list[currIdx]} (index ${currIdx}).`
    });
  }

  steps.push({
    array: [...list],
    activeIndices: [currIdx],
    pointers: getPointers(currIdx, prevIdx),
    message: `Target node found: ${list[currIdx]} at index ${currIdx}. Predecessor is ${list[prevIdx]}.`
  });

  steps.push({
    array: [...list],
    activeIndices: [currIdx],
    pointers: getPointers(currIdx, prevIdx),
    message: `Updating links: linking index ${prevIdx} (${list[prevIdx]})'s next pointer to node ${list[currIdx + 1] !== undefined ? list[currIdx + 1] : "null"}.`
  });

  list.splice(deleteIndex, 1);

  steps.push({
    array: [...list],
    activeIndices: [],
    pointers: getPointers(-1),
    message: `✅ Node deleted. Links re-established.`
  });

  return steps;
};

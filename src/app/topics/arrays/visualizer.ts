export type Step = {
  array?: number[];
  activeIndices?: number[];
  swappedIndices?: number[];
  pointers?: Record<string, number>;
  message?: string;
};

export const generateTraversalSteps = (initialArray: number[]): Step[] => {
  const steps: Step[] = [];
  const arr = [...initialArray];

  // Initial State
  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: "Initial array. Preparing to start traversal from index 0."
  });

  for (let i = 0; i < arr.length; i++) {
    steps.push({
      array: [...arr],
      activeIndices: [i],
      pointers: { curr: i },
      message: `Visiting element ${arr[i]} at index ${i}.`
    });
  }

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: "✅ Traversal complete! All elements visited."
  });

  return steps;
};

export const generateInsertionSteps = (
  initialArray: number[],
  value: number,
  insertIndex: number
): Step[] => {
  const steps: Step[] = [];
  
  // Make sure we have a fixed capacity of e.g. 8 cells to show shifting visually.
  const capacity = 8;
  const arr = [...initialArray];
  while (arr.length < capacity) {
    arr.push(0); // 0 indicates empty slot
  }

  // Count active elements
  let size = initialArray.length;

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: `Initial array of size ${size}. Target: insert ${value} at index ${insertIndex}.`
  });

  if (insertIndex < 0 || insertIndex > size || size >= capacity) {
    steps.push({
      array: [...arr],
      activeIndices: [],
      pointers: {},
      message: "❌ Insertion out of bounds or array capacity exceeded!"
    });
    return steps;
  }

  // Shift elements right
  for (let i = size - 1; i >= insertIndex; i--) {
    steps.push({
      array: [...arr],
      activeIndices: [i],
      pointers: { curr: i, target: i + 1 },
      message: `Shifting element ${arr[i]} from index ${i} to ${i + 1} to make room.`
    });

    arr[i + 1] = arr[i];
    arr[i] = 0; // Temporarily clear the spot being shifted from

    steps.push({
      array: [...arr],
      activeIndices: [i + 1],
      pointers: { curr: i + 1 },
      message: `Shifted to index ${i + 1}.`
    });
  }

  // Insert element
  steps.push({
    array: [...arr],
    activeIndices: [insertIndex],
    pointers: { insert: insertIndex },
    message: `Inserting new value ${value} into empty slot at index ${insertIndex}.`
  });

  arr[insertIndex] = value;

  steps.push({
    array: [...arr],
    activeIndices: [insertIndex],
    swappedIndices: [insertIndex], // Highlight in success color
    pointers: { insert: insertIndex },
    message: `✅ Value ${value} successfully inserted at index ${insertIndex}!`
  });

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: "✅ Final array after insertion."
  });

  return steps;
};

export const generateDeletionSteps = (
  initialArray: number[],
  deleteIndex: number
): Step[] => {
  const steps: Step[] = [];
  const capacity = 8;
  const arr = [...initialArray];
  while (arr.length < capacity) {
    arr.push(0);
  }

  const size = initialArray.length;

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: `Initial array of size ${size}. Target: delete element at index ${deleteIndex}.`
  });

  if (deleteIndex < 0 || deleteIndex >= size) {
    steps.push({
      array: [...arr],
      activeIndices: [],
      pointers: {},
      message: "❌ Deletion index out of bounds!"
    });
    return steps;
  }

  steps.push({
    array: [...arr],
    activeIndices: [deleteIndex],
    pointers: { remove: deleteIndex },
    message: `Removing element ${arr[deleteIndex]} at index ${deleteIndex}.`
  });

  // Empty the target index
  arr[deleteIndex] = 0;

  steps.push({
    array: [...arr],
    activeIndices: [deleteIndex],
    pointers: { empty: deleteIndex },
    message: `Slot at index ${deleteIndex} is now empty. Preparing to shift left.`
  });

  // Shift elements left
  for (let i = deleteIndex; i < size - 1; i++) {
    steps.push({
      array: [...arr],
      activeIndices: [i + 1],
      pointers: { src: i + 1, dest: i },
      message: `Shifting element ${arr[i + 1]} from index ${i + 1} to index ${i}.`
    });

    arr[i] = arr[i + 1];
    arr[i + 1] = 0; // Clear shifted position

    steps.push({
      array: [...arr],
      activeIndices: [i],
      pointers: { dest: i },
      message: `Shifted to index ${i}.`
    });
  }

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: `✅ Deletion complete. Elements shifted left. New logical size: ${size - 1}.`
  });

  return steps;
};

export const generateSearchingSteps = (
  initialArray: number[],
  target: number
): Step[] => {
  const steps: Step[] = [];
  const arr = [...initialArray];

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: `Linear Search: Looking for target value ${target} in the array.`
  });

  let foundIndex = -1;

  for (let i = 0; i < arr.length; i++) {
    steps.push({
      array: [...arr],
      activeIndices: [i],
      pointers: { check: i },
      message: `Comparing element ${arr[i]} at index ${i} with target ${target}.`
    });

    if (arr[i] === target) {
      foundIndex = i;
      steps.push({
        array: [...arr],
        activeIndices: [i],
        swappedIndices: [i], // Highlight matching green
        pointers: { found: i },
        message: `🎯 Target ${target} found at index ${i}! Match successful.`
      });
      break;
    } else {
      steps.push({
        array: [...arr],
        activeIndices: [i],
        pointers: { check: i },
        message: `${arr[i]} is not equal to ${target}. Moving to next index.`
      });
    }
  }

  if (foundIndex === -1) {
    steps.push({
      array: [...arr],
      activeIndices: [],
      pointers: {},
      message: `❌ Target ${target} was not found in the array.`
    });
  }

  return steps;
};

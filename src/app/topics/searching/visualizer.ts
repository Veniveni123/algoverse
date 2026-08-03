export type Step = {
  array?: number[];
  activeIndices?: number[];
  swappedIndices?: number[];
  pointers?: Record<string, number>;
  message?: string;
};

export const generateLinearSearchSteps = (initialArray: number[], target: number): Step[] => {
  const steps: Step[] = [];
  const arr = [...initialArray];

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: `Linear Search: Looking for target value ${target} in array.`
  });

  let foundIndex = -1;

  for (let i = 0; i < arr.length; i++) {
    steps.push({
      array: [...arr],
      activeIndices: [i],
      pointers: { check: i },
      message: `Comparing element at index ${i} (${arr[i]}) with target ${target}.`
    });

    if (arr[i] === target) {
      foundIndex = i;
      steps.push({
        array: [...arr],
        activeIndices: [i],
        swappedIndices: [i],
        pointers: { found: i },
        message: `🎯 Found! Target ${target} matches element at index ${i}.`
      });
      break;
    } else {
      steps.push({
        array: [...arr],
        activeIndices: [i],
        pointers: { check: i },
        message: `${arr[i]} !== ${target}. Continuing search at next index.`
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

export const generateBinarySearchSteps = (initialArray: number[], target: number): Step[] => {
  const steps: Step[] = [];
  
  // Binary search requires a sorted array
  const arr = [...initialArray].sort((a, b) => a - b);

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: `Binary Search: Sorting array and looking for target ${target}.`
  });

  let low = 0;
  let high = arr.length - 1;
  let foundIndex = -1;

  // Active indices represents the current search bounds (low to high inclusive)
  const getSearchSpace = (l: number, h: number) => {
    const range = [];
    for (let idx = l; idx <= h; idx++) {
      range.push(idx);
    }
    return range;
  };

  steps.push({
    array: [...arr],
    activeIndices: getSearchSpace(low, high),
    pointers: { low, high },
    message: `Initial range: Low is at index ${low} (${arr[low]}), High is at index ${high} (${arr[high]}).`
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    steps.push({
      array: [...arr],
      activeIndices: getSearchSpace(low, high),
      pointers: { low, high, mid },
      message: `Midpoint index = (Low + High) / 2 = (${low} + ${high}) / 2 = ${mid}. Value at mid is ${arr[mid]}.`
    });

    if (arr[mid] === target) {
      foundIndex = mid;
      steps.push({
        array: [...arr],
        activeIndices: [mid],
        swappedIndices: [mid], // success green highlight
        pointers: { found: mid },
        message: `🎯 Target ${target} matches element at index ${mid}! Search successful.`
      });
      break;
    } else if (arr[mid] < target) {
      const prevLow = low;
      low = mid + 1;
      steps.push({
        array: [...arr],
        activeIndices: getSearchSpace(prevLow, high),
        pointers: { low: prevLow, high, mid },
        message: `Value at mid (${arr[mid]}) < target (${target}). Target lies in the right half. Shifting Low to mid + 1 = index ${low}.`
      });
    } else {
      const prevHigh = high;
      high = mid - 1;
      steps.push({
        array: [...arr],
        activeIndices: getSearchSpace(low, prevHigh),
        pointers: { low, high: prevHigh, mid },
        message: `Value at mid (${arr[mid]}) > target (${target}). Target lies in the left half. Shifting High to mid - 1 = index ${high}.`
      });
    }
  }

  if (foundIndex === -1) {
    steps.push({
      array: [...arr],
      activeIndices: [],
      pointers: {},
      message: `❌ Target ${target} is not in the array (Low pointer crossed High pointer).`
    });
  }

  return steps;
};

export type Step = {
  array?: number[];
  activeIndices?: number[];
  swappedIndices?: number[];
  pointers?: Record<string, number>;
  message?: string;
};

export const generateBubbleSortSteps = (initialArray: number[]): Step[] => {
  const steps: Step[] = [];
  const arr = [...initialArray];
  const n = arr.length;

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: "Initial array. Preparing to start Bubble Sort."
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr],
        activeIndices: [j, j + 1],
        pointers: { j, next: j + 1, pass: i },
        message: `Comparing elements at index ${j} (${arr[j]}) and index ${j + 1} (${arr[j + 1]}).`
      });

      if (arr[j] > arr[j + 1]) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        steps.push({
          array: [...arr],
          activeIndices: [j, j + 1],
          swappedIndices: [j, j + 1],
          pointers: { j, next: j + 1, pass: i },
          message: `Swapped index ${j} and index ${j + 1} because ${arr[j + 1]} > ${arr[j]}.`
        });
      }
    }
    if (!swapped) {
      steps.push({
        array: [...arr],
        activeIndices: [],
        pointers: {},
        message: `No swaps occurred in this pass. Array is already sorted. Stopping early.`
      });
      break;
    }
  }

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: "✅ Bubble Sort complete! Array is sorted."
  });

  return steps;
};

export const generateSelectionSortSteps = (initialArray: number[]): Step[] => {
  const steps: Step[] = [];
  const arr = [...initialArray];
  const n = arr.length;

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: "Initial array. Preparing to start Selection Sort."
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    steps.push({
      array: [...arr],
      activeIndices: [i],
      pointers: { boundary: i, minIdx: i },
      message: `Pass ${i + 1}: Setting index ${i} (${arr[i]}) as initial minimum.`
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        activeIndices: [minIdx, j],
        pointers: { boundary: i, minIdx: minIdx, scan: j },
        message: `Comparing current minimum (${arr[minIdx]}) with index ${j} (${arr[j]}).`
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...arr],
          activeIndices: [minIdx],
          pointers: { boundary: i, minIdx: minIdx, scan: j },
          message: `Found new minimum at index ${minIdx} (${arr[minIdx]}).`
        });
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push({
        array: [...arr],
        activeIndices: [i, minIdx],
        swappedIndices: [i, minIdx],
        pointers: { boundary: i, minIdx: minIdx },
        message: `Swapped index ${i} with minimum at index ${minIdx}. Placed ${arr[i]} in sorted region.`
      });
    }
  }

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: "✅ Selection Sort complete! Array is sorted."
  });

  return steps;
};

export const generateInsertionSortSteps = (initialArray: number[]): Step[] => {
  const steps: Step[] = [];
  const arr = [...initialArray];
  const n = arr.length;

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: "Initial array. Preparing to start Insertion Sort."
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      array: [...arr],
      activeIndices: [i],
      pointers: { keyIndex: i, j },
      message: `Selecting key element ${key} at index ${i}. Preparing to insert into sorted left sub-array.`
    });

    while (j >= 0 && arr[j] > key) {
      steps.push({
        array: [...arr],
        activeIndices: [j, j + 1],
        pointers: { keyIndex: i, j },
        message: `Comparing: key ${key} is smaller than ${arr[j]} at index ${j}. Shifting right.`
      });

      arr[j + 1] = arr[j];
      arr[j] = 0; // Empty visual slot

      steps.push({
        array: [...arr],
        activeIndices: [j + 1],
        pointers: { j },
        message: `Shifted element to index ${j + 1}.`
      });

      j--;
    }

    arr[j + 1] = key;
    steps.push({
      array: [...arr],
      activeIndices: [j + 1],
      swappedIndices: [j + 1],
      pointers: { insertPos: j + 1 },
      message: `Inserted key ${key} at sorted position index ${j + 1}.`
    });
  }

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: "✅ Insertion Sort complete! Array is sorted."
  });

  return steps;
};

export const generateMergeSortSteps = (initialArray: number[]): Step[] => {
  const steps: Step[] = [];
  const arr = [...initialArray];

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: "Initial array. Preparing to start Merge Sort (Divide & Conquer)."
  });

  const merge = async (l: number, m: number, r: number) => {
    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);
    
    let i = 0;
    let j = 0;
    let k = l;

    steps.push({
      array: [...arr],
      activeIndices: [l, r],
      pointers: { leftBound: l, mid: m, rightBound: r },
      message: `Merging segments: indexes [${l}..${m}] and [${m+1}..${r}].`
    });

    while (i < left.length && j < right.length) {
      steps.push({
        array: [...arr],
        activeIndices: [l + i, m + 1 + j],
        pointers: { leftBound: l, rightBound: r, mergeK: k },
        message: `Comparing left value ${left[i]} with right value ${right[j]}.`
      });

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }

      steps.push({
        array: [...arr],
        activeIndices: [k],
        swappedIndices: [k],
        pointers: { mergeK: k },
        message: `Placed smaller element at index ${k}.`
      });
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      steps.push({
        array: [...arr],
        activeIndices: [k],
        pointers: { mergeK: k },
        message: `Copying remaining left element ${left[i]} to index ${k}.`
      });
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      steps.push({
        array: [...arr],
        activeIndices: [k],
        pointers: { mergeK: k },
        message: `Copying remaining right element ${right[j]} to index ${k}.`
      });
      j++;
      k++;
    }
  };

  const mergeSort = async (l: number, r: number) => {
    if (l < r) {
      const m = Math.floor((l + r) / 2);
      steps.push({
        array: [...arr],
        activeIndices: [l, r],
        pointers: { left: l, right: r, mid: m },
        message: `Dividing array segment [${l}..${r}] at midpoint ${m}.`
      });
      await mergeSort(l, m);
      await mergeSort(m + 1, r);
      await merge(l, m, r);
    }
  };

  // Sync execution
  const runMergeSort = () => {
    const p = mergeSort(0, arr.length - 1);
    // Since it's synchronous step recording, we do not need async/await at call site.
    // The promises inside resolve immediately because we push steps into global synchronous 'steps' array.
  };
  
  runMergeSort();

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: "✅ Merge Sort complete! Array is sorted."
  });

  return steps;
};

export const generateQuickSortSteps = (initialArray: number[]): Step[] => {
  const steps: Step[] = [];
  const arr = [...initialArray];

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: "Initial array. Preparing to start Quick Sort."
  });

  const partition = (low: number, high: number): number => {
    const pivot = arr[high];
    let i = low - 1;

    steps.push({
      array: [...arr],
      activeIndices: [high],
      pointers: { pivotIdx: high, lowBound: low, highBound: high },
      message: `Selected pivot element ${pivot} at index ${high}. Partitioning subarray [${low}..${high}].`
    });

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...arr],
        activeIndices: [j, high],
        pointers: { pivotIdx: high, iPointer: i, scanPointer: j },
        message: `Comparing element ${arr[j]} at index ${j} with pivot ${pivot}.`
      });

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({
          array: [...arr],
          activeIndices: [i, j],
          swappedIndices: [i, j],
          pointers: { pivotIdx: high, iPointer: i, scanPointer: j },
          message: `Swapped index ${i} and index ${j} because ${arr[j]} is smaller than pivot ${pivot}.`
        });
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({
      array: [...arr],
      activeIndices: [i + 1, high],
      swappedIndices: [i + 1, high],
      pointers: { pivotIdx: i + 1 },
      message: `Placed pivot ${pivot} at its correct sorted position index ${i + 1}.`
    });

    return i + 1;
  };

  const quickSort = (low: number, high: number) => {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    }
  };

  quickSort(0, arr.length - 1);

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: {},
    message: "✅ Quick Sort complete! Array is sorted."
  });

  return steps;
};

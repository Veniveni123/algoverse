export type Step = {
  array?: number[];
  activeIndices?: number[];
  swappedIndices?: number[];
  pointers?: Record<string, number>;
  message?: string;
};

export const generateEnqueueSteps = (initialQueue: number[], value: number): Step[] => {
  const steps: Step[] = [];
  const q = [...initialQueue];
  const capacity = 6;

  // Initial state
  steps.push({
    array: [...q],
    activeIndices: [],
    pointers: q.length > 0 ? { front: 0, rear: q.length - 1 } : {},
    message: `Queue size is ${q.length}. Preparing to enqueue ${value} at the Rear.`
  });

  if (q.length >= capacity) {
    steps.push({
      array: [...q],
      activeIndices: [],
      pointers: q.length > 0 ? { front: 0, rear: q.length - 1 } : {},
      message: "❌ Queue Overflow! Maximum capacity reached."
    });
    return steps;
  }

  // Enqueue
  q.push(value);
  steps.push({
    array: [...q],
    activeIndices: [q.length - 1], // Highlight enqueued node
    pointers: { front: 0, rear: q.length - 1 },
    message: `Added element ${value} at the Rear (index ${q.length - 1}).`
  });

  steps.push({
    array: [...q],
    activeIndices: [],
    pointers: { front: 0, rear: q.length - 1 },
    message: `✅ Enqueue complete. Rear pointer updated to index ${q.length - 1}.`
  });

  return steps;
};

export const generateDequeueSteps = (initialQueue: number[]): Step[] => {
  const steps: Step[] = [];
  const q = [...initialQueue];

  steps.push({
    array: [...q],
    activeIndices: [],
    pointers: q.length > 0 ? { front: 0, rear: q.length - 1 } : {},
    message: `Queue size is ${q.length}. Preparing to dequeue from the Front.`
  });

  if (q.length === 0) {
    steps.push({
      array: [...q],
      activeIndices: [],
      pointers: {},
      message: "❌ Queue Underflow! Queue is empty."
    });
    return steps;
  }

  const dequeuedValue = q[0];

  steps.push({
    array: [...q],
    activeIndices: [0], // Highlight dequeued node
    pointers: { front: 0, rear: q.length - 1 },
    message: `Removing front element ${dequeuedValue} from index 0.`
  });

  q.shift();

  steps.push({
    array: [...q],
    activeIndices: [],
    pointers: q.length > 0 ? { front: 0, rear: q.length - 1 } : {},
    message: `✅ Dequeue complete. Returned value ${dequeuedValue}. Front shifted.`
  });

  return steps;
};

// Circular Queue step generator:
// array represents slots of size 6 (0 represents empty slot).
// pointers contains front and rear indices.
export const generateCircularQueueSteps = (
  currentArray: number[],
  front: number,
  rear: number,
  operation: "enqueue" | "dequeue",
  value?: number
): { steps: Step[]; newFront: number; newRear: number; newArray: number[] } => {
  const steps: Step[] = [];
  const arr = [...currentArray];
  const capacity = 6;

  let newFront = front;
  let newRear = rear;

  steps.push({
    array: [...arr],
    activeIndices: [],
    pointers: front !== -1 ? { front, rear } : {},
    message: `Circular Queue: Preparing to perform ${operation} (Front: ${front}, Rear: ${rear}).`
  });

  if (operation === "enqueue" && value !== undefined) {
    // Check if full
    if ((rear + 1) % capacity === front) {
      steps.push({
        array: [...arr],
        activeIndices: [],
        pointers: { front, rear },
        message: "❌ Circular Queue Overflow! The queue is full."
      });
      return { steps, newFront, newRear, newArray: arr };
    }

    if (front === -1) {
      newFront = 0;
      newRear = 0;
    } else {
      newRear = (rear + 1) % capacity;
    }

    steps.push({
      array: [...arr],
      activeIndices: [newRear],
      pointers: { front: newFront, rear: newRear },
      message: `Moving Rear pointer circular: (${rear} + 1) % ${capacity} = index ${newRear}.`
    });

    arr[newRear] = value;

    steps.push({
      array: [...arr],
      activeIndices: [newRear],
      swappedIndices: [newRear],
      pointers: { front: newFront, rear: newRear },
      message: `✅ Enqueued value ${value} at index ${newRear}.`
    });
  } else if (operation === "dequeue") {
    // Check if empty
    if (front === -1) {
      steps.push({
        array: [...arr],
        activeIndices: [],
        pointers: {},
        message: "❌ Circular Queue Underflow! The queue is empty."
      });
      return { steps, newFront, newRear, newArray: arr };
    }

    const removedValue = arr[front];

    steps.push({
      array: [...arr],
      activeIndices: [front],
      pointers: { front, rear },
      message: `Dequeuing front element ${removedValue} at index ${front}.`
    });

    arr[front] = 0; // Empty the slot

    if (front === rear) {
      // Queue becomes empty
      newFront = -1;
      newRear = -1;
      steps.push({
        array: [...arr],
        activeIndices: [],
        pointers: {},
        message: `Queue is now empty. Resetting Front and Rear pointers to -1.`
      });
    } else {
      newFront = (front + 1) % capacity;
      steps.push({
        array: [...arr],
        activeIndices: [],
        pointers: { front: newFront, rear },
        message: `Moving Front pointer circular: (${front} + 1) % ${capacity} = index ${newFront}.`
      });
    }
  }

  return { steps, newFront, newRear, newArray: arr };
};

// Deque step generator:
// array stores active queue items.
export const generateDequeSteps = (
  initialQueue: number[],
  operation: "insertFront" | "insertRear" | "deleteFront" | "deleteRear",
  value?: number
): Step[] => {
  const steps: Step[] = [];
  const q = [...initialQueue];
  const capacity = 6;

  const getPointers = (arr: number[]): Record<string, number> => {
    return arr.length > 0 ? { front: 0, rear: arr.length - 1 } : { front: -1, rear: -1 };
  };

  steps.push({
    array: [...q],
    activeIndices: [],
    pointers: getPointers(q),
    message: `Deque: Preparing to perform "${operation.replace("insert", "Insert ").replace("delete", "Delete ")}".`
  });

  if (operation === "insertFront" && value !== undefined) {
    if (q.length >= capacity) {
      steps.push({
        array: [...q],
        activeIndices: [],
        pointers: getPointers(q),
        message: "❌ Deque Overflow! Maximum capacity reached."
      });
      return steps;
    }
    q.unshift(value);
    steps.push({
      array: [...q],
      activeIndices: [0],
      pointers: getPointers(q),
      message: `Inserted element ${value} at the Front (index 0). Shifting others right.`
    });
  } else if (operation === "insertRear" && value !== undefined) {
    if (q.length >= capacity) {
      steps.push({
        array: [...q],
        activeIndices: [],
        pointers: getPointers(q),
        message: "❌ Deque Overflow! Maximum capacity reached."
      });
      return steps;
    }
    q.push(value);
    steps.push({
      array: [...q],
      activeIndices: [q.length - 1],
      pointers: getPointers(q),
      message: `Inserted element ${value} at the Rear (index ${q.length - 1}).`
    });
  } else if (operation === "deleteFront") {
    if (q.length === 0) {
      steps.push({
        array: [...q],
        activeIndices: [],
        pointers: {},
        message: "❌ Deque Underflow! Deque is empty."
      });
      return steps;
    }
    const val = q[0];
    steps.push({
      array: [...q],
      activeIndices: [0],
      pointers: getPointers(q),
      message: `Removing element ${val} from the Front (index 0).`
    });
    q.shift();
    steps.push({
      array: [...q],
      activeIndices: [],
      pointers: getPointers(q),
      message: `✅ Removed ${val} from Front. Front pointer updated.`
    });
  } else if (operation === "deleteRear") {
    if (q.length === 0) {
      steps.push({
        array: [...q],
        activeIndices: [],
        pointers: {},
        message: "❌ Deque Underflow! Deque is empty."
      });
      return steps;
    }
    const val = q[q.length - 1];
    steps.push({
      array: [...q],
      activeIndices: [q.length - 1],
      pointers: getPointers(q),
      message: `Removing element ${val} from the Rear (index ${q.length - 1}).`
    });
    q.pop();
    steps.push({
      array: [...q],
      activeIndices: [],
      pointers: getPointers(q),
      message: `✅ Removed ${val} from Rear. Rear pointer updated.`
    });
  }

  return steps;
};

export type Step = {
  array?: number[];
  activeIndices?: number[];
  swappedIndices?: number[];
  pointers?: Record<string, number>;
  message?: string;
};

export const generatePushSteps = (initialStack: number[], value: number): Step[] => {
  const steps: Step[] = [];
  const s = [...initialStack];
  const capacity = 6;

  // Initial
  steps.push({
    array: [...s],
    activeIndices: [],
    pointers: s.length > 0 ? { top: s.length - 1 } : {},
    message: `Stack has current size of ${s.length}. Preparing to push ${value}.`
  });

  if (s.length >= capacity) {
    steps.push({
      array: [...s],
      activeIndices: [],
      pointers: { top: s.length - 1 },
      message: "❌ Stack Overflow! Stack capacity reached."
    });
    return steps;
  }

  // Push
  s.push(value);
  steps.push({
    array: [...s],
    activeIndices: [s.length - 1], // Highlight pushed node
    pointers: { top: s.length - 1 },
    message: `Pushed value ${value} to the top of the stack.`
  });

  steps.push({
    array: [...s],
    activeIndices: [],
    pointers: { top: s.length - 1 },
    message: `✅ Push operation complete. Top pointer updated to index ${s.length - 1}.`
  });

  return steps;
};

export const generatePopSteps = (initialStack: number[]): Step[] => {
  const steps: Step[] = [];
  const s = [...initialStack];

  steps.push({
    array: [...s],
    activeIndices: [],
    pointers: s.length > 0 ? { top: s.length - 1 } : {},
    message: `Stack has current size of ${s.length}. Preparing to pop top element.`
  });

  if (s.length === 0) {
    steps.push({
      array: [...s],
      activeIndices: [],
      pointers: {},
      message: "❌ Stack Underflow! Nothing to pop from stack."
    });
    return steps;
  }

  const poppedValue = s[s.length - 1];

  steps.push({
    array: [...s],
    activeIndices: [s.length - 1], // Highlight element being popped
    pointers: { top: s.length - 1 },
    message: `Popping top element ${poppedValue} from stack.`
  });

  s.pop();

  steps.push({
    array: [...s],
    activeIndices: [],
    pointers: s.length > 0 ? { top: s.length - 1 } : {},
    message: `✅ Pop complete. Returned value ${poppedValue}. Top pointer updated.`
  });

  return steps;
};

export const generatePeekSteps = (initialStack: number[]): Step[] => {
  const steps: Step[] = [];
  const s = [...initialStack];

  steps.push({
    array: [...s],
    activeIndices: [],
    pointers: s.length > 0 ? { top: s.length - 1 } : {},
    message: "Preparing to peek top element of the stack."
  });

  if (s.length === 0) {
    steps.push({
      array: [...s],
      activeIndices: [],
      pointers: {},
      message: "Stack is empty. Peek returns null."
    });
    return steps;
  }

  const topValue = s[s.length - 1];

  steps.push({
    array: [...s],
    activeIndices: [s.length - 1],
    swappedIndices: [s.length - 1], // Highlight green
    pointers: { top: s.length - 1 },
    message: `Peek returned the top element: ${topValue}. Stack state remains unchanged.`
  });

  return steps;
};

// Bracket mappings:
// '(' = 1, '[' = 2, '{' = 3
// ')' = -1, ']' = -2, '}' = -3
export const generateBalancedParenthesesSteps = (expr: string): Step[] => {
  const steps: Step[] = [];
  const charStack: number[] = [];
  
  // Initial state
  steps.push({
    array: [],
    activeIndices: [],
    pointers: {},
    message: `Starting Bracket Matching for expression: "${expr}".`
  });

  const matching: Record<string, string> = { ")": "(", "]": "[", "}": "{" };
  const symbolToNum: Record<string, number> = { "(": 1, "[": 2, "{": 3 };

  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];
    
    // Highlight character index in pointers. We can store the current char index in pointers as {"charIndex": i}
    const pointers = { charIndex: i, top: charStack.length - 1 };

    if (["(", "[", "{"].includes(char)) {
      const num = symbolToNum[char];
      charStack.push(num);
      
      steps.push({
        array: [...charStack],
        activeIndices: [charStack.length - 1],
        pointers: { charIndex: i, top: charStack.length - 1 },
        message: `Token: '${char}' is an opening bracket. Pushing onto stack.`
      });
    } else if ([")", "]", "}"].includes(char)) {
      const targetMatch = matching[char];
      const targetNum = symbolToNum[targetMatch];
      
      steps.push({
        array: [...charStack],
        activeIndices: charStack.length > 0 ? [charStack.length - 1] : [],
        pointers: { charIndex: i, top: charStack.length - 1 },
        message: `Token: '${char}' is a closing bracket. Checking top of stack for match '${targetMatch}'.`
      });

      if (charStack.length === 0) {
        steps.push({
          array: [...charStack],
          activeIndices: [],
          pointers: { charIndex: i },
          message: `❌ Unbalanced! Closing bracket '${char}' seen but stack is empty.`
        });
        return steps;
      }

      const popped = charStack.pop();

      if (popped !== targetNum) {
        steps.push({
          array: [...charStack, popped!],
          activeIndices: [charStack.length],
          pointers: { charIndex: i },
          message: `❌ Mismatch! Top of stack has index value ${popped} (expected ${targetNum} for '${targetMatch}'). Expression is unbalanced.`
        });
        return steps;
      }

      steps.push({
        array: [...charStack],
        activeIndices: [],
        swappedIndices: [],
        pointers: { charIndex: i, top: charStack.length - 1 },
        message: `✓ Match! Popped '${targetMatch}' from stack matching '${char}'.`
      });
    }
  }

  const isBalanced = charStack.length === 0;

  if (isBalanced) {
    steps.push({
      array: [],
      activeIndices: [],
      pointers: {},
      message: "✅ Balanced! All brackets matched, and stack is empty."
    });
  } else {
    steps.push({
      array: [...charStack],
      activeIndices: [charStack.length - 1],
      pointers: { top: charStack.length - 1 },
      message: "❌ Unbalanced! All tokens parsed but some unmatched brackets remain on stack."
    });
  }

  return steps;
};

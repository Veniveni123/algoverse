import { TopicInfo } from "../arrays/description";

export const stackDescriptions: Record<string, TopicInfo> = {
  "Push Operation": {
    title: "Push Operation",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    space: "O(1)",
    desc: "Inserting an element at the top of the stack.",
    about: "Push operation adds a new element to the top of the stack. If the stack is implemented using a fixed-size array, it checks for overflow before insertion. In a dynamic stack or linked list implementation, memory is allocated on the fly. Since insertion only happens at a single location (the top), the operation runs in constant time O(1).",
    keypoints: [
      "Adds a new element to the top of the stack.",
      "Increments the top pointer: top = top + 1.",
      "Time complexity is O(1) in all implementations.",
      "Throws an 'Overflow' error if the array structure is completely full."
    ]
  },
  "Pop Operation": {
    title: "Pop Operation",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    space: "O(1)",
    desc: "Removing and returning the element at the top of the stack.",
    about: "Pop operation removes the element that was most recently added (following LIFO - Last In First Out order). It inspects if the stack is empty (underflow) before trying to remove. If safe, it decreases the top pointer and returns the removed element. Like Push, this operates only on the top element, yielding O(1) time complexity.",
    keypoints: [
      "Removes the element at the top of the stack.",
      "Decrements the top pointer: top = top - 1.",
      "Time complexity is O(1) in all cases.",
      "Throws an 'Underflow' error if the stack contains no elements."
    ]
  },
  "Peek Operation": {
    title: "Peek Operation",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    space: "O(1)",
    desc: "Returning the top element without removing it from the stack.",
    about: "Peek (or Top) operation returns the value of the element present at the top of the stack without removing it. It is useful to inspect what is next to be processed without altering the stack state. Since it only reads from the top index, it has a time complexity of O(1).",
    keypoints: [
      "Retrieves the value of the top element without removing it.",
      "Does not modify the stack state or move the top pointer.",
      "Requires constant time O(1).",
      "Returns null or errors if the stack is empty."
    ]
  },
  "Stack Applications": {
    title: "Stack Applications",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(n)",
    desc: "Using stack to solve problems, such as matching brackets / parentheses in expressions.",
    about: "Stacks are used for parsing expressions, undo/redo logs, backtracking algorithms, and system call stacks. A classic application is the Balanced Parentheses problem: scanning an expression, pushing opening brackets onto a stack, and popping to match closing brackets. If brackets match at the end and the stack is empty, the expression is balanced.",
    keypoints: [
      "Used to balance brackets, evaluate postfix expressions, or reverse strings.",
      "Balanced Parentheses pushes opening characters '(', '[', '{' onto stack.",
      "When a closing bracket is seen, it pops the top and checks if they match.",
      "Expression is valid if the stack is empty at the end of traversal."
    ]
  }
};

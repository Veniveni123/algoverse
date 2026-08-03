import { CodeSnippet } from "../arrays/code";

export const stackCodeSnippets: Record<string, CodeSnippet> = {
  "Push Operation": {
    python: `class Stack:
    def __init__(self, capacity=10):
        self.capacity = capacity
        self.stack = []

    def push(self, val):
        if len(self.stack) >= self.capacity:
            raise Exception("Stack Overflow")
        self.stack.append(val)
        print(f"Pushed {val} to stack")

# Example
s = Stack()
s.push(10)`,
    java: `public class Stack {
    private int[] arr;
    private int top;
    private int capacity;

    public Stack(int size) {
        arr = new int[size];
        capacity = size;
        top = -1;
    }

    public void push(int x) {
        if (top == capacity - 1) {
            System.out.println("Stack Overflow");
            return;
        }
        arr[++top] = x;
        System.out.println("Pushed: " + x);
    }
}`,
    cpp: `#include <iostream>
using namespace std;

class Stack {
    int top;
    int capacity;
    int* arr;
public:
    Stack(int size) {
        capacity = size;
        top = -1;
        arr = new int[size];
    }
    void push(int x) {
        if (top == capacity - 1) {
            cout << "Stack Overflow" << endl;
            return;
        }
        arr[++top] = x;
        cout << "Pushed: " << x << endl;
    }
};`
  },
  "Pop Operation": {
    python: `class Stack:
    def __init__(self):
        self.stack = [10, 20, 30]

    def pop(self):
        if not self.stack:
            raise Exception("Stack Underflow")
        val = self.stack.pop()
        print(f"Popped {val} from stack")
        return val`,
    java: `public class Stack {
    private int[] arr = {10, 20, 30};
    private int top = 2;

    public int pop() {
        if (top == -1) {
            System.out.println("Stack Underflow");
            return -1;
        }
        return arr[top--];
    }
}`,
    cpp: `#include <iostream>
using namespace std;

class Stack {
    int arr[3] = {10, 20, 30};
    int top = 2;
public:
    int pop() {
        if (top == -1) {
            cout << "Stack Underflow" << endl;
            return -1;
        }
        return arr[top--];
    }
};`
  },
  "Peek Operation": {
    python: `class Stack:
    def __init__(self):
        self.stack = [10, 20, 30]

    def peek(self):
        if not self.stack:
            return None
        return self.stack[-1] # View last element`,
    java: `public class Stack {
    private int[] arr = {10, 20, 30};
    private int top = 2;

    public int peek() {
        if (top == -1) {
            return -1;
        }
        return arr[top];
    }
}`,
    cpp: `#include <iostream>
using namespace std;

class Stack {
    int arr[3] = {10, 20, 30};
    int top = 2;
public:
    int peek() {
        if (top == -1) return -1;
        return arr[top];
    }
};`
  },
  "Stack Applications": {
    python: `def is_balanced(expression):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    
    for char in expression:
        if char in mapping.values():
            stack.append(char)
        elif char in mapping.keys():
            if not stack or stack.pop() != mapping[char]:
                return False
                
    return len(stack) == 0

# Example
print(is_balanced("{[()]}")) # Output: True`,
    java: `import java.util.Stack;

public class BracketMatch {
    public static boolean isBalanced(String expr) {
        Stack<Character> stack = new Stack<>();
        for (int i = 0; i < expr.length(); i++) {
            char ch = expr.charAt(i);
            if (ch == '(' || ch == '[' || ch == '{') {
                stack.push(ch);
            } else if (ch == ')' || ch == ']' || ch == '}') {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if ((ch == ')' && top != '(') ||
                    (ch == ']' && top != '[') ||
                    (ch == '}' && top != '{')) {
                    return false;
                }
            }
        }
        return stack.isEmpty();
    }
}`,
    cpp: `#include <iostream>
#include <stack>
using namespace std;

bool isBalanced(string expr) {
    stack<char> s;
    for (char ch : expr) {
        if (ch == '(' || ch == '[' || ch == '{') {
            s.push(ch);
        } else if (ch == ')' || ch == ']' || ch == '}') {
            if (s.empty()) return false;
            char top = s.top();
            s.pop();
            if ((ch == ')' && top != '(') ||
                (ch == ']' && top != '[') ||
                (ch == '}' && top != '{')) {
                return false;
            }
        }
    }
    return s.empty();
}`
  }
};

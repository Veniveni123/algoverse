import { CodeSnippet } from "../arrays/code";

export const queueCodeSnippets: Record<string, CodeSnippet> = {
  "Enqueue Operation": {
    python: `class Queue:
    def __init__(self, capacity=10):
        self.queue = []
        self.capacity = capacity

    def enqueue(self, val):
        if len(self.queue) >= self.capacity:
            raise Exception("Queue Overflow")
        self.queue.append(val)
        print(f"Enqueued: {val}")

# Example
q = Queue()
q.enqueue(10)`,
    java: `public class Queue {
    private int[] arr;
    private int front, rear, size, capacity;

    public Queue(int capacity) {
        this.capacity = capacity;
        arr = new int[capacity];
        front = 0;
        rear = -1;
        size = 0;
    }

    public void enqueue(int item) {
        if (size == capacity) {
            System.out.println("Queue Overflow");
            return;
        }
        rear = (rear + 1); // Simple linear rear
        arr[rear] = item;
        size++;
        System.out.println("Enqueued: " + item);
    }
}`,
    cpp: `#include <iostream>
using namespace std;

class Queue {
    int front, rear, size;
    unsigned capacity;
    int* array;
public:
    Queue(unsigned cap) {
        capacity = cap;
        front = size = 0;
        rear = -1;
        array = new int[capacity];
    }
    void enqueue(int item) {
        if (size == capacity) return;
        array[++rear] = item;
        size++;
        cout << "Enqueued: " << item << endl;
    }
};`
  },
  "Dequeue Operation": {
    python: `class Queue:
    def __init__(self):
        self.queue = [10, 20, 30]

    def dequeue(self):
        if not self.queue:
            raise Exception("Queue Underflow")
        # pop(0) shifts all remaining elements, taking O(n) in python list.
        # Collections.deque is O(1).
        val = self.queue.pop(0)
        print(f"Dequeued: {val}")
        return val`,
    java: `public class Queue {
    private int[] arr = {10, 20, 30};
    private int front = 0;
    private int rear = 2;
    private int size = 3;

    public int dequeue() {
        if (size == 0) {
            System.out.println("Queue Underflow");
            return -1;
        }
        int item = arr[front];
        front = front + 1;
        size--;
        return item;
    }
}`,
    cpp: `#include <iostream>
using namespace std;

class Queue {
    int arr[3] = {10, 20, 30};
    int front = 0, rear = 2, size = 3;
public:
    int dequeue() {
        if (size == 0) return -1;
        int item = arr[front++];
        size--;
        return item;
    }
};`
  },
  "Circular Queue": {
    python: `class CircularQueue:
    def __init__(self, k):
        self.k = k
        self.queue = [None] * k
        self.head = -1
        self.tail = -1

    def enqueue(self, value):
        if ((self.tail + 1) % self.k) == self.head:
            return False # Full
        elif self.head == -1:
            self.head = 0
            self.tail = 0
            self.queue[self.tail] = value
        else:
            self.tail = (self.tail + 1) % self.k
            self.queue[self.tail] = value
        return True

    def dequeue(self):
        if self.head == -1:
            return False # Empty
        elif self.head == self.tail:
            self.queue[self.head] = None
            self.head = -1
            self.tail = -1
        else:
            self.queue[self.head] = None
            self.head = (self.head + 1) % self.k
        return True`,
    java: `public class CircularQueue {
    private int[] arr;
    private int front = -1, rear = -1, size;

    public CircularQueue(int k) {
        size = k;
        arr = new int[k];
    }

    public boolean enqueue(int value) {
        if ((rear + 1) % size == front) return false; // Full
        if (front == -1) front = 0;
        rear = (rear + 1) % size;
        arr[rear] = value;
        return true;
    }

    public boolean dequeue() {
        if (front == -1) return false; // Empty
        if (front == rear) {
            front = -1;
            rear = -1;
        } else {
            front = (front + 1) % size;
        }
        return true;
    }
}`,
    cpp: `#include <iostream>
using namespace std;

class CircularQueue {
    int rear, front, size;
    int *arr;
public:
    CircularQueue(int s) {
       front = rear = -1;
       size = s;
       arr = new int[s];
    }
    bool enqueue(int value) {
       if ((rear + 1) % size == front) return false; // Full
       if (front == -1) front = 0;
       rear = (rear + 1) % size;
       arr[rear] = value;
       return true;
    }
    bool dequeue() {
       if (front == -1) return false; // Empty
       if (front == rear) {
          front = rear = -1;
       } else {
          front = (front + 1) % size;
       }
       return true;
    }
};`
  },
  "Deque": {
    python: `from collections import deque

# Python has built-in collections.deque (double-ended queue)
d = deque()
d.append(10)      # Insert at rear
d.appendleft(20)  # Insert at front
d.pop()           # Delete from rear
d.popleft()       # Delete from front`,
    java: `import java.util.ArrayDeque;
import java.util.Deque;

public class DequeDemo {
    public static void main(String[] args) {
        Deque<Integer> deque = new ArrayDeque<>();
        deque.addFirst(10); // Insert front
        deque.addLast(20);  // Insert rear
        deque.removeFirst(); // Delete front
        deque.removeLast();  // Delete rear
    }
}`,
    cpp: `#include <iostream>
#include <deque>
using namespace std;

int main() {
    deque<int> dq;
    dq.push_front(10); // Insert front
    dq.push_back(20);  // Insert rear
    dq.pop_front();    // Delete front
    dq.pop_back();     // Delete rear
    return 0;
}`
  }
};

import { TopicInfo } from "../arrays/description";

export const queueDescriptions: Record<string, TopicInfo> = {
  "Enqueue Operation": {
    title: "Enqueue Operation",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    space: "O(1)",
    desc: "Inserting an element at the rear (end) of the queue.",
    about: "Enqueue adds an element to the back of the queue (FIFO - First In First Out behavior). In an array implementation, it checks for overflow and then inserts at the index pointed to by the Rear pointer, then increments Rear. Since elements are only appended to the end, it runs in constant time O(1).",
    keypoints: [
      "Adds a new element to the back (Rear) of the queue.",
      "Increments the Rear pointer.",
      "Takes constant time O(1) in both array and linked list forms.",
      "Throws an 'Overflow' error if the queue capacity is exceeded."
    ]
  },
  "Dequeue Operation": {
    title: "Dequeue Operation",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    space: "O(1)",
    desc: "Removing and returning the element at the front of the queue.",
    about: "Dequeue removes the element from the front of the queue (the oldest element). In a simple array, it retrieves the element at the Front pointer and increments Front. In linked list forms, it deletes the head node. Both operate at the front only, yielding O(1) time complexity.",
    keypoints: [
      "Removes and returns the element at the front of the queue.",
      "Increments the Front pointer.",
      "Takes constant time O(1) in optimal implementations.",
      "Throws an 'Underflow' error if the queue is empty."
    ]
  },
  "Circular Queue": {
    title: "Circular Queue",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    space: "O(1)",
    desc: "A queue where the last position connects back to the first position to form a circle.",
    about: "Standard queues suffer from memory wastage: after multiple dequeues, empty slots at the beginning cannot be reused because Rear only goes forward. A Circular Queue solves this by wrapping Rear and Front back to index 0 using modulo arithmetic: `rear = (rear + 1) % capacity`. This allows reuse of released slots without shifting elements.",
    keypoints: [
      "Maintains a ring structure, connecting the end back to the start.",
      "Pointers wrap around using: index = (index + 1) % capacity.",
      "Overcomes memory wastage of linear queues without shifting elements.",
      "Runs in O(1) time for both insertion and deletion."
    ]
  },
  "Deque": {
    title: "Deque",
    best: "O(1)",
    average: "O(1)",
    worst: "O(1)",
    space: "O(1)",
    desc: "Double-Ended Queue allowing insertion and deletion at both Front and Rear ends.",
    about: "A Deque (pronounced 'deck') is a generalized queue supporting insertion and deletion at both the front and rear. It can act as both a stack (LIFO) and a queue (FIFO) simultaneously. Optimal implementations (doubly linked list or circular buffer) achieve O(1) time for all four operations: pushFront, popFront, pushRear, and popRear.",
    keypoints: [
      "Double-Ended Queue supporting four main operations.",
      "Allows insertion at front/rear and deletion from front/rear.",
      "Can behave as both a Stack (LIFO) and a Queue (FIFO).",
      "Achieves O(1) constant time for all operations when using circular array or linked list."
    ]
  }
};

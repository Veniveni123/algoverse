import { TopicInfo } from "../arrays/description";

export const linkedListDescriptions: Record<string, TopicInfo> = {
  "Singly Linked List": {
    title: "Singly Linked List",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)",
    desc: "A linear collection of nodes where each node contains data and a pointer to the next node.",
    about: "A Singly Linked List is a dynamic data structure where each element (node) contains a data field and a reference ('next') pointing to the subsequent node. The list starts at a Head pointer and terminates when a node points to Null. Unlike arrays, nodes are not stored contiguously in memory, meaning size can grow dynamically. Insertion/deletion at head is O(1) time, while traversing to access or delete a middle node takes O(n) time.",
    keypoints: [
      "Each node contains data and a single reference pointing to the next node.",
      "Dynamic size allows memory reallocation on the fly.",
      "Head insertion/deletion is extremely fast: O(1) time.",
      "Accessing or modifying a node at index k requires traversal from the Head node: O(k) or O(n) time."
    ]
  },
  "Doubly Linked List": {
    title: "Doubly Linked List",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)",
    desc: "A collection of nodes containing data, a next pointer, and a previous pointer.",
    about: "A Doubly Linked List (DLL) extends a Singly Linked List by adding a 'prev' reference inside each node pointing to the preceding node. This allows bidirectional traversal (forward and backward). While DLLs require more memory per node (for the extra pointer) and involve updating more references during insertions/deletions, they allow deleting a given node in O(1) time if a reference to it is already available.",
    keypoints: [
      "Nodes contain data, a next pointer, and a prev pointer.",
      "Supports bidirectional traversal (both next and prev pointers).",
      "Easier deletion of a given node in O(1) time if its reference is known.",
      "Requires extra pointer storage memory per node compared to singly linked lists."
    ]
  }
};

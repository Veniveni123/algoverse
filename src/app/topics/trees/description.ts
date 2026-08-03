import { TopicInfo } from "../arrays/description";

export const treesDescriptions: Record<string, TopicInfo> = {
  "Binary Tree": {
    title: "Binary Tree",
    best: "O(log n)",
    average: "O(log n)",
    worst: "O(n)",
    space: "O(n)",
    desc: "A hierarchical structure where each node has at most two children: left and right.",
    about: "A Binary Tree is a non-linear data structure where each node contains a value and references to at most two child nodes, referred to as the left child and the right child. The topmost node is the Root. Binary trees are fundamental for representing hierarchical data like folder structures, expressions (expression trees), and decision processes. In a balanced binary tree of size n, path depth is O(log n), but in a skewed tree, it can degrade to linear O(n).",
    keypoints: [
      "Each node has at most two children (left and right).",
      "Root is the top node; leaves are nodes with no children.",
      "Depth of a balanced tree is O(log n), but a skewed tree has O(n) depth.",
      "Useful for hierarchical modeling, parsing expressions, and decision trees."
    ]
  },
  "Binary Search Tree (BST)": {
    title: "Binary Search Tree (BST)",
    best: "O(log n)",
    average: "O(log n)",
    worst: "O(n)",
    space: "O(n)",
    desc: "A Binary Tree where left children are smaller and right children are larger than the parent node.",
    about: "A Binary Search Tree (BST) is a node-based binary tree data structure which has the ordering property: for any given node, all keys in its left subtree are less than or equal to its key, and all keys in its right subtree are greater than its key. This ordering makes searching, insertion, and deletion highly efficient, performing in O(log n) logarithmic time on average because each comparison eliminates half the remaining subtrees.",
    keypoints: [
      "Ordering constraint: Left child < Parent < Right child.",
      "Allows logarithmic O(log n) average search, insertion, and deletion.",
      "If values are inserted in sorted order, the tree becomes skewed (like a linked list) and search degrades to O(n).",
      "Forms the basis for self-balancing search trees like AVL trees and Red-Black trees."
    ]
  },
  "Inorder Traversal": {
    title: "Inorder Traversal",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(h)",
    desc: "Traverses tree in order: Left subtree -> Root -> Right subtree.",
    about: "Inorder Traversal is a depth-first traversal method for binary trees. It visits nodes in the following recursive sequence: first traverse the Left subtree, then visit the Root node, and finally traverse the Right subtree. An important property of Inorder traversal on a Binary Search Tree (BST) is that it visits nodes in ascending, sorted order.",
    keypoints: [
      "Traversal sequence: Left Subtree -> Root -> Right Subtree.",
      "On a Binary Search Tree (BST), Inorder traversal prints values in sorted ascending order.",
      "Time complexity is O(n) since every node must be visited exactly once.",
      "Uses O(h) recursion stack space, where h is the height of the tree."
    ]
  },
  "Preorder Traversal": {
    title: "Preorder Traversal",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(h)",
    desc: "Traverses tree in order: Root -> Left subtree -> Right subtree.",
    about: "Preorder Traversal is a depth-first traversal method. It visits nodes in the sequence: Root node first, then traverse the Left subtree, and finally traverse the Right subtree. It is commonly used to create a copy of the tree, serialize tree structures, or evaluate prefix expressions.",
    keypoints: [
      "Traversal sequence: Root -> Left Subtree -> Right Subtree.",
      "Visits parents before children (useful for cloning or serializing trees).",
      "Time complexity is O(n) to visit all nodes.",
      "Uses O(h) recursion stack space."
    ]
  },
  "Postorder Traversal": {
    title: "Postorder Traversal",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(h)",
    desc: "Traverses tree in order: Left subtree -> Right subtree -> Root.",
    about: "Postorder Traversal is a depth-first traversal method. It visits nodes in the sequence: first traverse the Left subtree, then traverse the Right subtree, and finally visit the Root node. It is widely used to delete/free nodes of a tree (deleting children before parents) or evaluate postfix expressions (like in calculators).",
    keypoints: [
      "Traversal sequence: Left Subtree -> Right Subtree -> Root.",
      "Visits children before parents (useful for bottom-up calculations or tree deletion).",
      "Time complexity is O(n).",
      "Space complexity is O(h) recursion call-stack depth."
    ]
  }
};

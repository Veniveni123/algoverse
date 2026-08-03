import { CodeSnippet } from "../arrays/code";

export const treesCodeSnippets: Record<string, CodeSnippet> = {
  "Binary Tree": {
    python: `class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

# Create binary tree
root = Node(1)
root.left = Node(2)
root.right = Node(3)`,
    java: `class Node {
    int key;
    Node left, right;
    
    public Node(int item) {
        key = item;
        left = right = null;
    }
}

public class BinaryTree {
    Node root;
    
    public static void main(String[] args) {
        BinaryTree tree = new BinaryTree();
        tree.root = new Node(1);
        tree.root.left = new Node(2);
        tree.root.right = new Node(3);
    }
}`,
    cpp: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* left;
    Node* right;
    Node(int val) {
        data = val;
        left = right = nullptr;
    }
};

int main() {
    Node* root = new Node(1);
    root->left = new Node(2);
    root->right = new Node(3);
    return 0;
}`
  },
  "Binary Search Tree (BST)": {
    python: `class Node:
    def __init__(self, key):
        self.left = None
        self.right = None
        self.val = key

def insert(root, key):
    if root is None:
        return Node(key)
        
    if key < root.val:
        root.left = insert(root.left, key)
    else:
        root.right = insert(root.right, key)
        
    return root

def search(root, key):
    if root is None or root.val == key:
        return root
        
    if key < root.val:
        return search(root.left, key)
        
    return search(root.right, key)`,
    java: `class Node {
    int val;
    Node left, right;
    Node(int item) { val = item; }
}

public class BST {
    Node root;

    Node insert(Node root, int key) {
        if (root == null) {
            return new Node(key);
        }
        if (key < root.val) {
            root.left = insert(root.left, key);
        } else if (key > root.val) {
            root.right = insert(root.right, key);
        }
        return root;
    }

    Node search(Node root, int key) {
        if (root == null || root.val == key) return root;
        if (key < root.val) return search(root.left, key);
        return search(root.right, key);
    }
}`,
    cpp: `#include <iostream>
using namespace std;

struct Node {
    int val;
    Node* left;
    Node* right;
    Node(int d) { val = d; left = right = nullptr; }
};

Node* insert(Node* root, int key) {
    if (root == nullptr) return new Node(key);
    if (key < root->val)
        root->left = insert(root->left, key);
    else
        root->right = insert(root->right, key);
    return root;
}

Node* search(Node* root, int key) {
    if (root == nullptr || root->val == key) return root;
    if (key < root->val) return search(root->left, key);
    return search(root->right, key);
}`
  },
  "Inorder Traversal": {
    python: `def inorder(root):
    if root:
        inorder(root.left)
        print(root.val, end=" ")
        inorder(root.right)`,
    java: `void inorder(Node node) {
    if (node == null) return;
    inorder(node.left);
    System.out.print(node.val + " ");
    inorder(node.right);
}`,
    cpp: `void inorder(Node* root) {
    if (root == nullptr) return;
    inorder(root->left);
    cout << root->val << " ";
    inorder(root->right);
}`
  },
  "Preorder Traversal": {
    python: `def preorder(root):
    if root:
        print(root.val, end=" ")
        preorder(root.left)
        preorder(root.right)`,
    java: `void preorder(Node node) {
    if (node == null) return;
    System.out.print(node.val + " ");
    preorder(node.left);
    preorder(node.right);
}`,
    cpp: `void preorder(Node* root) {
    if (root == nullptr) return;
    cout << root->val << " ";
    preorder(root->left);
    preorder(root->right);
}`
  },
  "Postorder Traversal": {
    python: `def postorder(root):
    if root:
        postorder(root.left)
        postorder(root.right)
        print(root.val, end=" ")`,
    java: `void postorder(Node node) {
    if (node == null) return;
    postorder(node.left);
    postorder(node.right);
    System.out.print(node.val + " ");
}`,
    cpp: `void postorder(Node* root) {
    if (root == nullptr) return;
    postorder(root->left);
    postorder(root->right);
    cout << root->val << " ";
}`
  }
};

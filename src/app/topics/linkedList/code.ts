import { CodeSnippet } from "../arrays/code";

export const linkedListCodeSnippets: Record<string, CodeSnippet> = {
  "Singly Linked List": {
    python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class SinglyLinkedList:
    def __init__(self):
        self.head = None

    def insert_at_head(self, val):
        new_node = Node(val)
        new_node.next = self.head
        self.head = new_node

    def delete_node(self, key):
        temp = self.head
        if temp is not None and temp.data == key:
            self.head = temp.next
            return
        
        prev = None
        while temp is not None and temp.data != key:
            prev = temp
            temp = temp.next
            
        if temp is None:
            return
            
        prev.next = temp.next`,
    java: `class Node {
    int data;
    Node next;
    Node(int d) {
        data = d;
        next = null;
    }
}

public class SinglyLinkedList {
    Node head;

    public void insertAtHead(int val) {
        Node newNode = new Node(val);
        newNode.next = head;
        head = newNode;
    }

    public void deleteNode(int key) {
        Node temp = head, prev = null;
        if (temp != null && temp.data == key) {
            head = temp.next;
            return;
        }
        while (temp != null && temp.data != key) {
            prev = temp;
            temp = temp.next;
        }
        if (temp == null) return;
        prev.next = temp.next;
    }
}`,
    cpp: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) {
        data = val;
        next = nullptr;
    }
};

class SinglyLinkedList {
    Node* head;
public:
    SinglyLinkedList() { head = nullptr; }
    void insertAtHead(int val) {
        Node* newNode = new Node(val);
        newNode->next = head;
        head = newNode;
    }
    void deleteNode(int key) {
        Node* temp = head;
        Node* prev = nullptr;
        if (temp != nullptr && temp->data == key) {
            head = temp->next;
            delete temp;
            return;
        }
        while (temp != nullptr && temp->data != key) {
            prev = temp;
            temp = temp->next;
        }
        if (temp == nullptr) return;
        prev->next = temp->next;
        delete temp;
    }
};`
  },
  "Doubly Linked List": {
    python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None

class DoublyLinkedList:
    def __init__(self):
        self.head = None

    def insert_at_head(self, val):
        new_node = Node(val)
        new_node.next = self.head
        if self.head is not None:
            self.head.prev = new_node
        self.head = new_node

    def delete_node(self, node_to_delete):
        if self.head is None or node_to_delete is None:
            return
            
        if self.head == node_to_delete:
            self.head = node_to_delete.next
            
        if node_to_delete.next is not None:
            node_to_delete.next.prev = node_to_delete.prev
            
        if node_to_delete.prev is not None:
            node_to_delete.prev.next = node_to_delete.next`,
    java: `class Node {
    int data;
    Node next, prev;
    Node(int d) {
        data = d;
        next = prev = null;
    }
}

public class DoublyLinkedList {
    Node head;

    public void insertAtHead(int val) {
        Node newNode = new Node(val);
        newNode.next = head;
        if (head != null) {
            head.prev = newNode;
        }
        head = newNode;
    }

    public void deleteNode(Node del) {
        if (head == null || del == null) return;
        if (head == del) head = del.next;
        if (del.next != null) del.next.prev = del.prev;
        if (del.prev != null) del.prev.next = del.next;
    }
}`,
    cpp: `#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
    Node* prev;
    Node(int d) {
        data = d;
        next = prev = nullptr;
    }
};

class DoublyLinkedList {
    Node* head;
public:
    DoublyLinkedList() { head = nullptr; }
    void insertAtHead(int val) {
        Node* newNode = new Node(val);
        newNode->next = head;
        if (head != nullptr) {
            head->prev = newNode;
        }
        head = newNode;
    }
    void deleteNode(Node* del) {
        if (head == nullptr || del == nullptr) return;
        if (head == del) head = del->next;
        if (del->next != nullptr) del->next->prev = del->prev;
        if (del->prev != nullptr) del->prev->next = del->next;
        delete del;
    }
};`
  }
};

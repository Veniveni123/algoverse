export type CodeSnippet = {
  python: string;
  java: string;
  cpp: string;
};
export const arrayCodeSnippets: Record<string, CodeSnippet> = {
  "Array Traversal": {
    python: `def traverse_array(arr):
    # Iterate through elements
    for i in range(len(arr)):
        print(f"Element at index {i}: {arr[i]}")
# Example usage
arr = [10, 20, 30, 40, 50]
traverse_array(arr)`,
    java: `public class ArrayTraversal {
    public static void traverse(int[] arr) {
        // Iterate through elements
        for (int i = 0; i < arr.length; i++) {
            System.out.println("Element at index " + i + ": " + arr[i]);
        }
    }
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        traverse(arr);
    }
}`,
    cpp: `#include <iostream>
using namespace std;
void traverseArray(int arr[], int size) {
    // Iterate through elements
    for (int i = 0; i < size; i++) {
        cout << "Element at index " << i << ": " << arr[i] << endl;
    }
}
int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int size = sizeof(arr) / sizeof(arr[0]);
    traverseArray(arr, size);
    return 0;
}`,
  },
  "Array Insertion": {
    python: `def insert_at_index(arr, element, index):
    # Verify index bounds
    if index < 0 or index > len(arr):
        return arr
    
    # Python's built-in list insertion mimics shifting
    arr.insert(index, element)
    return arr
# Manual implementation (fixed size array)
def insert_manual(arr, n, element, index, capacity):
    if n >= capacity or index < 0 or index > n:
        return n
    
    # Shift elements to the right
    for i in range(n - 1, index - 1, -1):
        arr[i + 1] = arr[i]
        
    arr[index] = element
    return n + 1`,
    java: `public class ArrayInsertion {
    // Inserts element at specific index in array of size n
    public static int insert(int[] arr, int n, int element, int index, int capacity) {
        // Check if there is space
        if (n >= capacity || index < 0 || index > n) {
            return n;
        }
        // Shift elements to the right
        for (int i = n - 1; i >= index; i--) {
            arr[i + 1] = arr[i];
        }
        // Insert element
        arr[index] = element;
        return n + 1; // Return new size
    }
}`,
    cpp: `#include <iostream>
using namespace std;
int insertAtIndex(int arr[], int n, int element, int index, int capacity) {
    if (n >= capacity || index < 0 || index > n) {
        return n; // No insertion
    }
    // Shift elements to the right
    for (int i = n - 1; i >= index; i--) {
        arr[i + 1] = arr[i];
    }
    // Place the element
    arr[index] = element;
    return n + 1; // Return new size
}`,
  },
  "Array Deletion": {
    python: `def delete_at_index(arr, index):
    if index < 0 or index >= len(arr):
        return arr
    
    # Python built-in pop mimics shifting left
    arr.pop(index)
    return arr
# Manual implementation (shifting left)
def delete_manual(arr, n, index):
    if index < 0 or index >= n:
        return n
        
    # Shift elements to the left
    for i in range(index, n - 1):
        arr[i] = arr[i + 1]
        
    arr[n - 1] = 0 # Optional reset
    return n - 1`,
    java: `public class ArrayDeletion {
    public static int deleteElement(int[] arr, int n, int index) {
        if (index < 0 || index >= n) {
            return n; // Invalid index
        }
        // Shift elements to the left
        for (int i = index; i < n - 1; i++) {
            arr[i] = arr[i + 1];
        }
        arr[n - 1] = 0; // Clear last slot
        return n - 1; // Return new size
    }
}`,
    cpp: `#include <iostream>
using namespace std;
int deleteElement(int arr[], int n, int index) {
    if (index < 0 || index >= n) {
        return n; // Invalid index
    }
    // Shift elements to the left
    for (int i = index; i < n - 1; i++) {
        arr[i] = arr[i + 1];
    }
    return n - 1; // Return new size
}`,
  },
  "Array Searching": {
    python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i # Target found at index i
    return -1 # Target not found
# Example
arr = [64, 34, 25, 12, 22]
print(linear_search(arr, 25)) # Output: 2`,
    java: `public class ArraySearching {
    public static int search(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i; // Target found
            }
        }
        return -1; // Not found
    }
}`,
    cpp: `#include <iostream>
using namespace std;
int linearSearch(int arr[], int size, int target) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) {
            return i; // Found
        }
    }
    return -1; // Not found
}`,
  },
};

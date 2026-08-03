export type TopicInfo = {
  title: string;
  best: string;
  average: string;
  worst: string;
  space: string;
  desc: string;
  about: string;
  keypoints: string[];
};

export const arrayDescriptions: Record<string, TopicInfo> = {
  "Array Traversal": {
    title: "Array Traversal",
    best: "O(n)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)",
    desc: "Visiting each element of the array exactly once to inspect or process values.",
    about: "Array Traversal is the most fundamental array operation. It involves visiting each element of the array sequentially from the first index (0) to the last index (n-1). It is used for operations like printing all elements, summing values, or finding minimum/maximum elements. Since every element must be visited, the time complexity is linear O(n).",
    keypoints: [
      "Visits each element from index 0 to n-1 sequentially.",
      "Time complexity is O(n) as it depends directly on the array size.",
      "Requires constant auxiliary space O(1).",
      "Foundation for other operations like linear search, filtering, and aggregation."
    ]
  },
  "Array Insertion": {
    title: "Array Insertion",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1) or O(n)",
    desc: "Inserting a new element at a specific index, shifting subsequent elements to the right.",
    about: "Array Insertion adds a new value at a given position. In fixed-size arrays, inserting at index `i` requires shifting all elements from index `i` to `n-1` one position to the right to make room. Inserting at the end is O(1) (best case), whereas inserting at the beginning requires shifting all elements, making it O(n) (worst case).",
    keypoints: [
      "Inserting at the end is O(1) since no elements need to be shifted.",
      "Inserting at the beginning or middle requires shifting elements to the right: O(n) complexity.",
      "If the array is full, resizing/reallocation might be required, which takes O(n) space and time.",
      "Pointers must be updated carefully to avoid overwriting values."
    ]
  },
  "Array Deletion": {
    title: "Array Deletion",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)",
    desc: "Removing an element at a specific index, shifting subsequent elements to the left.",
    about: "Array Deletion removes an element from a given index. To maintain contiguous memory, all elements to the right of the deleted index must be shifted one position to the left. Deleting the last element is O(1) (best case). Deleting the first element requires shifting all remaining elements, resulting in O(n) time complexity.",
    keypoints: [
      "Deleting the last element requires no shifts and is O(1).",
      "Deleting the first or middle element requires shifting elements to the left to close the gap: O(n) complexity.",
      "The logical size of the array decreases by 1 after deletion.",
      "Does not release memory immediately in fixed-size contiguous allocations."
    ]
  },
  "Array Searching": {
    title: "Array Searching",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)",
    desc: "Scanning the array to find the index of a target element.",
    about: "Searching in an unsorted array is done using Linear Search, checking each element sequentially from index 0. If the target is found at the first position, it takes O(1) time. In the worst case, the target is at the end or not present, requiring n comparisons (O(n) time). If the array is sorted, Binary Search can be used instead for O(log n) efficiency.",
    keypoints: [
      "Unsorted arrays require Linear Search with O(n) complexity.",
      "Checks elements one-by-one until a match is found or the end is reached.",
      "Best case is O(1) when the target is at the first index.",
      "No extra memory is required (O(1) space)."
    ]
  }
};

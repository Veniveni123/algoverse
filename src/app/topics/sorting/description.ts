import { TopicInfo } from "../arrays/description";

export const sortingDescriptions: Record<string, TopicInfo> = {
  "Bubble Sort": {
    title: "Bubble Sort",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    desc: "Repeatedly swaps adjacent elements if they are in the wrong order.",
    about: "Bubble Sort is the simplest sorting algorithm. It works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order. The pass through the list is repeated until the list is sorted. It is called bubble sort because smaller elements bubble to the top of the list with each iteration. Although simple, it is not suitable for large datasets as its average and worst case time complexity is quadratic O(n²).",
    keypoints: [
      "Compares adjacent elements and swaps if arr[j] > arr[j+1].",
      "In each pass, the largest unsorted element bubbles up to its correct position.",
      "Optimized version can stop early if a pass completes with zero swaps (making best case O(n)).",
      "Stable sorting algorithm with constant auxiliary space O(1)."
    ]
  },
  "Selection Sort": {
    title: "Selection Sort",
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    desc: "Repeatedly finds the minimum element and places it at the beginning of the unsorted segment.",
    about: "Selection Sort divides the array into sorted and unsorted regions. It repeatedly selects the smallest element from the unsorted region and swaps it with the first element of the unsorted region, extending the sorted boundary by one. Unlike Bubble Sort, it makes the minimum number of swaps — exactly n-1 swaps in the worst case. However, its comparisons are always O(n²).",
    keypoints: [
      "Finds minimum index in the unsorted suffix and swaps it to the boundary index.",
      "Performs a minimal number of write swaps: exactly O(n).",
      "Comparisons are always quadratic O(n²), even if the array is already sorted.",
      "Unstable sort that uses O(1) extra space."
    ]
  },
  "Insertion Sort": {
    title: "Insertion Sort",
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    desc: "Builds the sorted array one element at a time by inserting into its correct position.",
    about: "Insertion Sort builds the final sorted array one item at a time. It is much like sorting a hand of playing cards. It takes each element and inserts it into its correct position among the already sorted elements. It is highly efficient for small datasets and nearly sorted arrays (runs in linear O(n) time). It is also an online algorithm, meaning it can sort as it receives new data.",
    keypoints: [
      "Inserts the current element into its correct sorted location in the left partition.",
      "Extremely fast for nearly sorted arrays (O(n) best case).",
      "Stable, in-place, and online algorithm.",
      "Simple to implement with low overhead."
    ]
  },
  "Merge Sort": {
    title: "Merge Sort",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
    desc: "Divides array in half recursively, sorts each half, then merges them back together.",
    about: "Merge Sort is a divide and conquer algorithm. It divides the input array into two halves, recursively sorts each half, and then merges the two sorted halves. It guarantees O(n log n) time in all cases making it very reliable. The downside is it requires O(n) extra space to perform the merge. It is the preferred algorithm for sorting linked lists and is stable.",
    keypoints: [
      "Divides list at middle index, recursively sorts halves, and merges them.",
      "Guarantees O(n log n) complexity in all cases (best, average, and worst).",
      "Requires O(n) helper memory, which can be expensive for very large arrays.",
      "Stable sort that is highly parallelizable."
    ]
  },
  "Quick Sort": {
    title: "Quick Sort",
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)",
    desc: "Picks a pivot element and partitions the array around it recursively.",
    about: "Quick Sort is a highly efficient divide and conquer sorting algorithm. It works by selecting a pivot element and partitioning the array around it so elements smaller than the pivot go left and larger go right. It then recursively sorts the two partitions. In practice it is faster than Merge Sort due to better cache performance. The worst case O(n²) occurs with poor pivot selection but can be avoided with a randomized pivot.",
    keypoints: [
      "Selects a pivot (e.g. last element) and partitions others into smaller or larger.",
      "Highly efficient in practice with excellent cache locality.",
      "Worst-case O(n²) can occur when array is already sorted, but solved via random pivots.",
      "In-place but unstable sort with O(log n) call-stack space complexity."
    ]
  }
};

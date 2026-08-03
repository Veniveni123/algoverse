import { TopicInfo } from "../arrays/description";

export const searchingDescriptions: Record<string, TopicInfo> = {
  "Linear Search": {
    title: "Linear Search",
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)",
    desc: "Checks each element sequentially from start to end until a match is found.",
    about: "Linear Search is the simplest searching method. It starts at the first index (0) and sequentially inspects each element one-by-one until the target value is found or the end of the array is reached. It does not require the array to be sorted and works on any contiguous list. Best case takes O(1) time (target at first index), while average and worst cases take linear O(n) time.",
    keypoints: [
      "Visits each element sequentially from index 0 to n-1.",
      "Works on both sorted and unsorted lists.",
      "Time complexity is O(n) in the average and worst cases.",
      "Requires no extra storage memory (runs in constant O(1) space)."
    ]
  },
  "Binary Search": {
    title: "Binary Search",
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
    space: "O(1)",
    desc: "Divides a sorted search space in half repeatedly to locate the target.",
    about: "Binary Search is a highly efficient search algorithm designed for sorted arrays. It works on the divide and conquer principle. It keeps track of a search range using Low and High boundaries, computes the midpoint index, and compares the target value with the midpoint element. If they match, the search terminates. Otherwise, it halves the search range: if target is smaller, the High bound becomes mid-1; if target is larger, the Low bound becomes mid+1. This achieves logarithmic O(log n) efficiency.",
    keypoints: [
      "Requires the input array to be sorted beforehand.",
      "Repeatedly eliminates half of the remaining elements from the search space.",
      "Time complexity is O(log n), which is extremely fast for large datasets.",
      "Space complexity is constant O(1) for iterative implementations."
    ]
  }
};

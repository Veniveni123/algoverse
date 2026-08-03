import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const complexityMap: Record<
  string,
  {
    best: string;
    average: string;
    worst: string;
    space: string;
    desc: string;
    about: string;
  }
> = {
  "Bubble Sort": {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    desc: "Repeatedly swaps adjacent elements if they are in wrong order.",
    about:
      "Bubble Sort is the simplest sorting algorithm. It works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order. The pass through the list is repeated until the list is sorted. It is called bubble sort because smaller elements bubble to the top of the list with each iteration. Although simple, it is not suitable for large datasets as its average and worst case time complexity is O(n²).",
  },
  "Selection Sort": {
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    desc: "Finds minimum element and places it at the beginning each pass.",
    about:
      "Selection Sort divides the array into a sorted and unsorted region. It repeatedly selects the smallest element from the unsorted region and moves it to the end of the sorted region. Unlike Bubble Sort, it makes the minimum number of swaps — exactly n-1 swaps in the worst case. It performs well on small lists but is inefficient on large lists.",
  },
  "Insertion Sort": {
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    desc: "Builds sorted array one element at a time by inserting into correct position.",
    about:
      "Insertion Sort builds the final sorted array one item at a time. It is much like sorting a hand of playing cards. It takes each element and inserts it into its correct position among the already sorted elements. It is efficient for small datasets and nearly sorted arrays. It is also an online algorithm meaning it can sort as it receives data.",
  },
  "Merge Sort": {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
    desc: "Divides array in half, sorts each half, then merges them back together.",
    about:
      "Merge Sort is a divide and conquer algorithm. It divides the input array into two halves, recursively sorts each half, and then merges the two sorted halves. It guarantees O(n log n) time in all cases making it very reliable. The downside is it requires O(n) extra space. It is the preferred algorithm for sorting linked lists and is used in most standard library sort implementations.",
  },
  "Quick Sort": {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)",
    desc: "Picks a pivot element and partitions array around it recursively.",
    about:
      "Quick Sort is a highly efficient divide and conquer sorting algorithm. It works by selecting a pivot element and partitioning the array around it so elements smaller than pivot go left and larger go right. It then recursively sorts the two partitions. In practice it is faster than Merge Sort due to better cache performance. The worst case O(n²) occurs with poor pivot selection but can be avoided with randomized pivot.",
  },
  "Heap Sort": {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(1)",
    desc: "Builds a max heap and repeatedly extracts the maximum element.",
    about:
      "Heap Sort uses a binary heap data structure. It first builds a max heap from the data, then repeatedly extracts the maximum element and places it at the end of the array. It has the advantage of O(n log n) worst case and O(1) space unlike Merge Sort. However it has poor cache performance compared to Quick Sort making it slower in practice despite same theoretical complexity.",
  },
  "Linear Search": {
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)",
    desc: "Checks each element one by one until target is found.",
    about:
      "Linear Search is the simplest search algorithm. It sequentially checks each element of the list until a match is found or the whole list has been searched. It works on both sorted and unsorted arrays. While simple it is inefficient for large datasets. It is useful when the array is small, unsorted, or when you need to search for multiple elements in a single pass.",
  },
  "Binary Search": {
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
    space: "O(1)",
    desc: "Divides sorted array in half repeatedly to find target.",
    about:
      "Binary Search is a highly efficient algorithm that works on sorted arrays. It repeatedly divides the search space in half by comparing the target with the middle element. If target is smaller it searches the left half, if larger it searches the right half. With each step it eliminates half the remaining elements making it extremely fast with O(log n) time. Searching 1 million elements takes at most 20 comparisons.",
  },
  "Jump Search": {
    best: "O(1)",
    average: "O(√n)",
    worst: "O(√n)",
    space: "O(1)",
    desc: "Jumps ahead by fixed steps then does linear search in block.",
    about:
      "Jump Search works on sorted arrays by jumping ahead by a fixed number of steps (√n) instead of checking every element. Once it finds a block where the target could be, it performs a linear search within that block. It is faster than linear search but slower than binary search. It is useful when backward traversal is expensive as it only moves forward unlike binary search.",
  },
  "Interpolation Search": {
    best: "O(1)",
    average: "O(log log n)",
    worst: "O(n)",
    space: "O(1)",
    desc: "Estimates position of target using interpolation formula.",
    about:
      "Interpolation Search is an improved version of Binary Search for uniformly distributed sorted arrays. Instead of always going to the middle it estimates the position of the target using a formula similar to how humans search a phone book. For uniformly distributed data it achieves O(log log n) which is significantly faster than binary search. However for non-uniform distributions it can degrade to O(n).",
  },
};

const codeMap: Record<string, { python: string; java: string; cpp: string }> = {
  "Bubble Sort": {
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n-1):
        for j in range(n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

arr = [64, 34, 25, 12, 22]
print(bubble_sort(arr))`,
    java: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}`,
    cpp: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j], arr[j+1]);
            }
        }
    }
}`,
  },
  "Selection Sort": {
    python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    java: `void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n-1; i++) {
        int minIdx = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        int temp = arr[minIdx];
        arr[minIdx] = arr[i];
        arr[i] = temp;
    }
}`,
    cpp: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        int minIdx = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
  },
  "Insertion Sort": {
    python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key
    return arr`,
    java: `void insertionSort(int[] arr) {
    int n = arr.length;
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = key;
    }
}`,
    cpp: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = key;
    }
}`,
  },
  "Merge Sort": {
    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
    java: `void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = (l + r) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m+1, r);
        merge(arr, l, m, r);
    }
}
void merge(int[] arr, int l, int m, int r) {
    int[] left = Arrays.copyOfRange(arr, l, m+1);
    int[] right = Arrays.copyOfRange(arr, m+1, r+1);
    int i = 0, j = 0, k = l;
    while (i < left.length && j < right.length)
        arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
}`,
    cpp: `void merge(int arr[], int l, int m, int r) {
    vector<int> left(arr+l, arr+m+1);
    vector<int> right(arr+m+1, arr+r+1);
    int i=0, j=0, k=l;
    while(i<left.size() && j<right.size())
        arr[k++] = left[i]<=right[j] ? left[i++] : right[j++];
    while(i<left.size()) arr[k++]=left[i++];
    while(j<right.size()) arr[k++]=right[j++];
}
void mergeSort(int arr[], int l, int r) {
    if(l < r) {
        int m = (l+r)/2;
        mergeSort(arr, l, m);
        mergeSort(arr, m+1, r);
        merge(arr, l, m, r);
    }
}`,
  },
  "Quick Sort": {
    python: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi-1)
        quick_sort(arr, pi+1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1`,
    java: `void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi-1);
        quickSort(arr, pi+1, high);
    }
}
int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i+1];
    arr[i+1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`,
    cpp: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i+1], arr[high]);
    return i + 1;
}
void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi-1);
        quickSort(arr, pi+1, high);
    }
}`,
  },
  "Heap Sort": {
    python: `def heap_sort(arr):
    n = len(arr)
    for i in range(n//2-1, -1, -1):
        heapify(arr, n, i)
    for i in range(n-1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)

def heapify(arr, n, i):
    largest = i
    l, r = 2*i+1, 2*i+2
    if l < n and arr[l] > arr[largest]: largest = l
    if r < n and arr[r] > arr[largest]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
    java: `void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n/2-1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n-1; i > 0; i--) {
        int temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        heapify(arr, i, 0);
    }
}
void heapify(int[] arr, int n, int i) {
    int largest = i, l = 2*i+1, r = 2*i+2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int temp = arr[i]; arr[i] = arr[largest]; arr[largest] = temp;
        heapify(arr, n, largest);
    }
}`,
    cpp: `void heapify(int arr[], int n, int i) {
    int largest = i, l = 2*i+1, r = 2*i+2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}
void heapSort(int arr[], int n) {
    for (int i = n/2-1; i >= 0; i--)
        heapify(arr, n, i);
    for (int i = n-1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
  },
  "Linear Search": {
    python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i  # Found at index i
    return -1  # Not found

arr = [11, 12, 22, 25, 34, 64, 90]
print(linear_search(arr, 25))  # Output: 3`,
    java: `int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target)
            return i;
    }
    return -1;
}`,
    cpp: `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target)
            return i;
    }
    return -1;
}`,
  },
  "Binary Search": {
    python: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
    java: `int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
    cpp: `int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
  },
  "Jump Search": {
    python: `import math
def jump_search(arr, target):
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0
    while arr[min(step,n)-1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n: return -1
    while arr[prev] < target:
        prev += 1
        if prev == min(step, n): return -1
    if arr[prev] == target: return prev
    return -1`,
    java: `int jumpSearch(int[] arr, int target) {
    int n = arr.length;
    int step = (int)Math.sqrt(n);
    int prev = 0;
    while (arr[Math.min(step,n)-1] < target) {
        prev = step;
        step += (int)Math.sqrt(n);
        if (prev >= n) return -1;
    }
    while (arr[prev] < target) {
        prev++;
        if (prev == Math.min(step,n)) return -1;
    }
    return arr[prev] == target ? prev : -1;
}`,
    cpp: `int jumpSearch(int arr[], int n, int target) {
    int step = sqrt(n), prev = 0;
    while (arr[min(step,n)-1] < target) {
        prev = step;
        step += sqrt(n);
        if (prev >= n) return -1;
    }
    while (arr[prev] < target) {
        prev++;
        if (prev == min(step,n)) return -1;
    }
    return arr[prev] == target ? prev : -1;
}`,
  },
  "Interpolation Search": {
    python: `def interpolation_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high and target >= arr[low] and target <= arr[high]:
        pos = low + ((target - arr[low]) * (high - low)
                     // (arr[high] - arr[low]))
        if arr[pos] == target: return pos
        elif arr[pos] < target: low = pos + 1
        else: high = pos - 1
    return -1`,
    java: `int interpolationSearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high && target >= arr[low] && target <= arr[high]) {
        int pos = low + ((target-arr[low])*(high-low)/(arr[high]-arr[low]));
        if (arr[pos] == target) return pos;
        else if (arr[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    return -1;
}`,
    cpp: `int interpolationSearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high && target >= arr[low] && target <= arr[high]) {
        int pos = low + ((target-arr[low])*(high-low)/(arr[high]-arr[low]));
        if (arr[pos] == target) return pos;
        else if (arr[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    return -1;
}`,
  },
};

const SEARCH_TARGET = 25;
const searchingAlgos = [
  "Linear Search",
  "Binary Search",
  "Jump Search",
  "Interpolation Search",
];

const generateArray = (size: number, type: string): number[] => {
  const arr = Array.from(
    { length: size },
    () => Math.floor(Math.random() * 100) + 1,
  );
  if (type === "sorted") return [...arr].sort((a, b) => a - b);
  if (type === "reverse") return [...arr].sort((a, b) => b - a);
  if (type === "nearly") {
    const sorted = [...arr].sort((a, b) => a - b);
    for (let i = 0; i < Math.floor(size * 0.1); i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      [sorted[x], sorted[y]] = [sorted[y], sorted[x]];
    }
    return sorted;
  }
  return arr;
};

export default function VisualizerScreen() {
  const { algo } = useLocalSearchParams<{ algo: string }>();
  const isSearching = searchingAlgos.includes(algo as string);
  const info = complexityMap[algo as string];
  const code = codeMap[algo as string];

  const [array, setArray] = useState(
    isSearching ? [11, 12, 22, 25, 34, 64, 90] : [64, 34, 25, 12, 22, 11, 90],
  );
  const [currentStep, setCurrentStep] = useState("");
  const [comparing, setComparing] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [found, setFound] = useState<number>(-1);
  const [visited, setVisited] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [swapCount, setSwapCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"visualize" | "code" | "learn">(
    "visualize",
  );
  const [activeLang, setActiveLang] = useState<"python" | "java" | "cpp">(
    "python",
  );
  const [speed, setSpeed] = useState(600);
  const [arraySize, setArraySize] = useState("7");
  const [customValues, setCustomValues] = useState("");
  const [datasetType, setDatasetType] = useState("random");

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const resetArray = () => {
    setArray(
      isSearching ? [11, 12, 22, 25, 34, 64, 90] : [64, 34, 25, 12, 22, 11, 90],
    );
    setComparing([]);
    setSorted([]);
    setFound(-1);
    setVisited([]);
    setCurrentStep("");
    setIsRunning(false);
    setSwapCount(0);
    setCompareCount(0);
  };

  const applyCustomInput = () => {
    if (customValues.trim()) {
      const vals = customValues
        .split(",")
        .map((v) => parseInt(v.trim()))
        .filter((v) => !isNaN(v));
      if (vals.length > 0) {
        setArray(vals);
        resetStates();
        return;
      }
    }
    const size = Math.min(Math.max(parseInt(arraySize) || 7, 3), 12);
    const newArr = generateArray(size, datasetType);
    setArray(newArr);
    resetStates();
  };

  const resetStates = () => {
    setComparing([]);
    setSorted([]);
    setFound(-1);
    setVisited([]);
    setCurrentStep("");
    setIsRunning(false);
    setSwapCount(0);
    setCompareCount(0);
  };

  // ── SORTING ──────────────────────────────────────────────────────
  const bubbleSort = async () => {
    setIsRunning(true);
    setSorted([]);
    setSwapCount(0);
    setCompareCount(0);
    let arr = [...array];
    const n = arr.length;
    let sw = 0;
    let cm = 0;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setComparing([j, j + 1]);
        cm++;
        setCompareCount(cm);
        setCurrentStep(`Comparing ${arr[j]} and ${arr[j + 1]}`);
        await sleep(speed);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          sw++;
          setSwapCount(sw);
          setArray([...arr]);
          setCurrentStep(`Swapped! ${arr[j]} ↔ ${arr[j + 1]}`);
          await sleep(speed);
        }
      }
      setSorted((prev) => [...prev, n - 1 - i]);
    }
    setSorted([...Array(n).keys()]);
    setComparing([]);
    setCurrentStep("✅ Done!");
    setIsRunning(false);
  };

  const selectionSort = async () => {
    setIsRunning(true);
    setSorted([]);
    setSwapCount(0);
    setCompareCount(0);
    let arr = [...array];
    const n = arr.length;
    let sw = 0;
    let cm = 0;
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        setComparing([minIdx, j]);
        cm++;
        setCompareCount(cm);
        setCurrentStep(`Finding min: ${arr[j]} vs ${arr[minIdx]}`);
        await sleep(speed);
        if (arr[j] < arr[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        sw++;
        setSwapCount(sw);
        setArray([...arr]);
        setCurrentStep(`Placed ${arr[i]} at index ${i}`);
        await sleep(speed);
      }
      setSorted((prev) => [...prev, i]);
    }
    setSorted([...Array(n).keys()]);
    setComparing([]);
    setCurrentStep("✅ Done!");
    setIsRunning(false);
  };

  const insertionSort = async () => {
    setIsRunning(true);
    setSorted([]);
    setSwapCount(0);
    setCompareCount(0);
    let arr = [...array];
    const n = arr.length;
    let sw = 0;
    let cm = 0;
    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      setCurrentStep(`Inserting ${key}`);
      while (j >= 0 && arr[j] > key) {
        setComparing([j, j + 1]);
        cm++;
        setCompareCount(cm);
        arr[j + 1] = arr[j];
        sw++;
        setSwapCount(sw);
        setArray([...arr]);
        await sleep(speed);
        j--;
      }
      arr[j + 1] = key;
      setArray([...arr]);
      setSorted((prev) => [...prev, i]);
      await sleep(speed / 2);
    }
    setSorted([...Array(n).keys()]);
    setComparing([]);
    setCurrentStep("✅ Done!");
    setIsRunning(false);
  };

  const mergeSort = async () => {
    setIsRunning(true);
    setSorted([]);
    setSwapCount(0);
    setCompareCount(0);
    let arr = [...array];
    let cm = 0;
    const merge = async (arr: number[], l: number, m: number, r: number) => {
      let left = arr.slice(l, m + 1);
      let right = arr.slice(m + 1, r + 1);
      let i = 0,
        j = 0,
        k = l;
      while (i < left.length && j < right.length) {
        setComparing([l + i, m + 1 + j]);
        cm++;
        setCompareCount(cm);
        setCurrentStep(`Merging: ${left[i]} vs ${right[j]}`);
        await sleep(speed);
        arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
        setArray([...arr]);
      }
      while (i < left.length) {
        arr[k++] = left[i++];
        setArray([...arr]);
        await sleep(speed / 3);
      }
      while (j < right.length) {
        arr[k++] = right[j++];
        setArray([...arr]);
        await sleep(speed / 3);
      }
    };
    const ms = async (arr: number[], l: number, r: number) => {
      if (l < r) {
        let m = Math.floor((l + r) / 2);
        setCurrentStep(`Dividing at index ${m}`);
        await sleep(speed / 2);
        await ms(arr, l, m);
        await ms(arr, m + 1, r);
        await merge(arr, l, m, r);
      }
    };
    await ms(arr, 0, arr.length - 1);
    setSorted([...Array(arr.length).keys()]);
    setComparing([]);
    setCurrentStep("✅ Done!");
    setIsRunning(false);
  };

  const quickSort = async () => {
    setIsRunning(true);
    setSorted([]);
    setSwapCount(0);
    setCompareCount(0);
    let arr = [...array];
    let cm = 0;
    let sw = 0;
    const partition = async (arr: number[], low: number, high: number) => {
      let pivot = arr[high];
      let i = low - 1;
      setCurrentStep(`Pivot: ${pivot}`);
      for (let j = low; j < high; j++) {
        setComparing([j, high]);
        cm++;
        setCompareCount(cm);
        await sleep(speed);
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          sw++;
          setSwapCount(sw);
          setArray([...arr]);
          setCurrentStep(`Swapped ${arr[i]} and ${arr[j]}`);
          await sleep(speed);
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      await sleep(speed / 2);
      return i + 1;
    };
    const qs = async (arr: number[], low: number, high: number) => {
      if (low < high) {
        let pi = await partition(arr, low, high);
        setSorted((prev) => [...prev, pi]);
        await qs(arr, low, pi - 1);
        await qs(arr, pi + 1, high);
      }
    };
    await qs(arr, 0, arr.length - 1);
    setSorted([...Array(arr.length).keys()]);
    setComparing([]);
    setCurrentStep("✅ Done!");
    setIsRunning(false);
  };

  const heapSort = async () => {
    setIsRunning(true);
    setSorted([]);
    setSwapCount(0);
    setCompareCount(0);
    let arr = [...array];
    const n = arr.length;
    let cm = 0;
    let sw = 0;
    const heapify = async (arr: number[], n: number, i: number) => {
      let largest = i;
      let l = 2 * i + 1;
      let r = 2 * i + 2;
      if (l < n) {
        cm++;
        setCompareCount(cm);
        setComparing([largest, l]);
        await sleep(speed / 2);
        if (arr[l] > arr[largest]) largest = l;
      }
      if (r < n) {
        cm++;
        setCompareCount(cm);
        setComparing([largest, r]);
        await sleep(speed / 2);
        if (arr[r] > arr[largest]) largest = r;
      }
      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        sw++;
        setSwapCount(sw);
        setArray([...arr]);
        setCurrentStep(`Heapify: swapped ${arr[i]} ↔ ${arr[largest]}`);
        await sleep(speed);
        await heapify(arr, n, largest);
      }
    };
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      setCurrentStep("Building max heap...");
      await heapify(arr, n, i);
    }
    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      sw++;
      setSwapCount(sw);
      setArray([...arr]);
      setSorted((prev) => [...prev, i]);
      setCurrentStep(`Extracted max: ${arr[i]}`);
      await sleep(speed);
      await heapify(arr, i, 0);
    }
    setSorted([...Array(n).keys()]);
    setComparing([]);
    setCurrentStep("✅ Done!");
    setIsRunning(false);
  };

  // ── SEARCHING ─────────────────────────────────────────────────────
  const linearSearch = async () => {
    setIsRunning(true);
    setFound(-1);
    setVisited([]);
    setCompareCount(0);
    let arr = [...array];
    let cm = 0;
    for (let i = 0; i < arr.length; i++) {
      setComparing([i]);
      setVisited((prev) => [...prev, i]);
      cm++;
      setCompareCount(cm);
      setCurrentStep(`Checking index ${i}: is ${arr[i]} === ${SEARCH_TARGET}?`);
      await sleep(speed);
      if (arr[i] === SEARCH_TARGET) {
        setFound(i);
        setComparing([]);
        setCurrentStep(`✅ Found ${SEARCH_TARGET} at index ${i}!`);
        setIsRunning(false);
        return;
      }
    }
    setComparing([]);
    setCurrentStep(`❌ ${SEARCH_TARGET} not found`);
    setIsRunning(false);
  };

  const binarySearch = async () => {
    setIsRunning(true);
    setFound(-1);
    setVisited([]);
    setCompareCount(0);
    let arr = [...array];
    let low = 0,
      high = arr.length - 1;
    let cm = 0;
    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      setComparing([low, mid, high]);
      setVisited((prev) => [...prev, mid]);
      cm++;
      setCompareCount(cm);
      setCurrentStep(
        `Low:${low} Mid:${mid} High:${high} → checking ${arr[mid]}`,
      );
      await sleep(speed);
      if (arr[mid] === SEARCH_TARGET) {
        setFound(mid);
        setComparing([]);
        setCurrentStep(`✅ Found at index ${mid}!`);
        setIsRunning(false);
        return;
      } else if (arr[mid] < SEARCH_TARGET) {
        low = mid + 1;
        setCurrentStep(`${arr[mid]} < ${SEARCH_TARGET}, go right`);
      } else {
        high = mid - 1;
        setCurrentStep(`${arr[mid]} > ${SEARCH_TARGET}, go left`);
      }
      await sleep(speed);
    }
    setComparing([]);
    setCurrentStep(`❌ Not found`);
    setIsRunning(false);
  };

  const jumpSearch = async () => {
    setIsRunning(true);
    setFound(-1);
    setVisited([]);
    setCompareCount(0);
    let arr = [...array];
    const n = arr.length;
    let step = Math.floor(Math.sqrt(n));
    let prev = 0;
    let cm = 0;
    while (arr[Math.min(step, n) - 1] < SEARCH_TARGET) {
      setComparing([Math.min(step, n) - 1]);
      setVisited((prev2) => [...prev2, Math.min(step, n) - 1]);
      cm++;
      setCompareCount(cm);
      setCurrentStep(`Jumping to index ${Math.min(step, n) - 1}`);
      await sleep(speed);
      prev = step;
      step += Math.floor(Math.sqrt(n));
      if (prev >= n) {
        setCurrentStep(`❌ Not found`);
        setIsRunning(false);
        return;
      }
    }
    setCurrentStep(`Searching block from index ${prev}`);
    await sleep(speed);
    while (arr[prev] < SEARCH_TARGET) {
      setComparing([prev]);
      setVisited((prev2) => [...prev2, prev]);
      cm++;
      setCompareCount(cm);
      setCurrentStep(`Linear check index ${prev}: ${arr[prev]}`);
      await sleep(speed);
      prev++;
      if (prev === Math.min(step, n)) {
        setCurrentStep(`❌ Not found`);
        setIsRunning(false);
        return;
      }
    }
    if (arr[prev] === SEARCH_TARGET) {
      setFound(prev);
      setComparing([]);
      setCurrentStep(`✅ Found at index ${prev}!`);
    } else {
      setCurrentStep(`❌ Not found`);
    }
    setIsRunning(false);
  };

  const interpolationSearch = async () => {
    setIsRunning(true);
    setFound(-1);
    setVisited([]);
    setCompareCount(0);
    let arr = [...array];
    let low = 0,
      high = arr.length - 1;
    let cm = 0;
    while (
      low <= high &&
      SEARCH_TARGET >= arr[low] &&
      SEARCH_TARGET <= arr[high]
    ) {
      if (low === high) {
        if (arr[low] === SEARCH_TARGET) {
          setFound(low);
          setCurrentStep(`✅ Found at index ${low}!`);
        } else {
          setCurrentStep(`❌ Not found`);
        }
        setIsRunning(false);
        return;
      }
      let pos =
        low +
        Math.floor(
          ((SEARCH_TARGET - arr[low]) * (high - low)) / (arr[high] - arr[low]),
        );
      setComparing([pos]);
      setVisited((prev) => [...prev, pos]);
      cm++;
      setCompareCount(cm);
      setCurrentStep(`Estimated position: ${pos}, value: ${arr[pos]}`);
      await sleep(speed);
      if (arr[pos] === SEARCH_TARGET) {
        setFound(pos);
        setComparing([]);
        setCurrentStep(`✅ Found at index ${pos}!`);
        setIsRunning(false);
        return;
      }
      if (arr[pos] < SEARCH_TARGET) {
        low = pos + 1;
      } else {
        high = pos - 1;
      }
      await sleep(speed);
    }
    setComparing([]);
    setCurrentStep(`❌ Not found`);
    setIsRunning(false);
  };

  const runAlgorithm = () => {
    if (algo === "Bubble Sort") bubbleSort();
    else if (algo === "Selection Sort") selectionSort();
    else if (algo === "Insertion Sort") insertionSort();
    else if (algo === "Merge Sort") mergeSort();
    else if (algo === "Quick Sort") quickSort();
    else if (algo === "Heap Sort") heapSort();
    else if (algo === "Linear Search") linearSearch();
    else if (algo === "Binary Search") binarySearch();
    else if (algo === "Jump Search") jumpSearch();
    else if (algo === "Interpolation Search") interpolationSearch();
  };

  const getBarColor = (index: number) => {
    if (isSearching) {
      if (found === index) return "#00D4AA";
      if (comparing.includes(index)) return "#FF6B6B";
      if (visited.includes(index)) return "#FFB347";
      return "#6C63FF";
    }
    if (sorted.includes(index)) return "#00D4AA";
    if (comparing.includes(index)) return "#FF6B6B";
    return "#6C63FF";
  };

  const maxVal = Math.max(...array);
  const tabs = ["visualize", "learn", "code"];
  const langs = ["python", "java", "cpp"];
  const speeds = [
    { label: "Slow", val: 1000 },
    { label: "Normal", val: 600 },
    { label: "Fast", val: 200 },
  ];
  const dataTypes = ["random", "sorted", "reverse", "nearly"];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{algo}</Text>
        <Text style={styles.desc}>{info?.desc}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, activeTab === t && styles.tabActive]}
            onPress={() => setActiveTab(t as any)}
          >
            <Text
              style={[styles.tabText, activeTab === t && styles.tabTextActive]}
            >
              {t === "visualize"
                ? "▶ Visualize"
                : t === "learn"
                  ? "📖 Learn"
                  : "💻 Code"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── VISUALIZE TAB ── */}
      {activeTab === "visualize" && (
        <>
          {/* Custom Input */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Custom Input</Text>

            {/* Dataset type */}
            <View style={styles.chipRow}>
              {dataTypes.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.chip, datasetType === t && styles.chipActive]}
                  onPress={() => setDatasetType(t)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      datasetType === t && styles.chipTextActive,
                    ]}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Array size */}
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Size:</Text>
              <TextInput
                style={styles.sizeInput}
                value={arraySize}
                onChangeText={setArraySize}
                keyboardType="number-pad"
                maxLength={2}
                placeholderTextColor="#555"
              />
              <Text style={styles.inputLabel}>or values:</Text>
              <TextInput
                style={[styles.sizeInput, { flex: 1 }]}
                value={customValues}
                onChangeText={setCustomValues}
                placeholder="e.g. 5,3,8,1"
                placeholderTextColor="#555"
              />
            </View>

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={applyCustomInput}
            >
              <Text style={styles.applyBtnText}>Apply ↻</Text>
            </TouchableOpacity>
          </View>

          {/* Speed control */}
          <View style={styles.speedRow}>
            <Text style={styles.inputLabel}>Speed:</Text>
            {speeds.map((s) => (
              <TouchableOpacity
                key={s.label}
                style={[styles.chip, speed === s.val && styles.chipActive]}
                onPress={() => setSpeed(s.val)}
              >
                <Text
                  style={[
                    styles.chipText,
                    speed === s.val && styles.chipTextActive,
                  ]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Search target info */}
          {isSearching && (
            <View style={styles.targetBox}>
              <Text style={styles.targetText}>
                🎯 Searching for:{" "}
                <Text style={styles.targetNum}>{SEARCH_TARGET}</Text>
              </Text>
            </View>
          )}

          {/* Bar chart */}
          <View style={styles.vizContainer}>
            <View style={styles.bars}>
              {array.map((val, i) => (
                <View key={i} style={styles.barWrapper}>
                  <Text style={styles.barValue}>{val}</Text>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (val / maxVal) * 160,
                        backgroundColor: getBarColor(i),
                      },
                    ]}
                  />
                  <Text style={styles.barIndex}>{i}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Step info */}
          <View style={styles.stepBox}>
            <Text style={styles.stepText}>
              {currentStep || "Press Start to begin!"}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{compareCount}</Text>
              <Text style={styles.statLabel}>Comparisons</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>
                {isSearching ? (found >= 0 ? found : "-") : swapCount}
              </Text>
              <Text style={styles.statLabel}>
                {isSearching ? "Found at" : "Swaps"}
              </Text>
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            {isSearching ? (
              <>
                <View style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: "#6C63FF" }]} />
                  <Text style={styles.legendText}>Unvisited</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: "#FF6B6B" }]} />
                  <Text style={styles.legendText}>Checking</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: "#FFB347" }]} />
                  <Text style={styles.legendText}>Visited</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: "#00D4AA" }]} />
                  <Text style={styles.legendText}>Found</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: "#6C63FF" }]} />
                  <Text style={styles.legendText}>Unsorted</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: "#FF6B6B" }]} />
                  <Text style={styles.legendText}>Comparing</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: "#00D4AA" }]} />
                  <Text style={styles.legendText}>Sorted</Text>
                </View>
              </>
            )}
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.startBtn,
                isRunning && styles.disabled,
              ]}
              onPress={runAlgorithm}
              disabled={isRunning}
            >
              <Text style={styles.btnText}>▶ Start</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.resetBtn]}
              onPress={resetArray}
            >
              <Text style={styles.btnText}>↺ Reset</Text>
            </TouchableOpacity>
          </View>

          {/* Complexity */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Complexity Analysis</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Best Case</Text>
              <Text style={styles.infoValue}>{info?.best}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Average Case</Text>
              <Text style={styles.infoValue}>{info?.average}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Worst Case</Text>
              <Text style={styles.infoValue}>{info?.worst}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Space</Text>
              <Text style={styles.infoValue}>{info?.space}</Text>
            </View>
          </View>
        </>
      )}

      {/* ── LEARN TAB ── */}
      {activeTab === "learn" && (
        <View style={styles.learnSection}>
          <View style={styles.learnCard}>
            <Text style={styles.learnTitle}>📖 About {algo}</Text>
            <Text style={styles.learnText}>{info?.about}</Text>
          </View>

          <View style={styles.learnCard}>
            <Text style={styles.learnTitle}>⏱️ When to use {algo}?</Text>
            {algo === "Bubble Sort" && (
              <Text style={styles.learnText}>
                {
                  "• Learning purposes and education\n• Very small datasets (< 10 elements)\n• When simplicity matters more than speed\n• When the array is almost sorted"
                }
              </Text>
            )}
            {algo === "Selection Sort" && (
              <Text style={styles.learnText}>
                {
                  "• Small lists where memory writes are costly\n• When you need minimum number of swaps\n• Simple implementation needed\n• Checking all elements is required"
                }
              </Text>
            )}
            {algo === "Insertion Sort" && (
              <Text style={styles.learnText}>
                {
                  "• Small or nearly sorted arrays\n• Online sorting (data arrives in real time)\n• As part of hybrid algorithms like Timsort\n• When simplicity and stability needed"
                }
              </Text>
            )}
            {algo === "Merge Sort" && (
              <Text style={styles.learnText}>
                {
                  "• Large datasets requiring guaranteed O(n log n)\n• Sorting linked lists\n• External sorting (data too large for RAM)\n• When stable sort is required"
                }
              </Text>
            )}
            {algo === "Quick Sort" && (
              <Text style={styles.learnText}>
                {
                  "• General purpose sorting of large arrays\n• When average performance matters most\n• In-memory sorting with cache efficiency\n• Most standard library implementations"
                }
              </Text>
            )}
            {algo === "Heap Sort" && (
              <Text style={styles.learnText}>
                {
                  "• When guaranteed O(n log n) needed\n• Memory constrained environments\n• Priority queue implementations\n• When in-place sorting required"
                }
              </Text>
            )}
            {algo === "Linear Search" && (
              <Text style={styles.learnText}>
                {
                  "• Unsorted or small arrays\n• Searching linked lists\n• When array is accessed only once\n• Finding all occurrences of an element"
                }
              </Text>
            )}
            {algo === "Binary Search" && (
              <Text style={styles.learnText}>
                {
                  "• Large sorted arrays\n• Dictionary/phonebook lookups\n• Finding elements in sorted databases\n• When search speed is critical"
                }
              </Text>
            )}
            {algo === "Jump Search" && (
              <Text style={styles.learnText}>
                {
                  "• Sorted arrays on systems where backward traversal is slow\n• When binary search overhead is too high\n• Searching in flash memory or tapes"
                }
              </Text>
            )}
            {algo === "Interpolation Search" && (
              <Text style={styles.learnText}>
                {
                  "• Uniformly distributed sorted arrays\n• Large datasets with predictable patterns\n• Phone directory or dictionary lookups\n• Numerical data with even distribution"
                }
              </Text>
            )}
          </View>

          <View style={styles.learnCard}>
            <Text style={styles.learnTitle}>💡 Key Points to Remember</Text>
            {algo === "Bubble Sort" && (
              <Text style={styles.learnText}>
                {
                  '• Stable sort — equal elements keep original order\n• In-place — no extra memory needed\n• After each pass, largest unsorted element bubbles to end\n• Can be optimized with a "swapped" flag for early exit'
                }
              </Text>
            )}
            {algo === "Selection Sort" && (
              <Text style={styles.learnText}>
                {
                  "• Not stable — may change order of equal elements\n• Always makes exactly n-1 swaps regardless of input\n• Performance same regardless of input order\n• Simple but inefficient for large data"
                }
              </Text>
            )}
            {algo === "Insertion Sort" && (
              <Text style={styles.learnText}>
                {
                  "• Stable sort\n• Best case O(n) when array is already sorted\n• Works well with small arrays\n• Used in practice for small subarrays in hybrid sorts"
                }
              </Text>
            )}
            {algo === "Merge Sort" && (
              <Text style={styles.learnText}>
                {
                  "• Stable sort\n• Always O(n log n) — most predictable\n• Requires O(n) extra memory\n• Best for linked lists and external sorting"
                }
              </Text>
            )}
            {algo === "Quick Sort" && (
              <Text style={styles.learnText}>
                {
                  "• Not stable by default\n• Average O(n log n) but worst case O(n²)\n• Pivot selection is key — random pivot avoids worst case\n• Fastest in practice due to cache locality"
                }
              </Text>
            )}
            {algo === "Heap Sort" && (
              <Text style={styles.learnText}>
                {
                  "• Not stable\n• Always O(n log n) with O(1) space\n• Uses binary heap data structure\n• Poor cache performance compared to Quick Sort"
                }
              </Text>
            )}
            {algo === "Linear Search" && (
              <Text style={styles.learnText}>
                {
                  "• Works on sorted and unsorted arrays\n• O(n) time always\n• Simple and reliable\n• Best for small or unsorted data"
                }
              </Text>
            )}
            {algo === "Binary Search" && (
              <Text style={styles.learnText}>
                {
                  "• ONLY works on sorted arrays\n• Eliminates half the search space each step\n• 1 million elements → max 20 comparisons\n• Most efficient search for sorted data"
                }
              </Text>
            )}
            {algo === "Jump Search" && (
              <Text style={styles.learnText}>
                {
                  "• Requires sorted array\n• Jump size √n is optimal\n• Between linear and binary search in speed\n• Only moves forward — good for some storage types"
                }
              </Text>
            )}
            {algo === "Interpolation Search" && (
              <Text style={styles.learnText}>
                {
                  "• Requires sorted, uniformly distributed array\n• Uses formula to estimate position like a human\n• O(log log n) for uniform data\n• Degrades to O(n) for non-uniform data"
                }
              </Text>
            )}
          </View>
        </View>
      )}

      {/* ── CODE TAB ── */}
      {activeTab === "code" && (
        <View style={styles.codeSection}>
          {/* Language selector */}
          <View style={styles.langRow}>
            {langs.map((l) => (
              <TouchableOpacity
                key={l}
                style={[
                  styles.langBtn,
                  activeLang === l && styles.langBtnActive,
                ]}
                onPress={() => setActiveLang(l as any)}
              >
                <Text
                  style={[
                    styles.langText,
                    activeLang === l && styles.langTextActive,
                  ]}
                >
                  {l === "python"
                    ? "🐍 Python"
                    : l === "java"
                      ? "☕ Java"
                      : "⚙️ C++"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Code block */}
          <View style={styles.codeBlock}>
            <View style={styles.codeHeader}>
              <Text style={styles.codeHeaderText}>
                {algo} — {activeLang.toUpperCase()}
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={styles.codeText}>
                {code?.[activeLang] || "Code coming soon!"}
              </Text>
            </ScrollView>
          </View>

          {/* Code explanation */}
          <View style={styles.learnCard}>
            <Text style={styles.learnTitle}>🧠 How this code works</Text>
            {algo === "Bubble Sort" && (
              <Text style={styles.learnText}>
                {
                  "1. Outer loop runs n-1 times\n2. Inner loop compares adjacent pairs\n3. If left > right, swap them\n4. After each outer pass, largest element is at end\n5. Inner loop range shrinks by 1 each pass"
                }
              </Text>
            )}
            {algo === "Selection Sort" && (
              <Text style={styles.learnText}>
                {
                  "1. Outer loop selects position to fill\n2. Inner loop finds minimum in remaining array\n3. Swap minimum with current position\n4. Sorted portion grows by 1 each pass\n5. Repeat until all positions filled"
                }
              </Text>
            )}
            {algo === "Insertion Sort" && (
              <Text style={styles.learnText}>
                {
                  "1. Start from second element\n2. Store current element as key\n3. Shift all larger elements right\n4. Insert key in correct position\n5. Sorted portion grows from left"
                }
              </Text>
            )}
            {algo === "Merge Sort" && (
              <Text style={styles.learnText}>
                {
                  "1. Base case: array of 1 is sorted\n2. Find middle index\n3. Recursively sort left half\n4. Recursively sort right half\n5. Merge two sorted halves together"
                }
              </Text>
            )}
            {algo === "Quick Sort" && (
              <Text style={styles.learnText}>
                {
                  "1. Choose last element as pivot\n2. Partition: move smaller elements left\n3. Place pivot in correct position\n4. Recursively sort left partition\n5. Recursively sort right partition"
                }
              </Text>
            )}
            {algo === "Heap Sort" && (
              <Text style={styles.learnText}>
                {
                  "1. Build max heap from array\n2. Largest element is at root\n3. Swap root with last element\n4. Reduce heap size by 1\n5. Heapify root and repeat"
                }
              </Text>
            )}
            {algo === "Linear Search" && (
              <Text style={styles.learnText}>
                {
                  "1. Start from first element\n2. Compare each element with target\n3. If match found, return index\n4. If end reached, return -1\n5. Simple loop through entire array"
                }
              </Text>
            )}
            {algo === "Binary Search" && (
              <Text style={styles.learnText}>
                {
                  "1. Set low=0, high=last index\n2. Find middle index\n3. If middle==target, return it\n4. If target > middle, search right\n5. If target < middle, search left"
                }
              </Text>
            )}
            {algo === "Jump Search" && (
              <Text style={styles.learnText}>
                {
                  "1. Calculate jump size as √n\n2. Jump forward until block found\n3. Do linear search in that block\n4. Return index if found\n5. Return -1 if not found"
                }
              </Text>
            )}
            {algo === "Interpolation Search" && (
              <Text style={styles.learnText}>
                {
                  "1. Calculate estimated position using formula\n2. Formula: low + (target-arr[low])*(high-low)/(arr[high]-arr[low])\n3. Check estimated position\n4. Narrow search space based on comparison\n5. Repeat until found or not"
                }
              </Text>
            )}
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0F" },
  header: { padding: 24, paddingTop: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#6C63FF" },
  desc: { fontSize: 13, color: "#888", marginTop: 6, lineHeight: 20 },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#12121A",
    borderRadius: 12,
    padding: 4,
  },
  tab: { flex: 1, padding: 10, borderRadius: 10, alignItems: "center" },
  tabActive: { backgroundColor: "#6C63FF" },
  tabText: { color: "#888", fontSize: 13, fontWeight: "600" },
  tabTextActive: { color: "#FFF" },
  inputSection: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#12121A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 12,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#1E1E2E",
    borderWidth: 1,
    borderColor: "#333",
  },
  chipActive: { backgroundColor: "#6C63FF22", borderColor: "#6C63FF" },
  chipText: { color: "#888", fontSize: 12 },
  chipTextActive: { color: "#6C63FF" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  inputLabel: { color: "#888", fontSize: 12 },
  sizeInput: {
    backgroundColor: "#1E1E2E",
    borderRadius: 8,
    padding: 8,
    color: "#FFF",
    fontSize: 13,
    borderWidth: 1,
    borderColor: "#333",
    minWidth: 44,
    textAlign: "center",
  },
  applyBtn: {
    backgroundColor: "#6C63FF22",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6C63FF",
  },
  applyBtnText: { color: "#6C63FF", fontSize: 13, fontWeight: "600" },
  speedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  targetBox: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "#1E1E2E",
    borderRadius: 10,
    padding: 10,
  },
  targetText: { color: "#888", fontSize: 13 },
  targetNum: { color: "#FFB347", fontWeight: "bold" },
  vizContainer: {
    margin: 20,
    backgroundColor: "#12121A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 200,
  },
  barWrapper: { alignItems: "center", flex: 1 },
  barValue: { color: "#888", fontSize: 10, marginBottom: 4 },
  bar: { width: "70%", borderRadius: 4, minHeight: 4 },
  barIndex: { color: "#555", fontSize: 9, marginTop: 4 },
  stepBox: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "#12121A",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    minHeight: 48,
    justifyContent: "center",
  },
  stepText: { color: "#FFF", fontSize: 13, textAlign: "center" },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#12121A",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  statNum: { fontSize: 24, fontWeight: "bold", color: "#6C63FF" },
  statLabel: { fontSize: 11, color: "#888", marginTop: 2 },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: "#888", fontSize: 11 },
  buttons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  btn: { flex: 1, padding: 16, borderRadius: 12, alignItems: "center" },
  startBtn: { backgroundColor: "#6C63FF" },
  resetBtn: { backgroundColor: "#1E1E2E" },
  disabled: { opacity: 0.5 },
  btnText: { color: "#FFF", fontSize: 15, fontWeight: "bold" },
  infoBox: {
    marginHorizontal: 20,
    backgroundColor: "#12121A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#1E1E2E",
  },
  infoLabel: { color: "#888", fontSize: 13 },
  infoValue: { color: "#6C63FF", fontSize: 13, fontWeight: "bold" },
  learnSection: { paddingHorizontal: 20, gap: 16 },
  learnCard: {
    backgroundColor: "#12121A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  learnTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 12,
  },
  learnText: { color: "#AAA", fontSize: 13, lineHeight: 22 },
  codeSection: { paddingHorizontal: 20, gap: 16 },
  langRow: { flexDirection: "row", gap: 8 },
  langBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#12121A",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  langBtnActive: { backgroundColor: "#6C63FF22", borderColor: "#6C63FF" },
  langText: { color: "#888", fontSize: 12, fontWeight: "600" },
  langTextActive: { color: "#6C63FF" },
  codeBlock: {
    backgroundColor: "#0D1117",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  codeHeader: {
    backgroundColor: "#161B22",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1E1E2E",
  },
  codeHeaderText: { color: "#888", fontSize: 12, fontWeight: "600" },
  codeText: {
    color: "#E6EDF3",
    fontSize: 12,
    padding: 16,
    fontFamily: "monospace",
    lineHeight: 20,
  },
});

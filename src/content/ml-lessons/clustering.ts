import type { MLLessonContent } from "@/types/ml-lesson";
import ClusteringViz from "@/components/ml-viz/clustering-viz";

export const clusteringLesson: MLLessonContent = {
  slug: "clustering",
  topicKey: "ML: Clustering",
  category: "Clustering",
  title: "K-Means & Unsupervised Clustering",
  VisualizationComponent: ClusteringViz,
  introduction:
    "K-Means is an unsupervised learning algorithm that partitions unlabeled data points into K distinct clusters based on feature vector distance.",
  analogy:
    "Imagine organizing a bucket of unsorted marbles by color and size into K distinct bowls without pre-existing labels.",
  keyIdeas: [
    "Step 1: Initialize K random cluster centroids.",
    "Step 2: Assign each data point to its nearest centroid based on Euclidean distance.",
    "Step 3: Recalculate centroids as the mean vector of assigned points.",
    "Repeat until centroids stabilize and Inertia (Sum of Squared Errors) converges.",
  ],
  realWorldUses: [
    "E-commerce customer market segmentation",
    "Image color quantization and compression",
    "Anomaly detection in security network traffic",
  ],
  advantages: [
    "Fast, simple, and scalable to large datasets",
  ],
  disadvantages: [
    "Requires pre-specifying number of clusters K",
    "Sensitive to initial random centroid placement (mitigated by K-Means++)",
  ],
  interviewQuestions: [
    {
      question: "How do you choose the optimal number of clusters K?",
      answer:
        "Use the Elbow Method by plotting K vs Inertia (SSE) and selecting the 'elbow' inflection point where loss reduction levels off.",
    },
    {
      question: "What is K-Means++ initialization?",
      answer:
        "K-Means++ picks initial centroids far apart from each other based on probability proportional to distance squared, avoiding poor convergence.",
    },
  ],

  detailedNotesHtml: `
    <h2>1. K-Means Iterative Centroid Convergence</h2>
    <pre><code>Step 1: Random Centroids       Step 2: Assign Points       Step 3: Update Centroids
   * [C1]    *                    * (C1)    *                 *  C1   *
        *         *                    *         *                 *     *
   *    *    [C2]                 *    *    (C2)              *    *    C2</code></pre>
  `,

  quiz: [
    {
      id: "cl-q1",
      question: "K-Means clustering is an example of:",
      options: ["Unsupervised Learning", "Supervised Learning", "Reinforcement Learning", "Semi-Supervised"],
      correctIndex: 0,
      explanation: "K-Means automatically clusters unlabeled data points.",
    },
    {
      id: "cl-q2",
      question: "What metric does K-Means minimize during training?",
      options: [
        "Inertia (Within-cluster sum of squared distances)",
        "Classification Accuracy",
        "Learning Rate",
        "Number of features",
      ],
      correctIndex: 0,
      explanation: "K-Means minimizes total squared Euclidean distance from points to centroids.",
    },
    {
      id: "cl-q3",
      question: "The Elbow Method helps determine:",
      options: [
        "Optimal number of clusters K",
        "Learning rate",
        "Number of decision trees",
        "Feature weight size",
      ],
      correctIndex: 0,
      explanation: "The elbow curve inflection point reveals the optimal K value.",
    },
    {
      id: "cl-q4",
      question: "What improves initial centroid selection over random placement?",
      options: ["K-Means++ initialization", "Grid Search", "Gradient Descent", "Random Forest"],
      correctIndex: 0,
      explanation: "K-Means++ spreads initial centroids far apart proportionally to distance.",
    },
    {
      id: "cl-q5",
      question: "Hierarchical Clustering creates what tree representation of nested clusters?",
      options: ["Dendrogram", "Binary Search Tree", "Trie", "B-Tree"],
      correctIndex: 0,
      explanation: "Dendrogram diagrams illustrate hierarchical cluster merges.",
    },
    {
      id: "cl-q6",
      question: "DBSCAN clustering algorithm excels at finding:",
      options: [
        "Arbitrarily shaped clusters and noise outliers",
        "Strict spherical clusters only",
        "Linear regression lines",
        "Binary text labels",
      ],
      correctIndex: 0,
      explanation: "DBSCAN finds density-based clusters of arbitrary shapes and isolates noise.",
    },
    {
      id: "cl-q7",
      question: "What distance metric is most commonly used in standard K-Means?",
      options: ["Euclidean Distance", "Manhattan Distance", "Cosine Similarity", "Hamming Distance"],
      correctIndex: 0,
      explanation: "K-Means defaults to squared Euclidean distance.",
    },
    {
      id: "cl-q8",
      question: "Silhouettes Coefficient score ranges from -1 to +1, where +1 indicates:",
      options: [
        "Dense, well-separated distinct clusters",
        "Overlapping poor clusters",
        "Zero data points",
        "High bias",
      ],
      correctIndex: 0,
      explanation: "Silhouette score of +1 means samples are far from neighboring clusters.",
    },
    {
      id: "cl-q9",
      question: "Why should features be scaled before running K-Means clustering?",
      options: [
        "Unscaled large features dominate Euclidean distance calculations",
        "K-Means cannot process negative numbers",
        "To speed up computer memory",
        "To remove duplicate rows",
      ],
      correctIndex: 0,
      explanation: "Distance-based algorithms require equal feature scaling.",
    },
    {
      id: "cl-q10",
      question: "Principal Component Analysis (PCA) is used before clustering to:",
      options: [
        "Reduce high-dimensional feature spaces while preserving variance",
        "Add artificial labels",
        "Sort numbers",
        "Increase feature count",
      ],
      correctIndex: 0,
      explanation: "PCA projects high-dimensional data onto orthogonal components of max variance.",
    },
  ],

  youtubeVideos: [
    {
      id: "ml-cl-yt-1",
      title: "StatQuest: K-Means Clustering Clearly Explained",
      channel: "StatQuest",
      duration: "11 mins",
      url: "https://www.youtube.com/watch?v=4b5d3muPQmA",
      description: "Visual walkthrough of centroid initialization, updates, and convergence.",
    },
    {
      id: "ml-cl-yt-2",
      title: "K-Means++ Initialization Explained",
      channel: "StatQuest",
      duration: "10 mins",
      url: "https://www.youtube.com/watch?v=HatWxwSstEw",
      description: "How K-Means++ chooses smart starting centroids.",
    },
    {
      id: "ml-cl-yt-3",
      title: "Hierarchical Clustering Clearly Explained",
      channel: "StatQuest",
      duration: "14 mins",
      url: "https://www.youtube.com/watch?v=7xHsRkTeVDA",
      description: "Agglomerative clustering and dendrogram reading.",
    },
    {
      id: "ml-cl-yt-4",
      title: "DBSCAN Clustering Algorithm",
      channel: "StatQuest",
      duration: "16 mins",
      url: "https://www.youtube.com/watch?v=RDZUdRsdObl",
      description: "Density-based spatial clustering of applications with noise.",
    },
    {
      id: "ml-cl-yt-5",
      title: "Principal Component Analysis (PCA) Step-by-Step",
      channel: "StatQuest",
      duration: "21 mins",
      url: "https://www.youtube.com/watch?v=FgakZw6K1QQ",
      description: "Dimensionality reduction intuition and eigenvectors.",
    },
    {
      id: "ml-cl-yt-6",
      title: "Elbow Method for Optimal K",
      channel: "Codebasics",
      duration: "12 mins",
      url: "https://www.youtube.com/watch?v=EItlUEb2LVI",
      description: "Plotting sum of squared errors vs K.",
    },
    {
      id: "ml-cl-yt-7",
      title: "Silhouette Analysis for K-Means",
      channel: "Scikit-Learn Tutorial",
      duration: "15 mins",
      url: "https://www.youtube.com/watch?v=5U098R4Fq5k",
      description: "Evaluating cluster quality with silhouette scores.",
    },
    {
      id: "ml-cl-yt-8",
      title: "Customer Segmentation with K-Means Python",
      channel: "FreeCodeCamp",
      duration: "25 mins",
      url: "https://www.youtube.com/watch?v=IWpQee_eSm8",
      description: "End-to-end e-commerce customer segmentation project.",
    },
    {
      id: "ml-cl-yt-9",
      title: "Gaussian Mixture Models (GMM)",
      channel: "StatQuest",
      duration: "18 mins",
      url: "https://www.youtube.com/watch?v=REypj2sy_5U",
      description: "Soft clustering using Expectation-Maximization.",
    },
    {
      id: "ml-cl-yt-10",
      title: "t-SNE Visualization Explained",
      channel: "StatQuest",
      duration: "16 mins",
      url: "https://www.youtube.com/watch?v=NEaUSP4YerM",
      description: "Non-linear manifold visualization technique.",
    },
  ],

  practiceProblems: [
    {
      id: "ml-cl-p1",
      title: "1. Euclidean Distance Calculation",
      difficulty: "Easy",
      description: "Given 2D points `p1` and `p2`, compute Euclidean distance rounded to 2 decimal places.",
      hints: [
        "Hint 1: Distance = Math.sqrt((x2-x1)^2 + (y2-y1)^2).",
      ],
      starterCode: `function solution(p1, p2) {
  const dist = Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
  return Number(dist.toFixed(2));
}`,
      solutionExplanation: "Computes 2D Euclidean distance.",
      testCases: [
        { input: [[0, 0], [3, 4]], expected: 5 },
        { input: [[1, 1], [4, 5]], expected: 5 },
      ],
    },
  ],
};

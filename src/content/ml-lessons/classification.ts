import type { MLLessonContent } from "@/types/ml-lesson";
import ClassificationViz from "@/components/ml-viz/classification-viz";

export const classificationLesson: MLLessonContent = {
  slug: "classification",
  topicKey: "ML: Classification",
  category: "Classification",
  title: "Classification & Decision Boundaries",
  VisualizationComponent: ClassificationViz,
  introduction:
    "Classification algorithms map input features into discrete target categories (e.g., Spam vs Normal Email). Models construct decision boundaries separating feature classes.",
  analogy:
    "Think of a mail sorter: letters are inspected for keywords, sender addresses, and size, then routed into designated category bins.",
  keyIdeas: [
    "Logistic Regression applies the Sigmoid activation function σ(z) = 1 / (1 + e^-z) to constrain linear outputs to probabilities between 0 and 1.",
    "Decision Boundary represents the geometric surface where class probabilities equal 0.5.",
    "Evaluation metrics include Confusion Matrix, Precision, Recall, F1-Score, and ROC-AUC.",
  ],
  realWorldUses: [
    "Email spam and phishing filter classification",
    "Credit card transaction fraud detection",
    "Medical diagnostic screening (Malignant vs Benign tumors)",
    "Customer churn prediction in subscription services",
  ],
  advantages: [
    "Outputs probabilistic class confidence scores",
    "Fast inference speed and simple decision boundary interpretation",
  ],
  disadvantages: [
    "Linear decision boundaries fail on non-linearly separable data without kernel tricks",
  ],
  interviewQuestions: [
    {
      question: "What is the difference between Precision and Recall?",
      answer:
        "Precision = TP / (TP + FP) measures accuracy of positive predictions. Recall = TP / (TP + FN) measures ability to detect all actual positive cases.",
    },
    {
      question: "What is the F1-Score?",
      answer:
        "F1-Score is the harmonic mean of Precision and Recall: F1 = 2 * (Precision * Recall) / (Precision + Recall). Useful when dataset class distribution is imbalanced.",
    },
  ],

  detailedNotesHtml: `
    <h2>1. Sigmoid Function Curve & Decision Boundary</h2>
    <pre><code> 1.0 |            +-------------- (Class 1)
     |           /
 P   |          /
     |  0.5 ---+ Threshold (Decision Boundary at z=0)
     |        /
 0.0 +-------+------------------- (Class 0)
    -inf    z=0              +inf
         z = w^T * x + b</code></pre>
  `,

  quiz: [
    {
      id: "clf-q1",
      question: "Which activation function maps real numbers to probabilities between 0 and 1?",
      options: ["Sigmoid Function", "ReLU", "Linear", "Step Function"],
      correctIndex: 0,
      explanation: "Sigmoid σ(z) = 1 / (1 + e^-z) bounds outputs strictly between 0 and 1.",
    },
    {
      id: "clf-q2",
      question: "Precision is calculated as:",
      options: ["TP / (TP + FP)", "TP / (TP + FN)", "TN / (TN + FP)", "TP / N"],
      correctIndex: 0,
      explanation: "Precision measures true positives divided by total predicted positives.",
    },
    {
      id: "clf-q3",
      question: "Recall (Sensitivity) is calculated as:",
      options: ["TP / (TP + FN)", "TP / (TP + FP)", "TN / (TN + FP)", "FP / N"],
      correctIndex: 0,
      explanation: "Recall measures true positives divided by total actual positive cases.",
    },
    {
      id: "clf-q4",
      question: "F1-Score represents:",
      options: [
        "Harmonic mean of Precision and Recall",
        "Average of Accuracy and Speed",
        "Sum of True Positives",
        "Number of decision trees",
      ],
      correctIndex: 0,
      explanation: "F1-Score is the harmonic mean balancing Precision and Recall.",
    },
    {
      id: "clf-q5",
      question: "In a medical cancer detection test, failing to detect a real malignant tumor is a:",
      options: ["False Negative (Dangerous)", "False Positive", "True Negative", "True Positive"],
      correctIndex: 0,
      explanation: "Failing to detect an actual positive disease case is a False Negative error.",
    },
    {
      id: "clf-q6",
      question: "K-Nearest Neighbors (KNN) classifies a new sample based on:",
      options: [
        "Majority vote among K nearest Euclidean distance neighbors",
        "Linear regression slope",
        "Neural net backpropagation",
        "Random decision",
      ],
      correctIndex: 0,
      explanation: "KNN votes on class labels of the K closest training instances.",
    },
    {
      id: "clf-q7",
      question: "Decision Tree classifiers split feature nodes to maximize:",
      options: ["Information Gain (Minimize Gini Impurity / Entropy)", "MSE", "Learning Rate", "Distance"],
      correctIndex: 0,
      explanation: "Decision trees choose splits that maximize Information Gain.",
    },
    {
      id: "clf-q8",
      question: "Support Vector Machines (SVM) find the optimal decision boundary by:",
      options: [
        "Maximizing the geometric margin between support vector class points",
        "Minimizing number of trees",
        "Averaging all points",
        "Random sampling",
      ],
      correctIndex: 0,
      explanation: "SVM maximizes hyper-plane margin distance to nearest class points.",
    },
    {
      id: "clf-q9",
      question: "What loss function is used to train Logistic Regression models?",
      options: ["Binary Cross-Entropy Loss (Log Loss)", "Mean Squared Error", "Absolute Error", "Zero Loss"],
      correctIndex: 0,
      explanation: "Log Loss penalizes confident wrong probability predictions logarithmically.",
    },
    {
      id: "clf-q10",
      question: "Naïve Bayes classifier makes what strong assumption about input features?",
      options: [
        "Features are conditionally independent given the class label",
        "Features are linearly correlated",
        "All features are continuous",
        "Features must be sorted",
      ],
      correctIndex: 0,
      explanation: "Naïve Bayes assumes complete feature independence given the target class.",
    },
  ],

  youtubeVideos: [
    {
      id: "ml-clf-yt-1",
      title: "StatQuest: Logistic Regression Explained",
      channel: "StatQuest",
      duration: "20 mins",
      url: "https://www.youtube.com/watch?v=yIYKR4sgzI8",
      description: "Visual introduction to odds, log-odds, and maximum likelihood.",
    },
    {
      id: "ml-clf-yt-2",
      title: "StatQuest: K-Nearest Neighbors (KNN)",
      channel: "StatQuest",
      duration: "15 mins",
      url: "https://www.youtube.com/watch?v=HVXime0nQeI",
      description: "Euclidean distance voting and choosing K.",
    },
    {
      id: "ml-clf-yt-3",
      title: "Decision Trees Explained",
      channel: "StatQuest",
      duration: "18 mins",
      url: "https://www.youtube.com/watch?v=7VeUPuFGJHk",
      description: "Gini Impurity and node splitting.",
    },
    {
      id: "ml-clf-yt-4",
      title: "Support Vector Machines (SVM) Clearly Explained",
      channel: "StatQuest",
      duration: "22 mins",
      url: "https://www.youtube.com/watch?v=efR1C6CvhmE",
      description: "Maximum margins and kernel tricks.",
    },
    {
      id: "ml-clf-yt-5",
      title: "Naïve Bayes Classifier",
      channel: "StatQuest",
      duration: "16 mins",
      url: "https://www.youtube.com/watch?v=O2L2Uv9pdDA",
      description: "Bayes Theorem for text classification.",
    },
    {
      id: "ml-clf-yt-6",
      title: "Random Forests Explained",
      channel: "StatQuest",
      duration: "19 mins",
      url: "https://www.youtube.com/watch?v=J4Wdy0Wc_xQ",
      description: "Ensemble bagging and feature bootstrap sampling.",
    },
    {
      id: "ml-clf-yt-7",
      title: "XGBoost Clearly Explained",
      channel: "StatQuest",
      duration: "24 mins",
      url: "https://www.youtube.com/watch?v=OtD8wVaFm6E",
      description: "Gradient boosted decision trees.",
    },
    {
      id: "ml-clf-yt-8",
      title: "Confusion Matrix & Evaluation Metrics",
      channel: "StatQuest",
      duration: "18 mins",
      url: "https://www.youtube.com/watch?v=Kdsp6soqA7o",
      description: "Precision, recall, and F1-Score breakdown.",
    },
    {
      id: "ml-clf-yt-9",
      title: "ROC and AUC Curves",
      channel: "StatQuest",
      duration: "16 mins",
      url: "https://www.youtube.com/watch?v=4jRBRDbJemM",
      description: "True Positive Rate vs False Positive Rate curves.",
    },
    {
      id: "ml-clf-yt-10",
      title: "Handling Imbalanced Classification Datasets",
      channel: "Krish Naik",
      duration: "20 mins",
      url: "https://www.youtube.com/watch?v=YMPMZmlH5Bo",
      description: "SMOTE oversampling and undersampling techniques.",
    },
  ],

  practiceProblems: [
    {
      id: "ml-clf-p1",
      title: "1. Sigmoid Activation Function",
      difficulty: "Easy",
      description: "Implement `sigmoid(z)` returning `1 / (1 + Math.exp(-z))` rounded to 2 decimal places.",
      hints: [
        "Hint 1: Math.exp(-z) computes e^-z.",
      ],
      starterCode: `function solution(z) {
  const val = 1 / (1 + Math.exp(-z));
  return Number(val.toFixed(2));
}`,
      solutionExplanation: "Sigmoid activation bounds real values to [0, 1].",
      testCases: [
        { input: [0], expected: 0.5 },
        { input: [2], expected: 0.88 },
        { input: [-2], expected: 0.12 },
      ],
    },
  ],
};

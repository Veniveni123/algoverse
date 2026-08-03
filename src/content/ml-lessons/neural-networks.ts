import type { MLLessonContent } from "@/types/ml-lesson";
import NeuralNetworkViz from "@/components/ml-viz/neural-network-viz";

export const neuralNetworksLesson: MLLessonContent = {
  slug: "neural-networks",
  topicKey: "ML: Neural Networks",
  category: "Neural Networks",
  title: "Artificial Neural Networks & Deep Learning",
  VisualizationComponent: NeuralNetworkViz,
  introduction:
    "Artificial Neural Networks (ANN) are computational models inspired by biological neural networks in the human brain. Interconnected layers of artificial neurons learn non-linear feature representations via backpropagation.",
  analogy:
    "Think of an organizational hierarchy reviewing a proposal: lower analysts check details, middle managers combine departmental insights, and executive directors make the final binary decision.",
  keyIdeas: [
    "Forward Pass: Computes layer linear combinations z = Wx + b followed by non-linear activations (ReLU, Sigmoid, Softmax).",
    "Loss Function: Measures prediction discrepancy (Cross-Entropy for classification, MSE for regression).",
    "Backpropagation: Uses calculus chain rule to calculate loss gradients with respect to every weight parameter across all layers.",
    "Activation Functions: Introduce non-linearity allowing neural networks to approximate arbitrary functions.",
  ],
  realWorldUses: [
    "Computer vision (object detection, facial recognition in images)",
    "Natural Language Processing (ChatGPT, Translation, Sentiment Analysis)",
    "Autonomous vehicle perception and trajectory planning",
    "Speech recognition and audio synthesis",
  ],
  advantages: [
    "Universal function approximator capable of learning complex high-dimensional signals",
    "Feature extraction occurs automatically during end-to-end training",
  ],
  disadvantages: [
    "Requires massive GPU computational resources and vast training datasets",
    "Black-box model architectures lack direct human interpretability",
  ],
  interviewQuestions: [
    {
      question: "What is Backpropagation?",
      answer:
        "Backpropagation applies the calculus chain rule backward from output loss layer to compute exact partial derivatives of loss with respect to every weight parameter: dL/dW = (dL/da) * (da/dz) * (dz/dW). Weights update via gradient descent.",
    },
    {
      question: "Why is ReLU preferred over Sigmoid in hidden layers of deep neural networks?",
      answer:
        "Sigmoid saturates at 0 and 1 with tiny gradients near zero, causing Vanishing Gradients in deep networks. ReLU has constant gradient = 1 for positive inputs, preventing gradient decay.",
    },
  ],

  detailedNotesHtml: `
    <h2>1. Multi-Layer Perceptron (MLP) Architecture</h2>
    <pre><code>Input Layer (X)       Hidden Layer (H)       Output Layer (Y)
   ( x1 ) -------------\\     ( h1 ) -------------\\
                        >===>                     >===> ( ŷ )
   ( x2 ) -------------/     ( h2 ) -------------/
  [Features]            [z = Wx + b -> ReLU]    [Sigmoid / Softmax]</code></pre>
  `,

  quiz: [
    {
      id: "nn-q1",
      question: "Which activation function computes f(x) = max(0, x)?",
      options: ["ReLU (Rectified Linear Unit)", "Sigmoid", "Tanh", "Softmax"],
      correctIndex: 0,
      explanation: "ReLU outputs 0 for negative values and passes positive values unchanged.",
    },
    {
      id: "nn-q2",
      question: "Backpropagation relies on which mathematical calculus rule?",
      options: ["Chain Rule of Derivatives", "Product Rule only", "Integration by Parts", "Bayes Theorem"],
      correctIndex: 0,
      explanation: "Backpropagation applies the chain rule to compute partial derivatives layer by layer.",
    },
    {
      id: "nn-q3",
      question: "Vanishing Gradient Problem in deep networks with Sigmoid activations occurs because:",
      options: [
        "Sigmoid derivatives near 0 and 1 are extremely small (<0.25), shrinking gradients exponentially",
        "Learning rate is zero",
        "Network has no weights",
        "Input features are negative",
      ],
      correctIndex: 0,
      explanation: "Multiplying small sigmoid gradients across deep layers causes gradients to vanish toward zero.",
    },
    {
      id: "nn-q4",
      question: "Which technique randomly deactivates neurons during training to prevent overfitting?",
      options: ["Dropout Regularization", "Batch Normalization", "Convolution", "Max Pooling"],
      correctIndex: 0,
      explanation: "Dropout randomly sets a fraction of neuron outputs to 0 during each training step.",
    },
    {
      id: "nn-q5",
      question: "Softmax activation function is used in the final layer for:",
      options: [
        "Multi-class classification (outputs sum to 1.0 probability)",
        "Binary regression",
        "Image cropping",
        "Feature scaling",
      ],
      correctIndex: 0,
      explanation: "Softmax normalizes real-valued logits into a multi-class probability distribution summing to 1.0.",
    },
    {
      id: "nn-q6",
      question: "Convolutional Neural Networks (CNNs) are specialized for processing what data type?",
      options: ["Grid-structured spatial data like Images & Video", "Audio signals only", "Tabular CSV rows", "Text files"],
      correctIndex: 0,
      explanation: "CNNs use spatial 2D/3D filter kernels to process image features.",
    },
    {
      id: "nn-q7",
      question: "Recurrent Neural Networks (RNNs / LSTMs) excel at handling:",
      options: ["Sequential temporal data like Time-Series & Text", "Static 2D images", "Unordered numbers", "K-Means clusters"],
      correctIndex: 0,
      explanation: "RNNs maintain internal hidden state memory across sequential time steps.",
    },
    {
      id: "nn-q8",
      question: "Adam Optimizer combines which two optimization concepts?",
      options: ["Momentum (moving average of gradients) & RMSProp (adaptive learning rates)", "Random Search & Grid Search", "L1 & L2", "Binary & Linear"],
      correctIndex: 0,
      explanation: "Adam combines momentum gradient tracking with RMSProp squared gradient scaling.",
    },
    {
      id: "nn-q9",
      question: "Batch Normalization stabilizes deep neural network training by:",
      options: [
        "Normalizing layer inputs to zero mean and unit variance per mini-batch",
        "Removing layers",
        "Increasing learning rate to 100",
        "Doubling weight sizes",
      ],
      correctIndex: 0,
      explanation: "Batch Norm normalizes intermediate layer activations across mini-batches.",
    },
    {
      id: "nn-q10",
      question: "Transformer neural network architectures (like GPT, BERT) use what key mechanism?",
      options: ["Self-Attention Mechanism", "Convolutions only", "Recurrent Loops", "K-Means"],
      correctIndex: 0,
      explanation: "Self-attention computes dynamic weight relationships between all sequence tokens concurrently.",
    },
  ],

  youtubeVideos: [
    {
      id: "ml-nn-yt-1",
      title: "But what is a neural network? | Chapter 1, Deep learning",
      channel: "3Blue1Brown",
      duration: "19 mins",
      url: "https://www.youtube.com/watch?v=aircAruvnKk",
      description: "Visual deep learning series introducing neurons and weights.",
    },
    {
      id: "ml-nn-yt-2",
      title: "Gradient descent, how neural networks learn | Chapter 2",
      channel: "3Blue1Brown",
      duration: "21 mins",
      url: "https://www.youtube.com/watch?v=IHZwWFHWa-w",
      description: "Visualizing cost surfaces and gradient descent optimization.",
    },
    {
      id: "ml-nn-yt-3",
      title: "What is backpropagation really doing? | Chapter 3",
      channel: "3Blue1Brown",
      duration: "14 mins",
      url: "https://www.youtube.com/watch?v=Ilg3gGewQ5U",
      description: "Intuitive visual breakdown of backpropagation error steps.",
    },
    {
      id: "ml-nn-yt-4",
      title: "Backpropagation calculus | Chapter 4",
      channel: "3Blue1Brown",
      duration: "10 mins",
      url: "https://www.youtube.com/watch?v=tIeHLnjs5U8",
      description: "Chain rule matrix calculus derivation.",
    },
    {
      id: "ml-nn-yt-5",
      title: "Convolutional Neural Networks (CNNs) Explained",
      channel: "StatQuest",
      duration: "22 mins",
      url: "https://www.youtube.com/watch?v=HGwBXDKFk9I",
      description: "Filters, padding, stride, and max pooling.",
    },
    {
      id: "ml-nn-yt-6",
      title: "Recurrent Neural Networks (RNNs) and LSTMs",
      channel: "StatQuest",
      duration: "18 mins",
      url: "https://www.youtube.com/watch?v=YCzL96nL7ac",
      description: "Sequential memory gates and cell states.",
    },
    {
      id: "ml-nn-yt-7",
      title: "Transformer Neural Networks (Attention is All You Need)",
      channel: "StatQuest",
      duration: "28 mins",
      url: "https://www.youtube.com/watch?v=zxQyTK8quyY",
      description: "Query, Key, Value self-attention matrices.",
    },
    {
      id: "ml-nn-yt-8",
      title: "PyTorch for Beginners - Full Course",
      channel: "FreeCodeCamp",
      duration: "3 hrs 30 mins",
      url: "https://www.youtube.com/watch?v=V_xro1bcAuA",
      description: "Building neural networks in PyTorch.",
    },
    {
      id: "ml-nn-yt-9",
      title: "TensorFlow 2.0 Complete Course",
      channel: "FreeCodeCamp",
      duration: "6 hrs 50 mins",
      url: "https://www.youtube.com/watch?v=tPYj3fFJGjk",
      description: "Deep learning models with Keras and TensorFlow.",
    },
    {
      id: "ml-nn-yt-10",
      title: "Neural Network From Scratch in Python",
      channel: "sentdex",
      duration: "20 mins",
      url: "https://www.youtube.com/watch?v=Wo5dMEP_BbI",
      description: "Coding forward pass and backpropagation from scratch.",
    },
  ],

  practiceProblems: [
    {
      id: "ml-nn-p1",
      title: "1. ReLU Activation Function",
      difficulty: "Easy",
      description: "Implement `relu(x)` returning `Math.max(0, x)` for input number `x`.",
      hints: [
        "Hint 1: If x < 0, return 0, else return x.",
      ],
      starterCode: `function solution(x) {
  return Math.max(0, x);
}`,
      solutionExplanation: "ReLU activation zeroes out negative values.",
      testCases: [
        { input: [5], expected: 5 },
        { input: [-3], expected: 0 },
        { input: [0], expected: 0 },
      ],
    },
  ],
};

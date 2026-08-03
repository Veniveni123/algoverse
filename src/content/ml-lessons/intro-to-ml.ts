import type { MLLessonContent } from "@/types/ml-lesson";
import LinearRegressionViz from "@/components/ml-viz/linear-regression-viz";

export const introToMLLesson: MLLessonContent = {
  slug: "intro-to-ml",
  topicKey: "ML: Fundamentals",
  category: "Fundamentals",
  title: "Introduction to Machine Learning & Model Evaluation",
  VisualizationComponent: LinearRegressionViz,
  introduction:
    "Machine Learning is a major branch of Artificial Intelligence where mathematical algorithms automatically extract predictive patterns from historical data without requiring hard-coded rules.",
  analogy:
    "Think of teaching a child to recognize cats. Instead of writing 5,000 IF-statements for ear shape, whisker count, and tail length, you show the child 10,000 photos of cats and non-cats until their neural network automatically learns to distinguish them.",
  keyIdeas: [
    "Supervised Learning: Models train on labeled input-target pairs (Regression for continuous values, Classification for discrete categories).",
    "Unsupervised Learning: Models discover hidden structures and groupings in unlabeled data (K-Means Clustering, PCA).",
    "Reinforcement Learning: Autonomous agents optimize long-term actions through environment reward signals (AlphaGo, Q-Learning).",
    "Train / Validation / Test Splits: Validates model generalizability on unseen data to prevent memorization.",
    "Bias-Variance Tradeoff: Balances underfitting (high bias) against overfitting (high variance).",
  ],
  realWorldUses: [
    "Email spam and phishing detection filters (Bayesian / Logistic Classifier)",
    "Medical diagnostic imaging (MRI & CT scan cancer detection)",
    "Personalized recommendation systems (Netflix, Spotify, Amazon)",
    "Automated credit scoring and financial fraud detection",
  ],
  advantages: [
    "Discovers complex non-linear feature relationships impossible to code manually",
    "Scales automatically with continuous incoming data streams",
    "Adapts to evolving environments (e.g. dynamic fraud patterns)",
  ],
  disadvantages: [
    "High sensitivity to bad, missing, or biased training data",
    "Complex models (Deep Neural Networks) suffer from the 'Black Box' interpretability problem",
    "Prone to overfitting if evaluation metrics and data splits are improperly set up",
  ],
  interviewQuestions: [
    {
      question: "What is the difference between Overfitting and Underfitting, and how do you diagnose them?",
      answer:
        "Underfitting (High Bias) occurs when a model is too simple, yielding poor accuracy on both training and test data. Overfitting (High Variance) occurs when a model memorizes training noise, scoring high on training data but poorly on test data. Diagnosed by comparing training loss vs validation loss curves.",
    },
    {
      question: "Why is Feature Scaling (Standardization vs Min-Max Normalization) essential for gradient-based models?",
      answer:
        "Unscaled features with large numerical ranges (e.g. Salary $100,000) distort gradient descent steps compared to small features (e.g. Age 25). Feature scaling ensures spherical loss contours, enabling faster and stable gradient convergence.",
    },
    {
      question: "What is the Data Leakage problem in Machine Learning and how do you prevent it?",
      answer:
        "Data Leakage occurs when information from outside the training dataset (such as test set statistics) leaks into model training (e.g. scaling before splitting data). Prevent it by splitting train/val/test sets FIRST before applying fit transformations.",
    },
    {
      question: "What is the Bias-Variance Tradeoff?",
      answer:
        "Total Error = Bias² + Variance + Irreducible Error. High bias algorithms simplify assumptions (underfit). High variance algorithms over-react to training noise (overfit). The goal is finding optimal complexity minimizing total error.",
    },
  ],

  commonMistakes: [
    "Applying feature scaling transformations to the dataset BEFORE splitting into train/test sets (Data Leakage)",
    "Evaluating imbalanced classification datasets using simple Accuracy instead of ROC-AUC, Precision, or Recall",
    "Ignoring feature correlation (Multicollinearity) in linear modeling",
    "Confusing Hyperparameters (set manually before training) with Model Parameters (learned during training)",
  ],

  projectIdeas: [
    "End-to-End Real Estate Price Predictor: Build a Scikit-Learn pipeline predicting house prices with data cleaning, feature scaling, and cross-validation",
    "Spam Filter Classifier CLI: Train a Naive Bayes model classifying emails into Spam vs Normal with a confusion matrix dashboard",
    "Model Evaluation Playground: Create a React application plotting Bias-Variance loss curves for varying polynomial regression degrees",
    "Customer Churn Predictor API: Deploy a Fast-API service serving real-time churn predictions with SHAP explainability metrics",
  ],

  youtubeVideos: [
    {
      id: "ml-yt-1",
      title: "Machine Learning Fundamentals Course",
      channel: "StatQuest with Josh Starmer",
      duration: "20 mins",
      url: "https://youtube.com/results?search_query=Machine+Learning+Fundamentals+StatQuest+Supervised+Unsupervised",
      description: "Visual breakdown of Supervised vs Unsupervised learning, Bias-Variance, and model evaluation.",
    },
    {
      id: "ml-yt-2",
      title: "Overfitting, Underfitting & Scaling",
      channel: "3Blue1Brown",
      duration: "18 mins",
      url: "https://youtube.com/results?search_query=Overfitting+Underfitting+Feature+Scaling+Machine+Learning",
      description: "Mathematical intuition behind model generalization and scaling transformations.",
    },
  ],

  detailedNotesHtml: `
    <div style="font-family: system-ui, sans-serif; line-height: 1.7; color: #CBD5E1;">
      <h2 style="color: #8B5CF6; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">1. The Machine Learning Paradigm & Taxonomy</h2>
      <p>Machine Learning categorizes problems based on feedback signals available during training:</p>

      <!-- Visual Diagram 1: ML Spectrum Topology -->
      <div style="background: #0B1120; border: 1px solid #7C3AED; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #34D399; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 1: Machine Learning Taxonomy & Problem Types</div>
        <svg viewBox="0 0 580 180" style="width: 100%; max-width: 550px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <rect x="200" y="15" width="180" height="30" rx="6" fill="#7C3AED"/> <text x="290" y="34" fill="#FFF" font-weight="bold">MACHINE LEARNING</text>

            <line x1="290" y1="45" x2="110" y2="75" stroke="#06B6D4" stroke-width="2"/>
            <line x1="290" y1="45" x2="290" y2="75" stroke="#06B6D4" stroke-width="2"/>
            <line x1="290" y1="45" x2="470" y2="75" stroke="#06B6D4" stroke-width="2"/>

            <rect x="30" y="75" width="160" height="35" rx="4" fill="#1E1B4B" stroke="#06B6D4"/>
            <text x="110" y="96" fill="#6EE7B7" font-weight="bold">Supervised (Labels)</text>

            <rect x="210" y="75" width="160" height="35" rx="4" fill="#1E1B4B" stroke="#06B6D4"/>
            <text x="290" y="96" fill="#38BDF8" font-weight="bold">Unsupervised (No Labels)</text>

            <rect x="390" y="75" width="160" height="35" rx="4" fill="#1E1B4B" stroke="#06B6D4"/>
            <text x="470" y="96" fill="#FBBF24" font-weight="bold">Reinforcement (Rewards)</text>

            <!-- Supervised Sub-branches -->
            <rect x="15" y="130" width="90" height="25" rx="3" fill="#312E81"/> <text x="60" y="146" fill="#FFF">Regression</text>
            <rect x="115" y="130" width="90" height="25" rx="3" fill="#312E81"/> <text x="160" y="146" fill="#FFF">Classification</text>

            <!-- Unsupervised Sub-branches -->
            <rect x="215" y="130" width="70" height="25" rx="3" fill="#065F46"/> <text x="250" y="146" fill="#FFF">Cluster</text>
            <rect x="295" y="130" width="70" height="25" rx="3" fill="#065F46"/> <text x="330" y="146" fill="#FFF">PCA</text>
          </g>
        </svg>
      </div>

      <h2 style="color: #06B6D4; margin-top: 24px;">2. Train / Test Split & Scaling Pipeline Code Walkthrough</h2>
      <p>Correct data pipeline structure preventing Data Leakage:</p>

      <pre style="background: #050816; border: 1px solid #1E293B; border-radius: 8px; padding: 14px; color: #34D399; font-family: monospace; font-size: 13px;">
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

# 1. Split data BEFORE fitting any scaler (Prevents Data Leakage)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 2. Fit scaler ONLY on training data
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test) # Transform test using TRAIN parameters!

# 3. Train model on scaled training features
model = LogisticRegression()
model.fit(X_train_scaled, y_train)

# 4. Evaluate on scaled unseen test data
predictions = model.predict(X_test_scaled)
print("Accuracy:", accuracy_score(y_test, predictions))
      </pre>

      <h3 style="color: #F59E0B;">Step-by-Step Pipeline Execution Summary:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px;">
        <thead>
          <tr style="background: #1E293B; color: #38BDF8;">
            <th style="padding: 8px; border: 1px solid #334155;">Step</th>
            <th style="padding: 8px; border: 1px solid #334155;">Operation</th>
            <th style="padding: 8px; border: 1px solid #334155;">Target Dataset</th>
            <th style="padding: 8px; border: 1px solid #334155;">Data Leakage Defense</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">1</td>
            <td style="padding: 8px; border: 1px solid #334155;">Train/Test Split</td>
            <td style="padding: 8px; border: 1px solid #334155;">Full Raw Dataset</td>
            <td style="padding: 8px; border: 1px solid #334155;">Isolates test data completely from training loop</td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">2</td>
            <td style="padding: 8px; border: 1px solid #334155;">Scaler <code>fit_transform</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">Training Features <code>X_train</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">Calculates mean μ & std σ from training set ONLY</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">3</td>
            <td style="padding: 8px; border: 1px solid #334155;">Scaler <code>transform</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">Test Features <code>X_test</code></td>
            <td style="padding: 8px; border: 1px solid #334155;">Applies training μ & σ without computing test stats</td>
          </tr>
        </tbody>
      </table>

      <!-- Visual Diagram 2: Bias-Variance Curve -->
      <div style="background: #0B1120; border: 1px solid #06B6D4; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #22D3EE; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 2: Bias-Variance Tradeoff Curves & Total Error Minimum</div>
        <svg viewBox="0 0 520 200" style="width: 100%; max-width: 480px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <line x1="50" y1="170" x2="480" y2="170" stroke="#475569" stroke-width="2"/>
            <line x1="50" y1="170" x2="50" y2="20" stroke="#475569" stroke-width="2"/>
            <text x="260" y="192" fill="#94A3B8">Model Complexity →</text>

            <!-- Bias Curve -->
            <path d="M 60 40 Q 200 130 460 160" fill="none" stroke="#38BDF8" stroke-width="3"/>
            <text x="110" y="45" fill="#38BDF8" font-weight="bold">High Bias (Underfit)</text>

            <!-- Variance Curve -->
            <path d="M 60 160 Q 300 150 460 30" fill="none" stroke="#F43F5E" stroke-width="3"/>
            <text x="410" y="30" fill="#F43F5E" font-weight="bold">High Variance (Overfit)</text>

            <!-- Total Error Curve -->
            <path d="M 60 130 Q 240 60 460 120" fill="none" stroke="#34D399" stroke-width="3" stroke-dasharray="4"/>
            <text x="240" y="50" fill="#34D399" font-weight="bold">Optimal Sweet Spot</text>
          </g>
        </svg>
      </div>

      <!-- Visual Diagram 3: Feature Scaling Transformation -->
      <div style="background: #0B1120; border: 1px solid #F59E0B; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #FBBF24; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 3: Feature Scaling Transformation (Standardization Z = (X - μ) / σ)</div>
        <svg viewBox="0 0 500 130" style="width: 100%; max-width: 460px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <rect x="30" y="30" width="180" height="40" rx="4" fill="#1E293B" stroke="#F43F5E"/>
            <text x="120" y="55" fill="#FFF">Salary ($30k - $250k)</text>

            <text x="250" y="55" fill="#34D399" font-weight="bold">→ Z-Score →</text>

            <rect x="290" y="30" width="180" height="40" rx="4" fill="#065F46" stroke="#34D399"/>
            <text x="380" y="55" fill="#FFF">Scaled Z (-3.0 to +3.0)</text>

            <text x="250" y="105" fill="#94A3B8">Equalizes feature weight in gradient updates!</text>
          </g>
        </svg>
      </div>
    </div>
  `,

  quiz: [
    {
      id: "ml1-q1",
      question: "Which type of Machine Learning utilizes labeled input-target pairs during model training?",
      options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Heuristic Search"],
      correctIndex: 0,
      explanation: "Supervised Learning models map features (X) to explicit ground-truth targets (y).",
    },
    {
      id: "ml1-q2",
      question: "What is the primary indicator that a Machine Learning model is OVERFITTING?",
      options: ["High accuracy on training data but poor performance on unseen test data", "Poor performance on both training and test data", "Model trains in 1 second", "Model loss is 0 on all datasets"],
      correctIndex: 0,
      explanation: "Overfitting occurs when a model memorizes training noise, degrading test set generalizability.",
    },
    {
      id: "ml1-q3",
      question: "Why must Feature Scaling parameters (μ and σ) be fit ONLY on the training dataset?",
      options: ["Prevents Data Leakage from test data into the training process", "Makes model run 10x faster", "Decreases dataset size", "Encrypts features"],
      correctIndex: 0,
      explanation: "Computing statistics on the entire dataset leaks unseen test set distributions into training.",
    },
    {
      id: "ml1-q4",
      question: "Which formula calculates Standardization (Z-score scaling)?",
      options: ["Z = (X - μ) / σ", "Z = (X - min) / (max - min)", "Z = X²", "Z = log(X)"],
      correctIndex: 0,
      explanation: "Standardization subtracts mean μ and divides by standard deviation σ, yielding zero mean and unit variance.",
    },
    {
      id: "ml1-q5",
      question: "What does an UNDERFITTING model suffer from?",
      options: ["High Bias", "High Variance", "Zero Error", "Data Leakage"],
      correctIndex: 0,
      explanation: "Underfitting algorithms make overly simplistic assumptions (High Bias), failing to learn basic relationships.",
    },
    {
      id: "ml1-q6",
      question: "Which task is an example of UNSUPERVISED Learning?",
      options: ["Customer Market Segmentation using K-Means Clustering", "House Price Prediction", "Spam Email Classification", "Image Sentiment Labeling"],
      correctIndex: 0,
      explanation: "Market segmentation groups unlabeled customer features without pre-existing target labels.",
    },
    {
      id: "ml1-q7",
      question: "What metric is most appropriate for evaluating an imbalanced medical fraud detection dataset?",
      options: ["ROC-AUC & Precision/Recall (PR-AUC)", "Simple Accuracy", "Mean Squared Error", "R² Score"],
      correctIndex: 0,
      explanation: "Simple accuracy is misleading on imbalanced datasets (e.g. 99% non-fraud); ROC-AUC & Recall accurately capture minority class detection.",
    },
    {
      id: "ml1-q8",
      question: "What is the distinction between Model Parameters and Hyperparameters?",
      options: [
        "Model Parameters are learned during training (weights w, bias b); Hyperparameters are manually configured before training (learning rate, tree depth)",
        "Hyperparameters are learned automatically; Model Parameters are set manually",
        "They are identical terms",
        "Hyperparameters apply only to SQL databases",
      ],
      correctIndex: 0,
      explanation: "Model parameters (weights) are optimized during training; hyperparameters (learning rate) control training configuration.",
    },
    {
      id: "ml1-q9",
      question: "What technique splits data into K equal folds to robustly evaluate model generalization?",
      options: ["K-Fold Cross-Validation", "Min-Max Normalization", "Gradient Descent", "Principal Component Analysis"],
      correctIndex: 0,
      explanation: "K-Fold Cross-Validation rotates training and validation folds to calculate robust out-of-sample performance.",
    },
    {
      id: "ml1-q10",
      question: "What is the result of applying Log Transformation `np.log1p(X)` to skewed features?",
      options: ["Compresses long right-tailed skewed distributions into a more normal Gaussian shape", "Doubles feature values", "Removes missing values", "Converts strings to floats"],
      correctIndex: 0,
      explanation: "Log transformations reduce right-skewness, improving linear model performance.",
    },
  ],

  practiceProblems: [
    {
      id: "ml1-p1",
      title: "1. Train Test Split & Standardization",
      difficulty: "Easy",
      description: "Implement a function `scaleFeatures(X_train, X_test)` that standardizes features using `(X - μ) / σ` derived strictly from `X_train`.",
      hints: ["Compute mean and std from X_train. Transform both X_train and X_test using training stats."],
      starterCode: `function scaleFeatures(X_train, X_test) {
  let mean = X_train.reduce((a, b) => a + b, 0) / X_train.length;
  let variance = X_train.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / X_train.length;
  let std = Math.sqrt(variance);
  
  let scaledTrain = X_train.map(x => (x - mean) / std);
  let scaledTest = X_test.map(x => (x - mean) / std);
  return { scaledTrain, scaledTest };
}`,
      solutionExplanation: "Standardizing features using training distribution prevents data leakage.",
      testCases: [
        { input: [[10, 20, 30], [40, 50]], expected: { scaledTrain: [-1.224744871391589, 0, 1.224744871391589], scaledTest: [2.449489742783178, 3.674234614174767] } },
      ],
    },
  ],
};

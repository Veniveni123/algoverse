import type { MLLessonContent } from "@/types/ml-lesson";
import LinearRegressionViz from "@/components/ml-viz/linear-regression-viz";

export const linearRegressionLesson: MLLessonContent = {
  slug: "linear-regression",
  topicKey: "ML: Linear Regression",
  category: "Regression",
  title: "Linear Regression, Gradient Descent & Regularization",
  VisualizationComponent: LinearRegressionViz,
  introduction:
    "Linear Regression is a foundational supervised algorithm modeling continuous numerical target variables by fitting a linear hyperplane that minimizes Mean Squared Error (MSE) loss between predicted and actual values.",
  analogy:
    "Imagine plotting student study hours against final exam scores on a scatter plot. Linear Regression draws the single best-fit trend line through the points that minimizes the sum of squared vertical distance errors from every point to the line.",
  keyIdeas: [
    "Model Equation: ŷ = w₁x₁ + w₂x₂ + ... + wₙxₙ + b (or in matrix form ŷ = XW + b).",
    "Mean Squared Error (MSE) Loss: L(w, b) = (1 / 2N) * ∑(ŷᵢ - yᵢ)², forming a strictly convex bowl loss surface.",
    "Gradient Descent Optimization: Iteratively updates weights w = w - α * ∂L/∂w using learning rate α.",
    "Normal Equation Closed-Form Solution: W = (XᵀX)⁻¹Xᵀy computes exact optimal weights directly in O(D³) time.",
    "Lasso (L1) vs Ridge (L2) Regularization: Penalty terms preventing overfitting by shrinking weights (L1 zeroing features, L2 smoothing weights).",
  ],
  realWorldUses: [
    "Real estate market valuation (predicting house prices from square footage, location, and age)",
    "Corporate revenue forecasting based on multi-channel marketing ad spend",
    "Insurance claim payout risk estimation from demographic and health metrics",
    "Agricultural crop yield forecasting based on soil nitrogen and rainfall levels",
  ],
  advantages: [
    "Simple, fast to train, and highly interpretable model coefficients",
    "Convex Mean Squared Error loss guarantees convergence to the global minimum",
    "Serves as the baseline benchmark for all regression problems",
  ],
  disadvantages: [
    "Fails to capture complex non-linear relationships without manual feature engineering",
    "Highly sensitive to extreme outliers which distort line slope",
    "Assumes feature independence (suffers under Multicollinearity)",
  ],
  interviewQuestions: [
    {
      question: "How does Gradient Descent compute partial derivatives to update weights in Linear Regression?",
      answer:
        "Gradient w.r.t weight w: ∂L/∂w = (1/N) * ∑((Xw + b - y) * X). Gradient w.r.t bias b: ∂L/∂b = (1/N) * ∑(Xw + b - y). Weight update rule: w_new = w_old - α * (∂L/∂w).",
    },
    {
      question: "What happens if learning rate α is chosen too large or too small?",
      answer:
        "If α is too small, gradient updates take tiny steps requiring millions of iterations to converge. If α is too large, weight updates overshoot the global minimum bowl, causing loss to oscillate or diverge to infinity.",
    },
    {
      question: "What is the key difference between Lasso (L1) and Ridge (L2) Regularization?",
      answer:
        "Ridge (L2) adds penalty λ * ∑w² to loss, shrinking weights towards zero without setting them to zero. Lasso (L1) adds penalty λ * ∑|w|, driving uninformative feature weights strictly to zero (performing built-in Feature Selection).",
    },
    {
      question: "When should you use the Normal Equation vs Gradient Descent for Linear Regression?",
      answer:
        "Use Normal Equation `W = (XᵀX)⁻¹Xᵀy` for small feature dimensions (N < 10,000) because it computes exact weights without choosing learning rates. Use Gradient Descent for large feature datasets (N > 100,000) because matrix inversion `O(D³)` becomes computationally impossible.",
    },
  ],

  commonMistakes: [
    "Failing to standardize/scale features before applying L1/L2 Regularization (distorts weight penalty scale)",
    "Using Linear Regression on non-linear datasets without adding polynomial features `x²`, `x³`",
    "Not checking for Multicollinearity (high correlation between features), causing unstable weight coefficients",
    "Ignoring outliers that heavily pull the fitted regression line away from true central trends",
  ],

  projectIdeas: [
    "House Price Prediction Pipeline: Build a Scikit-Learn pipeline training Ridge & Lasso models with cross-validated hyperparameter tuning",
    "Custom Gradient Descent Engine: Implement a NumPy-based Linear Regression class with interactive learning rate loss curve animation",
    "Marketing Ad Spend ROI Calculator: Build a Streamlit app estimating sales revenue from multi-channel ad budgets",
    "Polynomial Trend Fitting Simulator: Create an interactive WebGL app showing how higher polynomial degrees cause overfitting",
  ],

  youtubeVideos: [
    {
      id: "lr-yt-1",
      title: "Linear Regression & Gradient Descent Visualized",
      channel: "StatQuest with Josh Starmer",
      duration: "18 mins",
      url: "https://youtube.com/results?search_query=Linear+Regression+StatQuest+Gradient+Descent+MSE",
      description: "Visual breakdown of linear regression equations, cost surfaces, and gradient descent.",
    },
    {
      id: "lr-yt-2",
      title: "L1 Lasso vs L2 Ridge Regularization",
      channel: "3Blue1Brown ML",
      duration: "16 mins",
      url: "https://youtube.com/results?search_query=Lasso+L1+vs+Ridge+L2+Regularization+Tutorial",
      description: "Geometric intuition behind L1 feature sparsity vs L2 weight shrinkage.",
    },
  ],

  detailedNotesHtml: `
    <div style="font-family: system-ui, sans-serif; line-height: 1.7; color: #CBD5E1;">
      <h2 style="color: #8B5CF6; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">1. Best-Fit Trend Line & Residual Errors</h2>
      <p>Linear Regression finds slope $w$ and intercept $b$ minimizing vertical residual distance errors:</p>

      <!-- Visual Diagram 1: Linear Regression Line & Residuals -->
      <div style="background: #0B1120; border: 1px solid #7C3AED; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #34D399; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 1: Best-Fit Line (ŷ = wx + b) & Residual Error Discrepancies</div>
        <svg viewBox="0 0 520 200" style="width: 100%; max-width: 480px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <line x1="50" y1="170" x2="480" y2="170" stroke="#475569" stroke-width="2"/>
            <line x1="50" y1="170" x2="50" y2="20" stroke="#475569" stroke-width="2"/>
            <text x="260" y="192" fill="#94A3B8">Feature X (Square Feet) →</text>
            <text x="20" y="95" fill="#94A3B8" transform="rotate(-90 20,95)">Target Y ($) →</text>

            <!-- Regression Line -->
            <line x1="70" y1="150" x2="450" y2="30" stroke="#06B6D4" stroke-width="3"/>

            <!-- Points and Residual Lines -->
            <circle cx="120" cy="110" r="5" fill="#F43F5E"/>
            <line x1="120" y1="110" x2="120" y2="134" stroke="#F43F5E" stroke-dasharray="3"/>

            <circle cx="250" cy="70" r="5" fill="#F43F5E"/>
            <line x1="250" y1="70" x2="250" y2="93" stroke="#F43F5E" stroke-dasharray="3"/>

            <circle cx="380" cy="65" r="5" fill="#F43F5E"/>
            <line x1="380" y1="65" x2="380" y2="52" stroke="#F43F5E" stroke-dasharray="3"/>

            <text x="320" y="40" fill="#06B6D4" font-weight="bold">ŷ = wx + b</text>
            <text x="200" y="120" fill="#F87171">Residual = (yᵢ - ŷᵢ)</text>
          </g>
        </svg>
      </div>

      <h2 style="color: #06B6D4; margin-top: 24px;">2. Gradient Descent Optimization Step-by-Step Walkthrough</h2>
      <p>Gradient descent steps down the convex MSE loss surface to find minimal cost parameters:</p>

      <pre style="background: #050816; border: 1px solid #1E293B; border-radius: 8px; padding: 14px; color: #34D399; font-family: monospace; font-size: 13px;">
import numpy as np

def linear_regression_gd(X, y, lr=0.01, epochs=1000):
  N, D = X.shape
  w = np.zeros(D) # Initialize weights to zero
  b = 0.0          # Initialize bias to zero
  
  for epoch in range(epochs):
    y_pred = np.dot(X, w) + b
    error = y_pred - y
    
    # Compute gradients
    dw = (1 / N) * np.dot(X.T, error)
    db = (1 / N) * np.sum(error)
    
    # Update parameters
    w -= lr * dw
    b -= lr * db
    
    if epoch % 100 == 0:
      loss = (1 / (2 * N)) * np.sum(error ** 2)
      print(f"Epoch {epoch}: Loss = {loss:.4f}")
      
  return w, b
      </pre>

      <h3 style="color: #F59E0B;">Step-by-Step Epoch Loss Reduction Trace:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px;">
        <thead>
          <tr style="background: #1E293B; color: #38BDF8;">
            <th style="padding: 8px; border: 1px solid #334155;">Epoch</th>
            <th style="padding: 8px; border: 1px solid #334155;">Weight w</th>
            <th style="padding: 8px; border: 1px solid #334155;">Bias b</th>
            <th style="padding: 8px; border: 1px solid #334155;">MSE Loss</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">0</td>
            <td style="padding: 8px; border: 1px solid #334155;">0.00</td>
            <td style="padding: 8px; border: 1px solid #334155;">0.00</td>
            <td style="padding: 8px; border: 1px solid #334155; color: #F43F5E;">45.20</td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">100</td>
            <td style="padding: 8px; border: 1px solid #334155;">1.42</td>
            <td style="padding: 8px; border: 1px solid #334155;">0.85</td>
            <td style="padding: 8px; border: 1px solid #334155;">8.15</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #334155; text-align: center;">500</td>
            <td style="padding: 8px; border: 1px solid #334155;">2.18</td>
            <td style="padding: 8px; border: 1px solid #334155;">1.92</td>
            <td style="padding: 8px; border: 1px solid #334155; color: #34D399; font-weight: bold;">0.12 (Optimal)</td>
          </tr>
        </tbody>
      </table>

      <!-- Visual Diagram 2: Convex Loss Bowl Gradient Steps -->
      <div style="background: #0B1120; border: 1px solid #06B6D4; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #22D3EE; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 2: Convex MSE Loss Surface Gradient Descent Descent</div>
        <svg viewBox="0 0 500 150" style="width: 100%; max-width: 460px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <path d="M 50 30 Q 250 180 450 30" fill="none" stroke="#06B6D4" stroke-width="3"/>

            <circle cx="80" cy="50" r="6" fill="#F43F5E"/> <text x="120" y="52" fill="#F87171">Start (w_0)</text>
            <path d="M 86 54 L 140 85" stroke="#FBBF24" stroke-width="2" marker-end="url(#arrow)"/>

            <circle cx="150" cy="90" r="6" fill="#FBBF24"/>
            <path d="M 156 94 L 210 115" stroke="#FBBF24" stroke-width="2" marker-end="url(#arrow)"/>

            <circle cx="250" cy="125" r="8" fill="#34D399"/> <text x="250" y="145" fill="#34D399" font-weight="bold">Global Min Loss</text>
          </g>
        </svg>
      </div>

      <!-- Visual Diagram 3: L1 Lasso vs L2 Ridge Contours -->
      <div style="background: #0B1120; border: 1px solid #F59E0B; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="color: #FBBF24; font-weight: bold; font-family: monospace; margin-bottom: 12px;">FIGURE 3: L1 Lasso (Diamond Corner Sparsity) vs L2 Ridge (Circle Shrinkage)</div>
        <svg viewBox="0 0 500 140" style="width: 100%; max-width: 460px; height: auto;">
          <g font-family="monospace" font-size="11" text-anchor="middle">
            <!-- L1 Diamond -->
            <polygon points="120,30 170,75 120,120 70,75" fill="none" stroke="#F43F5E" stroke-width="2"/>
            <circle cx="170" cy="75" r="5" fill="#F43F5E"/>
            <text x="120" y="138" fill="#F87171">L1: Zeroes Feature (w1=0)</text>

            <!-- L2 Circle -->
            <circle cx="380" cy="75" r="45" fill="none" stroke="#34D399" stroke-width="2"/>
            <circle cx="415" cy="50" r="5" fill="#34D399"/>
            <text x="380" y="138" fill="#34D399">L2: Shrinks w smoothly</text>
          </g>
        </svg>
      </div>
    </div>
  `,

  quiz: [
    {
      id: "lr-q1",
      question: "What loss function does Linear Regression minimize during parameter training?",
      options: ["Mean Squared Error (MSE)", "Cross-Entropy Loss", "Hinge Loss", "Kullback-Leibler Divergence"],
      correctIndex: 0,
      explanation: "Linear Regression minimizes Mean Squared Error (MSE) loss between predictions ŷ and targets y.",
    },
    {
      id: "lr-q2",
      question: "What geometric property of the MSE loss surface guarantees finding the global minimum in Linear Regression?",
      options: ["Convexity (single bowl without local minima traps)", "Non-convexity", "Oscillation", "Discontinuity"],
      correctIndex: 0,
      explanation: "MSE is strictly convex, guaranteeing that gradient descent always reaches the unique global minimum.",
    },
    {
      id: "lr-q3",
      question: "What is the closed-form matrix solution formula for Linear Regression (Normal Equation)?",
      options: ["W = (XᵀX)⁻¹Xᵀy", "W = Xᵀy", "W = X / y", "W = (XXᵀ)y"],
      correctIndex: 0,
      explanation: "Setting the derivative of MSE loss to zero yields the Normal Equation W = (XᵀX)⁻¹Xᵀy.",
    },
    {
      id: "lr-q4",
      question: "Why does Lasso (L1) Regularization perform automatic Feature Selection?",
      options: ["The diamond constraint geometry hits axes at sharp corners, forcing non-informative weights strictly to zero", "It doubles learning rate", "It converts floats to integers", "It removes rows"],
      correctIndex: 0,
      explanation: "L1 penalty contours intersect loss ellipses at diamond vertices on axes, zeroing unneeded feature weights.",
    },
    {
      id: "lr-q5",
      question: "What penalty term does Ridge (L2) Regularization add to the cost function?",
      options: ["λ * ∑wᵢ² (Sum of squared weights)", "λ * ∑|wᵢ|", "λ * max(w)", "λ * log(w)"],
      correctIndex: 0,
      explanation: "Ridge (L2) adds L2 norm squared penalty λ * ∑wᵢ², shrinking weights smoothly towards zero.",
    },
    {
      id: "lr-q6",
      question: "What is the primary drawback of using the Normal Equation `W = (XᵀX)⁻¹Xᵀy` on large datasets?",
      options: ["Matrix inversion `(XᵀX)⁻¹` requires O(D³) time complexity, becoming unfeasible for large feature counts D", "It requires 1000 epochs", "It only works on binary data", "It causes overfitting"],
      correctIndex: 0,
      explanation: "Inverting a D x D matrix takes O(D³) operations, making Gradient Descent preferred when D > 10,000.",
    },
    {
      id: "lr-q7",
      question: "What metric measures the proportion of target variance explained by a Linear Regression model?",
      options: ["R-Squared Score (R²)", "Mean Absolute Error (MAE)", "Precision", "F1 Score"],
      correctIndex: 0,
      explanation: "R² score ranges from 0 to 1, representing the percentage of target variance captured by the model.",
    },
    {
      id: "lr-q8",
      question: "What problem arises when independent features are highly correlated with each other?",
      options: ["Multicollinearity (unstable weight estimates with high variance)", "Data Leakage", "Vanishing Gradients", "Underfitting"],
      correctIndex: 0,
      explanation: "Multicollinearity makes matrix (XᵀX) near-singular, resulting in erratic weight coefficients.",
    },
    {
      id: "lr-q9",
      question: "If learning rate α = 0.9 causes loss to bounce to infinity, how should α be adjusted?",
      options: ["Decrease α (e.g. try 0.01 or 0.001)", "Increase α to 5.0", "Set α to 0", "Multiply α by 100"],
      correctIndex: 0,
      explanation: "Divergent loss indicates overshooting; decreasing learning rate α stabilizes gradient steps.",
    },
    {
      id: "lr-q10",
      question: "How can Linear Regression fit non-linear curves like parabolas or cubics?",
      options: ["By transforming features using Polynomial Features (`x²`, `x³`) before fitting linear weights", "By changing loss to cross-entropy", "By adding more rows", "It is impossible"],
      correctIndex: 0,
      explanation: "Adding non-linear feature powers (`x²`) allows linear models to fit curves while keeping weight optimization linear.",
    },
  ],

  practiceProblems: [
    {
      id: "lr-p1",
      title: "1. Mean Squared Error (MSE) Implementation",
      difficulty: "Easy",
      description: "Implement a function `computeMSE(y_true, y_pred)` returning the Mean Squared Error between true targets and model predictions.",
      hints: ["Compute (1/N) * sum((y_pred[i] - y_true[i])^2)."],
      starterCode: `function computeMSE(y_true, y_pred) {
  let n = y_true.length;
  let sumSquaredError = 0;
  for (let i = 0; i < n; i++) {
    sumSquaredError += Math.pow(y_pred[i] - y_true[i], 2);
  }
  return sumSquaredError / n;
}`,
      solutionExplanation: "MSE loss computation runs in O(N) linear time.",
      testCases: [
        { input: [[3, -0.5, 2, 7], [2.5, 0, 2, 8]], expected: 0.375 },
      ],
    },
  ],
};

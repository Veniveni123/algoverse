import { DEFAULT_AI_MODEL, getProviderConfig } from "@/config/ai";
import { OpenRouterProviderAdapter } from "./provider-adapters";

export type CodeReviewRequest = {
  problemTitle: string;
  problemDescription: string;
  userCode: string;
  testResults?: {
    testIndex: number;
    passed: boolean;
    inputStr: string;
    expectedStr: string;
    actualStr: string;
    error?: string;
  }[];
};

export type CodeReviewResponse = {
  reviewMarkdown: string;
  model: string;
};

/**
 * AI CODE REVIEWER & OPTIMIZATION COACH
 * Leverages live OpenRouter API to evaluate user code solutions, inspect
 * time/space complexities, check edge cases, and suggest optimizations.
 */
export async function reviewUserCode(
  request: CodeReviewRequest
): Promise<CodeReviewResponse> {
  const config = getProviderConfig("openrouter");
  const adapter = new OpenRouterProviderAdapter(
    config.model ?? DEFAULT_AI_MODEL,
    config.apiKey,
    config.baseUrl
  );

  const testSummary = request.testResults
    ? request.testResults
        .map(
          (t) =>
            `Test #${t.testIndex}: ${t.passed ? "PASSED" : "FAILED"} (Input: ${t.inputStr}, Expected: ${t.expectedStr}, Actual: ${t.actualStr}${t.error ? `, Error: ${t.error}` : ""})`
        )
        .join("\n")
    : "No test case results available.";

  const systemPrompt = `You are a Senior Principal Software Engineer and Technical Interview Coach at a top tech company.
Your task is to conduct an insightful, rigorous, and encouraging code review of a candidate's submitted JavaScript solution.

Enforce the following Markdown format strictly:

### ⏱️ Complexity Analysis
- **Time Complexity:** Explain estimated Big-O time complexity.
- **Space Complexity:** Explain auxiliary memory usage.

### ⚠️ Edge Cases & Bug Risks
- Highlight potential boundary condition risks (e.g. empty arrays, single element, negative values, large integers).

### 🛠️ Code Cleanliness & Refactoring
- Suggest clean code improvements, modern ES6+ JS idioms, and readability enhancements.

### 💡 Alternative Optimal Approach
- Briefly describe an alternative or faster approach if applicable (e.g. In-Place sorting vs O(N) extra space, Hash Map vs Two Pointers).`;

  const userPrompt = `Please review the following code submission:

**Problem Title:** ${request.problemTitle}
**Problem Description:** ${request.problemDescription}

**Submitted JavaScript Code:**
\`\`\`javascript
${request.userCode}
\`\`\`

**Execution Test Case Results:**
${testSummary}`;

  const response = await adapter.generate({
    prompt: userPrompt,
    provider: "openrouter",
    messages: [
      {
        id: `${Date.now()}-user`,
        role: "user",
        content: userPrompt,
        createdAt: new Date().toISOString(),
      },
    ],
    systemPrompt,
    model: config.model ?? DEFAULT_AI_MODEL,
  });

  return {
    reviewMarkdown: response.content,
    model: response.model,
  };
}

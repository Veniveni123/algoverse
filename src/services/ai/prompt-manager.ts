export class PromptManager {
  private readonly baseSystemPrompt = `You are AlgoVerse AI, a calm and expert coding tutor for algorithms, data structures, and software engineering. Explain clearly, keep answers concise, offer practical next steps, and use markdown when helpful.`;

  buildSystemPrompt(context?: string) {
    return `${this.baseSystemPrompt}${context ? `\n\nContext: ${context}` : ""}`;
  }

  buildUserPrompt(prompt: string) {
    return [
      "Please answer as a practical coding tutor.",
      "Focus on intuition first, then implementation details.",
      "When code is relevant, provide short examples.",
      prompt,
    ].join("\n\n");
  }

  buildSuggestions() {
    return [
      "Explain DFS step by step",
      "Compare BFS and DFS",
      "Show me a DP intuition",
      "Help me debug this pattern",
      "Give me a practice challenge",
    ];
  }
}

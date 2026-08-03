import type { AIProvider, AIRequest, AIResponse } from "../../types/ai";

export interface AIService {
  readonly provider: AIProvider;
  generate(request: AIRequest): Promise<AIResponse>;
  stream?(request: AIRequest): AsyncIterable<string>;
  getConfig(): Record<string, unknown>;
}

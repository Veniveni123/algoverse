import type { AIProvider, AIProviderConfig } from "../../types/ai";
import type { AIService } from "./ai-service.interface";
import { OpenRouterProviderAdapter } from "./provider-adapters";

export class ProviderFactory {
  static create(config: AIProviderConfig): AIService {
    switch (config.provider) {
      case "openrouter":
      case "openai":
      case "anthropic":
      case "groq":
      case "ollama":
      default:
        return new OpenRouterProviderAdapter(config.model, config.apiKey, config.baseUrl);
    }
  }

  static getAvailableProviders(): AIProvider[] {
    return ["openrouter", "openai", "anthropic", "groq", "ollama"];
  }
}

import type { AIProvider, AIRequest, AIResponse } from "../../types/ai";
import type { AIService } from "./ai-service.interface";
import { DEFAULT_AI_MODEL, getProviderConfig } from "../../config/ai";

function buildMessages(request: AIRequest) {
  const messages = request.messages.map((message) => ({ role: message.role, content: message.content }));

  return [
    { role: "system", content: request.systemPrompt ?? "You are AlgoVerse AI." },
    ...messages,
  ];
}

function parseResponse(payload: unknown): string {
  const response = payload as Record<string, unknown>;
  const firstChoice = Array.isArray(response?.choices) ? (response.choices[0] as Record<string, unknown> | undefined) : undefined;
  const message = firstChoice?.message as Record<string, unknown> | undefined;
  return (message?.content as string | undefined) ?? (response?.content as string | undefined) ?? "Unable to parse OpenRouter response.";
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class OpenRouterProviderAdapter implements AIService {
  readonly provider: AIProvider = "openrouter";
  private readonly apiKey?: string;
  private readonly baseUrl?: string;
  private readonly model?: string;

  constructor(model?: string, apiKey?: string, baseUrl?: string) {
    this.model = model;
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const config = getProviderConfig(this.provider);
    const runtimeApiKey = this.apiKey ?? config.apiKey;
    if (!runtimeApiKey) {
      throw new Error("OpenRouter API key is not configured. Set EXPO_PUBLIC_OPENROUTER_API_KEY in your environment.");
    }

    const endpoint = this.baseUrl ?? config.baseUrl ?? "https://openrouter.ai/api/v1/chat/completions";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${runtimeApiKey}`,
      "HTTP-Referer": "https://github.com/AlgoVerse",
      "X-Title": "AlgoVerse",
    };

    const payload = {
      model: this.model ?? request.model ?? config.model ?? DEFAULT_AI_MODEL,
      messages: buildMessages(request),
      temperature: 0.7,
      stream: false,
    };

    const maxAttempts = 3;
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || `OpenRouter request failed with ${response.status}.`);
        }

        const json = await response.json();
        return {
          content: parseResponse(json),
          provider: this.provider,
          model: this.model ?? request.model ?? config.model ?? DEFAULT_AI_MODEL,
        };
      } catch (error) {
        clearTimeout(timeoutId);
        lastError = error;
        if (attempt < maxAttempts) {
          await sleep(500 * attempt);
          continue;
        }
      }
    }

    if (lastError instanceof Error && lastError.name === "AbortError") {
      throw new Error("OpenRouter request timed out. Please try again.");
    }

    if (lastError instanceof Error) {
      throw new Error(`OpenRouter request failed: ${lastError.message}`);
    }

    throw new Error("OpenRouter request failed unexpectedly.");
  }

  getConfig() {
    return { provider: this.provider, model: this.model, baseUrl: this.baseUrl };
  }
}

export type AIProvider = "openai" | "anthropic" | "groq" | "openrouter" | "ollama";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  model?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  provider: AIProvider;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AIRequest {
  prompt: string;
  messages: ChatMessage[];
  systemPrompt?: string;
  provider: AIProvider;
  model?: string;
  stream?: boolean;
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  model: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
  };
  finishReason?: string;
}

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

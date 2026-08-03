import Constants from "expo-constants";
import type { AIProvider, AIProviderConfig } from "../types/ai";

const runtimeEnv = {
  ...(Constants.expoConfig?.extra ?? {}),
  ...(typeof process !== "undefined" ? process.env : {}),
} as Record<string, string | undefined>;
const globalConfig = (globalThis as unknown as { __ALGOVERSE_AI_PROVIDER__?: string; __ALGOVERSE_AI_MODEL__?: string; __ALGOVERSE_AI_API_KEY__?: string; __ALGOVERSE_AI_BASE_URL__?: string }).__ALGOVERSE_AI_PROVIDER__;

export const DEFAULT_AI_MODEL = "deepseek/deepseek-chat-v3";
export const DEFAULT_AI_PROVIDER: AIProvider = (globalConfig as AIProvider | undefined) ?? "openrouter";

export function getProviderConfig(provider: AIProvider): AIProviderConfig {
  const runtimeConfig = globalThis as unknown as {
    __ALGOVERSE_AI_PROVIDER__?: string;
    __ALGOVERSE_AI_MODEL__?: string;
    __ALGOVERSE_AI_API_KEY__?: string;
    __ALGOVERSE_AI_BASE_URL__?: string;
  };

  const resolvedProvider = (runtimeEnv.EXPO_PUBLIC_AI_PROVIDER ?? runtimeConfig.__ALGOVERSE_AI_PROVIDER__ ?? provider) as AIProvider;

  return {
    provider: resolvedProvider,
    apiKey: runtimeEnv.EXPO_PUBLIC_OPENROUTER_API_KEY ?? runtimeEnv.OPENROUTER_API_KEY ?? runtimeConfig.__ALGOVERSE_AI_API_KEY__,
    model: runtimeEnv.EXPO_PUBLIC_AI_MODEL ?? runtimeConfig.__ALGOVERSE_AI_MODEL__ ?? DEFAULT_AI_MODEL,
    baseUrl: runtimeEnv.EXPO_PUBLIC_AI_BASE_URL ?? runtimeConfig.__ALGOVERSE_AI_BASE_URL__,
  };
}

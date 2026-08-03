import type { AIProvider, ChatMessage, ChatSession } from "../../types/ai";
import { DEFAULT_AI_MODEL, getProviderConfig } from "../../config/ai";
import { ChatRepository } from "./chat-repository";
import { PromptManager } from "./prompt-manager";
import { ProviderFactory } from "./provider-factory";

export class AIServiceManager {
  private readonly repository = new ChatRepository();
  private readonly promptManager = new PromptManager();

  private resolveProvider(provider?: AIProvider): AIProvider {
    const config = getProviderConfig(provider ?? "openrouter");
    return (config.provider ?? "openrouter") as AIProvider;
  }

  private getProvider(provider?: AIProvider) {
    return ProviderFactory.create(getProviderConfig(this.resolveProvider(provider)));
  }

  async createSession(title: string, provider?: AIProvider) {
    const selectedProvider = this.resolveProvider(provider);
    const session: ChatSession = {
      id: `${Date.now()}`,
      title,
      provider: selectedProvider,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.repository.createSession(session);
  }

  async getSessions() {
    return this.repository.loadSessions();
  }

  async sendMessage(sessionId: string, message: string, provider?: AIProvider) {
    const selectedProvider = this.resolveProvider(provider);
    const sessions = await this.repository.loadSessions();
    const session = sessions.find((item) => item.id === sessionId);
    const userMessage: ChatMessage = {
      id: `${Date.now()}`,
      role: "user",
      content: message,
      createdAt: new Date().toISOString(),
    };

    if (!session) {
      const created = await this.createSession(message.slice(0, 30), selectedProvider);
      created.messages.push(userMessage);
      await this.repository.updateSession(created);
      const requestMessages = [...created.messages];
      try {
        const config = getProviderConfig(selectedProvider);
        const result = await this.getProvider(selectedProvider).generate({
          prompt: message,
          provider: selectedProvider,
          messages: requestMessages,
          systemPrompt: this.promptManager.buildSystemPrompt(),
          model: config.model ?? DEFAULT_AI_MODEL,
        });
        const assistantMessage: ChatMessage = {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: result.content,
          createdAt: new Date().toISOString(),
          model: result.model,
        };
        created.messages.push(assistantMessage);
        created.updatedAt = new Date().toISOString();
        await this.repository.updateSession(created);
        return created;
      } catch (error) {
        const fallbackContent = error instanceof Error ? error.message : "OpenRouter could not complete the request.";
        const assistantMessage: ChatMessage = {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: `OpenRouter request failed: ${fallbackContent}`,
          createdAt: new Date().toISOString(),
          model: DEFAULT_AI_MODEL,
        };
        created.messages.push(assistantMessage);
        created.updatedAt = new Date().toISOString();
        await this.repository.updateSession(created);
        return created;
      }
    }

    session.messages.push(userMessage);
    session.updatedAt = new Date().toISOString();
    await this.repository.updateSession(session);

    try {
      const config = getProviderConfig(selectedProvider);
      const result = await this.getProvider(selectedProvider).generate({
        prompt: message,
        provider: selectedProvider,
        messages: session.messages,
        systemPrompt: this.promptManager.buildSystemPrompt(),
        model: config.model ?? DEFAULT_AI_MODEL,
      });

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: result.content,
        createdAt: new Date().toISOString(),
        model: result.model,
      };
      session.messages.push(assistantMessage);
      session.updatedAt = new Date().toISOString();
      await this.repository.updateSession(session);
      return session;
    } catch (error) {
      const fallbackContent = error instanceof Error ? error.message : "OpenRouter could not complete the request.";
      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: `OpenRouter request failed: ${fallbackContent}`,
        createdAt: new Date().toISOString(),
        model: DEFAULT_AI_MODEL,
      };
      session.messages.push(assistantMessage);
      session.updatedAt = new Date().toISOString();
      await this.repository.updateSession(session);
      return session;
    }
  }

  async regenerate(sessionId: string, provider?: AIProvider) {
    const selectedProvider = this.resolveProvider(provider);
    const sessions = await this.repository.loadSessions();
    const session = sessions.find((item) => item.id === sessionId);
    if (!session) return null;

    const lastUserMessage = [...session.messages].reverse().find((message) => message.role === "user");
    if (!lastUserMessage) return session;

    try {
      const config = getProviderConfig(selectedProvider);
      const result = await this.getProvider(selectedProvider).generate({
        prompt: lastUserMessage.content,
        provider: selectedProvider,
        messages: session.messages,
        systemPrompt: this.promptManager.buildSystemPrompt(),
        model: config.model ?? DEFAULT_AI_MODEL,
      });

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: result.content,
        createdAt: new Date().toISOString(),
        model: result.model,
      };

      session.messages = session.messages.filter((message) => message.id !== assistantMessage.id);
      session.messages.push(assistantMessage);
      session.updatedAt = new Date().toISOString();
      await this.repository.updateSession(session);
      return session;
    } catch (error) {
      const fallbackContent = error instanceof Error ? error.message : "OpenRouter could not complete the request.";
      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: `OpenRouter request failed: ${fallbackContent}`,
        createdAt: new Date().toISOString(),
        model: DEFAULT_AI_MODEL,
      };

      session.messages.push(assistantMessage);
      session.updatedAt = new Date().toISOString();
      await this.repository.updateSession(session);
      return session;
    }
  }
}

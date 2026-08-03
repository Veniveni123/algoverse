import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ChatSession } from "../../types/ai";

const STORAGE_KEY = "algoverse-ai-sessions-v1";

export class ChatRepository {
  async loadSessions(): Promise<ChatSession[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as ChatSession[]) : [];
    } catch (error) {
      console.log("Chat repository load error", error);
      return [];
    }
  }

  async saveSessions(sessions: ChatSession[]) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }

  async appendMessage(sessionId: string, message: ChatSession["messages"][number]) {
    const sessions = await this.loadSessions();
    const session = sessions.find((item) => item.id === sessionId);
    if (!session) return null;
    session.messages = [...session.messages, message];
    session.updatedAt = new Date().toISOString();
    await this.saveSessions(sessions);
    return session;
  }

  async createSession(session: ChatSession) {
    const sessions = await this.loadSessions();
    sessions.unshift(session);
    await this.saveSessions(sessions);
    return session;
  }

  async updateSession(session: ChatSession) {
    const sessions = await this.loadSessions();
    const index = sessions.findIndex((item) => item.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
      await this.saveSessions(sessions);
    }
  }
}

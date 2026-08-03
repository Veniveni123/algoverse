import AsyncStorage from "@react-native-async-storage/async-storage";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
};

const STORAGE_KEY = "algoverse-chat-sessions-v1";

export async function loadChatSessions(): Promise<ChatSession[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ChatSession[]) : [];
  } catch (error) {
    console.log("Chat history load error", error);
    return [];
  }
}

export async function saveChatSessions(sessions: ChatSession[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export async function addMessageToSession(sessionId: string, message: ChatMessage) {
  const sessions = await loadChatSessions();
  const session = sessions.find((item) => item.id === sessionId);

  if (!session) {
    const newSession: ChatSession = {
      id: sessionId,
      title: message.content.slice(0, 36) || "New chat",
      messages: [message],
      updatedAt: new Date().toISOString(),
    };
    sessions.unshift(newSession);
    await saveChatSessions(sessions);
    return newSession;
  }

  session.messages = [...session.messages, message];
  session.updatedAt = new Date().toISOString();
  if (!session.title || session.title === "New chat") {
    session.title = message.content.slice(0, 36) || "New chat";
  }

  await saveChatSessions(sessions);
  return session;
}

export async function createSession(title: string) {
  const sessions = await loadChatSessions();
  const newSession: ChatSession = {
    id: `${Date.now()}`,
    title,
    messages: [],
    updatedAt: new Date().toISOString(),
  };
  sessions.unshift(newSession);
  await saveChatSessions(sessions);
  return newSession;
}

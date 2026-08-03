import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AIServiceManager } from "../services/ai/ai-service";
import { MarkdownMessage } from "../components/markdown-message";

type Message = { role: "user" | "ai"; text: string };

const SUGGESTIONS = [
  "Explain Bubble Sort simply",
  "When should I use Merge Sort?",
  "What is time complexity?",
  "Difference between BFS and DFS?",
  "What is dynamic programming?",
  "Why is Quick Sort fast?",
];

export default function TutorScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hi! 👋 I am your AlgoVerse AI Tutor. Ask me anything about algorithms, data structures, or time complexity!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const ai = useRef(new AIServiceManager());
  const sessionIdRef = useRef<string | null>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      let activeSessionId = sessionIdRef.current;
      if (!activeSessionId) {
        const created = await ai.current.createSession(
          `Tutor: ${text.trim().slice(0, 24)}`,
          "openrouter",
        );
        activeSessionId = created.id;
        sessionIdRef.current = activeSessionId;
      }

      const updated = await ai.current.sendMessage(activeSessionId, text.trim(), "openrouter");
      const assistantMessage = [...updated.messages]
        .reverse()
        .find((message) => message.role === "assistant");
      const aiText = assistantMessage?.content || "Sorry, I could not get a response. Please try again!";
      setMessages((prev) => [...prev, { role: "ai", text: aiText }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "❌ Connection error. Please check your internet and try again.",
        },
      ]);
    }

    setIsLoading(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.title}>🤖 AI Tutor</Text>
        <Text style={styles.subtitle}>Powered by AlgoVerse AI</Text>
      </View>

      {/* Suggestions */}
      {messages.length === 1 && (
        <View style={styles.suggestions}>
          <Text style={styles.suggestTitle}>Try asking:</Text>
          <View style={styles.suggestRow}>
            {SUGGESTIONS.map((s, i) => (
              <TouchableOpacity
                key={i}
                style={styles.suggestChip}
                onPress={() => sendMessage(s)}
              >
                <Text style={styles.suggestText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.bubble,
              msg.role === "user" ? styles.userBubble : styles.aiBubble,
            ]}
          >
            {msg.role === "ai" && (
              <Text style={styles.aiLabel}>🤖 AI Tutor</Text>
            )}
            {msg.role === "ai" ? (
              <View style={styles.markdownContainer}>
                <MarkdownMessage content={msg.text} />
              </View>
            ) : (
              <Text
                style={[
                  styles.bubbleText,
                  msg.role === "user" && styles.userText,
                ]}
              >
                {msg.text}
              </Text>
            )}
          </View>
        ))}
        {isLoading && (
          <View style={styles.aiBubble}>
            <Text style={styles.aiLabel}>🤖 AI Tutor</Text>
            <Text style={styles.bubbleText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask anything about algorithms..."
          placeholderTextColor="#555"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            (!input.trim() || isLoading) && styles.disabled,
          ]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
        >
          <Text style={styles.sendBtnText}>▶</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0F" },
  header: { padding: 24, paddingTop: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#6C63FF" },
  subtitle: { fontSize: 13, color: "#888", marginTop: 4 },
  suggestions: { paddingHorizontal: 16, marginBottom: 8 },
  suggestTitle: { color: "#888", fontSize: 13, marginBottom: 8 },
  suggestRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  suggestChip: {
    backgroundColor: "#12121A",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  suggestText: { color: "#6C63FF", fontSize: 12 },
  messages: { flex: 1 },
  bubble: { borderRadius: 16, padding: 14, maxWidth: "90%" },
  aiBubble: {
    backgroundColor: "#12121A",
    borderWidth: 1,
    borderColor: "#1E1E2E",
    alignSelf: "flex-start",
  },
  userBubble: { backgroundColor: "#6C63FF", alignSelf: "flex-end" },
  aiLabel: {
    color: "#6C63FF",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 6,
  },
  bubbleText: { color: "#FFF", fontSize: 14, lineHeight: 22 },
  userText: { color: "#FFF" },
  markdownContainer: { flex: 1, minWidth: 0 },
  inputRow: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#1E1E2E",
  },
  input: {
    flex: 1,
    backgroundColor: "#12121A",
    borderRadius: 14,
    padding: 14,
    color: "#FFF",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#1E1E2E",
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: "#6C63FF",
    borderRadius: 14,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnText: { color: "#FFF", fontSize: 18 },
  disabled: { opacity: 0.4 },
});

import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Compass,
  Copy,
  Lightbulb,
  RotateCcw,
  Sparkles,
  LoaderCircle,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AIServiceManager } from "../services/ai/ai-service";
import { MarkdownMessage } from "../components/markdown-message";
import type { ChatSession } from "../types/ai";

const promptSuggestions = [
  "Explain DFS step by step",
  "Compare BFS and DFS",
  "Show me a DP intuition",
  "Help me debug this pattern",
];

const featureCards = [
  {
    title: "Instant Explanations",
    subtitle: "Turn tricky problems into simple walkthroughs.",
    icon: <Lightbulb size={20} color="#8B5CF6" />,
  },
  {
    title: "Smart Practice Tips",
    subtitle: "Get focused hints without spoiling the answer.",
    icon: <Compass size={20} color="#06B6D4" />,
  },
  {
    title: "Pattern Recognition",
    subtitle: "Spot recurring DSA patterns faster.",
    icon: <BrainCircuit size={20} color="#F59E0B" />,
  },
];

export default function CopilotScreen() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const ai = useRef(new AIServiceManager());

  useEffect(() => {
    const loadSessions = async () => {
      const storedSessions = await ai.current.getSessions();
      setSessions(storedSessions);
      if (storedSessions.length > 0) {
        setActiveSessionId(storedSessions[0].id);
      }
    };

    loadSessions();
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
  }, [sessions]);

  const handleGenerate = async (value?: string) => {
    const message = (value ?? prompt).trim();
    if (!message) return;

    setIsLoading(true);
    setError(null);

    try {
      let sessionId = activeSessionId;
      if (!sessionId) {
        const created = await ai.current.createSession(message.slice(0, 30), "openrouter");
        sessionId = created.id;
        setActiveSessionId(sessionId);
      }

      const updated = await ai.current.sendMessage(sessionId!, message, "openrouter");
      const nextSessions = sessions.filter((item) => item.id !== updated.id);
      setSessions([updated, ...nextSessions]);
      setPrompt("");
    } catch (err) {
      setError("Unable to generate a response right now. Please try again.");
      Alert.alert("AI Copilot", "We could not generate a response. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!activeSessionId) return;
    setIsLoading(true);
    setError(null);
    try {
      const updated = await ai.current.regenerate(activeSessionId, "openrouter");
      if (updated) {
        const nextSessions = sessions.filter((item) => item.id !== updated.id);
        setSessions([updated, ...nextSessions]);
      }
    } catch (err) {
      setError("We could not regenerate the response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptSelect = (value: string) => {
    setPrompt(value);
  };

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  const renderMessageContent = (content: string) => {
    return <MarkdownMessage content={content} />;
  };

  const activeSession = sessions.find((item) => item.id === activeSessionId) ?? sessions[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={["#7C3AED", "#4F46E5", "#06B6D4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroTopRow}>
          <View style={styles.heroBadge}>
            <Bot size={18} color="#FFF" />
            <Text style={styles.heroBadgeText}>AI Copilot</Text>
          </View>
          <View style={styles.heroSpark}>
            <Sparkles size={16} color="#FFF" />
          </View>
        </View>

        <Text style={styles.heroTitle}>Think smarter with your coding companion</Text>
        <Text style={styles.heroSubtext}>
          Ask for explanations, compare algorithms, and get guided practice help in a single place.
        </Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Try a prompt</Text>
        <View style={styles.chipRow}>
          {promptSuggestions.map((item) => (
            <TouchableOpacity key={item} style={styles.chip} activeOpacity={0.9} onPress={() => handlePromptSelect(item)}>
              <Text style={styles.chipText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputCard}>
        <Text style={styles.sectionTitle}>Ask AlgoVerse AI</Text>
        <TextInput
          style={styles.input}
          value={prompt}
          onChangeText={setPrompt}
          placeholder="How do I approach this graph problem?"
          placeholderTextColor="#666"
          multiline
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={() => handleGenerate()}>
            <Text style={styles.primaryButtonText}>{isLoading ? "Generating..." : "Generate Insight"}</Text>
            {isLoading ? <LoaderCircle size={16} color="#FFF" /> : <ArrowRight size={18} color="#FFF" />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryAction} activeOpacity={0.9} onPress={handleRegenerate} disabled={isLoading || !activeSession?.messages?.length}>
            <RotateCcw size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.grid}>
        {featureCards.map((card) => (
          <View key={card.title} style={styles.featureCard}>
            <View style={styles.featureIcon}>{card.icon}</View>
            <Text style={styles.featureTitle}>{card.title}</Text>
            <Text style={styles.featureSubtitle}>{card.subtitle}</Text>
          </View>
        ))}
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.sectionTitle}>Recent Sessions</Text>
        {sessions.length === 0 ? (
          <Text style={styles.emptyText}>No conversations yet. Start one above.</Text>
        ) : (
          sessions.slice(0, 4).map((session) => (
            <TouchableOpacity key={session.id} style={styles.historyItem} onPress={() => setActiveSessionId(session.id)} activeOpacity={0.9}>
              <Text style={styles.historyTitle}>{session.title}</Text>
              <Text style={styles.historySubtitle}>{session.messages.length} messages</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      {activeSession ? (
        <View style={styles.chatCard}>
          <Text style={styles.sectionTitle}>Conversation</Text>
          {activeSession.messages.length === 0 ? (
            <Text style={styles.emptyText}>Ask a question and your explanation will appear here.</Text>
          ) : (
            <View style={styles.messageList}>
              {activeSession.messages.map((message) => (
                <View key={message.id} style={[styles.messageBubble, message.role === "assistant" ? styles.assistantBubble : styles.userBubble]}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.messageRole}>{message.role === "assistant" ? "AlgoVerse AI" : "You"}</Text>
                    {message.role === "assistant" ? (
                      <TouchableOpacity onPress={() => copyToClipboard(message.content)} activeOpacity={0.8}>
                        <Copy size={14} color="#9CA3AF" />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  {renderMessageContent(message.content)}
                </View>
              ))}
            </View>
          )}
          {isLoading ? (
            <View style={styles.typingRow}>
              <ActivityIndicator size="small" color="#6C63FF" />
              <Text style={styles.typingText}>Thinking…</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.9} onPress={() => router.back()}>
        <Text style={styles.secondaryButtonText}>Back to Home</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816",
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 30,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  heroBadgeText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
  heroSpark: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 20,
    lineHeight: 36,
  },
  heroSubtext: {
    color: "#E0E7FF",
    fontSize: 14,
    marginTop: 10,
    lineHeight: 22,
  },
  card: {
    marginHorizontal: 20,
    marginTop: -18,
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: "#1E293B",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#334155",
  },
  chipText: {
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: "600",
  },
  inputCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  input: {
    backgroundColor: "#0A0A0F",
    color: "#FFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 90,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#1E1E2E",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },
  secondaryAction: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  errorText: {
    color: "#F87171",
    fontSize: 12,
    marginTop: 10,
  },
  grid: {
    marginHorizontal: 20,
    marginTop: 16,
    gap: 12,
  },
  featureCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  featureTitle: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  featureSubtitle: {
    color: "#9CA3AF",
    fontSize: 12,
    lineHeight: 20,
  },
  historyCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  chatCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  messageList: {
    gap: 10,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  assistantBubble: {
    backgroundColor: "#1E293B",
    borderColor: "#334155",
  },
  userBubble: {
    backgroundColor: "#312E81",
    borderColor: "#4F46E5",
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  messageRole: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  messageText: {
    color: "#E5E7EB",
    fontSize: 13,
    lineHeight: 20,
  },
  messageTextLine: {
    color: "#E5E7EB",
    fontSize: 13,
    lineHeight: 20,
  },
  codeBlock: {
    marginTop: 8,
    backgroundColor: "#020617",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#334155",
  },
  codeLanguage: {
    color: "#8B5CF6",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  codeText: {
    color: "#E2E8F0",
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "monospace",
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  typingText: {
    color: "#C7D2FE",
    fontSize: 12,
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  historyItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2937",
  },
  historyTitle: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700",
  },
  historySubtitle: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 4,
  },
  secondaryButton: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: "#1E293B",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  secondaryButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },
});

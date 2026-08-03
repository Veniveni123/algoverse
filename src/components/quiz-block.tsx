import { CheckCircle2, XCircle } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppColors, Radii } from "../constants/theme";
import type { QuizQuestion } from "../types/lesson";

type Props = {
  questions: QuizQuestion[];
  onComplete: (scorePercent: number) => void;
};

export default function QuizBlock({ questions, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    const correctCount = questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const scorePercent = Math.round((correctCount / questions.length) * 100);
    setSubmitted(true);
    onComplete(scorePercent);
  };

  const correctCount = questions.filter((q) => answers[q.id] === q.correctIndex).length;

  return (
    <View>
      {questions.map((q, qIndex) => {
        const selected = answers[q.id];
        return (
          <View key={q.id} style={styles.questionCard}>
            <Text style={styles.questionText}>
              {qIndex + 1}. {q.question}
            </Text>
            {q.options.map((option, optionIndex) => {
              const isSelected = selected === optionIndex;
              const isCorrectOption = optionIndex === q.correctIndex;
              let optionStyle = styles.option;
              let textStyle = styles.optionText;

              if (submitted) {
                if (isCorrectOption) {
                  optionStyle = { ...styles.option, ...styles.optionCorrect };
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = { ...styles.option, ...styles.optionWrong };
                }
              } else if (isSelected) {
                optionStyle = { ...styles.option, ...styles.optionSelected };
              }

              return (
                <TouchableOpacity
                  key={optionIndex}
                  style={optionStyle}
                  activeOpacity={0.85}
                  disabled={submitted}
                  onPress={() => handleSelect(q.id, optionIndex)}
                >
                  <Text style={textStyle}>{option}</Text>
                  {submitted && isCorrectOption && <CheckCircle2 size={16} color={AppColors.success} />}
                  {submitted && isSelected && !isCorrectOption && <XCircle size={16} color={AppColors.danger} />}
                </TouchableOpacity>
              );
            })}
            {submitted && (
              <Text style={styles.explanation}>{q.explanation}</Text>
            )}
          </View>
        );
      })}

      {!submitted ? (
        <TouchableOpacity
          style={[styles.submitButton, !allAnswered && styles.submitButtonDisabled]}
          disabled={!allAnswered}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>
            {allAnswered ? "Submit quiz" : `Answer all ${questions.length} questions`}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.resultBanner}>
          <Text style={styles.resultText}>
            {correctCount} / {questions.length} correct ({Math.round((correctCount / questions.length) * 100)}%)
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  questionCard: {
    backgroundColor: AppColors.surface,
    borderRadius: Radii.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  questionText: { color: "#FFF", fontSize: 14, fontWeight: "700", marginBottom: 12 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: Radii.md,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  optionSelected: { borderColor: AppColors.primary, backgroundColor: "rgba(139,92,246,0.15)" },
  optionCorrect: { borderColor: AppColors.success, backgroundColor: "rgba(34,197,94,0.15)" },
  optionWrong: { borderColor: AppColors.danger, backgroundColor: "rgba(244,63,94,0.15)" },
  optionText: { color: "#E2E8F0", fontSize: 13, flex: 1 },
  explanation: { color: AppColors.textSecondary, fontSize: 12, marginTop: 4, lineHeight: 18, fontStyle: "italic" },
  submitButton: {
    backgroundColor: AppColors.primary,
    borderRadius: Radii.md,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  submitButtonDisabled: { backgroundColor: AppColors.locked },
  submitButtonText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  resultBanner: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderRadius: Radii.md,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.3)",
  },
  resultText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
});

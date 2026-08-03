import React from "react";
import { StyleSheet } from "react-native";
import Markdown from "react-native-markdown-display";

type MarkdownMessageProps = {
  content: string;
};

const markdownStyles = StyleSheet.create({
  body: {
    color: "#E5E7EB",
    fontSize: 13,
    lineHeight: 20,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 6,
  },
  heading1: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 6,
  },
  heading2: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 6,
  },
  heading3: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 4,
  },
  strong: {
    color: "#FFF",
    fontWeight: "700",
  },
  em: {
    fontStyle: "italic",
    color: "#E5E7EB",
  },
  list_item: {
    color: "#E5E7EB",
    marginBottom: 4,
  },
  bullet_list: {
    marginTop: 4,
    marginBottom: 6,
  },
  ordered_list: {
    marginTop: 4,
    marginBottom: 6,
  },
  code_block: {
    backgroundColor: "#020617",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  code_inline: {
    backgroundColor: "#1F2937",
    color: "#FDE68A",
    borderRadius: 6,
    overflow: "hidden",
    paddingHorizontal: 4,
    paddingVertical: 2,
    fontFamily: "monospace",
  },
  fence: {
    backgroundColor: "#020617",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  hr: {
    backgroundColor: "#334155",
    height: 1,
    marginVertical: 8,
  },
});

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  return <Markdown style={markdownStyles}>{content}</Markdown>;
}

import type { ComponentType } from "react";
import type { CuratedResource, PracticeProblem, QuizQuestion, YouTubeVideo } from "./lesson";

export type MLLessonContent = {
  slug: string;
  topicKey: string; // matches recordStudySession's completedTopics key
  category: "Fundamentals" | "Regression" | "Classification" | "Clustering" | "Neural Networks";
  title: string;
  introduction: string;
  analogy: string;
  keyIdeas: string[];
  realWorldUses: string[];
  advantages: string[];
  disadvantages: string[];
  interviewQuestions: { question: string; answer: string }[];
  quiz: QuizQuestion[];
  VisualizationComponent: ComponentType | null;
  detailedNotesHtml?: string;
  practiceProblems?: PracticeProblem[];
  curatedResources?: CuratedResource[];
  youtubeVideos?: YouTubeVideo[];
  projectIdeas?: string[];
  commonMistakes?: string[];
};

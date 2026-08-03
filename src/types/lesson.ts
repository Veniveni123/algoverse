export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type InterviewQuestion = {
  question: string;
  answer: string;
};

export type ComplexityRow = {
  operation: string;
  complexity: string;
};

export type TestCase = {
  input: any[];
  expected: any;
  description?: string;
};

export type PracticeProblem = {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  hints?: string[];
  starterCode: string;
  testCases: TestCase[];
  solutionExplanation: string;
};

export type YouTubeVideo = {
  id: string;
  title: string;
  channel: string;
  duration: string;
  url: string;
  description?: string;
};

export type CuratedResource = {
  id: string;
  title: string;
  type: "video" | "paper" | "article" | "project";
  url: string;
  authorOrSource: string;
  readTimeOrDuration: string;
  description: string;
};

export type LessonContent = {
  slug: string; // used in the /lesson/[slug] route
  topicKey: string; // must match the keys used by recordStudySession/completedTopics
  title: string;
  introduction: string;
  analogy: string;
  timeComplexity: ComplexityRow[];
  spaceComplexity: string;
  applications: string[];
  advantages: string[];
  disadvantages: string[];
  interviewQuestions: InterviewQuestion[];
  quiz: QuizQuestion[];
  visualizerRoute: string;
  visualizerLabel: string;
  detailedNotesHtml?: string;
  practiceProblems?: PracticeProblem[];
  curatedResources?: CuratedResource[];
  youtubeVideos?: YouTubeVideo[];
  projectIdeas?: string[];
  commonMistakes?: string[];
};

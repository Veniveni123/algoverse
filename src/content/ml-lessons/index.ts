import type { MLLessonContent } from "@/types/ml-lesson";

import { classificationLesson } from "./classification";
import { clusteringLesson } from "./clustering";
import { introToMLLesson } from "./intro-to-ml";
import { linearRegressionLesson } from "./linear-regression";
import { neuralNetworksLesson } from "./neural-networks";

export const ML_LESSONS: Record<string, MLLessonContent> = {
  [introToMLLesson.slug]: introToMLLesson,
  [linearRegressionLesson.slug]: linearRegressionLesson,
  [classificationLesson.slug]: classificationLesson,
  [clusteringLesson.slug]: clusteringLesson,
  [neuralNetworksLesson.slug]: neuralNetworksLesson,
};

export function getMLLessonBySlug(slug: string): MLLessonContent | undefined {
  return ML_LESSONS[slug];
}

export function getAllMLLessons(): MLLessonContent[] {
  return Object.values(ML_LESSONS);
}

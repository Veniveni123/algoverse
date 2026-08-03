import type { LessonContent } from "@/types/lesson";

import { arraysLesson } from "./arrays";
import { bigOLesson } from "./big-o";
import { dynamicProgrammingLesson } from "./dynamic-programming";
import { graphsLesson } from "./graphs";
import { linkedListLesson } from "./linked-list";
import { programmingBasicsLesson } from "./programming-basics";
import { queueLesson } from "./queue";
import { searchingLesson } from "./searching";
import { sortingLesson } from "./sorting";
import { stackLesson } from "./stack";
import { treesLesson } from "./trees";

export const LESSONS: Record<string, LessonContent> = {
  [programmingBasicsLesson.slug]: programmingBasicsLesson,
  "programming-basics": programmingBasicsLesson,
  basics: programmingBasicsLesson,
  [bigOLesson.slug]: bigOLesson,
  "big-o": bigOLesson,
  bigo: bigOLesson,

  [arraysLesson.slug]: arraysLesson,
  [stackLesson.slug]: stackLesson,
  [queueLesson.slug]: queueLesson,
  [linkedListLesson.slug]: linkedListLesson,
  [searchingLesson.slug]: searchingLesson,
  [sortingLesson.slug]: sortingLesson,
  [treesLesson.slug]: treesLesson,
  [graphsLesson.slug]: graphsLesson,
  graph: graphsLesson,
  [dynamicProgrammingLesson.slug]: dynamicProgrammingLesson,
  dp: dynamicProgrammingLesson,
};

export function getLessonBySlug(slug: string): LessonContent | undefined {
  return LESSONS[slug];
}

export function getAllLessons(): LessonContent[] {
  return Object.values(LESSONS);
}

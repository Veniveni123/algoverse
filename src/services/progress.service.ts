import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import {
  awardXP,
  enqueueCelebration,
  evaluateAchievements,
  XP_REWARDS,
} from "./gamification.service";

export type ProgressState = {
  streak: number;
  lastActiveDate: string | null;
  completedTopics: string[];
  favoriteTopics: string[];
  lastCompletedTopic: string | null;
  dailyChallengeCompleted: boolean;
  challengeDate: string | null;
  challengesCompleted: number;
  quizzesCompleted: string[];
};

const STORAGE_KEY = "algoverse-progress-v1";

const getDateKey = (date: Date) => date.toISOString().split("T")[0];

const getYesterdayKey = (date: Date) => {
  const yesterday = new Date(date);
  yesterday.setDate(date.getDate() - 1);
  return getDateKey(yesterday);
};

export async function loadProgressState(): Promise<ProgressState> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<ProgressState>;
      // Backfill fields added after this state was first saved to disk,
      // so older cached progress doesn't crash on the new shape.
      return {
        streak: parsed.streak ?? 0,
        lastActiveDate: parsed.lastActiveDate ?? null,
        completedTopics: parsed.completedTopics ?? [],
        favoriteTopics: parsed.favoriteTopics ?? [],
        lastCompletedTopic: parsed.lastCompletedTopic ?? null,
        dailyChallengeCompleted: parsed.dailyChallengeCompleted ?? false,
        challengeDate: parsed.challengeDate ?? null,
        challengesCompleted: parsed.challengesCompleted ?? 0,
        quizzesCompleted: parsed.quizzesCompleted ?? [],
      };
    }
  } catch (error) {
    console.log("Progress load error", error);
  }

  return {
    streak: 0,
    lastActiveDate: null,
    completedTopics: [],
    favoriteTopics: [],
    lastCompletedTopic: null,
    dailyChallengeCompleted: false,
    challengeDate: null,
    challengesCompleted: 0,
    quizzesCompleted: [],
  };
}

export async function saveProgressState(state: ProgressState) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, "users", user.uid), {
        streak: state.streak,
        completedTopics: state.completedTopics,
        favoriteTopics: state.favoriteTopics,
        lastActiveDate: state.lastActiveDate,
        latestTopic: state.lastCompletedTopic,
        challengesCompleted: state.challengesCompleted,
        dailyChallengeCompleted: state.dailyChallengeCompleted,
        challengeDate: state.challengeDate,
        quizzesCompleted: state.quizzesCompleted,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.log("Progress save error", error);
  }
}

export async function recordStudySession(topic?: string): Promise<ProgressState> {
  const state = await loadProgressState();
  const today = getDateKey(new Date());

  if (state.lastActiveDate !== today) {
    const yesterday = getYesterdayKey(new Date());
    const shouldIncrement = state.lastActiveDate === yesterday;
    state.streak = shouldIncrement ? state.streak + 1 : 1;
    state.lastActiveDate = today;
  }

  const isNewTopic = Boolean(topic) && !state.completedTopics.includes(topic as string);

  if (topic && isNewTopic) {
    state.completedTopics = [...state.completedTopics, topic];
    state.lastCompletedTopic = topic;
  }

  await saveProgressState(state);

  if (isNewTopic) {
    try {
      const result = await awardXP(XP_REWARDS.topicVisited);
      await enqueueCelebration({ type: "xp", amount: XP_REWARDS.topicVisited, reason: `Visited ${topic}` });
      if (result?.leveledUp) {
        await enqueueCelebration({ type: "level_up", level: result.after.level });
      }
    } catch (error) {
      console.log("XP award error", error);
    }

    try {
      const unlocked = await evaluateAchievements({ progress: state });
      for (const a of unlocked) {
        await enqueueCelebration({ type: "achievement", achievementId: a.id });
      }
    } catch (error) {
      console.log("Achievement check error", error);
    }
  }

  return state;
}

/**
 * Called when a lesson quiz is submitted. Only awards XP / checks
 * achievements the first time a given topic's quiz is passed, so
 * retaking a quiz for practice doesn't farm XP repeatedly.
 */
export async function recordQuizCompletion(topicKey: string, scorePercent: number): Promise<ProgressState> {
  const state = await loadProgressState();
  const alreadyCompleted = state.quizzesCompleted.includes(topicKey);
  const passed = scorePercent >= 60;

  if (passed && !alreadyCompleted) {
    state.quizzesCompleted = [...state.quizzesCompleted, topicKey];
  }

  await saveProgressState(state);

  if (passed && !alreadyCompleted) {
    try {
      const result = await awardXP(XP_REWARDS.quizCompleted);
      await enqueueCelebration({ type: "xp", amount: XP_REWARDS.quizCompleted, reason: `Passed the ${topicKey} quiz` });
      if (result?.leveledUp) {
        await enqueueCelebration({ type: "level_up", level: result.after.level });
      }
    } catch (error) {
      console.log("XP award error", error);
    }

    try {
      const unlocked = await evaluateAchievements({ progress: state });
      for (const a of unlocked) {
        await enqueueCelebration({ type: "achievement", achievementId: a.id });
      }
    } catch (error) {
      console.log("Achievement check error", error);
    }
  }

  return state;
}

export async function toggleFavoriteTopic(topic: string): Promise<ProgressState> {
  const state = await loadProgressState();
  const exists = state.favoriteTopics.includes(topic);
  state.favoriteTopics = exists
    ? state.favoriteTopics.filter((item) => item !== topic)
    : [...state.favoriteTopics, topic];

  await saveProgressState(state);
  return state;
}

export async function completeDailyChallenge(): Promise<ProgressState> {
  const state = await loadProgressState();
  const today = getDateKey(new Date());
  const alreadyDoneToday = state.dailyChallengeCompleted && state.challengeDate === today;

  state.dailyChallengeCompleted = true;
  state.challengeDate = today;
  if (!alreadyDoneToday) {
    state.challengesCompleted = (state.challengesCompleted || 0) + 1;
  }

  await saveProgressState(state);

  if (!alreadyDoneToday) {
    try {
      const result = await awardXP(XP_REWARDS.dailyChallenge);
      await enqueueCelebration({ type: "xp", amount: XP_REWARDS.dailyChallenge, reason: "Daily challenge complete" });
      if (result?.leveledUp) {
        await enqueueCelebration({ type: "level_up", level: result.after.level });
      }
    } catch (error) {
      console.log("XP award error", error);
    }

    try {
      const unlocked = await evaluateAchievements({ progress: state });
      for (const a of unlocked) {
        await enqueueCelebration({ type: "achievement", achievementId: a.id });
      }
    } catch (error) {
      console.log("Achievement check error", error);
    }
  }

  return state;
}

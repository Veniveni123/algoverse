import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";

import { auth, db } from "../config/firebase";
import type { ProgressState } from "./progress.service";

/**
 * ============================================================
 * GAMIFICATION ENGINE
 * ============================================================
 * Single source of truth for XP, levels, and achievements.
 *
 * Before this file existed, `xp` was set to 0 at signup and never
 * touched again anywhere in the app — the whole level/rank display
 * was inert. awardXP() is now the only place XP changes.
 */

// ---------- Levels ----------

const XP_PER_LEVEL = 100;

export type LevelInfo = {
  xp: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
};

export function getLevelInfo(xp: number): LevelInfo {
  const safeXp = Math.max(0, xp || 0);
  const level = Math.floor(safeXp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = safeXp % XP_PER_LEVEL;
  return {
    xp: safeXp,
    level,
    xpIntoLevel,
    xpForNextLevel: XP_PER_LEVEL,
    progressPercent: Math.min((xpIntoLevel / XP_PER_LEVEL) * 100, 100),
  };
}

export function getRank(xp: number): string {
  if (xp >= 1000) return "🏆 Algorithm Master";
  if (xp >= 700) return "🔥 Elite Coder";
  if (xp >= 400) return "⚡ Advanced Learner";
  if (xp >= 200) return "🚀 Rising Star";
  return "🌱 Beginner";
}

export const XP_REWARDS = {
  topicVisited: 15,
  dailyChallenge: 20,
  quizCompleted: 25,
  achievementBonus: 25,
} as const;

/**
 * Awards XP to the current user in Firestore and returns before/after
 * level info so callers can detect level-ups. No-ops (returns nulls)
 * if nobody is signed in, so it's always safe to call.
 */
export async function awardXP(
  amount: number
): Promise<{ before: LevelInfo; after: LevelInfo; leveledUp: boolean } | null> {
  const user = auth.currentUser;
  if (!user || amount <= 0) return null;

  try {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    const currentXp = snap.exists() ? snap.data()?.xp || 0 : 0;
    const before = getLevelInfo(currentXp);

    await updateDoc(ref, { xp: increment(amount) });

    const after = getLevelInfo(currentXp + amount);
    return { before, after, leveledUp: after.level > before.level };
  } catch (error) {
    console.log("awardXP error", error);
    return null;
  }
}

// ---------- Achievements ----------

export type Achievement = {
  id: string;
  label: string;
  description: string;
  icon: "flame" | "compass" | "trophy" | "zap" | "target" | "brain" | "award" | "star";
  check: (ctx: AchievementContext) => boolean;
};

export type AchievementContext = {
  progress: ProgressState;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_steps",
    label: "First Steps",
    description: "Visit your first topic",
    icon: "compass",
    check: (ctx) => ctx.progress.completedTopics.length >= 1,
  },
  {
    id: "topic_explorer",
    label: "Topic Explorer",
    description: "Visit 5 different topics",
    icon: "compass",
    check: (ctx) => ctx.progress.completedTopics.length >= 5,
  },
  {
    id: "algorithm_master",
    label: "Algorithm Master",
    description: "Visit all 9 core topics",
    icon: "trophy",
    check: (ctx) => ctx.progress.completedTopics.length >= 9,
  },
  {
    id: "streak_7",
    label: "7-Day Streak",
    description: "Keep a 7 day learning streak",
    icon: "flame",
    check: (ctx) => ctx.progress.streak >= 7,
  },
  {
    id: "streak_30",
    label: "30-Day Streak",
    description: "Keep a 30 day learning streak",
    icon: "flame",
    check: (ctx) => ctx.progress.streak >= 30,
  },
  {
    id: "daily_grinder",
    label: "Daily Grinder",
    description: "Complete 7 daily challenges",
    icon: "target",
    check: (ctx) => (ctx.progress.challengesCompleted || 0) >= 7,
  },
  {
    id: "quiz_starter",
    label: "Quiz Starter",
    description: "Pass your first lesson quiz",
    icon: "brain",
    check: (ctx) => (ctx.progress.quizzesCompleted || []).length >= 1,
  },
  {
    id: "quiz_whiz",
    label: "Quiz Whiz",
    description: "Pass 5 lesson quizzes",
    icon: "brain",
    check: (ctx) => (ctx.progress.quizzesCompleted || []).length >= 5,
  },
  {
    id: "sorting_master",
    label: "Sorting Master",
    description: "Pass the Sorting Algorithms Quiz with 80% or higher",
    icon: "trophy",
    check: (ctx) => (ctx.progress.quizzesCompleted || []).includes("Sorting"),
  },
];

const XP_ACHIEVEMENTS: { id: string; label: string; description: string; icon: Achievement["icon"]; threshold: number }[] = [
  { id: "rising_star", label: "Rising Star", description: "Reach 200 XP", icon: "star", threshold: 200 },
  { id: "elite_coder", label: "Elite Coder", description: "Reach 700 XP", icon: "zap", threshold: 700 },
  { id: "algorithm_legend", label: "Algorithm Legend", description: "Reach 1000 XP", icon: "award", threshold: 1000 },
];

/**
 * Compares the achievement catalog against current progress, fetches
 * the user's real XP from Firestore itself (so callers can't
 * accidentally pass a stale/zero value), persists any newly-unlocked
 * badge ids, and returns only the ones newly unlocked this call.
 */
export async function evaluateAchievements(ctx: AchievementContext): Promise<Achievement[]> {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    const existingBadges: string[] = snap.exists() ? snap.data()?.badges || [] : [];
    const currentXp: number = snap.exists() ? snap.data()?.xp || 0 : 0;

    const progressUnlocks = ACHIEVEMENTS.filter((a) => a.check(ctx));
    const xpUnlocks: Achievement[] = XP_ACHIEVEMENTS.filter((a) => currentXp >= a.threshold).map((a) => ({
      id: a.id,
      label: a.label,
      description: a.description,
      icon: a.icon,
      check: () => true,
    }));

    const unlockedNow = [...progressUnlocks, ...xpUnlocks];
    const newlyUnlocked = unlockedNow.filter((a) => !existingBadges.includes(a.id));

    if (newlyUnlocked.length > 0) {
      const merged = Array.from(new Set([...existingBadges, ...newlyUnlocked.map((a) => a.id)]));
      await updateDoc(ref, { badges: merged });
    }

    return newlyUnlocked;
  } catch (error) {
    console.log("evaluateAchievements error", error);
    return [];
  }
}

export function getAllAchievementDefinitions(): { id: string; label: string; description: string; icon: Achievement["icon"] }[] {
  return [...ACHIEVEMENTS, ...XP_ACHIEVEMENTS];
}

export async function getUnlockedAchievementIds(): Promise<string[]> {
  const user = auth.currentUser;
  if (!user) return [];
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    return snap.exists() ? snap.data()?.badges || [] : [];
  } catch (error) {
    console.log("getUnlockedAchievementIds error", error);
    return [];
  }
}

// ---------- Celebration queue ----------
// Topic screens and the daily challenge run outside any shared UI
// state, so instead of wiring a global store, completed events get
// queued to disk. Home reads + clears the queue on focus and shows
// a celebration modal for anything that happened since last time.

export type CelebrationEvent =
  | { type: "xp"; amount: number; reason: string }
  | { type: "level_up"; level: number }
  | { type: "achievement"; achievementId: string };

const CELEBRATION_QUEUE_KEY = "algoverse-celebrations-v1";

export async function enqueueCelebration(event: CelebrationEvent) {
  try {
    const raw = await AsyncStorage.getItem(CELEBRATION_QUEUE_KEY);
    const queue: CelebrationEvent[] = raw ? JSON.parse(raw) : [];
    queue.push(event);
    await AsyncStorage.setItem(CELEBRATION_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.log("enqueueCelebration error", error);
  }
}

export async function drainCelebrationQueue(): Promise<CelebrationEvent[]> {
  try {
    const raw = await AsyncStorage.getItem(CELEBRATION_QUEUE_KEY);
    await AsyncStorage.removeItem(CELEBRATION_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.log("drainCelebrationQueue error", error);
    return [];
  }
}

import { Award, Brain, Compass, Flame, Star, Target, Trophy, Zap } from "lucide-react-native";
import type { ComponentType } from "react";

import type { Achievement } from "../services/gamification.service";

export const ACHIEVEMENT_ICONS: Record<Achievement["icon"], ComponentType<{ size?: number; color?: string }>> = {
  flame: Flame,
  compass: Compass,
  trophy: Trophy,
  zap: Zap,
  target: Target,
  brain: Brain,
  award: Award,
  star: Star,
};

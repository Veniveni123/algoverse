/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

/**
 * ============================================================
 * ALGOVERSE APP DESIGN SYSTEM
 * ============================================================
 * This is the single source of truth for the app's real visual
 * language (the violet -> indigo -> cyan look already used across
 * home.tsx, auth-screen-shell.tsx, onboarding-card.tsx, etc).
 *
 * Import AppColors / Gradients / Radii / Shadows / Type from here
 * instead of hardcoding hex values in individual screens.
 * The `Colors` export above is untouched legacy Expo scaffolding
 * used only by leftover template files (themed-text, themed-view,
 * collapsible, explore.tsx) — do not confuse the two.
 */

export const AppColors = {
  // Base surfaces
  bg: '#050816',
  bgElevated: '#0B1120',
  surface: 'rgba(17,24,39,0.9)',
  surfaceSubtle: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.1)',
  borderSubtle: 'rgba(255,255,255,0.06)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#6B7280',

  // Brand / accent
  primary: '#8B5CF6', // violet
  primaryDeep: '#7C3AED',
  secondary: '#4F46E5', // indigo
  tertiary: '#06B6D4', // cyan

  // Semantic
  xp: '#F59E0B', // gold — XP, streak flame
  success: '#22C55E', // mastery / completed
  danger: '#F43F5E', // battle / errors
  info: '#3B82F6',

  // Lock state (skill tree)
  locked: '#374151',
  lockedText: '#6B7280',
} as const;

export const Gradients = {
  hero: ['#7C3AED', '#4F46E5', '#06B6D4'] as const,
  progress: ['#8B5CF6', '#06B6D4'] as const,
  auth: ['#050816', '#111827'] as const,
  gold: ['#F59E0B', '#F97316'] as const,
  success: ['#22C55E', '#10B981'] as const,
  locked: ['#1F2937', '#111827'] as const,
} as const;

export const Radii = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  pill: 999,
} as const;

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  glow: {
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
} as const;

export const Type = {
  display: { fontSize: 28, fontWeight: '800' as const },
  h1: { fontSize: 22, fontWeight: '800' as const, lineHeight: 28 },
  h2: { fontSize: 18, fontWeight: '700' as const, lineHeight: 24 },
  h3: { fontSize: 15, fontWeight: '700' as const, lineHeight: 20 },
  title: { fontSize: 20, fontWeight: '700' as const },
  subtitle: { fontSize: 15, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  bodyLong: { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  calloutText: { fontSize: 13, fontWeight: '500' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '500' as const },
} as const;

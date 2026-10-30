"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ScenarioProgress, ScenarioResult } from "@/lib/types";
import { MAX_XP } from "@/data/gamification";

const STORAGE_KEY = "alteamaster-progress-v1";

export interface UserStoreState {
  /* ---- persisted ---- */
  xp: number;
  streak: number;
  badges: string[];
  progress: Record<string, ScenarioProgress>;
  soundEnabled: boolean;
  traineeName: string;

  /* ---- transient (not persisted) ---- */
  lastResult: ScenarioResult | null;
  newlyUnlocked: string[]; // badge ids to celebrate on dashboard

  /* ---- actions ---- */
  completeScenario: (result: ScenarioResult) => {
    xpAwarded: number;
    newBadges: string[];
    streak: number;
  };
  setLastResult: (r: ScenarioResult | null) => void;
  clearNewlyUnlocked: () => void;
  toggleSound: () => void;
  setTraineeName: (n: string) => void;
  resetAll: () => void;
}

const initialPersisted = {
  xp: 0,
  streak: 0,
  badges: [] as string[],
  progress: {} as Record<string, ScenarioProgress>,
  soundEnabled: true,
  traineeName: "Trainee T/A",
};

export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      ...initialPersisted,
      lastResult: null,
      newlyUnlocked: [],

      completeScenario: (result) => {
        const state = get();
        const prev = state.progress[result.scenarioId];
        const streakBroke = result.accuracy < 80;

        const updated: ScenarioProgress = {
          bestAccuracy: Math.max(prev?.bestAccuracy ?? 0, result.accuracy),
          attempts: (prev?.attempts ?? 0) + 1,
          totalXp: (prev?.totalXp ?? 0) + result.xpAwarded,
          bestTimeSec:
            prev?.bestTimeSec == null
              ? result.durationSec
              : Math.min(prev.bestTimeSec, result.durationSec),
          hintsUsed: Math.min(prev?.hintsUsed ?? 99, result.hintsUsed),
          completed: true,
          lastPlayed: new Date().toISOString(),
        };

        const newBadges = result.badgeUnlocked
          ? state.badges.includes(result.badgeUnlocked)
            ? []
            : [result.badgeUnlocked]
          : [];

        const newStreak = streakBroke ? 0 : state.streak + 1;

        set({
          xp: Math.min(MAX_XP, state.xp + result.xpAwarded),
          streak: newStreak,
          badges: [...state.badges, ...newBadges],
          progress: { ...state.progress, [result.scenarioId]: updated },
          lastResult: result,
          newlyUnlocked: newBadges,
        });

        return {
          xpAwarded: result.xpAwarded,
          newBadges,
          streak: newStreak,
        };
      },

      setLastResult: (r) => set({ lastResult: r }),
      clearNewlyUnlocked: () => set({ newlyUnlocked: [] }),
      toggleSound: () => set({ soundEnabled: !get().soundEnabled }),
      setTraineeName: (n) => set({ traineeName: n.slice(0, 24) || "Trainee T/A" }),

      resetAll: () =>
        set({
          ...initialPersisted,
          lastResult: null,
          newlyUnlocked: [],
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        xp: state.xp,
        streak: state.streak,
        badges: state.badges,
        progress: state.progress,
        soundEnabled: state.soundEnabled,
        traineeName: state.traineeName,
      }),
    },
  ),
);

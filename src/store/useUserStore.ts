"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AcademyStats, ScenarioProgress, ScenarioResult } from "@/lib/types";
import { MAX_XP } from "@/data/gamification";
import {
  earnedAcademyBadges,
  emptyAcademyStats,
  findQuestion,
  questionXp,
} from "@/data/academy";

const STORAGE_KEY = "alteamaster-progress-v1";

export interface UserStoreState {
  /* ---- persisted ---- */
  xp: number;
  streak: number;
  badges: string[];
  progress: Record<string, ScenarioProgress>;
  academy: AcademyStats;
  soundEnabled: boolean;
  traineeName: string;

  /* ---- transient (not persisted) ---- */
  lastResult: ScenarioResult | null;
  newlyUnlocked: string[]; // badge ids to celebrate on dashboard
  academyCombo: number;

  /* ---- actions ---- */
  completeScenario: (result: ScenarioResult) => {
    xpAwarded: number;
    newBadges: string[];
    streak: number;
  };
  recordAcademyAnswer: (
    questionId: string,
    correct: boolean,
  ) => {
    xpAwarded: number;
    isNew: boolean;
    newBadges: string[];
    combo: number;
  };
  completeAcademyDrill: () => void;
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
  academy: emptyAcademyStats(),
  soundEnabled: true,
  traineeName: "Trainee T/A",
};

export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      ...initialPersisted,
      lastResult: null,
      newlyUnlocked: [],
      academyCombo: 0,

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

      recordAcademyAnswer: (questionId, correct) => {
        const state = get();
        const question = findQuestion(questionId);

        if (!question) {
          return {
            xpAwarded: 0,
            isNew: false,
            newBadges: [],
            combo: state.academyCombo,
          };
        }

        const alreadyAnswered = state.academy.answered.includes(questionId);
        const alreadyCorrect = state.academy.correct.includes(questionId);
        const combo = correct ? state.academyCombo + 1 : 0;
        const xpAwarded =
          correct && !alreadyCorrect
            ? alreadyAnswered
              ? Math.ceil(questionXp(question) / 2)
              : questionXp(question)
            : 0;

        const academy: AcademyStats = {
          answered: alreadyAnswered
            ? state.academy.answered
            : [...state.academy.answered, questionId],
          correct:
            correct && !alreadyCorrect
              ? [...state.academy.correct, questionId]
              : state.academy.correct,
          xp: state.academy.xp + xpAwarded,
          bestCombo: Math.max(state.academy.bestCombo, combo),
          drills: state.academy.drills,
          lastPlayed: new Date().toISOString(),
        };

        const newBadges = earnedAcademyBadges(academy).filter(
          (badgeId) => !state.badges.includes(badgeId),
        );

        set({
          xp: Math.min(MAX_XP, state.xp + xpAwarded),
          badges: [...state.badges, ...newBadges],
          academy,
          academyCombo: combo,
          newlyUnlocked: newBadges,
        });

        return {
          xpAwarded,
          isNew: !alreadyAnswered,
          newBadges,
          combo,
        };
      },

      completeAcademyDrill: () =>
        set((state) => ({
          academy: {
            ...state.academy,
            drills: state.academy.drills + 1,
            lastPlayed: new Date().toISOString(),
          },
        })),

      setLastResult: (r) => set({ lastResult: r }),
      clearNewlyUnlocked: () => set({ newlyUnlocked: [] }),
      toggleSound: () => set({ soundEnabled: !get().soundEnabled }),
      setTraineeName: (n) => set({ traineeName: n.slice(0, 24) || "Trainee T/A" }),

      resetAll: () =>
        set({
          ...initialPersisted,
          academy: emptyAcademyStats(),
          lastResult: null,
          newlyUnlocked: [],
          academyCombo: 0,
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
        academy: state.academy,
        soundEnabled: state.soundEnabled,
        traineeName: state.traineeName,
      }),
    },
  ),
);

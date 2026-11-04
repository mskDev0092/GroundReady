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

export const STORAGE_KEY = "groundready-progress-v1";
export const LEGACY_STORAGE_KEY = "alteamaster-progress-v1";

/**
 * Reuse progress saved under the old AltéaMaster key. A rebrand must never
 * wipe a trainee's XP, badges, scenario results or smart-review queue.
 */
const progressStorage = () => ({
  getItem: (name: string): string | null => {
    if (typeof localStorage === "undefined") return null;
    const current = localStorage.getItem(name);
    if (current !== null || name !== STORAGE_KEY) return current;

    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy === null) return null;

    localStorage.setItem(STORAGE_KEY, legacy);
    return legacy;
  },
  setItem: (name: string, value: string) => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(name, value);
  },
  removeItem: (name: string) => {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(name);
    if (name === STORAGE_KEY) localStorage.removeItem(LEGACY_STORAGE_KEY);
  },
});

export interface UserStoreState {
  /* ---- persisted ---- */
  xp: number;
  streak: number;
  badges: string[];
  progress: Record<string, ScenarioProgress>;
  academy: AcademyStats;
  soundEnabled: boolean;
  coachMode: boolean;
  onboarded: boolean;
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
  toggleCoachMode: () => void;
  completeOnboarding: () => void;
  replayOnboarding: () => void;
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
  coachMode: true,
  onboarded: false,
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

        /* Smart review: a miss is queued; a correct answer clears it. */
        const review = state.academy.review ?? [];
        const nextReview = correct
          ? review.filter((id) => id !== questionId)
          : review.includes(questionId)
            ? review
            : [...review, questionId];

        const academy: AcademyStats = {
          answered: alreadyAnswered
            ? state.academy.answered
            : [...state.academy.answered, questionId],
          correct:
            correct && !alreadyCorrect
              ? [...state.academy.correct, questionId]
              : state.academy.correct,
          review: nextReview,
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
      toggleCoachMode: () => set({ coachMode: !get().coachMode }),
      completeOnboarding: () => set({ onboarded: true }),
      replayOnboarding: () => set({ onboarded: false }),
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
      storage: createJSONStorage(progressStorage),
      partialize: (state) => ({
        xp: state.xp,
        streak: state.streak,
        badges: state.badges,
        progress: state.progress,
        academy: state.academy,
        soundEnabled: state.soundEnabled,
        coachMode: state.coachMode,
        onboarded: state.onboarded,
        traineeName: state.traineeName,
      }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<UserStoreState>;
        return {
          ...current,
          ...saved,
          academy: { ...emptyAcademyStats(), ...(saved.academy ?? {}) },
        };
      },
    },
  ),
);

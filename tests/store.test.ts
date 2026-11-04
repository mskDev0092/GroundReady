import { beforeEach, describe, expect, test } from "bun:test";
import type { ScenarioResult } from "@/lib/types";
import { installLocalStorage } from "./helpers/local-storage";

const { memory } = installLocalStorage();

const { useUserStore, STORAGE_KEY, LEGACY_STORAGE_KEY } = await import("@/store/useUserStore");
const { MAX_XP } = await import("@/data/gamification");

const SCENARIO_ID = "m1-zamzam";
const BADGE_ID = "zamzam-specialist";

function result(overrides: Partial<ScenarioResult> = {}): ScenarioResult {
  return {
    scenarioId: SCENARIO_ID,
    earned: 100,
    total: 100,
    accuracy: 100,
    xpAwarded: 132,
    speedBonus: 12,
    hintsUsed: 0,
    mistakes: [],
    durationSec: 30,
    badgeUnlocked: BADGE_ID,
    ...overrides,
  };
}

describe("User progress store", () => {
  beforeEach(() => {
    useUserStore.getState().resetAll();
    memory.clear();
  });

  test("a first completion awards XP, marks progress and unlocks the badge", () => {
    const outcome = useUserStore.getState().completeScenario(result());
    const state = useUserStore.getState();
    const progress = state.progress[SCENARIO_ID];

    expect(outcome).toEqual({
      xpAwarded: 132,
      newBadges: [BADGE_ID],
      streak: 1,
    });
    expect(state.xp).toBe(132);
    expect(state.streak).toBe(1);
    expect(state.badges).toEqual([BADGE_ID]);
    expect(state.lastResult).toEqual(result());
    expect(state.newlyUnlocked).toEqual([BADGE_ID]);
    expect(progress).toMatchObject({
      bestAccuracy: 100,
      attempts: 1,
      totalXp: 132,
      bestTimeSec: 30,
      hintsUsed: 0,
      completed: true,
    });
    expect(Number.isNaN(Date.parse(progress.lastPlayed))).toBe(false);
  });

  test("repeat completions accumulate attempts and XP without duplicating the badge", () => {
    useUserStore.getState().completeScenario(result());
    const outcome = useUserStore
      .getState()
      .completeScenario(result({ xpAwarded: 80, durationSec: 10 }));
    const state = useUserStore.getState();
    const progress = state.progress[SCENARIO_ID];

    expect(outcome.newBadges).toEqual([]);
    expect(state.xp).toBe(212);
    expect(state.streak).toBe(2);
    expect(state.badges).toEqual([BADGE_ID]);
    expect(progress.attempts).toBe(2);
    expect(progress.totalXp).toBe(212);
    expect(progress.bestTimeSec).toBe(10);
  });

  test("keeps the best accuracy, fastest time and fewest hints", () => {
    useUserStore.getState().completeScenario(
      result({ accuracy: 90, durationSec: 100, hintsUsed: 4, badgeUnlocked: BADGE_ID }),
    );
    useUserStore.getState().completeScenario(
      result({ accuracy: 95, durationSec: 120, hintsUsed: 2, badgeUnlocked: undefined }),
    );

    expect(useUserStore.getState().progress[SCENARIO_ID]).toMatchObject({
      bestAccuracy: 95,
      bestTimeSec: 100,
      hintsUsed: 2,
      attempts: 2,
    });
  });

  test("a run below 80% resets the streak but still records progress", () => {
    useUserStore.getState().completeScenario(result());
    expect(useUserStore.getState().streak).toBe(1);

    const outcome = useUserStore.getState().completeScenario(
      result({ accuracy: 79, earned: 79, badgeUnlocked: undefined, durationSec: 20 }),
    );

    expect(outcome.streak).toBe(0);
    expect(useUserStore.getState().streak).toBe(0);
    expect(useUserStore.getState().progress[SCENARIO_ID]).toMatchObject({
      bestAccuracy: 100,
      attempts: 2,
      completed: true,
    });
  });

  test("an 80% run keeps the streak alive", () => {
    useUserStore.getState().completeScenario(result());
    const outcome = useUserStore
      .getState()
      .completeScenario(result({ accuracy: 80, earned: 80, badgeUnlocked: undefined }));

    expect(outcome.streak).toBe(2);
  });

  test("total XP is capped at MAX_XP", () => {
    useUserStore.setState({ xp: MAX_XP - 5 });
    useUserStore.getState().completeScenario(result({ xpAwarded: 100 }));

    expect(useUserStore.getState().xp).toBe(MAX_XP);
  });

  test("only persisted fields are written to storage", () => {
    useUserStore.getState().completeScenario(result());
    const raw = memory.get(STORAGE_KEY);

    expect(raw).toBeDefined();
    const persisted = JSON.parse(raw as string);
    expect(persisted.state.xp).toBe(132);
    expect(persisted.state.progress[SCENARIO_ID]).toBeDefined();
    expect(persisted.state.lastResult).toBeUndefined();
    expect(persisted.state.newlyUnlocked).toBeUndefined();
  });

  test("legacy AltéaMaster progress migrates to the GroundReady key", async () => {
    const legacy = JSON.stringify({
      state: {
        xp: 321,
        streak: 4,
        badges: [BADGE_ID],
        progress: {},
        academy: {
          answered: [],
          correct: [],
          review: [],
          xp: 0,
          bestCombo: 0,
          drills: 0,
          lastPlayed: null,
        },
        soundEnabled: true,
        coachMode: true,
        onboarded: true,
        traineeName: "Legacy T/A",
      },
      version: 0,
    });

    memory.set(LEGACY_STORAGE_KEY, legacy);
    await useUserStore.persist.rehydrate();

    expect(memory.get(STORAGE_KEY)).toBe(legacy);
    expect(useUserStore.getState().xp).toBe(321);
    expect(useUserStore.getState().traineeName).toBe("Legacy T/A");
    expect(useUserStore.getState().onboarded).toBe(true);
  });

  test("resetAll clears XP, badges, progress and transient state", () => {
    useUserStore.getState().completeScenario(result());
    useUserStore.getState().resetAll();
    const state = useUserStore.getState();

    expect(state.xp).toBe(0);
    expect(state.streak).toBe(0);
    expect(state.badges).toEqual([]);
    expect(state.progress).toEqual({});
    expect(state.soundEnabled).toBe(true);
    expect(state.traineeName).toBe("Trainee T/A");
    expect(state.lastResult).toBeNull();
    expect(state.newlyUnlocked).toEqual([]);
  });

  test("trainee names are capped at 24 characters and empty names fall back", () => {
    useUserStore.getState().setTraineeName("A".repeat(30));
    expect(useUserStore.getState().traineeName).toBe("A".repeat(24));

    useUserStore.getState().setTraineeName("");
    expect(useUserStore.getState().traineeName).toBe("Trainee T/A");
  });

  test("sound toggles, result and badge notifications can be cleared", () => {
    const store = useUserStore.getState();

    store.toggleSound();
    expect(useUserStore.getState().soundEnabled).toBe(false);
    useUserStore.getState().toggleSound();
    expect(useUserStore.getState().soundEnabled).toBe(true);

    useUserStore.getState().completeScenario(result());
    expect(useUserStore.getState().newlyUnlocked).toEqual([BADGE_ID]);
    useUserStore.getState().clearNewlyUnlocked();
    expect(useUserStore.getState().newlyUnlocked).toEqual([]);

    useUserStore.getState().setLastResult(null);
    expect(useUserStore.getState().lastResult).toBeNull();
  });
});

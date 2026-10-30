import { beforeEach, describe, expect, test } from "bun:test";
import { MAX_XP, levelFromXp } from "@/data/gamification";
import { SCENARIOS, isUnlocked } from "@/data/scenarios";
import { installLocalStorage } from "./helpers/local-storage";
import { simulatePerfectRun } from "./helpers/scenario-harness";

const { memory } = installLocalStorage();

const { useUserStore } = await import("@/store/useUserStore");

describe("Full campaign progression", () => {
  beforeEach(() => {
    useUserStore.getState().resetAll();
    memory.clear();
  });

  test("perfect runs unlock every module in sequence and earn every badge", () => {
    let expectedXp = 0;

    SCENARIOS.forEach((scenario, index) => {
      const before = useUserStore.getState();

      expect(isUnlocked(scenario, before.progress)).toBe(true);

      const run = simulatePerfectRun(scenario);
      expect(run.accuracy).toBe(100);

      expectedXp += run.xpAwarded;
      const outcome = before.completeScenario(run);
      const after = useUserStore.getState();

      expect(outcome.streak).toBe(index + 1);
      expect(scenario.badgeId).toBeDefined();
      expect(outcome.newBadges).toEqual([scenario.badgeId as string]);
      expect(after.progress[scenario.id]).toMatchObject({
        bestAccuracy: 100,
        attempts: 1,
        completed: true,
      });
      expect(after.xp).toBe(Math.min(MAX_XP, expectedXp));
    });

    const state = useUserStore.getState();
    const earnedBadges = SCENARIOS.map((scenario) => scenario.badgeId).filter(
      (badgeId): badgeId is string => badgeId !== undefined,
    );

    expect(Object.keys(state.progress)).toHaveLength(SCENARIOS.length);
    expect(state.badges).toHaveLength(SCENARIOS.length);
    expect([...state.badges].sort()).toEqual([...earnedBadges].sort());
    expect(state.streak).toBe(SCENARIOS.length);
    expect(state.xp).toBe(expectedXp);
    expect(state.xp).toBeLessThanOrEqual(MAX_XP);
    expect(levelFromXp(state.xp).level).toBe(5);

    for (const scenario of SCENARIOS) {
      expect(isUnlocked(scenario, state.progress)).toBe(true);
    }
  });

  test("skipping a module keeps the next module locked", () => {
    const [first, second, third] = SCENARIOS;

    useUserStore.getState().completeScenario(simulatePerfectRun(third));
    expect(isUnlocked(second, useUserStore.getState().progress)).toBe(false);

    useUserStore.getState().completeScenario(simulatePerfectRun(first));
    expect(isUnlocked(second, useUserStore.getState().progress)).toBe(true);
    expect(isUnlocked(third, useUserStore.getState().progress)).toBe(false);

    useUserStore.getState().completeScenario(simulatePerfectRun(second));
    expect(isUnlocked(third, useUserStore.getState().progress)).toBe(true);
  });
});

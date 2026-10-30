import { describe, expect, test } from "bun:test";
import { SCENARIOS, scenarioMaxPoints } from "@/data/scenarios";
import { buildScenarioResult } from "@/lib/scoring";
import type { MistakeEntry } from "@/lib/types";

const scenario = SCENARIOS[0];
const total = scenarioMaxPoints(scenario);
const par = scenario.minutes * 60;

function run(overrides: Partial<Parameters<typeof buildScenarioResult>[1]> = {}) {
  return buildScenarioResult(scenario, {
    earned: total,
    hintsUsed: 0,
    mistakes: [],
    durationSec: 1,
    ...overrides,
  });
}

describe("Scenario result scoring", () => {
  test("a perfect run under par earns full XP, a speed bonus and the badge", () => {
    const result = run();
    const expectedBonus = Math.round(scenario.xpBase * 0.1);

    expect(result.scenarioId).toBe(scenario.id);
    expect(result.total).toBe(total);
    expect(result.earned).toBe(total);
    expect(result.accuracy).toBe(100);
    expect(result.hintsUsed).toBe(0);
    expect(result.mistakes).toEqual([]);
    expect(result.speedBonus).toBe(expectedBonus);
    expect(result.xpAwarded).toBe(scenario.xpBase + expectedBonus);
    expect(result.badgeUnlocked).toBe(scenario.badgeId);
  });

  test("finishing exactly at par still earns the speed bonus", () => {
    expect(run({ durationSec: par }).speedBonus).toBe(Math.round(scenario.xpBase * 0.1));
  });

  test("finishing one second over par loses the speed bonus but keeps full XP", () => {
    const result = run({ durationSec: par + 1 });

    expect(result.speedBonus).toBe(0);
    expect(result.xpAwarded).toBe(scenario.xpBase);
    expect(result.badgeUnlocked).toBe(scenario.badgeId);
  });

  test("unlocks the badge at 90% and withholds it at 89%", () => {
    expect(run({ earned: Math.round(total * 0.9) }).badgeUnlocked).toBe(scenario.badgeId);
    expect(run({ earned: Math.round(total * 0.89) }).badgeUnlocked).toBeUndefined();
  });

  test("awards the speed bonus at 60% accuracy but not at 59%", () => {
    expect(run({ earned: Math.round(total * 0.6) }).speedBonus).toBe(
      Math.round(scenario.xpBase * 0.1),
    );
    expect(run({ earned: Math.round(total * 0.59) }).speedBonus).toBe(0);
  });

  test("scales XP with accuracy", () => {
    const result = run({ earned: Math.round(total * 0.75), durationSec: par + 1 });

    expect(result.accuracy).toBe(75);
    expect(result.xpAwarded).toBe(Math.round((scenario.xpBase * 75) / 100));
  });

  test("zero score awards no XP and no badge", () => {
    const result = run({ earned: 0, durationSec: par + 1 });

    expect(result.accuracy).toBe(0);
    expect(result.speedBonus).toBe(0);
    expect(result.xpAwarded).toBe(0);
    expect(result.badgeUnlocked).toBeUndefined();
  });

  test("clamps accuracy to 0–100 even for impossible counters", () => {
    expect(run({ earned: total + 50 }).accuracy).toBe(100);
    expect(run({ earned: -50 }).accuracy).toBe(0);
  });

  test("preserves hints, mistakes and duration verbatim", () => {
    const mistakes: MistakeEntry[] = [
      { stepId: "s1", title: "Entry error", detail: "Typo", pointsLost: 0 },
    ];
    const result = run({ hintsUsed: 3, mistakes, durationSec: 424 });

    expect(result.hintsUsed).toBe(3);
    expect(result.mistakes).toBe(mistakes);
    expect(result.durationSec).toBe(424);
  });
});

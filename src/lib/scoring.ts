import type { MistakeEntry, Scenario, ScenarioResult } from "@/lib/types";
import { scenarioMaxPoints } from "@/data/scenarios";

/** Raw counters collected while a scenario is being played. */
export interface RunStats {
  earned: number;
  hintsUsed: number;
  mistakes: MistakeEntry[];
  durationSec: number;
}

/**
 * Turn a finished run into the result consumed by the summary screen and store.
 * Kept pure so the scoring rules can be unit-tested without rendering the UI.
 */
export function buildScenarioResult(scenario: Scenario, run: RunStats): ScenarioResult {
  const total = scenarioMaxPoints(scenario);
  const accuracy = Math.max(0, Math.min(100, Math.round((run.earned / total) * 100)));
  const underPar = run.durationSec <= scenario.minutes * 60;
  const speedBonus = underPar && accuracy >= 60 ? Math.round(scenario.xpBase * 0.1) : 0;
  const xpAwarded = Math.round((scenario.xpBase * accuracy) / 100) + speedBonus;

  return {
    scenarioId: scenario.id,
    earned: run.earned,
    total,
    accuracy,
    xpAwarded,
    speedBonus,
    hintsUsed: run.hintsUsed,
    mistakes: run.mistakes,
    durationSec: run.durationSec,
    badgeUnlocked: accuracy >= 90 ? scenario.badgeId : undefined,
  };
}

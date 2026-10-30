import { commandPoints, evaluateEntry } from "@/lib/altea";
import { scenarioMaxPoints } from "@/data/scenarios";
import { buildScenarioResult } from "@/lib/scoring";
import type { Scenario, ScenarioResult, ScenarioStep } from "@/lib/types";

export interface StepScore {
  stepId: string;
  type: ScenarioStep["type"];
  earned: number;
  max: number;
}

export interface PerfectRun extends ScenarioResult {
  steps: StepScore[];
}

/** Maximum points available from a single step. */
export function stepMaxPoints(step: ScenarioStep): number {
  if (step.type === "terminal") {
    return step.commands.reduce((sum, command) => sum + command.points, 0);
  }
  return Math.max(...step.options.map((option) => option.points));
}

/**
 * Drive a scenario through its intended ("best") path using the same command
 * engine and scoring function as the UI. Any command that would not be
 * accepted throws with the exact scenario/step context.
 */
export function simulatePerfectRun(
  scenario: Scenario,
  durationSec = Math.max(1, scenario.minutes * 60 - 60),
): PerfectRun {
  const steps: StepScore[] = [];
  let earned = 0;

  for (const step of scenario.steps) {
    if (step.type === "terminal") {
      let stepEarned = 0;

      step.commands.forEach((command, index) => {
        const outcome = evaluateEntry(
          command.display,
          step.commands[index],
          step.commands.slice(index + 1),
        );

        if (outcome.kind !== "ok") {
          throw new Error(
            `${scenario.code} · ${step.id}: "${command.display}" was not accepted ` +
              `(${outcome.kind}: ${outcome.message})`,
          );
        }

        stepEarned += commandPoints(command, {
          attempts: 0,
          hintUsed: false,
          done: false,
        });
      });

      earned += stepEarned;
      steps.push({
        stepId: step.id,
        type: step.type,
        earned: stepEarned,
        max: stepMaxPoints(step),
      });
      continue;
    }

    const best = step.options.find((option) => option.best === true);
    if (!best) {
      throw new Error(`${scenario.code} · ${step.id}: no best option to play`);
    }

    earned += best.points;
    steps.push({
      stepId: step.id,
      type: step.type,
      earned: best.points,
      max: stepMaxPoints(step),
    });
  }

  return {
    ...buildScenarioResult(scenario, {
      earned,
      hintsUsed: 0,
      mistakes: [],
      durationSec,
    }),
    steps,
  };
}

/** Points available from the whole scenario, as exposed by the data helper. */
export function maxPoints(scenario: Scenario): number {
  return scenarioMaxPoints(scenario);
}

import type { Scenario, ScenarioCategory } from "@/lib/types";
import { scenarioZamzam } from "./scenarios-module1";
import { scenarioExcessBaggage } from "./scenarios-module2";
import { scenarioDryIceUK } from "./scenarios-module3";
import { scenarioOverbooking } from "./scenarios-module4";
import { scenarioSSSS } from "./scenarios-module5";
import { scenarioLithium } from "./scenarios-module6";
import { scenarioCricket } from "./scenarios-module7";
import { scenarioValidity } from "./scenarios-module8";
import { scenarioNameFix } from "./scenarios-module9";
import { scenarioIDB } from "./scenarios-module10";
import { scenarioNoShow } from "./scenarios-module11";
import { scenarioUMNR } from "./scenarios-module12";
import { scenarioPRM } from "./scenarios-module13";
import { scenarioMEDA } from "./scenarios-module14";
import { scenarioFog } from "./scenarios-module15";
import { scenarioDocFraud } from "./scenarios-module16";
import { scenarioCargoDgr } from "./scenarios-module17";
import { scenarioIgomTurnaround } from "./scenarios-module18";

export const SCENARIOS: Scenario[] = [
  scenarioZamzam,
  scenarioExcessBaggage,
  scenarioDryIceUK,
  scenarioOverbooking,
  scenarioSSSS,
  scenarioLithium,
  scenarioCricket,
  scenarioValidity,
  scenarioNameFix,
  scenarioIDB,
  scenarioNoShow,
  scenarioUMNR,
  scenarioPRM,
  scenarioMEDA,
  scenarioFog,
  scenarioDocFraud,
  scenarioCargoDgr,
  scenarioIgomTurnaround,
];

export const CATEGORY_ORDER: ScenarioCategory[] = [
  "baggage-dgr",
  "cargo-dgr",
  "documentation",
  "overbooking",
  "gate-ops",
  "special-pax",
  "irrops",
  "security",
  "ramp-ops",
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

/** Scenario n+1 unlocks when scenario n is completed. */
export function isUnlocked(
  scenario: Scenario,
  progress: Record<string, { completed: boolean }>,
): boolean {
  const idx = SCENARIOS.findIndex((s) => s.id === scenario.id);
  if (idx <= 0) return true;
  const prev = SCENARIOS[idx - 1];
  return progress[prev.id]?.completed === true;
}

/** Sum of the best possible points for a scenario (normalised to ~100). */
export function scenarioMaxPoints(scenario: Scenario): number {
  let total = 0;
  for (const step of scenario.steps) {
    if (step.type === "terminal") {
      total += step.commands.reduce((a, c) => a + c.points, 0);
    } else {
      total += Math.max(...step.options.map((o) => o.points));
    }
  }
  return total;
}

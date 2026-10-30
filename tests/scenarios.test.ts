import { describe, expect, test } from "bun:test";
import {
  CATEGORY_ORDER,
  SCENARIOS,
  getScenario,
  isUnlocked,
  scenarioMaxPoints,
} from "@/data/scenarios";
import { BADGES, MAX_XP } from "@/data/gamification";
import { CATEGORY_META, type DocField, type ScenarioCategory } from "@/lib/types";
import { commandPoints, evaluateEntry, matchesCommand } from "@/lib/altea";
import { maxPoints, simulatePerfectRun, stepMaxPoints } from "./helpers/scenario-harness";

const AVATAR_TONES = ["emerald", "amber", "rose", "teal", "violet", "orange"] as const;
const DOC_HIGHLIGHTS = ["ok", "warn", "bad"] as const;

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function checkNoIssues(issues: string[]) {
  expect(issues).toEqual([]);
}

describe("Scenario catalogue", () => {
  test("contains all 16 modules in order", () => {
    expect(SCENARIOS).toHaveLength(16);
    expect(SCENARIOS.map((scenario) => scenario.moduleNo)).toEqual(
      Array.from({ length: 16 }, (_, index) => index + 1),
    );
  });

  test("scenario ids, codes and titles are globally unique", () => {
    const ids = SCENARIOS.map((scenario) => scenario.id);
    const codes = SCENARIOS.map((scenario) => scenario.code);
    const titles = SCENARIOS.map((scenario) => scenario.title);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(codes).size).toBe(codes.length);
    expect(new Set(titles).size).toBe(titles.length);
  });

  test("every declared category is valid and represented by at least one scenario", () => {
    const declared = Object.keys(CATEGORY_META) as ScenarioCategory[];
    const used = new Set(SCENARIOS.map((scenario) => scenario.category));

    expect(new Set(CATEGORY_ORDER)).toEqual(new Set(declared));
    expect(CATEGORY_ORDER).toHaveLength(declared.length);
    for (const category of declared) {
      expect(used.has(category)).toBe(true);
    }
    for (const scenario of SCENARIOS) {
      expect(declared).toContain(scenario.category);
    }
  });

  test("getScenario resolves every id and rejects unknown ids", () => {
    for (const scenario of SCENARIOS) {
      expect(getScenario(scenario.id)).toBe(scenario);
    }
    expect(getScenario("does-not-exist")).toBeUndefined();
    expect(getScenario("")).toBeUndefined();
  });

  test("isUnlocked enforces sequential progression", () => {
    expect(isUnlocked(SCENARIOS[0], {})).toBe(true);

    for (let index = 1; index < SCENARIOS.length; index++) {
      const scenario = SCENARIOS[index];
      const previous = SCENARIOS[index - 1];

      expect(isUnlocked(scenario, {})).toBe(false);
      expect(isUnlocked(scenario, { [previous.id]: { completed: false } })).toBe(false);
      expect(isUnlocked(scenario, { [previous.id]: { completed: true } })).toBe(true);
    }
  });

  test("badge registry is unique and aligned with the module numbers", () => {
    const badgeIds = BADGES.map((badge) => badge.id);
    expect(new Set(badgeIds).size).toBe(badgeIds.length);

    const assignedBadges = SCENARIOS.map((scenario) => scenario.badgeId).filter(
      (badgeId): badgeId is string => badgeId !== undefined,
    );
    expect(new Set(assignedBadges).size).toBe(assignedBadges.length);

    for (const scenario of SCENARIOS) {
      expect(nonEmpty(scenario.badgeId)).toBe(true);
      const badge = BADGES.find((candidate) => candidate.id === scenario.badgeId);
      expect(badge).toBeDefined();
      expect(nonEmpty(badge?.name)).toBe(true);
      expect(nonEmpty(badge?.icon)).toBe(true);
      expect(nonEmpty(badge?.description)).toBe(true);
      expect(badge?.requirement).toContain(`Module ${scenario.moduleNo}`);
    }
  });
});

for (const scenario of SCENARIOS) {
  describe(`${scenario.code} — ${scenario.title}`, () => {
    test("metadata, briefing and learning material are complete", () => {
      const issues: string[] = [];

      if (!scenario.id.startsWith(`m${scenario.moduleNo}-`)) {
        issues.push(`id "${scenario.id}" does not match module ${scenario.moduleNo}`);
      }
      if (!scenario.code.startsWith(`M${scenario.moduleNo}-`)) {
        issues.push(`code "${scenario.code}" does not match module ${scenario.moduleNo}`);
      }
      if (!nonEmpty(scenario.title)) issues.push("title is empty");
      if (!nonEmpty(scenario.summary)) issues.push("summary is empty");
      if (!nonEmpty(scenario.briefing)) issues.push("briefing is empty");
      if (!Object.hasOwn(CATEGORY_META, scenario.category)) {
        issues.push(`unknown category "${scenario.category}"`);
      }

      if (!Number.isInteger(scenario.difficulty) || scenario.difficulty < 1 || scenario.difficulty > 5) {
        issues.push(`difficulty must be an integer 1–5, got ${scenario.difficulty}`);
      }
      if (!Number.isInteger(scenario.xpBase) || scenario.xpBase <= 0 || scenario.xpBase > MAX_XP) {
        issues.push(`xpBase must be a positive integer ≤ ${MAX_XP}, got ${scenario.xpBase}`);
      }
      if (!Number.isInteger(scenario.minutes) || scenario.minutes <= 0) {
        issues.push(`minutes must be a positive integer, got ${scenario.minutes}`);
      }

      if (scenario.tags.length === 0) issues.push("tags is empty");
      if (new Set(scenario.tags).size !== scenario.tags.length) issues.push("tags contain duplicates");
      for (const tag of scenario.tags) {
        if (!nonEmpty(tag)) issues.push("tag is empty");
      }

      if (scenario.objectives.length === 0) issues.push("objectives is empty");
      for (const objective of scenario.objectives) {
        if (!nonEmpty(objective)) issues.push("objective is empty");
      }

      if (scenario.checklist.length === 0) issues.push("checklist is empty");
      for (const item of scenario.checklist) {
        if (!nonEmpty(item)) issues.push("checklist item is empty");
      }

      if (scenario.debriefRules.length === 0) issues.push("debriefRules is empty");
      scenario.debriefRules.forEach((rule, index) => {
        for (const key of ["source", "ref", "detail"] as const) {
          if (!nonEmpty(rule[key])) issues.push(`debriefRules[${index}].${key} is empty`);
        }
      });

      checkNoIssues(issues);
    });

    test("passenger, baggage and document data are complete", () => {
      const issues: string[] = [];
      const passenger = scenario.passenger;
      const textFields = [
        "name",
        "nationality",
        "passportNo",
        "passportExpiry",
        "pnr",
        "ticketNo",
        "flight",
        "route",
        "date",
        "seat",
        "fareClass",
        "allowance",
        "originStation",
      ] as const;

      for (const field of textFields) {
        if (!nonEmpty(passenger[field])) issues.push(`passenger.${field} is empty`);
      }

      // Some scenarios model a queue/podium rather than one named passenger.
      const isGroupScenario = /multiple|group/i.test(passenger.name);
      if (!Number.isInteger(passenger.age) || passenger.age < 0 || passenger.age > 120) {
        issues.push(`passenger.age is invalid: ${passenger.age}`);
      }
      if (passenger.age === 0 && !isGroupScenario) {
        issues.push("only a group scenario may use age 0");
      }
      if (!AVATAR_TONES.includes(passenger.avatarTone)) {
        issues.push(`passenger.avatarTone is invalid: ${passenger.avatarTone}`);
      }
      if (passenger.visa !== undefined && !nonEmpty(passenger.visa)) {
        issues.push("passenger.visa is present but empty");
      }
      if (passenger.freqFlyer !== undefined && !nonEmpty(passenger.freqFlyer)) {
        issues.push("passenger.freqFlyer is present but empty");
      }

      if (scenario.baggage.length === 0 && !isGroupScenario) {
        issues.push("baggage is empty");
      }
      const bagIds = new Set<string>();
      for (const item of scenario.baggage) {
        if (!nonEmpty(item.id)) issues.push("baggage id is empty");
        if (bagIds.has(item.id)) issues.push(`duplicate baggage id "${item.id}"`);
        bagIds.add(item.id);
        if (!nonEmpty(item.label)) issues.push(`baggage ${item.id} label is empty`);
        if (!Number.isFinite(item.weightKg) || item.weightKg < 0) {
          issues.push(`baggage ${item.id} has invalid weight ${item.weightKg}`);
        }
        if (item.type !== "checked" && item.type !== "cabin") {
          issues.push(`baggage ${item.id} has invalid type ${item.type}`);
        }
        if (item.tag !== undefined && !nonEmpty(item.tag)) {
          issues.push(`baggage ${item.id} tag is present but empty`);
        }
        if (item.note !== undefined && !nonEmpty(item.note)) {
          issues.push(`baggage ${item.id} note is present but empty`);
        }
      }

      if (scenario.documents.ticket.length === 0) issues.push("documents.ticket is empty");
      const documentGroups: Array<[string, DocField[] | undefined]> = [
        ["passport", scenario.documents.passport],
        ["visa", scenario.documents.visa],
        ["ticket", scenario.documents.ticket],
        ["extra", scenario.documents.extra],
      ];

      for (const [groupName, fields] of documentGroups) {
        if (!fields) continue;
        fields.forEach((field, index) => {
          for (const key of ["key", "label", "value"] as const) {
            if (!nonEmpty(field[key])) {
              issues.push(`documents.${groupName}[${index}].${key} is empty`);
            }
          }
          if (field.highlight && !DOC_HIGHLIGHTS.includes(field.highlight)) {
            issues.push(
              `documents.${groupName}[${index}].highlight is invalid: ${field.highlight}`,
            );
          }
        });
      }

      checkNoIssues(issues);
    });

    test("step, option and command identifiers are unique and well formed", () => {
      const issues: string[] = [];
      const stepIds = scenario.steps.map((step) => step.id);
      const allOptionIds: string[] = [];

      if (scenario.steps.length === 0) issues.push("scenario has no steps");
      if (new Set(stepIds).size !== stepIds.length) issues.push("step ids are not unique");

      for (const step of scenario.steps) {
        if (!nonEmpty(step.id)) issues.push("step id is empty");
        if (!nonEmpty(step.prompt)) issues.push(`${step.id}: prompt is empty`);

        if (step.type === "terminal") {
          if (!nonEmpty(step.intro)) issues.push(`${step.id}: intro is empty`);
          if (step.commands.length === 0) issues.push(`${step.id}: no commands`);

          const displays = step.commands.map((command) => command.display);
          if (new Set(displays).size !== displays.length) {
            issues.push(`${step.id}: command displays are not unique`);
          }

          step.commands.forEach((command, index) => {
            const label = `${step.id}.commands[${index}]`;
            if (!nonEmpty(command.display)) issues.push(`${label}: display is empty`);
            if (!nonEmpty(command.hint)) issues.push(`${label}: hint is empty`);
            if (!nonEmpty(command.pattern)) issues.push(`${label}: pattern is empty`);
            if (
              !Number.isInteger(command.points) ||
              command.points <= 0
            ) {
              issues.push(`${label}: points must be a positive integer`);
            }
            if (command.output.length === 0) issues.push(`${label}: output is empty`);
            for (const line of command.output) {
              if (!nonEmpty(line)) issues.push(`${label}: output line is empty`);
            }
            if (command.errorHint !== undefined && !nonEmpty(command.errorHint)) {
              issues.push(`${label}: errorHint is present but empty`);
            }

            try {
              new RegExp(command.pattern);
            } catch {
              issues.push(`${label}: pattern is not a valid regex`);
              return;
            }

            if (!command.pattern.startsWith("^")) {
              issues.push(`${label}: pattern must be anchored at the start`);
            }
            if (!matchesCommand(command.display, command)) {
              issues.push(`${label}: display does not match its own pattern`);
            }

            const matching = step.commands.filter((candidate) =>
              matchesCommand(command.display, candidate),
            );
            if (matching.length !== 1) {
              issues.push(
                `${label}: display matches ${matching.length} commands in the step (expected 1)`,
              );
            }
          });
          continue;
        }

        if (step.options.length < 2) {
          issues.push(`${step.id}: needs at least two options`);
        }

        const optionIds = step.options.map((option) => option.id);
        if (new Set(optionIds).size !== optionIds.length) {
          issues.push(`${step.id}: option ids are not unique`);
        }
        allOptionIds.push(...optionIds);

        if (step.type === "dialogue") {
          if (step.passengerLines.length === 0) {
            issues.push(`${step.id}: passengerLines is empty`);
          }
          for (const line of step.passengerLines) {
            if (!nonEmpty(line)) issues.push(`${step.id}: passenger line is empty`);
          }
        } else if (!nonEmpty(step.situation)) {
          issues.push(`${step.id}: situation is empty`);
        }

        step.options.forEach((option, index) => {
          const label = `${step.id}.options[${index}]`;
          if (!nonEmpty(option.id)) issues.push(`${label}: id is empty`);
          if (!nonEmpty(option.text)) issues.push(`${label}: text is empty`);
          if (!nonEmpty(option.feedback)) issues.push(`${label}: feedback is empty`);
          if (!Number.isInteger(option.points) || option.points < 0) {
            issues.push(`${label}: points must be a non-negative integer`);
          }
          if (typeof option.best !== "boolean") {
            issues.push(`${label}: best must be a boolean`);
          }
          if (option.consequence !== undefined && !nonEmpty(option.consequence)) {
            issues.push(`${label}: consequence is present but empty`);
          }
        });
      }

      if (new Set(allOptionIds).size !== allOptionIds.length) {
        issues.push("option ids are not unique across the whole scenario");
      }

      checkNoIssues(issues);
    });

    test("exercises dialogue, terminal and decision interactions", () => {
      const types = new Set(scenario.steps.map((step) => step.type));

      expect(types).toEqual(new Set(["dialogue", "terminal", "decision"]));
    });

    test("every choice step has exactly one best option worth the maximum", () => {
      const issues: string[] = [];

      for (const step of scenario.steps) {
        if (step.type === "terminal") continue;

        const maximum = Math.max(...step.options.map((option) => option.points));
        const bestOptions = step.options.filter((option) => option.best === true);

        if (bestOptions.length !== 1) {
          issues.push(`${step.id}: expected exactly one best option, found ${bestOptions.length}`);
        }
        if (maximum <= 0) issues.push(`${step.id}: maximum points must be > 0`);
        if (bestOptions[0]?.points !== maximum) {
          issues.push(`${step.id}: best option does not carry the maximum points`);
        }
        for (const option of step.options) {
          if (option.best !== true && option.points >= maximum) {
            issues.push(
              `${step.id}/${option.id}: non-best option ties the best score (${option.points})`,
            );
          }
        }
      }

      checkNoIssues(issues);
    });

    test("every terminal command is accepted at full points and in sequence", () => {
      const issues: string[] = [];

      for (const step of scenario.steps) {
        if (step.type !== "terminal") continue;

        step.commands.forEach((command, index) => {
          const fullPoints = commandPoints(command, {
            attempts: 0,
            hintUsed: false,
            done: false,
          });
          if (fullPoints !== command.points) {
            issues.push(
              `${step.id}/${command.display}: clean entry awards ${fullPoints}/${command.points}`,
            );
          }

          const outcome = evaluateEntry(
            command.display,
            command,
            step.commands.slice(index + 1),
          );
          if (outcome.kind !== "ok") {
            issues.push(
              `${step.id}/${command.display}: not accepted (${outcome.kind}) — ${outcome.message}`,
            );
          }
        });

        if (step.commands.length > 1) {
          const first = step.commands[0];
          const last = step.commands[step.commands.length - 1];
          const outOfOrder = evaluateEntry(last.display, first, step.commands.slice(1));
          if (outOfOrder.kind !== "sequence") {
            issues.push(
              `${step.id}: submitting the last command first was "${outOfOrder.kind}", expected "sequence"`,
            );
          }
        }
      }

      checkNoIssues(issues);
    });

    test("maximum score is exactly 100 points", () => {
      const fromHelper = scenarioMaxPoints(scenario);
      const fromSteps = scenario.steps.reduce((sum, step) => sum + stepMaxPoints(step), 0);

      expect(fromHelper).toBe(100);
      expect(fromSteps).toBe(100);
      expect(maxPoints(scenario)).toBe(100);
    });

    test("a perfect playthrough scores 100% and unlocks the module badge", () => {
      const run = simulatePerfectRun(scenario);

      expect(run.scenarioId).toBe(scenario.id);
      expect(run.total).toBe(100);
      expect(run.earned).toBe(100);
      expect(run.accuracy).toBe(100);
      expect(run.hintsUsed).toBe(0);
      expect(run.mistakes).toEqual([]);
      expect(run.badgeUnlocked).toBe(scenario.badgeId);
      expect(run.steps).toHaveLength(scenario.steps.length);
      expect(run.durationSec).toBeLessThanOrEqual(scenario.minutes * 60);

      run.steps.forEach((step, index) => {
        expect(step.stepId).toBe(scenario.steps[index].id);
        expect(step.type).toBe(scenario.steps[index].type);
        expect(step.earned).toBe(step.max);
      });

      const expectedSpeedBonus = Math.round(scenario.xpBase * 0.1);
      expect(run.speedBonus).toBe(expectedSpeedBonus);
      expect(run.xpAwarded).toBe(scenario.xpBase + expectedSpeedBonus);
    });
  });
}

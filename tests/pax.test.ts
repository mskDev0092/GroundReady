import { describe, expect, test } from "bun:test";
import {
  ACADEMY_QUESTIONS,
  ACADEMY_TRACKS,
  emptyAcademyStats,
} from "@/data/academy";
import {
  PAX_BADGE_ID,
  PAX_EXISTING_QUESTION_IDS,
  PAX_MASTERY_THRESHOLD,
  PAX_MODULES,
  PAX_MODULE_ORDER,
  PAX_STAGES,
  earnedPaxBadges,
  nextPaxModule,
  paxModuleByCode,
  paxModuleProgress,
  paxModuleQuestions,
  paxPathwayProgress,
  paxQuestions,
} from "@/data/pax";
import { PAX_QUESTIONS } from "@/data/pax-questions";
import { BADGES } from "@/data/gamification";
import { getScenario } from "@/data/scenarios";
import type { AcademyStats, PaxModuleCode } from "@/lib/types";

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function statsWith(correctIds: string[], answeredIds = correctIds): AcademyStats {
  return {
    ...emptyAcademyStats(),
    answered: [...answeredIds],
    correct: [...correctIds],
  };
}

const ALL_MODULE_QUESTION_IDS = [
  ...new Set(
    PAX_MODULES.flatMap((entry) =>
      paxModuleQuestions(entry.code).map((question) => question.id),
    ),
  ),
];

describe("AHM 1110 pathway structure", () => {
  test("all 14 modules are present, ordered and unique", () => {
    expect(PAX_MODULES).toHaveLength(14);
    expect(new Set(PAX_MODULE_ORDER).size).toBe(PAX_MODULES.length);
    expect(PAX_MODULE_ORDER).toEqual(PAX_MODULES.map((entry) => entry.code));
    expect(PAX_MODULE_ORDER[0]).toBe("GEN 01");
    expect(PAX_MODULE_ORDER).toContain("PAX 09/10");
    expect(PAX_MODULE_ORDER).toContain("PAX 14");
  });

  test("every module has complete, usable teaching content", () => {
    const issues: string[] = [];

    for (const entry of PAX_MODULES) {
      const label = entry.code || "(missing code)";
      if (!nonEmpty(entry.title)) issues.push(`${label}: title is empty`);
      if (!nonEmpty(entry.icon)) issues.push(`${label}: icon is empty`);
      if (!nonEmpty(entry.covers)) issues.push(`${label}: covers is empty`);
      if (!nonEmpty(entry.tellsTA)) issues.push(`${label}: tellsTA is empty`);
      if (!PAX_STAGES.includes(entry.stage)) {
        issues.push(`${label}: unknown stage ${entry.stage}`);
      }
      if (!ACADEMY_TRACKS.includes(entry.track)) {
        issues.push(`${label}: unknown track ${entry.track}`);
      }
      if (entry.keyRules.length < 3) {
        issues.push(`${label}: expected at least 3 key rules`);
      }
      for (const rule of entry.keyRules) {
        if (!nonEmpty(rule)) issues.push(`${label}: empty key rule`);
      }
      if (entry.scenarioIds.length === 0) {
        issues.push(`${label}: no scenario links`);
      }
      for (const scenarioId of entry.scenarioIds) {
        if (!getScenario(scenarioId)) {
          issues.push(`${label}: unknown scenarioId ${scenarioId}`);
        }
      }
    }

    expect(issues).toEqual([]);
  });

  test("each module has exactly two dedicated PAX questions", () => {
    expect(PAX_QUESTIONS).toHaveLength(28);

    for (const entry of PAX_MODULES) {
      const dedicated = PAX_QUESTIONS.filter(
        (question) => question.paxModule === entry.code,
      );
      expect(dedicated).toHaveLength(2);
      for (const question of dedicated) {
        expect(question.track).toBe(entry.track);
        expect(question.options).toHaveLength(4);
        expect(question.answer).toBeGreaterThanOrEqual(0);
        expect(question.answer).toBeLessThan(4);
        expect(nonEmpty(question.explanation)).toBe(true);
        expect(nonEmpty(question.reference)).toBe(true);
      }
    }
  });

  test("PAX questions are part of the live Knowledge Gym bank", () => {
    const bankIds = new Set(ACADEMY_QUESTIONS.map((question) => question.id));
    for (const question of PAX_QUESTIONS) {
      expect(bankIds.has(question.id)).toBe(true);
      expect(question.paxModule).toBeDefined();
      expect(PAX_MODULE_ORDER).toContain(question.paxModule as PaxModuleCode);
    }
    expect(paxQuestions()).toHaveLength(PAX_QUESTIONS.length);
  });

  test("existing-question mappings resolve to real bank questions", () => {
    const bankIds = new Set(ACADEMY_QUESTIONS.map((question) => question.id));
    const issues: string[] = [];

    for (const entry of PAX_MODULES) {
      const mapped = PAX_EXISTING_QUESTION_IDS[entry.code];
      expect(mapped).toBeDefined();
      for (const id of mapped) {
        if (!bankIds.has(id)) issues.push(`${entry.code}: unknown question ${id}`);
      }
    }

    expect(issues).toEqual([]);
  });

  test("module drills are de-duplicated and contain only real questions", () => {
    for (const entry of PAX_MODULES) {
      const questions = paxModuleQuestions(entry.code);
      const ids = questions.map((question) => question.id);

      expect(questions.length).toBeGreaterThanOrEqual(2);
      expect(new Set(ids).size).toBe(ids.length);
      for (const question of questions) {
        expect(
          question.paxModule === entry.code ||
            PAX_EXISTING_QUESTION_IDS[entry.code].includes(question.id),
        ).toBe(true);
      }
    }

    expect(paxModuleByCode("PAX 06").title).toContain("Check-In");
    expect(() => paxModuleByCode("PAX 99" as PaxModuleCode)).toThrow();
  });
});

describe("AHM 1110 pathway progress", () => {
  test("an empty gym starts at zero and points to GEN 01", () => {
    const progress = paxPathwayProgress(emptyAcademyStats());

    expect(progress.total).toBe(ALL_MODULE_QUESTION_IDS.length);
    expect(progress.answered).toBe(0);
    expect(progress.correct).toBe(0);
    expect(progress.mastery).toBe(0);
    expect(progress.completed).toBe(0);
    expect(progress.next?.code).toBe("GEN 01");
    expect(progress.stages).toHaveLength(3);
    expect(progress.stages.map((stage) => stage.stage)).toEqual(PAX_STAGES);
    expect(progress.stages.every((stage) => stage.total > 0)).toBe(true);
    expect(progress.stages.every((stage) => stage.mastery === 0)).toBe(true);
    expect(nextPaxModule(emptyAcademyStats())?.code).toBe("GEN 01");
  });

  test("answering a module's questions correctly marks the step complete", () => {
    for (const entry of PAX_MODULES) {
      const ids = paxModuleQuestions(entry.code).map((question) => question.id);
      const progress = paxModuleProgress(statsWith(ids), entry.code);

      expect(progress.total).toBe(ids.length);
      expect(progress.correct).toBe(ids.length);
      expect(progress.mastery).toBe(100);
      expect(progress.complete).toBe(true);
    }
  });

  test("the mastery threshold is enforced and partial credit is tracked", () => {
    const questions = paxModuleQuestions("PAX 06");
    const needed = Math.ceil((PAX_MASTERY_THRESHOLD / 100) * questions.length);
    const shortIds = questions.slice(0, Math.max(0, needed - 1)).map((question) => question.id);

    const short = paxModuleProgress(statsWith(shortIds), "PAX 06");
    expect(short.correct).toBe(shortIds.length);
    expect(short.complete).toBe(needed === 0);

    const justEnough = questions.slice(0, needed).map((question) => question.id);
    const passing = paxModuleProgress(statsWith(justEnough), "PAX 06");
    expect(passing.mastery).toBeGreaterThanOrEqual(PAX_MASTERY_THRESHOLD);
    expect(passing.complete).toBe(true);
  });

  test("a fully mastered pathway completes every module and has no next step", () => {
    const progress = paxPathwayProgress(statsWith(ALL_MODULE_QUESTION_IDS));

    expect(progress.correct).toBe(progress.total);
    expect(progress.mastery).toBe(100);
    expect(progress.completed).toBe(PAX_MODULES.length);
    expect(progress.stages.every((stage) => stage.mastery === 100)).toBe(true);
    expect(progress.next).toBeNull();
    expect(nextPaxModule(statsWith(ALL_MODULE_QUESTION_IDS))).toBeNull();
  });

  test("progress advances to the first incomplete module", () => {
    const genIds = paxModuleQuestions("GEN 01").map((question) => question.id);
    const progress = paxPathwayProgress(statsWith(genIds));

    expect(progress.modules[0].complete).toBe(true);
    expect(progress.completed).toBeGreaterThanOrEqual(1);
    expect(progress.next?.code).toBe("PAX 01");
  });

  test("the pathway badge is registered and unlocks only at full completion", () => {
    expect(BADGES.some((badge) => badge.id === PAX_BADGE_ID)).toBe(true);
    expect(earnedPaxBadges(emptyAcademyStats())).toEqual([]);
    expect(earnedPaxBadges(statsWith(ALL_MODULE_QUESTION_IDS))).toEqual([PAX_BADGE_ID]);
  });
});

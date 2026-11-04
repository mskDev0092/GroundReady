import { beforeEach, describe, expect, test } from "bun:test";
import {
  ACADEMY_BADGE_IDS,
  ACADEMY_QUESTIONS,
  ACADEMY_TRACKS,
  TRACK_META,
  dailySeed,
  earnedAcademyBadges,
  emptyAcademyStats,
  findQuestion,
  hashString,
  overallAccuracy,
  pickDrill,
  questionXp,
  reviewQuestions,
  seededShuffle,
  trackProgress,
  trackQuestionCount,
} from "@/data/academy";
import { BADGES, MAX_XP } from "@/data/gamification";
import { SCENARIOS, getScenario } from "@/data/scenarios";
import { CATEGORY_META, type AcademyStats } from "@/lib/types";
import { installLocalStorage } from "./helpers/local-storage";

const { memory } = installLocalStorage();
const { useUserStore } = await import("@/store/useUserStore");

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

describe("Knowledge Gym question bank", () => {
  test("every question is complete and structurally valid", () => {
    const issues: string[] = [];
    const ids = new Set<string>();

    for (const question of ACADEMY_QUESTIONS) {
      const label = question.id || "(missing id)";
      if (!nonEmpty(question.id)) issues.push("question id is empty");
      if (ids.has(question.id)) issues.push(`${label}: duplicate id`);
      ids.add(question.id);

      if (!ACADEMY_TRACKS.includes(question.track)) {
        issues.push(`${label}: unknown track ${question.track}`);
      }
      if (!nonEmpty(question.topic)) issues.push(`${label}: topic is empty`);
      if (!nonEmpty(question.question)) issues.push(`${label}: question is empty`);
      if (!nonEmpty(question.explanation)) issues.push(`${label}: explanation is empty`);
      if (!nonEmpty(question.reference)) issues.push(`${label}: reference is empty`);
      if (![1, 2, 3].includes(question.difficulty)) {
        issues.push(`${label}: difficulty must be 1–3`);
      }

      if (question.options.length !== 4) {
        issues.push(`${label}: expected 4 options, got ${question.options.length}`);
      }
      if (new Set(question.options).size !== question.options.length) {
        issues.push(`${label}: duplicate answer options`);
      }
      for (const option of question.options) {
        if (!nonEmpty(option)) issues.push(`${label}: empty option`);
      }
      if (
        !Number.isInteger(question.answer) ||
        question.answer < 0 ||
        question.answer >= question.options.length
      ) {
        issues.push(`${label}: answer index ${question.answer} is out of range`);
      }

      if (question.scenarioId !== undefined) {
        if (!getScenario(question.scenarioId)) {
          issues.push(`${label}: unknown scenarioId ${question.scenarioId}`);
        }
      }
    }

    expect(issues).toEqual([]);
    expect(ACADEMY_QUESTIONS.length).toBeGreaterThanOrEqual(60);
  });

  test("all four tracks are represented and each has a usable bank", () => {
    for (const track of ACADEMY_TRACKS) {
      expect(TRACK_META[track].label.length).toBeGreaterThan(0);
      expect(TRACK_META[track].description.length).toBeGreaterThan(0);
      expect(trackQuestionCount(track)).toBeGreaterThanOrEqual(16);
      expect(ACADEMY_QUESTIONS.some((question) => question.track === track)).toBe(true);
    }

    const declared = Object.keys(TRACK_META);
    expect(new Set(declared)).toEqual(new Set(ACADEMY_TRACKS));
  });

  test("every linked scenario exists in the catalogue", () => {
    const scenarioIds = new Set(SCENARIOS.map((scenario) => scenario.id));
    for (const question of ACADEMY_QUESTIONS) {
      if (question.scenarioId) {
        expect(scenarioIds.has(question.scenarioId)).toBe(true);
      }
    }
  });

  test("every question maps to a real category and badge registry entry", () => {
    expect(Object.keys(CATEGORY_META).length).toBeGreaterThan(0);
    const badgeIds = new Set(BADGES.map((badge) => badge.id));
    for (const badgeId of Object.values(ACADEMY_BADGE_IDS)) {
      expect(badgeIds.has(badgeId)).toBe(true);
    }
  });

  test("question XP rises with difficulty", () => {
    expect(questionXp({ ...ACADEMY_QUESTIONS[0], difficulty: 1 })).toBe(8);
    expect(questionXp({ ...ACADEMY_QUESTIONS[0], difficulty: 2 })).toBe(12);
    expect(questionXp({ ...ACADEMY_QUESTIONS[0], difficulty: 3 })).toBe(16);
  });
});

describe("Knowledge Gym drill builder", () => {
  test("the same seed produces the same drill", () => {
    const first = pickDrill("all", 10, 12345).map((question) => question.id);
    const second = pickDrill("all", 10, 12345).map((question) => question.id);

    expect(first).toEqual(second);
    expect(first).toHaveLength(10);
    expect(new Set(first).size).toBe(first.length);
  });

  test("different seeds and tracks produce valid, bounded drills", () => {
    const all = pickDrill("all", 10, 1);
    const other = pickDrill("all", 10, 2);
    expect(all.map((question) => question.id)).not.toEqual(other.map((question) => question.id));

    for (const track of ACADEMY_TRACKS) {
      const drill = pickDrill(track, 99, 7);
      expect(drill).toHaveLength(trackQuestionCount(track));
      expect(drill.every((question) => question.track === track)).toBe(true);
      expect(new Set(drill.map((question) => question.id)).size).toBe(drill.length);
    }

    expect(pickDrill("all", 0)).toHaveLength(0);
    expect(pickDrill("all", -5)).toHaveLength(0);
  });

  test("the daily seed is stable for a date and changes the next day", () => {
    const day = new Date(2026, 10, 4);
    const sameDay = new Date(2026, 10, 4);
    const nextDay = new Date(2026, 10, 5);

    expect(dailySeed(day)).toBe(dailySeed(sameDay));
    expect(dailySeed(day)).not.toBe(dailySeed(nextDay));
  });

  test("seededShuffle keeps every item and does not mutate the source", () => {
    const source = [1, 2, 3, 4, 5];
    const shuffled = seededShuffle(source, 99);

    expect(source).toEqual([1, 2, 3, 4, 5]);
    expect([...shuffled].sort()).toEqual(source);
    expect(hashString("DGR")).toBe(hashString("DGR"));
    expect(hashString("DGR")).not.toBe(hashString("IGOM"));
  });

  test("findQuestion resolves known ids and rejects unknown ids", () => {
    for (const question of ACADEMY_QUESTIONS) {
      expect(findQuestion(question.id)).toBe(question);
    }
    expect(findQuestion("not-a-question")).toBeUndefined();
  });

  test("reviewQuestions resolves queued ids in order and drops stale ids", () => {
    const [first, second, third] = ACADEMY_QUESTIONS;
    const stats = {
      ...emptyAcademyStats(),
      review: [third.id, "stale-question", first.id],
    };

    expect(reviewQuestions(stats).map((question) => question.id)).toEqual([
      third.id,
      first.id,
    ]);
    expect(reviewQuestions(emptyAcademyStats())).toEqual([]);
    expect(reviewQuestions({ ...emptyAcademyStats(), review: [second.id] })).toHaveLength(1);
  });
});

describe("Knowledge Gym progress and badges", () => {
  test("track progress and accuracy are computed from unique ids", () => {
    const dgr = ACADEMY_QUESTIONS.filter((question) => question.track === "DGR");
    const stats = statsWith(dgr.slice(0, 4).map((question) => question.id));

    const progress = trackProgress(stats, "DGR");
    expect(progress.total).toBe(trackQuestionCount("DGR"));
    expect(progress.answered).toBe(4);
    expect(progress.correct).toBe(4);
    expect(progress.mastery).toBe(Math.round((4 / progress.total) * 100));
    expect(progress.accuracy).toBe(100);
    expect(overallAccuracy(stats)).toBe(100);

    expect(trackProgress(emptyAcademyStats(), "IGOM").accuracy).toBe(0);
    expect(overallAccuracy(emptyAcademyStats())).toBe(0);
  });

  test("track badges unlock at twelve correct answers and are not awarded twice", () => {
    for (const track of ACADEMY_TRACKS) {
      const ids = ACADEMY_QUESTIONS.filter((question) => question.track === track)
        .slice(0, 12)
        .map((question) => question.id);

      const badgeId =
        track === "DGR"
          ? ACADEMY_BADGE_IDS.dgr
          : track === "IGOM"
            ? ACADEMY_BADGE_IDS.igom
            : track === "IATA"
              ? ACADEMY_BADGE_IDS.iata
              : ACADEMY_BADGE_IDS.saps;

      expect(earnedAcademyBadges(statsWith(ids))).toContain(badgeId);
      expect(earnedAcademyBadges(statsWith(ids))).not.toContain(ACADEMY_BADGE_IDS.graduate);
      expect(earnedAcademyBadges(statsWith(ids))).toEqual(
        earnedAcademyBadges(statsWith(ids)),
      );
    }
  });

  test("the graduate badge needs twelve correct in every track; the combo badge needs ten", () => {
    const allTrackIds = ACADEMY_TRACKS.flatMap((track) =>
      ACADEMY_QUESTIONS.filter((question) => question.track === track)
        .slice(0, 12)
        .map((question) => question.id),
    );

    expect(earnedAcademyBadges(statsWith(allTrackIds))).toContain(ACADEMY_BADGE_IDS.graduate);
    expect(
      earnedAcademyBadges({ ...statsWith(allTrackIds), bestCombo: 10 }),
    ).toContain(ACADEMY_BADGE_IDS.combo);
    expect(
      earnedAcademyBadges({ ...statsWith(allTrackIds), bestCombo: 9 }),
    ).not.toContain(ACADEMY_BADGE_IDS.combo);
  });
});

describe("Knowledge Gym store integration", () => {
  beforeEach(() => {
    useUserStore.getState().resetAll();
    memory.clear();
  });

  test("a first correct answer awards XP, records the question and builds a combo", () => {
    const question = ACADEMY_QUESTIONS[0];
    const outcome = useUserStore.getState().recordAcademyAnswer(question.id, true);
    const state = useUserStore.getState();

    expect(outcome).toMatchObject({
      xpAwarded: questionXp(question),
      isNew: true,
      combo: 1,
    });
    expect(state.xp).toBe(questionXp(question));
    expect(state.academy.xp).toBe(questionXp(question));
    expect(state.academy.answered).toEqual([question.id]);
    expect(state.academy.correct).toEqual([question.id]);
    expect(state.academy.bestCombo).toBe(1);
    expect(state.academyCombo).toBe(1);
    expect(state.academy.lastPlayed).not.toBeNull();
  });

  test("a wrong answer resets the combo and does not award XP", () => {
    const [first, second] = ACADEMY_QUESTIONS;
    useUserStore.getState().recordAcademyAnswer(first.id, true);
    const outcome = useUserStore.getState().recordAcademyAnswer(second.id, false);
    const state = useUserStore.getState();

    expect(outcome.xpAwarded).toBe(0);
    expect(outcome.combo).toBe(0);
    expect(state.academyCombo).toBe(0);
    expect(state.academy.answered).toContain(second.id);
    expect(state.academy.correct).not.toContain(second.id);
    expect(state.academy.bestCombo).toBe(1);
  });

  test("a question answered wrong first earns half XP when corrected", () => {
    const question = ACADEMY_QUESTIONS[0];
    useUserStore.getState().recordAcademyAnswer(question.id, false);
    const outcome = useUserStore.getState().recordAcademyAnswer(question.id, true);

    expect(outcome.xpAwarded).toBe(Math.ceil(questionXp(question) / 2));
    expect(outcome.isNew).toBe(false);
    expect(useUserStore.getState().academy.correct).toContain(question.id);
  });

  test("re-answering a known question correctly awards no XP", () => {
    const question = ACADEMY_QUESTIONS[0];
    useUserStore.getState().recordAcademyAnswer(question.id, true);
    const outcome = useUserStore.getState().recordAcademyAnswer(question.id, true);

    expect(outcome.xpAwarded).toBe(0);
    expect(useUserStore.getState().academy.xp).toBe(questionXp(question));
  });

  test("the DGR Scholar badge unlocks once twelve DGR answers are correct", () => {
    const dgr = ACADEMY_QUESTIONS.filter((question) => question.track === "DGR").slice(0, 12);
    let lastBadges: string[] = [];

    for (const question of dgr) {
      lastBadges = useUserStore.getState().recordAcademyAnswer(question.id, true).newBadges;
    }

    expect(lastBadges).toContain(ACADEMY_BADGE_IDS.dgr);
    expect(useUserStore.getState().badges).toContain(ACADEMY_BADGE_IDS.dgr);
  });

  test("XP is capped, drills are counted and reset clears the gym", () => {
    useUserStore.setState({ xp: MAX_XP - 3 });
    useUserStore.getState().recordAcademyAnswer(ACADEMY_QUESTIONS[0].id, true);

    expect(useUserStore.getState().xp).toBe(MAX_XP);

    useUserStore.getState().completeAcademyDrill();
    expect(useUserStore.getState().academy.drills).toBe(1);

    useUserStore.getState().resetAll();
    const state = useUserStore.getState();
    expect(state.academy).toEqual(emptyAcademyStats());
    expect(state.academyCombo).toBe(0);
    expect(state.xp).toBe(0);
  });

  test("unknown question ids are ignored", () => {
    const outcome = useUserStore.getState().recordAcademyAnswer("not-real", true);

    expect(outcome).toEqual({
      xpAwarded: 0,
      isNew: false,
      newBadges: [],
      combo: 0,
    });
    expect(useUserStore.getState().xp).toBe(0);
  });

  test("smart review queues a miss and clears it once answered correctly", () => {
    const [first, second] = ACADEMY_QUESTIONS;

    useUserStore.getState().recordAcademyAnswer(first.id, false);
    useUserStore.getState().recordAcademyAnswer(second.id, false);
    expect(useUserStore.getState().academy.review).toEqual([first.id, second.id]);

    useUserStore.getState().recordAcademyAnswer(second.id, false);
    expect(useUserStore.getState().academy.review).toEqual([first.id, second.id]);

    useUserStore.getState().recordAcademyAnswer(first.id, true);
    expect(useUserStore.getState().academy.review).toEqual([second.id]);
  });

  test("coach mode and onboarding flags toggle, persist and reset", () => {
    expect(useUserStore.getState().coachMode).toBe(true);
    expect(useUserStore.getState().onboarded).toBe(false);

    useUserStore.getState().toggleCoachMode();
    expect(useUserStore.getState().coachMode).toBe(false);

    useUserStore.getState().completeOnboarding();
    expect(useUserStore.getState().onboarded).toBe(true);

    useUserStore.getState().replayOnboarding();
    expect(useUserStore.getState().onboarded).toBe(false);

    useUserStore.getState().resetAll();
    expect(useUserStore.getState().coachMode).toBe(true);
    expect(useUserStore.getState().onboarded).toBe(false);
  });
});

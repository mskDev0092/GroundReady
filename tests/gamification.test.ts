import { describe, expect, test } from "bun:test";
import { BADGES, LEVELS, MAX_XP, badgeById, levelFromXp, nextLevel } from "@/data/gamification";

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

describe("Level ladder", () => {
  test("levels are ordered, unique and start at zero XP", () => {
    expect(LEVELS.length).toBeGreaterThan(0);
    expect(LEVELS[0].level).toBe(1);
    expect(LEVELS[0].minXp).toBe(0);
    expect(new Set(LEVELS.map((level) => level.level)).size).toBe(LEVELS.length);
    expect(new Set(LEVELS.map((level) => level.minXp)).size).toBe(LEVELS.length);

    for (let index = 1; index < LEVELS.length; index++) {
      expect(LEVELS[index].level).toBe(LEVELS[index - 1].level + 1);
      expect(LEVELS[index].minXp).toBeGreaterThan(LEVELS[index - 1].minXp);
    }
  });

  test("every level has a title and sits within the XP cap", () => {
    for (const level of LEVELS) {
      expect(nonEmpty(level.title)).toBe(true);
      expect(level.minXp).toBeGreaterThanOrEqual(0);
      expect(level.minXp).toBeLessThanOrEqual(MAX_XP);
    }
  });

  test("levelFromXp resolves the exact boundaries", () => {
    const expectations: Array<[number, number]> = [
      [0, 1],
      [249, 1],
      [250, 2],
      [699, 2],
      [700, 3],
      [1249, 3],
      [1250, 4],
      [1999, 4],
      [2000, 5],
      [2999, 5],
      [3000, 6],
      [3599, 6],
      [3600, 7],
      [MAX_XP, 7],
    ];

    for (const [xp, level] of expectations) {
      expect(levelFromXp(xp).level).toBe(level);
    }
  });

  test("levelFromXp treats negative XP as level 1 and huge XP as the top level", () => {
    expect(levelFromXp(-100).level).toBe(1);
    expect(levelFromXp(MAX_XP + 10_000).level).toBe(LEVELS[LEVELS.length - 1].level);
  });

  test("nextLevel returns the following level or null at the top", () => {
    expect(nextLevel(0)?.level).toBe(2);
    expect(nextLevel(249)?.level).toBe(2);
    expect(nextLevel(250)?.level).toBe(3);
    expect(nextLevel(1249)?.level).toBe(4);
    expect(nextLevel(2000)?.level).toBe(6);
    expect(nextLevel(3000)?.level).toBe(7);
    expect(nextLevel(3600)).toBeNull();
    expect(nextLevel(MAX_XP + 1)).toBeNull();
  });
});

describe("Badge registry", () => {
  test("badge ids are unique and every field is populated", () => {
    const ids = BADGES.map((badge) => badge.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const badge of BADGES) {
      expect(nonEmpty(badge.id)).toBe(true);
      expect(nonEmpty(badge.name)).toBe(true);
      expect(nonEmpty(badge.icon)).toBe(true);
      expect(nonEmpty(badge.description)).toBe(true);
      expect(nonEmpty(badge.requirement)).toBe(true);
    }
  });

  test("badgeById resolves known ids and rejects unknown ones", () => {
    for (const badge of BADGES) {
      expect(badgeById(badge.id)).toBe(badge);
    }
    expect(badgeById("no-such-badge")).toBeUndefined();
  });
});

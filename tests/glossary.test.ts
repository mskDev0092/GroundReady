import { describe, expect, test } from "bun:test";
import {
  GLOSSARY,
  GLOSSARY_CATEGORIES,
  GLOSSARY_CATEGORY_LABELS,
  searchGlossary,
  termOfTheDay,
} from "@/data/glossary";
import { getScenario } from "@/data/scenarios";
import type { GlossaryCategory } from "@/lib/types";

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

describe("Glossary content", () => {
  test("every term is complete and unique", () => {
    const issues: string[] = [];
    const ids = new Set<string>();
    const terms = new Set<string>();

    for (const item of GLOSSARY) {
      if (!nonEmpty(item.id)) issues.push("term id is empty");
      if (ids.has(item.id)) issues.push(`${item.term}: duplicate id`);
      ids.add(item.id);

      if (!nonEmpty(item.term)) issues.push(`${item.id}: term is empty`);
      if (terms.has(item.term.toLowerCase())) issues.push(`${item.term}: duplicate term name`);
      terms.add(item.term.toLowerCase());

      if (!nonEmpty(item.expansion)) issues.push(`${item.id}: expansion is empty`);
      if (!nonEmpty(item.plain)) issues.push(`${item.id}: plain explanation is empty`);
      if (!nonEmpty(item.example)) issues.push(`${item.id}: example is empty`);
      if (!GLOSSARY_CATEGORIES.includes(item.category)) {
        issues.push(`${item.id}: unknown category ${item.category}`);
      }
      if (item.plain.length < 30) issues.push(`${item.id}: plain explanation is too short`);
      if (item.scenarioId && !getScenario(item.scenarioId)) {
        issues.push(`${item.id}: unknown scenarioId ${item.scenarioId}`);
      }
    }

    expect(issues).toEqual([]);
  });

  test("the glossary is broad enough to help a beginner", () => {
    expect(GLOSSARY.length).toBeGreaterThanOrEqual(35);
    for (const category of GLOSSARY_CATEGORIES) {
      expect(GLOSSARY.some((item) => item.category === category)).toBe(true);
      expect(nonEmpty(GLOSSARY_CATEGORY_LABELS[category])).toBe(true);
    }
  });

  test("search matches term, expansion, meaning and category", () => {
    const byCode = searchGlossary("LMC");
    expect(byCode.some((item) => item.term === "LMC")).toBe(true);

    const byMeaning = searchGlossary("wheelchair");
    expect(byMeaning.length).toBeGreaterThan(0);

    const byExpansion = searchGlossary("Dangerous Goods Regulations");
    expect(byExpansion.some((item) => item.term === "DGR")).toBe(true);

    const filtered = searchGlossary("", "IGOM");
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((item) => item.category === "IGOM")).toBe(true);

    expect(searchGlossary("no-such-term-anywhere")).toEqual([]);
    expect(searchGlossary("", "all")).toHaveLength(GLOSSARY.length);
  });

  test("term of the day is stable per date and changes across days", () => {
    const day = new Date(2026, 10, 4);
    const sameDay = new Date(2026, 10, 4);
    const nextDay = new Date(2026, 10, 5);

    expect(termOfTheDay(day)).toBe(GLOSSARY[(2026 * 372 + 11 * 31 + 4) % GLOSSARY.length]);
    expect(termOfTheDay(day)).toBe(termOfTheDay(sameDay));
    expect(new Set([termOfTheDay(day).id, termOfTheDay(nextDay).id]).size).toBe(2);
  });

  test("every category used by the glossary has a plain label", () => {
    for (const category of GLOSSARY_CATEGORIES) {
      const label = GLOSSARY_CATEGORY_LABELS[category as GlossaryCategory];
      expect(label.length).toBeGreaterThan(0);
    }
  });
});

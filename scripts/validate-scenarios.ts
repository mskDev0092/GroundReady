/**
 * Validates the scenario catalog:
 * 1. Every expected command matches its own canonical display (whitespace-normalized).
 * 2. Every scenario's max points sum to 100.
 * 3. Every dialogue/decision step has exactly one best option with points > 0.
 * 4. Badge ids referenced exist; category ids are valid.
 */
import { SCENARIOS, scenarioMaxPoints } from "../src/data/scenarios";
import { normalizeEntry } from "../src/lib/altea";
import { BADGES } from "../src/data/gamification";
import { CATEGORY_META, type DecisionStep, type DialogueStep } from "../src/lib/types";

let failures = 0;
const fail = (msg: string) => {
  failures++;
  console.error("  ✗ " + msg);
};

for (const s of SCENARIOS) {
  console.log(`\n[${s.code}] ${s.title}`);
  if (!CATEGORY_META[s.category]) fail(`unknown category ${s.category}`);
  if (s.badgeId && !BADGES.some((b) => b.id === s.badgeId)) fail(`unknown badge ${s.badgeId}`);

  const total = scenarioMaxPoints(s);
  console.log(`  max points: ${total}`);
  if (total !== 100) fail(`total points ${total} != 100`);

  for (const step of s.steps) {
    if (step.type === "terminal") {
      for (const c of step.commands) {
        const ok = new RegExp(c.pattern).test(normalizeEntry(c.display));
        console.log(`  ${ok ? "✓" : "✗"} ${c.display}`);
        if (!ok) fail(`command display "${c.display}" fails its own pattern "${c.pattern}"`);
        if (c.points <= 0) fail(`command ${c.display} has 0 points`);
        if (c.output.length === 0) fail(`command ${c.display} has no output`);
      }
    } else {
      const bests = step.options.filter((o) => o.best);
      if (bests.length !== 1)
        fail(`${step.id} has ${bests.length} best options (expected 1)`);
      const bestPts = Math.max(...step.options.map((o) => o.points));
      if (bestPts <= 0) fail(`${step.id} best points must be > 0`);
      for (const o of step.options) {
        if (!o.feedback) fail(`${step.id}/${o.id} missing feedback`);
      }
      const best = bests[0];
      if (best && best.points !== bestPts)
        fail(`${step.id} best flag not on highest-point option`);
    }
  }
}

console.log(
  failures === 0 ? "\nALL SCENARIO CHECKS PASSED ✓" : `\n${failures} FAILURES ✗`,
);
process.exit(failures === 0 ? 0 : 1);

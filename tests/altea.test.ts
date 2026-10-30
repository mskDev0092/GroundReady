import { describe, expect, test } from "bun:test";
import {
  GENERIC_COMMANDS,
  autocomplete,
  commandPoints,
  evaluateEntry,
  matchesCommand,
  normalizeEntry,
  stepVocabulary,
  suggestCorrection,
  type CommandAttemptState,
} from "@/lib/altea";
import type { ExpectedCommand, TerminalStep } from "@/lib/types";

function command(overrides: Partial<ExpectedCommand> = {}): ExpectedCommand {
  return {
    pattern: "^PD/LHEISB/24OCT$",
    display: "PD/LHEISB/24OCT",
    hint: "Passenger Display — flight level view",
    output: ["FLIGHT: PK 652  LHE-ISB  STATUS: OPEN"],
    points: 10,
    ...overrides,
  };
}

function attempt(overrides: Partial<CommandAttemptState> = {}): CommandAttemptState {
  return { attempts: 0, hintUsed: false, done: false, ...overrides };
}

describe("Altea command normalisation", () => {
  test("uppercases and strips every whitespace character", () => {
    expect(normalizeEntry(" pd / lheisb / 24oct ")).toBe("PD/LHEISB/24OCT");
    expect(normalizeEntry("a\tb\nc  d")).toBe("ABCD");
    expect(normalizeEntry("")).toBe("");
  });

  test("matches commands case- and whitespace-insensitively", () => {
    const cmd = command();
    expect(matchesCommand("pd/lheisb/24oct", cmd)).toBe(true);
    expect(matchesCommand("  PD / LHEISB / 24OCT  ", cmd)).toBe(true);
    expect(matchesCommand("PD/LHEBHX/24OCT", cmd)).toBe(false);
  });

  test("treats regex metacharacters literally when escaped", () => {
    const dgr = command({
      display: "SR ICE-P1/2.5KG",
      pattern: "^SRICE-P1/2\\.5KG$",
    });
    expect(matchesCommand("sr ice-p1/2.5kg", dgr)).toBe(true);
    expect(matchesCommand("sr ice-p1/2X5kg", dgr)).toBe(false);
  });
});

describe("Altea entry evaluation", () => {
  const pending = command();
  const later = command({
    display: "RT/CHOUDHRY",
    pattern: "^RT/CHOUDHRY$",
    points: 8,
  });

  test("rejects empty entries and intercepts HELP/CLEAR", () => {
    const empty = evaluateEntry("", pending, []);
    expect(empty.kind).toBe("invalid");
    if (empty.kind === "invalid") expect(empty.message).toContain("EMPTY ENTRY");

    expect(evaluateEntry("help", pending, [])).toEqual({
      kind: "invalid",
      message: "__HELP__",
    });
    expect(evaluateEntry(" clear ", pending, [])).toEqual({
      kind: "invalid",
      message: "__CLEAR__",
    });
  });

  test("accepts the pending command in any case / spacing", () => {
    expect(evaluateEntry(" pd / lheisb / 24oct ", pending, [later])).toEqual({
      kind: "ok",
      cmd: pending,
    });
  });

  test("flags a later command of the same step as a sequence error", () => {
    const outcome = evaluateEntry("rt/choudhry", pending, [later]);
    expect(outcome.kind).toBe("sequence");
    if (outcome.kind === "sequence") {
      expect(outcome.suggestion).toBe(later);
      expect(outcome.message).toContain("SEQUENCE ERROR");
      expect(outcome.message).toContain(later.display);
    }
  });

  test("flags a command from another step as out of scope", () => {
    const external = command({
      display: "FCL/LHEKHI/24OCT",
      pattern: "^FCL/LHEKHI/24OCT$",
    });
    const outcome = evaluateEntry(
      "fcl/lhekhi/24oct",
      pending,
      [],
      [{ cmd: external, label: "Module 10 — Last Seat Standing" }],
    );

    expect(outcome.kind).toBe("sequence");
    if (outcome.kind === "sequence") {
      expect(outcome.suggestion).toBe(external);
      expect(outcome.message).toContain("OUT OF SCOPE");
      expect(outcome.message).toContain("Module 10 — Last Seat Standing");
    }
  });

  test("distinguishes format errors from unrelated commands", () => {
    const format = evaluateEntry("PD/LHEBHX/24OCT", pending, []);
    expect(format.kind).toBe("invalid");
    if (format.kind === "invalid") {
      expect(format.message).toContain("FORMAT ERROR");
      expect(format.suggestion).toBe(pending);
    }

    const unrelated = evaluateEntry("ZZZZZZ", pending, []);
    expect(unrelated.kind).toBe("invalid");
    if (unrelated.kind === "invalid") {
      expect(unrelated.message).toContain("INVALID COMMAND");
      expect(unrelated.suggestion).toBeUndefined();
    }
  });
});

describe("Altea correction suggestions", () => {
  const pending = command();
  const later = command({
    display: "RT/CHOUDHRY",
    pattern: "^RT/CHOUDHRY$",
  });

  test("returns the closest command above the similarity threshold", () => {
    expect(suggestCorrection("PD/LHEISB/24OC", [pending])).toBe(pending);
    expect(suggestCorrection("RT/CHOUDHR", [pending, later])).toBe(later);
  });

  test("returns undefined when nothing is close enough", () => {
    expect(suggestCorrection("ZZZZ", [pending, later])).toBeUndefined();
    expect(suggestCorrection("", [pending, later])).toBeUndefined();
  });
});

describe("Altea scoring", () => {
  const cmd = command({ points: 10 });

  test("a clean first entry earns full points", () => {
    expect(commandPoints(cmd, attempt())).toBe(10);
  });

  test("failed attempts cost 15% each, capped at 45%", () => {
    expect(commandPoints(cmd, attempt({ attempts: 1 }))).toBe(9);
    expect(commandPoints(cmd, attempt({ attempts: 2 }))).toBe(7);
    expect(commandPoints(cmd, attempt({ attempts: 3 }))).toBe(6);
    expect(commandPoints(cmd, attempt({ attempts: 50 }))).toBe(6);
  });

  test("using a hint costs 40%", () => {
    expect(commandPoints(cmd, attempt({ hintUsed: true }))).toBe(6);
    expect(commandPoints(cmd, attempt({ attempts: 1, hintUsed: true }))).toBe(5);
  });

  test("never drops below the 15% floor or below zero", () => {
    expect(commandPoints(cmd, attempt({ attempts: 3, hintUsed: true }))).toBe(2);
    expect(commandPoints(command({ points: 1 }), attempt({ attempts: 3, hintUsed: true }))).toBe(0);
  });

  test("a completed state does not change an otherwise clean score", () => {
    expect(commandPoints(cmd, attempt({ done: true }))).toBe(10);
  });
});

describe("Altea vocabulary and autocomplete", () => {
  const step: TerminalStep = {
    type: "terminal",
    id: "t1",
    prompt: "Retrieve the passenger",
    intro: "Terminal ready",
    commands: [
      command(),
      command({ display: "RT/CHOUDHRY", pattern: "^RT/CHOUDHRY$" }),
    ],
  };

  test("stepVocabulary lists every command display in order", () => {
    expect(stepVocabulary(step)).toEqual(["PD/LHEISB/24OCT", "RT/CHOUDHRY"]);
  });

  test("returns null for empty input and unknown prefixes", () => {
    expect(autocomplete("", ["PD", "PDX"])).toBeNull();
    expect(autocomplete("   ", ["PD", "PDX"])).toBeNull();
    expect(autocomplete("ZZ", ["PD", "PDX"])).toBeNull();
  });

  test("completes a single match without cycling", () => {
    expect(autocomplete("pd/lheisb/24oct", ["PD/LHEISB/24OCT"])).toEqual({
      value: "PD/LHEISB/24OCT",
      cycled: false,
    });
  });

  test("cycles through multiple matches in both directions", () => {
    const vocab = ["PD", "PDX", "PDY"];
    expect(autocomplete("PD", vocab)).toEqual({ value: "PDX", cycled: true });
    expect(autocomplete("PD", vocab, false)).toEqual({ value: "PDY", cycled: true });
    expect(autocomplete("p", vocab)).toEqual({ value: "PD", cycled: true });
    expect(autocomplete("p", vocab, false)).toEqual({ value: "PDX", cycled: true });
  });

  test("ignores case and whitespace in autocomplete input", () => {
    expect(autocomplete("  pd ", ["PD", "PDX", "PDY"])).toEqual({
      value: "PDX",
      cycled: true,
    });
  });
});

describe("Generic command list", () => {
  test("every generic command has a display and description", () => {
    expect(GENERIC_COMMANDS.length).toBeGreaterThan(0);
    for (const entry of GENERIC_COMMANDS) {
      expect(entry.display.trim().length).toBeGreaterThan(0);
      expect(entry.description.trim().length).toBeGreaterThan(0);
    }
  });

  test("generic command displays are unique and include HELP/CLEAR", () => {
    const displays = GENERIC_COMMANDS.map((entry) => entry.display);
    expect(new Set(displays).size).toBe(displays.length);
    expect(displays).toContain("HELP");
    expect(displays).toContain("CLEAR");
  });
});

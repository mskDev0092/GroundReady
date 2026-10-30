import type { ExpectedCommand, TerminalStep } from "@/lib/types";

/**
 * Alteá DCS command engine.
 * Alteá is tolerant of whitespace, so matching normalises the entry:
 * uppercase + all whitespace stripped before regex testing.
 */

export const GENERIC_COMMANDS = [
  { display: "HELP", description: "list the commands available in this scenario" },
  { display: "CLEAR", description: "clear the terminal screen" },
  { display: "PD/<citypair>/<DDMMM>", description: "Passenger Display — flight level view" },
  { display: "RT/<NAME>", description: "Retrieve passenger record by family name" },
  { display: "BAG/<n>/<kg>", description: "Enter bag pieces and weight" },
  { display: "SR <code>-<detail>", description: "Add Special Service Request" },
  { display: "PADD-<remark>", description: "Add remark to PNR (audit trail)" },
  { display: "TI CUSTOMS/<CC>", description: "TIMATIC customs lookup by country" },
  { display: "LI/STBY", description: "List standby passengers" },
  { display: "FCL/<citypair>/<DDMMM>", description: "Flight closure" },
  { display: "SEC/<NAME>/CLR", description: "Clear security flag (after AVSEC)" },
  { display: "BD/<citypair>/<DDMMM>-<seat>", description: "Board a passenger into seat" },
  { display: "EMD-EXC/<kg>/<amount>", description: "Issue Excess Baggage EMD" },
];

export function normalizeEntry(raw: string): string {
  return raw.toUpperCase().replace(/\s+/g, "");
}

/** Test a raw entry against the expected command (whitespace-insensitive). */
export function matchesCommand(raw: string, cmd: ExpectedCommand): boolean {
  const re = new RegExp(cmd.pattern);
  return re.test(normalizeEntry(raw));
}

export type SubmitOutcome =
  | { kind: "ok"; cmd: ExpectedCommand }
  | { kind: "sequence"; suggestion: ExpectedCommand; message: string }
  | { kind: "invalid"; message: string; suggestion?: ExpectedCommand };

/**
 * Evaluate an entry against the step's pending command.
 * - exact match on the pending command → ok
 * - matches a LATER command of the same step → sequence error (mild)
 * - matches command of another step (checked by caller via extraPatterns) → sequence error
 * - otherwise → invalid, with fuzzy suggestion
 */
export function evaluateEntry(
  raw: string,
  pending: ExpectedCommand,
  laterCommands: ExpectedCommand[],
  extraPatterns: { cmd: ExpectedCommand; label: string }[] = [],
): SubmitOutcome {
  const entry = normalizeEntry(raw);
  if (entry.length === 0) {
    return { kind: "invalid", message: "EMPTY ENTRY — TYPE A COMMAND OR HELP" };
  }
  if (entry === "HELP") return { kind: "invalid", message: "__HELP__" };
  if (entry === "CLEAR") return { kind: "invalid", message: "__CLEAR__" };

  if (matchesCommand(raw, pending)) return { kind: "ok", cmd: pending };

  const later = laterCommands.find((c) => matchesCommand(raw, c));
  if (later) {
    return {
      kind: "sequence",
      suggestion: later,
      message: `SEQUENCE ERROR — ${later.display} IS NOT VALID YET. COMPLETE THE PENDING ENTRY FIRST.`,
    };
  }
  const external = extraPatterns.find((p) => matchesCommand(raw, p.cmd));
  if (external) {
    return {
      kind: "sequence",
      suggestion: external.cmd,
      message: `OUT OF SCOPE — ${external.cmd.display} BELONGS TO: ${external.label}`,
    };
  }

  const suggestion = suggestCorrection(raw, [pending, ...laterCommands]);
  return {
    kind: "invalid",
    message: invalidMessage(raw, pending),
    suggestion,
  };
}

function invalidMessage(raw: string, pending: ExpectedCommand): string {
  const entry = normalizeEntry(raw);
  const base = normalizeEntry(pending.display).replace(/\s+/g, "");
  if (entry.startsWith(base.slice(0, 3))) {
    return `FORMAT ERROR — EXPECTED: ${pending.display}`;
  }
  return "INVALID COMMAND — CHECK SYNTAX OR TYPE HELP";
}

/** Cheap similarity: common-prefix ratio + token overlap on the command verb. */
export function suggestCorrection(
  raw: string,
  candidates: ExpectedCommand[],
): ExpectedCommand | undefined {
  const entry = normalizeEntry(raw);
  let best: { cmd?: ExpectedCommand; score: number } = { score: 0 };
  for (const c of candidates) {
    const disp = normalizeEntry(c.display);
    let common = 0;
    while (common < Math.min(entry.length, disp.length) && entry[common] === disp[common]) {
      common++;
    }
    const score = common / Math.max(entry.length, disp.length);
    if (score > best.score) best = { cmd: c, score };
  }
  return best.score >= 0.25 ? best.cmd : undefined;
}

/** All vocabulary for autocomplete in a terminal step. */
export function stepVocabulary(step: TerminalStep): string[] {
  const vocab = step.commands.map((c) => c.display);
  return vocab;
}

export interface CompleteResult {
  value: string;
  cycled: boolean;
}

/** Tab-complete `input` against vocabulary; cycles through matches. */
export function autocomplete(input: string, vocab: string[], forward = true): CompleteResult | null {
  const q = input.toUpperCase().replace(/\s+/g, "");
  if (!q) return null;
  const matches = vocab.filter((v) => normalizeEntry(v).startsWith(q));
  if (matches.length === 0) return null;
  if (matches.length === 1) return { value: matches[0], cycled: false };
  const idx = matches.findIndex((m) => normalizeEntry(m) === q);
  const next = forward ? (idx + 1) % matches.length : (idx - 1 + matches.length) % matches.length;
  return { value: matches[next], cycled: true };
}

/* ------------------------------ Scoring helpers ------------------------------ */

export interface CommandAttemptState {
  attempts: number;
  hintUsed: boolean;
  done: boolean;
}

/** Points for a command given attempts and hint usage. */
export function commandPoints(cmd: ExpectedCommand, st: CommandAttemptState): number {
  if (st.attempts === 0 && !st.hintUsed) return cmd.points;
  let factor = 1;
  factor -= 0.15 * Math.min(3, st.attempts); // each failed attempt -15%, max -45%
  if (st.hintUsed) factor -= 0.4;
  return Math.max(0, Math.round(cmd.points * Math.max(0.15, factor)));
}

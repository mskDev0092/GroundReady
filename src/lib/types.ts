/**
 * AltéaMaster — Core type definitions
 * Scenario engine, Alteá DCS terminal, dialogue branches and scoring.
 */

/* ---------------------------------- Categories ---------------------------------- */

export type ScenarioCategory =
  | "baggage-dgr"
  | "cargo-dgr"
  | "documentation"
  | "overbooking"
  | "gate-ops"
  | "special-pax"
  | "irrops"
  | "security"
  | "ramp-ops";

export const CATEGORY_META: Record<
  ScenarioCategory,
  { label: string; short: string; description: string }
> = {
  "baggage-dgr": {
    label: "Baggage & DGR",
    short: "BAG",
    description:
      "Liquids, dangerous goods, excess baggage and IATA DGR 2026 handling.",
  },
  "cargo-dgr": {
    label: "Cargo & DGR Acceptance",
    short: "CGO",
    description:
      "Shipper declarations, acceptance checklists, UN numbers, packing instructions and NOTOC.",
  },
  documentation: {
    label: "Documentation & Visas",
    short: "DOC",
    description:
      "TIMATIC lookups, travel documents, customs and biosecurity rules.",
  },
  overbooking: {
    label: "Overbooking & IDB",
    short: "IDB",
    description:
      "Oversold flights, standby priority, denied boarding and flight closure.",
  },
  "gate-ops": {
    label: "Gate Operations",
    short: "GTE",
    description:
      "Boarding gate security flags, SSSS protocol and departure control.",
  },
  "special-pax": {
    label: "Special & Medical",
    short: "SPX",
    description:
      "UMNR minors, PRM wheelchair handling, MEDA cases and pregnancy rules.",
  },
  irrops: {
    label: "Disruption & IRROPS",
    short: "IRR",
    description:
      "Cancellations, fog, rebooking cascades, care codes and re-protection.",
  },
  security: {
    label: "Security & Compliance",
    short: "SEC",
    description:
      "Document fraud detection, quiet escalation and ASF coordination.",
  },
  "ramp-ops": {
    label: "Ramp & IGOM",
    short: "RMP",
    description:
      "IATA IGOM turnaround, engine danger zones, FOD, GSE, loading and departure.",
  },
};

/* ---------------------------------- Passenger ---------------------------------- */

export interface PassengerProfile {
  name: string;
  age: number;
  nationality: string;
  passportNo: string;
  passportExpiry: string;
  pnr: string;
  ticketNo: string;
  flight: string;
  route: string;
  date: string;
  seat: string;
  fareClass: string;
  allowance: string;
  originStation: string; // where the simulation takes place (SAPS counter)
  avatarTone: "emerald" | "amber" | "rose" | "teal" | "violet" | "orange";
  visa?: string;
  freqFlyer?: string;
}

export interface BaggageItem {
  id: string;
  label: string;
  weightKg: number;
  type: "checked" | "cabin";
  tag?: string; // special tag code e.g. T-ZAM
  note?: string;
}

export interface DocField {
  key: string;
  label: string;
  value: string;
  highlight?: "ok" | "warn" | "bad";
}

export interface DocumentSet {
  passport?: DocField[];
  visa?: DocField[];
  ticket: DocField[];
  extra?: DocField[];
}

/* ---------------------------------- Dialogue ---------------------------------- */

export interface DialogueOption {
  id: string;
  /** What the trainee says / does */
  text: string;
  /** Points awarded (0 = wrong, full = best practice) */
  points: number;
  /** Instant coach feedback shown after selection */
  feedback: string;
  /** Passenger / system reaction after the choice */
  consequence?: string;
  best?: boolean;
}

export interface DialogueStep {
  type: "dialogue";
  id: string;
  /** Instruction strip above the choices */
  prompt: string;
  /** Passenger lines queued as chat messages before choices appear */
  passengerLines: string[];
  options: DialogueOption[];
}

/* ---------------------------------- Terminal ---------------------------------- */

export interface ExpectedCommand {
  /** Case-insensitive regex the trainee's entry must match */
  pattern: string;
  /** Canonical form displayed in hints / cheat-sheet */
  display: string;
  hint: string;
  /** Alteá-style response lines printed on success */
  output: string[];
  /** Extra nudge shown after a failed attempt */
  errorHint?: string;
  points: number;
}

export interface TerminalStep {
  type: "terminal";
  id: string;
  prompt: string;
  /** System message injected into the dialogue feed when the step opens */
  intro: string;
  commands: ExpectedCommand[];
}

/* ---------------------------------- Decision ---------------------------------- */

export type ActionIcon =
  | "supervisor"
  | "asf"
  | "emd"
  | "timatic"
  | "lrt"
  | "boarding-pass"
  | "scale"
  | "megaphone"
  | "handshake"
  | "clipboard"
  | "plane"
  | "lock"
  | "volunteer"
  | "list"
  | "clock"
  | "rebook"
  | "medic"
  | "wheelchair"
  | "child"
  | "hotel"
  | "meal"
  | "docs";

export interface DecisionOption {
  id: string;
  text: string;
  icon?: ActionIcon;
  points: number;
  feedback: string;
  consequence?: string;
  best?: boolean;
}

export interface DecisionStep {
  type: "decision";
  id: string;
  prompt: string;
  situation: string;
  options: DecisionOption[];
}

export type ScenarioStep = DialogueStep | TerminalStep | DecisionStep;

/* ---------------------------------- Scenario ---------------------------------- */

export interface RuleReference {
  source: string; // e.g. "IATA DGR 67th Ed. (2026)"
  ref: string; // e.g. "PI 954 — Dry ice, ventilated packaging"
  detail: string;
}

export interface Scenario {
  id: string;
  moduleNo: number;
  code: string;
  title: string;
  category: ScenarioCategory;
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  xpBase: number;
  minutes: number;
  /** Short intro shown on the scenario card */
  summary: string;
  /** Full situation briefing shown before the sim starts */
  briefing: string;
  objectives: string[];
  passenger: PassengerProfile;
  baggage: BaggageItem[];
  documents: DocumentSet;
  steps: ScenarioStep[];
  debriefRules: RuleReference[];
  checklist: string[];
  badgeId?: string;
}

/* ---------------------------------- Scoring ---------------------------------- */

export interface MistakeEntry {
  stepId: string;
  title: string;
  detail: string;
  pointsLost: number;
}

export interface ScenarioResult {
  scenarioId: string;
  earned: number;
  total: number;
  accuracy: number;
  xpAwarded: number;
  speedBonus: number;
  hintsUsed: number;
  mistakes: MistakeEntry[];
  durationSec: number;
  badgeUnlocked?: string;
}

/* ---------------------------------- Gamification ---------------------------------- */

export interface BadgeDef {
  id: string;
  name: string;
  icon: string; // emoji
  description: string;
  requirement: string;
}

export interface LevelDef {
  level: number;
  title: string;
  minXp: number;
}

export interface ScenarioProgress {
  bestAccuracy: number;
  attempts: number;
  totalXp: number;
  bestTimeSec: number | null;
  hintsUsed: number;
  completed: boolean;
  lastPlayed: string; // ISO date
}

/* ----------------------------------- Academy ---------------------------------- */

export type AcademyTrack = "DGR" | "IGOM" | "IATA" | "SAPS";

export interface AcademyQuestion {
  id: string;
  track: AcademyTrack;
  topic: string;
  /** 1 = foundation, 2 = operational, 3 = expert */
  difficulty: 1 | 2 | 3;
  question: string;
  /** Exactly four answer choices. */
  options: string[];
  /** Index into options for the correct answer. */
  answer: number;
  explanation: string;
  reference: string;
  /** Optional scenario that practises the same competency. */
  scenarioId?: string;
}

export interface AcademyStats {
  /** Unique question ids the trainee has attempted. */
  answered: string[];
  /** Unique question ids the trainee has answered correctly at least once. */
  correct: string[];
  /** XP earned inside the Knowledge Gym (also mirrored into total XP). */
  xp: number;
  bestCombo: number;
  drills: number;
  lastPlayed: string | null;
}

/* ---------------------------------- Session ---------------------------------- */

export type ViewName = "dashboard" | "scenarios" | "academy" | "sim" | "summary";

export interface ChatMessage {
  id: string;
  from: "passenger" | "system" | "trainee" | "coach";
  text: string;
  /** coach messages can be positive / negative */
  tone?: "ok" | "warn" | "bad";
}

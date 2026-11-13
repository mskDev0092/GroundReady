import { ACADEMY_QUESTIONS } from "./academy";
import type {
  AcademyQuestion,
  AcademyStats,
  PaxModule,
  PaxModuleCode,
  PaxStage,
} from "@/lib/types";

/**
 * IATA AHM 1110 passenger-handling pathway.
 *
 * The industry syllabus is presented as 14 learning modules (GEN 01 plus
 * PAX 01–14). Local operators may split PAX 09/10 or add a PAX 15; the pathway
 * keeps the common AHM labels and links each step to existing Knowledge Gym
 * drills and scenario modules.
 *
 * Training material only — never a substitute for the current operator manual,
 * carrier rules or station SOP.
 */

export const PAX_MODULES: PaxModule[] = [
  {
    code: "GEN 01",
    title: "Aviation Basics & Safety",
    stage: "Foundation",
    icon: "🛡️",
    covers:
      "Safety culture, the airport environment, Safety Management Systems, hazard reporting and the rules that apply to every ground role.",
    tellsTA:
      "Sets the safety mindset before you touch a passenger, a bag or a gate.",
    keyRules: [
      "If it is unsafe, stop and make it safe first.",
      "Report hazards and near-misses — not only injuries.",
      "Know your pass, your boundary and your escalation route.",
    ],
    track: "IGOM",
    scenarioIds: ["m18-igom-turnaround"],
  },
  {
    code: "PAX 01",
    title: "Passenger Services Safety",
    stage: "Foundation",
    icon: "🚦",
    covers:
      "Terminal safety, passenger-zone rules, access control, emergency routes and safe behaviour at counters and gates.",
    tellsTA:
      "Tells you how to work safely in the spaces where passengers and aircraft meet.",
    keyRules: [
      "Keep fire exits, routes and equipment clear.",
      "Never bypass access control, even under pressure.",
      "Stop unsafe behaviour early and escalate.",
    ],
    track: "SAPS",
    scenarioIds: ["m5-ssss", "m18-igom-turnaround"],
  },
  {
    code: "PAX 02",
    title: "Customer Service Training",
    stage: "Foundation",
    icon: "💬",
    covers:
      "Communication, difficult interactions, professional presentation, queue care and airline brand standards.",
    tellsTA:
      "Shapes how you calm a queue, de-escalate conflict and keep service consistent under stress.",
    keyRules: [
      "Acknowledge the problem before explaining the rule.",
      "Give one clear next step, not a speech.",
      "Escalate threats and abuse; never trade safety for service.",
    ],
    track: "SAPS",
    scenarioIds: ["m2-excess", "m15-fog"],
  },
  {
    code: "PAX 03",
    title: "Arrivals / Departures Training",
    stage: "Foundation",
    icon: "🛬",
    covers:
      "Inbound and outbound passenger flows, terminal navigation, gate/counter coordination and hand-offs.",
    tellsTA:
      "Shows you where passengers must go and which hand-offs keep the flow safe.",
    keyRules: [
      "Confirm the flight and terminal before directing anyone.",
      "Keep arrival and departure flows separated.",
      "Hand off to the responsible agency at the boundary.",
    ],
    track: "IATA",
    scenarioIds: ["m1-zamzam", "m11-noshow"],
  },
  {
    code: "PAX 04",
    title: "Baggage Claims & Settlement",
    stage: "Core",
    icon: "🧳",
    covers:
      "PIR creation, delayed, damaged and mishandled baggage, tracing basics and immediate customer remedies.",
    tellsTA:
      "Lets you process an arrival baggage problem without losing the passenger or the evidence.",
    keyRules: [
      "Create the PIR before promising anything.",
      "Capture the tag, PNR, description and contact details.",
      "Explain the claims route and keep the passenger updated.",
    ],
    track: "IATA",
    scenarioIds: ["m11-noshow", "m2-excess"],
  },
  {
    code: "PAX 05",
    title: "Baggage Services (Advanced)",
    stage: "Core",
    icon: "🔎",
    covers:
      "Baggage tracking systems, interline liability, customs requirements and settlement coordination.",
    tellsTA:
      "Gives you the trace-and-handover discipline behind every missing-bag case.",
    keyRules: [
      "Trace from the tag and the last scan.",
      "Keep the tag intact through interline handover.",
      "Record every handover and apply the carrier rules.",
    ],
    track: "IATA",
    scenarioIds: ["m11-noshow", "m7-cricket"],
  },
  {
    code: "PAX 06",
    title: "Check-In Training",
    stage: "Core",
    icon: "🛂",
    covers:
      "Passport, visa and health checks, TIMATIC, seat allocation, baggage acceptance, fare rules and DCS entries.",
    tellsTA:
      "Defines the legal and documentary gate that decides whether a passenger can fly.",
    keyRules: [
      "Check the person, the document and the destination rule.",
      "Use TIMATIC and the carrier's current policy.",
      "Never accept a passenger on a promise or a waiver.",
    ],
    track: "IATA",
    scenarioIds: ["m8-validity", "m9-namefix", "m3-dryice"],
  },
  {
    code: "PAX 07",
    title: "Irregular Operations (IRROPS)",
    stage: "Core",
    icon: "🌫️",
    covers:
      "Delays, cancellations, diversions, missed connections, rebooking, care and crowd control.",
    tellsTA:
      "Gives you the contingency sequence for the moment the schedule collapses.",
    keyRules: [
      "Communicate what is known and when the next update comes.",
      "Re-protect before you hand out care.",
      "Record vouchers, hotels and decisions.",
    ],
    track: "IATA",
    scenarioIds: ["m15-fog", "m4-overbook"],
  },
  {
    code: "PAX 08",
    title: "Passenger Assistance & PRM",
    stage: "Core",
    icon: "♿",
    covers:
      "PRM handling, wheelchairs, medical equipment, assistance animals and unaccompanied minors.",
    tellsTA:
      "Sets the custody and equipment chain for passengers who need help from curb to cabin.",
    keyRules: [
      "Confirm the SSR and the equipment before the passenger arrives.",
      "Hand over in person at every stage.",
      "Never break the UMNR custody chain.",
    ],
    track: "IATA",
    scenarioIds: ["m13-prm", "m12-umnr", "m14-meda"],
  },
  {
    code: "PAX 09/10",
    title: "Special Category Passengers & Gate Management",
    stage: "Advanced",
    icon: "🎫",
    covers:
      "VIPs, deportees, inadmissible passengers, medical cases, security-sensitive travellers and zone boarding.",
    tellsTA:
      "Tells you how to board sensitive passengers discreetly while keeping the gate flowing.",
    keyRules: [
      "Share sensitive information on a need-to-know basis.",
      "Confirm escort and documentation before boarding.",
      "Board by zone and control the gate line.",
    ],
    track: "IATA",
    scenarioIds: ["m5-ssss", "m10-idb", "m16-docfraud"],
  },
  {
    code: "PAX 11",
    title: "Transfer of Load Information",
    stage: "Advanced",
    icon: "⚖️",
    covers:
      "Gate-to-ramp communication, final passenger and bag figures, LMC and loadsheet discipline.",
    tellsTA:
      "Makes you the person who protects weight and balance with accurate final figures.",
    keyRules: [
      "The loadsheet must match the actual load.",
      "Any late change is an LMC — immediately.",
      "Reconcile passenger, bag and special-load figures.",
    ],
    track: "IGOM",
    scenarioIds: ["m18-igom-turnaround", "m11-noshow"],
  },
  {
    code: "PAX 12",
    title: "Transfer, Transit & Connections",
    stage: "Advanced",
    icon: "🔁",
    covers:
      "Connecting passengers and bags, MCT, transit lounges, short connections and misconnection recovery.",
    tellsTA:
      "Shows you how to rescue a tight connection before it becomes a missed flight and a lost bag.",
    keyRules: [
      "Check MCT and inbound status first.",
      "Expedite the passenger and tell the receiving gate.",
      "Track the bag as carefully as the passenger.",
    ],
    track: "IATA",
    scenarioIds: ["m11-noshow", "m7-cricket"],
  },
  {
    code: "PAX 13",
    title: "Dangerous Goods (Passenger Handling)",
    stage: "Advanced",
    icon: "☣️",
    covers:
      "Hidden dangerous goods, lithium batteries, power banks, aerosols, dry ice and passenger safety briefings.",
    tellsTA:
      "Gives you the interception reflex at check-in and the gate.",
    keyRules: [
      "Ask what is inside — never accept a vague description.",
      "Spare lithium batteries stay in the cabin.",
      "If in doubt, stop, check the DGR and escalate.",
    ],
    track: "DGR",
    scenarioIds: ["m6-lithium", "m3-dryice", "m17-cargo-dgr"],
  },
  {
    code: "PAX 14",
    title: "Loading Bridge Operations",
    stage: "Advanced",
    icon: "🌉",
    covers:
      "Safe alignment, docking, undocking and damage reporting for passenger boarding bridges.",
    tellsTA:
      "Protects the aircraft door and the passenger path at the most physical interface in the terminal.",
    keyRules: [
      "Confirm the aircraft is secured before docking.",
      "Follow the interlock and docking procedure exactly.",
      "Report any contact or damage immediately.",
    ],
    track: "IGOM",
    scenarioIds: ["m18-igom-turnaround"],
  },
];

export const PAX_MODULE_ORDER: PaxModuleCode[] = PAX_MODULES.map((module) => module.code);

export const PAX_STAGES: PaxModule["stage"][] = ["Foundation", "Core", "Advanced"];

/**
 * Existing Knowledge Gym questions that practise the same AHM competency.
 * New PAX questions already carry a `paxModule` tag and are added on top.
 */
export const PAX_EXISTING_QUESTION_IDS: Record<PaxModuleCode, string[]> = {
  "GEN 01": ["igom-incident", "igom-ppe", "saps-safety-report"],
  "PAX 01": ["saps-asf", "saps-safety-report", "igom-fod"],
  "PAX 02": ["saps-empathy", "saps-queue", "saps-hajj"],
  "PAX 03": ["iata-boarding", "iata-pnr", "saps-handover"],
  "PAX 04": ["iata-bagtag", "saps-baggage"],
  "PAX 05": ["saps-baggage", "iata-bagtag", "saps-ramp-comm"],
  "PAX 06": [
    "iata-timatic",
    "iata-passport",
    "iata-pnr",
    "saps-docs",
    "iata-fraud",
    "saps-integrity",
  ],
  "PAX 07": ["iata-irrops", "saps-irrops", "saps-empathy"],
  "PAX 08": ["iata-ssr", "iata-prm", "iata-umnr", "iata-meda", "iata-pregnancy"],
  "PAX 09/10": ["iata-ssss", "iata-idb", "saps-escalation", "iata-fraud", "iata-boarding"],
  "PAX 11": ["igom-lmc", "igom-loadsheet", "saps-ramp-comm"],
  "PAX 12": ["iata-pnr", "iata-ssr-osi", "iata-bagtag", "saps-ramp-comm"],
  "PAX 13": [
    "dgr-spare-cabin",
    "dgr-100wh",
    "dgr-160wh",
    "dgr-300wh",
    "dgr-dryice-limit",
    "dgr-ecig",
    "dgr-hidden",
    "dgr-ped-checked",
    "iata-dg-baggage",
  ],
  "PAX 14": ["igom-pbb", "igom-departure", "igom-arrival", "igom-chocks"],
};

/** Correct-answer share that marks a pathway step as complete. */
export const PAX_MASTERY_THRESHOLD = 70;

export function paxModuleByCode(code: PaxModuleCode): PaxModule {
  const definition = PAX_MODULES.find((entry) => entry.code === code);
  if (!definition) {
    throw new Error(`Unknown AHM 1110 module: ${code}`);
  }
  return definition;
}

/** Every question that practises a module, de-duplicated and in bank order. */
export function paxModuleQuestions(code: PaxModuleCode): AcademyQuestion[] {
  const mapped = new Set(PAX_EXISTING_QUESTION_IDS[code] ?? []);
  return ACADEMY_QUESTIONS.filter(
    (question) => question.paxModule === code || mapped.has(question.id),
  );
}

export function paxQuestions(): AcademyQuestion[] {
  return ACADEMY_QUESTIONS.filter((question) => question.paxModule !== undefined);
}

export interface PaxModuleProgress {
  module: PaxModule;
  total: number;
  answered: number;
  correct: number;
  /** Correct answers as a share of the module's whole question set. */
  mastery: number;
  complete: boolean;
}

export function paxModuleProgress(
  stats: AcademyStats,
  code: PaxModuleCode,
): PaxModuleProgress {
  const definition = paxModuleByCode(code);
  const questions = paxModuleQuestions(code);
  const ids = new Set(questions.map((question) => question.id));
  const answered = stats.answered.filter((id) => ids.has(id)).length;
  const correct = stats.correct.filter((id) => ids.has(id)).length;
  const mastery =
    questions.length === 0 ? 0 : Math.round((correct / questions.length) * 100);

  return {
    module: definition,
    total: questions.length,
    answered,
    correct,
    mastery,
    complete: mastery >= PAX_MASTERY_THRESHOLD,
  };
}

export interface PaxStageProgress {
  stage: PaxStage;
  total: number;
  answered: number;
  correct: number;
  mastery: number;
  completed: number;
  modules: number;
}

export interface PaxPathwayProgress {
  modules: PaxModuleProgress[];
  stages: PaxStageProgress[];
  total: number;
  answered: number;
  correct: number;
  mastery: number;
  completed: number;
  next: PaxModule | null;
}

export function paxPathwayProgress(stats: AcademyStats): PaxPathwayProgress {
  const modules = PAX_MODULES.map((module) => paxModuleProgress(stats, module.code));
  const uniqueIds = new Set(
    modules.flatMap((module) =>
      paxModuleQuestions(module.module.code).map((question) => question.id),
    ),
  );
  const total = uniqueIds.size;
  const answered = [...uniqueIds].filter((id) => stats.answered.includes(id)).length;
  const correct = [...uniqueIds].filter((id) => stats.correct.includes(id)).length;
  const mastery = total === 0 ? 0 : Math.round((correct / total) * 100);
  const completed = modules.filter((module) => module.complete).length;

  const stages = PAX_STAGES.map((stage): PaxStageProgress => {
    const stageModules = modules.filter((module) => module.module.stage === stage);
    const stageIds = new Set(
      stageModules.flatMap((module) =>
        paxModuleQuestions(module.module.code).map((question) => question.id),
      ),
    );
    const stageAnswered = [...stageIds].filter((id) => stats.answered.includes(id)).length;
    const stageCorrect = [...stageIds].filter((id) => stats.correct.includes(id)).length;

    return {
      stage,
      total: stageIds.size,
      answered: stageAnswered,
      correct: stageCorrect,
      mastery: stageIds.size === 0 ? 0 : Math.round((stageCorrect / stageIds.size) * 100),
      completed: stageModules.filter((module) => module.complete).length,
      modules: stageModules.length,
    };
  });

  return {
    modules,
    stages,
    total,
    answered,
    correct,
    mastery,
    completed,
    next: modules.find((module) => !module.complete)?.module ?? null,
  };
}

/** The first incomplete pathway step — the learner's natural next move. */
export function nextPaxModule(stats: AcademyStats): PaxModule | null {
  return paxPathwayProgress(stats).next;
}

export const PAX_BADGE_ID = "pax-pathway-graduate";

/** Badge awarded only when every AHM 1110 module reaches the mastery threshold. */
export function earnedPaxBadges(stats: AcademyStats): string[] {
  const progress = paxPathwayProgress(stats);
  return progress.completed === PAX_MODULES.length ? [PAX_BADGE_ID] : [];
}

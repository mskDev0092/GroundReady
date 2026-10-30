import type { BadgeDef, LevelDef } from "@/lib/types";

/** Level ladder — Level 1 Trainee T/A → Level 5 Senior Duty Supervisor */
export const LEVELS: LevelDef[] = [
  { level: 1, title: "Trainee T/A", minXp: 0 },
  { level: 2, title: "Junior T/A", minXp: 250 },
  { level: 3, title: "Traffic Assistant", minXp: 700 },
  { level: 4, title: "Senior T/A", minXp: 1250 },
  { level: 5, title: "Senior Duty Supervisor", minXp: 2000 },
];

export const MAX_XP = 2800;

export function levelFromXp(xp: number): LevelDef {
  let current = LEVELS[0];
  for (const lv of LEVELS) {
    if (xp >= lv.minXp) current = lv;
  }
  return current;
}

export function nextLevel(xp: number): LevelDef | null {
  return LEVELS.find((lv) => lv.minXp > xp) ?? null;
}

export const BADGES: BadgeDef[] = [
  {
    id: "zamzam-specialist",
    name: "Zamzam Compliance Specialist",
    icon: "🏆",
    description:
      "Passed the KSA-GACA liquid rules scenario without a single error.",
    requirement: "Score 90%+ on Module 1 — Zamzam & Liquids",
  },
  {
    id: "asf-shield",
    name: "ASF Security Shield",
    icon: "🛡️",
    description:
      "Handled an aggressive passenger / abandoned-bag threat correctly at the counter.",
    requirement: "Score 90%+ on Module 2 — Excess Baggage De-escalation",
  },
  {
    id: "dgr-expert",
    name: "IATA DGR Expert",
    icon: "📦",
    description:
      "Correctly applied Dry Ice (Class 9, UN 1845) limits and UK biosecurity rules.",
    requirement: "Score 90%+ on Module 3 — Food Items & Dry Ice",
  },
  {
    id: "irrops-master",
    name: "IRROPS Master",
    icon: "✈️",
    description:
      "Resolved an overbooked flight and managed the standby queue by priority.",
    requirement: "Score 90%+ on Module 4 — Overbooking & IDB",
  },
  {
    id: "gate-sentinel",
    name: "Gate Security Sentinel",
    icon: "🎯",
    description:
      "Managed an SSSS secondary security screening without delaying departure.",
    requirement: "Score 90%+ on Module 5 — SSSS Gate Protocol",
  },
  {
    id: "lithium-guard",
    name: "Lithium Guard",
    icon: "🔋",
    description:
      "Classified power banks, spare cells and a 300Wh power station correctly under DGR rules.",
    requirement: "Score 90%+ on Module 6 — Lithium & Power Banks",
  },
  {
    id: "sports-pro",
    name: "Sports Equipment Pro",
    icon: "🏏",
    description:
      "Routed an oversized cricket kit with proper tags and an honest EMD.",
    requirement: "Score 90%+ on Module 7 — The Cricketer's Kit",
  },
  {
    id: "doc-detective",
    name: "Document Detective",
    icon: "🛂",
    description:
      "Settled a passport-validity dispute with TIMATIC instead of rumour.",
    requirement: "Score 90%+ on Module 8 — Validity Countdown",
  },
  {
    id: "pnr-sherlock",
    name: "PNR Sherlock",
    icon: "🔍",
    description:
      "Separated a legal name correction from a fraud attempt under agent pressure.",
    requirement: "Score 90%+ on Module 9 — Wrong Name, Right Flight",
  },
  {
    id: "idb-negotiator",
    name: "IDB Negotiator",
    icon: "⚖️",
    description:
      "Executed the offload cascade correctly and protected every revenue seat.",
    requirement: "Score 90%+ on Module 10 — Last Seat Standing",
  },
  {
    id: "cutoff-commander",
    name: "Cut-off Commander",
    icon: "⏱️",
    description:
      "Held the cut-off line, offloaded no-show bags and cleared an unattended item by the book.",
    requirement: "Score 90%+ on Module 11 — The Vanishing Passenger",
  },
  {
    id: "umnr-guardian",
    name: "UM Guardian",
    icon: "🧸",
    description:
      "Built a complete unaccompanied-minor handover chain from parent to grandmother.",
    requirement: "Score 90%+ on Module 12 — First Flight Alone",
  },
  {
    id: "prm-ally",
    name: "PRM Ally",
    icon: "♿",
    description:
      "Coded WCHS exactly, disarmed a UN 2800 battery and preserved passenger dignity.",
    requirement: "Score 90%+ on Module 13 — Dignity at Row 1",
  },
  {
    id: "care-champion",
    name: "Care Champion",
    icon: "🤝",
    description:
      "Managed a 34-week MEDA case end-to-end and caught the 38-week return trap.",
    requirement: "Score 90%+ on Module 14 — Thirty-Four Weeks",
  },
  {
    id: "fog-navigator",
    name: "IRROPS Navigator",
    icon: "🌫️",
    description:
      "Re-ran a fog cancellation with the full care cascade — menu, group re-protection, bag pulls.",
    requirement: "Score 90%+ on Module 15 — Fog Over Lahore",
  },
  {
    id: "shadow-guardian",
    name: "Quiet Operator",
    icon: "🚨",
    description:
      "Detected a forged visa and escalated with ASF discipline — zero public drama.",
    requirement: "Score 90%+ on Module 16 — The Quiet Red Flag",
  },
];

export function badgeById(id: string): BadgeDef | undefined {
  return BADGES.find((b) => b.id === id);
}

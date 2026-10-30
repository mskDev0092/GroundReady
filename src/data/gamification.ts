import type { BadgeDef, LevelDef } from "@/lib/types";

/** Level ladder — Level 1 Trainee T/A → Level 5 Senior Duty Supervisor */
export const LEVELS: LevelDef[] = [
  { level: 1, title: "Trainee T/A", minXp: 0 },
  { level: 2, title: "Junior T/A", minXp: 150 },
  { level: 3, title: "Traffic Assistant", minXp: 400 },
  { level: 4, title: "Senior T/A", minXp: 800 },
  { level: 5, title: "Senior Duty Supervisor", minXp: 1500 },
];

export const MAX_XP = 2000;

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
];

export function badgeById(id: string): BadgeDef | undefined {
  return BADGES.find((b) => b.id === id);
}

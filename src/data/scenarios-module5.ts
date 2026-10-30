import type { Scenario } from "@/lib/types";

/**
 * MODULE 5 — Gate Security Flags & SSSS Protocol
 * Boarding pass generates a red SSSS (Secondary Security Screening Selection) alert at the gate.
 */
export const scenarioSSSS: Scenario = {
  id: "m5-ssss",
  moduleNo: 5,
  code: "M5-SSSS",
  title: "Red Flag at Gate C02",
  category: "gate-ops",
  tags: ["SSSS", "Security", "Gate Operations", "AVSEC", "ASF"],
  difficulty: 3,
  xpBase: 150,
  minutes: 12,
  summary:
    "During gate scanning, a passenger's boarding pass triggers a red SSSS security alert. Coordinate secondary screening, clear the flag in Altéa and protect the departure time.",
  briefing:
    "You are the SAPS boarding gate agent at Lahore (LHE), Gate C02, flight PK 232 LHE–AUH, STD 21:20. Mr Bilal Khan scans his boarding pass at the gate reader — the screen flashes RED: SSSS (Secondary Security Screening Selection). The flight is boarding; door closes in 18 minutes. Handle the flag with discretion, coordinate the secondary screening with ASF/AVSEC, clear the alert in Altéa and board him without delaying the departure.",
  objectives: [
    "React to the SSSS flag discreetly and professionally",
    "Coordinate secondary pat-down and hand-bag search with station security (ASF)",
    "Clear the security flag in Altéa only after AVSEC clearance",
    "Keep the flight departure schedule intact",
  ],
  passenger: {
    name: "Bilal Khan",
    age: 34,
    nationality: "Pakistan",
    passportNo: "QT-5562109",
    passportExpiry: "30 NOV 2029",
    pnr: "HT8RVC",
    ticketNo: "214-8899001122",
    flight: "PK 232",
    route: "LHE → AUH",
    date: "24 OCT",
    seat: "14A",
    fareClass: "Y — Economy Saver",
    allowance: "1PC / 23KG",
    originStation: "LHE — Gate C02",
    avatarTone: "teal",
  },
  baggage: [
    { id: "b1", label: "Rolling cabin trolley", weightKg: 9.8, type: "cabin", note: "Selected for hand search (SSSS)" },
    { id: "b2", label: "Laptop bag", weightKg: 3.2, type: "cabin" },
  ],
  documents: {
    passport: [
      { key: "name", label: "Name", value: "KHAN, BILAL" },
      { key: "nat", label: "Nationality", value: "PAKISTAN" },
      { key: "exp", label: "Expiry", value: "30 NOV 2029", highlight: "ok" },
    ],
    ticket: [
      { key: "pnr", label: "PNR", value: "HT8RVC" },
      { key: "tkt", label: "Ticket", value: "214-8899001122" },
      { key: "fl", label: "Flight", value: "PK 232 J 24OCT LHEAUH HK1" },
      { key: "seat", label: "Seat", value: "14A" },
    ],
    extra: [
      { key: "sec", label: "Gate reader", value: "RED FLAG — SSSS", highlight: "bad" },
      { key: "time", label: "Door close", value: "21:20 STD — 18 MIN", highlight: "warn" },
    ],
  },
  steps: [
    {
      type: "dialogue",
      id: "s5-d1",
      prompt: "The reader flashes red. Your first reaction sets the tone.",
      passengerLines: [
        "(The gate reader beeps twice and shows: RED — SSSS. Mr Khan is holding out his hand for the boarding pass, smiling.)",
      ],
      options: [
        {
          id: "s5-d1-a",
          text: "Keep the pass in your hand, smile, and speak quietly: 'Thank you Mr Khan — one moment please, a routine step before boarding. Our security colleague will assist you right here.' Step him slightly aside from the queue.",
          points: 12,
          feedback:
            "Exactly right: discretion (never announce SSSS), calm face-saving language, and physical separation from the queue — the SOP trifecta.",
          consequence:
            "He steps aside, slightly puzzled but composed. The queue keeps flowing behind you.",
          best: true,
        },
        {
          id: "s5-d1-b",
          text: "Say loudly: 'Sir, you have an SSSS flag — you need extra security screening!' so the queue knows to wait.",
          points: 2,
          feedback:
            "Never publicise a security flag: it stigmatises the passenger, creates panic and is an AVSEC discipline breach. Discretion is mandatory.",
          consequence: "Heads turn. Mr Khan's smile drops. Other passengers start filming.",
          best: false,
        },
        {
          id: "s5-d1-c",
          text: "Wave him through — the reader is probably faulty and you do not want a delay.",
          points: 0,
          feedback:
            "Grave security breach: an SSSS flag is a security directive. Bypassing it endangers the aircraft and is a dismissable, prosecutable offence.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "s5-d2",
      prompt: "Coordinate the secondary screening.",
      situation:
        "Mr Khan is aside from the queue. ASF post is 10 metres away; the gate supervisor is by the jetbridge; door closes in 16 minutes.",
      options: [
        {
          id: "s5-d2-a",
          text: "Radio the ASF post for a discreet secondary screening at the gate side-point: pat-down + full hand search of his trolley and laptop bag; keep his cabin bags with security at all times; meanwhile keep boarding the rest of the cabin in zones.",
          points: 20,
          feedback:
            "Correct: ASF conducts the pat-down and bag search, the passenger is never left alone with his bags unwatched, and boarding continues so the schedule is protected.",
          consequence:
            "ASF sergeant arrives within two minutes. Screening begins at the side-point. Boarding zones keep moving.",
          best: true,
        },
        {
          id: "s5-d2-b",
          text: "Ask Mr Khan to sit and wait at the far end of the gate lounge while you finish all boarding, then handle him at the end.",
          points: 8,
          feedback:
            "Risky: the SSSS passenger must be under security watch with his bags; parking him unwatched creates a security gap and squeezes your own timeline.",
          best: false,
        },
        {
          id: "s5-d2-c",
          text: "Search his bags yourself at the podium — faster than waiting for ASF.",
          points: 0,
          feedback:
            "Out of your authority: secondary screening is performed by trained security personnel (ASF/AVSEC), not gate staff.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "s5-d3",
      prompt: "Handle the anxiety question with respect.",
      passengerLines: [
        "'Why only me? Is this because of my name… my beard? I travel five times a year on this route.'",
      ],
      options: [
        {
          id: "s5-d3-a",
          text: "Sir, selections come from the airline's and government's security systems — random, watchlist-based or directive-driven; the agent never sees the reason and it is never personal. Your cooperation is routine and appreciated; most screenings take just a few minutes.",
          points: 12,
          feedback:
            "Professional: non-discriminatory, truthful (agents don't control or see selection reasons), respectful and reassuring about the timeline.",
          consequence:
            "He nods: 'Okay… I understand. Please do what you need.' The ASF sergeant signals the screening is underway.",
          best: true,
        },
        {
          id: "s5-d3-b",
          text: "It is random, sir. Absolutely random. (Avoid eye contact.)",
          points: 4,
          feedback:
            "The answer may be true but the delivery reads as evasive. Calm, open, respectful body language matters as much as words.",
          best: false,
        },
        {
          id: "s5-d3-c",
          text: "Honestly sir, passengers with one-way tickets from your city get flagged. You know how it is.",
          points: 0,
          feedback:
            "Never speculate about selection criteria — it is confidential, and profiling talk is discriminatory and reputationally toxic.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "s5-t1",
      prompt:
        "ASF clears the secondary screening. Clear the flag in Altéa and board the passenger.",
      intro:
        "ASF sergeant: 'Screening complete — no issues. Cleared for travel.' Document it and process the boarding.",
      commands: [
        {
          pattern: "^PD/LHEAUH/24OCT$",
          display: "PD/LHEAUH/24OCT",
          hint: "Passenger Display for PK 232 LHE→AUH, 24 OCT.",
          output: [
            "FLIGHT: PK 232  LHE-AUH  EQP 320  STATUS: BRDG",
            "STD 2120  GATE C02  CUTOFF 2050",
            "PAX F/C/Y: 000/006/138  BAGS 121/744.0K",
          ],
          errorHint: "Format: PD/<citypair>/<date> — PD/LHEAUH/24OCT",
          points: 8,
        },
        {
          pattern: "^RT/KHAN$",
          display: "RT/KHAN",
          hint: "Retrieve Mr Khan's record to view the security status.",
          output: [
            "NAME: KHAN/BILAL MR   RECLOC HT8RVC",
            "ITN: 1 PK 232 J 24OCT LHEAUH HK1  SEAT 14A",
            "SEC STATUS: SSSS  CLEARED BY: <PENDING>",
          ],
          errorHint: "Retrieve by name: RT/KHAN",
          points: 8,
        },
        {
          pattern: "^SEC/KHAN/CLR$",
          display: "SEC/KHAN/CLR",
          hint: "Clear the security flag after ASF clearance (station security-clear command).",
          output: [
            "SEC FLAG CLEARED  SSSS -> OK",
            "AUTH: ASF SGT RIAZ 2140Z  GATE C02",
          ],
          errorHint: "Format: SEC/<NAME>/CLR — only AFTER physical AVSEC clearance.",
          points: 8,
        },
        {
          pattern: "^BD/LHEAUH/24OCT-14A$",
          display: "BD/LHEAUH/24OCT-14A",
          hint: "Board the passenger into seat 14A.",
          output: [
            "BD OK  KHAN/BILAL  SEAT 14A",
            "ZONE 2  PK232 LHEAUH  C02",
          ],
          errorHint: "Format: BD/<citypair>/<date>-<SEAT> — BD/LHEAUH/24OCT-14A",
          points: 8,
        },
        {
          pattern: "^PADD-SSSS.*",
          display: "PADD-SSSS 2ND SCREENING CLEARED BY ASF 2140Z GATE C02",
          hint: "Log the screening event for the audit trail.",
          output: ["OK REMARK ADDED TO PNR HT8RVC"],
          errorHint: "Start with PADD-SSSS and include who cleared it and when.",
          points: 8,
        },
      ],
    },
    {
      type: "decision",
      id: "s5-d4",
      prompt: "Final boarding decision — schedule is on the line.",
      situation:
        "Mr Khan is cleared, bag searched, documents stamped. Zone 3 is still boarding. Door closes in 6 minutes.",
      options: [
        {
          id: "s5-d4-a",
          text: "Board him immediately with zone 3, hand him his documents with a courteous 'thank you for your patience', confirm his trolley is gate-tagged if needed, and update the gate tally — departure stays on time.",
          points: 16,
          feedback:
            "Correct: cleared passenger boards, courtesy closes the loop, tally updated, on-time departure protected. Full SOP cycle complete.",
          consequence:
            "Door closes at 21:14, six minutes early. Captain: 'Good work at C02.'",
          best: true,
        },
        {
          id: "s5-d4-b",
          text: "Hold him until every other passenger has boarded and let him enter last, just in case.",
          points: 6,
          feedback:
            "Unnecessary: once AVSEC clears him, further isolation is discriminatory and delays the flow. Board him in his zone.",
          best: false,
        },
        {
          id: "s5-d4-c",
          text: "Offload him anyway to be safe — the flight can go without him.",
          points: 0,
          feedback:
            "Illegal offload: after AVSEC clearance there is no basis to deny boarding; this is a compensable IDB event plus discrimination exposure.",
          best: false,
        },
      ],
    },
  ],
  debriefRules: [
    {
      source: "AVSEC / IATA Annex 17 alignment",
      ref: "SSSS = Secondary Security Screening Selection",
      detail:
        "A security-directive flag requiring AVSEC-conducted secondary screening (pat-down + hand search). Gate staff must not announce it, must not self-perform the search, and must never bypass it.",
    },
    {
      source: "SAPS Gate SOP — Discretion Protocol",
      ref: "Face-saving handling of flagged passengers",
      detail:
        "Move the passenger aside calmly, use neutral wording ('routine step'), never disclose the flag name publicly, and keep other passengers' boarding flowing.",
    },
    {
      source: "Altéa DCS — Gate workflow",
      ref: "SEC/<NAME>/CLR then BD/<citypair>/<date>-<SEAT>",
      detail:
        "The security flag is cleared only after physical AVSEC clearance (with author reference), followed by the boarding entry and a PADD audit remark.",
    },
  ],
  checklist: [
    "Red SSSS at gate reader: stay calm, keep the pass in hand",
    "NEVER announce the flag publicly — discretion always",
    "Move passenger aside; use neutral 'routine step' wording",
    "Radio ASF for secondary screening at gate side-point",
    "Passenger never left unwatched with cabin bags",
    "Continue boarding other zones in parallel",
    "Answer 'why me?' respectfully — selection is system-driven, not personal",
    "Clear flag in Altéa ONLY after ASF clearance (SEC/<NAME>/CLR)",
    "BD entry to board, PADD remark for audit trail",
    "Protect the departure time — door close discipline",
  ],
  badgeId: "gate-sentinel",
};

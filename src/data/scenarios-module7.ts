import type { Scenario } from "@/lib/types";

/**
 * MODULE 7 — Sports Equipment & Oversized Items (The Cricketer's Kit)
 * Club cricketer to Birmingham with bat, kit bag and an overweight total.
 */
export const scenarioCricket: Scenario = {
  id: "m7-cricket",
  moduleNo: 7,
  code: "M7-CRIKT",
  title: "The Cricketer's Kit",
  category: "baggage-dgr",
  tags: ["Sports Equipment", "Oversized", "Fragile", "EMD", "Cabin Limits"],
  difficulty: 2,
  xpBase: 140,
  minutes: 12,
  summary:
    "A club cricketer flies to Birmingham with a willow bat he insists on carrying into the cabin, a 3-piece kit and 8kg of excess.",
  briefing:
    "You are the SAPS Traffic Assistant at Row 7, Lahore (LHE), flight PK 791 LHE–BHX, 24 OCT. Hamza Chaudhry, a club cricketer, presents a suitcase, a kit bag and a padded bat cover. He wants the bat in the cabin 'because it is worth 60,000 rupees' and his teammate has told him 'security never checks bats'. Process the sports equipment, apply cabin size limits, and resolve the excess weight correctly.",
  objectives: [
    "Apply cabin size limits — a cricket bat can NEVER travel in the cabin",
    "Accept and tag sports equipment with SPORT special handling",
    "Protect oversized/fragile sporting gear (LRT, upright loading)",
    "Quote and issue the excess baggage EMD honestly (EMD-EXC)",
  ],
  passenger: {
    name: "Hamza Tariq Chaudhry",
    age: 27,
    nationality: "Pakistan",
    passportNo: "GF-9912364",
    passportExpiry: "30 NOV 2030",
    pnr: "JX4QR9",
    ticketNo: "214-4520998731",
    flight: "PK 791",
    route: "LHE → BHX",
    date: "24 OCT",
    seat: "31D",
    fareClass: "Y — Economy Value",
    allowance: "2PC / 23KG each (46KG total)",
    originStation: "LHE — SAPS Row 7",
    avatarTone: "orange",
    visa: "UK Standard Visitor — 6 months, valid",
  },
  baggage: [
    { id: "b1", label: "Suitcase (clothes, shoes)", weightKg: 23.5, type: "checked" },
    { id: "b2", label: "Kit bag — pads, gloves, helmet, thigh guard", weightKg: 15.5, type: "checked", note: "Soft shell, top loading" },
    { id: "b3", label: "Padded bat cover — English willow bat 96cm", weightKg: 15.0, type: "checked", tag: "SPORT", note: "OVERLENGTH — cabin prohibited" },
  ],
  documents: {
    passport: [
      { key: "name", label: "Name", value: "CHAUDHRY, HAMZA TARIQ" },
      { key: "nat", label: "Nationality", value: "PAKISTAN" },
      { key: "dob", label: "DOB", value: "08 SEP 1999" },
      { key: "exp", label: "Expiry", value: "30 NOV 2030", highlight: "ok" },
    ],
    visa: [
      { key: "type", label: "Visa", value: "UK STANDARD VISITOR" },
      { key: "status", label: "Status", value: "VALID — 6 MONTHS", highlight: "ok" },
    ],
    ticket: [
      { key: "pnr", label: "PNR", value: "JX4QR9" },
      { key: "tkt", label: "Ticket", value: "214-4520998731" },
      { key: "fl", label: "Flight", value: "PK 791 V 24OCT LHEBHX HK1" },
      { key: "seat", label: "Seat", value: "31D" },
    ],
  },
  steps: [
    {
      type: "dialogue",
      id: "m7-d1",
      prompt: "Open the interaction professionally.",
      passengerLines: [
        "Assalam-o-alaikum! League tour in Birmingham — four matches. Bat goes up top with me, everything else you can throw below. Deal?",
      ],
      options: [
        {
          id: "m7-d1-a",
          text: "Wa-alaikum-salam! Four matches — best of luck, bhai. Before we decide, let me weigh the three pieces and confirm what your fare allows; then we will talk about the bat, because there is a specific rule for sporting items.",
          points: 8,
          feedback:
            "Great opening: enthusiasm, facts-first (weigh/verify allowance), and a respectful heads-up that the bat has its own rule — no confrontation yet.",
          consequence:
            "Scale shows 23.5 / 15.5 / 15.0 kg. 'See? Three pieces, all sensible. The bat is my lucky one.'",
          best: true,
        },
        {
          id: "m7-d1-b",
          text: "No bat in the cabin, final. Put everything on the belt.",
          points: 4,
          feedback:
            "Right conclusion, poor method: without weighing or explaining you invite a long argument and lose the passenger's cooperation.",
          best: false,
        },
        {
          id: "m7-d1-c",
          text: "Sure, the bat can go in the cabin if it fits the overhead bin.",
          points: 0,
          feedback:
            "Wrong: bats are explicitly prohibited cabin items — they are potential weapons under security rules regardless of fit.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m7-d2",
      prompt: "Explain the bat rule and the sports-equipment procedure.",
      passengerLines: [
        "Cabin, beta. This bat is 60,000 rupees of English willow — if the ramp throws it, my season is over. My friend flew last month with a bat taped up and nobody said anything.",
      ],
      options: [
        {
          id: "m7-d2-a",
          text: "I hear you — and I cannot promise the ramp gentle hands, but I CAN promise procedure: the bat travels checked with a FRAGILE/LRT tag and SPORT routing, padded in its cover. In the cabin it is prohibited everywhere — it is on the security banned list as a sporting weapon, so it would simply be confiscated at the X-ray and you would lose it for good. Checked with protection, you land in Birmingham WITH the bat.",
          points: 16,
          feedback:
            "Textbook: acknowledges his fear, offers the protective mechanism (LRT + SPORT routing), and explains why cabin is impossible (security confiscation = losing it entirely).",
          consequence:
            "He exhales: 'Checked with the fragile tag… okay. But it sits on TOP of the pile, not under three suitcases!'",
          best: true,
        },
        {
          id: "m7-d2-b",
          text: "Fine, take the bat in the cabin quietly — if the crew says nothing, nobody will notice.",
          points: 0,
          feedback:
            "Coaching a security evasion: bats are prohibited cabin items. If security intercepts it, YOU accepted it — that is your violation on record.",
          best: false,
        },
        {
          id: "m7-d2-c",
          text: "Sports equipment is not allowed on this flight at all, sorry.",
          points: 4,
          feedback:
            "Factually wrong: sporting gear is accepted as checked baggage under the standard piece allowance. You are refusing a compliant passenger.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "m7-t1",
      prompt:
        "Enter the full sports kit in Altéa DCS with special handling. Type commands at the > prompt.",
      intro:
        "All three pieces accepted: suitcase, kit bag and padded bat cover with FRAGILE/LRT. Total 54kg against a 46kg allowance.",
      commands: [
        {
          pattern: "^PD/LHEBHX/24OCT$",
          display: "PD/LHEBHX/24OCT",
          hint: "Passenger Display — pull up flight PK 791 LHE→BHX for 24 OCT.",
          output: [
            "FLIGHT: PK 791  LHE-BHX  EQP 77L  STATUS: OPEN",
            "STD 0900  GATE A06  CUTOFF 0825  ROWS 6-9",
            "PAX F/C/Y: 018/032/284   BAGS 208/2241.0K",
          ],
          errorHint: "Format: PD/<origin><destination>/<DDMMM> — e.g. PD/LHEBHX/24OCT",
          points: 8,
        },
        {
          pattern: "^RT/CHAUDHRY$",
          display: "RT/CHAUDHRY",
          hint: "Retrieve the passenger record by family name.",
          output: [
            "NAME: CHAUDHRY/HAMZA TARIQ MR   RECLOC JX4QR9",
            "ITN: 1 PK 791 V 24OCT LHEBHX HK1  SEAT 31D",
            "TKT 214-4520998731  CLASS Y  BAG 2PC/23K",
          ],
          errorHint: "Retrieve by name: RT/CHAUDHRY",
          points: 8,
        },
        {
          pattern: "^SRSPTG-P1/.*",
          display: "SR SPTG-P1/CRICKET KIT 3PCS INCL BAT",
          hint: "Add the sporting-equipment SSR for passenger 1.",
          output: [
            "OK SSR SPTG ADDED",
            "SPORTS EQP 3PCS INCL BAT  PAX1  PK791",
          ],
          errorHint: "Start with SR SPTG-P1/ and list the kit, e.g. SR SPTG-P1/CRICKET KIT 3PCS INCL BAT",
          points: 8,
        },
        {
          pattern: "^BAG/3/54\\.0$",
          display: "BAG/3/54.0",
          hint: "Enter 3 pieces, 54.0 kg total.",
          output: [
            "BAG TAGS 0456-11556677-679  PK791 LHEBHX",
            "3PC 54.0KG  EXCESS 8.0KG  PENDING EMD",
          ],
          errorHint: "Format: BAG/<pieces>/<weight> — BAG/3/54.0",
          points: 8,
        },
        {
          pattern: "^PADD-EXC.*SPORT.*",
          display: "PADD-EXC BGG SPORTS EQP BAT OVERLENGTH/FRAGILE LRT APPLIED",
          hint: "Log the exception remark — mention SPORT and the LRT.",
          output: ["OK REMARK ADDED TO PNR JX4QR9"],
          errorHint:
            "Start with PADD-EXC and include SPORT, e.g. PADD-EXC BGG SPORTS EQP BAT OVERLENGTH/FRAGILE LRT APPLIED",
          points: 8,
        },
      ],
    },
    {
      type: "decision",
      id: "m7-d3",
      prompt: "Protect the bat physically — choose the correct handling.",
      situation:
        "The padded bat cover must be tagged and staged. How do you guarantee it survives loading and arrives usable?",
      options: [
        {
          id: "m7-d3-a",
          text: "FRAGILE/LRT tag on the cover, SPORT routing tag, staged upright 'last-in/first-out' on top of the bulk, and a one-line heads-up to the ramp lead when handing over the staging cart.",
          points: 16,
          feedback:
            "Correct: tags document it, staging protects it, and the verbal handover makes the ramp lead personally responsible for top loading.",
          consequence:
            "Ramp lead nods: 'Top of the pile, nice side up. No problem.'",
          best: true,
        },
        {
          id: "m7-d3-b",
          text: "Only the standard bag tag — the padded cover is protection enough on its own.",
          points: 8,
          feedback:
            "Incomplete: without LRT/SPORT tags, loaders have no indication, and the liability trail is missing if the bat snaps.",
          best: false,
        },
        {
          id: "m7-d3-c",
          text: "Take the bat out of its cover so the tag sticks directly to the willow — better adhesion.",
          points: 0,
          feedback:
            "Never strip protective packing; a bare willow bat takes impact damage from every belt turn, and tape marks devalue it.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m7-d4",
      prompt: "Handle the 'my friend did it' argument.",
      passengerLines: [
        "My friend carried his bat through the cabin last month — taped to his backpack and nobody stopped him. Why are you making it difficult?",
      ],
      options: [
        {
          id: "m7-d4-a",
          text: "If it happened, he got lucky — luck is not a procedure. The bat is on the security prohibited list: the X-ray operator must pull it, and then you miss your flight arguing with ASF. Checked with a fragile tag, the bat flies TODAY and lands with you at BHX. Which outcome do you actually want?",
          points: 8,
          feedback:
            "Strong: reframes from 'restriction' to 'which outcome do you want' — flight with bat vs confiscation. Firm, factual, service-minded.",
          consequence:
            "'…Checked it is.' He lifts the bat cover onto the staging cart himself.",
          best: true,
        },
        {
          id: "m7-d4-b",
          text: "Your friend probably flew from a different airport with laxer security. Here at LHE rules are stricter.",
          points: 4,
          feedback:
            "Wrong message: the bat ban is global security policy, not an LHE quirk. You just told him other airports allow it.",
          best: false,
        },
        {
          id: "m7-d4-c",
          text: "Rules are rules, sir. Next passenger please!",
          points: 0,
          feedback:
            "Rudeness escalates conflict. Explain the WHY and offer the compliant path — that is the SAPS service standard.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "m7-d5",
      prompt: "Resolve the 8kg excess honestly.",
      situation:
        "54kg total vs 46kg allowance = 8kg excess. The rate card shows PKR 5,250 per kg. Hamza asks for a 'favour' to wave it through.",
      options: [
        {
          id: "m7-d5-a",
          text: "Quote the rate openly (8 × 5,250 = PKR 42,000), issue EMD-EXC/8.0/42000, explain the piece system honestly — and offer the legitimate softening options: move 5kg of pads into the cabin trolley (within 7kg cabin limit) to cut the excess.",
          points: 12,
          feedback:
            "Correct: transparent rate, proper EMD, AND smart legitimate optimisation for the passenger. No favouritism, full service.",
          consequence:
            "He rebalances 5kg into his cabin trolley → excess drops to 3kg → EMD for 3 × 5,250 = PKR 15,750. 'Chalo, fair enough!'",
          best: true,
        },
        {
          id: "m7-d5-b",
          text: "Enter 46kg in the system and let the rest slide — he is a nice guy and the queue is long.",
          points: 0,
          feedback:
            "Fare evasion: a false bag entry is a revenue violation and the weight discrepancy corrupts the load sheet — a safety document.",
          best: false,
        },
        {
          id: "m7-d5-c",
          text: "Demand cash directly from him at the counter instead of issuing the EMD receipt.",
          points: 0,
          feedback:
            "Gross misconduct: all charges go through the system-issued EMD with a receipt. Off-book cash is grounds for dismissal.",
          best: false,
        },
      ],
    },
  ],
  debriefRules: [
    {
      source: "IATA — Cabin Security",
      ref: "Sporting bats, clubs, cues: prohibited in cabin (security restricted items)",
      detail:
        "Cricket bats exceed cabin size limits AND fall under security weapon-class items — they must travel checked, worldwide, at every airport.",
    },
    {
      source: "SAPS SOP — Sports Equipment",
      ref: "Counts within standard piece allowance · SPORT tag · FRAGILE/LRT for delicate gear",
      detail:
        "Kit counts against the passenger's normal allowance; special tags route it for protective loading. PADD remark completes the audit trail.",
    },
    {
      source: "IATA — Excess Baggage (EMD)",
      ref: "EMD-EXC with transparent rate card quotation",
      detail:
        "Excess must be resolved via system-issued EMD — never off-book cash, never falsified weights. Load-sheet accuracy is a safety document.",
    },
  ],
  checklist: [
    "Greet, then WEIGH all pieces before making decisions",
    "Bat is prohibited in cabin (security item) — explain the confiscation consequence",
    "Offer protection: padded cover + FRAGILE/LRT + SPORT routing tag",
    "PD/LHEBHX/24OCT then RT/CHAUDHRY",
    "SR SPTG-P1/… — sports equipment SSR",
    "BAG/3/54.0 — enter true weight, never falsified",
    "PADD-EXC … — audit remark for oversized/fragile",
    "Quote excess rate transparently; offer cabin re-balance before EMD",
    "Issue EMD-EXC through the system with receipt",
    "Hand over BP + bag receipts; direct to security/immigration",
  ],
  badgeId: "sports-pro",
};

import type { Scenario } from "@/lib/types";

/**
 * MODULE 1 — Liquids, GACA Rules & Special Baggage (The Jeddah/Lahore Case)
 * Umrah pilgrim with loose, self-filled Zamzam pouches attempting cabin carry-on.
 */
export const scenarioZamzam: Scenario = {
  id: "m1-zamzam",
  moduleNo: 1,
  code: "M1-ZAMZ",
  title: "Zamzam Pouches at Check-in",
  category: "baggage-dgr",
  tags: ["Liquids", "GACA", "Special Baggage", "LAGs", "Zamzam"],
  difficulty: 2,
  xpBase: 120,
  minutes: 10,
  summary:
    "An Umrah pilgrim arrives with loose, self-filled Zamzam pouches in a cardboard box and wants to carry them into the cabin.",
  briefing:
    "You are the SAPS Traffic Assistant at Row 5, Jeddah King Abdulaziz International (JED), flight PK 858 JED–LHE. An Umrah pilgrim approaches with a cardboard box. Inside: 12 loose, self-filled plastic Zamzam pouches (~1 litre each) topped up from a 5-litre canister. He wants the box in the cabin beside him. Apply IATA LAG rules, the GACA Saudi mandate on Zamzam, and process the official 5L bottle into the hold.",
  objectives: [
    "Apply IATA LAG rule (<100ml cabin) to the loose pouches",
    "Enforce the GACA mandate: Zamzam only in official 5L factory-sealed bottles, hold only",
    "Enter the special bag and ZAMZ SSR in Altéa DCS",
    "Log the exception remark (PADD) and apply a Limited Release Tag (LRT)",
  ],
  passenger: {
    name: "Muhammad Ilyas Haqqani",
    age: 61,
    nationality: "Pakistan",
    passportNo: "KP-4471208",
    passportExpiry: "14 AUG 2029",
    pnr: "7QK4LM",
    ticketNo: "214-4123456780",
    flight: "PK 858",
    route: "JED → LHE",
    date: "24 OCT",
    seat: "22A",
    fareClass: "Y — Economy Saver",
    allowance: "1PC / 23KG + 1 Zamzam 5L (GACA)",
    originStation: "JED — SAPS Row 5",
    avatarTone: "emerald",
    visa: "Umrah Visa — valid",
  },
  baggage: [
    { id: "b1", label: "Cardboard box — 12 loose Zamzam pouches", weightKg: 12.4, type: "cabin", note: "Self-filled pouches ~1L each, NOT factory sealed" },
    { id: "b2", label: "Suitcase (proposed checked)", weightKg: 18.2, type: "checked" },
    { id: "b3", label: "Official 5L GACA factory bottle (after purchase)", weightKg: 5.0, type: "checked", tag: "T-ZAM", note: "Factory-sealed, capacity 5L" },
  ],
  documents: {
    passport: [
      { key: "name", label: "Name", value: "HAQQANI, MUHAMMAD ILYAS" },
      { key: "nat", label: "Nationality", value: "PAKISTAN" },
      { key: "dob", label: "DOB", value: "02 MAR 1964" },
      { key: "exp", label: "Expiry", value: "14 AUG 2029", highlight: "ok" },
    ],
    visa: [
      { key: "type", label: "Visa", value: "UMRAH — EXIT VALID" },
      { key: "status", label: "Status", value: "USED — DEPARTURE OK", highlight: "ok" },
    ],
    ticket: [
      { key: "pnr", label: "PNR", value: "7QK4LM" },
      { key: "tkt", label: "Ticket", value: "214-4123456780" },
      { key: "fl", label: "Flight", value: "PK 858 J 24OCT JEDLHE HK25" },
      { key: "seat", label: "Seat", value: "22A" },
    ],
  },
  steps: [
    {
      type: "dialogue",
      id: "s1-d1",
      prompt: "Open the interaction professionally.",
      passengerLines: [
        "Assalam-o-alaikum, beta. Alhamdulillah, Umrah complete! I have Zamzam for my whole family in Lahore — a whole box of it. Where do I put it?",
      ],
      options: [
        {
          id: "s1-d1-a",
          text: "Wa-alaikum-salam, Hajji. Welcome! May I ask what is inside the box — pouches or sealed bottles? Let me check the rules for you.",
          points: 8,
          feedback:
            "Perfect opening: warm greeting plus a discovery question before deciding anything.",
          consequence:
            "He lifts the box proudly: 'Twelve pouches, beta. I filled them myself from the canister. One litre each!'",
          best: true,
        },
        {
          id: "s1-d1-b",
          text: "Zamzam is allowed, sir. Hand me the box, I will tag it and send it.",
          points: 4,
          feedback:
            "Never accept before verifying contents and packaging. Loose pouches are prohibited in both cabin and hold.",
          best: false,
        },
        {
          id: "s1-d1-c",
          text: "No liquids allowed at all, sir. Please take it back.",
          points: 2,
          feedback:
            "Factually wrong and poor service — GACA-approved 5L factory bottles ARE accepted in the hold, one per passenger.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "s1-d2",
      prompt: "Apply IATA LAG + GACA rules and offer the compliant solution.",
      passengerLines: [
        "Self-filled? Yes beta, it is purer that way! I will keep the box on my lap in the cabin — it is a gift for the whole family.",
      ],
      options: [
        {
          id: "s1-d2-a",
          text: "Uncle, cabin liquids must be under 100ml each — your pouches are 1 litre, so they cannot go in the cabin. Loose pouches are also banned in the hold by GACA: they can leak or burst under depressurisation. The compliant way: one official 5-litre GACA factory-sealed bottle, checked in the hold — I will add the special ZAMZAM tag for you.",
          points: 16,
          feedback:
            "Textbook: LAG rule quoted, GACA prohibition explained with the reason (leakage / depressurisation), and the compliant 5L factory-bottle option offered.",
          consequence:
            "'Factory bottle in the hold… okay beta, where do I buy it?' — The shop airside after security sells the official 5L GACA bottles.",
          best: true,
        },
        {
          id: "s1-d2-b",
          text: "Fine uncle, I will check the pouches into the hold with your suitcase.",
          points: 8,
          feedback:
            "Wrong on two counts: loose self-filled pouches are prohibited in the hold (leak/burst risk) and you skipped the compliant 5L bottle procedure.",
          consequence:
            "Supervisor taps your shoulder: 'Did you just accept loose pouches? Pull that bag NOW.'",
          best: false,
        },
        {
          id: "s1-d2-c",
          text: "No problem sir, the box can go in the cabin — you can hold it on your lap.",
          points: 0,
          feedback:
            "Serious violation: 1-litre liquids exceed the 100ml LAG limit; this would be stopped at security and put the flight at risk.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "s1-t1",
      prompt:
        "Process the compliant Zamzam bag in Altéa DCS. Type commands at the > prompt. Use TAB for autocomplete, HELP for the vocabulary.",
      intro:
        "Passenger has purchased the official 5L GACA factory bottle airside and returns with his suitcase. Check in the bottle as special baggage.",
      commands: [
        {
          pattern: "^PD/JEDLHE/24OCT$",
          display: "PD/JEDLHE/24OCT",
          hint: "Passenger Display — pull up flight PK 858 JED→LHE for 24 OCT.",
          output: [
            "FLIGHT: PK 858  JED-LHE  EQP 320  STATUS: OPEN",
            "STD 1030  GATE A12  CUTOFF 0955  ROWS 3-8",
            "PAX F/C/Y: 002/008/236   BAGS 231/1284.5K",
          ],
          errorHint: "Format: PD/<origin><destination>/<DDMMM> — e.g. PD/JEDLHE/24OCT",
          points: 8,
        },
        {
          pattern: "^RT/HAQQANI$",
          display: "RT/HAQQANI",
          hint: "Retrieve the passenger record by family name.",
          output: [
            "NAME: HAQQANI/MUHAMMAD ILYAS MR   RECLOC 7QK4LM",
            "ITN: 1 PK 858 J 24OCT JEDLHE HK25  SEAT 22A",
            "TKT 214-4123456780  CLASS Y  BAG 0PC",
          ],
          errorHint: "Retrieve by name: RT/HAQQANI",
          points: 8,
        },
        {
          pattern: "^SRZAMZ-P1/5\\.0KG$",
          display: "SR ZAMZ-P1/5.0KG",
          hint: "Add the ZAMZ special service request for passenger 1 — 5.0 KG.",
          output: [
            "OK SSR ZAMZ ADDED",
            "ZAMZAM WATER 5.0KG  PAX1  PK858 JEDLHE",
          ],
          errorHint: "Format: SR ZAMZ-P1/5.0KG (SR code, element, weight)",
          points: 8,
        },
        {
          pattern: "^BAG/1/5\\.0/T-ZAM$",
          display: "BAG/1/5.0/T-ZAM",
          hint: "Enter 1 bag, 5.0 kg, with the T-ZAM special tag.",
          output: [
            "BAG TAG 0456-11223344  PK858 JEDLHE",
            "1PC 5.0KG  SPECIAL TAG: T-ZAM",
            "OK",
          ],
          errorHint: "Format: BAG/<pieces>/<weight>/T-<tagcode> — BAG/1/5.0/T-ZAM",
          points: 8,
        },
        {
          pattern: "^PADD-EXCBGG.*ZAMZ.*",
          display: "PADD-EXC BGG ZAMZAM 5L GACA BOTTLE/LRT APPLIED",
          hint: "Log the exception remark (PADD) — mention the GACA 5L bottle and LRT.",
          output: ["OK REMARK ADDED TO PNR 7QK4LM"],
          errorHint:
            "Start with PADD-EXC BGG… and include ZAMZ, e.g. PADD-EXC BGG ZAMZAM 5L GACA BOTTLE/LRT APPLIED",
          points: 8,
        },
      ],
    },
    {
      type: "decision",
      id: "s1-d3",
      prompt: "Tagging and physical handling — choose the correct procedure.",
      situation:
        "The official 5L factory bottle is packed inside the suitcase. How do you tag and protect it?",
      options: [
        {
          id: "s1-d3-a",
          text: "Apply a Limited Release Tag (LRT) accepting the glass bottle as fragile, plus the T-ZAM tag, and ensure it sits upright, cushioned, away from other bags.",
          points: 16,
          feedback:
            "Correct. The LRT documents the limited-release acceptance; T-ZAM routes it into special handling.",
          consequence:
            "Bags make it onto the belt with priority-fragile routing. Ramp sends an 'OK' signal.",
          best: true,
        },
        {
          id: "s1-d3-b",
          text: "Just a normal bag tag — a factory bottle needs nothing special.",
          points: 8,
          feedback:
            "Incomplete: without the LRT, liability is unclear if the bottle breaks, and handling staff miss the special routing.",
          best: false,
        },
        {
          id: "s1-d3-c",
          text: "Wrap the bottle in the passenger's shawl and hand-carry advice — no tags at all.",
          points: 0,
          feedback:
            "No tag = no tracking, no liability record, no handling instruction. Never send an untagged bag.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "s1-d4",
      prompt: "Reassure the passenger and explain the system.",
      passengerLines: [
        "Beta, will my 5-litre bottle be safe down there? And what about the pouches I already filled?",
      ],
      options: [
        {
          id: "s1-d4-a",
          text: "The factory bottle is approved and tagged for the hold, uncle. For the pouches: empty them into the official bottle here, or hand them to your family in Jeddah — any left over must be surrendered before security. Loose pouches cannot fly in cabin or hold.",
          points: 8,
          feedback:
            "Excellent: reassurance plus three compliant dispositions for the pouches. Cabin 100ml rule and GACA hold rule both respected.",
          consequence:
            "He nods slowly: 'Alhamdulillah, rules are rules. My nephew in Jeddah will take the pouches.'",
          best: true,
        },
        {
          id: "s1-d4-b",
          text: "Give the pouches to another passenger who is not carrying Zamzam yet.",
          points: 4,
          feedback:
            "Clever-sounding but wrong — it just moves the violation to another passenger's baggage.",
          best: false,
        },
        {
          id: "s1-d4-c",
          text: "Keep the pouches in your jacket pockets — security does not check pockets.",
          points: 0,
          feedback:
            "Never coach a passenger to evade security. This is a serious integrity breach.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "s1-d5",
      prompt: "Close the interaction at the counter.",
      situation: "Documents are ready. Finish the check-in correctly.",
      options: [
        {
          id: "s1-d5-a",
          text: "Verify seat 22A on the boarding pass, hand over BP + bag receipts, point to security/immigration, and remind him the bottle receipt matches the T-ZAM tag.",
          points: 12,
          feedback:
            "Complete closure: documents verified, receipts matched, passenger directed onward. This is the SAPS closing SOP.",
          consequence:
            "Passenger departs smiling. Flight PK 858 closes on time with zero gate surprises.",
          best: true,
        },
        {
          id: "s1-d5-b",
          text: "Hand the boarding pass quickly and shout 'NEXT!' — the queue is long.",
          points: 6,
          feedback:
            "Speed is good but skipping receipt handover and onboarding directions causes gate-level confusion later.",
          best: false,
        },
        {
          id: "s1-d5-c",
          text: "Ask him for a small 'baksheesh' for the special tag before handing documents.",
          points: 0,
          feedback:
            "Absolutely forbidden — soliciting payment is gross misconduct and an instant dismissal offence.",
          best: false,
        },
      ],
    },
  ],
  debriefRules: [
    {
      source: "IATA — Liquids (LAGs)",
      ref: "Cabin rule: containers ≤100ml in a 1L clear bag",
      detail:
        "Self-filled 1L pouches exceed the 100ml cabin limit — prohibited as cabin baggage regardless of content.",
    },
    {
      source: "KSA GACA Directive — Zamzam",
      ref: "5L factory-sealed bottle, hold only, 1 per passenger",
      detail:
        "Loose/self-filled pouches are prohibited in cabin AND hold — depressurisation and leakage risk. Only official GACA factory bottles (max 5L) accepted, checked baggage only.",
    },
    {
      source: "SAPS SOP — Special Baggage",
      ref: "LRT + T-ZAM special tag workflow",
      detail:
        "Limited Release Tag documents fragile/limited-release acceptance; T-ZAM ensures ramp routing and traceability in Altéa (BAG/…/T-ZAM, SR ZAMZ, PADD remark).",
    },
  ],
  checklist: [
    "Greet passenger; ask what is inside the box before accepting anything",
    "Confirm pouches are self-filled and >100ml → refuse cabin carriage (LAG rule)",
    "Explain GACA prohibition: loose pouches banned in hold (leak/depressurisation)",
    "Offer the compliant option: 1 × official 5L GACA factory-sealed bottle in hold",
    "PD/JEDLHE/24OCT then RT/<NAME> in Altéa to pull the flight and PNR",
    "SR ZAMZ-P1/5.0KG — add the special service request",
    "BAG/1/5.0/T-ZAM — tag the bottle with special handling code",
    "PADD-EXC BGG … — log the exception remark (audit trail)",
    "Apply LRT + T-ZAM tag physically; upright, cushioned packing",
    "Hand BP + bag receipts, direct passenger to security/immigration",
  ],
  badgeId: "zamzam-specialist",
};

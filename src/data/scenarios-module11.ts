import type { Scenario } from "@/lib/types";

/**
 * MODULE 11 — Gate No-Show, Bag Offload & Cut-off Discipline (The Vanishing Passenger)
 * Two no-shows with checked bags, one nephew begging for five minutes, one backpack.
 */
export const scenarioNoShow: Scenario = {
  id: "m11-noshow",
  moduleNo: 11,
  code: "M11-NOSHW",
  title: "The Vanishing Passenger",
  category: "gate-ops",
  tags: ["No-Show", "Bag Offload", "Cut-off", "FCL", "Unattended Bag"],
  difficulty: 3,
  xpBase: 150,
  minutes: 12,
  summary:
    "Boarding is complete on the Jeddah Umrah flight — but two passengers with checked bags have vanished, and one of them left a backpack by the gate.",
  briefing:
    "You are the SAPS Traffic Assistant at Gate C07, Lahore (LHE), flight PK 644 LHE–JED, 24 OCT, STD 1030, cut-off 0955. Boarding is complete: 2 no-shows — RASHID (seat 22C, 2 checked bags) and NADEEM (seat 18B, 1 checked bag). A nephew sprints up begging you to hold the flight because 'uncle is in duty free'. And a grey backpack stands unattended beside seat C07-14. Manage the cut-off, the bag offloads and the unattended item — in the right order.",
  objectives: [
    "Hold the cut-off line: the flight closes on schedule, always",
    "Offload no-show passengers AND their bags (XX + LMC with exact tags)",
    "Trigger ASF protocol for the unattended backpack — never touch, never ignore",
    "Close the flight (FCL) and handle the late arrival professionally",
  ],
  passenger: {
    name: "Rashid Mahmood Ansari",
    age: 54,
    nationality: "Pakistan",
    passportNo: "AB-3344771",
    passportExpiry: "12 SEP 2028",
    pnr: "YHN2DK",
    ticketNo: "214-4311009988",
    flight: "PK 644",
    route: "LHE → JED",
    date: "24 OCT",
    seat: "22C",
    fareClass: "Y — Economy Umrah",
    allowance: "1PC / 30KG + Zamzam 5L (GACA)",
    originStation: "LHE — Gate C07",
    avatarTone: "rose",
    visa: "Umrah Visa — valid",
  },
  baggage: [
    { id: "b1", label: "Rashid — suitcase #1", weightKg: 24.1, type: "checked", note: "MUST OFFLOAD — no-show" },
    { id: "b2", label: "Rashid — suitcase #2 (Zamzam 5L inside)", weightKg: 9.6, type: "checked", note: "MUST OFFLOAD — no-show" },
    { id: "b3", label: "Nadeem — duffel", weightKg: 14.3, type: "checked", note: "MUST OFFLOAD — no-show" },
    { id: "b4", label: "Grey backpack near seat C07-14", weightKg: 3.8, type: "cabin", note: "UNATTENDED — ASF protocol" },
  ],
  documents: {
    passport: [
      { key: "name", label: "Name", value: "ANSARI, RASHID MAHMOOD" },
      { key: "nat", label: "Nationality", value: "PAKISTAN" },
      { key: "dob", label: "DOB", value: "30 JUL 1970" },
      { key: "exp", label: "Expiry", value: "12 SEP 2028", highlight: "ok" },
    ],
    visa: [
      { key: "type", label: "Visa", value: "UMRAH — VALID" },
      { key: "status", label: "Status", value: "NOT USED — PAX NEVER BOARDED", highlight: "bad" },
    ],
    ticket: [
      { key: "pnr", label: "PNR", value: "YHN2DK" },
      { key: "tkt", label: "Ticket", value: "214-4311009988" },
      { key: "fl", label: "Flight", value: "PK 644 V 24OCT LHEJED HK1" },
      { key: "bp", label: "Boarding pass", value: "ISSUED — 22C — NOT SCANNED", highlight: "bad" },
    ],
  },
  steps: [
    {
      type: "dialogue",
      id: "m11-d1",
      prompt: "The nephew arrives at speed. Manage the first 30 seconds.",
      passengerLines: [
        "'Bhai, BHAI! My uncle Rashid — 22C — he is in duty free buying prayer mats! Two minutes, hold the plane two minutes, he is old and this is his first Umrah!'",
      ],
      options: [
        {
          id: "m11-d1-a",
          text: "Listen to me carefully: the cut-off for this flight was 09:55 and it is now 10:01 — I cannot reopen acceptance, and the crew must close the door soon for an on-time departure. What I CAN do: page him one final time through the terminal, and the transfer desk inside will rebook him on tonight's PK 646 — his bags will be pulled and handed back to him. Go to the duty free and bring him to the transfer desk NOW, not to me.",
          points: 16,
          feedback:
            "Correct: states the hard limit (cut-off), offers every legitimate help (final page, rebooking, bag return), and redirects the runner to the right desk. Firm, kind, zero ambiguity.",
          consequence:
            "The nephew blinks, then sprints toward duty free. You lift the page phone: 'Final call, paging RASHID MAHMOOD ANSARI…'",
          best: true,
        },
        {
          id: "m11-d1-b",
          text: "Okay, two minutes — I will hold the door. But ONLY two minutes, tell him to run!",
          points: 0,
          feedback:
            "You just breached the cut-off and the departure slot: late door closure cascades into ATC slot loss and every connecting passenger's journey. Cut-off discipline is absolute.",
          best: false,
        },
        {
          id: "m11-d1-c",
          text: "Not my problem — he missed his flight, tell him to buy a new ticket.",
          points: 4,
          feedback:
            "Right decision, wrong service: no page, no rebooking direction, no bag information. A no-show's family deserves the same procedure, calmly delivered.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "m11-t1",
      prompt:
        "Process the no-shows in Altéa DCS: identify, offload passengers, pull their bags, close the flight.",
      intro: "10:03 — final page unanswered. Begin the no-show procedure for RASHID/P1 and NADEEM/P2.",
      commands: [
        {
          pattern: "^PD/LHEJED/24OCT$",
          display: "PD/LHEJED/24OCT",
          hint: "Passenger Display — pull up flight PK 644 LHE→JED for 24 OCT.",
          output: [
            "FLIGHT: PK 644  LHE-JED  EQP 320  STATUS: BOARDING",
            "STD 1030  GATE C07  CUTOFF 0955  ROWS 3-6",
            "PAX F/C/Y: 006/014/138   BAGS 121/1693.0K",
            "NB (NO-BOARDS): 2  RASHID/P1 22C  NADEEM/P2 18B",
          ],
          errorHint: "Format: PD/<origin><destination>/<DDMMM> — e.g. PD/LHEJED/24OCT",
          points: 8,
        },
        {
          pattern: "^LI/NB$",
          display: "LI/NB",
          hint: "List the no-board passengers with their bag counts.",
          output: [
            "NO-BOARDS PK644:",
            "  P1 RASHID/22C  BAGS 2 (0456-11889901/902)",
            "  P2 NADEEM/18B  BAGS 1 (0456-11889915)",
            "OFFLOAD REQUIRED: PAX 2 / BAGS 3",
          ],
          errorHint: "Format: LI/NB — the no-board list drives the offload procedure",
          points: 8,
        },
        {
          pattern: "^XX/P1$",
          display: "XX/P1",
          hint: "Offload passenger 1 (Rashid) from the accepted list.",
          output: [
            "OK P1 OFFLOADED — NO-SHOW",
            "SEAT 22C RELEASED  BAGS 2 PENDING PULL",
          ],
          errorHint: "Format: XX/P<n> — e.g. XX/P1 for Rashid",
          points: 8,
        },
        {
          pattern: "^LMC-2/.*",
          display: "LMC-2/P1 P2 OFFLOAD BAGS 0456-11889901/902/915",
          hint: "Send the load message — all THREE bags must leave the aircraft.",
          output: [
            "LMC SENT TO LCR  PK644  24OCT",
            "PAX -2  BAGS -3/48.0K  TAGS ...901/902/915",
            "LCR ACK  RAMP PULLING BAGS NOW",
          ],
          errorHint:
            "Start with LMC-2/ and list the bags, e.g. LMC-2/P1 P2 OFFLOAD BAGS 0456-11889901/902/915",
          points: 8,
        },
        {
          pattern: "^FCL/LHEJED/24OCT$",
          display: "FCL/LHEJED/24OCT",
          hint: "Flight closure — finalise PK 644 after bag pulls are confirmed.",
          output: [
            "FLIGHT CLOSED  PK644  LHE-JED  24OCT",
            "FINAL PAX: 156  BAGS: 118/1645.0K",
            "CUTOFF ENFORCED  DEPARTURE ON TIME",
          ],
          errorHint: "Format: FCL/<origin><destination>/<DDMMM> — e.g. FCL/LHEJED/24OCT",
          points: 8,
        },
      ],
    },
    {
      type: "decision",
      id: "m11-d2",
      prompt: "The grey backpack by seat C07-14 — your move.",
      situation:
        "A grey backpack stands unattended beside gate seat C07-14. The nephew mentioned his uncle was shopping. Two minutes to departure.",
      options: [
        {
          id: "m11-d2-a",
          text: "Do NOT touch it and do NOT let anyone else touch it: cordon the immediate area with chairs, radio ASF with exact location ('Gate C07, row of seats, grey backpack, unattended 10 minutes'), give them your name, and confirm whether boarding continues. The crew decides with ASF — you never make that call alone.",
          points: 16,
          feedback:
            "Correct ASF protocol: never touch, never move, cordon, report with precise location and timeline, and let AVSEC command the area. Unattended items are ASF property from the first second.",
          consequence:
            "ASF arrives in 90 seconds, X-rays the bag — prayer mats and a thermos. Uncle Rashid's shopping, retrieved from under the seat. Relief all around.",
          best: true,
        },
        {
          id: "m11-d2-b",
          text: "Open it quickly to see if it is dangerous — if it is just clothes, hand it to the crew.",
          points: 0,
          feedback:
            "Absolutely forbidden: touching or opening an unattended item is the one action that can turn a false alarm into a real casualty count. Never touch. Ever.",
          best: false,
        },
        {
          id: "m11-d2-c",
          text: "Move it behind the podium yourself so it stops alarming passengers.",
          points: 0,
          feedback:
            "Moving it transfers the risk to your position and contaminates the ASF investigation. Cordon in place — the item stays where it is.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m11-d3",
      prompt: "The no-show arrives at 10:02 — one minute after closure.",
      passengerLines: [
        "Rashid hurries up, prayer mats under his arm: 'Beta, I am here! I am here! Give me my boarding card, the plane is still there!'",
      ],
      options: [
        {
          id: "m11-d3-a",
          text: "Chacha, I am sorry — the flight closed at 09:55 and the door is now shut; nobody can board, not even for one minute, that is the law of the slot. Your two bags have been pulled and are safe at oversized baggage — the transfer desk inside will rebook you on tonight's PK 646 at no argument from me, and your Umrah visa is unaffected. Sit with your nephew, drink water, and let me walk you both to the desk right now.",
          points: 16,
          feedback:
            "Excellent: truth without blame ('the law of the slot'), the bag status answered before he asks, the rebooking path handed over, and dignity preserved with a personal escort.",
          consequence:
            "He grips your forearm: 'Beta, first Umrah…' — 'And it starts tonight instead, chacha. Come.'",
          best: true,
        },
        {
          id: "m11-d3-b",
          text: "You are late, sir. The flight is gone. Go to the transfer desk yourself — it is signposted.",
          points: 4,
          feedback:
            "Cold but not incorrect — yet a no-show who just lost his Umrah moment is at peak distress. Escort him; that is the SAPS standard.",
          best: false,
        },
        {
          id: "m11-d3-c",
          text: "Knock on the jet bridge and ask the crew to reopen the door 'just this once'.",
          points: 0,
          feedback:
            "A closed door is closed for security, slot and weight-and-balance reasons. Reopening after closure is prohibited without dispatch — and 'once' is how habits are born.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "m11-d4",
      prompt: "Final verification before pushback.",
      situation:
        "The ramp calls: 'Two bags offloaded, but we count THREE tags in the LMC — confirm your offload list matches the aircraft before we release.'",
      options: [
        {
          id: "m11-d4-a",
          text: "Confirm the third bag: Nadeem's duffel tag 0456-11889915 — he is also a no-show, so all three tags off the aircraft. Re-verify LI/NB output against the ramp count, get LCR's acknowledgement, then release. A bag that flies without its passenger is a security violation; a bag left behind by accident is a service failure — the LMC must match reality exactly.",
          points: 12,
          feedback:
            "Correct: reconciled pax↔bag↔tag triads, verified against LI/NB, secured LCR ACK before release. This three-way match is the heart of gate integrity.",
          consequence:
            "Ramp: 'Three off, count matches. Good catch.' PK 644 pushes back 1030 sharp — 156 pilgrims, on time, every bag accounted for.",
          best: true,
        },
        {
          id: "m11-d4-b",
          text: "Tell the ramp to just remove all three and stop double-checking — the LMC was already sent.",
          points: 6,
          feedback:
            "The action is right but the verification is skipped: 'sent' is not 'confirmed'. Reconcile the count and log the ACK — every time.",
          best: false,
        },
        {
          id: "m11-d4-c",
          text: "Leave Nadeem's duffel on board — he might make a later connection and the bag will meet him in Jeddah.",
          points: 0,
          feedback:
            "A bag whose owner is not on board MUST come off — positive passenger-bag matching is a security mandate worldwide. This is the rule you never bend.",
          best: false,
        },
      ],
    },
  ],
  debriefRules: [
    {
      source: "IATA — Flight Closure",
      ref: "Cut-off time is absolute; reopening after closure is prohibited",
      detail:
        "Acceptance closes at cut-off (STD − 35 min here). Late door closures cascade into slot loss and connection failures. The transfer desk rebooks; the gate holds the line.",
    },
    {
      source: "IATA AVSEC — Positive Passenger-Bag Match",
      ref: "No bag flies without its passenger on board",
      detail:
        "Every no-show triggers XX (pax offload) + LMC (bag offload with exact tags) + ramp reconciliation before pushback.",
    },
    {
      source: "ASF / SAPS — Unattended Item Protocol",
      ref: "Never touch · cordon · report location + timeline · ASF commands",
      detail:
        "An unattended item belongs to ASF from discovery. Cordon with distance, radio with precision, and let AVSEC own the decision to continue boarding.",
    },
  ],
  checklist: [
    "State the cut-off limit first; offer page + rebooking + bag return",
    "Never hold the door past cut-off — slots and safety outrank pleading",
    "PD/LHEJED/24OCT then LI/NB for the no-board list",
    "XX/P<n> for EACH no-show passenger",
    "LMC-2/<text> with ALL bag tags — pax↔bag↔tag triads",
    "Unattended item: never touch, cordon, radio ASF with exact location",
    "FCL/<pair>/<date> only after ramp confirms bag pulls",
    "Greet the late arrival with truth + dignity: rebook, escort, reassure",
    "Reconcile LMC ↔ ramp count ↔ LI/NB before release; log LCR ACK",
    "Departure on time is the scoreboard of gate discipline",
  ],
  badgeId: "cutoff-commander",
};

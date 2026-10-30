import type { Scenario } from "@/lib/types";

/**
 * MODULE 10 — Involuntary Denied Boarding & Priority Cascade (Last Seat Standing)
 * One seat short after the last volunteer withdrew — cascade: ID90 first, revenue last.
 */
export const scenarioIDB: Scenario = {
  id: "m10-idb",
  moduleNo: 10,
  code: "M10-IDB",
  title: "Last Seat Standing",
  category: "overbooking",
  tags: ["IDB", "Offload", "Priority Cascade", "ID90", "LMC"],
  difficulty: 4,
  xpBase: 170,
  minutes: 14,
  summary:
    "PK 373 to Karachi is one seat over after the final volunteer withdrew. The correct cascade spares every revenue passenger — if you execute it in order.",
  briefing:
    "You are the SAPS Traffic Assistant at the podium, Lahore (LHE), flight PK 373 LHE–KHI, 24 OCT. The flight is oversold by one: 3 volunteers accepted earlier, but one withdrew at the last minute. On board count: 2 staff on ID90 privileges and a full load of revenue passengers, including a discount-fare professor who checked in FIRST and a full-fare student who checked in LAST. Apply the SAPS offload cascade in strict order, communicate it without drama, and send the load message before closure.",
  objectives: [
    "Apply the offload cascade: volunteers → ID90/staff → lowest fare class → last check-in",
    "Never offload a confirmed revenue passenger while a staff/ID90 seat is releasable",
    "Send the LMC load-control message so the offloaded passenger's bags leave the aircraft",
    "Close the flight (FCL) with an exact headcount and bag count",
  ],
  passenger: {
    name: "Salman Butt",
    age: 41,
    nationality: "Pakistan",
    passportNo: "DF-5520018",
    passportExpiry: "27 MAY 2029",
    pnr: "WQF3KH",
    ticketNo: "214-4288334456",
    flight: "PK 373",
    route: "LHE → KHI",
    date: "24 OCT",
    seat: "16A",
    fareClass: "Y — Economy Flex (full fare)",
    allowance: "1PC / 30KG (Flex)",
    originStation: "LHE — Gate Podium A11",
    avatarTone: "amber",
  },
  baggage: [
    { id: "b1", label: "Mr. Butt — two-piece suit carrier", weightKg: 8.2, type: "checked" },
    { id: "b2", label: "ID90 staff (P6) — duffel on the flight", weightKg: 11.5, type: "checked", note: "MUST OFFLOAD with P6" },
  ],
  documents: {
    passport: [
      { key: "name", label: "Name", value: "BUTT, SALMAN" },
      { key: "nat", label: "Nationality", value: "PAKISTAN" },
      { key: "dob", label: "DOB", value: "11 FEB 1985" },
      { key: "exp", label: "Expiry", value: "27 MAY 2029", highlight: "ok" },
    ],
    ticket: [
      { key: "pnr", label: "PNR", value: "WQF3KH" },
      { key: "tkt", label: "Ticket", value: "214-4288334456" },
      { key: "fl", label: "Flight", value: "PK 373 Y 24OCT LHEKHI HK1" },
      { key: "seat", label: "Seat", value: "16A" },
    ],
  },
  steps: [
    {
      type: "dialogue",
      id: "m10-d1",
      prompt: "Assess the seat crisis calmly.",
      passengerLines: [
        "Supervisor radio: 'Podium A11 — final count shows one seat over on 373. The fourth volunteer withdrew at the lounge. Sort it, we close in 25 minutes.' Mr. Butt arrives at the podium with his suit carrier: 'I am on this flight, 16A, confirmed — why is everyone staring at a screen?'",
      ],
      options: [
        {
          id: "m10-d1-a",
          text: "Good afternoon sir, you ARE confirmed and you ARE flying — give me two minutes to finish the seat reconciliation before I answer anything else. (To the screen: pull the standby list and the accepted-passenger list — one seat short is a sequence problem, not a passenger problem.)",
          points: 8,
          feedback:
            "Correct: never feed passenger anxiety mid-crisis. Reconcile lists first — the cascade will tell you who, and it may not require ANY revenue offload.",
          consequence:
            "LI/STBY shows: 2 × ID90 staff onboard, 3 revenue standbys. The seat math is now a procedure, not a panic.",
          best: true,
        },
        {
          id: "m10-d1-b",
          text: "Sir, we oversold the flight — someone at this gate has to come off, and it may be you. Please sit down.",
          points: 4,
          feedback:
            "Unforced error: announcing a possible offload before checking the cascade creates panic, and the answer may be an ID90 release — no revenue passenger involved.",
          best: false,
        },
        {
          id: "m10-d1-c",
          text: "Ignore the count — the ramp usually finds a spare jump seat situation anyway.",
          points: 0,
          feedback:
            "Flying over capacity is a legal and safety violation. The load sheet is not a suggestion.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m10-d2",
      prompt: "Apply the cascade — who comes off, and in what order?",
      passengerLines: [
        "The professor (discount fare, checked in FIRST at 09:02) waves at you hopefully. Mr. Butt (full fare, checked in LAST at 10:41) stands beside him. Two ID90 staff sit in 2A and 2B reading newspapers.",
      ],
      options: [
        {
          id: "m10-d2-a",
          text: "The cascade decides, not the loudest person: one seat short, no volunteers left → first release the ID90 staff seats (staff travel is a privilege over revenue, always) → only if the flight were STILL over would we touch revenue, and then lowest fare class first, latest check-in first. Here: offload an ID90 seat, and Mr. Butt and the professor both fly. Nobody in the cabin needs to know how close it came.",
          points: 16,
          feedback:
            "Textbook cascade: ID90 before ANY revenue passenger; fare class and check-in time are the revenue tiebreakers — but they never trigger while a staff seat is releasable.",
          consequence:
            "You lift the phone to the podium line: 'Dispatch — release P6 on 373, ID90 to next available…' The professor keeps reading; Mr. Butt keeps breathing.",
          best: true,
        },
        {
          id: "m10-d2-b",
          text: "Offload the professor — lowest fare AND he checked in first, so he had the seat the shortest time anyway.",
          points: 4,
          feedback:
            "Cascade violation: revenue passengers are only touched AFTER ID90 release. The professor checked in FIRST and holds a CONFIRMED seat — the staff privilege outranks it.",
          best: false,
        },
        {
          id: "m10-d2-c",
          text: "Offload Mr. Butt — he checked in last, that is the rule, done.",
          points: 4,
          feedback:
            "Wrong on two counts: you skipped the ID90 release entirely, and he is FULL FARE — the 'last check-in' tiebreaker only orders passengers WITHIN the same revenue class, after staff seats.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "m10-t1",
      prompt:
        "Execute the offload in Altéa DCS: release P6, send the bag-offload LMC, verify standbys and close the flight.",
      intro: "Supervisor approves the ID90 release on PK 373. Execute it cleanly — bags, count, closure.",
      commands: [
        {
          pattern: "^PD/LHEKHI/24OCT$",
          display: "PD/LHEKHI/24OCT",
          hint: "Passenger Display — pull up flight PK 373 LHE→KHI for 24 OCT. (Type the real city pair!)",
          output: [
            "FLIGHT: PK 373  LHE-KHI  EQP 320  STATUS: BOARDING",
            "STD 1230  GATE A11  CUTOFF 1155  ROWS 3-7",
            "PAX F/C/Y: 004/016/142   BAGS 119/776.5K",
          ],
          errorHint: "Format: PD/<origin><destination>/<DDMMM> — this flight is PD/LHEKHI/24OCT",
          points: 8,
        },
        {
          pattern: "^XX/P6$",
          display: "XX/P6",
          hint: "Offload passenger 6 (the ID90 staff seat) from the accepted list.",
          output: [
            "OK P6 OFFLOADED — STAFF ID90",
            "SEAT 2B RELEASED  PNR RETAINED FOR NEXT FLIGHT",
            "REVENUE PAX: NO CHANGES",
          ],
          errorHint: "Format: XX/P<n> — e.g. XX/P6 releases the staff passenger",
          points: 8,
        },
        {
          pattern: "^LMC-1/.*",
          display: "LMC-1/P6 OFFLOAD 1 BAG TAG 0456-11667788",
          hint: "Send the load control message — passenger AND his checked bag must come off.",
          output: [
            "LMC SENT TO LCR  PK373  24OCT",
            "PAX -1 (ID90 P6)  BAGS -1/11.5K  TAG 0456-11667788",
            "LCR ACK  WEIGHT & BALANCE UPDATED",
          ],
          errorHint:
            "Start with LMC-1/ and describe the offload, e.g. LMC-1/P6 OFFLOAD 1 BAG TAG 0456-11667788",
          points: 8,
        },
        {
          pattern: "^LI/STBY$",
          display: "LI/STBY",
          hint: "List standby passengers — confirm the seat situation is now clear.",
          output: [
            "STBY LIST PK373:",
            "  P7 GORAYA/ID90 — WAITLIST  NEXT: PK 377",
            "  P8 NADEEM/Y — WAITLIST  SEAT NOW AVAILABLE 16A",
            "FLIGHT: 0 OVER  ***BALANCED***",
          ],
          errorHint: "Format: LI/STBY — the standby list is your reconciliation proof",
          points: 8,
        },
        {
          pattern: "^FCL/LHEKHI/24OCT$",
          display: "FCL/LHEKHI/24OCT",
          hint: "Flight closure — finalise PK 373 with the corrected count.",
          output: [
            "FLIGHT CLOSED  PK373  LHE-KHI  24OCT",
            "FINAL PAX: 162  BAGS: 118/765.0K",
            "CUTOFF MET  ON-TIME DEPARTURE CONFIRMED",
          ],
          errorHint: "Format: FCL/<origin><destination>/<DDMMM> — e.g. FCL/LHEKHI/24OCT",
          points: 8,
        },
      ],
    },
    {
      type: "decision",
      id: "m10-id1",
      prompt: "The professor tries to volunteer — after the cascade closed.",
      situation:
        "The professor approaches the podium: 'Young man, I heard there was trouble. I am happy to come off — is the PKR 20,000 volunteer compensation still available? My time is flexible.' The flight is now balanced.",
      options: [
        {
          id: "m10-id1-a",
          text: "Decline with the rule, not with annoyance: 'Sir, the volunteer window closed when the flight balanced — your seat is confirmed and the aircraft needs you exactly where you are. Compensation exists for DENIED boarding, and you are not being denied anything.' Reconfirm his seat on the display so he watches the word CONFIRMED with his own eyes.",
          points: 16,
          feedback:
            "Correct: the cascade is a legal sequence, not a bargaining table. Offloading a balanced flight re-opens the crisis and pays compensation for nothing — 'confirmed' must mean confirmed.",
          consequence:
            "He looks at the screen, sees CONFIRMED beside his name, and returns to his seat with the satisfaction of a man offered money who kept his seat instead.",
          best: true,
        },
        {
          id: "m10-id1-b",
          text: "Accept his offer — send another LMC, take him off and pay the PKR 20,000. A volunteer is a volunteer.",
          points: 4,
          feedback:
            "Wrong: volunteering exists to RESOLVE an oversale, not to profit from a balanced flight. You would pay cash, re-cut the load sheet and delay departure for zero operational need.",
          best: false,
        },
        {
          id: "m10-id1-c",
          text: "Deal quietly: 'Volunteer now and I will also move you to 1A on tonight's flight and throw in the lounge.'",
          points: 0,
          feedback:
            "Inventing compensation packages outside the authority table is how counters leak money — and how audit reports get your name in them.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m10-d3",
      prompt: "Handle the compensation question before it becomes a scene.",
      passengerLines: [
        "The released ID90 officer approaches the podium calmly: 'Young man, I have flown this route twelve times on staff privileges. Explain to me why it was me today.'",
      ],
      options: [
        {
          id: "m10-d3-a",
          text: "Sir, today the flight was one seat over after a volunteer withdrew, and the procedure ranks staff standby below confirmed revenue passengers — that rank protects the fare-paying cabin, and it is also what protects YOUR privileges on every other flight. You are protected on PK 377 this evening, business class if available, and your bag has been pulled and re-tagged. I am sorry for the inconvenience — the rank did the deciding, not me.",
          points: 8,
          feedback:
            "Excellent: explains the rule's logic (protects revenue cabin AND the privilege system), gives the rebooking facts, and owns the apology without inventing blame.",
          consequence:
            "He straightens his uniform: 'The rank did the deciding. Good answer, son. I will take 377.'",
          best: true,
        },
        {
          id: "m10-d3-b",
          text: "Blame the system loudly: 'If you have a problem, complain to the station manager — nothing to do with me.'",
          points: 4,
          feedback:
            "Deflection invites escalation. You executed the procedure; explain it with respect and hand the rebooking facts.",
          best: false,
        },
        {
          id: "m10-d3-c",
          text: "Whisper: 'Sir, if you insist, I can offload Mr. Butt instead and put you back on.'",
          points: 0,
          feedback:
            "Offering to reverse a compliance decision as a favour to seniority is corruption, and it would offload a confirmed fare-paying passenger for nothing.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "m10-d4",
      prompt: "Final integrity check before pushback.",
      situation:
        "The gate supervisor asks one last question: 'Dispatch wants a buffer seat for a late ramp crew ID90 — shall we offload the professor to create it, since he is the cheapest ticket?'",
      options: [
        {
          id: "m10-d4-a",
          text: "No. The flight is now balanced and legal — a 'buffer' is not an oversell. Confirmed revenue passengers are never offloaded for staff convenience once the count closes; the ramp crew rides standby like anyone else. Decline, confirm the final count, and hand over the paperwork.",
          points: 12,
          feedback:
            "Correct: the cascade exists to protect revenue passengers — a convenience buffer is not a cascade condition. Balanced means final.",
          consequence:
            "Supervisor nods, signs. PK 373 pushes back at 1230 with 162 souls, 118 bags, zero incidents.",
          best: true,
        },
        {
          id: "m10-d4-b",
          text: "Agree — the professor is one man, the fare is cheap, and the ramp crew keeps the operation smooth.",
          points: 4,
          feedback:
            "This is exactly how the cascade gets corrupted: 'just one more seat' for whoever asks. His confirmed ticket outranks a convenience request, full stop.",
          best: false,
        },
        {
          id: "m10-d4-c",
          text: "Let dispatch decide — send a vague LMC and see what comes back.",
          points: 6,
          feedback:
            "Abdication: the podium owns the count and the cascade. Vague load messages are how wrong bags and wrong counts happen.",
          best: false,
        },
      ],
    },
  ],
  debriefRules: [
    {
      source: "SAPS SOP — Offload Cascade",
      ref: "Volunteers → ID90/staff → lowest fare class → latest check-in",
      detail:
        "Staff/ID90 privileges rank below confirmed revenue carriage. Revenue tiebreakers apply only after staff release and only when the flight is still over.",
    },
    {
      source: "IATA — Load Control (LMC)",
      ref: "Every passenger offload demands a matching bag offload message",
      detail:
        "LMC-<n>/… to load control keeps weight & balance legal: pax −1 means bags −1 with the exact tag numbers. An unoffloaded bag on an offloaded passenger is a security event, not an inconvenience.",
    },
    {
      source: "IATA — Denied Boarding",
      ref: "IDB compensation applies only to INVOLUNTARY revenue offloads",
      detail:
        "In this scenario no revenue passenger was denied boarding, so no IDB compensation is due. Volunteers receive agreed benefits; staff travel on privilege has no compensation entitlement beyond rebooking.",
    },
  ],
  checklist: [
    "Reconcile the count FIRST — never announce offloads during the panic phase",
    "Cascade order: volunteers → ID90/staff → lowest fare → latest check-in",
    "XX/P<n> — offload the correct passenger number (staff before revenue)",
    "LMC-1/<text> — pax AND bags with exact tag numbers to load control",
    "LI/STBY — verify the flight is balanced after the release",
    "FCL/<pair>/<date> — close with exact final headcount and bag count",
    "Explain the rank logic respectfully to the affected traveller",
    "Rebook the offloaded traveller and confirm bag re-tagging",
    "Decline 'buffer seat' requests — balanced means final",
    "Zero revenue IDB compensation when the cascade spares revenue pax",
  ],
  badgeId: "idb-negotiator",
};

import type { Scenario } from "@/lib/types";

/**
 * MODULE 4 — Overbooking, Standby & Denied Boarding (IDB)
 * Flight oversold by 3 seats, check-in closing in 15 minutes, 5 revenue waitlist + 2 staff ID90.
 */
export const scenarioOverbooking: Scenario = {
  id: "m4-overbook",
  moduleNo: 4,
  code: "M4-IDB",
  title: "Oversold by Three",
  category: "overbooking",
  tags: ["Overbooking", "IDB", "Standby", "Priority", "Flight Closure"],
  difficulty: 4,
  xpBase: 180,
  minutes: 15,
  summary:
    "PK 364 LHE–KHI is oversold by 3 seats in Y. Check-in closes in 15 minutes with 5 revenue waitlist passengers and 2 staff ID90 tickets in the queue.",
  briefing:
    "You are the SAPS Traffic Assistant at the podium, Lahore (LHE), flight PK 364 LHE–KHI, STD 18:40. Load control confirms Y class is oversold by 3. At the counter: 5 revenue passengers on the waitlist and 2 airline staff holding ID90 space-available tickets. Check-in closes in 15 minutes. Manage the Altéa standby list, apply the boarding priority hierarchy (Revenue > Commercial Upgrades > Staff Duty > Staff ID90), seek volunteers, and close the flight on time.",
  objectives: [
    "Pull the flight status and standby list in Altéa",
    "Apply the priority hierarchy: Revenue > Commercial Upgrades > Staff Duty > Staff ID90",
    "Seek volunteers with compensation before invoking involuntary denied boarding",
    "Close the flight exactly at the cutoff with the final tally",
  ],
  passenger: {
    name: "Multiple — Queue at Podium",
    age: 0,
    nationality: "Mixed",
    passportNo: "—",
    passportExpiry: "—",
    pnr: "5 PAX WAITLIST + 2 ID90",
    ticketNo: "—",
    flight: "PK 364",
    route: "LHE → KHI",
    date: "24 OCT",
    seat: "Y OVERSOLD -3",
    fareClass: "Y — oversold by 3",
    allowance: "—",
    originStation: "LHE — SAPS Podium",
    avatarTone: "violet",
  },
  baggage: [],
  documents: {
    ticket: [
      { key: "fl", label: "Flight", value: "PK 364 J 24OCT LHEKHI" },
      { key: "std", label: "STD / Cutoff", value: "18:40 / 18:10 — 15 MIN", highlight: "warn" },
      { key: "load", label: "Load", value: "Y: -3 (OVERSOLD)", highlight: "bad" },
      { key: "stby", label: "Standby", value: "5 REVENUE + 2 ID90", highlight: "warn" },
    ],
  },
  steps: [
    {
      type: "dialogue",
      id: "s4-d1",
      prompt: "First move when the load sheet shows minus three.",
      passengerLines: [
        "(Radio: 'Podium, load control — PK 364 Y class oversold by three. Five revenue waitlist and two ID90 in your queue. Fifteen minutes to closure. Over.')",
      ],
      options: [
        {
          id: "s4-d1-a",
          text: "Copy that. Pulling the flight display and standby list now — I need the exact cabin breakdown, who is already holding seats, and the standby priorities before anyone is offloaded.",
          points: 8,
          feedback:
            "Correct instinct: data before decisions. Never offload on radio chatter — verify in Altéa first.",
          consequence:
            "Terminal is ready. The queue behind you grows: a family with an infant, two business travellers, one staff member in uniform.",
          best: true,
        },
        {
          id: "s4-d1-b",
          text: "Offload the last three check-ins immediately — problem solved in ten seconds.",
          points: 0,
          feedback:
            "Illegal shortcut: IDB requires priority evaluation + volunteer search + compensation rules. Random offloads trigger complaints and PCAA penalties.",
          best: false,
        },
        {
          id: "s4-d1-c",
          text: "Tell load control to fix it and keep checking in everyone as normal.",
          points: 2,
          feedback:
            "Passing the buck: at 15 minutes to closure, the counter owns the resolution. Load control reports the problem; the station solves it.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "s4-t1",
      prompt: "Verify the overbook and the standby queue in Altéa.",
      intro:
        "Pull the flight display and the standby list. Note the negative Y balance and each standby passenger's priority code.",
      commands: [
        {
          pattern: "^PD/LHEKHI/24OCT$",
          display: "PD/LHEKHI/24OCT",
          hint: "Passenger Display for PK 364 LHE→KHI, 24 OCT.",
          output: [
            "FLIGHT: PK 364  LHE-KHI  EQP 320  STATUS: OPEN",
            "STD 1840  GATE C02  CUTOFF 1810",
            "PAX F/C/Y: 001/008/152  AUTH Y:149",
            "Y BALANCE: -3  OVERSOLD",
          ],
          errorHint: "Format: PD/<citypair>/<date> — PD/LHEKHI/24OCT",
          points: 10,
        },
        {
          pattern: "^LI/STBY$",
          display: "LI/STBY",
          hint: "List the standby passengers with their priority codes.",
          output: [
            "STANDBY LIST PK364/24OCT",
            "1 TARIQ,OMAR      REV-WL  Y  PRIORITY R1",
            "2 CHAUDHRY,SANA   REV-WL  Y  PRIORITY R2",
            "3 MALIK,ADNAN     REV-WL  Y  PRIORITY R3",
            "4 IQBAL,REHMAN    REV-WL  Y  PRIORITY R4",
            "5 SYED,ZAINAB     REV-WL  Y  PRIORITY R5",
            "6 OFFICER,KASHIF  STAFF-DUTY  PRIORITY S1",
            "7 OFFICER,NAVEED  STAFF-ID90  PRIORITY S2",
          ],
          errorHint: "Command: LI/STBY — lists standby with priority codes (R = revenue, S = staff).",
          points: 10,
        },
      ],
    },
    {
      type: "decision",
      id: "s4-d2",
      prompt: "Choose the resolution strategy.",
      situation:
        "Y is -3. Five revenue waitlist, one staff duty (S1), one staff ID90 (S2). Gate is C02, closure in 12 minutes.",
      options: [
        {
          id: "s4-d2-a",
          text: "Announce a volunteer call for the next flight (PK 366, seats confirmed + meal voucher + compensation per policy); if fewer than 3 come forward, stand down the ID90 and staff duty first, then deny boarding in reverse standby priority with compensation paperwork.",
          points: 20,
          feedback:
            "Correct: volunteers first (cheapest, legally safest), then lowest staff priority (ID90 is space-available, not entitlement), then involuntary IDB in reverse priority with full compensation documentation.",
          consequence:
            "Two revenue passengers volunteer immediately for PK 366. One seat still to resolve.",
          best: true,
        },
        {
          id: "s4-d2-b",
          text: "Offload the two staff officers — that frees two seats — and bump the lowest-revenue waitlister for the third.",
          points: 8,
          feedback:
            "Half right: standing down staff ID90 is correct priority practice, but 'bumping the lowest-revenue waitlister' skips the volunteer step and the documented priority order.",
          best: false,
        },
        {
          id: "s4-d2-c",
          text: "Close check-in at -3 and let the gate deal with the mess.",
          points: 0,
          feedback:
            "Abandonment of duty: the station must resolve before closure. The gate cannot create seats.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "s4-d3",
      prompt: "The priority test — who flies, who waits?",
      passengerLines: [
        "(At the podium simultaneously: Officer Naveed, ID90, uniformed: 'Which seat is mine?' — Mr Tariq, revenue waitlist R1 with a connecting PIA flight to Dubai tonight: 'I MUST fly, my ticket is paid.')",
      ],
      options: [
        {
          id: "s4-d3-a",
          text: "Revenue first: Mr Tariq (R1) gets the seat — paid revenue outranks all staff categories. Officer Naveed: 'Sir, ID90 is space-available; tonight the flight is commercially full. The duty supervisor can list you on PK 366 with the same ID90 privileges.'",
          points: 16,
          feedback:
            "Priority hierarchy applied exactly: Revenue > Commercial Upgrades > Staff Duty > Staff ID90. The explanation preserves the officer's dignity.",
          consequence:
            "Officer Naveed nods: 'Understood — space-available, I know the drill. PK 366 for me please.'",
          best: true,
        },
        {
          id: "s4-d3-b",
          text: "Give the seat to the uniformed officer — staff must be looked after first.",
          points: 6,
          feedback:
            "Wrong hierarchy: staff ID90 travel is space-available and ranks BELOW all revenue categories. Uniform ≠ priority.",
          best: false,
        },
        {
          id: "s4-d3-c",
          text: "Auction the seat: whoever offers the most for an upgrade gets it.",
          points: 0,
          feedback:
            "Improper: ad-hoc auctions violate the fare and priority rules and create an untraceable revenue trail.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "s4-d4",
      prompt: "Final seat, compensation and closure — with 6 minutes to cutoff.",
      situation:
        "Two volunteers are processed. One oversold seat remains and no more volunteers. Mr Malik (R3) is the correct candidate for involuntary IDB if needed.",
      options: [
        {
          id: "s4-d4-a",
          text: "Offload Mr Malik (R3) involuntarily with written IDB notice, compensation voucher, PK 366 confirmed booking, hotel if applicable — then issue the final tally and close the flight at exactly 18:10.",
          points: 16,
          feedback:
            "Correct: reverse-priority involuntary IDB with full written compensation, rebooking and care — then a punctual flight closure with final tally.",
          consequence:
            "Mr Malik accepts the PK 366 confirmation grudgingly but signs the notice. Tally prints clean.",
          best: true,
        },
        {
          id: "s4-d4-b",
          text: "Wait 5 extra minutes past cutoff for more volunteers — being late is better than an angry passenger.",
          points: 8,
          feedback:
            "Cutoff discipline matters: a late departure triggers downstream IRROPS costs. IDB rules exist precisely for this moment.",
          best: false,
        },
        {
          id: "s4-d4-c",
          text: "Quietly seat Mr Malik anyway — the gate might miss the extra headcount.",
          points: 0,
          feedback:
            "Dangerous: exceeding authorized payload corrupts weight & balance and is a flight-safety violation. Never gamble the loadsheet.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "s4-t2",
      prompt: "Close the flight in Altéa with the final tally.",
      intro: "All seats resolved: Y balanced at zero. Execute the flight closure command.",
      commands: [
        {
          pattern: "^FCL/LHEKHI/24OCT$",
          display: "FCL/LHEKHI/24OCT",
          hint: "Flight closure for PK 364 LHE→KHI, 24 OCT.",
          output: [
            "FLIGHT PK364/24OCT CLOSED",
            "PAX F/C/Y: 001/008/149  BAGS 142/918.0K",
            "IDB: 1 (INVOL)  VOL: 2  STBY CLEARED: R1",
            "CUTOFF MET 1836Z  GOOD FLIGHT",
          ],
          errorHint: "Format: FCL/<citypair>/<date> — FCL/LHEKHI/24OCT",
          points: 20,
        },
      ],
    },
  ],
  debriefRules: [
    {
      source: "IATA / PCAA — Denied Boarding",
      ref: "Volunteers before involuntary IDB",
      detail:
        "Seek volunteers with incentives first; involuntary denied boarding only in reverse priority with written notice, compensation and rebooking care.",
    },
    {
      source: "SAPS Station SOP — Priority Hierarchy",
      ref: "Revenue > Commercial Upgrades > Staff Duty > Staff ID90",
      detail:
        "Standby clearance order: revenue waitlist by fare/priority code, then commercial upgrades, then staff duty, and staff ID90 (space-available) last.",
    },
    {
      source: "Altéa DCS — Flight Closure",
      ref: "FCL at published cutoff",
      detail:
        "Close the flight exactly at the cutoff with the final tally (FCL/<citypair>/<date>). Late closures cascade into delays; early closures strand passengers.",
    },
  ],
  checklist: [
    "Verify oversell in Altéa (PD) — never act on radio chatter alone",
    "Pull the standby list (LI/STBY) and read every priority code",
    "Priority: Revenue > Commercial Upgrades > Staff Duty > Staff ID90",
    "Call for volunteers with next-flight confirmation + compensation",
    "Process volunteers: rebook, voucher, meal/hotel per policy",
    "If involuntary IDB required: reverse priority + written notice + compensation",
    "Never exceed authorized payload — the loadsheet is law",
    "Close the flight exactly at cutoff (FCL) with final tally",
    "Log IDB/volunteer counts for the station report",
  ],
  badgeId: "irrops-master",
};

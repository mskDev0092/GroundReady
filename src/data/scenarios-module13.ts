import type { Scenario } from "@/lib/types";

/**
 * MODULE 13 — PRM Wheelchair Handling & Battery Mobility Aid (DGR)
 * Stroke survivor with his own AGM-battery wheelchair — WCHS coding, UN 2800, dignity.
 */
export const scenarioPRM: Scenario = {
  id: "m13-prm",
  moduleNo: 13,
  code: "M13-PRMW",
  title: "Dignity at Row 1",
  category: "special-pax",
  tags: ["PRM", "WCHS", "Wheelchair", "UN 2800", "Battery DGR"],
  difficulty: 3,
  xpBase: 160,
  minutes: 13,
  summary:
    "A stroke survivor boards with his own battery wheelchair. Code the right WCH* level, disarm the battery legally, and protect his dignity at every step.",
  briefing:
    "You are the SAPS Traffic Assistant at Row 3, Lahore (LHE), flight PK 361 LHE–KHI, 24 OCT. Muhammad Saleem Mehmood, 67, arrives in his own battery-powered wheelchair (AGM gel cell, non-spillable). Since his stroke he can shuffle a few steps on a stick but CANNOT manage aircraft stairs. His son insists the battery stays connected 'so the chair works at Karachi'. Choose the correct WCH* code, apply the battery rules (UN 2800, non-spillable), arrange the aisle chair and door delivery — and keep the man, not the wheelchair, at the centre.",
  objectives: [
    "Code the correct PRM level: WCHR vs WCHS vs WCHC — and never over/under-code",
    "Apply UN 2800 (non-spillable battery) rules: disconnect + insulate terminals for flight",
    "Tag the chair T-DOOR for aircraft-door delivery + aisle chair onboard",
    "Handle the passenger with discretion — no public announcements of his condition",
  ],
  passenger: {
    name: "Muhammad Saleem Mehmood",
    age: 67,
    nationality: "Pakistan",
    passportNo: "KC-2277441",
    passportExpiry: "19 MAR 2029",
    pnr: "DRW9QN",
    ticketNo: "214-4400117788",
    flight: "PK 361",
    route: "LHE → KHI",
    date: "24 OCT",
    seat: "01C (bulkhead)",
    fareClass: "Y — Economy Standard",
    allowance: "1PC / 25KG + wheelchair (free)",
    originStation: "LHE — SAPS Row 3",
    avatarTone: "violet",
    freqFlyer: "PK Awards — Silver",
  },
  baggage: [
    { id: "b1", label: "Own wheelchair — AGM gel battery, non-spillable", weightKg: 17.0, type: "checked", tag: "DOOR", note: "UN 2800 — disconnect + insulate terminals" },
    { id: "b2", label: "Suitcase", weightKg: 19.4, type: "checked" },
    { id: "b3", label: "Walking stick + small pouch (cabin)", weightKg: 1.6, type: "cabin" },
  ],
  documents: {
    passport: [
      { key: "name", label: "Name", value: "MEHMOOD, MUHAMMAD SALEEM" },
      { key: "nat", label: "Nationality", value: "PAKISTAN" },
      { key: "dob", label: "DOB", value: "04 APR 1959" },
      { key: "exp", label: "Expiry", value: "19 MAR 2029", highlight: "ok" },
    ],
    extra: [
      { key: "mobility", label: "Mobility assessment", value: "Walks short distances with stick · CANNOT manage stairs", highlight: "warn" },
      { key: "chair", label: "Wheelchair", value: "AGM GEL CELL — NON-SPILLABLE (UN 2800)", highlight: "ok" },
    ],
    ticket: [
      { key: "pnr", label: "PNR", value: "DRW9QN" },
      { key: "tkt", label: "Ticket", value: "214-4400117788" },
      { key: "fl", label: "Flight", value: "PK 361 Y 24OCT LHEKHI HK1" },
      { key: "seat", label: "Seat", value: "01C — bulkhead, pre-assigned" },
    ],
  },
  steps: [
    {
      type: "dialogue",
      id: "m13-d1",
      prompt: "Open the interaction with respect.",
      passengerLines: [
        "The wheelchair rolls up. Saleem sahib greets you himself: 'Young man, I walked onto planes for forty years — today my legs and I disagree. My son booked everything. Let us do this quickly and quietly.'",
      ],
      options: [
        {
          id: "m13-d1-a",
          text: "Forty years of boarding steps earns a smooth day today, sir. Quickly and quietly it is: I need two small things — how you would like to be assisted today, and one technical note on the chair's battery, which is a two-minute formality for the hold. Everything else stays exactly as you like it: fast and discreet.",
          points: 8,
          feedback:
            "Perfect opening: honours his agency ('how YOU would like to be assisted'), frames the battery as a formality, and commits to discretion up front.",
          consequence:
            "He chuckles: 'You are trained well. The legs negotiate the stairs; the chair negotiates everything else.'",
          best: true,
        },
        {
          id: "m13-d1-b",
          text: "Speak LOUDLY and slowly to the gentleman at the counter: WE WILL HELP YOU, SIR!",
          points: 4,
          feedback:
            "He is a stroke survivor, not deaf. Shouting, over-loud announcements and 'babying' are exactly the indignity this procedure exists to avoid.",
          best: false,
        },
        {
          id: "m13-d1-c",
          text: "Address the son only: 'What is wrong with him? Can he walk at all?' — talk about the passenger in the third person.",
          points: 0,
          feedback:
            "He is present and lucid — you just erased him from his own journey. Always address the passenger first.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m13-d2",
      prompt: "Code the PRM level correctly — WCHR, WCHS or WCHC?",
      passengerLines: [
        "Son (whispering): 'Just put the basic wheelchair code, bhai — the full staircase thing sounds dramatic and might lose us the seat.'",
      ],
      options: [
        {
          id: "m13-d2-a",
          text: "The code is not drama, it is the crew's instruction sheet — and wrong codes put him at risk. WCHR means he can walk to the seat and climb steps; WCHS means he cannot manage stairs; WCHC means he needs carrying to the seat. Your father shuffles with a stick but cannot do aircraft stairs — that is WCHS, exactly, no more and no less. With WCHS in the system, ground staff meet him with the aisle-side assistance and the crew staggers his boarding — the seat stays his.",
          points: 16,
          feedback:
            "Textbook: the WCHR/WCHS/WCHC ladder explained by capability, correct code chosen (cannot manage stairs = WCHS), and the son's seat anxiety defused with facts.",
          consequence:
            "Son nods, embarrassed. Saleem sahib: 'WCHS. Stairs out, seat in. Good.'",
          best: true,
        },
        {
          id: "m13-d2-b",
          text: "Enter WCHR (basic) to keep things simple — the ramp team will figure out the stairs on the spot.",
          points: 6,
          feedback:
            "Under-coding is dangerous: at KHI a WCHR means NO step assistance arrives — a stroke survivor facing mobile stairs is a fall waiting to happen.",
          best: false,
        },
        {
          id: "m13-d2-c",
          text: "Enter WCHC (needs carrying) to be extra safe — maximum assistance can never hurt.",
          points: 8,
          feedback:
            "Over-coding has costs too: WCHC resources (carrying teams, aisle chair pre-positioned to seat) deploy for someone who can transfer himself — and he loses the independence he values.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "m13-t1",
      prompt:
        "Enter the PRM service and the wheelchair in Altéa DCS. Type commands at the > prompt.",
      intro: "Assessment confirmed: WCHS. Battery procedure briefed to the son. Enter everything in the system.",
      commands: [
        {
          pattern: "^PD/LHEKHI/24OCT$",
          display: "PD/LHEKHI/24OCT",
          hint: "Passenger Display — pull up flight PK 361 LHE→KHI for 24 OCT.",
          output: [
            "FLIGHT: PK 361  LHE-KHI  EQP 320  STATUS: OPEN",
            "STD 1630  GATE A07  CUTOFF 1555  ROWS 3-7",
            "PAX F/C/Y: 006/014/139   BAGS 103/678.0K",
          ],
          errorHint: "Format: PD/<origin><destination>/<DDMMM> — e.g. PD/LHEKHI/24OCT",
          points: 8,
        },
        {
          pattern: "^RT/MEHMOOD$",
          display: "RT/MEHMOOD",
          hint: "Retrieve the passenger record by family name.",
          output: [
            "NAME: MEHMOOD/MUHAMMAD SALEEM MR   RECLOC DRW9QN",
            "ITN: 1 PK 361 Y 24OCT LHEKHI HK1  SEAT 01C",
            "TKT 214-4400117788  CLASS Y  BAG 1PC+WC",
          ],
          errorHint: "Retrieve by name: RT/MEHMOOD",
          points: 8,
        },
        {
          pattern: "^SRWCHS-P1/.*",
          display: "SR WCHS-P1/OWN WHEELCHAIR",
          hint: "Add the WCHS special service request for passenger 1 — note his own chair.",
          output: [
            "OK SSR WCHS ADDED",
            "CANNOT MANAGE STAIRS  OWN WHEELCHAIR  PAX1  PK361",
            "RAMP + CREW NOTIFIED",
          ],
          errorHint: "Start with SR WCHS-P1/ and note the chair, e.g. SR WCHS-P1/OWN WHEELCHAIR",
          points: 8,
        },
        {
          pattern: "^BAG/1/17\\.0/T-DOOR$",
          display: "BAG/1/17.0/T-DOOR",
          hint: "Tag the wheelchair — 1 piece, 17.0 kg, DOOR delivery tag.",
          output: [
            "BAG TAG 0456-11990011  PK361 LHEKHI",
            "1PC 17.0KG  SPECIAL TAG: T-DOOR",
            "DELIVERY: AIRCRAFT DOOR ON ARRIVAL",
          ],
          errorHint: "Format: BAG/1/17.0/T-DOOR — the DOOR tag returns his chair at the aircraft door",
          points: 8,
        },
        {
          pattern: "^PADD-WHEELCHAIR.*",
          display: "PADD-WHEELCHAIR UN2800 BATT DISCONNECTED/TERMINALS INSULATED/AISLE CHAIR REQ",
          hint: "Log the battery procedure and the onboard requirement.",
          output: ["OK REMARK ADDED TO PNR DRW9QN"],
          errorHint:
            "Start with PADD-WHEELCHAIR and cover battery + aisle chair, e.g. PADD-WHEELCHAIR UN2800 BATT DISCONNECTED/TERMINALS INSULATED/AISLE CHAIR REQ",
          points: 8,
        },
      ],
    },
    {
      type: "decision",
      id: "m13-d3",
      prompt: "The son insists the battery stays connected. Enforce the rule with the reason.",
      situation:
        "'Look — the battery stays ON. At Karachi nobody will reconnect it and my father will be stranded at the aircraft door.'",
      options: [
        {
          id: "m13-d3-a",
          text: "Here is the law and the logistics, both on your side: a connected terminal in a vibrating hold is a short-circuit fire risk — that is why UN 2800 non-spillable batteries are disconnected and their terminals insulated for flight; it is not optional and it is not my mood. And your father will NOT be stranded: the chair carries a T-DOOR tag, meaning ramp delivers it AT the aircraft door on arrival, and I will note 'RECONNECT ASSISTANCE' so the KHI team re-connects it before he boards it. The safest flight is also the one where the chair works at the end.",
          points: 16,
          feedback:
            "Textbook: states the rule with its reason (short-circuit fire in a vibrating hold), then solves the son's REAL fear with T-DOOR delivery + reconnect assistance noted. Compliance plus service.",
          consequence:
            "The son himself switches the battery off and tapes the terminals: 'Door delivery and reconnect — okay. Thank you for explaining, not just refusing.'",
          best: true,
        },
        {
          id: "m13-d3-b",
          text: "Rules are rules — battery comes off, no discussion. Sign this form.",
          points: 8,
          feedback:
            "The enforcement is right but the refusal-without-alternative breeds conflict. You knew his fear (stranding at the door) — answer it.",
          best: false,
        },
        {
          id: "m13-d3-c",
          text: "Fine, keep it connected — it is a small gel battery anyway.",
          points: 0,
          feedback:
            "A connected terminal in the hold is a documented fire mechanism. 'Small' is not a DGR category — compliance is not negotiable.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m13-d4",
      prompt: "Preserve his dignity in the boarding plan.",
      passengerLines: [
        "Saleem sahib, quietly: 'Son, one favour. No announcements about me on the speakers. Forty years I told other people where to sit — today I will not be an announcement.'",
      ],
      options: [
        {
          id: "m13-d4-a",
          text: "No announcements, sahib. Here is the plan instead: we pre-board you quietly before the general call — no queue, no audience — the aisle chair meets you at the aircraft door, and your bulkhead seat 01C is already blocked. To the crew you are Mr. Mehmood in 01C; the WCHS note rides in their paperwork, not on the PA. Forty years of telling people where to sit — today the best seat on the aircraft waits for you.",
          points: 8,
          feedback:
            "Excellent dignity handling: quiet pre-boarding, named crew only, assistance in paperwork not on speakers, and his status honoured in the closing line.",
          consequence:
            "He straightens his cap: '01C. The seat I used to assign others.' He rolls to the pre-board line like a man boarding his own flight.",
          best: true,
        },
        {
          id: "m13-d4-b",
          text: "Announce over the PA: 'Attention please, we have a wheelchair passenger, please give way!'",
          points: 4,
          feedback:
            "Exactly what he asked you not to do. Assistance needs paperwork and named staff — not a public address of his condition.",
          best: false,
        },
        {
          id: "m13-d4-c",
          text: "Board him last in the general crowd — fewer people will notice him.",
          points: 6,
          feedback:
            "A crowd is worse than an announcement: he waits standing, blocks the aisle mid-boarding, and the aisle chair chaos becomes MORE public. Quiet pre-boarding is the answer.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "m13-d5",
      prompt: "The ramp calls a 15-minute lift delay. Choose the professional response.",
      situation:
        "Ramp radio: 'Ambulift for gate A07 delayed 15 minutes — arriving 16:10, STD 16:30. Still workable, but tight.'",
      options: [
        {
          id: "m13-d5-a",
          text: "Workable — but verified, not hoped: call ramp operations for the ambulift's live ETA, pre-position Saleem sahib's escort at 16:05 (not 16:25), alert the crew that WCHS pre-boarding starts the moment the lift touches, and do NOT promise him wheels-up at 16:30 until ramp confirms the lift is moving. If it slips past cut-off buffer, the duty supervisor decides — not the queue pressure.",
          points: 12,
          feedback:
            "Senior thinking: live ETA, escort pre-positioned, crew pre-alerted, honest commitment windows, and the escalation path named BEFORE it is needed. Dignity survives the delay.",
          consequence:
            "Lift touches 16:08. Pre-boarding 16:10. Door closes 16:28. Saleem sahib wheels down the jet bridge first — and PK 361 pushes back on time.",
          best: true,
        },
        {
          id: "m13-d5-b",
          text: "Tell the passenger: 'Sir, the lift is late, nothing can be done, please wait.' — and hope ramp sorts it out.",
          points: 6,
          feedback:
            "Passive: no verification, no plan, no pre-positioning. PRM delay management is active coordination, not spectatorship.",
          best: false,
        },
        {
          id: "m13-d5-c",
          text: "Offer to lift him bodily up the aircraft stairs with two agents to save the ambulift wait.",
          points: 0,
          feedback:
            "Forbidden: untrained manual lifting of a PRM risks falls, stroke complications and injury claims. Only trained teams with equipment assist — never improvised lifting.",
          best: false,
        },
      ],
    },
  ],
  debriefRules: [
    {
      source: "IATA — PRM Codes (SSR WCH*)",
      ref: "WCHR: can walk + steps · WCHS: cannot manage stairs · WCHC: needs carrying to seat",
      detail:
        "Code by CAPABILITY, exactly. Under-coding strands the passenger at aircraft steps; over-coding deploys unnecessary carrying teams and strips independence.",
    },
    {
      source: "IATA DGR — UN 2800 Non-spillable Batteries",
      ref: "Battery-powered mobility aids: disconnect + insulate terminals; T-DOOR delivery",
      detail:
        "AGM/gel-cell wheelchairs travel as checked mobility equipment with terminals disconnected and insulated for flight. Priority door delivery returns the chair at the aircraft door.",
    },
    {
      source: "SAPS SOP — PRM Dignity",
      ref: "Address the passenger first · quiet pre-boarding · no PA announcements",
      detail:
        "Assistance is planned in paperwork and named handovers — never shouted on speakers, never improvised by untrained lifting.",
    },
  ],
  checklist: [
    "Address the PASSENGER first; offer assistance choices, never assume",
    "Code WCH* by capability: WCHR / WCHS / WCHC — exactly, no more, no less",
    "Explain UN 2800: disconnect + insulate terminals (short-circuit fire risk)",
    "Answer the real fear: T-DOOR delivery + reconnect assistance at arrival",
    "PD/LHEKHI/24OCT then RT/MEHMOOD",
    "SR WCHS-P1/OWN WHEELCHAIR — ramp + crew notified",
    "BAG/1/17.0/T-DOOR — door delivery tag on the chair",
    "PADD-WHEELCHAIR … — battery procedure + aisle chair in the record",
    "Quiet pre-boarding, bulkhead seat, named crew handover — no PA",
    "Ambulift delay: verify live ETA, pre-position, honest commitments",
  ],
  badgeId: "prm-ally",
};

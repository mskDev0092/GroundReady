import type { Scenario } from "@/lib/types";

/**
 * MODULE 15 — IRROPS: Fog Cancellation, Rebooking & Care (Fog Over Lahore)
 * PK 344 cancelled in winter fog — 60 passengers, one group, one angry businessman.
 */
export const scenarioFog: Scenario = {
  id: "m15-fog",
  moduleNo: 15,
  code: "M15-FOG",
  title: "Fog Over Lahore",
  category: "irrops",
  tags: ["IRROPS", "Cancellation", "Rebooking", "Care Codes", "Re-protection"],
  difficulty: 4,
  xpBase: 180,
  minutes: 15,
  summary:
    "Dense fog cancels PK 344 to Karachi. Sixty passengers, a 19-strong Umrah group with a Medina connection, and a businessman demanding 'any airline, now'. Run the IRROPS cascade.",
  briefing:
    "You are the SAPS Traffic Assistant at the IRROPS desk, Lahore (LHE), 24 OCT, 06:10. Dense fog has closed LHE below CAT-III minima: PK 344 LHE–KHI is CANCELLED; PK 348 departs 25 OCT 07:00. The queue: 60 passengers, including a 19-person Umrah group connecting to SV 728 JED–MED tomorrow evening, and Mr. Malik, a full-fare businessman with a 10:00 board meeting in Karachi. Your toolkit: honest announcements, the rebooking cascade, meal EMDs, hotel eligibility — and your composure.",
  objectives: [
    "Announce disruption honestly — reason, facts, next step; never blame the crew",
    "Run the rebooking cascade: connections first, then fare class/frequent flyer",
    "Issue care entitlements correctly: EMD-MEAL for all, hotel for eligible",
    "Re-protect BAGGAGE: bags pulled from the cancelled flight and re-checked on PK 348",
  ],
  passenger: {
    name: "Rafay Malik",
    age: 46,
    nationality: "Pakistan",
    passportNo: "HJ-9918273",
    passportExpiry: "08 OCT 2030",
    pnr: "MKD5FF",
    ticketNo: "214-4900118277",
    flight: "PK 344 → PK 348",
    route: "LHE → KHI",
    date: "24 OCT → 25 OCT",
    seat: "02A (C-class on PK 348)",
    fareClass: "C — Business Flex (full fare)",
    allowance: "2PC / 35KG",
    originStation: "LHE — IRROPS Desk 1",
    avatarTone: "amber",
    freqFlyer: "PK Awards — Gold",
  },
  baggage: [
    { id: "b1", label: "Malik — suit carrier (on cancelled PK 344)", weightKg: 9.1, type: "checked", note: "MUST PULL & RE-CHECK on PK 348" },
    { id: "b2", label: "Malik — trolley (on cancelled PK 344)", weightKg: 16.8, type: "checked", note: "MUST PULL & RE-CHECK on PK 348" },
    { id: "b3", label: "Umrah group — 31 bags on cancelled PK 344", weightKg: 612.4, type: "checked", note: "Re-check entire group for PK 348" },
  ],
  documents: {
    passport: [
      { key: "name", label: "Name", value: "MALIK, RAFAY" },
      { key: "nat", label: "Nationality", value: "PAKISTAN" },
      { key: "dob", label: "DOB", value: "22 MAR 1980" },
      { key: "exp", label: "Expiry", value: "08 OCT 2030", highlight: "ok" },
    ],
    ticket: [
      { key: "pnr", label: "PNR", value: "MKD5FF" },
      { key: "tkt", label: "Ticket", value: "214-4900118277" },
      { key: "fl", label: "Flight", value: "PK 344 C 24OCT LHEKHI — CXLD (FOG)" },
      { key: "alt", label: "Alternative", value: "PK 348 25OCT 0700 LHEKHI — OPEN", highlight: "warn" },
      { key: "seat", label: "Seat", value: "02A" },
    ],
  },
  steps: [
    {
      type: "dialogue",
      id: "m15-d1",
      prompt: "Make the announcement — set the tone for the next six hours.",
      passengerLines: [
        "The board flips to CANCELLED. Sixty faces turn toward the desk. Someone shouts: 'Pilot nahi aya kya?!' (Did the pilot not show up?!)",
      ],
      options: [
        {
          id: "m15-d1-a",
          text: "Ladies and gentlemen, your flight PK 344 is cancelled this morning because visibility at Lahore has dropped below the legal minimum for landing and take-off — this is weather across the whole airport, every airline is affected, and the crew you saw at coffee are as stuck as you are. Here is what happens NOW: I stay at this desk until every one of you is rebooked. Karachi passengers: the next flight is tomorrow 07:00. Connections and urgent cases come to me first. Please stay in the hall where I can see you — running to other counters only loses your place.",
          points: 8,
          feedback:
            "Masterclass opening: cause (below minima), scope (airport-wide, not our crew), the human note (crew stuck too), an immediate plan, and a direction that prevents crowd chaos.",
          consequence:
            "The hall settles from panic to grumbling. Mr. Malik reaches the desk first, Gold card face-up on the counter.",
          best: true,
        },
        {
          id: "m15-d1-b",
          text: "Blame-shield: 'The airline apologises for operational reasons beyond our control.' Repeat to each questioner.",
          points: 4,
          feedback:
            "Corporate fog is worse than real fog: no cause, no plan, no personal ownership. Crowds fill information vacuums with rumours.",
          best: false,
        },
        {
          id: "m15-d1-c",
          text: "Join the rumour: 'Honestly, between us — the captain refused to fly, there is something wrong with the aircraft.'",
          points: 0,
          feedback:
            "Inventing a safety story about your own airline destroys trust permanently and is a disciplinary offence. Facts only, always.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m15-d2",
      prompt: "Mr. Malik demands options. Give the real menu.",
      passengerLines: [
        "Mr. Malik, Gold card flat on the counter: 'I have a board meeting at 10:00 in Karachi. Get me on ANY airline flying now, I will pay anything — or refund me on the spot. Choose for me.'",
      ],
      options: [
        {
          id: "m15-d2-a",
          text: "Sir, I will not choose for you — I will give you the honest menu. One: PK 348 tomorrow 07:00, you land 09:15, your meeting is missed by minutes, and as a Gold Flex passenger I add the lounge, a hotel tonight and meal vouchers. Two: full refund on your Flex fare — refundable within 24 hours to your card. Three: alternate carriers — I check our interline agreements live before promising anything; where an agreement exists I can rebook you, where it does not, I will say so instead of selling you a fantasy. Which door do we open first?",
          points: 16,
          feedback:
            "Textbook: a real menu (rebook/refund/endorse), entitlements stacked correctly for his fare+tier, interline honesty (check before promising), and agency returned to the passenger.",
          consequence:
            "He drums the counter: 'Check the interline first. If nothing flies before 10:00, PK 348 with the hotel — and you write the board-meeting letter for my chairman.'",
          best: true,
        },
        {
          id: "m15-d2-b",
          text: "Promise him a seat on 'the next flight of any airline, guaranteed, my responsibility' — sort the agreements out later.",
          points: 4,
          feedback:
            "A promise without an agreement check is a lie on a delay: unendorsed tickets strand him at the OTHER airline's counter and you own the scene that follows.",
          best: false,
        },
        {
          id: "m15-d2-c",
          text: "Refuse everything: 'Fog is an act of God — no refunds, no hotels, take it or leave it.'",
          points: 0,
          feedback:
            "False on every count: cancellations carry a refund RIGHT, and overnight diversions carry hotel/meal duties. 'Act of God' is not a customer-care policy.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "m15-t1",
      prompt:
        "Rebook Mr. Malik and issue his care entitlements in Altéa DCS. Type commands at the > prompt.",
      intro: "Decision made: PK 348 tomorrow 07:00 + hotel + meals. Execute the rebooking chain.",
      commands: [
        {
          pattern: "^PD/LHEKHI/25OCT$",
          display: "PD/LHEKHI/25OCT",
          hint: "Passenger Display — pull up the replacement flight PK 348 for 25 OCT.",
          output: [
            "FLIGHT: PK 348  LHE-KHI  EQP 320  25OCT",
            "STD 0700  GATE A04  CUTOFF 0635",
            "PAX F/C/Y: 003/019/146  SEATS AVAILABLE: Y 11 / C 4",
            "STATUS: OPEN — IRROPS RE-PROTECTION ACTIVE",
          ],
          errorHint: "Rebook onto tomorrow: PD/LHEKHI/25OCT (note the date!)",
          points: 8,
        },
        {
          pattern: "^RT/MALIK$",
          display: "RT/MALIK",
          hint: "Retrieve the passenger record by family name.",
          output: [
            "NAME: MALIK/RAFAY MR   RECLOC MKD5FF",
            "ITN: 1 PK 344 C 24OCT LHEKHI — UN (CANCELLED)",
            "TKT 214-4900118277  FARE C FLEX  GOLD TIER",
          ],
          errorHint: "Retrieve by name: RT/MALIK",
          points: 8,
        },
        {
          pattern: "^RB/P1/PK348/25OCT/C$",
          display: "RB/P1/PK348/25OCT/C",
          hint: "Rebook passenger 1 onto PK 348, 25 OCT, business class (his fare class).",
          output: [
            "OK REBOOKED PAX1",
            "PK 348 25OCT LHEKHI C  SEAT 02A AUTO",
            "PNR MKD5FF RETAINED  ORIGINAL FARE PROTECTED",
          ],
          errorHint: "Format: RB/P1/PK348/25OCT/C — passenger, flight, date, class",
          points: 8,
        },
        {
          pattern: "^EMD-MEAL/P1/1500$",
          display: "EMD-MEAL/P1/1500",
          hint: "Issue the meal-care EMD — PKR 1,500 for the disruption.",
          output: [
            "OK EMD ISSUED  420-9900117788",
            "MEAL VOUCHER PKR 1,500  VALID 24H  HALL CAFETERIA + LOUNGE",
          ],
          errorHint: "Format: EMD-MEAL/P1/1500 — care EMD, passenger, amount",
          points: 8,
        },
        {
          pattern: "^PADD-IRROPS.*",
          display: "PADD-IRROPS PK344 CXLD FOG/REBOOK PK348 25OCT C/MEAL EMD/HOTEL ELIGIBLE",
          hint: "Log the full IRROPS trail — cause, action, entitlements.",
          output: ["OK REMARK ADDED TO PNR MKD5FF"],
          errorHint:
            "Start with PADD-IRROPS and cover cause+action+care, e.g. PADD-IRROPS PK344 CXLD FOG/REBOOK PK348 25OCT/MEAL EMD/HOTEL ELIGIBLE",
          points: 8,
        },
      ],
    },
    {
      type: "decision",
      id: "m15-d3",
      prompt: "The Umrah group of 19 — prioritise them correctly.",
      situation:
        "The group leader approaches with 19 passports rubber-banded in three stacks: 'Beta, our Medina flight SV 728 leaves Jeddah TOMORROW EVENING. Nineteen elderly pilgrims. Where do we sleep, and do we make the connection?'",
      options: [
        {
          id: "m15-d3-a",
          text: "The group goes to the TOP of the rebooking list — 19 connections outrank one board meeting, and PK 348 lands in Karachi 09:15, a full day before SV 728. Action: block 19 adjacent seats on PK 348 now, re-check all 31 group bags straight through to JED, book the hotel block for tonight with group dietary notes, and give the leader my direct desk number for the 05:00 roll-call. A group is one passenger with nineteen hearts — move them as one.",
          points: 16,
          feedback:
            "Correct prioritisation: connections before non-connecting, bulk actions (adjacent seats, through-checked bags, hotel block), and a named roll-call plan. Groups fail as individuals; they succeed as a block.",
          consequence:
            "The leader kisses the passport stack: 'Allah bless you. Nineteen du'as for you tonight.' The desk queue visibly relaxes.",
          best: true,
        },
        {
          id: "m15-d3-b",
          text: "Serve the group in queue order like everyone else — fairness means first-come-first-served, no exceptions.",
          points: 6,
          feedback:
            "Mechanical 'fairness' misses the cascade: IRROPS priority protects vulnerable connections first. A missed Medina flight for 19 pilgrims is 19 disasters; a hotel night for Mr. Malik is one.",
          best: false,
        },
        {
          id: "m15-d3-c",
          text: "Split the group: rebook 9 today, 10 tomorrow — it halves the hotel bill and the work.",
          points: 0,
          feedback:
            "Splitting a pilgrim group destroys the Umrah experience and the leader's ability to manage 19 elderly travellers. Move groups as ONE unit.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m15-d4",
      prompt: "Kill the rumour mill before it kills your queue.",
      passengerLines: [
        "A passenger waves his phone: 'Twitter says our plane had a TECHNICAL FAULT, not fog! The company is hiding it! Is that true?!' — the hall leans in.",
      ],
      options: [
        {
          id: "m15-d4-a",
          text: "I understand why that spreads, so let me give you what I have: the ATC visibility report for 06:00 reads below CAT-III minima — I will read it to you right now, and every airline's board in this hall shows the same cancellations, including the airline whose photo is in that tweet. Aircraft faults are logged and public — there is none on PK 344 today. What there IS, is fog you could cut with a knife outside window three. Facts, not feelings, everyone: I am here all morning.",
          points: 8,
          feedback:
            "Perfect rumour control: takes the claim seriously, shows the SOURCE (ATC report read aloud, the boards, the fault log), and refutes with verifiable data — then re-anchors on availability.",
          best: true,
        },
        {
          id: "m15-d4-b",
          text: "Ignore the rumour and keep typing — engaging conspiracies only feeds them.",
          points: 4,
          feedback:
            "Silence is confirmation in a crowd's ears. One factual, calm, sourced answer defuses fifty phone screens.",
          best: false,
        },
        {
          id: "m15-d4-c",
          text: "Snap back: 'Do you have a pilot licence, sir? Then let the professionals decide what is true.'",
          points: 0,
          feedback:
            "You just made the rumour fight personal. Correct the record with data and respect — never with rank.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "m15-d5",
      prompt: "The baggage question everyone forgets.",
      situation:
        "Mr. Malik, leaving for the hotel, suddenly turns: 'My suit carrier! It went onto the cancelled flight last night at self-bag-drop. Where is my suit?'",
      options: [
        {
          id: "m15-d5-a",
          text: "Pulled and re-checked, sir — here is exactly how it works tonight: ramp offloads ALL bags from PK 344, I re-check yours onto PK 348 with fresh tags when you arrive at 06:15, and you carry your medication, charger and one shirt in hand luggage tonight, because the suit flies when YOU fly. What we NEVER do is let bags travel on a flight their passenger missed — same rule as any no-show, and the same reason: accountability.",
          points: 12,
          feedback:
            "Complete: bags pulled from the cancelled flight, re-checked only WITH the passenger tomorrow, and the hand-luggage advice that saves the morning. Pax↔bag matching survives IRROPS too.",
          consequence:
            "He totes his suit carrier to the hotel himself, returns at 06:15, bags re-tagged 0456-12001177/178. PK 348 departs 07:00 — full hall, fed, slept, rebooked, zero lost bags.",
          best: true,
        },
        {
          id: "m15-d5-b",
          text: "Relax sir — the bags will 'automatically transfer' to the new flight overnight.",
          points: 0,
          feedback:
            "Nothing transfers automatically from a CANCELLED flight: the bags are pulled for reconciliation. 'Automatic' is how bags end up in Karachi with owners in Lahore hotels.",
          best: false,
        },
        {
          id: "m15-d5-c",
          text: "Keep the bags on PK 344's replacement positioning leg to Karachi so they are 'already there' for him.",
          points: 0,
          feedback:
            "A bag flying without its passenger violates positive passenger-bag matching — full stop, even when the passenger WILL fly tomorrow.",
          best: false,
        },
      ],
    },
  ],
  debriefRules: [
    {
      source: "IATA — IRROPS Care",
      ref: "Cancellation: refund RIGHT + rebooking duty + meals; overnight: hotel",
      detail:
        "On cancellations passengers choose rebooking or refund. Meals are due for substantial delays; hotel for overnight disruptions. Care is owed regardless of cause — fog included.",
    },
    {
      source: "IATA — Re-protection Cascade",
      ref: "Connections first → fare class/tier → check-in order",
      detail:
        "Vulnerable itineraries (connecting groups, medical, elderly) outrank convenience. Groups move as ONE unit: adjacent seats, through-bags, hotel block, roll-call plan.",
    },
    {
      source: "IATA AVSEC — Pax↔Bag Matching",
      ref: "Bags pulled from cancelled flights; re-checked only WITH the passenger",
      detail:
        "A cancelled flight's bags are ALL offloaded and reconciled. No bag flies without its passenger — the rule that survives every disruption.",
    },
  ],
  checklist: [
    "Announce: cause + scope + immediate plan + crowd direction — no crew blame, no invented stories",
    "Give the honest menu: rebook / refund / interline (CHECK agreements before promising)",
    "Cascade: connections first, then fare class & tier, then check-in order",
    "Groups as ONE unit: adjacent seats, through-checked bags, hotel block, roll-call",
    "PD/LHEKHI/25OCT → RT/MALIK → RB/P1/PK348/25OCT/C",
    "EMD-MEAL/P1/1500 — meal care for disruption; hotel for eligible",
    "PADD-IRROPS … — cause + action + entitlements in the audit trail",
    "Defuse rumours with SOURCED facts (ATC report, boards, fault log)",
    "ALL bags pulled from cancelled flight; re-checked only WITH the passenger",
    "Care entitlements stack by fare + tier — Flex/Gold get lounge + hotel",
  ],
  badgeId: "fog-navigator",
};

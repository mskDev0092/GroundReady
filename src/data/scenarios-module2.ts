import type { Scenario } from "@/lib/types";

/**
 * MODULE 2 — Excess Baggage & Refusal De-escalation
 * 32kg bag vs 20kg allowance; passenger refuses tariff, threatens to abandon the bag.
 */
export const scenarioExcessBaggage: Scenario = {
  id: "m2-excess",
  moduleNo: 2,
  code: "M2-EXC",
  title: "The 32kg Refusal",
  category: "baggage-dgr",
  tags: ["Excess Baggage", "EMD", "De-escalation", "ASF", "SAPS SOP"],
  difficulty: 3,
  xpBase: 140,
  minutes: 12,
  summary:
    "A passenger's bag weighs 32kg against a 20kg allowance. He refuses the tariff, threatens to abandon the bag at the counter and demands his boarding pass.",
  briefing:
    "You are the SAPS Traffic Assistant at Allama Iqbal International, Lahore (LHE), row 2, flight PK 302 LHE–JED. Mr Faisal Butt checks one suitcase: the scale reads 32.0 KG. His fare includes 20KG. The excess is 12KG and the local tariff is PKR 18,500, collectable via EMD before tag issuance. He refuses to pay, raises his voice and threatens to leave the bag at the counter and walk to the gate. De-escalate, stay inside SOP, protect the flight and the evidence trail.",
  objectives: [
    "Quote the allowance and excess correctly and calculate the EMD tariff",
    "De-escalate without conceding the tariff or threatening the passenger",
    "Warn about the ASF unattended-baggage rule (IATA Resolution 302)",
    "Escalate to the supervisor discreetly; freeze boarding pass until resolution; log everything in Altéa",
  ],
  passenger: {
    name: "Faisal Butt",
    age: 38,
    nationality: "Pakistan",
    passportNo: "AB-2231441",
    passportExpiry: "09 FEB 2030",
    pnr: "MX7TQP",
    ticketNo: "214-5566778891",
    flight: "PK 302",
    route: "LHE → JED",
    date: "24 OCT",
    seat: "18C",
    fareClass: "Y — Economy Value",
    allowance: "1PC / 20KG",
    originStation: "LHE — SAPS Row 2",
    avatarTone: "amber",
  },
  baggage: [
    { id: "b1", label: "Green suitcase on scale", weightKg: 32.0, type: "checked", note: "Excess over allowance: 12.0 KG" },
    { id: "b2", label: "Backpack (cabin)", weightKg: 7.5, type: "cabin" },
  ],
  documents: {
    passport: [
      { key: "name", label: "Name", value: "BUTT, FAISAL" },
      { key: "nat", label: "Nationality", value: "PAKISTAN" },
      { key: "exp", label: "Expiry", value: "09 FEB 2030", highlight: "ok" },
    ],
    ticket: [
      { key: "pnr", label: "PNR", value: "MX7TQP" },
      { key: "tkt", label: "Ticket", value: "214-5566778891" },
      { key: "fl", label: "Flight", value: "PK 302 J 24OCT LHEJED HK1" },
      { key: "seat", label: "Seat", value: "18C — BP NOT YET ISSUED" },
    ],
    extra: [
      { key: "scale", label: "Scale readout", value: "32.0 KG", highlight: "bad" },
      { key: "allow", label: "Allowance", value: "20.0 KG", highlight: "warn" },
      { key: "excess", label: "Excess", value: "12.0 KG → PKR 18,500 (EMD)", highlight: "warn" },
    ],
  },
  steps: [
    {
      type: "dialogue",
      id: "s2-d1",
      prompt: "Deliver the excess-baggage message the SAPS way.",
      passengerLines: [
        "Check this in fast, please. My flight leaves soon.",
        "(The scale settles at 32.0 KG. Allowance: 20 KG.)",
      ],
      options: [
        {
          id: "s2-d1-a",
          text: "Sir, good morning. Your allowance is 20kg and the bag is 32kg — 12kg over. The excess charge is PKR 18,500, payable by card or cash as an EMD, and then I can tag the bag straight away.",
          points: 8,
          feedback:
            "Correct: calm tone, exact allowance, exact excess, exact tariff, and the payment mechanism (EMD) offered immediately.",
          consequence:
            "'18,500?! For 12 kilos? Absolutely not. Tag it for free — I am a frequent flyer!'",
          best: true,
        },
        {
          id: "s2-d1-b",
          text: "Your bag is too heavy, sir. Pay PKR 18,500 right now or there is no check-in.",
          points: 4,
          feedback:
            "Content is right but the delivery is confrontational — this escalates. Always explain allowance → excess → tariff → payment options.",
          consequence:
            "His voice rises: 'What do you mean pay or no check-in? Call whoever you want!'",
          best: false,
        },
        {
          id: "s2-d1-c",
          text: "Okay sir, no problem — I will mark it as 20kg and tag it.",
          points: 0,
          feedback:
            "Falsifying bag data is fraud: it corrupts the weight & balance loadsheet and can ground the aircraft. Never do it.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "s2-d2",
      prompt:
        "He refuses payment and threatens to abandon the bag. Choose the de-escalation path.",
      situation:
        "Mr Butt: 'Keep the bag, I don't want it! Give me my boarding pass — I will fly without it.' He steps back and folds his arms.",
      options: [
        {
          id: "s2-d2-a",
          text: "Stay calm and lower your voice: 'Sir, I want you to make your flight — that is my job. The bag cannot travel without the tariff, and any bag left unattended at the counter will be removed by ASF and confiscated under security rules. Let me call my supervisor to see what options we have for you.'",
          points: 16,
          feedback:
            "Textbook: acknowledge the goal (make the flight), hold the compliance line, state the ASF unattended-bag consequence factually, and escalate with a positive frame.",
          consequence:
            "He hesitates: 'Supervisor? Fine, call your supervisor. But I am not paying 18,500.'",
          best: true,
        },
        {
          id: "s2-d2-b",
          text: "Waive the charge quietly to end the scene — the queue is watching.",
          points: 0,
          feedback:
            "Revenue leakage plus SOP breach. Waivers are the supervisor's authority, never the counter agent's, and must be documented.",
          best: false,
        },
        {
          id: "s2-d2-c",
          text: "Shout back at him to leave the counter if he will not pay.",
          points: 0,
          feedback:
            "Escalation from our side is never acceptable. The T/A must remain the calmest person at the counter.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "s2-t1",
      prompt:
        "While the supervisor is on the way, build the audit trail in Altéa: enter the real bag data, the EMD and the PADD remark.",
      intro:
        "SOPS: log the TRUE weight, the excess, the EMD and the incident remark. Boarding pass stays frozen until the tariff is settled.",
      commands: [
        {
          pattern: "^PD/LHEJED/24OCT$",
          display: "PD/LHEJED/24OCT",
          hint: "Passenger Display for flight PK 302 LHE→JED, 24 OCT.",
          output: [
            "FLIGHT: PK 302  LHE-JED  EQP 320  STATUS: OPEN",
            "STD 1430  GATE B04  CUTOFF 1355",
            "PAX F/C/Y: 001/012/148   BAGS 139/902.0K",
          ],
          errorHint: "Format: PD/<citypair>/<date> — PD/LHEJED/24OCT",
          points: 8,
        },
        {
          pattern: "^RT/BUTT$",
          display: "RT/BUTT",
          hint: "Retrieve the passenger by family name.",
          output: [
            "NAME: BUTT/FAISAL MR   RECLOC MX7TQP",
            "ITN: 1 PK 302 J 24OCT LHEJED HK1  SEAT 18C",
            "TKT 214-5566778891  CLASS Y  BAG 0PC",
          ],
          errorHint: "Retrieve by name: RT/BUTT",
          points: 8,
        },
        {
          pattern: "^BAG/1/32\\.0$",
          display: "BAG/1/32.0",
          hint: "Enter the TRUE weight: 1 bag, 32.0 kg.",
          output: [
            "EXCESS: 12.0KG  TARIFF ZONE D",
            "EMD REQUIRED BEFORE TAG ISSUANCE",
          ],
          errorHint: "Format: BAG/<pieces>/<weight> — BAG/1/32.0 (never understate the weight)",
          points: 8,
        },
        {
          pattern: "^EMD-EXC/12\\.0KG/PKR18500$",
          display: "EMD-EXC/12.0KG/PKR18500",
          hint: "Issue the EMD for the 12kg excess at PKR 18,500.",
          output: [
            "EMD 457-9900112211  ISSUED",
            "EXC BGG 12.0KG  PKR 18,500  PAID-CASH",
          ],
          errorHint: "Format: EMD-EXC/<weight>/<currency+amount> — EMD-EXC/12.0KG/PKR18500",
          points: 8,
        },
        {
          pattern: "^PADD-EXCBGG.*",
          display: "PADD-EXC BGG 12KG EMD 457-9900112211 PAID/SUPERVISOR INFORMED",
          hint: "Log the exception remark — excess paid via EMD, supervisor informed.",
          output: ["OK REMARK ADDED TO PNR MX7TQP"],
          errorHint: "Start with PADD-EXC BGG and include the EMD reference.",
          points: 8,
        },
      ],
    },
    {
      type: "dialogue",
      id: "s2-d3",
      prompt: "He offers a shortcut. Hold the line.",
      passengerLines: [
        "Look, my brother works in SAPS cargo. Give me a discount — half — and don't write anything in the system, okay? Nobody needs to know.",
      ],
      options: [
        {
          id: "s2-d3-a",
          text: "Sir, every entry is mandatory and audited — I cannot skip the system, and the tariff is fixed. What I CAN do is confirm with my supervisor whether any waiver policy applies to you. Let me do that properly.",
          points: 16,
          feedback:
            "Perfect: refuse the irregularity politely, explain why (audit), and route the request through the legitimate channel (supervisor waiver authority).",
          consequence:
            "Supervisor arrives: 'Mr Butt, I understand. The tariff is fixed, but I can authorise payment by card split over two EMDs if that helps.'",
          best: true,
        },
        {
          id: "s2-d3-b",
          text: "Half price, and I will just not print the EMD. Deal.",
          points: 0,
          feedback:
            "This is corruption: unrecorded discounts and missing EMDs are criminal revenue fraud. Instant dismissal and legal exposure.",
          best: false,
        },
        {
          id: "s2-d3-c",
          text: "That sounds like a bribe! I am calling ASF right now, loudly, at this counter!",
          points: 4,
          feedback:
            "The refusal is right, but announcing it publicly escalates the scene. SOP: use the discreet signal/phone to alert the supervisor, keep the counter calm.",
          consequence:
        "Other passengers start filming. The supervisor takes over the counter.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "s2-d4",
      prompt: "Final sequence — select the correct closing actions in order.",
      situation:
        "Tariff is now paid by card (two EMDs). The bag sits at the end of the belt. Close out the interaction.",
      options: [
        {
          id: "s2-d4-a",
          text: "Print bag tag from the paid EMD, warn him the bag must never be left unattended (ASF will treat it as suspicious), issue the boarding pass now that payment cleared, and log the closure remark.",
          points: 20,
          feedback:
            "Correct order: tag after payment → ASF unattended-bag warning → BP released only after resolution → PADD closure. All four SOP pillars done.",
          consequence:
            "Mr Butt boards PK 302. Supervisor logs a compliment: 'Clean handling under pressure.'",
          best: true,
        },
        {
          id: "s2-d4-b",
          text: "Issue the boarding pass first as a goodwill gesture, then sort out the tag whenever he pays.",
          points: 8,
          feedback:
            "Wrong order: BP issuance stays frozen until the tariff question is fully resolved — goodwill gestures are not in the SOP.",
          best: false,
        },
        {
          id: "s2-d4-c",
          text: "Let him walk to the gate without the bag; if ASF asks, say you never saw him.",
          points: 0,
          feedback:
            "Abandoning the record and lying to ASF is a security breach. Every bag and every passenger interaction must be traceable.",
          best: false,
        },
      ],
    },
  ],
  debriefRules: [
    {
      source: "SAPS SOP — Excess Baggage",
      ref: "Tariff via EMD before tag issuance",
      detail:
        "Excess is calculated on the TRUE weighed weight (32kg − 20kg = 12kg). Payment is collected via EMD; boarding pass issuance remains frozen until settlement.",
    },
    {
      source: "IATA Resolution 302 / Airport Security",
      ref: "Unattended baggage",
      detail:
        "Any bag left unattended in the terminal must be reported and removed by ASF — it may be confiscated and destroyed. Counter agents must state this warning when a passenger threatens to abandon baggage.",
    },
    {
      source: "SAPS SOP — De-escalation",
      ref: "Discreet escalation protocol",
      detail:
        "Aggression or irregular payment requests: keep voice low, do not confront publicly, use the discreet supervisor call, and log the incident with PADD in Altéa.",
    },
  ],
  checklist: [
    "Weigh bag openly; read the scale to the passenger",
    "Quote allowance (20kg) → excess (12kg) → tariff (PKR 18,500) → EMD options",
    "Never falsify weight or skip system entries — audit trail is mandatory",
    "De-escalate: acknowledge the goal, hold the compliance line, lower your voice",
    "Warn: unattended bags are removed and confiscated by ASF (IATA Reso 302)",
    "Use the discreet supervisor call — never argue publicly at the counter",
    "Freeze boarding pass issuance until tariff question is resolved",
    "BAG/1/32.0 — enter TRUE weight; print EMD; PADD the incident and closure",
    "Issue BP only after payment/decision; hand tag + receipts together",
  ],
  badgeId: "asf-shield",
};

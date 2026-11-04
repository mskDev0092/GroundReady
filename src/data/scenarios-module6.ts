import type { Scenario } from "@/lib/types";

/**
 * MODULE 6 — Lithium Batteries, Power Banks & E-cigarettes (IATA DGR)
 * Technician with oversized power station, loose cells and a hidden vape.
 */
export const scenarioLithium: Scenario = {
  id: "m6-lithium",
  moduleNo: 6,
  code: "M6-LIPOW",
  title: "Power Bank Panic",
  category: "baggage-dgr",
  tags: ["DGR", "Lithium", "Power Bank", "E-cigarettes", "IATA"],
  difficulty: 3,
  xpBase: 140,
  minutes: 12,
  summary:
    "A telecom technician flies to Doha with a 300Wh power station, loose 18650 cells and an e-cigarette packed in his checked trolley.",
  briefing:
    "You are the SAPS Traffic Assistant at Row 2, Lahore Allama Iqbal International (LHE), flight QR 629 LHE–DOH, 24 OCT. Tanvir Siddiqui, a telecom engineer, checks in a heavy trolley 'full of chargers'. Inside: a 300Wh portable power station, six loose 18650 lithium cells, a 26,800mAh power bank and an e-cigarette in the front pocket. Apply IATA DGR lithium battery rules, decide what flies and where, and document everything in Altéa DCS.",
  objectives: [
    "Apply the 100Wh / 160Wh lithium battery limits (DGR 2026, Section II / IA)",
    "Enforce: power banks and spare cells — cabin only, never checked",
    "Refuse the >160Wh power station for carriage and document the refusal",
    "Add DGR SSR + PADD audit remark and re-enter the corrected bag weight",
  ],
  passenger: {
    name: "Tanvir Ahmed Siddiqui",
    age: 34,
    nationality: "Pakistan",
    passportNo: "LN-8821347",
    passportExpiry: "09 FEB 2031",
    pnr: "GH6T2P",
    ticketNo: "157-7733112200",
    flight: "QR 629",
    route: "LHE → DOH",
    date: "24 OCT",
    seat: "14C",
    fareClass: "Y — Economy Classic",
    allowance: "1PC / 25KG",
    originStation: "LHE — SAPS Row 2",
    avatarTone: "teal",
    visa: "Qatar — 30-day eVisa valid",
    freqFlyer: "QR Privilege Club — 18,420 QM",
  },
  baggage: [
    { id: "b1", label: "Trolley — tools, 300Wh power station, 6 loose 18650 cells, e-cig", weightKg: 23.8, type: "checked", note: "CONTAINS FORBIDDEN DGR — must be remediated" },
    { id: "b2", label: "Backpack (cabin)", weightKg: 6.4, type: "cabin" },
    { id: "b3", label: "Trolley after removal of power station + cells re-secured", weightKg: 21.0, type: "checked", note: "Power bank 99.9Wh moved to cabin" },
  ],
  documents: {
    passport: [
      { key: "name", label: "Name", value: "SIDDIQUI, TANVIR AHMED" },
      { key: "nat", label: "Nationality", value: "PAKISTAN" },
      { key: "dob", label: "DOB", value: "17 JUL 1992" },
      { key: "exp", label: "Expiry", value: "09 FEB 2031", highlight: "ok" },
    ],
    visa: [
      { key: "type", label: "Visa", value: "QATAR — TOURIST eVisa" },
      { key: "status", label: "Status", value: "VALID — 30 DAYS", highlight: "ok" },
    ],
    ticket: [
      { key: "pnr", label: "PNR", value: "GH6T2P" },
      { key: "tkt", label: "Ticket", value: "157-7733112200" },
      { key: "fl", label: "Flight", value: "QR 629 Q 24OCT LHEDOH HK1" },
      { key: "seat", label: "Seat", value: "14C" },
    ],
  },
  steps: [
    {
      type: "dialogue",
      id: "m6-d1",
      prompt: "Open the interaction professionally.",
      passengerLines: [
        "Salam sahib, quick one please — flight leaves in two hours and everything is already packed. Just tag the trolley and I am gone.",
      ],
      options: [
        {
          id: "m6-d1-a",
          text: "Salam, sir — welcome. Before I tag anything, may I quickly check your trolley contents? Power tools, power banks and batteries follow special air rules, and it saves you a security delay if we sort them here.",
          points: 8,
          feedback:
            "Perfect: warm, fast and a discovery question framed as saving HIM time. Lithium items must be verified before acceptance.",
          consequence:
            "He unzips willingly: 'Chargers mostly — power station for site work, some spare cells, and my vape…'",
          best: true,
        },
        {
          id: "m6-d1-b",
          text: "Tag it and go, sir — the queue is long and security will catch anything wrong later.",
          points: 4,
          feedback:
            "Process failure: DGR screening is YOUR job at acceptance. If security catches it, the bag returns and the flight is delayed.",
          best: false,
        },
        {
          id: "m6-d1-c",
          text: "No need to open anything, sir — the X-ray machine will flag problems.",
          points: 2,
          feedback:
            "Wrong: battery declarations and prohibited items must be resolved at check-in, not left to the X-ray funnel.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m6-d2",
      prompt: "Apply IATA DGR lithium rules and explain what flies where.",
      passengerLines: [
        "It is a 300Wh EcoFlow power station, six spare 18650 cells for the torch, a 26,800mAh power bank, and my vape. All normal kit — why the faces?",
      ],
      options: [
        {
          id: "m6-d2-a",
          text: "Three rules apply, sir. One: your power station is 300Wh — anything above 160Wh is forbidden on passenger aircraft entirely, cabin or hold. Two: spare lithium cells and the power bank may only fly in the CABIN, never in the hold — cells must have terminals taped or boxed. Three: the e-cigarette travels cabin-only too, and you cannot charge it onboard. The station cannot travel; the rest can be re-packed correctly.",
          points: 16,
          feedback:
            "Textbook DGR briefing: 100Wh cabin rule, 160Wh absolute limit, spare-battery cabin-only with terminal protection, e-cig handling. Every element correct.",
          consequence:
            "He winces: 'The station is 40,000 rupees of kit… fine, rules are rules. Where does it go then?'",
          best: true,
        },
        {
          id: "m6-d2-b",
          text: "Batteries are dangerous goods, sir — I cannot accept any of it. Take everything home.",
          points: 8,
          feedback:
            "Over-refusal harms service: a 99.9Wh power bank IS accepted — cabin only. Correct classification, not blanket refusal, is the skill.",
          best: false,
        },
        {
          id: "m6-d2-c",
          text: "The power station can go in the hold if you switch it off — the cells can go in your jacket.",
          points: 0,
          feedback:
            "Dangerous misinformation: >160Wh is forbidden outright, and 'hidden in a jacket' is coaching a security evasion.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "m6-t1",
      prompt:
        "Process the remediated baggage in Altéa DCS: remove the forbidden items, add the DGR SSR and re-enter the checked bag. Type commands at the > prompt.",
      intro:
        "Power station handed to his brother outside, 18650 cells moved to cabin in a battery case, power bank in his backpack. Re-process the trolley.",
      commands: [
        {
          pattern: "^PD/LHEDOH/24OCT$",
          display: "PD/LHEDOH/24OCT",
          hint: "Passenger Display — pull up flight QR 629 LHE→DOH for 24 OCT.",
          output: [
            "FLIGHT: QR 629  LHE-DOH  EQP 320  STATUS: OPEN",
            "STD 1545  GATE B04  CUTOFF 1510  ROWS 2-4",
            "PAX F/C/Y: 012/024/168   BAGS 142/883.0K",
          ],
          errorHint: "Format: PD/<origin><destination>/<DDMMM> — e.g. PD/LHEDOH/24OCT",
          points: 8,
        },
        {
          pattern: "^RT/SIDDIQUI$",
          display: "RT/SIDDIQUI",
          hint: "Retrieve the passenger record by family name.",
          output: [
            "NAME: SIDDIQUI/TANVIR AHMED MR   RECLOC GH6T2P",
            "ITN: 1 QR 629 Q 24OCT LHEDOH HK1  SEAT 14C",
            "TKT 157-7733112200  CLASS Y  BAG 1PC",
          ],
          errorHint: "Retrieve by name: RT/SIDDIQUI",
          points: 8,
        },
        {
          pattern: "^SRDGR-P1/.*",
          display: "SR DGR-P1/6X 18650 CELLS CABIN/TERMINALS TAPED",
          hint: "Add the DGR special service request for passenger 1 — note the lithium handling.",
          output: [
            "OK SSR DGR ADDED",
            "LI-ION SPARE CELLS CABIN ONLY  PAX1  QR629",
          ],
          errorHint:
            "Start with SR DGR-P1/ and describe the lithium arrangement, e.g. SR DGR-P1/6X 18650 CELLS CABIN/TERMINALS TAPED",
          points: 8,
        },
        {
          pattern: "^BAG/1/21\\.0$",
          display: "BAG/1/21.0",
          hint: "Re-enter the checked trolley — 1 piece, 21.0 kg after DGR removal.",
          output: [
            "BAG TAG 0456-11445566  QR629 LHEDOH",
            "1PC 21.0KG  OK",
          ],
          errorHint: "Format: BAG/<pieces>/<weight> — BAG/1/21.0",
          points: 8,
        },
        {
          pattern: "^PADD-DGR.*",
          display: "PADD-DGR 300WH POWER STATION REFUSED/SPARE CELLS TO CABIN",
          hint: "Log the DGR audit remark — the refusal and the remediation.",
          output: ["OK REMARK ADDED TO PNR GH6T2P"],
          errorHint:
            "Start with PADD-DGR and describe the refusal/remediation, e.g. PADD-DGR 300WH POWER STATION REFUSED/SPARE CELLS TO CABIN",
          points: 8,
        },
      ],
    },
    {
      type: "decision",
      id: "m6-d3",
      prompt: "The 300Wh power station cannot fly. Choose the correct disposal path.",
      situation:
        "Tanvir's brother is still landside with a car. The power station is 40,000 PKR of site equipment. What is the compliant disposition?",
      options: [
        {
          id: "m6-d3-a",
          text: "Hand it back to his brother landside (no pass needed outside), record the refusal in PADD, and advise shipping it later as air CARGO on a DGR-compliant AWB — passenger aircraft never carry >160Wh.",
          points: 16,
          feedback:
            "Correct: hand-back to family, documented refusal, and the legal alternative — cargo under an IATA DGR AWB. Passenger keeps both his money and his flight.",
          consequence:
            "Brother takes the station; Tanvir boards relaxed. Supervisor later praises the clean PADD trail.",
          best: true,
        },
        {
          id: "m6-d3-b",
          text: "Slip it into his brother's checked bag on tomorrow's PIA flight instead — same family, no harm done.",
          points: 4,
          feedback:
            "You have just moved a forbidden hazard onto another flight. The violation travels with it — this is complicity, not problem-solving.",
          best: false,
        },
        {
          id: "m6-d3-c",
          text: "Keep it behind the counter 'for collection' when he returns next week.",
          points: 0,
          feedback:
            "Unlicensed storage of a large lithium device at a landside counter is a fire risk and outside SAPS procedure. Never do this.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m6-d4",
      prompt: "Explain the WHY behind the cabin-only rule.",
      passengerLines: [
        "Beta, I still don't get it — a power bank is just a small battery. Why is it fine over my head but 'dangerous' down below with the suitcases?",
      ],
      options: [
        {
          id: "m6-d4-a",
          text: "If a lithium cell overheats it can go into 'thermal runaway' — a fire that feeds itself. Up in the cabin the crew sees smoke in seconds and has extinguishers and water; down in the hold a fire starts where nobody can reach it. That is why power banks, spare cells and vapes ride in the cabin with us — and the big 300Wh station doesn't ride at all.",
          points: 8,
          feedback:
            "Excellent: plain-language safety logic (detection + intervention in cabin vs unreachable hold). Passengers who understand WHY comply.",
          consequence:
            "He nods: 'Over your head where they can fight it. Makes sense, ustad.'",
          best: true,
        },
        {
          id: "m6-d4-b",
          text: "It is the airline's rule, sir — they made it, we follow it.",
          points: 4,
          feedback:
            "Weak: 'because the airline says so' invites arguments. DGR rules exist for fire safety — say so.",
          best: false,
        },
        {
          id: "m6-d4-c",
          text: "Honestly? The hold gets too cold and batteries die faster.",
          points: 0,
          feedback:
            "Factually wrong explanation destroys your credibility on every other rule you quote.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "m6-d5",
      prompt: "Last check — the hidden vape at bag-drop staging.",
      situation:
        "While the trolley is staged, the ramp agent radios: a small e-cigarette is loose in the front pocket netting of the CHECKED trolley. Boarding completes in 20 minutes.",
      options: [
        {
          id: "m6-d5-a",
          text: "Pull the trolley from the load before the belt loader closes, remove the e-cig, hand it to Tanvir in the cabin with the no-charging advice, and confirm the bag count back to ramp.",
          points: 12,
          feedback:
            "Correct: catch it before loading, move the vape to cabin, advise 'no use, no charge onboard', and reconcile the bag count. Teamwork closes the hazard.",
          consequence:
            "Ramp confirms bag re-loaded; QR 629 pushes back on time with a clean DGR log.",
          best: true,
        },
        {
          id: "m6-d5-b",
          text: "It is only a tiny vape — let the bag load as it is, no need to bother the passenger.",
          points: 0,
          feedback:
            "A vape in the hold is a prohibited hazard regardless of size. 'Tiny' is exactly how hold fires start.",
          best: false,
        },
        {
          id: "m6-d5-c",
          text: "Confiscate the vape, keep it at the desk and tell him to collect after his trip.",
          points: 6,
          feedback:
            "Wrong authority: you may not confiscate property. The compliant move is remove-to-cabin with advice — or he surrenders it voluntarily.",
          best: false,
        },
      ],
    },
  ],
  debriefRules: [
    {
      source: "IATA DGR 67th Ed. (2026) — Lithium Batteries",
      ref: "≤100Wh cabin OK · 100–160Wh airline approval · >160Wh FORBIDDEN",
      detail:
        "Power banks and spare lithium-ion cells are carry-on ONLY. Spare cells need terminal protection (tape/battery case). Power stations above 160Wh cannot fly on passenger aircraft at all.",
    },
    {
      source: "IATA DGR — Electronic Cigarettes",
      ref: "E-cigs/vapes: cabin only, never checked, no charging onboard",
      detail:
        "Vapes contain lithium cells plus heating liquid — hold carriage is prohibited; onboard charging/use is banned.",
    },
    {
      source: "SAPS SOP — DGR Audit Trail",
      ref: "SR DGR + PADD remark + bag re-entry",
      detail:
        "Every DGR event at check-in must leave an SSR, a PADD audit remark and a corrected bag entry in Altéa — the PNR is your legal record.",
    },
  ],
  checklist: [
    "Ask to see power/battery equipment BEFORE tagging the bag",
    "Classify each item: 100Wh limit (cabin), 160Wh limit (absolute), spare cells cabin-only",
    "Refuse >160Wh power stations for carriage — offer cargo-AWB alternative",
    "Spare 18650 cells: move to cabin, terminals taped or boxed",
    "E-cig: cabin only, advise no charging/use onboard",
    "PD/LHEDOH/24OCT then RT/SIDDIQUI",
    "SR DGR-P1/… — lithium arrangement SSR",
    "Re-enter corrected bag: BAG/1/21.0",
    "PADD-DGR … — document refusal + remediation (audit trail)",
    "Final sweep with ramp: no loose lithium left in checked pieces",
  ],
  badgeId: "lithium-guard",
};

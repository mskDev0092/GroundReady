import type { Scenario } from "@/lib/types";

/**
 * MODULE 3 — Food Items & Biosecurity Restrictions (TIMATIC Lookups)
 * UK-bound frozen home-cooked meat cooled with 3 kg of Dry Ice (Class 9, UN 1845).
 */
export const scenarioDryIceUK: Scenario = {
  id: "m3-dryice",
  moduleNo: 3,
  code: "M3-DGR",
  title: "Paye, Nihari & 3kg of Dry Ice",
  category: "documentation",
  tags: ["TIMATIC", "DGR", "Dry Ice", "Class 9", "Biosecurity", "UK"],
  difficulty: 4,
  xpBase: 160,
  minutes: 14,
  summary:
    "A UK-bound passenger checks a cool-box of frozen home-cooked Siri Paye and Nihari packed with 3 kg of dry ice. TIMATIC and IATA DGR 2026 both have something to say.",
  briefing:
    "You are the SAPS Traffic Assistant at Lahore (LHE) row 1, flight PK 757 LHE–LHR. Mrs Ayesha Siddiqui checks one cool-box: 8 kg of frozen home-cooked meat dishes (Siri Paye, Nihari) chilled with 3 kg of DRY ICE (UN 1845, Class 9). Run the TIMATIC customs check for the UK, apply IATA DGR 67th Edition dry-ice limits (2.5 kg max per package, ventilated, leak-proof outer packaging, LRT with CO₂ notation), and handle the biosecurity refusal with care.",
  objectives: [
    "Run TIMATIC customs lookup (TI CUSTOMS/UK) before accepting food items",
    "Apply the UK Border Force ban on personal meat imports from non-EU countries",
    "Enforce IATA DGR: dry ice ≤2.5 kg per package, ventilated, leak-proof outer packaging",
    "Enter the ICE SSR and CO₂/LRT documentation correctly in Altéa",
  ],
  passenger: {
    name: "Ayesha Siddiqui",
    age: 45,
    nationality: "Pakistan",
    passportNo: "DX-8812390",
    passportExpiry: "22 JUL 2028",
    pnr: "9ZR2WN",
    ticketNo: "214-7788990011",
    flight: "PK 757",
    route: "LHE → LHR",
    date: "24 OCT",
    seat: "31B",
    fareClass: "Y — Economy Flex",
    allowance: "2PC / 23KG each",
    originStation: "LHE — SAPS Row 1",
    avatarTone: "rose",
    visa: "UK Visit Visa — 6 months",
  },
  baggage: [
    { id: "b1", label: "Blue cool-box — 8kg frozen food + dry ice", weightKg: 11.0, type: "checked", note: "Contains UN 1845 DRY ICE 3.0KG — EXCEEDS 2.5KG LIMIT", tag: "C-COOLBOX" },
    { id: "b2", label: "Large suitcase", weightKg: 21.5, type: "checked" },
    { id: "b3", label: "Handbag", weightKg: 4.0, type: "cabin" },
  ],
  documents: {
    passport: [
      { key: "name", label: "Name", value: "SIDDQUI, AYESHA" },
      { key: "nat", label: "Nationality", value: "PAKISTAN" },
      { key: "exp", label: "Expiry", value: "22 JUL 2028", highlight: "ok" },
    ],
    visa: [
      { key: "type", label: "Visa", value: "UK STANDARD VISITOR" },
      { key: "status", label: "Status", value: "VALID — MULTIPLE ENTRY", highlight: "ok" },
    ],
    ticket: [
      { key: "pnr", label: "PNR", value: "9ZR2WN" },
      { key: "tkt", label: "Ticket", value: "214-7788990011" },
      { key: "fl", label: "Flight", value: "PK 757 J 24OCT LHELHR HK1" },
      { key: "seat", label: "Seat", value: "31B" },
    ],
    extra: [
      { key: "dgr", label: "DGR check", value: "DRY ICE 3.0KG > 2.5KG MAX", highlight: "bad" },
      { key: "bio", label: "TIMATIC customs", value: "PENDING — RUN TI CUSTOMS/UK", highlight: "warn" },
    ],
  },
  steps: [
    {
      type: "dialogue",
      id: "s3-d1",
      prompt: "Food items are a customs and DGR minefield — discover before deciding.",
      passengerLines: [
        "Beta, I cooked Siri Paye and Nihari for my son in London — frozen solid, packed in a cool-box with ice so it stays frozen. It is just home food, no problem, no?",
      ],
      options: [
        {
          id: "s3-d1-a",
          text: "Aunty, home food needs two checks before I can accept it: what the UK allows at the border (I will run the TIMATIC customs check), and what keeps the aircraft safe — may I ask how the box is cooled? Ordinary ice or something else?",
          points: 8,
          feedback:
            "Excellent: two-channel thinking — destination customs rules AND dangerous-goods cooling method. Discovery before acceptance.",
          consequence:
            "'Dry ice, beta. Three kilos from the ice factory. It keeps everything frozen for two days.' (DGR alarm: UN 1845, Class 9.)",
          best: true,
        },
        {
          id: "s3-d1-b",
          text: "Home food is fine, aunty. Let me just weigh the box.",
          points: 2,
          feedback:
            "Skipping the customs check risks a seized bag at UK Border Force and a retrace. Always run TIMATIC for food items.",
          best: false,
        },
        {
          id: "s3-d1-c",
          text: "No food items are allowed on flights. Please remove it.",
          points: 4,
          feedback:
            "Over-refusal: many foods are fine. The correct path is a TIMATIC customs check for the destination, then DGR checks on the cooling agent.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "s3-t1",
      prompt:
        "Run the TIMATIC customs lookup, then document the dry ice and the bag correctly.",
      intro:
        "TIMATIC is the authoritative source for customs/immigration rules. Check UK rules BEFORE accepting the food, then enter the DGR data.",
      commands: [
        {
          pattern: "^TICUSTOMS/UK$",
          display: "TI CUSTOMS/UK",
          hint: "TIMATIC customs information for the United Kingdom.",
          output: [
            "TIMATIC  CUSTOMS INFORMATION  DESTINATION: GB",
            "MEAT/MILK PRODUCTS NON-EU: PROHIBITED",
            "PERSONAL IMPORTS: SEIZED AND DESTROYED AT BORDER",
            "DRY ICE UN1845: MAX 2.5KG PER PAX, CHECKED ONLY",
            "PACKAGING: VENTILATED, LEAK-PROOF OUTER REQUIRED",
          ],
          errorHint: "Format: TI CUSTOMS/UK (TI, space, CUSTOMS, slash, country code)",
          points: 12,
        },
        {
          pattern: "^SRICE-P1/2\\.5KG.*",
          display: "SR ICE-P1/2.5KG/UN1845",
          hint: "Add the ICE SSR for passenger 1 — 2.5 KG after she reduces the load.",
          output: [
            "OK SSR ICE ADDED",
            "DRY ICE UN1845 2.5KG PAX1 VENTILATED PKG",
          ],
          errorHint: "Format: SR ICE-P1/2.5KG/UN1845 — include the UN number for Class 9.",
          points: 10,
        },
        {
          pattern: "^BAG/1/11\\.0/C-COOLBOX$",
          display: "BAG/1/11.0/C-COOLBOX",
          hint: "Enter the cool-box: 1 piece, 11.0 kg, cool-box tag.",
          output: [
            "BAG TAG 0456-55667788  PK757 LHELHR",
            "1PC 11.0KG  TAG: C-COOLBOX  CONTENTS DECLARED",
            "OK",
          ],
          errorHint: "Format: BAG/1/11.0/C-COOLBOX",
          points: 8,
        },
        {
          pattern: "^PADD-DRYICE.*",
          display: "PADD-DRY ICE 2.5KG UN1845 VENTILATED PKG/LRT CO2 NOTATION",
          hint: "Log the DGR remark — dry ice weight, UN number, ventilation and CO₂/LRT notation.",
          output: ["OK REMARK ADDED TO PNR 9ZR2WN"],
          errorHint:
            "Start with PADD-DRY ICE and include UN1845 + ventilation + LRT/CO2.",
          points: 10,
        },
      ],
    },
    {
      type: "dialogue",
      id: "s3-d2",
      prompt: "Deliver the biosecurity refusal with empathy.",
      passengerLines: [
        "'MEAT FROM PAKISTAN PROHIBITED'? Beta, it is cooked! Fully cooked! Sealed in the box! My son begs for my Nihari — he has not eaten it in two years!",
      ],
      options: [
        {
          id: "s3-d2-a",
          text: "Aunty, I understand completely — and I am sorry. The UK ban is at the border, not in the kitchen: Border Force scans bags and seizes ALL meat products from non-EU countries, cooked or not, and fines can follow. The fair choice is yours: take the food out here and I check the empty cool-box, or keep it and risk seizure at Heathrow. I cannot tag it into the hold hoping it passes.",
          points: 20,
          feedback:
            "Perfect: empathy + the real enforcement mechanism (scanners, seizure, fines) + a genuine choice, while refusing to be the one who breaks the rule.",
          consequence:
            "She sighs: 'After all that cooking… okay beta, give me the box. My daughter-in-law will get fresh Nihari when I cook there instead.'",
          best: true,
        },
        {
          id: "s3-d2-b",
          text: "It is cooked, so it is fine. Let me tag it before the queue gets longer.",
          points: 0,
          feedback:
            "Wrong twice: cooking does NOT exempt meat from UK biosecurity rules, and knowingly sending a prohibited item is an SOP and integrity breach.",
          best: false,
        },
        {
          id: "s3-d2-c",
          text: "Rules are rules, aunty. Remove it or I call security.",
          points: 10,
          feedback:
            "The decision is correct but the delivery is cold and threatening. Lead with empathy and give options first.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "s3-d3",
      prompt:
        "She keeps the cool-box but drops the food. Now fix the DGR problem: she still has 3.0 kg of dry ice.",
      situation:
        "IATA DGR 67th Edition: dry ice (UN 1845) checked baggage — max 2.5 kg PER PACKAGE, packaging must release CO₂ gas, outer packaging leak-proof, LRT with CO₂ notation required.",
      options: [
        {
          id: "s3-d3-a",
          text: "Reduce the ice to 2.5 kg or less (return the extra to the ice factory vendor), drill-open/unseal the cooler so gas can vent, keep a leak-proof liner for melt-water, and apply the LRT with the CO₂ notation and UN 1845 marking.",
          points: 20,
          feedback:
            "Fully compliant: ≤2.5 kg, vented packaging (CO₂ must dissipate — a sealed box can burst or asphyxiate), leak-proof outer, LRT with UN 1845/CO₂ notation.",
          consequence:
            "Ramp supervisor confirms: 'Cool-box vented, 2.5kg, LRT with CO2 notation — accepted.'",
          best: true,
        },
        {
          id: "s3-d3-b",
          text: "Keep all 3 kg but double-bag it so nothing leaks.",
          points: 8,
          feedback:
            "Double-bagging traps CO₂ gas: pressure build-up can rupture the package in the hold. The 2.5 kg limit and ventilation are both mandatory.",
          best: false,
        },
        {
          id: "s3-d3-c",
          text: "Move the dry ice into her cabin handbag — the 2.5 kg limit is only for checked bags.",
          points: 0,
          feedback:
            "Dangerous misinformation: cabin dry ice is even more restricted (≤2.5 kg AND airline approval with venting); hiding it in a handbag is a concealed DGR violation.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "s3-d4",
      prompt: "She asks the safety question every T/A must be able to answer.",
      passengerLines: [
        "Why all this fuss about a little ice, beta? It is frozen water, no?",
      ],
      options: [
        {
          id: "s3-d4-a",
          text: "It is frozen CO₂ gas, aunty — not water. It turns straight into gas as it warms: inside a sealed box the pressure can burst it open, and the heavy gas settles in the aircraft hold, which is why the limit is 2.5 kg and the packaging must let the gas escape safely.",
          points: 12,
          feedback:
            "Perfect explanation: sublimation → pressure → asphyxiant gas pooling, mapped to the 2.5 kg limit and the ventilation requirement.",
          consequence:
            "'Astaghfirullah! Then thank God you checked it, beta. Make my box safe the right way.'",
          best: true,
        },
        {
          id: "s3-d4-b",
          text: "It is airline policy, aunty. We cannot explain everything.",
          points: 6,
          feedback:
            "'Policy because policy' answers nothing and erodes trust. T/As are the face of safety — explain the why.",
          best: false,
        },
        {
          id: "s3-d4-c",
          text: "If too much is loaded the pilot's controls freeze. That is why.",
          points: 2,
          feedback:
            "Incorrect — the hazard is CO₂ gas build-up (pressure + asphyxiation), not frozen controls. Wrong safety explanations spread myths.",
          best: false,
        },
      ],
    },
  ],
  debriefRules: [
    {
      source: "UK Border Force — Biosecurity",
      ref: "Personal imports of meat/milk products from non-EU countries",
      detail:
        "Prohibited at the border regardless of cooking; items are seized (and destroyed) and penalties can apply. Verify with TIMATIC (TI CUSTOMS/UK) before acceptance.",
    },
    {
      source: "IATA DGR 67th Edition (2026)",
      ref: "Class 9 — UN 1845 Dry Ice, PI 954",
      detail:
        "Checked baggage: max 2.5 kg per package; packaging must vent CO₂ gas (not airtight); leak-proof outer packaging for melt-water; net weight marked; LRT with CO₂ notation.",
    },
    {
      source: "Altéa DCS — DGR entries",
      ref: "SR ICE + PADD documentation",
      detail:
        "SSR ICE with weight and UN number, bag entry with special tag, and PADD remark create the auditable DGR trail for ramp and load control.",
    },
  ],
  checklist: [
    "Ask how the food is cooled — identify dry ice (UN 1845, Class 9) early",
    "Run TI CUSTOMS/UK BEFORE accepting any food item",
    "UK ban: no personal meat/milk imports from non-EU — cooked or not",
    "Give the passenger an honest choice; never tag a prohibited item 'hoping'",
    "Dry ice ≤ 2.5 kg per package — weigh and reduce if over",
    "Packaging must VENT CO₂ (no airtight sealing) + leak-proof outer",
    "SR ICE-P1/2.5KG/UN1845 + BAG entry with cool-box tag",
    "PADD-DRY ICE … UN1845 … LRT CO₂ notation (audit trail)",
    "Apply LRT with CO₂ and UN 1845 marking physically on the box",
    "Explain sublimation risk calmly — build passenger trust",
  ],
  badgeId: "dgr-expert",
};

import type { Scenario } from "@/lib/types";

/**
 * MODULE 8 — Passport Validity & TIMATIC Verification (The 6-Month Myth)
 * First-time traveller to Manchester — "everyone says 6 months is required".
 */
export const scenarioValidity: Scenario = {
  id: "m8-validity",
  moduleNo: 8,
  code: "M8-VALID",
  title: "Validity Countdown",
  category: "documentation",
  tags: ["TIMATIC", "Passport Validity", "UK", "Visa", "Verification"],
  difficulty: 3,
  xpBase: 150,
  minutes: 12,
  summary:
    "A mother visiting her son in Manchester is refused by 'everyone' because her passport expires in 5 months — is the 6-month rule real for the UK?",
  briefing:
    "You are the SAPS Traffic Assistant at Row 4, Lahore (LHE), flight PK 771 LHE–MAN, 24 OCT. Zahida Parveen, 58, is flying to Manchester for six weeks with a return ticket on 21 NOV. Her passport expires 04 APR 2027. Her son's WhatsApp group and a 'travel agent' insist the UK needs 6 months validity, and a colleague at another counter already told her to go home and make a new passport. Verify the ACTUAL requirement via TIMATIC and decide — do not guess, do not inherit anyone's rumour.",
  objectives: [
    "Never accept or reject a document on hearsay — verify with TIMATIC (TI DOC)",
    "Know the UK visitor rule: passport valid for the DURATION OF STAY (no 6-month rule)",
    "Assess minor passport damage correctly (photo/MRZ intact vs unusable)",
    "Record the verification outcome in Altéa (SR DOCS + PADD) and hand over confidently",
  ],
  passenger: {
    name: "Zahida Parveen",
    age: 58,
    nationality: "Pakistan",
    passportNo: "XT-1029384",
    passportExpiry: "04 APR 2027",
    pnr: "KLM8ZT",
    ticketNo: "214-4666221145",
    flight: "PK 771",
    route: "LHE → MAN",
    date: "24 OCT",
    seat: "44F",
    fareClass: "Y — Economy Saver",
    allowance: "2PC / 23KG each",
    originStation: "LHE — SAPS Row 4",
    avatarTone: "violet",
    visa: "UK Standard Visitor — 6 months, valid",
  },
  baggage: [
    { id: "b1", label: "Large suitcase — gifts & winter clothes", weightKg: 22.8, type: "checked" },
    { id: "b2", label: "Medium suitcase — shawls, dry fruit", weightKg: 20.3, type: "checked" },
    { id: "b3", label: "Handbag + small crossbody (cabin)", weightKg: 5.1, type: "cabin" },
  ],
  documents: {
    passport: [
      { key: "name", label: "Name", value: "PARVEEN, ZAHIDA" },
      { key: "nat", label: "Nationality", value: "PAKISTAN" },
      { key: "dob", label: "DOB", value: "21 JAN 1968" },
      { key: "exp", label: "Expiry", value: "04 APR 2027", highlight: "warn" },
      { key: "cond", label: "Condition", value: "Minor corner wear — photo & MRZ fully intact", highlight: "ok" },
    ],
    visa: [
      { key: "type", label: "Visa", value: "UK STANDARD VISITOR — MULTIPLE" },
      { key: "status", label: "Status", value: "VALID — ISSUED 12 SEP", highlight: "ok" },
    ],
    ticket: [
      { key: "pnr", label: "PNR", value: "KLM8ZT" },
      { key: "tkt", label: "Ticket", value: "214-4666221145" },
      { key: "fl", label: "Flight", value: "PK 771 A 24OCT LHEMAN HK1" },
      { key: "ret", label: "Return", value: "PK 772 21NOV MANLHE HK1" },
      { key: "seat", label: "Seat", value: "44F" },
    ],
  },
  steps: [
    {
      type: "dialogue",
      id: "m8-d1",
      prompt: "Open the interaction — she arrives already distressed.",
      passengerLines: [
        "Beta, the girl on Row 3 said my passport is finished and I should go home. My son is waiting at Manchester airport — his first child is due next month. Please check properly, I am begging you.",
      ],
      options: [
        {
          id: "m8-d1-a",
          text: "Ammi Jaan, do not worry — nobody decides your journey from a rumour here. Give me two minutes: I will check your passport against the official TIMATIC database, which is exactly what the airline uses, and we will go by THAT answer only.",
          points: 8,
          feedback:
            "Perfect: calm reassurance + commitment to the authoritative source (TIMATIC). This is the SOP — verify, never inherit a colleague's guess.",
          consequence:
            "She sits down, hands over the passport. 'Beta, her cousin's visa was refused, so she knows these things…'",
          best: true,
        },
        {
          id: "m8-d1-b",
          text: "If my colleague said it, it must be right — you should go home and get a new passport, madam.",
          points: 4,
          feedback:
            "You just inherited a rumour and broke a valid booking. Verify FIRST — the UK does not apply a 6-month rule to visitors.",
          best: false,
        },
        {
          id: "m8-d1-c",
          text: "It is fine, it is fine, do not listen to anyone — here is your boarding pass.",
          points: 2,
          feedback:
            "The opposite failure: accepting WITHOUT verification. If you cannot cite the rule, you cannot defend the decision at the gate.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m8-d2",
      prompt: "Resolve the 6-month myth with the actual rule.",
      passengerLines: [
        "Everyone says six months, beta. The travel shop man said it, my son's WhatsApp group says it. Is it true or not?",
      ],
      options: [
        {
          id: "m8-d2-a",
          text: "For the UK the answer is on the record: a visitor's passport must be valid for the DURATION OF YOUR STAY — there is no 6-month rule for UK visits. You arrive 24 OCT, return 21 NOV, and your passport runs to 04 APR 2027. That is more than four months of margin AFTER your return. The 6-month rule people repeat belongs to other regions like Schengen. TIMATIC will confirm this in black and white.",
          points: 16,
          feedback:
            "Textbook: cites the actual UK duration-of-stay rule, contrasts it with Schengen (where the myth comes from), and anchors it to HER dates. Verify with TI DOC next.",
          consequence:
            "'Schengen… that is Europe, na? So for Manchester my passport is fine?' — 'TIMATIC will say exactly that in a moment.'",
          best: true,
        },
        {
          id: "m8-d2-b",
          text: "Six months is the rule everywhere, madam — but you have almost six, so you are okay by a few days.",
          points: 4,
          feedback:
            "Factually wrong (no UK 6-month rule) AND you nearly failed her: 04 APR minus 24 OCT is about 5.3 months — 'a few days' margin is a fiction.",
          best: false,
        },
        {
          id: "m8-d2-c",
          text: "I cannot say without checking — but your visa looks nice and new, so probably no problem.",
          points: 2,
          feedback:
            "'Probably' is not a decision. Visa validity and passport validity are separate checks — run TIMATIC and cite the result.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "m8-t1",
      prompt:
        "Run the official verification chain in Altéa DCS: flight, passenger, TIMATIC, then record the outcome.",
      intro: "Passport, UK visa and return ticket are on your desk. Verify everything in the system.",
      commands: [
        {
          pattern: "^PD/LHEMAN/24OCT$",
          display: "PD/LHEMAN/24OCT",
          hint: "Passenger Display — pull up flight PK 771 LHE→MAN for 24 OCT.",
          output: [
            "FLIGHT: PK 771  LHE-MAN  EQP 77L  STATUS: OPEN",
            "STD 1130  GATE A09  CUTOFF 1055  ROWS 3-6",
            "PAX F/C/Y: 014/028/296   BAGS 197/2102.5K",
          ],
          errorHint: "Format: PD/<origin><destination>/<DDMMM> — e.g. PD/LHEMAN/24OCT",
          points: 8,
        },
        {
          pattern: "^RT/PARVEEN$",
          display: "RT/PARVEEN",
          hint: "Retrieve the passenger record by family name.",
          output: [
            "NAME: PARVEEN/ZAHIDA MRS   RECLOC KLM8ZT",
            "ITN: 1 PK 771 A 24OCT LHEMAN HK1  SEAT 44F",
            "ITN: 2 PK 772 21NOV MANLHE HK1",
            "TKT 214-4666221145  CLASS Y  BAG 2PC/23K",
          ],
          errorHint: "Retrieve by name: RT/PARVEEN",
          points: 8,
        },
        {
          pattern: "^TIDOC/GB$",
          display: "TI DOC/GB",
          hint: "TIMATIC document check — Pakistan passport travelling to the United Kingdom.",
          output: [
            "TIMATIC  PAK/GBR  VISITOR — STANDARD",
            "PASSPORT: VALID FOR DURATION OF INTENDED STAY",
            "NO 6-MONTH VALIDITY REQUIREMENT FOR VISITORS",
            "VISA: REQUIRED — HELD (STANDARD VISITOR)",
            "ONWARD: RETURN 21NOV WITHIN VALIDITY  ***OK***",
          ],
          errorHint: "Format: TI DOC/<country code> — TI DOC/GB for the United Kingdom",
          points: 8,
        },
        {
          pattern: "^SRDOCS-P1/.*",
          display: "SR DOCS-P1/PASSPORT VALID 04APR27 STAY ENDS 21NOV",
          hint: "Record the document verification SSR for passenger 1.",
          output: [
            "OK SSR DOCS ADDED",
            "PASSPORT VALID 04APR27  STAY ENDS 21NOV  PAX1",
          ],
          errorHint: "Start with SR DOCS-P1/ and state the validity facts, e.g. SR DOCS-P1/PASSPORT VALID 04APR27 STAY ENDS 21NOV",
          points: 8,
        },
        {
          pattern: "^PADD-TIMATIC.*",
          display: "PADD-TIMATIC GBR OK VALID FOR STAY/RET 21NOV",
          hint: "Log the audit remark — TIMATIC result and your decision.",
          output: ["OK REMARK ADDED TO PNR KLM8ZT"],
          errorHint: "Start with PADD-TIMATIC and cite the result, e.g. PADD-TIMATIC GBR OK VALID FOR STAY/RET 21NOV",
          points: 8,
        },
      ],
    },
    {
      type: "decision",
      id: "m8-d3",
      prompt: "The passport condition question.",
      situation:
        "The passport shows minor corner wear and a soft laminate edge — but the photo is sharp, the biodata page is fully legible and the MRZ lines scan clean on your reader.",
      options: [
        {
          id: "m8-d3-a",
          text: "Accept it: photo, biodata and MRZ are all intact and machine-readable — this is normal travel wear, not damage. Note the condition in the PADD remark and hand over normally.",
          points: 16,
          feedback:
            "Correct: the test is function — can immigration read the photo, data and MRZ? Minor wear passes; only substitution marks, peeled photo or dead MRZ zones make a passport unfit.",
          consequence:
            "MRZ beeps green. She exhales for the first time since Row 3.",
          best: true,
        },
        {
          id: "m8-d3-b",
          text: "Reject it: any wear at all means the passport is 'damaged' and she must renew before travel.",
          points: 8,
          feedback:
            "Over-strict and wrong: cosmetic wear with intact photo/MRZ is acceptable. Refusing valid documents destroys service and has no rule basis.",
          best: false,
        },
        {
          id: "m8-d3-c",
          text: "Skip the condition check — expiry and visa were the real issues anyway.",
          points: 0,
          feedback:
            "Process hole: document CONDITION is a mandatory part of the check. A peeled photo or broken MRZ is stopped by UK border and the carriage cost falls on us.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m8-d4",
      prompt: "Communicate the result so she stops worrying.",
      passengerLines: [
        "So beta… truly? They will let me IN at Manchester? Say it clearly, my heart is beating fast.",
      ],
      options: [
        {
          id: "m8-d4-a",
          text: "Truly, Ammi Jaan. Look here on the printout — TIMATIC says 'valid for duration of stay', your return is 21 NOV, well inside your passport. Keep this printout with your ticket; if anyone at the counter or gate asks again, show it. And at Manchester immigration, show your son's address letter with it.",
          points: 8,
          feedback:
            "Excellent: clear confirmation, physical evidence she can show others, and the practical tip (address letter) for arrival. Reassurance with substance.",
          consequence:
            "She folds the printout into her Quran cover. 'Allah bless you, beta. Row 3 wali larki ko bhi bataoongi!'",
          best: true,
        },
        {
          id: "m8-d4-b",
          text: "Yes yes, everything is fine, NEXT please!",
          points: 4,
          feedback:
            "She heard the answer but got no evidence or direction — she will doubt it again at the gate. Slow down.",
          best: false,
        },
        {
          id: "m8-d4-c",
          text: "Probably fine — but immigration in England has the final say, so no promises.",
          points: 0,
          feedback:
            "Undermines a correct decision with unneeded fear. Immigration always has final say — that is not a reason to withhold a confident, documented answer.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "m8-d5",
      prompt: "Close the interaction completely.",
      situation: "Documents verified. She has 2 checked bags and a nervous first-travel mind. Close like a senior T/A.",
      options: [
        {
          id: "m8-d5-a",
          text: "Verify seat 44F on the BP, hand both bag receipts and match them to the tags, point her to immigration, and add one last kindness: a note of which documents folder to open FIRST at Manchester (passport + printout + address letter).",
          points: 12,
          feedback:
            "Complete close: BP verified, receipts matched, route directed, and arrival rehearsed. This is the difference between processing and assisting.",
          consequence:
            "She walks to immigration with the folder on her heart. PK 771 departs full and on time.",
          best: true,
        },
        {
          id: "m8-d5-b",
          text: "Hand the BP and receipts quickly and wave her on — the queue behind is 30 people.",
          points: 6,
          feedback:
            "Acceptable under pressure but incomplete: no receipt matching, no direction, no rehearsal. Fast is fine; careless is not.",
          best: false,
        },
        {
          id: "m8-d5-c",
          text: "Ask her to bring tea for the counter since you 'saved' her trip.",
          points: 0,
          feedback:
            "Soliciting any favour from passengers is gross misconduct — instant dismissal under SAPS integrity rules.",
          best: false,
        },
      ],
    },
  ],
  debriefRules: [
    {
      source: "TIMATIC — United Kingdom",
      ref: "Visitor: passport valid for duration of intended stay — NO 6-month rule",
      detail:
        "The 6-month validity requirement is often confused with Schengen/other regimes. For UK standard visitors, validity covering the stay suffices. Always resolve with TI DOC — never with rumour.",
    },
    {
      source: "IATA — Document Acceptance",
      ref: "Condition test: photo, biodata and MRZ must be intact and machine-readable",
      detail:
        "Minor wear is acceptable. Substitution marks, peeled photos or unreadable MRZ make the document unfit — refuse and advise renewal.",
    },
    {
      source: "SAPS SOP — Verification Audit",
      ref: "SR DOCS + PADD-TIMATIC remark on every edge-case acceptance",
      detail:
        "If your decision could be questioned at the gate, in Dubai, or by a supervisor next week — the PNR must already contain the answer.",
    },
  ],
  checklist: [
    "Never decide documents on hearsay — colleague, WhatsApp or 'travel shop man' included",
    "PD/LHEMAN/24OCT then RT/PARVEEN",
    "TI DOC/GB — run TIMATIC and read the result aloud to the passenger",
    "UK visitor rule: valid for duration of stay; check RETURN date inside validity",
    "Inspect passport condition: photo sharp, biodata legible, MRZ scans",
    "SR DOCS-P1/… — record validity facts",
    "PADD-TIMATIC … — audit the decision",
    "Give the passenger EVIDENCE (printout) + arrival guidance",
    "Verify BP seat, match bag receipts to tags, direct onward",
  ],
  badgeId: "doc-detective",
};

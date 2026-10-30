import type { Scenario } from "@/lib/types";

/**
 * MODULE 12 — Unaccompanied Minor (UMNR) — First Flight Alone
 * 8-year-old Zainab flies LHE→ISB to her grandmother. The handover chain is sacred.
 */
export const scenarioUMNR: Scenario = {
  id: "m12-umnr",
  moduleNo: 12,
  code: "M12-UMNR",
  title: "First Flight Alone",
  category: "special-pax",
  tags: ["UMNR", "Minor", "Handover Chain", "SR", "Domestic"],
  difficulty: 2,
  xpBase: 150,
  minutes: 12,
  summary:
    "Zainab, 8, flies alone to Islamabad. Her father wants to walk her to the aircraft; her grandmother 'will be there' at arrival. Build the handover chain properly.",
  briefing:
    "You are the SAPS Traffic Assistant at Row 1 (family lane), Lahore (LHE), flight PK 652 LHE–ISB, 24 OCT. Imran Choudhry checks in his daughter Zainab, 8, travelling alone to her grandmother. The UM form is half-blank: the arrival contact says 'Rukhsana, she knows the airport'. Apply the UMNR procedure: eligibility, the UM form with a complete contact chain, the SR in Altéa, boarding priority, and the escort handover — child visible to a named adult at every step of the journey.",
  objectives: [
    "Apply UMNR eligibility (5–11 years mandatory UM; 12–15 on request)",
    "Complete the UM form: BOTH guardian numbers + named arrival receiver with contact",
    "Add SR UMNR + PADD handover record in Altéa",
    "Board the UM FIRST and transfer custody face-to-face, name to name",
  ],
  passenger: {
    name: "Zainab Imran Choudhry",
    age: 8,
    nationality: "Pakistan",
    passportNo: "— (CNIC B-Form: 35202-7781123-8)",
    passportExpiry: "— (domestic flight)",
    pnr: "PLM4RT",
    ticketNo: "214-4733002211",
    flight: "PK 652",
    route: "LHE → ISB",
    date: "24 OCT",
    seat: "12A",
    fareClass: "Y — Economy Child",
    allowance: "1PC / 20KG",
    originStation: "LHE — SAPS Row 1 (Family Lane)",
    avatarTone: "rose",
  },
  baggage: [
    { id: "b1", label: "Pink trolley — school books & gifts for Dadi", weightKg: 11.8, type: "checked" },
    { id: "b2", label: "Unicorn backpack (cabin)", weightKg: 2.9, type: "cabin", note: "Snacks, water colour set, toy phone" },
  ],
  documents: {
    passport: [
      { key: "id", label: "ID (domestic)", value: "B-FORM 35202-7781123-8" },
      { key: "age", label: "Age proof", value: "8 YEARS — UMNR MANDATORY (5–11)", highlight: "warn" },
      { key: "consent", label: "Consent", value: "Father travelling WITH child at origin", highlight: "ok" },
    ],
    extra: [
      { key: "umform", label: "UM Form (4 copies)", value: "PARTIALLY FILLED — arrival contact incomplete", highlight: "bad" },
      { key: "drop", label: "Drop-off guardian", value: "IMRAN CHOUDHRY (father) 0300-4421987" },
      { key: "pickup", label: "Arrival receiver", value: "'Rukhsana — she knows the airport'", highlight: "bad" },
    ],
    ticket: [
      { key: "pnr", label: "PNR", value: "PLM4RT" },
      { key: "tkt", label: "Ticket", value: "214-4733002211" },
      { key: "fl", label: "Flight", value: "PK 652 Y 24OCT LHEISB HK1" },
      { key: "seat", label: "Seat", value: "12A" },
    ],
  },
  steps: [
    {
      type: "dialogue",
      id: "m12-d1",
      prompt: "Open the interaction with father and daughter.",
      passengerLines: [
        "'Assalam-o-alaikum. This is Zainab — she is flying to her Dadi in Islamabad, first time alone. Her mother passed last year, so it is just us. She has flown with me twice.' He squeezes the girl's shoulder; she hugs a unicorn backpack.",
      ],
      options: [
        {
          id: "m12-d1-a",
          text: "Wa-alaikum-salam. Assalam-o-alaikum, Zainab — welcome, captain! Sir, she will be in good hands: our unaccompanied-minor procedure gives her a named escort at every single step, from your hand right now to her grandmother's hand in Islamabad. Let me start her UM file — I will need your ID, your phone number, and her grandmother's FULL name and number, because 'Dadi' cannot be paged by love alone.",
          points: 8,
          feedback:
            "Perfect: greets the CHILD first (fear management), reassures the father with the actual procedure, and states exactly what the file needs — a complete contact chain.",
          consequence:
            "Zainab shows him the backpack: 'I have Parle-G for the air hostess.' Father chuckles despite himself.",
          best: true,
        },
        {
          id: "m12-d1-b",
          text: "Eight years old alone? That is not allowed at all — book yourself on the same flight, sir.",
          points: 4,
          feedback:
            "Wrong rule: 5–11 year-olds MUST travel as UMNR — the service exists precisely for this. Eligibility is mandatory UM handling, not a refusal.",
          best: false,
        },
        {
          id: "m12-d1-c",
          text: "Sure sir, here is her boarding pass — tell her to follow the crowd, it is a straight flight.",
          points: 0,
          feedback:
            "Serious negligence: an unaccompanied child without UM handling is invisible to crew and ground staff — the exact scenario child-safety procedures exist to prevent.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m12-d2",
      prompt: "Complete the UM contact chain — the form is half-blank.",
      passengerLines: [
        "Father fills the form until the arrival section. 'Rukhsana — she knows the airport, she will come.' Zainab tugs your sleeve: 'Dadi has a new phone but I forgot the number.'",
      ],
      options: [
        {
          id: "m12-d2-a",
          text: "Sir, this box is the most important line on the page: 'Dadi will come' is not a contact. I need her full name as on her CNIC, an active phone number, and the relationship — and one backup number reachable at arrival time. If the number is in Zainab's school diary or your WhatsApp, take a minute — the file only works if a human answers it at 14:20 when we land.",
          points: 16,
          feedback:
            "Textbook: the UM chain is only as strong as its weakest line. Named receiver + live number + backup, verified BEFORE the child leaves your sight.",
          consequence:
            "Father scrolls WhatsApp: 'Rukhsana Bano, 0333-7654321 — and my brother's number as backup, 0345-1122334.' The form is now a chain, not a hope.",
          best: true,
        },
        {
          id: "m12-d2-b",
          text: "Write 'Rukhsana — grandmother' and move on; families always sort themselves out at the other end.",
          points: 4,
          feedback:
            "The classic UM failure: at arrival, 'Rukhsana' is a name on paper with no phone — if she is late, the child sits in limbo and no one can be called.",
          best: false,
        },
        {
          id: "m12-d2-c",
          text: "Give the girl your own mobile number to call if anything happens at Islamabad.",
          points: 0,
          feedback:
            "The chain must connect to the REceiver, not to your personal phone — and a child should never hold a staff member's number as the safety plan.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "m12-t1",
      prompt:
        "Enter the UMNR service in Altéa DCS and print her boarding pass. Type commands at the > prompt.",
      intro: "UM form complete: drop-off Imran 0300-4421987, receiver Rukhsana Bano 0333-7654321, backup 0345-1122334.",
      commands: [
        {
          pattern: "^PD/LHEISB/24OCT$",
          display: "PD/LHEISB/24OCT",
          hint: "Passenger Display — pull up flight PK 652 LHE→ISB for 24 OCT.",
          output: [
            "FLIGHT: PK 652  LHE-ISB  EQP 320  STATUS: OPEN",
            "STD 1345  GATE A03  CUTOFF 1310  ROWS 2-5",
            "PAX F/C/Y: 008/018/151   BAGS 96/641.0K",
          ],
          errorHint: "Format: PD/<origin><destination>/<DDMMM> — e.g. PD/LHEISB/24OCT",
          points: 8,
        },
        {
          pattern: "^RT/CHOUDHRY$",
          display: "RT/CHOUDHRY",
          hint: "Retrieve the child's record by family name.",
          output: [
            "NAME: CHOUDHRY/ZAINAB IMRAN MISS (CHILD)",
            "RECLOC PLM4RT",
            "ITN: 1 PK 652 Y 24OCT LHEISB HK1  SEAT 12A",
            "TKT 214-4733002211  AGE 8  ***UMNR ELIGIBLE***",
          ],
          errorHint: "Retrieve by family name: RT/CHOUDHRY",
          points: 8,
        },
        {
          pattern: "^SRUMNR-P1/8YRS/FEMALE$",
          display: "SR UMNR-P1/8YRS/FEMALE",
          hint: "Add the unaccompanied-minor SSR — age and gender code.",
          output: [
            "OK SSR UMNR ADDED",
            "UNACCOMPANIED MINOR 8YRS F  PAX1  PK652",
            "CREW NOTIFICATION QUEUED",
          ],
          errorHint: "Format: SR UMNR-P1/8YRS/FEMALE — code, passenger, age, gender",
          points: 8,
        },
        {
          pattern: "^PADD-UMNR.*",
          display: "PADD-UMNR P1 DROP IMRAN 03004421987 PICK RUKHSANA BANO 03337654321 BKUP 03451122334",
          hint: "Log the full handover chain — drop-off, receiver, backup.",
          output: ["OK REMARK ADDED TO PNR PLM4RT"],
          errorHint:
            "Start with PADD-UMNR and include drop + pick + numbers, e.g. PADD-UMNR P1 DROP IMRAN 03004421987 PICK RUKHSANA BANO 03337654321 BKUP 03451122334",
          points: 8,
        },
        {
          pattern: "^BIP/P1$",
          display: "BIP/P1",
          hint: "Boarding pass issue — print Zainab's pass with the UM sleeve.",
          output: [
            "BIP OK  PAX1  CHOUDHRY/ZAINAB IMRAN MISS",
            "PK 652  LHE-ISB  SEAT 12A  24OCT",
            "UM SLEEVE + UMTAG PRINTED  ***CREW ALERTED***",
          ],
          errorHint: "Format: BIP/P1 — issue the pass, then attach the UM sleeve and tag",
          points: 8,
        },
      ],
    },
    {
      type: "decision",
      id: "m12-d2",
      prompt: "The father asks to walk her to the aircraft. Choose the correct handover.",
      situation:
        "'Please — let me take her to the plane door myself. I will come back out immediately, I promise.' He has no boarding pass; the ASD line is behind him.",
      options: [
        {
          id: "m12-d2-a",
          text: "Only ticketed passengers pass the ASD, sir — but here is what actually happens: I will take her through security on the UM escort lane, she boards FIRST before general boarding, and I hand her to the purser BY NAME — face to face, not a wave across the aisle. You wait at the window by gate A03 until the aircraft pushes back, and her grandmother gets a call from our ISB agent the moment Zainab is in her arms. Every metre is witnessed; that is the chain you are trusting.",
          points: 16,
          feedback:
            "Correct: ASD rules enforced with warmth, and the REAL chain described step by step — escort lane, first boarding, named purser handover, arrival agent call, parent watches pushback.",
          consequence:
            "Father nods slowly, eyes wet: 'First before everyone… okay. Okay.' Zainab is already practicing her 'good morning' to the crew.",
          best: true,
        },
        {
          id: "m12-d2-b",
          text: "Fine, walk her to the aircraft — but come straight back, and do not tell anyone I let you.",
          points: 0,
          feedback:
            "Security breach AND secret-keeping: an unticketed adult airside with a child, unrecorded. If ASF intercepts it, both of you are in a report.",
          best: false,
        },
        {
          id: "m12-d2-c",
          text: "Point at security: 'Through there, she can manage, the crew will see her.'",
          points: 0,
          feedback:
            "Releasing a child into the terminal alone breaks the chain at its first link. Custody transfers only adult-to-adult, name to name.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m12-d3",
      prompt: "The child is scared. Use your training.",
      passengerLines: [
        "At the gate, Zainab's bravado finally cracks: 'What if I need the toilet and the seatbelt sign is on? What if Dadi is not there and it gets dark?'",
      ],
      options: [
        {
          id: "m12-d3-a",
          text: "Captain Zainab, two answers, listen: FIRST — the air hostess sitting closest to you is YOUR air hostess today; her name is Areeba and I will introduce you on board, and if the seatbelt sign is on you press the call button and she helps you, that is her whole job. SECOND — Dadi will be standing at the arrival gate holding a sign from our office, because our Islamabad team calls her when the wheels touch. You are the most looked-after person on that plane today. Now, Parle-G for Areeba — deal?",
          points: 8,
          feedback:
            "Excellent child-communication: names the specific crew member (makes help concrete), explains the call button, describes the arrival handover in her terms, and ends with warmth.",
          consequence:
            "She clutches the Parle-G packet like a boarding pass and marches to the jet bridge first, chin up.",
          best: true,
        },
        {
          id: "m12-d3-b",
          text: "Do not cry in front of everyone, beta — big girls fly alone all the time.",
          points: 4,
          feedback:
            "Shame is not reassurance. Address the SPECIFIC fears (toilet, arrival) with the specific mechanisms.",
          best: false,
        },
        {
          id: "m12-d3-c",
          text: "If Dadi is not there, someone will figure something out — do not worry.",
          points: 0,
          feedback:
            "'Someone will figure something out' is the sentence that turns a handled case into a missing-child report. Describe the ACTUAL handover.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "m12-d4",
      prompt: "Boarding order — make the call.",
      situation:
        "Boarding opens. The queue is long, the flight is full, and Zainab's hand is in yours. When does she board?",
      options: [
        {
          id: "m12-d4-a",
          text: "She boards FIRST — dedicated pre-boarding, before any general call, walked to seat 12A and handed to Purser Areeba by name with the UM sleeve visible. Unaccompanied minors never board in a crowd and never wait in one; the earlier she is seated and named, the safer the whole chain.",
          points: 12,
          feedback:
            "Correct UM boarding doctrine: FIRST on, named handover, sleeve visible to crew, custody documented. The crowd never gets to touch her journey.",
          consequence:
            "Areeba signs the UM form with a smile; Zainab's window seat gets a paper crown from the galley. Pushback 1345, father waving from the window.",
          best: true,
        },
        {
          id: "m12-d4-b",
          text: "Board her in the general economy line — she has a normal seat, treat her normally.",
          points: 6,
          feedback:
            "Undermines the procedure: in a crowd she is unmarked, unnamed and unsupervised between handovers. UMNRs board first — that IS the protection.",
          best: false,
        },
        {
          id: "m12-d4-c",
          text: "Board her LAST so she spends minimum time on the aircraft.",
          points: 4,
          feedback:
            "Inverted logic: last boarding means a rushed handover, crew mid-task, and the highest chance the sleeve detail is missed. First on, every time.",
          best: false,
        },
      ],
    },
  ],
  debriefRules: [
    {
      source: "IATA — UMNR Handling (AHM)",
      ref: "Ages 5–11: UM service MANDATORY · 12–15: optional on request",
      detail:
        "UM handling includes: 4-copy UM form, UM sleeve/tag on the BP, dedicated boarding, named crew custody, arrival agent handover with ID check.",
    },
    {
      source: "SAPS SOP — UM Contact Chain",
      ref: "Named receiver + live phone + backup, verified before acceptance",
      detail:
        "The chain is only complete when a human answers at arrival time. 'She knows the airport' is an incomplete file — fill it or do not accept the child.",
    },
    {
      source: "SAPS SOP — Custody Transfer",
      ref: "Adult-to-adult, face-to-face, name to name — every metre witnessed",
      detail:
        "Parent → T/A → (security escort lane) → Purser by name → arrival agent → receiver with ID. No link may be a gesture, a guess or a child alone.",
    },
  ],
  checklist: [
    "Greet the CHILD first; explain the escort chain to the parent",
    "UM eligibility: 5–11 mandatory, 12–15 optional",
    "Complete UM form: drop guardian + receiver FULL name/CNIC + live numbers + backup",
    "PD/LHEISB/24OCT then RT/CHOUDHRY",
    "SR UMNR-P1/8YRS/FEMALE — the SSR alerts the crew",
    "PADD-UMNR … — the full handover chain in the PNR",
    "BIP/P1 + UM sleeve and tag on the boarding pass",
    "No unticketed adults airside — describe the chain instead of breaking the ASD line",
    "Child boards FIRST, handed to purser BY NAME, sleeve visible",
    "Father watches pushback; arrival agent calls receiver on touchdown",
  ],
  badgeId: "umnr-guardian",
};

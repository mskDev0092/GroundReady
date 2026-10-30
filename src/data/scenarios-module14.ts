import type { Scenario } from "@/lib/types";

/**
 * MODULE 14 — MEDA / Pregnancy Fit-to-Fly (Thirty-Four Weeks)
 * 34-weeks pregnant traveller to Dubai — certificate, indemnity, exit-row logic.
 */
export const scenarioMEDA: Scenario = {
  id: "m14-meda",
  moduleNo: 14,
  code: "M14-MEDA",
  title: "Thirty-Four Weeks",
  category: "special-pax",
  tags: ["MEDA", "Pregnancy", "Fit-to-Fly", "Indemnity", "Exit Row"],
  difficulty: 3,
  xpBase: 150,
  minutes: 12,
  summary:
    "Farzana, 34 weeks pregnant, flies to her husband in Dubai with a fresh certificate — but her return ticket lands her at 38 weeks. Catch it now.",
  briefing:
    "You are the SAPS Traffic Assistant at Counter 3, Islamabad (ISB), flight PK 231 ISB–DXB, 24 OCT. Farzana Leghari, 31, is visibly pregnant — 34 weeks, single uncomplicated pregnancy, Dr. Asma's fit-to-fly certificate issued 20 OCT at Shifa International. Her husband waits in Dubai. Rules: ≤28 weeks free travel; 28–36 weeks certificate + indemnity form; >36 weeks refused. Her return ticket is dated 14 DEC — which puts her at 38 weeks. Handle the outbound correctly, and catch the return trap before it becomes a Dubai airport drama.",
  objectives: [
    "Apply the pregnancy travel ladder: ≤28 / 28–36 (cert + indemnity) / >36 refused",
    "Verify the certificate: recent issue, licensed facility, no contra-indications noted",
    "Add SR MEDA + PADD in Altéa; block exit-row seating",
    "Flag the 38-week return leg NOW and re-protect her within the rules",
  ],
  passenger: {
    name: "Farzana Leghari",
    age: 31,
    nationality: "Pakistan",
    passportNo: "EV-6612830",
    passportExpiry: "22 JAN 2031",
    pnr: "QTR8VB",
    ticketNo: "214-4844220099",
    flight: "PK 231",
    route: "ISB → DXB",
    date: "24 OCT",
    seat: "17C (aisle, to be re-verified)",
    fareClass: "Y — Economy Value",
    allowance: "1PC / 30KG (Gulf fare)",
    originStation: "ISB — SAPS Counter 3",
    avatarTone: "teal",
    visa: "UAE Visit — 60 days, valid",
  },
  baggage: [
    { id: "b1", label: "Suitcase — maternity clothes & gifts", weightKg: 21.7, type: "checked" },
    { id: "b2", label: "Handbag + folder (cabin)", weightKg: 3.2, type: "cabin", note: "Medical file, certificate, ultrasound reports" },
  ],
  documents: {
    passport: [
      { key: "name", label: "Name", value: "LEGHARI, FARZANA" },
      { key: "nat", label: "Nationality", value: "PAKISTAN" },
      { key: "dob", label: "DOB", value: "16 JUN 1995" },
      { key: "exp", label: "Expiry", value: "22 JAN 2031", highlight: "ok" },
    ],
    visa: [
      { key: "type", label: "Visa", value: "UAE VISIT — 60 DAYS" },
      { key: "status", label: "Status", value: "VALID", highlight: "ok" },
    ],
    extra: [
      { key: "cert", label: "Fit-to-fly certificate", value: "DR. ASMA TARIQ, SHIFA INTL — ISSUED 20 OCT (4 DAYS AGO)", highlight: "ok" },
      { key: "preg", label: "Gestation", value: "34 WEEKS — SINGLE, UNCOMPLICATED", highlight: "warn" },
      { key: "return", label: "Return ticket", value: "PK 232 14 DEC DXBISB → 38 WEEKS", highlight: "bad" },
    ],
    ticket: [
      { key: "pnr", label: "PNR", value: "QTR8VB" },
      { key: "tkt", label: "Ticket", value: "214-4844220099" },
      { key: "fl", label: "Flight", value: "PK 231 V 24OCT ISBDXB HK1" },
      { key: "ret", label: "Return", value: "PK 232 14DEC DXBISB HK1", highlight: "bad" },
      { key: "seat", label: "Seat", value: "17C" },
    ],
  },
  steps: [
    {
      type: "dialogue",
      id: "m14-d1",
      prompt: "Open the interaction with care and precision.",
      passengerLines: [
        "Farzana lowers herself onto the counter chair, one hand on her back: 'Salam. My husband booked this flight — he is in Dubai, he counted the weeks himself, he says it is all fine. I have my doctor's paper here somewhere…'",
      ],
      options: [
        {
          id: "m14-d1-a",
          text: "Salam, and welcome — let us make this calm and correct together. The 'paper' matters, so we will look at it properly: date issued, the doctor's licence, and the week count. And since you have the folder with you, keep it out — everything we verify today travels with you, not in a suitcase.",
          points: 8,
          feedback:
            "Right opening: respectful, verification-first mindset, and the practical tip — medical documents stay in hand luggage, never checked.",
          consequence:
            "She produces the folder: Dr. Asma's certificate, ultrasound reports, and a laminated ultrasound photo she cannot resist showing: 'A girl, InshaAllah.'",
          best: true,
        },
        {
          id: "m14-d1-b",
          text: "You are clearly very pregnant, madam — I am afraid we cannot let you fly at all.",
          points: 4,
          feedback:
            "Refusal without verification: at 34 weeks with a valid recent certificate she IS acceptable. The ladder decides, not the eye.",
          best: false,
        },
        {
          id: "m14-d1-c",
          text: "Looks fine to me, here is your pass — enjoy Dubai!",
          points: 0,
          feedback:
            "No verification, no SSR, no indemnity, no exit-row check, no return-leg review. Five failures in five seconds.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m14-d2",
      prompt: "Verify the certificate and explain the indemnity form.",
      passengerLines: [
        "Husband on the phone, speaker on: 'Bhai sahib, she is FINE, the doctor wrote it, why all these forms? Just check her in.'",
      ],
      options: [
        {
          id: "m14-d2-a",
          text: "Your certificate is exactly what we need, and it passes on three counts: issued 20 OCT — four days ago, well within the 7-day window; from Shifa International, a licensed facility; and no contra-indications noted. The indemnity form is not mistrust, madam — it is the airline confirming in writing that you have been told: this flight is routine care, not a hospital, and your pregnancy care remains with your doctor. Both of you sign knowing exactly what flying at 34 weeks means. That is protection FOR you.",
          points: 16,
          feedback:
            "Textbook verification (recency, facility, content) plus the indemnity reframed correctly: informed consent protecting the passenger, not a liability dodge.",
          consequence:
            "Husband on speaker, softer: '…that is fair. Sign it, Farzana. Doctor Asma's stamp is there, that is what matters.'",
          best: true,
        },
        {
          id: "m14-d2-b",
          text: "Skip the indemnity form — she has a certificate, that is enough paperwork for today.",
          points: 4,
          feedback:
            "At 28–36 weeks the certificate AND the signed indemnity are both mandatory. Missing indemnity = an undocumented MEDA acceptance.",
          best: false,
        },
        {
          id: "m14-d2-c",
          text: "Tell the husband: 'Since you counted the weeks yourself, sir, you can also sign the form from Dubai by WhatsApp.'",
          points: 0,
          feedback:
            "Indemnity is signed by the PASSENGER in person — a WhatsApp authorisation is worth nothing legally and weakens the whole record.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "m14-t1",
      prompt:
        "Enter the MEDA case in Altéa DCS and issue her boarding pass. Type commands at the > prompt.",
      intro: "Certificate verified, indemnity signed. Note: seat 17C is NOT an exit row — verify and proceed.",
      commands: [
        {
          pattern: "^PD/ISBDXB/24OCT$",
          display: "PD/ISBDXB/24OCT",
          hint: "Passenger Display — pull up flight PK 231 ISB→DXB for 24 OCT.",
          output: [
            "FLIGHT: PK 231  ISB-DXB  EQP 320  STATUS: OPEN",
            "STD 2145  GATE 12  CUTOFF 2110  ROWS 4-8",
            "PAX F/C/Y: 010/024/172   BAGS 118/1902.0K",
          ],
          errorHint: "Format: PD/<origin><destination>/<DDMMM> — e.g. PD/ISBDXB/24OCT",
          points: 8,
        },
        {
          pattern: "^RT/LEGHARI$",
          display: "RT/LEGHARI",
          hint: "Retrieve the passenger record by family name.",
          output: [
            "NAME: LEGHARI/FARZANA MRS   RECLOC QTR8VB",
            "ITN: 1 PK 231 V 24OCT ISBDXB HK1  SEAT 17C",
            "ITN: 2 PK 232 14DEC DXBISB HK1",
            "TKT 214-4844220099  CLASS Y",
          ],
          errorHint: "Retrieve by name: RT/LEGHARI",
          points: 8,
        },
        {
          pattern: "^SRMEDA-P1/.*",
          display: "SR MEDA-P1/34WKS PREGNANCY/CERT 20OCT",
          hint: "Add the medical SSR for passenger 1 — weeks and certificate date.",
          output: [
            "OK SSR MEDA ADDED",
            "PREGNANCY 34WKS SINGLE UNCOMPLICATED  PAX1  PK231",
            "CERT DR ASMA SHIFA INTL 20OCT  INDEMNITY ON FILE",
          ],
          errorHint: "Start with SR MEDA-P1/ and state weeks + cert, e.g. SR MEDA-P1/34WKS PREGNANCY/CERT 20OCT",
          points: 8,
        },
        {
          pattern: "^PADD-MEDICAL.*",
          display: "PADD-MEDICAL CERT 20OCT SHIFA INTL/INDEMNITY SIGNED/EXIT ROW BLOCKED",
          hint: "Log the medical audit remark — certificate, indemnity, seating.",
          output: ["OK REMARK ADDED TO PNR QTR8VB"],
          errorHint:
            "Start with PADD-MEDICAL and cover cert + indemnity + seating, e.g. PADD-MEDICAL CERT 20OCT SHIFA INTL/INDEMNITY SIGNED/EXIT ROW BLOCKED",
          points: 8,
        },
        {
          pattern: "^BIP/P1$",
          display: "BIP/P1",
          hint: "Boarding pass issue — print her pass after the MEDA record is complete.",
          output: [
            "BIP OK  PAX1  LEGHARI/FARZANA MRS",
            "PK 231  ISB-DXB  SEAT 17C  24OCT",
            "SEAT 17C: AISLE, NON-EXIT  ***MEDA FLAGGED***",
          ],
          errorHint: "Format: BIP/P1 — issue only AFTER the MEDA record is complete",
          points: 8,
        },
      ],
    },
    {
      type: "decision",
      id: "m14-d3",
      prompt: "The return-leg trap — 14 DEC means 38 weeks.",
      situation:
        "Her return PK 232 on 14 DEC puts her beyond the 36-week limit: the airline would refuse her in Dubai. Husband on speaker: 'We will deal with it in December.'",
      options: [
        {
          id: "m14-d3-a",
          text: "We deal with it NOW, madam — that is the kindness. On 14 DEC you will be 38 weeks: Dubai check-in would refuse the boarding, and you would be stuck renegotiating from a hotel room with a newborn's due date. Let me rebook your return to 30 NOV (32 weeks — inside the window) right now at no change-fee, and flag the PNR so any agent in Dubai sees a compliant, planned trip. December-you will thank October-us.",
          points: 16,
          feedback:
            "Senior move: the trap is caught at the origin counter where fixing it is free and kind, not in Dubai where it is costly and frightening. Re-protect inside the rules and document it.",
          consequence:
            "Husband, quiet for a moment: '…rebook it. 30 November.' Farzana laughs: 'He counts weeks for everything except the way home.'",
          best: true,
        },
        {
          id: "m14-d3-b",
          text: "Flag the return leg in the PNR and let the Dubai staff handle it in December.",
          points: 6,
          feedback:
            "Better than silence, but you just scheduled a crisis for a colleague 8 weeks from now — and her for a stranded month. Fix what you can see, now.",
          best: false,
        },
        {
          id: "m14-d3-c",
          text: "Say nothing — the return is not today's problem, and the queue is long.",
          points: 0,
          feedback:
            "The record is in front of you (RT/LEGHARI shows 14DEC). Ignoring a visible compliance failure in the same booking is negligence, not efficiency.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m14-d4",
      prompt: "Seat her like a professional.",
      passengerLines: [
        "Farzana eyes the seat map on your screen: 'Beta, my husband says take the emergency exit row — extra legroom for the baby, he already called the office.'",
      ],
      options: [
        {
          id: "m14-d4-a",
          text: "Your husband is thinking comfort, and I love that — but exit rows are the one place we cannot seat you: in an evacuation, row-openers must lift heavy door hatches and assist the crew, and that is exactly what your doctor has excused you from. Your best seat is this aisle one near the lavatory, with extra legroom AT the bulkhead instead — same comfort, right side of the rules. I will block 17C and note 'no exit row' so no agent moves you later.",
          points: 8,
          feedback:
            "Perfect: corrects the husband's well-meant idea with the SAFETY reason (evacuation duty), offers the equivalent comfort (bulkhead), and locks it in the PNR.",
          consequence:
            "Husband, on speaker: 'Bulkhead it is. What does a father know.' Laughter at the counter — tension gone.",
          best: true,
        },
        {
          id: "m14-d4-b",
          text: "Exit row is fine — the crew will make an exception for the legroom.",
          points: 0,
          feedback:
            "Exit-row seating for a pregnant passenger is a hard safety prohibition worldwide. 'Exception' is the word that ends careers after incidents.",
          best: false,
        },
        {
          id: "m14-d4-c",
          text: "Give her any seat and move on — seat choice is her own risk at 34 weeks.",
          points: 4,
          feedback:
            "Seat selection IS part of the MEDA duty of care: aisle near lavatory, no exit row, blocked from reassignment. 'Her risk' is not a thing here.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "m14-d5",
      prompt: "Board her with the care the record promises.",
      situation:
        "Gate 12, 21:30. Farzana arrives with a small pillow and the medical folder. Closing in 15 minutes.",
      options: [
        {
          id: "m14-d5-a",
          text: "Quiet pre-boarding with the family lane: walk her on before the general call, hand the purser a one-line spoken brief ('17C, 34 weeks, aisle, feel free to move her if she swells'), confirm the aisle chair is on standby at Dubai for the arrival walk, and send her off with the only instruction that matters tonight: press the call button early and often — the crew would rather ten false alarms than one quiet problem.",
          points: 12,
          feedback:
            "Complete close: quiet pre-boarding, named crew brief, arrival assistance staged, and the empowerment instruction (call button) that turns the cabin crew into her team.",
          consequence:
            "She waddles down the jet bridge first, pillow under one arm, folder on her heart. PK 231 departs 21:45 — one mother, one compliant record, zero surprises.",
          best: true,
        },
        {
          id: "m14-d5-b",
          text: "Board her with the general call and let the crew discover the MEDA flag themselves.",
          points: 6,
          feedback:
            "The flag is in the system, but discover-by-accident is not a handover. Brief the purser by name; the record supports the spoken word.",
          best: false,
        },
        {
          id: "m14-d5-c",
          text: "Suggest she 'hold it in' during the 3-hour flight to avoid the lavatory queue.",
          points: 0,
          feedback:
            "Medically irresponsible advice for late pregnancy. Aisle seat near the lavatory exists precisely so she never has to 'hold it'.",
          best: false,
        },
      ],
    },
  ],
  debriefRules: [
    {
      source: "IATA / Carrier Policy — Pregnancy Travel",
      ref: "≤28 weeks free · 28–36 weeks cert + indemnity · >36 weeks refused",
      detail:
        "Single uncomplicated pregnancy: fit-to-fly certificate from a licensed facility issued within 7 days + signed indemnity for 28–36 weeks. Multiple or complicated pregnancies follow MEDA from week 28 (or earlier per doctor).",
    },
    {
      source: "IATA — Exit Row Seating",
      ref: "Exit rows: no PRM, no MEDA, no pregnant passengers, no minors",
      detail:
        "Exit-row occupants must be able to open heavy hatches and assist evacuation — a hard, worldwide prohibition, never overruled for legroom.",
    },
    {
      source: "SAPS SOP — Return-Leg Guard",
      ref: "Check BOTH legs of the booking at acceptance",
      detail:
        "A compliant outbound with a >36-week return is a scheduled crisis. Re-protect at origin where changes are free and kind — document with SR MEDA + PADD.",
    },
  ],
  checklist: [
    "Certificate check: recency (≤7 days), licensed facility, no contra-indications",
    "Apply the ladder: ≤28 free / 28–36 cert+indemnity / >36 refused",
    "Indemnity signed by the PASSENGER in person — no WhatsApp authorisations",
    "PD/ISBDXB/24OCT then RT/LEGHARI — READ BOTH LEGS",
    "SR MEDA-P1/… — weeks + certificate in the SSR",
    "PADD-MEDICAL … — cert, indemnity, seating note in the audit trail",
    "Seat: aisle near lavatory, bulkhead comfort, EXIT ROW HARD-BLOCKED",
    "Flag/rebook any return leg beyond 36 weeks NOW, at origin",
    "Quiet pre-boarding + spoken purser brief + arrival assistance staged",
    "Medical file stays in HAND luggage, never checked",
  ],
  badgeId: "care-champion",
};

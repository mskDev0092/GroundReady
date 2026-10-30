import type { Scenario } from "@/lib/types";

/**
 * MODULE 9 — Name Discrepancy, PNR Integrity & Agent Pressure
 * "HUSSEN" on the ticket, "HUSSAIN" on the passport — and a cousin with a bigger plan.
 */
export const scenarioNameFix: Scenario = {
  id: "m9-namefix",
  moduleNo: 9,
  code: "M9-NMCHG",
  title: "Wrong Name, Right Flight",
  category: "documentation",
  tags: ["Name Correction", "PNR", "E-ticket", "Fraud Watch", "Altéa NM"],
  difficulty: 3,
  xpBase: 150,
  minutes: 13,
  summary:
    "A Dubai-bound worker's ticket is misspelled by two letters — then his 'agent' tries to slide a completely different traveller onto the same booking.",
  briefing:
    "You are the SAPS Traffic Assistant at Row 6, Lahore (LHE), flight PK 213 LHE–DXB, 24 OCT. Syed Afaq presents a passport reading 'SYED AFAQ HUSSAIN' but the PNR says 'HUSSEN' — a 2-letter misspelling from the booking office. The correction is legal and minor. Minutes later his cousin (who booked it) phones and then appears at the counter trying to 'update' the ticket to a different person entirely. Draw the bright red line between name CORRECTION and name CHANGE — and protect the PNR.",
  objectives: [
    "Detect the mismatch: passport ↔ PNR ↔ e-ticket, in that order",
    "Apply the minor-correction rule (≤3 characters / same person) via Altéa NM",
    "REFUSE person-substitution — a name change to a different traveller is fraud, not a favour",
    "Leave a clean audit trail: PADD remark + fresh boarding pass (BIP)",
  ],
  passenger: {
    name: "Syed Afaq Hussain",
    age: 29,
    nationality: "Pakistan",
    passportNo: "GH-7733119",
    passportExpiry: "18 JUL 2030",
    pnr: "TBX7QM",
    ticketNo: "214-4199887723",
    flight: "PK 213",
    route: "LHE → DXB",
    date: "24 OCT",
    seat: "28B",
    fareClass: "Y — Economy Deal",
    allowance: "1PC / 30KG (Gulf fare)",
    originStation: "LHE — SAPS Row 6",
    avatarTone: "emerald",
    visa: "UAE Employment — 2 years, valid",
  },
  baggage: [
    { id: "b1", label: "Duffel bag — work clothes, tools", weightKg: 26.4, type: "checked" },
    { id: "b2", label: "Trolley (cabin)", weightKg: 6.9, type: "cabin" },
  ],
  documents: {
    passport: [
      { key: "name", label: "Name", value: "SYED AFAQ HUSSAIN" },
      { key: "nat", label: "Nationality", value: "PAKISTAN" },
      { key: "dob", label: "DOB", value: "03 DEC 1996" },
      { key: "exp", label: "Expiry", value: "18 JUL 2030", highlight: "ok" },
    ],
    visa: [
      { key: "type", label: "Visa", value: "UAE EMPLOYMENT RESIDENCE" },
      { key: "status", label: "Status", value: "VALID — SPONSOR: AL BURAQ GMG", highlight: "ok" },
    ],
    ticket: [
      { key: "pnr", label: "PNR", value: "TBX7QM" },
      { key: "tkt", label: "Ticket", value: "214-4199887723" },
      { key: "name", label: "Name on ticket", value: "SYED AFAQ HUSSEN", highlight: "warn" },
      { key: "fl", label: "Flight", value: "PK 213 K 24OCT LHEDXB HK1" },
      { key: "seat", label: "Seat", value: "28B" },
    ],
  },
  steps: [
    {
      type: "dialogue",
      id: "m9-d1",
      prompt: "Open the interaction and run the identity triple-check.",
      passengerLines: [
        "Salam, sir. Dubai flight — the company office in Dubai booked my ticket. Everything is paid, I have the receipt on my phone.",
      ],
      options: [
        {
          id: "m9-d1-a",
          text: "Salam, welcome. Congratulations on the job — let me do the three-way match first: passport, PNR and e-ticket side by side. Paid is good, but air tickets fly on NAMES matching documents, so we check that before any bag is tagged.",
          points: 8,
          feedback:
            "Correct discipline: the passport ↔ PNR ↔ ticket match is the FIRST gate of every check-in, before weights, seats or pleasantries end.",
          consequence:
            "Passport: HUSSAIN. PNR: HUSSEN. You stop. His smile drops: 'Hus… what? That is the office's mistake, not mine!'",
          best: true,
        },
        {
          id: "m9-d1-b",
          text: "Payment confirmed, that is all I need — hand me your bags, sir.",
          points: 0,
          feedback:
            "Skipping the identity check: he would fail at DXB immigration under a mismatched name, and the discovery would happen 3 hours later than it should.",
          best: false,
        },
        {
          id: "m9-d1-c",
          text: "The spelling is close enough — one letter here or there, no one checks that.",
          points: 2,
          feedback:
            "Exactly wrong: names are compared character by character by immigration systems. 'Close enough' does not exist in document control.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m9-d2",
      prompt: "The cousin calls — then arrives. Handle the substitution attempt.",
      passengerLines: [
        "Cousin on phone: 'Afaq, tell them to fix the spelling.' Then, five minutes later, at the counter: 'O bhai, since the office is fixing it anyway — change the NAME to Faisal Nawaz. Afaq's police verification is pending, Faisal will travel instead. Same ticket, just the name, no?\"",
      ],
      options: [
        {
          id: "m9-d2-a",
          text: "Two different things, and only one of them is possible. 'HUSSEN' to 'HUSSAIN' is a minor correction — same person, two letters, I can do that in the system with an audit note. A DIFFERENT person on the ticket — Faisal Nawaz — is a name change, and that is not an edit, it is a fraud attempt: ticket, passport, visa and fingerprint must belong to one traveller. Faisal needs his own ticket, his own visa, his own everything. What I will do now is correct YOUR spelling and get YOU flying.",
          points: 16,
          feedback:
            "Textbook: names the distinction (correction vs change), states why substitution is fraud, and redirects to the legitimate fix. No anger, absolute clarity.",
          consequence:
            "Cousin retreats: 'Chalo chalo, do the spelling at least.' Afaq exhales: 'Thank you sir, the job starts Monday.'",
          best: true,
        },
        {
          id: "m9-d2-b",
          text: "Raise your voice at the counter: 'This visa looks FAKE and you are a fraud, get away from my desk!'",
          points: 4,
          feedback:
            "Even when you are right, a public fraud accusation endangers everyone — the party may bolt, the hall erupts, and the quiet verification you need is gone. Escalate QUIETLY, always.",
          best: false,
        },
        {
          id: "m9-d2-c",
          text: "Do the 'correction' to FAISAL NAWAZ — the cousin says he will handle everything with the office later.",
          points: 0,
          feedback:
            "You just printed a boarding pass for a different human being than the passport-holder of record. This is document fraud, your ID is on the entry, and the passenger would be arrested at DXB.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "m9-t1",
      prompt:
        "Apply the minor name correction in Altéa DCS and reissue the boarding pass. Type commands at the > prompt.",
      intro:
        "Minor correction approved: HUSSEN → HUSSAIN (2 letters, same person, passport match). Execute the change chain.",
      commands: [
        {
          pattern: "^PD/LHEDXB/24OCT$",
          display: "PD/LHEDXB/24OCT",
          hint: "Passenger Display — pull up flight PK 213 LHE→DXB for 24 OCT.",
          output: [
            "FLIGHT: PK 213  LHE-DXB  EQP 320  STATUS: OPEN",
            "STD 2010  GATE B11  CUTOFF 1935  ROWS 5-8",
            "PAX F/C/Y: 008/022/164   BAGS 141/1997.0K",
          ],
          errorHint: "Format: PD/<origin><destination>/<DDMMM> — e.g. PD/LHEDXB/24OCT",
          points: 8,
        },
        {
          pattern: "^RT/SHAH$",
          display: "RT/SHAH",
          hint: "Retrieve the passenger record by family name.",
          output: [
            "NAME: HUSSEN/SYED AFAQ MR   RECLOC TBX7QM",
            "ITN: 1 PK 213 K 24OCT LHEDXB HK1  SEAT 28B",
            "TKT 214-4199887723  COUPON 1: O (OPEN)",
          ],
          errorHint: "Retrieve by family name on the PNR: RT/SHAH",
          points: 8,
        },
        {
          pattern: "^NM/1HUSSAIN/SYEDAFAQMR$",
          display: "NM/1HUSSAIN/SYED AFAQ MR",
          hint: "Correct the name element to match the passport — HUSSEN becomes HUSSAIN.",
          output: [
            "OK NAME UPDATED",
            "HUSSEN/SYED AFAQ MR → HUSSAIN/SYED AFAQ MR",
            "MINOR CORRECTION 2 CHARS  PASSPORT GH-7733119 MATCH",
          ],
          errorHint:
            "Format: NM/1<SURNAME>/<GIVEN> MR — e.g. NM/1HUSSAIN/SYED AFAQ MR",
          points: 8,
        },
        {
          pattern: "^PADD-NAME.*",
          display: "PADD-NAME CORRECTION P1 HUSSEN TO HUSSAIN/PASSPORT MATCHED",
          hint: "Log the audit remark for the correction — who, what, why.",
          output: ["OK REMARK ADDED TO PNR TBX7QM"],
          errorHint:
            "Start with PADD-NAME and describe the correction, e.g. PADD-NAME CORRECTION P1 HUSSEN TO HUSSAIN/PASSPORT MATCHED",
          points: 8,
        },
        {
          pattern: "^BIP/P1$",
          display: "BIP/P1",
          hint: "Boarding pass issue — print the corrected boarding pass for passenger 1.",
          output: [
            "BIP OK  PAX1  HUSSAIN/SYED AFAQ MR",
            "PK 213  LHE-DXB  SEAT 28B  24OCT",
            "BP PRINTED  NAME == PASSPORT  ***VERIFIED***",
          ],
          errorHint: "Format: BIP/P1 — issue the boarding pass AFTER the name is corrected",
          points: 8,
        },
      ],
    },
    {
      type: "decision",
      id: "m9-id1",
      prompt: "One gate before the reissue: the face behind the name.",
      situation:
        "The name is corrected, the remark is logged. But the passport photo and the man at the counter — that check has not happened yet, and the 'agent' is watching you work.",
      options: [
        {
          id: "m9-id1-a",
          text: "Look up from the passport and TALK to the traveller, not the paperwork: confirm his date of birth, his employer in Dubai and his travel history conversationally — then compare the photo line by line (jaw, ears, brow) against the man in front of you. Only when face, name and ticket agree do you print anything.",
          points: 16,
          feedback:
            "Correct: identity is verified person-to-person, not paper-to-paper. A corrected name on the wrong face is still a fraud — the photo check is the last lock on the door.",
          consequence:
            "He answers easily: 'DOB third December… Al Buraq glass and aluminium, five years in Muscat before this.' Photo matches. The lock clicks shut.",
          best: true,
        },
        {
          id: "m9-id1-b",
          text: "Skip the face check — the passport is biometric and matches the corrected ticket; the system handles identity.",
          points: 8,
          feedback:
            "Half-right, half-hazard: systems match records, but they cannot see substitution. A 30-second conversational check is the human layer the system cannot do.",
          best: false,
        },
        {
          id: "m9-id1-c",
          text: "Let the cousin vouch: 'He is my cousin, I guarantee it is him' — that is enough verification.",
          points: 0,
          feedback:
            "The cousin is the pressure source in this scenario. Vouching from an interested third party is worth exactly zero verification.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m9-d3",
      prompt: "Reassure the passenger about the fix.",
      passengerLines: [
        "Sir, the spelling is fixed now — but will Dubai immigration make trouble? The office gave me this ticket and I cannot miss this job.",
      ],
      options: [
        {
          id: "m9-d3-a",
          text: "You are clean: the ticket now reads exactly like your passport, character for character. I also left a remark inside the booking that the correction was made and verified — if any counter in Dubai pulls up your record, the history shows it was an office spelling error fixed at origin. Keep your job-offer letter in your hand luggage; first-time employment travellers are sometimes asked for it.",
          points: 8,
          feedback:
            "Excellent: confirms character-level match, points to the PNR audit trail as his protection, and adds the practical arrival tip for first-time employment passengers.",
          consequence:
            "He photographs the boarding pass as if it were a degree certificate. 'Character for character — okay, I remember.'",
          best: true,
        },
        {
          id: "m9-d3-b",
          text: "Do not worry about immigration — nobody reads names that carefully there.",
          points: 4,
          feedback:
            "Dangerous comfort: immigration reads names VERY carefully. Reassure with facts (the match, the audit trail), not with dismissals.",
          best: false,
        },
        {
          id: "m9-d3-c",
          text: "If Dubai stops you, tell them the travel office made the mistake — it is not your problem.",
          points: 0,
          feedback:
            "You are abandoning the passenger at the border. The correction + audit trail IS the protection — present it as such.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "m9-d4",
      prompt: "The cousin returns, angry. Choose the professional close.",
      situation:
        "The 'agent' from NTS Travels storms back: 'You changed MY booking without my permission! Where is my commission? Fix Faisal's name or I will call your manager right now!'",
      options: [
        {
          id: "m9-d4-a",
          text: "Stay flat and factual: 'The booking belongs to the ticketed passenger, not to any third party. The correction restored HIS passport spelling — that is documented policy. A different traveller requires a new ticket under his own name and visa; that is not available at this counter at any volume of shouting. My manager is welcome — the file already speaks for itself. Now, do you want to help Afaq to the gate, or should he go alone?'",
          points: 12,
          feedback:
            "Correct: zero drama, cites ownership of the booking, offers nothing improper, invites the supervisor review openly, and re-anchors on passenger care.",
          consequence:
            "The agent deflates without an audience. Afaq shoulders his duffel and walks to immigration — employed, legal, on time.",
          best: true,
        },
        {
          id: "m9-d4-b",
          text: "Apologise and quietly undo the correction to keep the agent calm.",
          points: 0,
          feedback:
            "Re-breaking the name match to appease pressure re-creates the fraud risk and falsifies the record. Never undo a correct compliance action under pressure.",
          best: false,
        },
        {
          id: "m9-d4-c",
          text: "Warn him quietly: 'Tip me and I will think about the Faisal change.'",
          points: 0,
          feedback:
            "Soliciting a bribe to enable fraud — dismissal, blacklisting and criminal exposure. The absolute red line of this profession.",
          best: false,
        },
      ],
    },
  ],
  debriefRules: [
    {
      source: "IATA / Altéa DCS — Name Handling",
      ref: "Minor correction (≤3 chars / same person) vs name change (different person)",
      detail:
        "Corrections restore the passport spelling of the SAME traveller (NM element edit + audit remark). Placing a DIFFERENT person on an existing ticket is substitution fraud — it requires a new ticket, new visa, new consent.",
    },
    {
      source: "SAPS SOP — PNR Integrity",
      ref: "Every name edit leaves PADD evidence; BP reissued only after match",
      detail:
        "The PNR is a legal record. BIP/P1 only after the corrected name matches the passport character-for-character.",
    },
    {
      source: "SAPS Integrity Code",
      ref: "Third-party pressure: bookings belong to ticketed passengers",
      detail:
        "Agents/cousins have no authority over a traveller's record. Escalate pressure to the supervisor calmly — never transact, never threaten, never accuse publicly.",
    },
  ],
  checklist: [
    "Triple-check FIRST: passport ↔ PNR ↔ e-ticket names",
    "Classify the fix: minor correction (same person) vs name change (different person)",
    "Refuse substitution clearly — explain ticket/visa/fingerprints are per-person",
    "PD/LHEDXB/24OCT then RT/<family name on PNR>",
    "NM/1<SURNAME>/<GIVEN> MR — apply the correction",
    "PADD-NAME … — audit remark: what changed, why, evidence",
    "BIP/P1 — reissue boarding pass only after the match",
    "Reassure with FACTS: character-level match + PNR audit trail",
    "Handle agent pressure flat and factual; invite supervisor review",
    "Never undo a correct compliance action under social pressure",
  ],
  badgeId: "pnr-sherlock",
};

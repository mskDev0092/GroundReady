import type { Scenario } from "@/lib/types";

/**
 * MODULE 16 — Document Fraud & Quiet Escalation (The Quiet Red Flag)
 * Tampered UAE visa, a hovering "agent", and the discipline of NOT accusing publicly.
 */
export const scenarioDocFraud: Scenario = {
  id: "m16-docfraud",
  moduleNo: 16,
  code: "M16-DOCF",
  title: "The Quiet Red Flag",
  category: "security",
  tags: ["Document Fraud", "ASF", "Quiet Escalation", "MRZ", "Trafficking Watch"],
  difficulty: 5,
  xpBase: 190,
  minutes: 15,
  summary:
    "A Sharjah-bound worker's visa looks almost right — font, lamination and MRZ all whisper. The test is whether YOU escalate quietly or detonate the hall.",
  briefing:
    "You are the SAPS Traffic Assistant at Row 9, Lahore (LHE), flight G9 512 LHE–SHJ, 24 OCT. Jashim Uddin Alam, 26, a Bangladeshi labourer, presents a passport with a UAE e-visa page. On close inspection: the sponsor name is in a slightly different typeface, a lamination bubble sits over the validity date, and the MRZ spells the name one way while the visual zone spells it another. A self-styled 'agent' hovers two steps behind, phone in hand. This scenario is a discipline test: verify precisely, escalate QUIETLY, protect everyone — including a passenger who may himself be a victim.",
  objectives: [
    "Detect document fraud markers: typeface mismatch, lamination anomalies, MRZ ↔ visual zone divergence",
    "Run TIMATIC (TI DOC) before drawing conclusions — verify, then act",
    "Escalate QUIETLY: calm hold, supervisor code word, ASF handover — never a public accusation",
    "Handle the likely VICTIM with dignity: no BP issued, full PADD audit, zero public drama",
  ],
  passenger: {
    name: "Jashim Uddin Alam",
    age: 26,
    nationality: "Bangladesh",
    passportNo: "BX0912374",
    passportExpiry: "11 FEB 2029",
    pnr: "GDH6YU",
    ticketNo: "079-4400991122",
    flight: "G9 512",
    route: "LHE → SHJ",
    date: "24 OCT",
    seat: "— (acceptance held)",
    fareClass: "Y — Economy Basic",
    allowance: "1PC / 30KG",
    originStation: "LHE — SAPS Row 9",
    avatarTone: "orange",
    visa: "UAE eVisa — SUSPICIOUS (3 fraud markers)",
  },
  baggage: [
    { id: "b1", label: "Duffel bag — not yet accepted", weightKg: 24.5, type: "checked", note: "HOLD — no acceptance until documents clear" },
    { id: "b2", label: "Small backpack (cabin)", weightKg: 4.1, type: "cabin" },
  ],
  documents: {
    passport: [
      { key: "name", label: "Name", value: "ALAM, JASHIM UDDIN" },
      { key: "nat", label: "Nationality", value: "BANGLADESH" },
      { key: "dob", label: "DOB", value: "09 SEP 2000" },
      { key: "exp", label: "Expiry", value: "11 FEB 2029", highlight: "ok" },
      { key: "iss", label: "Issue", value: "Dhaka — standard laminate, consistent", highlight: "ok" },
    ],
    visa: [
      { key: "type", label: "Visa", value: "UAE eVisa — EMPLOYMENT", highlight: "bad" },
      { key: "m1", label: "Marker 1", value: "Sponsor name typeface ≠ rest of document", highlight: "bad" },
      { key: "m2", label: "Marker 2", value: "Lamination bubble over validity date", highlight: "bad" },
      { key: "m3", label: "Marker 3", value: "MRZ name spelling ≠ visual zone spelling", highlight: "bad" },
    ],
    ticket: [
      { key: "pnr", label: "PNR", value: "GDH6YU" },
      { key: "tkt", label: "Ticket", value: "079-4400991122" },
      { key: "fl", label: "Flight", value: "G9 512 V 24OCT LHESHJ HK1" },
      { key: "booked", label: "Booked by", value: "Third party — 'Raja Travels', cash", highlight: "warn" },
    ],
  },
  steps: [
    {
      type: "dialogue",
      id: "m16-d1",
      prompt: "Open the interaction — run the standard document flow.",
      passengerLines: [
        "Jashim slides his passport across with both hands, eyes flicking to the man behind him. 'Sir, Sharjah flight. Company send paper, all ready.' The 'agent' smiles: 'My passenger, my paper — quick-quick, boss.'",
      ],
      options: [
        {
          id: "m16-d1-a",
          text: "Welcome, sir — you are at the right counter, and we will check everything properly; first-time workers are exactly who this procedure is built for. (To the agent, neutrally:) Thank you, sir — I will work directly with the passenger; please take a seat in the waiting area. One at a time at the counter keeps his file clean.",
          points: 8,
          feedback:
            "Correct first move: warm to the passenger, neutral but firm boundary on the third party — you split the passenger from the pressure BEFORE any document examination begins.",
          consequence:
            "The agent's smile freezes; he drifts to the waiting chairs but keeps his phone camera angled toward your desk. Jashim exhales slightly.",
          best: true,
        },
        {
          id: "m16-d1-b",
          text: "Accept the agent into the process — 'Your agent can explain everything for you, faster that way.'",
          points: 4,
          feedback:
            "You just handed the pressure source a role in YOUR verification. Third parties narrate; the passenger answers for himself.",
          best: false,
        },
        {
          id: "m16-d1-c",
          text: "Snap the passport open, glance three seconds, and slide it back: 'Visa looks fine, next.'",
          points: 0,
          feedback:
            "A three-second glance is how forged visas fly. Employment-tribal routes (LHE→UAE third-party cash bookings) are exactly where document fraud concentrates.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m16-d2",
      prompt: "You see the three markers. Choose the professional response.",
      passengerLines: [
        "Typeface mismatch on the sponsor line. A lamination bubble hiding the validity date's last digit. MRZ reads 'JASHIMUDINALAM'; the visual zone reads 'JASHIM UDDIN ALAMGIR'. Your stomach drops. Jashim asks: 'Sir, any problem?'",
      ],
      options: [
        {
          id: "m16-d2-a",
          text: "No problem at all, sir — the system is slow today; these Gulf flights need extra verification sometimes. One moment, I am confirming your visa status. (You keep the passport under the document tray, turn slightly from the counter line, and press the supervisor's quiet-alert code: 'Row 9, Charlie code, documents.')",
          points: 16,
          feedback:
            "Textbook quiet escalation: the passenger hears a routine delay, the passport stays calmly in view under the tray, and the code word summons your supervisor and ASF without one alarm bell in the hall.",
          consequence:
            "Two minutes later the supervisor leans in casually: 'Row 9 — documents, understood.' The hall does not notice a thing.",
          best: true,
        },
        {
          id: "m16-d2-b",
          text: "Stand up and announce to the hall: 'THIS VISA IS FAKE! Somebody call ASF — this is FRAUD at my counter!'",
          points: 4,
          feedback:
            "Even with correct instincts, the public announcement is the failure: the party may bolt, the agent may destroy his phone, the hall panics, and any chance of a calm investigation dies. Quiet ALWAYS.",
          best: false,
        },
        {
          id: "m16-d2-c",
          text: "Hand the passport back and whisper to Jashim: 'Get a better visa from the agent outside, then come back.'",
          points: 0,
          feedback:
            "You just coached a suspect to 'improve' a suspected forgery and walk back to you. Document fraud is never resolved at the counter with advice — it is escalated.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "m16-t1",
      prompt:
        "Run the verification and hold chain in Altéa DCS — no boarding pass, full audit. Type commands at the > prompt.",
      intro: "Supervisor and ASF are en route, quietly. Meanwhile: verify the record, run TIMATIC, hold acceptance, log everything.",
      commands: [
        {
          pattern: "^PD/LHESHJ/24OCT$",
          display: "PD/LHESHJ/24OCT",
          hint: "Passenger Display — pull up flight G9 512 LHE→SHJ for 24 OCT.",
          output: [
            "FLIGHT: G9 512  LHE-SHJ  EQP 320  STATUS: OPEN",
            "STD 1215  GATE B08  CUTOFF 1140  ROWS 5-8",
            "PAX F/C/Y: 004/012/156   BAGS 118/2411.0K",
          ],
          errorHint: "Format: PD/<origin><destination>/<DDMMM> — e.g. PD/LHESHJ/24OCT",
          points: 8,
        },
        {
          pattern: "^RT/ALAM$",
          display: "RT/ALAM",
          hint: "Retrieve the passenger record by family name.",
          output: [
            "NAME: ALAM/JASHIM UDDIN MR   RECLOC GDH6YU",
            "ITN: 1 G9 512 V 24OCT LHESHJ HK1",
            "TKT 079-4400991122  CASH — 3RD PARTY 'RAJA TRAVELS'",
          ],
          errorHint: "Retrieve by name: RT/ALAM",
          points: 8,
        },
        {
          pattern: "^TIDOC/AE$",
          display: "TI DOC/AE",
          hint: "TIMATIC document check — Bangladeshi passport travelling to the UAE.",
          output: [
            "TIMATIC  BGD/AE  EMPLOYMENT",
            "VISA: REQUIRED — EMPLOYMENT ENTRY PERMIT",
            "SPONSOR: MUST MATCH TICKET + LABOUR QUOTA",
            "MRZ/VISUAL MISMATCH: ***VALIDATION FAILED***",
            "REFER TO CARRIER DOC CHECK DESK",
          ],
          errorHint: "Format: TI DOC/<country code> — TI DOC/AE for the UAE",
          points: 8,
        },
        {
          pattern: "^XX/P1$",
          display: "XX/P1",
          hint: "Hold acceptance — cancel/withhold passenger 1 until documents clear.",
          output: [
            "OK P1 ACCEPTANCE HELD",
            "NO BAGS ACCEPTED  NO BP ISSUED",
            "STATUS: DOC VERIFICATION PENDING (ASF)",
          ],
          errorHint: "Format: XX/P1 — hold the acceptance while verification runs",
          points: 8,
        },
        {
          pattern: "^PADD-DOCFRAUD.*",
          display: "PADD-DOC FRAUD SUSPECTED VISA P1/3 MARKERS/ASF 1045Z/NO BP ISSUED",
          hint: "Log the full audit: markers found, escalation time, no BP.",
          output: ["OK REMARK ADDED TO PNR GDH6YU"],
          errorHint:
            "Start with PADD-DOCFRAUD and cover markers + escalation, e.g. PADD-DOC FRAUD SUSPECTED VISA P1/3 MARKERS/ASF 1045Z/NO BP ISSUED",
          points: 8,
        },
      ],
    },
    {
      type: "decision",
      id: "m16-d3",
      prompt: "The agent intervenes — hold the line calmly.",
      situation:
        "The agent strides back: 'Boss, I know the PRO in Sharjah personally, this visa is one thousand percent genuine. Just print the boarding pass and I will handle everything in Dubai. Why are you making problems for my client?' Jashim watches you both, hands flat on the counter.",
      options: [
        {
          id: "m16-d3-a",
          text: "Sir, nothing personal is happening: Gulf employment documents get a standard verification today, the system decides, and the desk prints nothing until it clears — that is true for every passenger at every row. If your PRO relationship is real, it will show in the verification; if it is not, no phone call changes the procedure. Please return to the waiting area — the passenger is in good hands.",
          points: 16,
          feedback:
            "Correct: de-personalises it ('nothing personal'), names the process as the decider, neither accuses nor accepts his authority, and re-secures the counter boundary.",
          consequence:
            "The agent tries one more angle, reads your face, and retreats to the chairs — phone now pointed firmly DOWN.",
          best: true,
        },
        {
          id: "m16-d3-b",
          text: "Threaten him: 'I know who you are, Raja Travels — get out or I will have you arrested right now.'",
          points: 4,
          feedback:
            "You may well be right, but threats from the counter become the story: he films, the hall gathers, ASF inherits a scene instead of a suspect. Observe, note, let ASF decide.",
          best: false,
        },
        {
          id: "m16-d3-c",
          text: "Back down: 'Okay, okay — but you take responsibility in writing that the visa is genuine.'",
          points: 0,
          feedback:
            "A scribbled note from the forger's agent does not legalise a forged visa — and you have just re-opened acceptance on a suspect document for a signature.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m16-d4",
      prompt: "Jashim may be a victim — treat him like one.",
      passengerLines: [
        "While you wait, Jashim speaks quietly: 'Sir… the company in Dubai — I never saw it. The agent in Dhaka took my passport for one week. He said pay in Lahore, visa ready. My family sold land for this job.'",
      ],
      options: [
        {
          id: "m16-d4-a",
          text: "Jashim, listen to me carefully: what you just described — passport taken away, visa bought through a middleman, money from land — I have heard before, and the people it happens to are usually VICTIMS, not criminals. Right now some colleagues will come and talk with you kindly, in your language if you want; you tell them everything you told me, every name, every receipt. Nobody here will shout at you or touch you. Your story can protect the next man from the same agent.",
          points: 8,
          feedback:
            "Excellent trafficking awareness: normalises his account, reframes him as a likely victim, promises a humane interview, and points the investigation at the network, not the labourer.",
          consequence:
            "His shoulders drop for the first time in minutes. 'Sir, I show everything. Every name.' He slides a Dhaka receipt from his wallet: 4.5 lakh taka.",
          best: true,
        },
        {
          id: "m16-d4-b",
          text: "Interrogate him sharply: 'Who made this visa? Tell me NOW or this becomes very bad for you.'",
          points: 4,
          feedback:
            "Aggressive interrogation of a frightened suspected victim contaminates the ASF interview and may push him into protecting the agent out of fear.",
          best: false,
        },
        {
          id: "m16-d4-c",
          text: "Say nothing until ASF arrives — 'not my department, wait there in silence.'",
          points: 4,
          feedback:
            "Procedurally safe but humanly cold: he may destroy evidence, bolt, or spiral. Basic humane engagement costs nothing and preserves everything.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "m16-d5",
      prompt: "ASF arrives — complete the handover like a professional.",
      situation:
        "Two ASF officers in plain clothes reach Row 9. The supervisor nods at you. What does a complete handover look like?",
      options: [
        {
          id: "m16-d5-a",
          text: "Hand over the chain: the passport (never out of sight since your first concern), the three fraud markers in order (typeface, lamination bubble, MRZ divergence), the Dhaka receipt Jashim surrendered, the agent's description and seat location, the exact time of your quiet-alert call — then let the officers take position BEFORE any public movement happens. Finally: complete the PADD with the handover time and officers' names. The record outlives the shift.",
          points: 12,
          feedback:
            "Complete professional handover: evidence chain intact, observations ordered and factual, the third party located, timings precise, and the PADD closes the loop. This is how a counter becomes a case.",
          consequence:
            "ASF moves quietly: the 'agent' is met at the waiting chairs, Jashim walks out with the officers and a bottle of water. G9 512 departs on time. Your PADD becomes Exhibit A.",
          best: true,
        },
        {
          id: "m16-d5-b",
          text: "Point at Jashim across the hall: 'There he is — the fraud guy. Do what you want with him.'",
          points: 0,
          feedback:
            "Public labelling of a suspected VICTIM as 'the fraud guy' — in front of sixty passengers — is both a dignity violation and an investigation hazard. Facts, not labels.",
          best: false,
        },
        {
          id: "m16-d5-c",
          text: "Give ASF the passport and walk away — 'my part is done, the desk needs me.'",
          points: 4,
          feedback:
            "The handover is incomplete: no markers, no timings, no agent description, no PADD closure. Your observations ARE the case file — finish them.",
          best: false,
        },
      ],
    },
  ],
  debriefRules: [
    {
      source: "IATA / ICAO Doc 9303 — Document Examination",
      ref: "Fraud markers: typeface shifts, lamination anomalies, MRZ ↔ VIZ divergence",
      detail:
        "Genuine documents are consistent: one typeface, clean lamination, machine zone matching the visual zone. Any single mismatch mandates verification (TI DOC + supervisor); multiple markers mandate ASF.",
    },
    {
      source: "SAPS SOP — Quiet Escalation",
      ref: "Calm hold · code word · passport under tray · no public accusation",
      detail:
        "The counter never announces fraud. Keep the passport in view, summon supervisor/ASF by code, let officers choose the moment. Public accusations create flight risks and hall panic.",
    },
    {
      source: "SAPS / IATA — Trafficking Watch",
      ref: "Passport confiscation + agent-bought visas + land-sold funding = victim profile",
      detail:
        "Document-fraud passengers on labour routes are frequently trafficked or exploited job-seekers. Humane engagement preserves evidence, testimony and human dignity — treat the network as the suspect.",
    },
  ],
  checklist: [
    "Split the passenger from third-party pressure FIRST — agents wait in the seating area",
    "Examine: typeface consistency, lamination integrity, MRZ ↔ visual zone match",
    "TI DOC/AE — verify against TIMATIC before concluding anything",
    "Quiet escalation: calm hold phrase + code word + passport under tray",
    "XX/P1 — hold acceptance; NO bags, NO boarding pass",
    "PADD-DOCFRAUD … — markers, time, escalation, no BP (the audit is Exhibit A)",
    "Answer pressure neutrally: 'the system decides' — never accuse, never threaten",
    "Suspected victims: humane engagement, their story first, names and receipts preserved",
    "Handover: passport chain-of-custody, ordered observations, agent location, times",
    "The record outlives the shift — complete the PADD with officers' names",
  ],
  badgeId: "shadow-guardian",
};

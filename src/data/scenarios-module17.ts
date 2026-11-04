import type { Scenario } from "@/lib/types";

/**
 * MODULE 17 — Cargo DGR Acceptance (IATA DGR Section 8)
 * A shipper presents four drums of UN 1263 Paint (Class 3, PG II) with a
 * defective declaration and one leaking drum.
 */
export const scenarioCargoDgr: Scenario = {
  id: "m17-cargo-dgr",
  moduleNo: 17,
  code: "M17-DGR-ACC",
  title: "The Blue Barrel",
  category: "cargo-dgr",
  tags: ["IATA DGR", "Cargo", "UN 1263", "Class 3", "Acceptance Checklist", "NOTOC"],
  difficulty: 5,
  xpBase: 180,
  minutes: 16,
  summary:
    "A freight forwarder offers four drums of paint for Dubai with a defective Shipper's Declaration, a blank emergency number and one leaking drum. Accept, fix or refuse — by the DGR.",
  briefing:
    "You are the SAPS cargo acceptance agent at Lahore (LHE), flight PK 304 LHE–DXB, 25 OCT. Imran Rahman of Rahman Logistics presents AWB 176-12345675: four 20-litre drums of UN 1263 PAINT, Class 3, Packing Group II, PI 366. The Shipper's Declaration has no 24-hour emergency telephone number and drum 3 is wet at the seam. The flight closes in 40 minutes. Run the IATA DGR acceptance checklist, protect the crew and aircraft, and leave an auditable trail in Altéa.",
  objectives: [
    "Verify the Shipper's Declaration: UN number, proper shipping name, class, PG, quantity, packing instruction and 24-hour emergency contact",
    "Inspect every package for labels, markings, condition and quantity limits before acceptance",
    "Quarantine the leaking drum and refuse it — never load a damaged or leaking package",
    "Apply Class 3 loading segregation and issue a NOTOC before departure",
    "Document the acceptance decision, rejection and NOTOC in Altéa",
  ],
  passenger: {
    name: "Imran Rahman — Cargo Shipper",
    age: 41,
    nationality: "Pakistan",
    passportNo: "AB-7719042",
    passportExpiry: "14 MAR 2030",
    pnr: "AWB 176-12345675",
    ticketNo: "176-12345675",
    flight: "PK 304",
    route: "LHE → DXB",
    date: "25 OCT",
    seat: "CARGO",
    fareClass: "CARGO — GENERAL",
    allowance: "4 DRUMS / 80 L",
    originStation: "LHE — SAPS Cargo Terminal",
    avatarTone: "amber",
    visa: "UAE import permit on file",
  },
  baggage: [
    {
      id: "drum1",
      label: "Drum 1 — UN 1263 PAINT, Class 3, PG II, 20 L",
      weightKg: 22.4,
      type: "checked",
      tag: "DGR-1263-1",
      note: "Labels and markings present; package sound",
    },
    {
      id: "drum2",
      label: "Drum 2 — UN 1263 PAINT, Class 3, PG II, 20 L",
      weightKg: 22.1,
      type: "checked",
      tag: "DGR-1263-2",
      note: "Labels and markings present; package sound",
    },
    {
      id: "drum3",
      label: "Drum 3 — UN 1263 PAINT, Class 3, PG II, 20 L",
      weightKg: 22.6,
      type: "checked",
      tag: "DGR-1263-3",
      note: "WET AT SEAM — suspected leak; quarantine and refuse",
    },
    {
      id: "drum4",
      label: "Drum 4 — UN 1263 PAINT, Class 3, PG II, 20 L",
      weightKg: 22.2,
      type: "checked",
      tag: "DGR-1263-4",
      note: "Labels and markings present; package sound",
    },
  ],
  documents: {
    passport: [
      { key: "shipper", label: "Shipper", value: "RAHMAN LOGISTICS (PVT) LTD" },
      { key: "consignee", label: "Consignee", value: "GULF PAINT TRADING LLC, DXB" },
      { key: "awb", label: "AWB", value: "176-12345675" },
    ],
    ticket: [
      { key: "flight", label: "Flight", value: "PK 304 25OCT LHEDXB" },
      { key: "awb", label: "AWB", value: "176-12345675" },
      { key: "pieces", label: "Pieces", value: "4 DRUMS × 20 L" },
      { key: "weight", label: "Gross weight", value: "89.3 KG" },
    ],
    extra: [
      {
        key: "un",
        label: "UN / class / PG",
        value: "UN 1263 / CLASS 3 / PG II",
        highlight: "ok",
      },
      {
        key: "pi",
        label: "Packing instruction",
        value: "PI 366 — combination packaging",
        highlight: "ok",
      },
      {
        key: "emergency",
        label: "24-hour emergency contact",
        value: "MISSING ON DECLARATION",
        highlight: "bad",
      },
      {
        key: "condition",
        label: "Package condition",
        value: "DRUM 3 LEAKING — QUARANTINE",
        highlight: "bad",
      },
    ],
  },
  steps: [
    {
      type: "dialogue",
      id: "m17-d1",
      prompt: "The shipper wants a fast stamp. Set the acceptance boundary without losing the customer.",
      passengerLines: [
        "Sahib, four drums of paint for Dubai. The declaration is with the driver, everything is sealed and factory-packed. Just stamp the AWB — the flight closes in forty minutes.",
      ],
      options: [
        {
          id: "m17-d1-a",
          text: "Before I accept anything, I need the Shipper's Declaration and a look at every drum. DGR acceptance is a checklist, not a stamp — let us do it together now so the flight does not leave without you.",
          points: 10,
          feedback:
            "Correct: acceptance begins with the declaration and a physical package inspection. Framing it as protecting his shipment keeps the relationship intact.",
          consequence:
            "He signals the driver: 'Bring the declaration folder — and open the back so sahib can inspect.'",
          best: true,
        },
        {
          id: "m17-d1-b",
          text: "Leave the papers with the driver and I will provisionally accept the drums — we can complete the file later.",
          points: 3,
          feedback:
            "Provisional DGR acceptance without a declaration or inspection is not permitted. The aircraft cannot load an undocumented consignment.",
          best: false,
        },
        {
          id: "m17-d1-c",
          text: "Paint is general cargo. You do not need dangerous-goods paperwork for this.",
          points: 5,
          feedback:
            "UN 1263 Paint is Class 3. Saying it is general cargo is a dangerous misclassification.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m17-d2",
      prompt: "The declaration is defective and a drum is leaking. Explain the two stoppers.",
      passengerLines: [
        "Here is the declaration: UN 1263, Paint, Class 3, PG II, four by twenty litres. The emergency phone box is empty — but you have my mobile. And drum 3 is only wet from the rain, not leaking.",
      ],
      options: [
        {
          id: "m17-d2-a",
          text: "Two acceptance stoppers, Mr Rahman. First, the declaration needs a monitored 24-hour emergency response number — your mobile is not enough unless it is the nominated response line. Second, a drum wet at the seam is a suspected leak; it cannot be loaded. We quarantine drum 3, correct the declaration, and then I can accept the three sound drums.",
          points: 16,
          feedback:
            "Perfect: names both defects, quotes the real requirement, isolates the leaking package and offers a compliant path for the remaining cargo.",
          consequence:
            "He calls his office, dictates the emergency number, and signs the corrected declaration. Drum 3 is moved to the quarantine bay.",
          best: true,
        },
        {
          id: "m17-d2-b",
          text: "Wipe drum 3 and accept all four. Rain is not a leak, and the mobile number is good enough.",
          points: 6,
          feedback:
            "A leak cannot be wiped away, and a personal mobile is not automatically a monitored 24-hour emergency line. Both defects must be resolved before acceptance.",
          best: false,
        },
        {
          id: "m17-d2-c",
          text: "Reject the entire consignment and tell him to come back tomorrow.",
          points: 10,
          feedback:
            "Safe but over-restrictive: the three sound drums can be accepted once the declaration is corrected. Correct classification beats blanket refusal.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "m17-t1",
      prompt: "The declaration is corrected and drum 3 is quarantined. Complete the cargo acceptance entries.",
      intro:
        "Three sound drums (3 × 20 L) remain. Verify the flight, retrieve the AWB, screen the DGR entry, record the acceptance SSR and add the audit remark.",
      commands: [
        {
          pattern: "^PD/LHEDXB/25OCT$",
          display: "PD/LHEDXB/25OCT",
          hint: "Passenger/flight display — pull up PK 304 LHE→DXB for 25 OCT.",
          output: [
            "FLIGHT: PK 304  LHE-DXB  EQP 320  STATUS: OPEN",
            "STD 1820  CARGO CUTOFF 1745  ULD LOWER DECK",
            "CARGO: 4.2T BOOKED / 3.9T RECEIVED",
          ],
          errorHint: "Format: PD/<origin><destination>/<DDMMM> — PD/LHEDXB/25OCT",
          points: 8,
        },
        {
          pattern: "^RT/RAHMAN$",
          display: "RT/RAHMAN",
          hint: "Retrieve the cargo record by shipper family name.",
          output: [
            "SHIPPER: RAHMAN LOGISTICS (PVT) LTD  AWB 176-12345675",
            "CONSIGNEE: GULF PAINT TRADING LLC  DXB",
            "COMMODITY: PAINT  UN1263  CLASS 3  PG II",
          ],
          errorHint: "Retrieve by shipper: RT/RAHMAN",
          points: 8,
        },
        {
          pattern: "^DGR/UN1263/PGII/3X20L$",
          display: "DGR/UN1263/PGII/3X20L",
          hint: "Screen the corrected DGR entry: UN 1263, PG II, three 20-litre drums.",
          output: [
            "DGR CHECK: UN1263 PAINT CLASS 3 PG II",
            "PACKING INSTRUCTION: PI 366  QTY: 3 X 20 L  WITHIN LIMITS",
            "SHIPPER DECLARATION: VALID  EMERGENCY 24H: CONFIRMED",
            "PACKAGE CONDITION: 3 SOUND / DRUM 3 QUARANTINED",
          ],
          errorHint: "Format: DGR/UN1263/PGII/3X20L",
          points: 8,
        },
        {
          pattern: "^SRDGR-AWB/.*$",
          display: "SR DGR-AWB/176-12345675",
          hint: "Attach the DGR acceptance SSR to the AWB.",
          output: [
            "OK SSR DGR ADDED",
            "AWB 176-12345675  UN1263  CLASS 3  PG II  3 DRUMS",
          ],
          errorHint: "Start with SR DGR-AWB/ and include the AWB number.",
          points: 8,
        },
        {
          pattern: "^PADD-DGR.*$",
          display: "PADD-DGR UN1263 PGII 3X20L/DRUM3 QUARANTINED/NOTOC RAISED",
          hint: "Add the audit remark: accepted quantity, quarantined drum and NOTOC.",
          output: [
            "OK REMARK ADDED TO AWB 176-12345675",
            "DGR ACCEPTANCE CHECKLIST COMPLETED — 3 DRUMS",
          ],
          errorHint:
            "Start with PADD-DGR and record the accepted quantity, the quarantined drum and the NOTOC.",
          points: 8,
        },
      ],
    },
    {
      type: "decision",
      id: "m17-d3",
      prompt: "Make the final acceptance decision.",
      situation:
        "The declaration is corrected, drum 3 is quarantined, and three sound drums remain. The flight closes in 35 minutes. The shipper is a regular customer and asks you to skip the checklist 'just this once'.",
      options: [
        {
          id: "m17-d3-a",
          text: "Accept the three sound drums only after completing the acceptance checklist, verifying labels/markings and PI 366 limits, and raising the NOTOC. Keep drum 3 quarantined and document the rejection.",
          points: 22,
          feedback:
            "Fully compliant: only sound packages accepted, checklist completed, quantity verified, NOTOC raised and the rejection documented. This is the acceptance standard.",
          consequence:
            "The loading supervisor confirms: 'Three drums accepted, checklist attached, NOTOC with the captain.'",
          best: true,
        },
        {
          id: "m17-d3-b",
          text: "Accept all four after taping the leak. The paint is already paid for and the customer is a regular.",
          points: 8,
          feedback:
            "A leaking Class 3 package must never be loaded, and skipping the checklist because of a relationship is an integrity breach.",
          best: false,
        },
        {
          id: "m17-d3-c",
          text: "Accept the three sound drums but skip the checklist — the shipper is known and the flight is tight.",
          points: 14,
          feedback:
            "The right packages, but the wrong process. The signed acceptance checklist is the evidence that the DGR check happened.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "m17-d4",
      prompt: "Protect the loading plan: Class 3 paint and a Class 5.1 oxidizer are booked on the same aircraft.",
      situation:
        "The loading instruction places the UN 1263 paint next to a consignment of Class 5.1 oxidizer. Both are booked on PK 304. The loading supervisor asks whether they can simply go in the same hold.",
      options: [
        {
          id: "m17-d4-a",
          text: "Stop and check the DGR segregation requirements. Separate the incompatible loads, update the loading instruction and NOTOC, and only then release the cargo for loading.",
          points: 12,
          feedback:
            "Correct: Class 3 and Class 5.1 are incompatible. Check the segregation table, physically separate them, and update the loading documents before loading.",
          consequence:
            "Load control repositions the oxidizer to a separated position and reissues the NOTOC.",
          best: true,
        },
        {
          id: "m17-d4-b",
          text: "Load them together — both are in the same cargo hold anyway, so separation makes no difference.",
          points: 4,
          feedback:
            "Wrong: incompatible classes must be segregated. Proximity increases the risk of fire, reaction and spread.",
          best: false,
        },
        {
          id: "m17-d4-c",
          text: "Move the oxidizer to another flight without telling the shipper or load control.",
          points: 8,
          feedback:
            "Offloading cargo without notification breaks the chain of custody and leaves the paperwork wrong. Decide, document and communicate.",
          best: false,
        },
      ],
    },
  ],
  debriefRules: [
    {
      source: "IATA DGR 67th Ed. (2026), Section 8",
      ref: "Acceptance — Shipper's Declaration and acceptance checklist",
      detail:
        "Acceptance staff must verify the declaration, package markings/labels, condition and quantity against the DGR. The completed checklist is the auditable record.",
    },
    {
      source: "IATA DGR 67th Ed. (2026), 8.1.6",
      ref: "24-hour emergency response telephone number",
      detail:
        "The Shipper's Declaration must include a monitored 24-hour emergency response number. A personal mobile that is not monitored for the journey does not satisfy the requirement.",
    },
    {
      source: "IATA DGR 67th Ed. (2026), 9.3",
      ref: "Loading, segregation and securing",
      detail:
        "Class 3 flammable liquids must be segregated from incompatible classes such as Class 5.1 oxidizers. The loading instruction and NOTOC must reflect the final load.",
    },
    {
      source: "IATA DGR 67th Ed. (2026), 7.3",
      ref: "Notification to Captain (NOTOC)",
      detail:
        "The NOTOC tells the captain which dangerous goods are on board, where they are loaded and what to do in an emergency. It must be delivered before departure.",
    },
  ],
  checklist: [
    "Ask for the Shipper's Declaration before touching the packages",
    "Verify UN number, proper shipping name, class, PG, quantity and packing instruction",
    "Confirm a monitored 24-hour emergency response number on the declaration",
    "Inspect every drum for labels, markings, damage, leaks and closure security",
    "Quarantine any leaking or damaged package — do not load it",
    "Check the quantity against PI 366 / PG II limits",
    "Complete and sign the acceptance checklist",
    "Record the acceptance SSR on the AWB (SR DGR-AWB/…)",
    "Add PADD-DGR audit remark with accepted quantity and rejection",
    "Check Class 3 / Class 5.1 segregation and update the loading instruction",
    "Raise the NOTOC and confirm delivery to the captain",
    "Tell the shipper the decision and the reason — no silent acceptance",
  ],
  badgeId: "dgr-acceptor",
};

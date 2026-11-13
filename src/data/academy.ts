import type { AcademyQuestion, AcademyStats, AcademyTrack } from "@/lib/types";
import { PAX_QUESTIONS } from "./pax-questions";

/**
 * Knowledge Gym — micro-drills for the competencies a SAPS traffic assistant
 * uses every shift: IATA DGR, IGOM ramp operations, IATA passenger standards
 * and SAPS/PCAA local procedure.
 *
 * Every answer carries the rule behind it, so a wrong click becomes a coaching
 * moment rather than a dead end. Content is training material only and must
 * always be read alongside the current operator manuals and local SOPs.
 */

export const TRACK_META: Record<
  AcademyTrack,
  { label: string; short: string; description: string; icon: string }
> = {
  DGR: {
    label: "Dangerous Goods",
    short: "DGR",
    description:
      "IATA DGR classification, acceptance, lithium batteries, dry ice and loading.",
    icon: "☣️",
  },
  IGOM: {
    label: "Ramp & Turnaround",
    short: "IGOM",
    description:
      "IATA IGOM safety-critical ramp procedures, FOD, GSE, loading and departure.",
    icon: "🦺",
  },
  IATA: {
    label: "Passenger Standards",
    short: "IATA",
    description:
      "TIMATIC, baggage, SSR codes, special passengers, IRROPS and boarding.",
    icon: "🛫",
  },
  SAPS: {
    label: "SAPS & PCAA",
    short: "SAPS",
    description:
      "Local airport authority, ASF/FIA/customs interfaces and service excellence.",
    icon: "🇵🇰",
  },
};

export const ACADEMY_TRACKS: AcademyTrack[] = ["DGR", "IGOM", "IATA", "SAPS"];

function q(
  id: string,
  track: AcademyTrack,
  topic: string,
  difficulty: 1 | 2 | 3,
  question: string,
  options: [string, string, string, string],
  answer: number,
  explanation: string,
  reference: string,
  scenarioId?: string,
): AcademyQuestion {
  return {
    id,
    track,
    topic,
    difficulty,
    question,
    options,
    answer,
    explanation,
    reference,
    ...(scenarioId ? { scenarioId } : {}),
  };
}

export const ACADEMY_QUESTIONS: AcademyQuestion[] = [
  /* ------------------------------- DGR ------------------------------- */
  q(
    "dgr-spare-cabin",
    "DGR",
    "Lithium batteries",
    1,
    "Where may spare lithium-ion batteries travel?",
    [
      "Checked baggage only",
      "Cabin (carry-on) only",
      "Either cabin or checked baggage",
      "Cargo hold with a NOTOC",
    ],
    1,
    "Spare lithium cells and power banks must stay in the cabin, where crew can see and fight a thermal event. Terminals must be protected against short circuit.",
    "IATA DGR 67th Ed. (2026), 2.3 — Lithium batteries",
    "m6-lithium",
  ),
  q(
    "dgr-100wh",
    "DGR",
    "Lithium batteries",
    1,
    "A passenger carries a 99.9Wh power bank. What is the correct handling?",
    [
      "Forbidden on passenger aircraft",
      "Allowed in the cabin without operator approval",
      "Allowed in checked baggage if switched off",
      "Allowed only with a doctor's certificate",
    ],
    1,
    "Spare batteries up to 100Wh may travel in the cabin without operator approval. Above 100Wh and up to 160Wh, operator approval is required; above 160Wh is forbidden.",
    "IATA DGR 67th Ed. (2026), 2.3.2 — Passenger provisions",
    "m6-lithium",
  ),
  q(
    "dgr-160wh",
    "DGR",
    "Lithium batteries",
    2,
    "A 140Wh camera battery is presented as a spare. What is required?",
    [
      "It is forbidden — only ≤100Wh spares may fly",
      "Operator approval, cabin carriage and terminal protection",
      "It may go in the hold if the camera is checked",
      "It needs a shipper's declaration and cargo AWB",
    ],
    1,
    "Spares between 100Wh and 160Wh need operator approval and remain cabin-only. They never become checked baggage just because the device is checked.",
    "IATA DGR 67th Ed. (2026), 2.3.2 — Batteries 100–160Wh",
    "m6-lithium",
  ),
  q(
    "dgr-300wh",
    "DGR",
    "Lithium batteries",
    2,
    "What happens to a 300Wh portable power station offered for a passenger flight?",
    [
      "Cabin only, with the terminals taped",
      "Checked only, with a fragile tag",
      "Forbidden entirely; offer a compliant cargo or landside alternative",
      "Allowed if the passenger signs a waiver",
    ],
    2,
    "Above 160Wh is forbidden on passenger aircraft, cabin or hold. A waiver cannot override the DGR. Hand it back or route it as properly declared cargo.",
    "IATA DGR 67th Ed. (2026), 2.3.2 — Absolute limit",
    "m6-lithium",
  ),
  q(
    "dgr-dryice-limit",
    "DGR",
    "Dry ice",
    1,
    "What is the usual IATA DGR limit for dry ice in checked passenger baggage?",
    [
      "1.0 kg per package",
      "2.5 kg per package",
      "5.0 kg per package",
      "No limit if the box is sealed",
    ],
    1,
    "Dry ice (UN 1845) is normally limited to 2.5 kg per package in checked baggage, with operator approval and vented packaging.",
    "IATA DGR 67th Ed. (2026), 2.3 — Dry ice",
    "m3-dryice",
  ),
  q(
    "dgr-dryice-class",
    "DGR",
    "Dry ice",
    1,
    "Dry ice is which UN number and class?",
    [
      "UN 1845, Class 9",
      "UN 1263, Class 3",
      "UN 2800, Class 8",
      "UN 3480, Class 9",
    ],
    0,
    "Dry ice is UN 1845, Class 9 (miscellaneous dangerous goods). UN 3480 is a lithium-ion battery; UN 1263 is paint; UN 2800 is a wet battery.",
    "IATA DGR 67th Ed. (2026), Class 9 — UN 1845",
    "m3-dryice",
  ),
  q(
    "dgr-dryice-vent",
    "DGR",
    "Dry ice",
    2,
    "Why must a dry-ice package be ventilated?",
    [
      "To keep the food fresh",
      "To stop CO₂ pressure building up and prevent asphyxiation",
      "To let melt-water drain into the hold",
      "To make the package lighter",
    ],
    1,
    "Dry ice sublimates directly to CO₂ gas. A sealed package can rupture, and the heavy gas can displace oxygen in a confined space.",
    "IATA DGR 67th Ed. (2026), PI 954 — Dry ice packaging",
    "m3-dryice",
  ),
  q(
    "dgr-ecig",
    "DGR",
    "E-cigarettes",
    1,
    "How are e-cigarettes and vapes carried?",
    [
      "Checked baggage only",
      "Cabin only, with no use or charging onboard",
      "Either cabin or checked, if switched off",
      "Cargo only, under a shipper's declaration",
    ],
    1,
    "E-cigarettes contain lithium cells and heating liquid. They are cabin-only and must not be used or charged on board.",
    "IATA DGR 67th Ed. (2026), 2.3 — Electronic cigarettes",
    "m6-lithium",
  ),
  q(
    "dgr-hidden",
    "DGR",
    "Hidden dangerous goods",
    2,
    "Which item is a classic example of hidden dangerous goods in general cargo?",
    [
      "A sealed envelope of documents",
      "A camping stove with fuel still in the tank",
      "A cotton shirt in a polybag",
      "A printed cardboard box",
    ],
    1,
    "Fuel in a camping stove, aerosols, paint, adhesives, magnets and machinery with residual fuel are common hidden dangerous goods. Ask what is inside — never accept a vague description.",
    "IATA DGR 67th Ed. (2026), 2.2 — Hidden dangerous goods",
    "m17-cargo-dgr",
  ),
  q(
    "dgr-declaration",
    "DGR",
    "Acceptance",
    2,
    "Which set belongs on a Shipper's Declaration for Dangerous Goods?",
    [
      "UN number, proper shipping name, class, packing group, quantity and 24-hour emergency contact",
      "Only the AWB number and the shipper's signature",
      "The passenger name and seat number",
      "A verbal description confirmed by phone",
    ],
    0,
    "The declaration must identify the UN number, proper shipping name, class/division, packing group, quantity, packing instruction and a 24-hour emergency response telephone number.",
    "IATA DGR 67th Ed. (2026), 8.1 — Shipper's Declaration",
    "m17-cargo-dgr",
  ),
  q(
    "dgr-accept-checklist",
    "DGR",
    "Acceptance",
    2,
    "Who completes the dangerous goods acceptance checklist?",
    [
      "The shipper, before the truck arrives",
      "Trained acceptance staff of the operator or ground handler",
      "The aircraft captain after loading",
      "The passenger at the gate",
    ],
    1,
    "Acceptance is a controlled task for trained operator/GHA staff. The checklist compares the declaration, package markings, labels, condition and quantity against the DGR.",
    "IATA DGR 67th Ed. (2026), 8.1.6 — Acceptance checklist",
    "m17-cargo-dgr",
  ),
  q(
    "dgr-leak",
    "DGR",
    "Acceptance",
    2,
    "A drum of Class 3 paint is leaking at the cargo acceptance dock. What is the first correct action?",
    [
      "Load it quickly before more escapes",
      "Refuse/quarantine it, protect people and the environment, and report",
      "Wipe it and tag it as accepted",
      "Put it in another passenger's baggage",
    ],
    1,
    "A leaking or damaged package must not be accepted or loaded. Isolate it, follow the spill procedure, protect staff and report to the supervisor.",
    "IATA DGR 67th Ed. (2026), 8.1 — Package condition",
    "m17-cargo-dgr",
  ),
  q(
    "dgr-class3",
    "DGR",
    "Hazard classes",
    1,
    "What is the primary hazard of Class 3 dangerous goods?",
    [
      "Flammable liquid — vapour can ignite",
      "Corrosive to skin only",
      "Radioactive emission",
      "Infectious substance",
    ],
    0,
    "Class 3 covers flammable liquids. Their vapour can ignite at low flash points, so ignition sources, heat and incompatible loading matter.",
    "IATA DGR 67th Ed. (2026), Class 3",
    "m17-cargo-dgr",
  ),
  q(
    "dgr-class8",
    "DGR",
    "Hazard classes",
    1,
    "What harm do Class 8 corrosives cause?",
    [
      "Only a bad smell",
      "Chemical burns to skin and damage to aircraft structure",
      "Radiation sickness",
      "A flammable gas cloud",
    ],
    1,
    "Class 8 substances destroy living tissue and can attack aluminium or other aircraft materials. Leakage is a structural and personal-injury risk.",
    "IATA DGR 67th Ed. (2026), Class 8",
  ),
  q(
    "dgr-class2",
    "DGR",
    "Hazard classes",
    2,
    "A cylinder contains a non-flammable, non-toxic compressed gas (Class 2.2). What are the main risks?",
    [
      "Pressure release and oxygen displacement",
      "Spontaneous combustion",
      "Radioactive contamination",
      "Water pollution only",
    ],
    0,
    "Class 2.2 gases are asphyxiants under pressure. A damaged cylinder can become a projectile, and escaping gas can displace oxygen in a confined space.",
    "IATA DGR 67th Ed. (2026), Class 2",
  ),
  q(
    "dgr-notoc",
    "DGR",
    "Loading",
    2,
    "What is the NOTOC and who receives it?",
    [
      "A passenger menu card",
      "Notification to the Captain listing dangerous goods loaded",
      "A customs receipt",
      "A baggage reconciliation form",
    ],
    1,
    "The NOTOC tells the captain what dangerous goods are on board, where they are loaded and what to do in an emergency. It must be completed and delivered before departure.",
    "IATA DGR 67th Ed. (2026), 7.3 — Notification to Captain",
    "m17-cargo-dgr",
  ),
  q(
    "dgr-emergency-phone",
    "DGR",
    "Acceptance",
    2,
    "A Shipper's Declaration has no 24-hour emergency telephone number. What do you do?",
    [
      "Accept it — the office number is enough",
      "Reject or hold it until a monitored 24-hour number is provided",
      "Write your own mobile number on the form",
      "Accept it and add the number after departure",
    ],
    1,
    "The declaration must carry a 24-hour emergency response number that is monitored during transport. Without it the consignment is not acceptable.",
    "IATA DGR 67th Ed. (2026), 8.1.6 — Emergency contact",
    "m17-cargo-dgr",
  ),
  q(
    "dgr-ped-checked",
    "DGR",
    "Passenger devices",
    1,
    "A passenger wants to check a laptop in a suitcase. What is the correct advice?",
    [
      "Remove it — lithium batteries in checked devices are restricted",
      "Checked devices are always fine",
      "Put spare cells loose in the same suitcase",
      "Remove the battery and post it separately",
    ],
    0,
    "Portable electronic devices in checked baggage are tightly restricted; spare lithium cells must never be checked. Best practice is to carry devices and spares in the cabin.",
    "IATA DGR 67th Ed. (2026), 2.3 — Passenger baggage",
    "m6-lithium",
  ),
];

/* ------------------------------- IGOM ------------------------------- */

ACADEMY_QUESTIONS.push(
  q(
    "igom-engine-zone",
    "IGOM",
    "Ramp safety",
    1,
    "The aircraft beacon is on and an engine is running. What applies to the engine danger zone?",
    [
      "You may enter quickly if you duck",
      "Never enter; observe the marked danger area and approach only when cleared",
      "Only the wing walker may enter",
      "The zone applies only at night",
    ],
    1,
    "Engine danger areas are life-critical. Never enter a marked zone while an engine is running or about to start; only cleared personnel follow the approved procedure.",
    "IATA IGOM Ed. 2026, 3.1.2 — Engine danger areas",
    "m18-igom-turnaround",
  ),
  q(
    "igom-fod",
    "IGOM",
    "FOD",
    1,
    "You see a loose metal bracket on the apron near the aircraft. What should you do?",
    [
      "Kick it under the aircraft",
      "Pick it up, report it and dispose of it in the FOD bin",
      "Leave it — the next shift will clear it",
      "Throw it toward the grass",
    ],
    1,
    "Foreign object debris can be ingested by engines or damage tyres. Remove and report it; FOD control is everyone's responsibility.",
    "IATA IGOM Ed. 2026, 3.1 — Ramp safety / FOD",
    "m18-igom-turnaround",
  ),
  q(
    "igom-wingwalker",
    "IGOM",
    "Pushback",
    2,
    "What is the wing walker's job during pushback?",
    [
      "To operate the tug brakes",
      "To watch wingtip and tail clearances and signal the tug driver",
      "To load bags during the push",
      "To close the cabin door",
    ],
    1,
    "The wing walker watches clearance around the wingtips and tail, keeps a clear communication link with the tug driver and stops the move if clearance is lost.",
    "IATA IGOM Ed. 2026, 4.6.2 — Pushback / wing walker",
    "m18-igom-turnaround",
  ),
  q(
    "igom-headset",
    "IGOM",
    "Communication",
    1,
    "Why is a headset used during pushback and towing?",
    [
      "To listen to music on the ramp",
      "To keep a clear, immediate link between the tug driver and the flight deck",
      "To translate passenger announcements",
      "To record the turnaround for social media",
    ],
    1,
    "A headset gives immediate two-way communication for braking, steering and stopping. Hand signals alone are not enough when visibility or noise is poor.",
    "IATA IGOM Ed. 2026, 4.6 — Towing communication",
    "m18-igom-turnaround",
  ),
  q(
    "igom-chocks",
    "IGOM",
    "Arrival",
    1,
    "When are chocks normally placed during aircraft arrival?",
    [
      "After all passengers have boarded",
      "As soon as the aircraft is stopped on stand, before ground servicing",
      "Only if the parking brake fails",
      "After the cargo door is opened",
    ],
    1,
    "Chocks (and the parking brake) secure the aircraft before servicing or loading begins. Follow the marshaller's and operator's arrival procedure.",
    "IATA IGOM Ed. 2026, 4.1 — Ramp turnaround",
    "m18-igom-turnaround",
  ),
  q(
    "igom-gse",
    "IGOM",
    "GSE",
    2,
    "A baggage tractor is left running and unattended near the stand. What is the correct response?",
    [
      "Move it yourself without training",
      "Stop the task, secure the equipment and report the unsafe act",
      "Ignore it if the keys are in it",
      "Use it to speed up the loading",
    ],
    1,
    "Unattended running GSE is a serious hazard. Only trained, authorised staff move equipment; the safe response is to stop, secure and report.",
    "IATA IGOM Ed. 2026, 3.1 — Ground support equipment",
    "m18-igom-turnaround",
  ),
  q(
    "igom-loadsheet",
    "IGOM",
    "Loading",
    2,
    "What must match before an aircraft departs?",
    [
      "The loadsheet, the actual load and the captain's figures",
      "Only the baggage count",
      "The catering trolley numbers",
      "The passenger seat colours",
    ],
    0,
    "The loadsheet must reflect the actual load. Any last-minute change needs an LMC and a revised loadsheet before dispatch.",
    "IATA IGOM Ed. 2026, 4.5 — Aircraft loading",
    "m18-igom-turnaround",
  ),
  q(
    "igom-lmc",
    "IGOM",
    "Loading",
    2,
    "One extra bag is loaded after the loadsheet is issued. What is required?",
    [
      "Nothing — one bag is within tolerance",
      "A last-minute change (LMC) to load control and a revised loadsheet",
      "Telling the passenger only",
      "Loading it and adjusting the next flight",
    ],
    1,
    "Any change after the loadsheet must be communicated as an LMC so load control can recalculate and the captain receives correct figures.",
    "IATA IGOM Ed. 2026, 4.5 — Last-minute changes",
    "m18-igom-turnaround",
  ),
  q(
    "igom-turnaround",
    "IGOM",
    "Turnaround",
    1,
    "Which sequence best describes a turnaround?",
    [
      "Boarding, arrival, catering, departure",
      "Arrival and chocks, deplaning, servicing/loading, boarding, doors closed, pushback",
      "Pushback, boarding, deplaning, fueling",
      "Catering, pushback, arrival, boarding",
    ],
    1,
    "A turnaround runs from arrival and securing the aircraft through deplaning, servicing, loading and boarding, then doors closed and pushback under clearance.",
    "IATA IGOM Ed. 2026, 4.1 — Ramp turnaround",
    "m18-igom-turnaround",
  ),
  q(
    "igom-fueling",
    "IGOM",
    "Fueling",
    3,
    "What is the key rule when fueling with passengers boarding or on board?",
    [
      "No special rule — fueling is independent of boarding",
      "Follow the operator's procedure: exits available, fire equipment ready, no smoking, communication maintained",
      "Lock all doors so passengers cannot leave",
      "Turn off the cabin lights",
    ],
    1,
    "Fueling with passengers requires a documented operator procedure: keep exits available, firefighting equipment ready, no smoking, and maintain communication between ramp and cabin.",
    "IATA IGOM Ed. 2026, 3.5 — Aircraft servicing / fueling",
    "m18-igom-turnaround",
  ),
  q(
    "igom-pbb",
    "IGOM",
    "Boarding bridge",
    2,
    "Before a passenger boarding bridge is docked, what must be confirmed?",
    [
      "The aircraft is chocked and the bridge is aligned with the door",
      "The passengers are already standing",
      "The engine is running",
      "The baggage is fully loaded",
    ],
    0,
    "The bridge must be correctly aligned and the aircraft secured. The operator's procedure controls docking, interlock and door operation.",
    "IATA IGOM Ed. 2026, 3.1.3 — Passenger boarding bridge",
    "m18-igom-turnaround",
  ),
  q(
    "igom-arrival",
    "IGOM",
    "Arrival",
    2,
    "On aircraft arrival, which action belongs to the ground team?",
    [
      "Guide the aircraft to the stand, place chocks/cones and connect ground power as briefed",
      "Open the cabin door before the aircraft stops",
      "Start loading before chocks are placed",
      "Remove the engine fire handles",
    ],
    0,
    "The arrival procedure includes marshalling/guidance, chocks and cones, ground power and a safety briefing before servicing starts.",
    "IATA IGOM Ed. 2026, 4.1 — Actions prior to arrival",
    "m18-igom-turnaround",
  ),
  q(
    "igom-departure",
    "IGOM",
    "Departure",
    2,
    "Which item is part of the departure sequence?",
    [
      "Doors closed, headset communication, walk-around and pushback clearance",
      "Loading the last bag after pushback",
      "Opening the cargo door during pushback",
      "Removing chocks before the captain is ready",
    ],
    0,
    "Departure is a controlled sequence: close and check doors, complete the walk-around, confirm the loadsheet, establish headset communication and obtain pushback clearance.",
    "IATA IGOM Ed. 2026, 4.7 — Aircraft departure",
    "m18-igom-turnaround",
  ),
  q(
    "igom-dg-loading",
    "IGOM",
    "Dangerous goods",
    3,
    "Dangerous goods are loaded. What must the loading team confirm?",
    [
      "The NOTOC is completed and the packages are segregated and secured per the DGR",
      "The packages are hidden behind baggage",
      "Only the passenger is told",
      "The labels are removed to avoid alarm",
    ],
    0,
    "Loaders must follow the loading instruction, check labels/markings and condition, respect segregation, secure the load and ensure the NOTOC reaches the captain.",
    "IATA IGOM Ed. 2026, 4.5 / IATA DGR Section 9",
    "m17-cargo-dgr",
  ),
  q(
    "igom-incident",
    "IGOM",
    "Reporting",
    1,
    "A colleague slips on a fuel spill and injures a wrist. What is the correct sequence?",
    [
      "Make them finish the shift, then report tomorrow",
      "Make the area safe, get first aid, report the incident and preserve information",
      "Move the aircraft first",
      "Take a photo and post it",
    ],
    1,
    "Safety first: isolate the hazard, treat the injury, report through the station safety system and preserve the evidence for investigation.",
    "IATA IGOM Ed. 2026, 1.4 — Safety reporting",
    "m18-igom-turnaround",
  ),
  q(
    "igom-ppe",
    "IGOM",
    "Ramp safety",
    1,
    "Which PPE is standard on an active apron?",
    [
      "Sandals and sunglasses",
      "High-visibility vest, hearing protection and protective footwear",
      "A suit and tie",
      "No PPE if the shift is short",
    ],
    1,
    "Apron PPE normally includes a high-visibility vest, hearing protection in noise zones and safety footwear. Local rules may add gloves, helmets or eye protection.",
    "IATA IGOM Ed. 2026, 3.1 — Personal protective equipment",
    "m18-igom-turnaround",
  ),
  q(
    "igom-jetblast",
    "IGOM",
    "Ramp safety",
    2,
    "Why must you never walk behind a running engine or aircraft under power?",
    [
      "Jet blast and suction can throw a person or equipment",
      "It is only a paperwork rule",
      "The paint may be damaged",
      "The aircraft may run out of fuel",
    ],
    0,
    "Jet blast, suction and debris can kill. Keep to marked safe routes and approach only when the aircraft is secured and cleared.",
    "IATA IGOM Ed. 2026, 3.1.2 — Jet blast / danger areas",
    "m18-igom-turnaround",
  ),
);

/* ------------------------------- IATA ------------------------------- */

ACADEMY_QUESTIONS.push(
  q(
    "iata-timatic",
    "IATA",
    "Documentation",
    1,
    "What is TIMATIC used for at check-in?",
    [
      "Calculating baggage weight",
      "Checking passport, visa, health and customs requirements for the destination",
      "Printing boarding passes",
      "Assigning seats",
    ],
    1,
    "TIMATIC is the industry reference for destination entry requirements. Always check it rather than relying on rumour or a previous passenger's experience.",
    "IATA TIMATIC / IATA Travel Centre",
    "m3-dryice",
  ),
  q(
    "iata-passport",
    "IATA",
    "Documentation",
    2,
    "A passenger's passport expires in five months. What should you do?",
    [
      "Accept it — any valid passport is fine",
      "Check TIMATIC for the destination's validity and blank-page rules, then decide",
      "Refuse every passenger with less than 12 months",
      "Ask the passenger to sign a waiver",
    ],
    1,
    "Passport validity requirements differ by destination. Use TIMATIC and the airline's rules; do not invent a universal six-month rule.",
    "IATA TIMATIC — passport validity",
    "m8-validity",
  ),
  q(
    "iata-allowance",
    "IATA",
    "Baggage",
    1,
    "Where is a passenger's checked baggage allowance found?",
    [
      "On the aircraft door",
      "In the fare/ticket record and the carrier's baggage rules",
      "On the passenger's ID card",
      "Only on the boarding pass",
    ],
    1,
    "Allowance depends on fare, route, carrier and frequent-flyer status. Check the PNR/ticket and the applicable carrier rule before charging excess.",
    "IATA Passenger Standards / carrier baggage rules",
    "m2-excess",
  ),
  q(
    "iata-excess",
    "IATA",
    "Baggage",
    2,
    "A bag is over the allowance. What is the compliant revenue step?",
    [
      "Ignore the excess to keep the queue moving",
      "Assess the excess, collect the correct charge and issue the EMD/receipt",
      "Take cash without a receipt",
      "Tag it as a diplomatic bag",
    ],
    1,
    "Excess baggage must be assessed against the fare rule and charged correctly, with an EMD or receipt and a clear record in the PNR.",
    "IATA Resolution 302 / carrier excess baggage rules",
    "m2-excess",
  ),
  q(
    "iata-idb",
    "IATA",
    "Overbooking",
    2,
    "A flight is oversold. What is the correct first step?",
    [
      "Offload the cheapest passengers immediately",
      "Ask for volunteers before involuntarily denying boarding",
      "Board everyone and deal with it at the gate",
      "Cancel the flight",
    ],
    1,
    "Seek volunteers first, explain the compensation/rerouting, and only then apply the carrier's denied-boarding priority rules. Document every step.",
    "IATA Passenger Services Conference / carrier denied-boarding policy",
    "m4-overbook",
  ),
  q(
    "iata-ssr",
    "IATA",
    "SSR codes",
    1,
    "What does the SSR code WCHS mean?",
    [
      "Passenger can walk to/from the cabin seat but cannot manage steps",
      "Passenger can walk to/from the aircraft but needs a wheelchair for distance",
      "Passenger is completely immobile and needs a wheelchair to the cabin seat",
      "Passenger requires medical oxygen",
    ],
    0,
    "WCHS is a passenger who cannot manage steps but can walk to/from the cabin seat. WCHR is distance assistance, WCHC is full immobility and MEDA is medical clearance.",
    "IATA Resolution 700 / SSR codes",
    "m13-prm",
  ),
  q(
    "iata-umnr",
    "IATA",
    "Special passengers",
    2,
    "What is essential for an unaccompanied minor (UMNR) journey?",
    [
      "A complete handover chain at every point and a responsible adult receiving the child",
      "A first-class seat",
      "A signed waiver removing all responsibility",
      "The child carrying their own passport alone",
    ],
    0,
    "UMNR handling requires documented consent, a responsible adult at departure and arrival, escort through transfers and a controlled handover at every stage.",
    "IATA Passenger Services Conference / carrier UMNR procedure",
    "m12-umnr",
  ),
  q(
    "iata-prm",
    "IATA",
    "Special passengers",
    2,
    "A passenger using a powered wheelchair asks to check it. What must be confirmed?",
    [
      "The battery type, its condition and the carrier's acceptance rules",
      "Only the wheelchair colour",
      "That the wheelchair is empty",
      "That the passenger can walk to the aircraft",
    ],
    0,
    "Powered wheelchairs need battery classification (dry, spillable or lithium), terminal protection, and compliance with the carrier/DGR rules before acceptance.",
    "IATA DGR / carrier PRM procedures",
    "m13-prm",
  ),
  q(
    "iata-meda",
    "IATA",
    "Medical",
    2,
    "What does a MEDA SSR normally require?",
    [
      "Medical clearance from the carrier's medical service and any operational equipment approval",
      "Nothing — it is only a seat request",
      "A doctor's note carried by the passenger only",
      "A guarantee that the flight will not divert",
    ],
    0,
    "MEDA flags a medical case requiring clearance. The carrier's medical service assesses fitness, oxygen, stretcher or special equipment before travel is confirmed.",
    "IATA MEDA / carrier medical clearance",
    "m14-meda",
  ),
  q(
    "iata-pregnancy",
    "IATA",
    "Medical",
    2,
    "How should you handle a passenger who is visibly pregnant?",
    [
      "Refuse boarding automatically",
      "Check the carrier's gestation limit and any medical certificate requirement discreetly",
      "Ask over the public address system",
      "Ignore it — pregnancy is not an airline matter",
    ],
    1,
    "Carriers set gestation limits and certificate rules. Ask privately, check the current rule and record any clearance without embarrassing the passenger.",
    "Carrier pregnancy policy / IATA medical guidance",
    "m14-meda",
  ),
  q(
    "iata-ssr-osi",
    "IATA",
    "SSR codes",
    2,
    "What is the difference between an SSR and an OSI?",
    [
      "SSR is actioned by a carrier system; OSI is informational text",
      "They are identical",
      "OSI is only for cargo",
      "SSR is only for baggage",
    ],
    0,
    "SSRs request a specific service that the system routes to the carrier. OSI is free-text information for the airline and does not trigger the same automated handling.",
    "IATA Resolution 700 / PNR standards",
    "m12-umnr",
  ),
  q(
    "iata-pnr",
    "IATA",
    "PNR",
    1,
    "What is a PNR record locator?",
    [
      "The aircraft registration",
      "The unique booking reference that links the passenger's itinerary and services",
      "The baggage tag number",
      "The gate number",
    ],
    1,
    "The PNR record locator (e.g. 9ZR2WN) is the booking key. Every SSR, remark and ticket must be tied to the correct record.",
    "IATA PNR / Reservations standards",
  ),
  q(
    "iata-boarding",
    "IATA",
    "Boarding",
    2,
    "What should be checked before a passenger boards?",
    [
      "Identity, boarding pass, seat and any special handling/security flags",
      "Only the seat number",
      "Only the destination",
      "Whether they have a duty-free bag",
    ],
    0,
    "Boarding verification matches the person to the booking, confirms the correct flight/seat and catches SSR, security or document flags before the door closes.",
    "IATA IGOM 4.7 / carrier boarding procedure",
    "m5-ssss",
  ),
  q(
    "iata-bagtag",
    "IATA",
    "Baggage",
    1,
    "What is the key check when attaching a baggage tag?",
    [
      "The tag's destination matches the passenger's final routing and the bag is counted",
      "The tag colour matches the suitcase",
      "The bag weighs exactly 23 kg",
      "The passenger keeps the tag",
    ],
    0,
    "A mis-tagged bag is a security and reconciliation risk. Verify the destination, passenger name/PNR and piece count, and give the passenger the correct stub.",
    "IATA Resolution 753 / baggage handling",
    "m11-noshow",
  ),
  q(
    "iata-irrops",
    "IATA",
    "IRROPS",
    2,
    "A flight is cancelled. Which care sequence is most appropriate?",
    [
      "Rebook, provide care (meal/hotel/transport per policy), communicate clearly and document",
      "Tell passengers to buy new tickets",
      "Close the counter and leave",
      "Board the next flight without rebooking",
    ],
    0,
    "IRROPS care combines re-protection, care entitlement, clear communication and documentation. Keep the passenger informed and record what was provided.",
    "IATA IRROPS / carrier care policy",
    "m15-fog",
  ),
  q(
    "iata-ssss",
    "IATA",
    "Security",
    2,
    "A boarding pass shows SSSS. What does it mean?",
    [
      "The passenger is automatically denied boarding",
      "Secondary security screening is required before boarding",
      "The passenger has a special meal",
      "The bag is oversized",
    ],
    1,
    "SSSS selects a passenger for secondary screening. Coordinate discreetly with security, allow time and do not publicly announce the reason.",
    "TSA/ICAO security screening / carrier procedure",
    "m5-ssss",
  ),
  q(
    "iata-fraud",
    "IATA",
    "Security",
    3,
    "You suspect a passport or visa is forged. What is the best response?",
    [
      "Confront the passenger loudly at the counter",
      "Keep the interaction calm, do not accuse, and escalate discreetly to the authorised officer",
      "Stamp the document and continue",
      "Post the document on social media",
    ],
    1,
    "Fraud response protects safety and dignity: stay calm, do not hand back a suspect document unnecessarily, and involve the appropriate authority without creating a public scene.",
    "SAPS/ASF/FIA document-fraud procedure",
    "m16-docfraud",
  ),
  q(
    "iata-dg-baggage",
    "IATA",
    "Dangerous goods",
    1,
    "A passenger says 'it is only a small gas cylinder' in their bag. What should you do?",
    [
      "Accept it — small means safe",
      "Ask what the cylinder contains and check the DGR passenger rules before acceptance",
      "Put it in the hold to save time",
      "Tell them to hide it in a shoe",
    ],
    1,
    "Size is not a safety classification. Identify the substance, check the DGR passenger provisions and refuse or document accordingly.",
    "IATA DGR 67th Ed. (2026), 2.3 — Passenger baggage",
  ),
);

/* ------------------------------- SAPS ------------------------------- */

ACADEMY_QUESTIONS.push(
  q(
    "saps-role",
    "SAPS",
    "Station roles",
    1,
    "What is the core role of a SAPS traffic assistant?",
    [
      "To pilot the aircraft",
      "To deliver safe, compliant passenger and ramp handling at the station",
      "To issue visas",
      "To repair aircraft engines",
    ],
    1,
    "SAPS provides ground handling services. The traffic assistant connects the passenger, the document check, the DCS and the ramp so the flight departs safely and on time.",
    "SAPS ground handling SOP",
  ),
  q(
    "saps-pcaa",
    "SAPS",
    "Regulation",
    1,
    "Which body regulates civil aviation in Pakistan?",
    [
      "PCAA — Pakistan Civil Aviation Authority",
      "IATA",
      "ICAO",
      "ASF",
    ],
    0,
    "The Pakistan Civil Aviation Authority (PCAA) regulates civil aviation safety and security in Pakistan. IATA publishes industry standards; ICAO sets international frameworks.",
    "PCAA / Civil Aviation Rules",
  ),
  q(
    "saps-asf",
    "SAPS",
    "Security",
    1,
    "What is the ASF's role at a Pakistani airport?",
    [
      "Airport security — screening, access control and security response",
      "Baggage loading",
      "Ticket sales",
      "Aircraft maintenance",
    ],
    0,
    "The Airports Security Force (ASF) is responsible for airport security. Traffic staff coordinate with ASF but do not replace its authority.",
    "ASF / airport security procedure",
    "m16-docfraud",
  ),
  q(
    "saps-fia",
    "SAPS",
    "Immigration",
    1,
    "Which agency handles immigration checks for international departures/arrivals?",
    [
      "FIA — Federal Investigation Agency (Immigration)",
      "PCAA",
      "SAPS",
      "IATA",
    ],
    0,
    "FIA Immigration controls passport endorsement and immigration clearance. Always follow the current station procedure for handover and escalation.",
    "FIA Immigration procedure",
    "m8-validity",
  ),
  q(
    "saps-customs",
    "SAPS",
    "Customs",
    2,
    "A passenger asks whether a food item is allowed at destination. What is the best source?",
    [
      "Your personal opinion",
      "TIMATIC customs information and the destination authority's rules",
      "A social-media post",
      "The passenger's travel agent only",
    ],
    1,
    "Customs rules change and are destination-specific. Use TIMATIC and the destination authority, then document the advice given.",
    "IATA TIMATIC / Pakistan Customs",
    "m3-dryice",
  ),
  q(
    "saps-altea",
    "SAPS",
    "Altéa DCS",
    1,
    "In Altéa, what does a PADD remark do?",
    [
      "Adds an auditable free-text remark to the PNR",
      "Prints a boarding pass",
      "Changes the aircraft type",
      "Refunds the ticket",
    ],
    0,
    "PADD writes a remark into the PNR. It is used to record DGR decisions, refusals and other events that must be traceable.",
    "Altéa DCS / SAPS SOP",
    "m17-cargo-dgr",
  ),
  q(
    "saps-handover",
    "SAPS",
    "Shift management",
    1,
    "What should a shift handover include?",
    [
      "Only the tea break time",
      "Open flights, special passengers, DGR/cargo events, incidents and pending actions",
      "A list of colleagues' mistakes",
      "Nothing if the shift was quiet",
    ],
    1,
    "A structured handover protects continuity: open flights, SSR/PRM/MEDA cases, DGR or cargo holds, incidents and anything awaiting action.",
    "SAPS shift handover SOP",
  ),
  q(
    "saps-empathy",
    "SAPS",
    "Service",
    2,
    "A passenger is angry about a delay. What is the best opening?",
    [
      "Acknowledge the frustration, explain what is known, and offer the next concrete action",
      "Tell them to calm down",
      "Blame another department",
      "Ignore them until they stop",
    ],
    0,
    "Empathy plus a concrete next step de-escalates. Acknowledge, explain honestly, act, and keep the passenger informed.",
    "SAPS customer service standard",
    "m2-excess",
  ),
  q(
    "saps-queue",
    "SAPS",
    "Service",
    1,
    "The check-in queue is growing and a flight is closing. What is the best action?",
    [
      "Open additional positions, prioritise the closing flight and communicate wait times",
      "Close the counter",
      "Serve only premium passengers",
      "Ignore the queue",
    ],
    0,
    "Queue management is an operational task: flex staff, prioritise by flight cut-off, and communicate clearly so passengers know what to do.",
    "SAPS station operations SOP",
  ),
  q(
    "saps-docs",
    "SAPS",
    "Documentation",
    2,
    "A passenger has a valid visa but no return ticket where one is required. What do you do?",
    [
      "Board them anyway",
      "Check the destination rule and the carrier's requirement; resolve or escalate before acceptance",
      "Keep the passport",
      "Cancel the visa",
    ],
    1,
    "Some destinations require onward or return proof. Check TIMATIC/carrier rules and resolve the gap before travel; document the decision.",
    "IATA TIMATIC / carrier document rules",
    "m8-validity",
  ),
  q(
    "saps-ramp-comm",
    "SAPS",
    "Communication",
    2,
    "Check-in has a late bag for a closing flight. What is the correct communication?",
    [
      "Load it without telling anyone",
      "Call the ramp/loading supervisor, confirm acceptance and issue the correct LMC/loading update",
      "Put it on the next flight without telling the passenger",
      "Leave it at the counter",
    ],
    1,
    "Late bags need an explicit decision and an accurate load record. Never let a bag travel without reconciliation with the ramp and load control.",
    "SAPS ramp communication SOP / IGOM 4.5",
    "m11-noshow",
  ),
  q(
    "saps-safety-report",
    "SAPS",
    "Safety",
    1,
    "You see a near-miss on the apron. What should you do?",
    [
      "Report it — near-misses prevent real accidents",
      "Keep quiet to avoid paperwork",
      "Only report if someone is injured",
      "Post it online",
    ],
    0,
    "Near-miss reporting is a safety tool. Report through the station system so the hazard can be corrected before an injury or damage occurs.",
    "SAPS safety management / IGOM safety reporting",
    "m18-igom-turnaround",
  ),
  q(
    "saps-hajj",
    "SAPS",
    "Cultural service",
    2,
    "A Hajj/Umrah passenger is anxious about the process. What is the best approach?",
    [
      "Rush them through without explanation",
      "Show patience, explain each step, and respect religious/cultural needs",
      "Refuse special assistance",
      "Separate them from their group",
    ],
    1,
    "Hajj/Umrah traffic is high-volume and emotionally significant. Calm, respectful guidance and group coordination improve safety and service.",
    "SAPS passenger service / Hajj operations",
  ),
  q(
    "saps-zamzam",
    "SAPS",
    "Baggage rules",
    2,
    "What is the usual approach to Zamzam water in baggage?",
    [
      "Allow unlimited quantity",
      "Check the carrier and destination rules; it is normally restricted and must be packed to prevent leakage",
      "Put it in the cabin",
      "Pour it out at the counter",
    ],
    1,
    "Zamzam water is subject to carrier/destination limits and leak-proof packing. Confirm the current rule and tag/document correctly.",
    "Carrier baggage rules / KSA GACA guidance",
    "m1-zamzam",
  ),
  q(
    "saps-irrops",
    "SAPS",
    "IRROPS",
    2,
    "Fog closes the airport. What is the station priority?",
    [
      "Safety, passenger communication, re-protection and care",
      "Push aircraft back anyway",
      "Close the airport shop",
      "Refund every ticket immediately",
    ],
    0,
    "In low visibility, safety decisions come first. Then communicate, re-protect passengers and provide care per policy while documenting actions.",
    "SAPS IRROPS / PCAA weather procedures",
    "m15-fog",
  ),
  q(
    "saps-baggage",
    "SAPS",
    "Baggage",
    1,
    "A bag arrives without a tag at the make-up area. What should you do?",
    [
      "Load it and hope",
      "Stop it, identify/reconcile it and follow the unattended-baggage procedure",
      "Put it on the belt",
      "Take it home",
    ],
    1,
    "An untagged bag cannot be loaded. Isolate it, reconcile with the passenger/PNR and follow the station's security procedure.",
    "SAPS baggage reconciliation / security SOP",
    "m11-noshow",
  ),
  q(
    "saps-escalation",
    "SAPS",
    "Escalation",
    2,
    "A situation is outside your authority. What is the professional response?",
    [
      "Improvise and hide it",
      "Escalate promptly to the supervisor with clear facts and your recommendation",
      "Argue with the passenger",
      "Leave the counter",
    ],
    1,
    "Good escalation is fast and factual: what happened, what you have done, what you need and by when. Hiding a problem makes it worse.",
    "SAPS escalation SOP",
    "m16-docfraud",
  ),
  q(
    "saps-integrity",
    "SAPS",
    "Integrity",
    2,
    "A colleague offers to skip a document check for a friend. What do you do?",
    [
      "Allow it — it is only one passenger",
      "Follow the check and refuse the shortcut; report the pressure if it continues",
      "Ask for a share of the payment",
      "Change the passenger's name in the PNR",
    ],
    1,
    "Document checks and DGR rules are not negotiable. Integrity protects the passenger, the airline and your licence. Refuse and escalate.",
    "SAPS code of conduct / security SOP",
    "m9-namefix",
  ),
);

/* ------------------------- AHM 1110 PAX pathway ------------------------- */

ACADEMY_QUESTIONS.push(...PAX_QUESTIONS);

/** Number of questions per track (used by the UI and tests). */
export function trackQuestionCount(track: AcademyTrack): number {
  return ACADEMY_QUESTIONS.filter((question) => question.track === track).length;
}

export function questionXp(question: AcademyQuestion): number {
  return question.difficulty === 1 ? 8 : question.difficulty === 2 ? 12 : 16;
}

export function findQuestion(id: string): AcademyQuestion | undefined {
  return ACADEMY_QUESTIONS.find((question) => question.id === id);
}

/** Stable, deterministic hash used to seed drills and the daily challenge. */
export function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const output = [...items];
  let state = seed >>> 0 || 1;
  for (let index = output.length - 1; index > 0; index--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return output;
}

/**
 * Build a drill. The same seed always produces the same questions, which keeps
 * the daily challenge reproducible and makes tests deterministic.
 */
export function pickDrill(
  track: AcademyTrack | "all" = "all",
  count = 10,
  seed = 1,
): AcademyQuestion[] {
  const pool = track === "all" ? ACADEMY_QUESTIONS : ACADEMY_QUESTIONS.filter((q) => q.track === track);
  return seededShuffle(pool, seed).slice(0, Math.max(0, Math.min(count, pool.length)));
}

/** A seed that changes once per calendar day (local time). */
export function dailySeed(date = new Date()): number {
  const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
  return hashString(key);
}

export function emptyAcademyStats(): AcademyStats {
  return {
    answered: [],
    correct: [],
    review: [],
    xp: 0,
    bestCombo: 0,
    drills: 0,
    lastPlayed: null,
  };
}

/** Questions queued for smart review, resolved against the live bank. */
export function reviewQuestions(stats: AcademyStats): AcademyQuestion[] {
  const queued = stats.review ?? [];
  return queued
    .map((id) => ACADEMY_QUESTIONS.find((question) => question.id === id))
    .filter((question): question is AcademyQuestion => Boolean(question));
}

export interface TrackProgress {
  track: AcademyTrack;
  total: number;
  answered: number;
  correct: number;
  /** Correct answers as a share of the whole track. */
  mastery: number;
  /** Accuracy across questions attempted in this track. */
  accuracy: number;
}

export function trackProgress(stats: AcademyStats, track: AcademyTrack): TrackProgress {
  const questions = ACADEMY_QUESTIONS.filter((question) => question.track === track);
  const ids = new Set(questions.map((question) => question.id));
  const answered = stats.answered.filter((id) => ids.has(id)).length;
  const correct = stats.correct.filter((id) => ids.has(id)).length;
  return {
    track,
    total: questions.length,
    answered,
    correct,
    mastery: questions.length === 0 ? 0 : Math.round((correct / questions.length) * 100),
    accuracy: answered === 0 ? 0 : Math.round((correct / answered) * 100),
  };
}

export function overallAccuracy(stats: AcademyStats): number {
  return stats.answered.length === 0
    ? 0
    : Math.round((stats.correct.length / stats.answered.length) * 100);
}

export const ACADEMY_BADGE_IDS = {
  dgr: "dgr-scholar",
  igom: "igom-ramp-pro",
  iata: "iata-ace",
  saps: "saps-professional",
  graduate: "academy-graduate",
  combo: "perfect-ten",
} as const;

/**
 * Badge rules are intentionally based on *correct* answers, not attempts, so
 * they reward mastery rather than grinding the same question.
 */
export function earnedAcademyBadges(stats: AcademyStats): string[] {
  const earned: string[] = [];
  if (trackProgress(stats, "DGR").correct >= 12) earned.push(ACADEMY_BADGE_IDS.dgr);
  if (trackProgress(stats, "IGOM").correct >= 12) earned.push(ACADEMY_BADGE_IDS.igom);
  if (trackProgress(stats, "IATA").correct >= 12) earned.push(ACADEMY_BADGE_IDS.iata);
  if (trackProgress(stats, "SAPS").correct >= 12) earned.push(ACADEMY_BADGE_IDS.saps);
  if (ACADEMY_TRACKS.every((track) => trackProgress(stats, track).correct >= 12)) {
    earned.push(ACADEMY_BADGE_IDS.graduate);
  }
  if (stats.bestCombo >= 10) earned.push(ACADEMY_BADGE_IDS.combo);
  return earned;
}

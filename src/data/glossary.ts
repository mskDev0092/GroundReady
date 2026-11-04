import type { GlossaryCategory, GlossaryTerm } from "@/lib/types";

/**
 * Jargon buster — every acronym and rule name a new traffic assistant hears on
 * day one, written in plain language with a real example from the counter.
 *
 * This is deliberately short and human. The DGR/IGOM manuals remain the
 * authority; the glossary exists so nobody is too shy to ask what a word means.
 */

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = ["DGR", "IGOM", "IATA", "SAPS", "DCS"];

export const GLOSSARY_CATEGORY_LABELS: Record<GlossaryCategory, string> = {
  DGR: "Dangerous Goods",
  IGOM: "Ramp & IGOM",
  IATA: "Passenger Rules",
  SAPS: "Local & Authority",
  DCS: "Altéa / DCS",
};

export const GLOSSARY: GlossaryTerm[] = [
  /* ---------------------------------- DGR ---------------------------------- */
  {
    id: "dgr",
    term: "DGR",
    expansion: "Dangerous Goods Regulations (IATA)",
    category: "DGR",
    plain:
      "The rulebook for anything on a plane that can catch fire, burn, poison, corrode, pressurise or harm people if it leaks.",
    example:
      "A can of paint is not 'just cargo' — it is UN 1263 Class 3, so the DGR decides how it is packed, labelled and loaded.",
    scenarioId: "m17-cargo-dgr",
  },
  {
    id: "un-number",
    term: "UN Number",
    expansion: "United Nations substance number",
    category: "DGR",
    plain:
      "A four-digit ID card for a dangerous substance. The same number is used worldwide, so a handler in Lahore and a handler in Dubai mean the same thing.",
    example: "UN 1845 is dry ice. UN 1263 is paint. UN 3480 is a lithium-ion battery.",
    scenarioId: "m3-dryice",
  },
  {
    id: "proper-shipping-name",
    term: "Proper Shipping Name",
    expansion: "PSN",
    category: "DGR",
    plain:
      "The exact official name of the dangerous good — not the brand name, not 'chemicals', not 'spare parts'.",
    example: "'PAINT' is acceptable; 'car paint samples' is not. The declaration must use the official PSN.",
    scenarioId: "m17-cargo-dgr",
  },
  {
    id: "packing-group",
    term: "Packing Group",
    expansion: "PG I / II / III",
    category: "DGR",
    plain:
      "How dangerous the substance is: PG I is most dangerous, PG III is least. It decides how strong the packaging must be.",
    example: "UN 1263 Paint in PG II needs packaging rated for medium danger — one grade above PG III.",
    scenarioId: "m17-cargo-dgr",
  },
  {
    id: "packing-instruction",
    term: "Packing Instruction",
    expansion: "PI (e.g. PI 366, PI 954)",
    category: "DGR",
    plain:
      "A numbered recipe for how a dangerous good must be packed: what inner packaging, what outer packaging, how much per package.",
    example: "PI 954 is the dry-ice instruction for passenger baggage.",
    scenarioId: "m3-dryice",
  },
  {
    id: "class-3",
    term: "Class 3",
    expansion: "Flammable liquid",
    category: "DGR",
    plain:
      "A liquid that gives off vapour which can catch fire. Paint, thinner, petrol, perfume and many cleaners are Class 3.",
    example: "A leaking drum of Class 3 paint must never be loaded — the vapour can ignite.",
    scenarioId: "m17-cargo-dgr",
  },
  {
    id: "class-8",
    term: "Class 8",
    expansion: "Corrosive",
    category: "DGR",
    plain:
      "A substance that burns skin and eats metal. Battery acid and some cleaning chemicals are Class 8.",
    example: "A Class 8 leak can damage the aircraft floor and injure the loader's hands.",
  },
  {
    id: "class-9",
    term: "Class 9",
    expansion: "Miscellaneous dangerous goods",
    category: "DGR",
    plain:
      "The 'other' dangerous goods class. Dry ice and lithium batteries both sit here.",
    example: "Dry ice is UN 1845, Class 9 — cold enough to injure skin and able to suffocate in a small space.",
    scenarioId: "m3-dryice",
  },
  {
    id: "watt-hour",
    term: "Watt-hour (Wh)",
    expansion: "Battery energy rating",
    category: "DGR",
    plain:
      "How much energy a battery holds. It is printed on the battery or device and decides whether it may fly.",
    example:
      "Up to 100Wh is allowed in the cabin; 100–160Wh needs airline approval; above 160Wh is forbidden on passenger flights.",
    scenarioId: "m6-lithium",
  },
  {
    id: "dry-ice",
    term: "Dry ice",
    expansion: "UN 1845, Class 9",
    category: "DGR",
    plain:
      "Frozen carbon dioxide. It is used to keep food cold but turns into gas, so packaging must let the gas escape.",
    example:
      "Checked baggage dry ice is normally limited to 2.5 kg per package, vented, with the CO₂ quantity recorded.",
    scenarioId: "m3-dryice",
  },
  {
    id: "notoc",
    term: "NOTOC",
    expansion: "Notification to the Captain",
    category: "DGR",
    plain:
      "The list given to the captain saying what dangerous goods are on board, where they are loaded and what to do if something goes wrong.",
    example: "If paint is loaded, the NOTOC must reach the flight deck before departure.",
    scenarioId: "m17-cargo-dgr",
  },
  {
    id: "shippers-declaration",
    term: "Shipper's Declaration",
    expansion: "DGD / Dangerous Goods Declaration",
    category: "DGR",
    plain:
      "The shipper's signed statement describing exactly what the dangerous goods are. Staff check it before accepting anything.",
    example:
      "It must show the UN number, proper shipping name, class, packing group, quantity and a monitored 24-hour emergency phone number.",
    scenarioId: "m17-cargo-dgr",
  },
  {
    id: "acceptance-checklist",
    term: "Acceptance Checklist",
    expansion: "DGR acceptance check",
    category: "DGR",
    plain:
      "A tick-box list the trained acceptance agent completes to prove the paperwork, labels, packaging and quantities were checked.",
    example: "Skipping the checklist 'because the customer is regular' is an integrity breach.",
    scenarioId: "m17-cargo-dgr",
  },
  {
    id: "hidden-dangerous-goods",
    term: "Hidden Dangerous Goods",
    expansion: "Undeclared dangerous goods",
    category: "DGR",
    plain:
      "Dangerous goods hiding inside ordinary-looking items — fuel left in a camping stove, aerosols in a suitcase, magnets in a parcel.",
    example: "Always ask what is inside a package; a vague 'machine parts' description is a warning sign.",
    scenarioId: "m17-cargo-dgr",
  },
  {
    id: "segregation",
    term: "Segregation",
    expansion: "Keeping incompatible goods apart",
    category: "DGR",
    plain:
      "Keeping dangerous goods that react badly to each other away from each other on the aircraft.",
    example: "Class 3 flammable liquid and Class 5.1 oxidizer must not be loaded side by side.",
    scenarioId: "m17-cargo-dgr",
  },

  /* ---------------------------------- IGOM --------------------------------- */
  {
    id: "igom",
    term: "IGOM",
    expansion: "IATA Ground Operations Manual",
    category: "IGOM",
    plain:
      "The industry manual for working safely on the ramp: how to turn an aircraft around, load it, fuel it and push it back.",
    example: "IGOM says a walk-around is required before every pushback — no exceptions for lateness.",
    scenarioId: "m18-igom-turnaround",
  },
  {
    id: "fod",
    term: "FOD",
    expansion: "Foreign Object Debris",
    category: "IGOM",
    plain:
      "Any loose object on the apron that could be sucked into an engine or cut a tyre — a bolt, a strap, a plastic bag.",
    example: "Pick it up, report it, bin it. FOD control is everyone's job, not the cleaner's.",
    scenarioId: "m18-igom-turnaround",
  },
  {
    id: "gse",
    term: "GSE",
    expansion: "Ground Support Equipment",
    category: "IGOM",
    plain:
      "The machines that serve the aircraft: tugs, baggage tractors, belt loaders, catering trucks, ground power units.",
    example: "GSE must be parked outside the engine danger zone and never left running unattended.",
    scenarioId: "m18-igom-turnaround",
  },
  {
    id: "engine-danger-zone",
    term: "Engine Danger Zone",
    expansion: "Jet blast / suction area",
    category: "IGOM",
    plain:
      "The marked area around a running engine where the suction or blast can kill you or throw equipment.",
    example: "Never walk behind a running engine, even for 'just a second'.",
    scenarioId: "m18-igom-turnaround",
  },
  {
    id: "turnaround",
    term: "Turnaround",
    expansion: "Aircraft ground handling cycle",
    category: "IGOM",
    plain:
      "Everything that happens between an aircraft arriving and departing again: deplaning, cleaning, fuelling, loading, boarding, pushback.",
    example: "A short-haul turnaround can be 35 minutes — the brief and critical path make it possible.",
    scenarioId: "m18-igom-turnaround",
  },
  {
    id: "lmc",
    term: "LMC",
    expansion: "Last-Minute Change",
    category: "IGOM",
    plain:
      "A formal message to load control when the actual load changes after the loadsheet was issued.",
    example: "One extra bag loaded late still needs an LMC and revised figures for the captain.",
    scenarioId: "m18-igom-turnaround",
  },
  {
    id: "loadsheet",
    term: "Loadsheet",
    expansion: "Aircraft weight and balance sheet",
    category: "IGOM",
    plain:
      "The document that tells the captain how heavy the aircraft is and how the weight is spread out.",
    example: "If the loadsheet says 118 bags and the ramp loaded 119, the aircraft cannot depart until it is corrected.",
    scenarioId: "m18-igom-turnaround",
  },
  {
    id: "wing-walker",
    term: "Wing Walker",
    expansion: "Pushback clearance observer",
    category: "IGOM",
    plain:
      "The person who walks beside the aircraft during pushback and watches that the wingtips and tail do not hit anything.",
    example: "The wing walker can stop the pushback instantly if clearance is lost.",
    scenarioId: "m18-igom-turnaround",
  },
  {
    id: "ppe",
    term: "PPE",
    expansion: "Personal Protective Equipment",
    category: "IGOM",
    plain:
      "The safety gear you wear: high-visibility vest, hearing protection, safety shoes, and gloves or eye protection where required.",
    example: "No vest, no entry to the apron — it is that simple.",
    scenarioId: "m18-igom-turnaround",
  },

  /* ---------------------------------- IATA --------------------------------- */
  {
    id: "timatic",
    term: "TIMATIC",
    expansion: "IATA travel document database",
    category: "IATA",
    plain:
      "The system that tells you what passport, visa, health and customs rules a passenger must meet for their destination.",
    example: "Always check TIMATIC instead of guessing — rules differ by nationality and destination.",
    scenarioId: "m3-dryice",
  },
  {
    id: "pnr",
    term: "PNR",
    expansion: "Passenger Name Record",
    category: "IATA",
    plain:
      "The booking file for a passenger. It holds their flights, ticket, seat, special requests and remarks.",
    example: "The PNR record locator might look like 9ZR2WN — every action must land on the right record.",
    scenarioId: "m1-zamzam",
  },
  {
    id: "ssr",
    term: "SSR",
    expansion: "Special Service Request",
    category: "IATA",
    plain:
      "A coded request for a service, such as a wheelchair, an unaccompanied minor, a medical case or a special meal.",
    example: "WCHR means wheelchair to the gate; MEDA means medical clearance is needed.",
    scenarioId: "m13-prm",
  },
  {
    id: "osi",
    term: "OSI",
    expansion: "Other Service Information",
    category: "IATA",
    plain:
      "Free-text information added to a booking for the airline. Unlike an SSR, it does not automatically trigger a service.",
    example: "Use OSI for a note like 'passenger travelling with a guide dog' when no SSR code fits.",
    scenarioId: "m12-umnr",
  },
  {
    id: "emd",
    term: "EMD",
    expansion: "Electronic Miscellaneous Document",
    category: "IATA",
    plain:
      "The electronic receipt for an extra airline service — excess baggage, a meal, a seat, a pet.",
    example: "Charge excess baggage correctly and issue the EMD; never take cash without a receipt.",
    scenarioId: "m2-excess",
  },
  {
    id: "awb",
    term: "AWB",
    expansion: "Air Waybill",
    category: "IATA",
    plain:
      "The shipping document for cargo. It is the cargo equivalent of a ticket and carries the consignment details.",
    example: "AWB 176-12345675 covers the four drums of paint in the cargo scenario.",
    scenarioId: "m17-cargo-dgr",
  },
  {
    id: "uld",
    term: "ULD",
    expansion: "Unit Load Device",
    category: "IATA",
    plain:
      "A cargo container or pallet that is loaded into the aircraft as one unit.",
    example: "Cargo is built onto ULDs before being loaded into the lower deck.",
    scenarioId: "m17-cargo-dgr",
  },
  {
    id: "prm",
    term: "PRM",
    expansion: "Passenger with Reduced Mobility",
    category: "IATA",
    plain:
      "A passenger who needs help moving through the airport or boarding the aircraft.",
    example: "A PRM may need a wheelchair, a lift or help up the aircraft steps.",
    scenarioId: "m13-prm",
  },
  {
    id: "umnr",
    term: "UMNR",
    expansion: "Unaccompanied Minor",
    category: "IATA",
    plain:
      "A child travelling alone. They must be handed from responsible adult to responsible adult at every stage.",
    example: "Never board a UMNR without a named adult receiving them at the destination.",
    scenarioId: "m12-umnr",
  },
  {
    id: "meda",
    term: "MEDA",
    expansion: "Medical Case",
    category: "IATA",
    plain:
      "A flag that a passenger has a medical condition needing airline medical clearance before travel.",
    example: "The airline's medical service decides whether oxygen, a stretcher or other equipment is approved.",
    scenarioId: "m14-meda",
  },
  {
    id: "idb",
    term: "IDB",
    expansion: "Involuntary Denied Boarding",
    category: "IATA",
    plain:
      "When a passenger is refused boarding because the flight is oversold, through no fault of their own.",
    example: "Ask for volunteers first, then apply the airline's priority rules and document every step.",
    scenarioId: "m10-idb",
  },
  {
    id: "irrops",
    term: "IRROPS",
    expansion: "Irregular Operations",
    category: "IATA",
    plain:
      "When flights do not go to plan — delays, cancellations, diversions, fog, technical faults.",
    example: "In IRROPS, look after safety, communication, rebooking and care in that order.",
    scenarioId: "m15-fog",
  },
  {
    id: "ssss",
    term: "SSSS",
    expansion: "Secondary Security Screening Selection",
    category: "IATA",
    plain:
      "A code on a boarding pass meaning the passenger needs extra security screening before boarding.",
    example: "Handle it calmly and discreetly — never announce the reason in public.",
    scenarioId: "m5-ssss",
  },

  /* ---------------------------------- SAPS --------------------------------- */
  {
    id: "saps",
    term: "SAPS",
    expansion: "Shaheen Airport Services",
    category: "SAPS",
    plain:
      "The ground-handling company at the station that checks passengers in, handles bags and coordinates the ramp.",
    example:
      "A traffic assistant is the link between the passenger at the counter and the aircraft on the stand.",
  },
  {
    id: "pcaa",
    term: "PCAA",
    expansion: "Pakistan Civil Aviation Authority",
    category: "SAPS",
    plain:
      "The national regulator for civil aviation safety and security in Pakistan.",
    example: "PCAA rules and the airline's manual sit above any local shortcut.",
  },
  {
    id: "asf",
    term: "ASF",
    expansion: "Airports Security Force",
    category: "SAPS",
    plain:
      "The force responsible for airport security: screening, access control and security response.",
    example: "If you suspect document fraud, escalate discreetly to ASF — do not confront the passenger publicly.",
    scenarioId: "m16-docfraud",
  },
  {
    id: "fia",
    term: "FIA",
    expansion: "Federal Investigation Agency (Immigration)",
    category: "SAPS",
    plain:
      "The agency that handles immigration checks and passport endorsement.",
    example: "Immigration clearance is FIA's authority; traffic staff follow the station handover procedure.",
    scenarioId: "m8-validity",
  },

  /* ----------------------------------- DCS ---------------------------------- */
  {
    id: "dcs",
    term: "DCS",
    expansion: "Departure Control System",
    category: "DCS",
    plain:
      "The computer system used to check in passengers, assign seats, record bags and close the flight.",
    example: "Altéa is the DCS used in these scenarios.",
    scenarioId: "m1-zamzam",
  },
  {
    id: "altea",
    term: "Altéa",
    expansion: "Amadeus Altéa Departure Control",
    category: "DCS",
    plain:
      "The check-in and boarding software where you type commands like PD, RT and BAG.",
    example: "RT/RAHMAN retrieves a passenger or cargo record by name.",
    scenarioId: "m1-zamzam",
  },
  {
    id: "padd",
    term: "PADD",
    expansion: "Passenger Add Remark",
    category: "DCS",
    plain:
      "The Altéa command that writes a permanent note into the booking so the next person can see what happened.",
    example: "PADD records a DGR refusal, a document-fraud escalation or a medical decision for the audit trail.",
    scenarioId: "m17-cargo-dgr",
  },
  {
    id: "std",
    term: "STD",
    expansion: "Scheduled Time of Departure",
    category: "DCS",
    plain:
      "The time the flight is scheduled to leave. Boarding and cargo cut-offs count backwards from it.",
    example: "If STD is 16:40, the ramp must finish loading and paperwork before pushback.",
    scenarioId: "m18-igom-turnaround",
  },
];

export function searchGlossary(
  query: string,
  category?: GlossaryCategory | "all",
): GlossaryTerm[] {
  const q = query.trim().toLowerCase();
  return GLOSSARY.filter((item) => {
    if (category && category !== "all" && item.category !== category) return false;
    if (!q) return true;
    return [item.term, item.expansion, item.plain, item.example].some((value) =>
      value.toLowerCase().includes(q),
    );
  });
}

/** Deterministic term of the day, stable for a calendar date. */
export function termOfTheDay(date = new Date()): GlossaryTerm {
  const index =
    (date.getFullYear() * 372 + (date.getMonth() + 1) * 31 + date.getDate()) % GLOSSARY.length;
  return GLOSSARY[index];
}

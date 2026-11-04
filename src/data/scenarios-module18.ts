import type { Scenario } from "@/lib/types";

/**
 * MODULE 18 — IATA IGOM Aircraft Turnaround
 * A 35-minute A320 turnaround with an engine-zone incursion, FOD, a late bag
 * and a final-loadsheet discrepancy.
 */
export const scenarioIgomTurnaround: Scenario = {
  id: "m18-igom-turnaround",
  moduleNo: 18,
  code: "M18-IGOM",
  title: "Thirty-Five Minutes",
  category: "ramp-ops",
  tags: ["IGOM", "Turnaround", "Ramp Safety", "FOD", "GSE", "Loadsheet", "NOTOC"],
  difficulty: 4,
  xpBase: 170,
  minutes: 15,
  summary:
    "A 35-minute A320 turnaround at Lahore: an engine-zone incursion, loose FOD, a late bag and a loadsheet that no longer matches the aircraft. Run the IGOM critical path.",
  briefing:
    "You are the SAPS turnaround coordinator at Lahore (LHE) for PK 305 LHE–KHI, 25 OCT, A320. Block time is 35 minutes. On arrival a baggage tractor is parked inside the engine danger zone, a catering strap is loose near the nose gear, and one late bag has been loaded after the loadsheet was issued. Boarding is already underway. Apply IATA IGOM safety-critical procedures, protect the turnaround, reconcile the load and dispatch a compliant aircraft.",
  objectives: [
    "Brief the team on FOD, PPE, engine danger zones, GSE parking and the critical path",
    "Stop and correct an engine-zone incursion and remove FOD before work continues",
    "Reconcile a late bag with load control through an LMC and a revised loadsheet",
    "Complete the departure sequence: doors, walk-around, headset, pushback clearance",
    "Record the turnaround events and safety report in Altéa",
  ],
  passenger: {
    name: "PK 305 Group — Turnaround Team",
    age: 0,
    nationality: "Pakistan",
    passportNo: "N/A — GROUND OPS",
    passportExpiry: "N/A",
    pnr: "PK305-25OCT",
    ticketNo: "N/A — OPS",
    flight: "PK 305",
    route: "LHE → KHI",
    date: "25 OCT",
    seat: "N/A — RAMP",
    fareClass: "N/A — TURNAROUND",
    allowance: "118 BAGS / 1,640 KG",
    originStation: "LHE — SAPS Ramp",
    avatarTone: "orange",
  },
  baggage: [
    {
      id: "hold",
      label: "A320 hold — 118 bags / 1,640 kg per loadsheet",
      weightKg: 1640,
      type: "checked",
      note: "Ramp reports 119 bags after a late bag was loaded",
    },
    {
      id: "late",
      label: "Late bag — accepted after loadsheet issue",
      weightKg: 18,
      type: "checked",
      tag: "LMC-LATE-1",
      note: "Requires LMC and revised loadsheet before dispatch",
    },
  ],
  documents: {
    passport: [
      { key: "flight", label: "Flight", value: "PK 305 LHE–KHI" },
      { key: "aircraft", label: "Aircraft", value: "A320 — AP-BLA" },
      { key: "stand", label: "Stand", value: "B12" },
    ],
    ticket: [
      { key: "std", label: "STD", value: "25 OCT 16:40" },
      { key: "turn", label: "Turnaround", value: "35 MINUTES" },
      { key: "loadsheet", label: "Loadsheet", value: "118 BAGS / 1,640 KG" },
      { key: "boarding", label: "Boarding", value: "IN PROGRESS" },
    ],
    extra: [
      {
        key: "engine",
        label: "Engine zone",
        value: "GSE PARKED INSIDE DANGER AREA",
        highlight: "bad",
      },
      {
        key: "fod",
        label: "FOD",
        value: "LOOSE STRAP NEAR NOSE GEAR",
        highlight: "bad",
      },
      {
        key: "load",
        label: "Load reconciliation",
        value: "119 BAGS VS 118 ON LOADSHEET",
        highlight: "warn",
      },
    ],
  },
  steps: [
    {
      type: "dialogue",
      id: "m18-d1",
      prompt: "Set the turnaround brief before the aircraft arrives.",
      passengerLines: [
        "Team, we have thirty-five minutes, the aircraft is on final, and boarding will start before the cleaners are off. Let us just get moving — no time for a long briefing.",
      ],
      options: [
        {
          id: "m18-d1-a",
          text: "Two minutes now saves the whole turnaround: FOD sweep, PPE and hi-vis, engine danger zones, GSE parking, headset comms and who owns each critical-path task. Then we start clean.",
          points: 10,
          feedback:
            "Correct IGOM discipline: a short, focused brief on hazards, roles and communication prevents the exact incursions that cost more time later.",
          consequence:
            "The team takes positions. The tug driver confirms the engine-zone boundary; the FOD walk begins.",
          best: true,
        },
        {
          id: "m18-d1-b",
          text: "Skip the briefing — everyone here has done hundreds of turnarounds.",
          points: 3,
          feedback:
            "Experience is not a substitute for a brief. Hazards and assignments change every turn, and complacency is a known accident precursor.",
          best: false,
        },
        {
          id: "m18-d1-c",
          text: "Brief only the new staff member; the experienced team already knows the plan.",
          points: 6,
          feedback:
            "Partial brief leaves experienced staff without the current stand plan and critical-path ownership. Everyone needs the same picture.",
          best: false,
        },
      ],
    },
    {
      type: "terminal",
      id: "m18-t1",
      prompt: "Record the flight, the loading change and the turnaround safety checks.",
      intro:
        "The aircraft is on stand. Pull the flight, retrieve the turnaround record, raise the late-bag LMC, enter the final bag figures and log the IGOM check.",
      commands: [
        {
          pattern: "^PD/LHEKHI/25OCT$",
          display: "PD/LHEKHI/25OCT",
          hint: "Flight display — pull up PK 305 LHE→KHI for 25 OCT.",
          output: [
            "FLIGHT: PK 305  LHE-KHI  EQP 320  STATUS: TURNAROUND",
            "STD 1640  GATE B12  BOARDING IN PROGRESS",
            "PAX 168  BAGS 118/1640KG  CREW 6",
          ],
          errorHint: "Format: PD/<origin><destination>/<DDMMM> — PD/LHEKHI/25OCT",
          points: 8,
        },
        {
          pattern: "^RT/305$",
          display: "RT/305",
          hint: "Retrieve the turnaround/load record for PK 305.",
          output: [
            "FLIGHT PK305/25OCT  A320 AP-BLA  STAND B12",
            "LOADSHEET 118 BAGS / 1640 KG  FINAL: NO",
            "TURNAROUND COORD: SAPS RAMP",
          ],
          errorHint: "Retrieve the flight record: RT/305",
          points: 8,
        },
        {
          pattern: "^LMC-1/BAGS118/LOADSHEETVERIFY$",
          display: "LMC-1/BAGS 118/LOADSHEET VERIFY",
          hint: "Raise the last-minute change for the late bag and loadsheet verification.",
          output: [
            "LMC SENT TO LOAD CONTROL",
            "PK305 25OCT  BAG COUNT CHANGE 118 → 119  REVISED LOADSHEET REQUIRED",
          ],
          errorHint: "Format: LMC-1/BAGS 118/LOADSHEET VERIFY",
          points: 8,
        },
        {
          pattern: "^BAG/119/1658$",
          display: "BAG/119/1658",
          hint: "Enter the reconciled bag count and weight: 119 bags, 1,658 kg.",
          output: [
            "BAG RECONCILIATION ACCEPTED",
            "119 BAGS / 1658 KG  LATE BAG INCLUDED",
          ],
          errorHint: "Format: BAG/<pieces>/<weight> — BAG/119/1658",
          points: 8,
        },
        {
          pattern: "^PADD-IGOM.*$",
          display: "PADD-IGOM FOD CHECK/ENGINE ZONE CLEAR/NOTOC CONFIRMED",
          hint: "Log the IGOM safety checks and NOTOC confirmation.",
          output: [
            "OK REMARK ADDED TO PK305/25OCT",
            "FOD CHECK COMPLETE · ENGINE ZONE CLEAR · NOTOC CONFIRMED",
          ],
          errorHint:
            "Start with PADD-IGOM and record the FOD check, engine-zone clearance and NOTOC.",
          points: 8,
        },
      ],
    },
    {
      type: "decision",
      id: "m18-d2",
      prompt: "An engine-zone incursion and FOD appear during the offload.",
      situation:
        "A baggage tractor is parked inside the marked engine danger zone with its driver chatting. A loose catering strap lies near the nose gear. The beacon is on and the offload is in progress.",
      options: [
        {
          id: "m18-d2-a",
          text: "Stop the operation, clear the danger zone and remove the FOD, brief the driver, record the unsafe act and only then restart the offload.",
          points: 22,
          feedback:
            "Correct IGOM safety response: stop, make safe, remove the hazard, brief and report. Production pressure never overrides an engine-zone incursion.",
          consequence:
            "The driver moves the tractor, the strap goes to the FOD bin, and the supervisor logs the near-miss.",
          best: true,
        },
        {
          id: "m18-d2-b",
          text: "Tell the driver to move later and finish the offload first — stopping costs too much time.",
          points: 8,
          feedback:
            "Wrong: an engine-zone incursion is a life-critical hazard. The task stops until the zone is clear.",
          best: false,
        },
        {
          id: "m18-d2-c",
          text: "Move the strap yourself and continue — no need to stop the whole turnaround for one strap.",
          points: 16,
          feedback:
            "Removing the strap is good, but the engine-zone incursion still requires a stop, a driver brief and a report.",
          best: false,
        },
      ],
    },
    {
      type: "decision",
      id: "m18-d3",
      prompt: "The loadsheet no longer matches the aircraft.",
      situation:
        "The loadsheet shows 118 bags / 1,640 kg. The ramp reports 119 bags because a late bag was loaded after the sheet was issued. Boarding is halfway and the captain is asking for final figures.",
      options: [
        {
          id: "m18-d3-a",
          text: "Hold the final loadsheet, tell load control, raise the LMC, reconcile the extra bag, issue revised figures to the captain and then continue boarding.",
          points: 16,
          feedback:
            "Correct: the captain must fly the actual load. An LMC and revised loadsheet close the gap before dispatch.",
          consequence:
            "Load control reissues the sheet at 119 bags / 1,658 kg. The captain acknowledges the revision.",
          best: true,
        },
        {
          id: "m18-d3-b",
          text: "One bag is close enough — let it go and tell the captain after departure.",
          points: 6,
          feedback:
            "Wrong: an unreconciled load is a performance and trim risk. The captain needs correct figures before departure, not after.",
          best: false,
        },
        {
          id: "m18-d3-c",
          text: "Offload a random bag to make the count match the original loadsheet.",
          points: 10,
          feedback:
            "Never remove a passenger's bag arbitrarily or falsify the count. Reconcile the actual load through the proper LMC process.",
          best: false,
        },
      ],
    },
    {
      type: "dialogue",
      id: "m18-d4",
      prompt: "Departure pressure: the tug is connected and someone wants to skip the walk-around.",
      passengerLines: [
        "Doors are closed, loadsheet is signed, tug is on. We are two minutes late — skip the walk-around and let us push. The previous shift already looked at the aircraft.",
      ],
      options: [
        {
          id: "m18-d4-a",
          text: "No shortcut on departure: complete the walk-around, confirm doors, chocks and GSE are clear, establish headset comms and take pushback clearance. Two minutes is cheaper than a damaged aircraft.",
          points: 12,
          feedback:
            "Correct: the departure walk-around and headset communication are safety-critical. A previous shift's check does not cover the current configuration.",
          consequence:
            "The walk-around finds a catering door not fully latched. It is secured, then pushback proceeds on time.",
          best: true,
        },
        {
          id: "m18-d4-b",
          text: "Skip it — the previous shift already checked the aircraft and the tug driver is waiting.",
          points: 4,
          feedback:
            "The aircraft configuration changed during the turnaround. A walk-around is required before pushback, every time.",
          best: false,
        },
        {
          id: "m18-d4-c",
          text: "Do a quick look from the tug cab and push — that counts as a walk-around.",
          points: 8,
          feedback:
            "A look from the cab is not a walk-around. You cannot see the far side, the doors, the gear area or the GSE clearances.",
          best: false,
        },
      ],
    },
  ],
  debriefRules: [
    {
      source: "IATA IGOM Ed. 2026, 4.1",
      ref: "Ramp turnaround procedure",
      detail:
        "The turnaround is a planned sequence from arrival and securing the aircraft through deplaning, servicing, loading and boarding. The brief assigns roles and hazards before work starts.",
    },
    {
      source: "IATA IGOM Ed. 2026, 3.1.2",
      ref: "Engine danger areas and jet blast",
      detail:
        "Never enter a marked engine danger area while an engine is running or about to start. GSE must be parked outside the danger zone and the area kept clear.",
    },
    {
      source: "IATA IGOM Ed. 2026, 4.5",
      ref: "Aircraft loading and last-minute changes",
      detail:
        "The loadsheet must match the actual load. Any change after issue requires an LMC to load control and revised figures to the captain before departure.",
    },
    {
      source: "IATA IGOM Ed. 2026, 4.7",
      ref: "Aircraft departure",
      detail:
        "Departure includes door checks, the walk-around, GSE clearance, headset communication and pushback clearance. No step is optional under time pressure.",
    },
    {
      source: "IATA IGOM Ed. 2026, 3.1",
      ref: "FOD, GSE and personal protective equipment",
      detail:
        "FOD is removed and reported by everyone. GSE is operated only by trained staff, secured when unattended and parked clear of the aircraft.",
    },
  ],
  checklist: [
    "Brief the team: FOD, PPE, engine zones, GSE parking, roles and critical path",
    "Confirm chocks, cones and ground power before servicing",
    "Sweep the stand for FOD and remove/report it",
    "Keep all GSE outside the engine danger zone",
    "Use headset communication for pushback/towing",
    "Check every bag against the loadsheet; reconcile late bags",
    "Raise an LMC for any change after the loadsheet is issued",
    "Give the captain the revised final figures before departure",
    "Confirm the NOTOC if dangerous goods are on board",
    "Complete the departure walk-around: doors, gear area, GSE, panels",
    "Close doors, confirm headset comms and obtain pushback clearance",
    "Report every incursion, near-miss and damage through the safety system",
  ],
  badgeId: "igom-turnaround",
};

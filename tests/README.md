# Test suite

Automated checks for the AltéaMaster scenario engine, gamified Knowledge Gym,
content and progression.

## Run

```bash
bun test                 # everything
bun run test:scenarios   # all 18 scenarios only
bun run test:watch       # watch mode
bun run validate         # legacy catalogue validator
```

## What is covered

| File | Purpose |
| --- | --- |
| `scenarios.test.ts` | Catalogue integrity + 8 checks for every scenario: metadata, passenger/baggage/documents, unique IDs, exactly one best option, terminal command acceptance, 100-point ceiling, machine-played perfect run. |
| `progression.test.ts` | Plays all 18 scenarios perfectly in order, verifies sequential unlocking, every scenario badge, streak and XP totals. |
| `scoring.test.ts` | Accuracy, badge threshold (90%), speed bonus threshold (60% / par time), XP maths and clamping. |
| `altea.test.ts` | Command normalisation/matching, sequence detection, suggestions, attempts/hint penalties, autocomplete. |
| `store.test.ts` | Persisted Zustand progress: best score/time, attempts, XP cap, badge duplication, reset. |
| `gamification.test.ts` | Level boundaries, XP cap and badge registry integrity. |
| `academy.test.ts` | Knowledge Gym question-bank integrity, deterministic drills, daily seed, track mastery, academy badges and store XP/combo behaviour. |
| `helpers/` | Shared perfect-run simulator, in-memory `localStorage` and step scoring helpers. |

## Guarantees

- A perfect run of every scenario must total exactly **100 points**, report
  **100% accuracy**, use no hints, record no mistakes, and unlock that module's
  badge.
- Every Knowledge Gym question has four options, one valid answer, a full
  explanation, a source reference and an optional link to a real scenario.
- The 18-scenario campaign now spans **24 badges** and seven levels, from
  Trainee T/A to Station Manager.

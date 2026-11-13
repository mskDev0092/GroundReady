# Test suite

Automated checks for the GroundReady scenario engine, gamified Knowledge Gym,
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
| `academy.test.ts` | Knowledge Gym question-bank integrity, deterministic drills, daily seed, track mastery, academy badges, smart-review queue and store XP/combo behaviour. |
| `pax.test.ts` | IATA AHM 1110 pathway integrity: 14 modules, dedicated and mapped question sets, scenario links, mastery threshold, pathway progress and next-step logic. |
| `glossary.test.ts` | Jargon-buster integrity: unique terms, plain-language meanings, category coverage, search and deterministic term of the day. |
| `helpers/` | Shared perfect-run simulator, in-memory `localStorage` and step scoring helpers. |

## Guarantees

- A perfect run of every scenario must total exactly **100 points**, report
  **100% accuracy**, use no hints, record no mistakes, and unlock that module's
  badge.
- Every Knowledge Gym question has four options, one valid answer, a full
  explanation, a source reference and an optional link to a real scenario.
- Every AHM 1110 pathway module has dedicated questions, mapped gym questions,
  at least three key rules, a valid track and scenario links; module mastery
  drives the pathway's next step.
- Every glossary term has a plain-language meaning, a shift example, a valid
  category and optional scenario link; search is deterministic.
- The 18-scenario campaign and Knowledge Gym now share **25 badges** and seven
  levels, from Trainee T/A to Station Manager.

## Beginner aids

- **Guided Coach Mode** (on by default) highlights the strongest dialogue and
  decision option, and can type a pending Altéa command for the trainee at a
  point penalty.
- **Jargon Buster** explains 40+ aviation terms in plain English, with
  read-aloud support and links into practice scenarios.
- **Read aloud** uses the browser speech API for gym questions, explanations,
  briefing text and glossary terms.
- **Smart Review** queues every missed gym question until it is answered
  correctly, so weak spots resurface automatically.
- **First-run tour** walks a complete beginner through the three ways to learn
  and drops them into a guided shift, a 10-question drill or the glossary.

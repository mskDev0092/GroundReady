# GroundReady

GroundReady is a browser-based training simulator for airport passenger and
ground-operations staff. Practice check-in decisions, baggage and document
checks, dangerous-goods awareness, aircraft turnarounds, and Altéa-style
terminal workflows in a guided, gamified environment.

> **Training aid only.** GroundReady is not an airline, airport, regulator, or
> official source of operational guidance. Procedures and regulations change;
> always follow your employer's current procedures and authoritative sources.
> Do not use the simulator to make live operational decisions.

## Deployment

After GitHub Pages is enabled and the first workflow run succeeds, the site is
available at
[mskdev0092.github.io/GroundReady](https://mskdev0092.github.io/GroundReady/).

## What you can do

- Play 18 scenario-based training modules with a simulated passenger dialogue
  and terminal workflow.
- Practise decision-making with guided coach mode, hints, scoring, and
  immediate explanations.
- Build knowledge with short quizzes, smart review, a glossary, and read-aloud
  support.
- Track experience, badges, streaks, and scenario progress.
- Use light or dark theme and adjust sound and coaching preferences.

Progress and preferences are stored in the browser's local storage. There are
no accounts or server-side sync; progress is specific to the browser and device
you use. Clearing site data or changing browsers can erase or separate
progress.

## Run locally

Requirements: [Bun](https://bun.sh/) 1.3+ and Node.js 20.9+.

```sh
git clone https://github.com/mskDev0092/GroundReady.git
cd GroundReady
bun install --frozen-lockfile
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks and builds

```sh
bun test                 # complete test suite
bun run test:scenarios   # scenario-specific tests
bun run validate         # validate the scenario catalogue
bun run lint             # ESLint
bun run build            # standalone production build
bun run build:pages      # static export for this GitHub Pages project
```

The Pages build writes a static site to `out/` and uses `/GroundReady` as its
base path. The default production build remains a Next.js standalone build.

## Deploy with GitHub Pages

The workflow in
[`.github/workflows/nextjs.yml`](./.github/workflows/nextjs.yml) is the
GitHub-provided Next.js Pages workflow. It installs dependencies with
`npm ci`, builds the static site, and deploys it whenever changes are pushed to
`main` (or when manually run). It uses Node.js 22 and derives the Pages base
path (for example `/GroundReady`) from `actions/configure-pages`, so the site
keeps working if the repository is renamed.

1. Push the repository to GitHub.
2. In **Settings → Pages**, set **Build and deployment → Source** to **GitHub
   Actions**.
3. Open the **Actions** tab and allow the first workflow run to finish.
4. Visit <https://mskdev0092.github.io/GroundReady/>.

The workflow needs the repository's standard `GITHUB_TOKEN` with Pages write
and OIDC permissions; no deployment secrets are required. Keep
`package.json` and `package-lock.json` in sync when dependencies change, because
the workflow uses `npm ci`.

## Project layout

- `src/app/` — Next.js application shell and route handlers.
- `src/components/trainee/` — training views and simulator UI.
- `src/data/` — scenario, academy, glossary, and gamification content.
- `src/lib/` — scoring, terminal command, sound, and shared utilities.
- `tests/` — scenario, scoring, progression, academy, and state tests.

## License

This project is released under the [MIT License](./LICENSE).

# Code and No Code Solutions

Company website for Code and No Code Solutions, a unit of Mercury Sols. A desktop first,
3D galaxy experience: the page opens on a welcome screen, and scrolling flies through a galaxy
to meet the team (the lead first, with a crown), then the services, delivered work and contact.

Speed is the primary requirement. The first screen is real HTML that paints before any
JavaScript runs; the 3D scene loads afterwards and never blocks it.

## How it works

```
index.html (prerendered at build time: all text, team and projects are real HTML)
   |
   +--> React hydrates the page            initial bundle, budget 90 KB gzip
   |       header, sections, team navigator
   |
   +--> when the browser is idle, and only with WebGL2 and motion allowed:
           lazy 3D chunk (three.js + React Three Fiber)
           one-draw-call starfield, member stars, scroll-driven camera
```

1. **Prerender.** `npm run build` builds the client, builds a server copy of the app, and
   `scripts/prerender.ts` writes the rendered HTML into `dist/index.html`.
2. **Hydrate.** `src/entry-client.tsx` attaches React to that HTML instead of re-rendering it.
3. **Galaxy.** `src/app/GalaxyLayer.tsx` checks the device after hydration, waits for idle, then
   loads `src/scene/`. Reduced motion, no WebGL2, or any 3D error leaves the static backdrop
   and the complete HTML site.
4. **Scroll sync.** Sections marked with `scrollStopProps` (`src/shared/scrollStops.ts`) are
   camera stops. The camera flies between keyframes in `src/scene/galaxyLayout.ts`, one per stop.

## Project layout

| Path                           | Contents                                                            |
| ------------------------------ | ------------------------------------------------------------------- |
| `src/content/`                 | All copy as typed data: brand, team, services, projects             |
| `src/sections/`                | Page sections: Hero, Team, Services, Work, Contact                  |
| `src/ui/`                      | Shared parts: header, headings, chips, crown icon                   |
| `src/app/`                     | App shell, footer, galaxy loader, capability checks, error boundary |
| `src/scene/`                   | The 3D galaxy (lazy chunk only)                                     |
| `src/shared/`                  | The scroll stop contract used by both sections and scene            |
| `scripts/`                     | Prerender, JS budget check, image conversion                        |
| `images/`, `project-pictures/` | Source photos (never served)                                        |
| `public/images/`               | Optimised WebP files actually served                                |

## Editing content

- **Team, services, projects:** edit the arrays in `src/content/`. The first team member is the
  lead. Adding a member adds their card, navigator dot and star automatically.
- **Images:** put the source in `images/` (team) or `project-pictures/` (projects), then run
  `./scripts/optimize-images.sh` (needs ImageMagick 7) and commit `public/images/`. A new team
  photo also needs its file name mapped in that script and its size set in `src/content/team.ts`.

## Setup

Requires Node 24.

```bash
npm ci
npm run dev        # http://localhost:5173
```

## Scripts

| Script                            | Purpose                                                                                             |
| --------------------------------- | --------------------------------------------------------------------------------------------------- |
| `npm run dev`                     | Development server                                                                                  |
| `npm run typecheck`               | Strict TypeScript check                                                                             |
| `npm run lint`                    | ESLint (strict, type-aware)                                                                         |
| `npm run format` / `format:check` | Prettier                                                                                            |
| `npm test`                        | Unit tests (Vitest)                                                                                 |
| `npm run build`                   | Type check, client build, server build, prerender                                                   |
| `npm run check:budget`            | Fails if initial JavaScript exceeds 90 KB gzip (run after build)                                    |
| `npm run preview`                 | Serve the production build on port 4173                                                             |
| `npm run test:e2e`                | Playwright tests against the preview (run after build; first run `npx playwright install chromium`) |

## Environment variables

None. The site is fully static and holds no secrets.

## Deployment

Vercel, configured by `vercel.json`: build command, output directory, security headers (strict
Content Security Policy) and cache rules. Import the GitHub repository in Vercel; every pull
request gets a preview URL and `main` deploys to production. CI (`.github/workflows/ci.yml`)
runs formatting, lint, unit tests, build, the JS budget and the e2e tests on every pull request.

## Fonts

Space Grotesk, self-hosted from `public/fonts/` under the SIL Open Font License
(`public/fonts/space-grotesk-OFL.txt`).

# Fall ’26 semester tracker

Sahil’s Binghamton semester dashboard, with a live countdown to December 17, 2026 at 11:00 AM Eastern, remaining class days and hours, and a calendar of classes and finals.

[Open the live tracker](https://t4ll4t.github.io/fall-2026-tracker/)

## Experience

- Days, hours, minutes, seconds, and total hours until departure.
- Weekly and monthly calendars with university breaks, schedule substitutions, and syllabus exceptions.
- MGMT 411, MIS 445, and ACCT 212 assessments, with finals kept separate from regular attendance counts.
- A 3D sculpture of 42 real class dates that unfolds into a grid as you scroll.
- Course panels with subtle depth and final-exam cards that unfold from a stack.
- Motion pause, reduced-motion support, keyboard navigation, and static fallbacks.

The interface uses HTML, CSS, JavaScript, GSAP, and Three.js. Fonts and runtime libraries are served locally. No build step or runtime API key is required.

## Run locally

Serve the `dist` folder:

```sh
python3 -m http.server 4178 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4178/.

## Tests

With the local server running in another terminal:

```sh
npm ci
npx playwright install
npm run test:model
npm test
```

The suite includes seven date-model tests and 51 browser checks across Chromium, Firefox, and WebKit. It covers calendars, time zones, countdowns, responsive layouts, accessibility, scroll transitions, keyboard access, and rendering fallbacks.

## Saved design

The approved design before the additional course and finals animations is preserved by the tag [`approved-card-sculpture-2026-09-21`](https://github.com/t4ll4t/fall-2026-tracker/tree/approved-card-sculpture-2026-09-21). See [CHECKPOINTS.md](CHECKPOINTS.md) for its exact source and saved Site version.

[DESIGN.md](DESIGN.md) documents the visual direction, calendar sources, and academic rules. Calendar changes from instructors are not automatically synced.

## Hosting

The primary website is hosted on GitHub Pages. Changes to `dist/` pushed to `main` are automatically published by `.github/workflows/pages.yml`. You can also run that workflow manually from GitHub Actions.

The earlier [Sites deployment](https://sahil-fall-2026.t4ll4t.chatgpt.site/) remains separate. `.openai/hosting.json` identifies that deployment; GitHub pushes do not update it.

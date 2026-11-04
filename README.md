# lewis-fowler.co.uk

Portfolio site. React 19 and TypeScript, built with Vite.

## Run it

```sh
npm ci
npm run dev       # http://localhost:5173
npm run build     # type check, then build into dist/
npm run preview   # serve the built site
```

## Where things are

| Path | What it holds |
| --- | --- |
| `src/content/` | All site text and project data. Edit here to change what the site says. |
| `src/pages/` | Home, project and experience pages. |
| `src/components/` | Header, footer, theme switch, frames and the 3D model viewer. |
| `src/styles/global.css` | Design tokens (dark and light) and all styles. |
| `public/` | Files served as they are: models, icons, diagrams, `CNAME`. |

Pages use hash URLs (`#work/<id>`, `#experience/<slug>`), so links from the old site still work.

## Engineering deep dives

A project page has two parts: the overview (the text in `src/content/projects.ts`) and an
optional engineering deep dive below it.

- Deep dive content: `src/content/deepDives/<project>.ts`, listed in `src/content/deepDives/index.ts`.
- Each deep dive is a list of dated stages. Each stage has a status (`done`, `current` or
  `planned`) and a list of blocks: `text`, `list`, `table`, `decisions`, `problems`,
  `checklist`, `gallery`, `steps`, `warning`, `bom`, `downloads` and `code`.
  Use only the blocks a project needs. Types are in `src/content/caseStudyTypes.ts`.
- Images go in `public/assets/...`. Every image needs an `alt` and a `caption`. Set
  `diagram: true` for drawings so they get a white backing. Tap an image to see it full size.
- `npm run build` stops if any `/assets/...` or `/downloads/...` path in `src/` does not exist.

## Build it yourself guides

- Guides live in `src/content/guides/` and open at `#build/<id>`.
- A guide is a draft until Lewis approves it. Drafts are in the `DRAFTS` list in
  `src/content/guides/index.ts`. They show only with `npm run dev`, with a banner that lists
  what is missing. The production build leaves them out completely.
- To publish: set `published: true`, set `verified: true` only if the whole build was tested on
  that hardware version, and move the guide to `PUBLISHED`. The project page then shows a
  "Build it yourself" button.
- Put downloadable files in `public/downloads/<project>/` with a version in the file name.
- Never put passwords, API keys or private configuration in a guide or a download.

## Adding a React Bits component

[React Bits](https://reactbits.dev) components are copied into the project. Pick the
"TS + CSS" variant, put it in `src/components/bits/`, and install the packages that
component lists (for example `motion` or `gsap`) with an exact version:

```sh
npm install --save-exact motion@<version>
```

Keep effects few. Respect `prefers-reduced-motion`.

## Deploy

`.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages on every push to
`main`. In the repository settings, Pages > Build and deployment > Source must be
"GitHub Actions".

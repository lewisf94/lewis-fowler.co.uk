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

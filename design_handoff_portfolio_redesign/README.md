# Handoff: Lewis Fowler Portfolio Redesign

## Overview
A full redesign of the personal portfolio site at lewis-fowler.co.uk. The site showcases Lewis's work as a Design Engineer, covering thermal management, CFD analysis, robotics projects, and career timeline. This redesign improves visual polish, consistency, and overall professionalism over the original.

## About the Design Files
The files in this bundle are **design references created in HTML** — high-fidelity prototypes showing intended look, typography, spacing, and interactive behaviour. They are not production code to be shipped directly.

The task is to **recreate these designs in the existing `lewis-fowler.co.uk` repository** (currently a single `index.html` using React + Babel + Tailwind). The existing repo can be kept as-is or migrated to a proper build pipeline (e.g. Vite + React) — the design reference is framework-agnostic.

## Fidelity
**High-fidelity.** The prototype is pixel-precise with final colours, typography, spacing, and interactions. Recreate the UI as close as possible to what is shown, using the design tokens documented below.

---

## Design Tokens

### Colours
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#f4efe6` | Page background, warm off-white |
| `--bg2` | `#ece6db` | Card / section backgrounds |
| `--bg3` | `rgba(184,50,50,.06)` | Subtle hover tints |
| `--bg4` | `#e8e1d4` | Code block backgrounds |
| `--fg` | `#1a1208` | Primary text, near-black warm |
| `--fg2` | `#6b5e52` | Secondary / muted text |
| `--fg3` | `rgba(26,18,8,.3)` | Placeholder / hint text |
| `--accent` | `#b83232` | Engineering red — all interactive elements |
| `--border` | `rgba(26,18,8,.12)` | Visible borders |
| `--border2` | `rgba(26,18,8,.06)` | Subtle dividers |
| `--grid` | `rgba(26,18,8,.04)` | Hero background grid lines |
| `--glow` | `rgba(184,50,50,.09)` | Mouse-follow radial glow on hero |
| `--skill-a` | `#b83232` | Physics pill colour — Software skills |
| `--skill-b` | `#16a34a` | Physics pill colour — Mechanical skills |
| `--skill-c` | `#1e3a5f` | Physics pill colour — Embedded skills |

### Typography
| Role | Font | Weights | Notes |
|---|---|---|---|
| Headings (`--fh`) | DM Serif Display | 400 (regular) | Hero h1, section titles, project titles, timeline titles |
| Body (`--fb`) | DM Sans | 300, 400, 500, 700 | Body copy, nav links, descriptions |
| Mono (`--fm`) | Fira Code | 400, 500 | Labels, eyebrows, badges, code blocks, nav links |

Google Fonts import:
```
https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700&family=DM+Serif+Display&family=Fira+Code:wght@400;500&display=swap
```

### Spacing & Geometry
| Token | Value |
|---|---|
| `--r` (border-radius) | `1px` — nearly square, very minimal rounding |
| `--sh` (box-shadow) | `0 2px 20px rgba(26,18,8,.08)` |
| Section padding | `120px 0` top/bottom, `52px` horizontal |
| Nav padding | `22px 52px` |
| Max content width | `1200px` centred |

---

## Sections / Views

### 1. Navigation Bar
Fixed to top. Transparent initially, gains `backdrop-filter: blur(16px)` + subtle border bottom on scroll (`scrollY > 50`).

**Left:** Logo image (`assets/icons/logo-red.png`, 28×28px) + wordmark "Lewis **Fowler**" in DM Serif Display 17px/700. "Fowler" in `--accent`. Word-spacing: `-3px` to tighten the gap slightly.

**Centre:** Three nav links — "Work", "Skills", "Experience" — in Fira Code 12px, uppercase, `letter-spacing: .08em`, colour `--fg2`, hover → `--accent`.

**Right:** Empty / no CTA (removed theme switcher).

On scroll, background becomes `color-mix(in srgb, #f4efe6 82%, transparent)` with blur.

---

### 2. Hero
Full viewport (`100vh`). Warm off-white background.

**Background:**
- SVG grid: `linear-gradient` lines at 52px × 52px intervals in `--grid` colour
- Grid is masked with `radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)` so it fades at edges
- Mouse-tracking radial glow: 560×560px circle, `background: radial-gradient(circle, rgba(184,50,50,.09) 0%, transparent 70%)`, positioned at cursor, opacity 0 → 1 on mouseenter, 0 on mouseleave

**Left content (`max-width: 900px`, `padding: 0 52px`, `padding-top: 80px`):**
- Eyebrow: `"Design Engineer @ Boyd"` — Fira Code 11px, uppercase, `letter-spacing: .16em`, `--accent` colour, preceded by a 36px line in `--accent`
- H1: `"Lewis Fowler"` — DM Serif Display, `clamp(56px, 9vw, 120px)`, weight 700, `letter-spacing: -0.04em`, `line-height: 0.95`, `--fg`
- Bio paragraph: DM Sans 17px, `line-height: 1.65`, `--fg2`, `max-width: 480px`
- CTA row: "View Work" (primary button → `#work`) + "Experience" (ghost button → `#experience`)

**Right stats column** (absolute, right 52px, bottom 52px, flex column gap 32px, text-align right):
- `4+` / "Years Experience"
- `2` / "Industries"  
- `MEng` / "Glasgow"
- Number: DM Serif Display 36px/700, `letter-spacing: -0.04em`
- Label: Fira Code 10px, uppercase, `--fg2`

**Decorative elements:**
- Top-right: 100×100px bordered square with crosshairs (1px `--accent` borders, 20% opacity)
- Bottom-left: `"NEWCASTLE UPON TYNE · EST. 2018"` in Fira Code 10px, `--accent`, 35% opacity

**Scroll cue** (bottom-left, above decoration text): Animated 48px horizontal line (left-to-right scale pulse, 2.4s) + "Scroll" label.

---

### 3. Projects
`id="work"`. Section padding. Full-bleed 2-column grid (gap: 2px, background `--border2`).

Each **Project Card**:
- Background `--bg`, hover → `--bg2`
- Left-side 3px accent bar animates `scaleY(0 → 1)` on hover (transform-origin: bottom)
- Badge: Fira Code 10px, uppercase, `--accent`, bordered pill
- Striped placeholder (repeating-linear-gradient 135° for where 3D model goes) — 180px tall
- Title: DM Serif Display 22px/700
- Short description: DM Sans 14px, `--fg2`
- Tag pills: Fira Code 10px, `--fg2`, `--bg3` background
- Arrow `↗` appears bottom-right on hover

**Project Modal** (click to open):
- Overlay: `rgba(0,0,0,.65)` + `backdrop-filter: blur(10px)`
- Modal: `max-width: 740px`, `max-height: 88vh`, scrollable, padding 52px, `--bg2` background
- Contains: tag, title, short desc, striped placeholder (220px), then labelled sections: Overview, Technical Approach, Key Equation (monospace code block), Challenge & Solution, tag pills
- Close button top-right

**Projects:**
1. **Self-Balancing Robot** — Robotics, Control Theory, 3D Printing, ROS 2
2. **Robotic Arm** — Robotics, MATLAB, Mechanical Design
3. **ESP32 SONOS Remote** — IoT, PCB Design, SolidWorks, C++
4. **ConvoyLink** — RF, ESP32, React Native

---

### 4. Skills (Physics Simulation)
`id="skills"`. Uses **Matter.js** (`0.19.0`) for a 2D rigid-body physics sim.

460px tall full-width canvas (no horizontal padding). Each skill is a pill-shaped body that falls from above and stacks up. The user can drag them with the mouse.

**Pill styling** (rendered on canvas via `afterRender` event):
- Rounded rect with `chamfer: { radius: 8 }`
- Background fill: category colour at 16% opacity (`color + '28'`)
- Border stroke: category colour at 50% opacity (`color + '80'`)
- Label: Fira Code 500 12px, `--fg` colour, centred

**Category colours:**
- Software: `#b83232`
- Mechanical: `#16a34a`
- Embedded: `#1e3a5f`

**Skills list:**
- Software: SolidWorks, Fusion 360, CFD / Fluent, MATLAB, Python
- Embedded: C++, Arduino, ROS 2
- Mechanical: Fabrication, 3D Printing

---

### 5. Experience (Timeline)
`id="experience"`. Vertical timeline using CSS grid: `180px | 1px | 1fr` columns, `column-gap: 36px`.

Each item:
- **Date** (right-aligned, Fira Code 11px, `--fg2`)
- **Line** (1px `--border2`, full height), with a 9×9px filled dot (`--accent`) at top
- **Content**: place label (Fira Code 10px, uppercase, `--accent`) → title (DM Serif Display 20px/600) → description (DM Sans 14px, `--fg2`, `line-height: 1.75`)

**4 entries:**
1. Boyd — Design Engineer — Jan 2025 – Present
2. ROSEN (UK) — Data Engineer — Sep 2023 – Dec 2024
3. Rolls-Royce — External Placement — May 2022 – Jan 2023
4. University of Glasgow — MEng Mechanical Engineering — 2018 – 2023

---

### 6. Contact
`id="contact"`. Section with intro text on left, CTA links on right, then a 2×2 info grid below.

**Top row** (2-column grid, gap 48px, align-items end):
- Left: Large heading `"Let's work together."` (DM Serif Display, `clamp(40px, 6vw, 72px)`, `line-height: 1`) + sub paragraph about availability
- Right (aligned flex-end): Three stacked buttons — primary email button + two ghost buttons for LinkedIn and GitHub. Min-width 220px each.

**Info grid** (2-column, gap 2px, `--border2` background):
- "Currently" / "Design Engineer @ Boyd"
- "Location" / "Newcastle upon Tyne, UK"
- "Availability" / "Open to freelance projects" — **this cell has `--accent` red background with `--bg` text** (inverted)
- "Response time" / "Within 48 hours"

---

### 7. Footer
Simple row: wordmark left, three links centre, copy right. Border-top `--border2`. Padding 40px 52px.

---

## Interactions & Behaviour

| Interaction | Detail |
|---|---|
| Nav scroll | `scrollY > 50` → add `.scrolled` class → frosted glass background |
| Hero mouse glow | `mousemove` updates glow position via `style.left/top`. `mouseleave` → `opacity: 0` |
| Project card hover | Background tint + left accent bar scaleY + arrow appears |
| Project modal | Click card → fade+slideUp modal. Click overlay or close button → dismiss. `overflow: hidden` on `body` while open |
| Skills physics | Matter.js engine + runner. Bodies fall on mount. Mouse drag via `MouseConstraint`. Re-initialises if theme changes (not applicable now theme is locked) |
| Scroll cue line | CSS `scaleX` keyframe animation, `transform-origin: left`, 2.4s infinite |
| Buttons | Primary: `opacity .85 + translateY(-2px)` on hover. Ghost: `border-color` + `color` to `--accent` on hover |

---

## Assets

| File | Usage |
|---|---|
| `assets/icons/logo-red.png` | Nav logo — 192×192px PNG, original logo recoloured to solid `#b83232` |

The original logo files (`favicon-192x192.png`, `logo.svg`) are from the existing repo. The recoloured version (`logo-red.png`) was generated programmatically by replacing all non-white opaque pixels with `#b83232`.

---

## Buttons

### Primary Button (`.btn-p`)
- Background: `--accent` (`#b83232`)
- Text: `--bg` (cream)
- Font: Fira Code 12px, uppercase, `letter-spacing: .1em`, weight 600
- Padding: `15px 36px`
- Border-radius: `1px`
- Hover: `opacity .85 + translateY(-2px)`

### Ghost Button (`.btn-g`)
- Background: transparent
- Text: `--fg`
- Border: `1px solid --border`
- Same font/padding as primary
- Hover: border → `--accent`, text → `--accent`

---

## Files in This Bundle

| File | Description |
|---|---|
| `Portfolio Redesign.html` | Full hi-fi interactive prototype — single self-contained HTML file |
| `assets/icons/logo-red.png` | Recoloured logo (solid red, 192×192px) |
| `README.md` | This document |

## Implementation Notes

1. The prototype uses **React 18 + Babel (in-browser transpilation)** purely for convenience. In the real codebase, the same component structure should be rebuilt using whatever build setup exists or is chosen.

2. The **Matter.js physics** in the Skills section works well as-is. The CDN version (`0.19.0`) can be NPM-installed instead: `npm install matter-js`.

3. The **3D model viewer** (Three.js GLB viewer from the original site) was replaced with striped placeholder divs in the prototype. When implementing, restore the Three.js viewer inside project modals, referencing the `.glb` files already in `assets/models/`.

4. The **hero grid + glow** is pure CSS + minimal JS (one `mousemove` listener updating inline styles). No library needed.

5. **Responsive breakpoints**: below 900px — nav links hide, two-column layouts collapse to single column, horizontal padding reduces to 24px.

6. **Contact email**: Replace `lewis@lewis-fowler.co.uk` with the real email address before deploying.

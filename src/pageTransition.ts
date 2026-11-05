import { flushSync } from "react-dom";
import type { Route } from "./router";

/*
 * Page changes use the View Transitions API. When the reader taps a project or
 * experience entry, the new page grows out of that entry's box until it fills the
 * screen. Going back shrinks the page into the same entry. Browsers without the
 * API, and readers who ask for reduced motion, get an instant change.
 */

const DURATION = 420;
const EASING = "cubic-bezier(0.2, 0, 0, 1)";
const CLICK_WINDOW_MS = 1000;

let lastClick: { box: Element; at: number } | null = null;

/** The box that a tapped link grows out of: its list row, or the link itself. */
function boxFor(link: HTMLAnchorElement): Element | null {
  return link.closest(".project-row, .timeline > li, .project-nav-link");
}

document.addEventListener(
  "click",
  (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = (e.target as Element | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
    const box = link && boxFor(link);
    lastClick = box ? { box, at: performance.now() } : null;
  },
  true,
);

function takeClickedBox(): Element | null {
  const click = lastClick;
  lastClick = null;
  if (!click || performance.now() - click.at > CLICK_WINDOW_MS || !click.box.isConnected) return null;
  return click.box;
}

/** On the home page, the entry for the page the reader is leaving. */
export function entryOnHome(from: Route): Element | null {
  let link: Element | null = null;
  if (from.page === "project") link = document.querySelector(`.project-body[href="#work/${from.id}"]`);
  if (from.page === "experience") link = document.querySelector(`.timeline a[href="#experience/${from.slug}"]`);
  return link?.closest(".project-row, .timeline > li") ?? null;
}

/** The clip that shows only the given box, in viewport terms. */
function clipFor(box: Element): string | null {
  const r = box.getBoundingClientRect();
  const w = window.innerWidth;
  const h = window.innerHeight;
  // A box that is off screen gives no useful starting shape.
  if (r.bottom <= 0 || r.top >= h || r.width === 0) return null;
  const top = Math.max(0, r.top);
  const bottom = Math.max(0, h - r.bottom);
  const left = Math.max(0, r.left);
  const right = Math.max(0, w - r.right);
  return `inset(${top}px ${right}px ${bottom}px ${left}px)`;
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Applies a route change, with the page transition when one fits. */
export function changeRoute(from: Route, to: Route, apply: () => void) {
  const pageChanged = from.page !== to.page || JSON.stringify(from) !== JSON.stringify(to);
  const samePageSection = from.page === "home" && to.page === "home";
  const clicked = takeClickedBox();

  if (!document.startViewTransition || reducedMotion() || !pageChanged || samePageSection) {
    apply();
    return;
  }

  const root = document.documentElement;
  const opening = clicked ? clipFor(clicked) : null;
  const closing = to.page === "home" && from.page !== "home";
  root.classList.add(opening ? "vt-open" : closing ? "vt-close" : "vt-fade");

  const transition = document.startViewTransition(() => flushSync(apply));

  transition.ready
    .then(() => {
      if (opening) {
        root.animate(
          { clipPath: [opening, "inset(0px 0px 0px 0px)"] },
          { duration: DURATION, easing: EASING, pseudoElement: "::view-transition-new(root)" },
        );
        return;
      }
      if (closing) {
        const entry = entryOnHome(from);
        const target = entry && clipFor(entry);
        // With no entry on screen to shrink into, the old page only fades.
        const keyframes = target
          ? [
              { clipPath: "inset(0px 0px 0px 0px)", opacity: 1 },
              { opacity: 1, offset: 0.7 },
              { clipPath: target, opacity: 0 },
            ]
          : [{ opacity: 1 }, { opacity: 0 }];
        root.animate(keyframes, {
          duration: target ? DURATION : 250,
          easing: EASING,
          pseudoElement: "::view-transition-old(root)",
        });
      }
    })
    .catch(() => {});

  transition.finished.finally(() => root.classList.remove("vt-open", "vt-close", "vt-fade"));
}

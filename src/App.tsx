import { useLayoutEffect, useRef } from "react";
import { useRoute } from "./router";
import { projects } from "./content/projects";
import { experience } from "./content/experience";
import { Home } from "./pages/Home";
import { ProjectPage } from "./pages/ProjectPage";
import { ExperiencePage } from "./pages/ExperiencePage";
import { GuidePage } from "./pages/GuidePage";
import { guides } from "./content/guides";
import { SiteHeader, SiteFooter } from "./components/SiteChrome";
import { entryOnHome } from "./pageTransition";
import type { Route } from "./router";

const SCROLL_KEY = "scroll-position";
let firstRoute = true;

// The browser's own restore runs before the page has its full height, and then the
// URL's #section takes over, so a refresh landed in a different place each time.
history.scrollRestoration = "manual";
window.addEventListener("pagehide", () => {
  try {
    sessionStorage.setItem(SCROLL_KEY, JSON.stringify({ hash: location.hash, y: window.scrollY }));
  } catch {}
});

function restoreScroll(): boolean {
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (nav?.type !== "reload") return false;
  let saved: { hash: string; y: number } | null = null;
  try {
    saved = JSON.parse(sessionStorage.getItem(SCROLL_KEY) ?? "null");
  } catch {}
  if (!saved || saved.hash !== location.hash) return false;
  const y = saved.y;
  const jump = () => window.scrollTo({ top: y, behavior: "instant" });
  jump();
  // Fonts and images change the page height, so jump again once they are in.
  document.fonts?.ready.then(jump);
  if (document.readyState !== "complete") window.addEventListener("load", jump, { once: true });
  return true;
}

export function App() {
  const route = useRoute();
  const lastRoute = useRef<Route | null>(null);

  // A layout effect places the new page before the browser paints it, so the
  // reader never sees the old scroll position or a scroll to the top.
  useLayoutEffect(() => {
    const previous = lastRoute.current;
    lastRoute.current = route;
    if (firstRoute) {
      firstRoute = false;
      // On a refresh, go back to where the reader was, not to the section in the URL.
      if (restoreScroll()) return;
    }
    if (route.page !== "home") {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    // A link to a section on the page that is already open scrolls smoothly.
    // Arriving from another page jumps straight to the section.
    const fromOtherPage = previous?.page !== "home";
    // Coming back from a project or role to its list, show the entry the reader opened.
    const backToList =
      (previous?.page === "project" && route.section === "work") ||
      (previous?.page === "experience" && route.section === "experience");
    const entry = backToList && previous ? entryOnHome(previous) : null;
    if (entry) {
      const top = entry.getBoundingClientRect().top + window.scrollY - window.innerHeight / 3;
      window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
      return;
    }
    const target = route.section ? document.getElementById(route.section) : null;
    if (target) target.scrollIntoView({ behavior: fromOtherPage ? "instant" : "smooth" });
    else if (fromOtherPage) window.scrollTo({ top: 0, behavior: "instant" });
  }, [route]);

  let body = <Home />;
  if (route.page === "project") {
    const project = projects.find((p) => p.id === route.id);
    if (project) body = <ProjectPage project={project} />;
  } else if (route.page === "experience") {
    const item = experience.find((e) => e.slug === route.slug);
    if (item) body = <ExperiencePage item={item} />;
  } else if (route.page === "guide") {
    const guide = guides.find((g) => g.id === route.id);
    const project = guide && projects.find((p) => p.id === guide.projectId);
    if (guide && project) body = <GuidePage guide={guide} project={project} />;
  }

  return (
    <>
      <SiteHeader />
      <main>{body}</main>
      <SiteFooter />
    </>
  );
}

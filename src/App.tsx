import { useEffect } from "react";
import { useRoute } from "./router";
import { projects } from "./content/projects";
import { experience } from "./content/experience";
import { Home } from "./pages/Home";
import { ProjectPage } from "./pages/ProjectPage";
import { ExperiencePage } from "./pages/ExperiencePage";
import { SiteHeader, SiteFooter } from "./components/SiteChrome";

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

  useEffect(() => {
    if (firstRoute) {
      firstRoute = false;
      // On a refresh, go back to where the reader was, not to the section in the URL.
      if (restoreScroll()) return;
    }
    if (route.page !== "home") {
      window.scrollTo(0, 0);
      return;
    }
    if (route.section) document.getElementById(route.section)?.scrollIntoView();
  }, [route]);

  let body = <Home />;
  if (route.page === "project") {
    const project = projects.find((p) => p.id === route.id);
    if (project) body = <ProjectPage project={project} />;
  } else if (route.page === "experience") {
    const item = experience.find((e) => e.slug === route.slug);
    if (item) body = <ExperiencePage item={item} />;
  }

  return (
    <>
      <SiteHeader />
      <main>{body}</main>
      <SiteFooter />
    </>
  );
}

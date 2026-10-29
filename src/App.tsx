import { useEffect } from "react";
import { useRoute } from "./router";
import { projects } from "./content/projects";
import { experience } from "./content/experience";
import { Home } from "./pages/Home";
import { ProjectPage } from "./pages/ProjectPage";
import { ExperiencePage } from "./pages/ExperiencePage";
import { SiteHeader, SiteFooter } from "./components/SiteChrome";

export function App() {
  const route = useRoute();

  useEffect(() => {
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

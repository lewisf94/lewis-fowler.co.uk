import { useEffect, useState } from "react";

/** Routes keep the previous site's hash URLs, so old links still work. */
export type Route =
  | { page: "home"; section?: string }
  | { page: "project"; id: string }
  | { page: "experience"; slug: string };

export function parseHash(hash: string): Route {
  const [first, second] = hash.replace(/^#\/?/, "").split("/");
  if (first === "work" && second) return { page: "project", id: second };
  if (first === "experience" && second) return { page: "experience", slug: second };
  return { page: "home", section: first || undefined };
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

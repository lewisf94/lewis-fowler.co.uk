import { useState } from "react";

type Theme = "dark" | "light";

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/** Dark is the default look. The choice is saved per browser. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  const choose = (next: Theme) => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be blocked (private mode). The theme still applies for this visit.
    }
    setTheme(next);
  };

  return (
    <div className="theme-toggle" role="group" aria-label="Colour theme">
      {(["dark", "light"] as const).map((t) => (
        <button key={t} type="button" aria-pressed={theme === t} onClick={() => choose(t)}>
          {t === "dark" ? "Dark" : "Light"}
        </button>
      ))}
    </div>
  );
}

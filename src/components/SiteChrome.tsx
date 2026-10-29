import { profile } from "../content/profile";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <a className="site-name mono" href="#">
          Lewis<span className="dim">.</span>Fowler
        </a>
        <nav aria-label="Main" className="site-nav">
          {NAV.map((n) => (
            <a key={n.href} className="mono" href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <p className="display footer-name">{profile.name}</p>
        <p className="mono dim">
          {profile.role} · {profile.location}
        </p>
        <p className="footer-links">
          <a className="mono" href={profile.github} target="_blank" rel="noopener">
            GitHub ↗
          </a>
          <a className="mono" href={profile.linkedin} target="_blank" rel="noopener">
            LinkedIn ↗
          </a>
          <a className="mono" href={`mailto:${profile.email}`}>
            Email ↗
          </a>
        </p>
      </div>
    </footer>
  );
}
